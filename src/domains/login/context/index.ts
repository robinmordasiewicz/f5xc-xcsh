/**
 * Context Subcommand Group - Manage default namespace context for API operations
 *
 * Similar to kubectl config use-context, this manages the default namespace
 * that will be used for API operations when no namespace is explicitly specified.
 */

import type { CommandDefinition, SubcommandGroup } from "../../registry.js";
import { successResult, errorResult } from "../../registry.js";
import { ENV_PREFIX } from "../../../branding/index.js";
import type { REPLSession } from "../../../repl/session.js";

/**
 * Show command - Display current default namespace
 */
const showCommand: CommandDefinition = {
	name: "show",
	description: "Show current default namespace context",
	usage: "",
	aliases: ["current", "get"],

	async execute(_args, session) {
		const namespace = session.getNamespace();
		const source = determineNamespaceSource(namespace);

		const lines: string[] = [
			`Current namespace: ${namespace}`,
			`Source: ${source}`,
		];

		return successResult(lines);
	},
};

/**
 * Determine where the namespace value came from
 */
function determineNamespaceSource(namespace: string): string {
	const envNamespace = process.env[`${ENV_PREFIX}_NAMESPACE`];

	if (envNamespace && envNamespace === namespace) {
		return `environment variable (${ENV_PREFIX}_NAMESPACE)`;
	}

	if (namespace === "default") {
		return "default value";
	}

	return "session configuration";
}

/**
 * Set command - Change default namespace
 */
const setCommand: CommandDefinition = {
	name: "set",
	description: "Set default namespace context for API operations",
	usage: "<namespace>",
	aliases: ["use", "switch"],

	async execute(args, session) {
		const namespace = args[0];

		if (!namespace) {
			return errorResult("Usage: login context set <namespace>");
		}

		// Validate namespace format (alphanumeric, dash, underscore)
		if (!/^[a-zA-Z0-9_-]+$/.test(namespace)) {
			return errorResult(
				"Invalid namespace. Use alphanumeric characters, dashes, and underscores only.",
			);
		}

		const previousNamespace = session.getNamespace();
		session.setNamespace(namespace);

		const lines: string[] = [`Namespace context changed.`];
		if (previousNamespace !== namespace) {
			lines.push(`  Previous: ${previousNamespace}`);
			lines.push(`  Current:  ${namespace}`);
		} else {
			lines.push(`  Namespace remains: ${namespace}`);
		}

		return successResult(lines, true); // contextChanged = true to update prompt
	},

	async completion(partial: string, _args: string[], session: REPLSession) {
		// Fetch namespaces from API if available
		const client = session.getAPIClient();
		if (client?.isAuthenticated()) {
			try {
				const response = await client.get<{
					items?: Array<{ name?: string }>;
				}>("/api/web/namespaces");
				if (response.ok && response.data?.items) {
					const namespaces = response.data.items
						.map((item) => item.name)
						.filter((name): name is string => !!name);
					return namespaces.filter((ns) =>
						ns.toLowerCase().startsWith(partial.toLowerCase()),
					);
				}
			} catch {
				// Fall back to defaults on error
			}
		}
		// Return common namespace patterns as fallback
		const suggestions = ["default", "system", "shared"];
		return suggestions.filter((ns) => ns.startsWith(partial));
	},
};

/**
 * List command - Show available namespaces
 */
const listCommand: CommandDefinition = {
	name: "list",
	description: "List available namespaces",
	usage: "",
	aliases: ["ls"],

	async execute(_args, session) {
		const currentNamespace = session.getNamespace();

		// Check if we have API connection
		if (!session.isConnected()) {
			return errorResult(
				"Not connected to F5 XC API. Use 'login profile use <profile>' to connect.",
			);
		}

		// Check if authenticated
		const client = session.getAPIClient();
		if (!client?.isAuthenticated()) {
			return errorResult(
				"Not authenticated. Configure a profile with API token.",
			);
		}

		// Fetch namespaces from API
		try {
			const response = await client.get<{
				items?: Array<{ name?: string }>;
			}>("/api/web/namespaces");

			if (!response.ok || !response.data?.items) {
				return errorResult("Failed to fetch namespaces from API.");
			}

			const namespaces = response.data.items
				.map((item) => item.name)
				.filter((name): name is string => !!name)
				.sort();

			const lines: string[] = ["Available namespaces:", ""];
			for (const ns of namespaces) {
				if (ns === currentNamespace) {
					lines.push(`  ${ns} (current)`);
				} else {
					lines.push(`  ${ns}`);
				}
			}
			lines.push("");
			lines.push("Use 'login context set <namespace>' to switch.");

			return successResult(lines);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : String(error);
			return errorResult(`Failed to list namespaces: ${message}`);
		}
	},
};

/**
 * Context subcommand group
 */
export const contextSubcommands: SubcommandGroup = {
	name: "context",
	description: "Manage default namespace context for API operations",
	commands: new Map([
		["show", showCommand],
		["set", setCommand],
		["list", listCommand],
	]),
};
