/**
 * Flag Filtering Utilities
 *
 * Utilities for extracting used flags from arguments and filtering
 * completion suggestions to exclude already-used flags.
 */

import { FLAG_ALIAS_LOOKUP } from "./flag-aliases.js";

/**
 * Extract all used flags from args array, expanding aliases
 *
 * Handles multiple flag patterns:
 * - `--flag value` pattern
 * - `--flag=value` pattern
 * - Boolean flags without values
 *
 * @param args - Array of command arguments
 * @returns Set of all used flags including their aliases
 *
 * @example
 * extractUsedFlags(["--url", "https://..."]) // Returns Set {"--url", "-u"}
 * extractUsedFlags(["--output=json"]) // Returns Set {"--output", "-o"}
 * extractUsedFlags(["-ns", "default"]) // Returns Set {"--namespace", "-ns"}
 */
export function extractUsedFlags(args: string[]): Set<string> {
	const usedFlags = new Set<string>();

	for (const arg of args) {
		// Handle --flag=value pattern - extract just the flag part
		let flagPart = arg;
		if (arg.includes("=")) {
			flagPart = arg.split("=")[0] ?? arg;
		}

		// Only process arguments that start with "-"
		if (!flagPart.startsWith("-")) {
			continue;
		}

		// Add the flag itself
		usedFlags.add(flagPart);

		// Add all aliases of this flag
		const aliases = FLAG_ALIAS_LOOKUP.get(flagPart);
		if (aliases) {
			for (const alias of aliases) {
				usedFlags.add(alias);
			}
		}
	}

	return usedFlags;
}

/**
 * Filter suggestions to exclude already-used flags
 *
 * @param suggestions - Array of completion suggestions
 * @param usedFlags - Set of flags that have already been used
 * @returns Filtered array excluding used flags
 *
 * @example
 * const suggestions = [{text: "--url"}, {text: "--token"}];
 * const used = new Set(["--url", "-u"]);
 * filterUsedFlags(suggestions, used); // Returns [{text: "--token"}]
 */
export function filterUsedFlags<T extends { text: string }>(
	suggestions: T[],
	usedFlags: Set<string>,
): T[] {
	return suggestions.filter((s) => !usedFlags.has(s.text));
}

/**
 * Extract used flags from args and filter string array of flag names
 * Convenience function for simpler completion handlers
 *
 * @param flags - Array of flag name strings
 * @param args - Array of command arguments
 * @returns Filtered array of flag names excluding used ones
 *
 * @example
 * filterUsedFlagsFromStrings(["--url", "--token"], ["--url", "https://..."]);
 * // Returns ["--token"]
 */
export function filterUsedFlagsFromStrings(
	flags: string[],
	args: string[],
): string[] {
	const usedFlags = extractUsedFlags(args);
	return flags.filter((flag) => !usedFlags.has(flag));
}
