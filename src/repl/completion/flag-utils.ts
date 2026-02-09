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

/**
 * Count how many times each flag appears in args
 * Used for repeatable flags with maxOccurrences limit
 *
 * Handles multiple flag patterns:
 * - `--flag value` pattern
 * - `--flag=value` pattern
 *
 * @param args - Array of command arguments
 * @returns Map of flag names to their usage count
 *
 * @example
 * countFlagUsage(["--public-ip", "1.2.3.4", "--public-ip", "5.6.7.8"])
 * // Returns Map { "--public-ip" => 2 }
 *
 * countFlagUsage(["--name", "test", "--port", "80"])
 * // Returns Map { "--name" => 1, "--port" => 1 }
 */
export function countFlagUsage(args: string[]): Map<string, number> {
  const counts = new Map<string, number>();

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

    const current = counts.get(flagPart) || 0;
    counts.set(flagPart, current + 1);
  }

  return counts;
}

/**
 * Parse flag values from args array
 *
 * Extracts both flag names AND their values, handling multiple formats:
 * - `--flag value` pattern
 * - `--flag=value` pattern
 * - Boolean flags (no value)
 *
 * @param args - Array of command arguments
 * @returns Map of flag names to their values
 *
 * @example
 * parseCreationFlagValues(["--type", "http", "--name", "test"])
 * // Returns Map { "--type" => "http", "--name" => "test" }
 *
 * parseCreationFlagValues(["--type=tcp", "--interval=10"])
 * // Returns Map { "--type" => "tcp", "--interval" => "10" }
 *
 * parseCreationFlagValues(["--use-http2"])
 * // Returns Map { "--use-http2" => "" }
 */
export function parseCreationFlagValues(args: string[]): Map<string, string> {
  const values = new Map<string, string>();

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Skip non-flag arguments (domain, action, resource type)
    if (!arg || !arg.startsWith("-")) {
      continue;
    }

    // Handle --flag=value pattern
    if (arg.includes("=")) {
      const eqIndex = arg.indexOf("=");
      const flagName = arg.slice(0, eqIndex);
      const flagValue = arg.slice(eqIndex + 1);
      values.set(flagName, flagValue);
      continue;
    }

    // Handle --flag value pattern
    const nextArg = args[i + 1];
    if (nextArg && !nextArg.startsWith("-")) {
      values.set(arg, nextArg);
      i++; // Skip next arg since we consumed it as value
    } else {
      // Boolean flag without value
      values.set(arg, "");
    }
  }

  return values;
}

/**
 * Format a flag's default value for display in completion descriptions
 *
 * Handles different value types appropriately:
 * - Primitives (string, number, boolean) - displayed as-is
 * - Empty objects ({}) - displays "none"
 * - Empty arrays ([]) - displays "none"
 * - Non-empty arrays - displays comma-separated values (max 3)
 * - null/undefined - returns null to skip display
 *
 * @param value - The default value to format
 * @returns Formatted string for display, or null to skip display
 */
export function formatDefaultValue(value: unknown): string | null {
  // Skip undefined - no default to display
  if (value === undefined) {
    return null;
  }

  // Handle null explicitly
  if (value === null) {
    return "none";
  }

  // Handle primitives (string, number, boolean)
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "none";
    }
    // For non-empty arrays, show formatted values (max 3 items)
    if (value.length <= 3) {
      return value.join(", ");
    }
    return `${value.slice(0, 3).join(", ")}, ... (${value.length} items)`;
  }

  // Handle objects
  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) {
      return "none";
    }
    // For non-empty objects, show key count
    return `${keys.length} items`;
  }

  // Fallback for unknown types - don't display
  return null;
}
