/**
 * Resource Name Validation Module
 *
 * Validates resource names for CLI safety and platform compliance.
 * Prevents command injection, reserved word conflicts, and naming violations.
 */

import {
	RESERVED_ACTIONS,
	SHELL_METACHARACTERS,
	DANGEROUS_PATTERNS,
	DANGEROUS_COMMANDS,
	CONTROL_CHARS,
	RFC1035_PATTERN,
} from "./reserved-words.js";

/**
 * Validation result categories indicating the type of failure
 */
export type NameValidationCategory =
	| "reserved"
	| "dangerous"
	| "invalid"
	| "security";

/**
 * Result of resource name validation
 */
export interface NameValidationResult {
	/** Whether the name is valid */
	valid: boolean;
	/** Category of validation failure (if invalid) */
	category?: NameValidationCategory;
	/** Human-readable error message */
	message?: string;
	/** Suggested alternative name */
	suggestion?: string;
}

/**
 * Options for resource name validation
 */
export interface NameValidationOptions {
	/** Maximum allowed length (default: 63 for RFC 1035) */
	maxLength?: number;
	/** Allow uppercase letters (default: false) */
	allowUppercase?: boolean;
	/** Resource type for context-specific rules */
	resourceType?: string;
	/** Skip RFC 1035 format validation (default: false) */
	skipFormatValidation?: boolean;
}

const DEFAULT_OPTIONS: Required<Omit<NameValidationOptions, "resourceType">> = {
	maxLength: 63,
	allowUppercase: false,
	skipFormatValidation: false,
};

/**
 * Validate a resource name for CLI safety and platform compliance.
 *
 * Checks for:
 * - Empty or whitespace-only names
 * - Length violations
 * - Control characters
 * - Shell metacharacters (security)
 * - Reserved CLI action words
 * - Dangerous command names
 * - Dangerous patterns (leading hyphen, path traversal, etc.)
 * - RFC 1035 DNS label compliance
 *
 * @param name - The resource name to validate
 * @param options - Validation options
 * @returns Validation result with error details if invalid
 */
export function validateResourceName(
	name: string,
	options: NameValidationOptions = {},
): NameValidationResult {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const nameLower = name.toLowerCase();

	// Empty name check
	if (!name || name.trim().length === 0) {
		return {
			valid: false,
			category: "invalid",
			message: "Resource name cannot be empty",
		};
	}

	// Length check
	if (name.length > opts.maxLength) {
		return {
			valid: false,
			category: "invalid",
			message: `Name exceeds maximum length of ${opts.maxLength} characters (got ${name.length})`,
			suggestion: sanitizeName(name.slice(0, opts.maxLength)),
		};
	}

	// Control characters (security critical)
	if (CONTROL_CHARS.test(name)) {
		return {
			valid: false,
			category: "security",
			message: "Name contains control characters which are not allowed",
		};
	}

	// Shell metacharacters (security critical)
	if (SHELL_METACHARACTERS.test(name)) {
		const match = name.match(SHELL_METACHARACTERS);
		const char = match?.[0] ?? "unknown";
		const charDesc = getCharacterDescription(char);
		return {
			valid: false,
			category: "security",
			message: `Name contains shell metacharacter '${charDesc}' which could enable command injection`,
		};
	}

	// Reserved action words
	if (RESERVED_ACTIONS.has(nameLower)) {
		return {
			valid: false,
			category: "reserved",
			message: `'${name}' is a reserved CLI action word and cannot be used as a resource name`,
			suggestion: `my-${name}`,
		};
	}

	// Dangerous command names
	if (DANGEROUS_COMMANDS.has(nameLower)) {
		return {
			valid: false,
			category: "dangerous",
			message: `'${name}' matches a dangerous system command and cannot be used as a resource name`,
		};
	}

	// Dangerous patterns
	for (const { pattern, message } of DANGEROUS_PATTERNS) {
		if (pattern.test(name)) {
			return {
				valid: false,
				category: "dangerous",
				message,
			};
		}
	}

	// RFC 1035 format validation (unless skipped)
	if (!opts.skipFormatValidation) {
		const nameToCheck = opts.allowUppercase ? nameLower : name;
		if (!RFC1035_PATTERN.test(nameToCheck.toLowerCase())) {
			return {
				valid: false,
				category: "invalid",
				message:
					"Name must start with a letter, end with alphanumeric, and contain only lowercase letters, numbers, and hyphens",
				suggestion: sanitizeName(name),
			};
		}
	}

	return { valid: true };
}

/**
 * Get a human-readable description for a shell metacharacter
 */
function getCharacterDescription(char: string): string {
	const descriptions: Record<string, string> = {
		";": "; (command separator)",
		"&": "& (background execution)",
		"|": "| (pipe)",
		"`": "` (command substitution)",
		$: "$ (variable/command expansion)",
		"(": "( (subshell)",
		")": ") (subshell)",
		"<": "< (input redirection)",
		">": "> (output redirection)",
		"\\": "\\ (escape)",
		"#": "# (comment)",
		"!": "! (history expansion)",
		"{": "{ (brace expansion)",
		"}": "} (brace expansion)",
		"[": "[ (bracket expansion)",
		"]": "] (bracket expansion)",
		"*": "* (glob pattern)",
		"?": "? (glob pattern)",
		"~": "~ (home directory)",
		"\n": "newline",
		"\r": "carriage return",
	};
	return descriptions[char] ?? char;
}

/**
 * Sanitize a name to make it valid.
 * Converts to lowercase, replaces invalid characters with hyphens,
 * and ensures proper start/end characters.
 *
 * @param name - The name to sanitize
 * @returns A sanitized version of the name
 */
export function sanitizeName(name: string): string {
	return (
		name
			.toLowerCase()
			// Replace invalid characters with hyphens
			.replace(/[^a-z0-9-]/g, "-")
			// Remove leading hyphens/numbers
			.replace(/^[^a-z]+/, "")
			// Remove trailing hyphens
			.replace(/-+$/, "")
			// Collapse multiple hyphens
			.replace(/-{2,}/g, "-")
			// Ensure max length
			.slice(0, 63) || "resource"
	);
}

/**
 * Check if a name is a reserved action word
 */
export function isReservedAction(name: string): boolean {
	return RESERVED_ACTIONS.has(name.toLowerCase());
}

/**
 * Check if a name contains shell metacharacters
 */
export function containsShellMetacharacters(name: string): boolean {
	return SHELL_METACHARACTERS.test(name);
}

/**
 * Check if a name matches a dangerous command
 */
export function isDangerousCommand(name: string): boolean {
	return DANGEROUS_COMMANDS.has(name.toLowerCase());
}
