/**
 * Validation Module
 *
 * Provides validation utilities for CLI operations including
 * namespace scope validation and safety checks from enriched upstream specs.
 */

export {
	validateNamespaceScope,
	getNamespaceScope,
	getNamespaceScopeDescription,
	requiresSpecificNamespace,
	formatValidationError,
	type NamespaceScope,
	type NamespaceValidationResult,
} from "./namespace.js";

export {
	checkOperationSafety,
	getOperationDangerLevel,
	requiresConfirmation,
	formatSafetyWarning,
	getOperationSideEffects,
	type DangerLevel,
	type SideEffects,
	type SafetyCheckResult,
} from "./safety.js";

export {
	validateResourceName,
	sanitizeName,
	isReservedAction,
	containsShellMetacharacters,
	isDangerousCommand,
	type NameValidationResult,
	type NameValidationOptions,
	type NameValidationCategory,
} from "./resource-name.js";

export {
	RESERVED_ACTIONS,
	SHELL_METACHARACTERS,
	DANGEROUS_PATTERNS,
	DANGEROUS_COMMANDS,
	CONTROL_CHARS,
	RFC1035_PATTERN,
	RFC1123_PATTERN,
} from "./reserved-words.js";
