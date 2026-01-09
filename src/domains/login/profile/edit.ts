/**
 * login profile edit - Edit profile configuration in EDITOR
 */

import { spawnSync } from "child_process";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import type { CommandDefinition } from "../../registry.js";
import { successResult, errorResult } from "../../registry.js";
import { getProfileManager } from "../../../profile/index.js";
import type { Profile } from "../../../profile/types.js";
import {
	formatConnectionTable,
	buildConnectionInfo,
} from "./connection-table.js";

/**
 * Get the user's preferred editor
 */
function getEditor(): string {
	return process.env.EDITOR || process.env.VISUAL || "vi";
}

/**
 * Open a file in the user's editor and wait for it to close
 * Uses spawnSync to block the entire process, allowing the editor
 * to have full control of the terminal (avoiding Ink conflicts)
 */
function openInEditor(filePath: string): void {
	const editor = getEditor();

	// Use spawnSync to block the entire Node process
	// This allows the editor to have full terminal control
	// without conflicts from Ink's terminal management
	const result = spawnSync(editor, [filePath], {
		stdio: "inherit",
		shell: true,
	});

	if (result.error) {
		throw new Error(
			`Failed to launch editor '${editor}': ${result.error.message}`,
		);
	}

	if (result.status !== 0) {
		throw new Error(`Editor exited with code ${result.status}`);
	}
}

/**
 * Create a temporary file with profile content
 */
async function createTempFile(profile: Profile): Promise<string> {
	const tempDir = tmpdir();
	const tempFile = join(
		tempDir,
		`xcsh-profile-${profile.name}-${Date.now()}.json`,
	);

	// Format profile as JSON with helpful comments
	const content = JSON.stringify(
		{
			name: profile.name,
			apiUrl: profile.apiUrl,
			apiToken: profile.apiToken || "",
			defaultNamespace: profile.defaultNamespace || "",
			// Include optional fields only if they exist
			...(profile.p12Bundle ? { p12Bundle: profile.p12Bundle } : {}),
			...(profile.cert ? { cert: profile.cert } : {}),
			...(profile.key ? { key: profile.key } : {}),
		},
		null,
		2,
	);

	await fs.writeFile(tempFile, content, { mode: 0o600 });
	return tempFile;
}

/**
 * Parse and validate edited profile
 */
async function parseEditedProfile(
	filePath: string,
	originalName: string,
): Promise<{ profile: Profile | null; error: string | null }> {
	try {
		const content = await fs.readFile(filePath, "utf-8");
		const parsed = JSON.parse(content) as Record<string, unknown>;

		// Validate required fields
		if (!parsed.name || typeof parsed.name !== "string") {
			return { profile: null, error: "Profile name is required" };
		}

		if (!parsed.apiUrl || typeof parsed.apiUrl !== "string") {
			return { profile: null, error: "API URL is required" };
		}

		// Check if name changed (not allowed in edit)
		if (parsed.name !== originalName) {
			return {
				profile: null,
				error: `Cannot change profile name from '${originalName}' to '${parsed.name}'. Use 'login profile create' to create a new profile instead.`,
			};
		}

		// Build profile object
		const profile: Profile = {
			name: parsed.name,
			apiUrl: parsed.apiUrl,
		};

		// Add optional fields if present and non-empty
		if (
			parsed.apiToken &&
			typeof parsed.apiToken === "string" &&
			parsed.apiToken.trim()
		) {
			profile.apiToken = parsed.apiToken.trim();
		}

		if (
			parsed.defaultNamespace &&
			typeof parsed.defaultNamespace === "string" &&
			parsed.defaultNamespace.trim()
		) {
			profile.defaultNamespace = parsed.defaultNamespace.trim();
		}

		if (
			parsed.p12Bundle &&
			typeof parsed.p12Bundle === "string" &&
			parsed.p12Bundle.trim()
		) {
			profile.p12Bundle = parsed.p12Bundle.trim();
		}

		if (
			parsed.cert &&
			typeof parsed.cert === "string" &&
			parsed.cert.trim()
		) {
			profile.cert = parsed.cert.trim();
		}

		if (parsed.key && typeof parsed.key === "string" && parsed.key.trim()) {
			profile.key = parsed.key.trim();
		}

		return { profile, error: null };
	} catch (error) {
		if (error instanceof SyntaxError) {
			return { profile: null, error: `Invalid JSON: ${error.message}` };
		}
		return {
			profile: null,
			error: `Failed to read edited file: ${error instanceof Error ? error.message : "Unknown error"}`,
		};
	}
}

