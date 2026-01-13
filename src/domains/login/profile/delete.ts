/**
 * login profile delete - Delete a profile
 */

import type { CommandDefinition } from "../../registry.js";
import { errorResult } from "../../registry.js";
import { getProfileManager } from "../../../profile/index.js";

export const deleteCommand: CommandDefinition = {
	name: "delete",
	description:
		"Delete a saved connection profile permanently. For active profiles, you'll be guided through selecting a replacement profile before deletion. All deletions require typing 'yes' to confirm.",
	descriptionShort: "Delete a saved profile with confirmation",
	descriptionMedium:
		"Remove a profile permanently with interactive confirmation and profile switching.",
	usage: "<name>",
	aliases: ["rm", "remove"],

	async execute(args, _session) {
		const manager = getProfileManager();

		// Parse arguments
		const name = args.find((arg) => !arg.startsWith("-"));

		if (!name) {
			return errorResult("Usage: login profile delete <name>");
		}

		try {
			// Check if profile exists
			const profile = await manager.get(name);
			if (!profile) {
				return errorResult(`Profile '${name}' not found.`);
			}

			// Check if it's the active profile
			const activeProfile = await manager.getActive();
			const isActive = profile.name === activeProfile;

			// Trigger interactive deletion wizard
			return {
				output: [],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
				enterProfileDeleteMode: true,
				profileDeleteConfig: {
					profileName: name,
					isActive: isActive,
				},
			};
		} catch (error) {
			return errorResult(
				`Failed to initiate profile deletion: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
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
