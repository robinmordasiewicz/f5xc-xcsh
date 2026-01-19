/**
 * Flag Parser for Resource Creation
 *
 * Parses CLI arguments to extract creation flag values.
 * Handles --flag value, --flag=value, and boolean flags.
 * Supports repeatable flags that collect into arrays.
 */

import {
	CreationFlagDefinition,
	getCreationFlags,
} from "../completion/creation-flags.js";

/**
 * Result of parsing creation flags from CLI arguments
 */
export interface ParsedCreationFlags {
	/** Map of flag name to value(s) - repeatable flags have string[] */
	values: Map<string, string | string[]>;
	/** Validation errors encountered during parsing */
	errors: string[];
	/** Whether parsing found any creation flags */
	hasFlags: boolean;
}

/**
 * Check if args contain any creation flags for a resource type
 */
export function hasCreationFlagsInArgs(
	args: string[],
	resourceType: string,
): boolean {
	const flagDefs = getCreationFlags(resourceType);
	if (flagDefs.length === 0) return false;

	// Build set of all flag names
	const flagNames = new Set<string>();
	for (const def of flagDefs) {
		flagNames.add(def.name);
	}

	// Check if any arg starts with a known flag
	for (const arg of args) {
		if (!arg) continue;
		// Handle --flag=value format
		const flagPart = arg.includes("=") ? (arg.split("=")[0] ?? arg) : arg;
		if (flagNames.has(flagPart)) {
			return true;
		}
	}

	return false;
}

/**
 * Parse creation flags from CLI arguments
 *
 * @param args - The CLI arguments (after the action and resource type)
 * @param resourceType - The resource type (e.g., "healthcheck", "origin_pool")
 * @returns ParsedCreationFlags with values map and any errors
 */
export function parseCreationFlags(
	args: string[],
	resourceType: string,
): ParsedCreationFlags {
	const flagDefs = getCreationFlags(resourceType);
	const result: ParsedCreationFlags = {
		values: new Map(),
		errors: [],
		hasFlags: false,
	};

	if (flagDefs.length === 0) {
		result.errors.push(
			`No creation flags defined for resource type: ${resourceType}`,
		);
		return result;
	}

	// Build lookup map
	const flagByName = new Map<string, CreationFlagDefinition>();
	for (const def of flagDefs) {
		flagByName.set(def.name, def);
	}

	// Track usage counts for repeatable flags
	const usageCounts = new Map<string, number>();

	// Parse arguments
	let i = 0;
	while (i < args.length) {
		const arg = args[i];

		// Skip undefined or non-flag arguments
		if (!arg || !arg.startsWith("-")) {
			i++;
			continue;
		}

		// Handle --flag=value format
		let flagName: string;
		let inlineValue: string | undefined;
		if (arg.includes("=")) {
			const eqIndex = arg.indexOf("=");
			flagName = arg.substring(0, eqIndex);
			inlineValue = arg.substring(eqIndex + 1);
		} else {
			flagName = arg;
		}

		// Skip --file flag (handled separately)
		if (flagName === "--file") {
			i += inlineValue !== undefined ? 1 : 2;
			continue;
		}

		// Skip --namespace flag (handled separately in executor)
		if (flagName === "--namespace") {
			i += inlineValue !== undefined ? 1 : 2;
			continue;
		}

		// Look up flag definition
		const def = flagByName.get(flagName);
		if (!def) {
			// Unknown flag - skip but don't error (might be for different purpose)
			i++;
			continue;
		}

		result.hasFlags = true;

		// Track usage for repeatable validation
		const currentCount = usageCounts.get(def.name) ?? 0;
		usageCounts.set(def.name, currentCount + 1);

		// Check max occurrences for repeatable flags
		if (def.isRepeatable && def.maxOccurrences) {
			if (currentCount + 1 > def.maxOccurrences) {
				result.errors.push(
					`Flag ${def.name} can only be used ${def.maxOccurrences} times`,
				);
				i++;
				continue;
			}
		} else if (!def.isRepeatable && currentCount > 0) {
			result.errors.push(
				`Flag ${def.name} cannot be specified multiple times`,
			);
			i++;
			continue;
		}

		// Handle boolean flags (no value)
		if (!def.hasValue) {
			result.values.set(def.name, "true");
			i++;
			continue;
		}

		// Get the value
		let value: string;
		if (inlineValue !== undefined) {
			value = inlineValue;
			i++;
		} else {
			const nextArg = args[i + 1];
			if (nextArg && !nextArg.startsWith("-")) {
				value = nextArg;
				i += 2;
			} else {
				result.errors.push(`Flag ${def.name} requires a value`);
				i++;
				continue;
			}
		}

		// Validate enum values
		if (def.valueType === "enum" && def.enumValues) {
			if (!def.enumValues.includes(value)) {
				result.errors.push(
					`Invalid value '${value}' for ${def.name}. Allowed: ${def.enumValues.join(", ")}`,
				);
				continue;
			}
		}

		// Validate integer values
		if (def.valueType === "integer") {
			const num = parseInt(value, 10);
			if (isNaN(num)) {
				result.errors.push(
					`Invalid integer value '${value}' for ${def.name}`,
				);
				continue;
			}
		}

		// Store value
		if (def.isRepeatable) {
			const existing = result.values.get(def.name);
			if (Array.isArray(existing)) {
				existing.push(value);
			} else {
				result.values.set(def.name, [value]);
			}
		} else {
			result.values.set(def.name, value);
		}
	}

	// Validate required flags
	for (const def of flagDefs) {
		if (def.required && !result.values.has(def.name)) {
			// Only require if we found some creation flags
			if (result.hasFlags) {
				result.errors.push(`Required flag ${def.name} is missing`);
			}
		}
	}

	// Validate conflictsWith - direct field conflicts from x-f5xc-conflicts-with
	const reportedConflicts = new Set<string>();
	for (const def of flagDefs) {
		if (def.conflictsWith && result.values.has(def.name)) {
			for (const conflictingFlag of def.conflictsWith) {
				if (result.values.has(conflictingFlag)) {
					// Create a normalized key to deduplicate bidirectional conflicts
					const conflictKey = [def.name, conflictingFlag]
						.sort()
						.join("|");
					if (!reportedConflicts.has(conflictKey)) {
						reportedConflicts.add(conflictKey);
						result.errors.push(
							`Flags ${def.name} and ${conflictingFlag} are mutually exclusive`,
						);
					}
				}
			}
		}
	}

	return result;
}

/**
 * Get a string value from parsed flags
 */
export function getFlagValue(
	parsed: ParsedCreationFlags,
	flagName: string,
): string | undefined {
	const value = parsed.values.get(flagName);
	if (Array.isArray(value)) {
		return value[0];
	}
	return value;
}

/**
 * Get an array of values from parsed flags (for repeatable flags)
 */
export function getFlagValues(
	parsed: ParsedCreationFlags,
	flagName: string,
): string[] {
	const value = parsed.values.get(flagName);
	if (Array.isArray(value)) {
		return value;
	}
	if (value !== undefined) {
		return [value];
	}
	return [];
}

/**
 * Get an integer value from parsed flags
 */
export function getFlagIntValue(
	parsed: ParsedCreationFlags,
	flagName: string,
): number | undefined {
	const value = getFlagValue(parsed, flagName);
	if (value !== undefined) {
		const num = parseInt(value, 10);
		return isNaN(num) ? undefined : num;
	}
	return undefined;
}

/**
 * Check if a boolean flag is set
 */
export function isFlagSet(
	parsed: ParsedCreationFlags,
	flagName: string,
): boolean {
	return parsed.values.has(flagName);
}