/**
 * Clean up temporary file
 */
async function cleanupTempFile(filePath: string): Promise<void> {
	try {
		await fs.unlink(filePath);
	} catch {
		// Ignore cleanup errors
	}
}

export const editCommand: CommandDefinition = {
	name: "edit",
	description:
		"Edit a profile configuration using your preferred text editor ($EDITOR). Opens the profile in JSON format for modification. After saving, the profile is validated and updated. If editing the active profile, the session is automatically refreshed with the new settings.",
	descriptionShort: "Edit profile in $EDITOR",
	descriptionMedium:
		"Open a profile in your text editor for modification, then validate and save changes.",
	usage: "[name]",
	aliases: ["modify", "vi"],

	async execute(args, session) {
		const manager = getProfileManager();
		let profileName = args[0];

		// If no name provided, use active profile
		if (!profileName) {
			const active = await manager.getActive();
			if (!active) {
				return errorResult(
					"No profile specified and no active profile set.\n" +
						"Usage: login profile edit <name>",
				);
			}
			profileName = active;
		}

		// Load existing profile
		const existingProfile = await manager.get(profileName);
		if (!existingProfile) {
			return errorResult(
				`Profile '${profileName}' not found.\n` +
					"Use 'login profile list' to see available profiles.",
			);
		}

		// Check if terminal is interactive
		if (!process.stdin.isTTY) {
			return errorResult(
				"Edit command requires an interactive terminal.\n" +
					"Use 'login profile show <name>' to view profile details.",
			);
		}

		let tempFile: string | null = null;

		try {
			// Create temp file with profile content
			tempFile = await createTempFile(existingProfile);

			// Get file stats before editing
			const statsBefore = await fs.stat(tempFile);

			// Open in editor
			const editor = getEditor();
			const output: string[] = [
				`Opening profile '${profileName}' in ${editor}...`,
			];

			openInEditor(tempFile);

			// Get file stats after editing
			const statsAfter = await fs.stat(tempFile);

			// Check if file was modified
			if (statsBefore.mtimeMs === statsAfter.mtimeMs) {
				output.push("", "No changes made.");
				return successResult(output);
			}

			// Parse and validate edited profile
			const { profile: editedProfile, error } = await parseEditedProfile(
				tempFile,
				profileName,
			);

			if (error || !editedProfile) {
				return errorResult(`Validation failed: ${error}`);
			}

			// Save updated profile
			const saveResult = await manager.save(editedProfile);

			if (!saveResult.success) {
				return errorResult(
					`Failed to save profile: ${saveResult.message}`,
				);
			}

			output.push("", `Profile '${profileName}' updated successfully.`);

			// Check if this is the active profile
			const activeProfileName = await manager.getActive();
			const isActive = profileName === activeProfileName;

			if (isActive) {
				// Re-activate to refresh session with new settings
				const success = await session.switchProfile(profileName);

				if (success) {
					output.push("", "Session refreshed with updated settings.");

					// Build connection info for display
					const profile = session.getActiveProfile();
					const connectionInfo = buildConnectionInfo(
						profileName,
						profile?.apiUrl || "",
						!!profile?.apiToken,
						profile?.defaultNamespace || session.getNamespace(),
						session.isAuthenticated(),
						session.isTokenValidated(),
						session.getValidationError() ?? undefined,
					);

					// Format and add connection table
					const tableLines = formatConnectionTable(connectionInfo);
					output.push("", ...tableLines);

					return successResult(output, true); // contextChanged
				}
			}

			return successResult(output);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : String(error);
			return errorResult(`Edit failed: ${message}`);
		} finally {
			// Clean up temp file
			if (tempFile) {
				await cleanupTempFile(tempFile);
			}
		}
	},

	async completion(partial, _args, _session) {
		const manager = getProfileManager();
		const profiles = await manager.list();
		return profiles
			.map((p) => p.name)
			.filter((name) =>
				name.toLowerCase().startsWith(partial.toLowerCase()),
			);
	},
};
