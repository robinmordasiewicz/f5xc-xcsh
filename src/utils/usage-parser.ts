/**
 * Usage String Parser
 *
 * Parses command usage strings into structured requirements for automated verification.
 * Supports positional arguments and flags with various patterns:
 * - Required positional: <name>
 * - Optional positional: [name]
 * - Required flag with value: --flag <value>
 * - Optional flag with value: [--flag <value>]
 * - Optional flag alone: [--flag]
 */

export interface PositionalArgument {
	name: string;
	required: boolean;
	description?: string;
}

export interface FlagArgument {
	name: string;
	required: boolean;
	valueType?: string;
	valueName?: string;
	description?: string;
}

export interface UsageRequirements {
	positional: PositionalArgument[];
	flags: FlagArgument[];
	raw: string;
}

/**
 * Parse a usage string into structured requirements
 *
 * @param usageString - The usage pattern (e.g., "<name> --url <api-url> --token <api-token> [--namespace <ns>]")
 * @returns Structured requirements with positional args and flags
 *
 * @example
 * parseUsage("<name> --url <api-url> --token <api-token> [--namespace <ns>]")
 * // Returns:
 * // {
 * //   positional: [{ name: "name", required: true }],
 * //   flags: [
 * //     { name: "--url", required: true, valueType: "string", valueName: "api-url" },
 * //     { name: "--token", required: true, valueType: "string", valueName: "api-token" },
 * //     { name: "--namespace", required: false, valueType: "string", valueName: "ns" }
 * //   ],
 * //   raw: "<name> --url <api-url> --token <api-token> [--namespace <ns>]"
 * // }
 */
export function parseUsage(usageString: string | undefined): UsageRequirements {
	if (!usageString) {
		return { positional: [], flags: [], raw: "" };
	}

	const positional: PositionalArgument[] = [];
	const flags: FlagArgument[] = [];

	// Tokenize the usage string
	const tokens = tokenizeUsage(usageString);

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		// Type guard to ensure token is defined
		if (!token) continue;

		if (token.startsWith("--")) {
			// This is a flag
			const flagName = token;
			const nextToken = tokens[i + 1];

			// Check if next token is a value placeholder
			let valueType: string | undefined;
			let valueName: string | undefined;
			let required = true;

			if (nextToken && isValuePlaceholder(nextToken)) {
				// Flag has a value: --url <api-url>
				valueName = stripBrackets(nextToken);
				valueType = "string"; // Default to string
				i++; // Skip the value token

				// Check if this flag-value pair is wrapped in brackets
				// This is detected by checking if the flag itself was in brackets
				required = !token.match(/^\[--/) && !nextToken.match(/^\[/);
			} else {
				// Flag without value: --verbose or [--verbose]
				required = !token.match(/^\[--/);
			}

			// Only add flag if we have necessary data
			const cleanName = flagName.replace(/[[\]]/g, "");
			if (cleanName) {
				const flag: FlagArgument = {
					name: cleanName,
					required,
					...(valueType && { valueType }),
					...(valueName && { valueName }),
				};
				flags.push(flag);
			}
		} else if (isValuePlaceholder(token)) {
			// This is a positional argument
			const name = stripBrackets(token);
			const required = isRequired(token);

			if (name) {
				positional.push({
					name,
					required,
				});
			}
		}
	}

	return {
		positional,
		flags,
		raw: usageString,
	};
}

/**
 * Tokenize a usage string into individual components
 * Handles bracketed groups like [--flag <value>]
 */
function tokenizeUsage(usageString: string): string[] {
	const tokens: string[] = [];
	let current = "";
	let bracketDepth = 0;

	for (let i = 0; i < usageString.length; i++) {
		const char = usageString[i];

		if (char === "[") {
			bracketDepth++;
			current += char;
		} else if (char === "]") {
			bracketDepth--;
			current += char;
			if (bracketDepth === 0 && current.trim()) {
				tokens.push(current.trim());
				current = "";
			}
		} else if (char === " " && bracketDepth === 0) {
			if (current.trim()) {
				tokens.push(current.trim());
				current = "";
			}
		} else if (char === "<") {
			// Start of value placeholder
			if (current.trim() && !current.includes("<")) {
				tokens.push(current.trim());
				current = "";
			}
			current += char;
		} else if (char === ">") {
			// End of value placeholder
			current += char;
			if (bracketDepth === 0) {
				tokens.push(current.trim());
				current = "";
			}
		} else {
			current += char;
		}
	}

	if (current.trim()) {
		tokens.push(current.trim());
	}

	return tokens;
}

/**
 * Check if a token is a value placeholder like <name> or [name]
 */
function isValuePlaceholder(token: string): boolean {
	return /^[<[][\w-]+[\]>]$/.test(token) || /^<[\w-]+>$/.test(token);
}

/**
 * Check if a token represents a required argument (not wrapped in [])
 */
function isRequired(token: string): boolean {
	return token.startsWith("<") && token.endsWith(">");
}

/**
 * Remove brackets from a token
 */
function stripBrackets(token: string): string {
	return token.replace(/^[<[]/, "").replace(/[>\]]$/, "");
}

/**
 * Validate that completion suggestions match usage requirements
 *
 * @param usage - Parsed usage requirements
 * @param completionSuggestions - Array of completion suggestions
 * @returns Validation result with any inconsistencies found
 */
export interface ValidationResult {
	consistent: boolean;
	issues: string[];
	warnings: string[];
}

export function validateCompletionMatchesUsage(
	usage: UsageRequirements,
	completionSuggestions: string[],
): ValidationResult {
	const issues: string[] = [];
	const warnings: string[] = [];

	// If command has required positional arguments and completion returns empty array,
	// this is likely a positional-argument-aware completion handler that will suggest
	// flags only after positional args are provided. This is correct behavior.
	const hasRequiredPositional = usage.positional.some((p) => p.required);
	if (hasRequiredPositional && completionSuggestions.length === 0) {
		// This is acceptable - completion is waiting for positional arg
		// Don't check for flags in this case
		return {
			consistent: true,
			issues: [],
			warnings: [],
		};
	}

	// Check if required flags are suggested
	const requiredFlags = usage.flags.filter((f) => f.required);
	for (const flag of requiredFlags) {
		if (!completionSuggestions.includes(flag.name)) {
			issues.push(
				`Required flag '${flag.name}' from usage not found in completion suggestions`,
			);
		}
	}

	// Check if completion suggests flags not in usage
	const allUsageFlags = usage.flags.map((f) => f.name);
	for (const suggestion of completionSuggestions) {
		if (
			suggestion.startsWith("--") &&
			!allUsageFlags.includes(suggestion)
		) {
			warnings.push(
				`Completion suggests flag '${suggestion}' not found in usage specification`,
			);
		}
	}

	// Note: Positional arguments are harder to validate automatically
	// since completion might not suggest them (user-provided values)
	// This is handled by the test suite with contextual checks

	return {
		consistent: issues.length === 0,
		issues,
		warnings,
	};
}

/**
 * Format usage requirements as human-readable text
 */
export function formatUsageRequirements(usage: UsageRequirements): string {
	let output = `Usage Requirements:\n`;

	if (usage.positional.length > 0) {
		output += `\nPositional Arguments:\n`;
		for (const arg of usage.positional) {
			const req = arg.required ? "required" : "optional";
			output += `  - ${arg.name} (${req})\n`;
		}
	}

	if (usage.flags.length > 0) {
		output += `\nFlags:\n`;
		for (const flag of usage.flags) {
			const req = flag.required ? "required" : "optional";
			const value = flag.valueName ? ` <${flag.valueName}>` : "";
			output += `  - ${flag.name}${value} (${req})\n`;
		}
	}

	return output;
}

/**
 * Generate smart completion suggestions based on usage pattern and current arguments
 *
 * This function provides intelligent completion by:
 * 1. Showing positional argument placeholders when they're required but not yet provided
 * 2. Showing flag suggestions after required positional arguments are satisfied
 * 3. Supporting both required and optional positional arguments
 *
 * @param usage - The usage string (e.g., "<name> --url <api-url> --token <api-token> [--namespace <ns>]")
 * @param args - Current arguments provided (e.g., [] or ["myprofile"] or ["myprofile", "--url", "..."])
 * @param flags - Flag suggestions to return (e.g., ["--url", "--token", "--namespace"])
 * @returns Array of completion suggestions
 *
 * @example
 * // For command: login create profile <name> --url <url> --token <token>
 * generateSmartCompletions(usage, [], ["--url", "--token"])
 * // Returns: ["<profile-name>", "--url", "--token"]
 *
 * generateSmartCompletions(usage, ["myprofile"], ["--url", "--token"])
 * // Returns: ["--url", "--token"]
 */
export function generateSmartCompletions(
	usage: string | undefined,
	args: string[],
	flags: string[],
): string[] {
	if (!usage) {
		return flags;
	}

	const requirements = parseUsage(usage);

	// Count how many positional arguments have been provided
	// (filter out flags that start with --)
	const positionalArgsProvided = args.filter(
		(arg) => !arg.startsWith("--"),
	).length;

	// Get required positional arguments
	const requiredPositional = requirements.positional.filter(
		(p) => p.required,
	);

	// If we haven't satisfied all required positional args, include placeholders
	if (positionalArgsProvided < requiredPositional.length) {
		const placeholders = requiredPositional
			.slice(positionalArgsProvided)
			.map((p) => `<${p.name}>`);

		// Return placeholders first, then flags
		// This shows the user: "You need to provide X, and here are the flags available"
		return [...placeholders, ...flags];
	}

	// All required positional args satisfied, return only flags
	return flags;
}
