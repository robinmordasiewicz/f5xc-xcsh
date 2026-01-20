/**
 * Operation Safety Validation
 *
 * Provides warnings and validation for potentially dangerous operations
 * based on danger levels from enriched upstream specs.
 */

import { getOperationDescription } from "../descriptions/resolver.js";
import { colorRed, colorYellow } from "../branding/index.js";

/**
 * Danger level values from upstream enrichment
 */
export type DangerLevel = "low" | "medium" | "high";

/**
 * Result of safety check
 */
export interface SafetyCheckResult {
	/** Whether to proceed (always true for low danger, requires confirmation for high) */
	proceed: boolean;
	/** Danger level of the operation */
	dangerLevel: DangerLevel;
	/** Whether confirmation is required before proceeding */
	requiresConfirmation: boolean;
	/** Warning message to display */
	warning?: string;
}

/**
 * Check the danger level of an operation
 *
 * @param domain - The domain name
 * @param action - The CLI action
 * @param resourceType - Optional resource type
 * @returns Safety check result with warnings
 */
export function checkOperationSafety(
	domain: string,
	action: string,
	resourceType?: string,
): SafetyCheckResult {
	const opInfo = getOperationDescription(domain, action, resourceType);

	// Default to low danger if not specified
	const dangerLevel = (opInfo?.dangerLevel as DangerLevel) || "low";
	const requiresConfirmation =
		opInfo?.confirmationRequired ?? dangerLevel === "high";

	// Build the result object
	const result: SafetyCheckResult = {
		proceed: dangerLevel !== "high", // High danger requires explicit confirmation
		dangerLevel,
		requiresConfirmation,
	};

	// Add warning message based on danger level
	if (dangerLevel === "high") {
		result.warning = formatHighDangerWarning(domain, action, resourceType);
	} else if (dangerLevel === "medium") {
		result.warning = formatMediumDangerWarning(
			domain,
			action,
			resourceType,
		);
	}

	return result;
}

/**
 * Format a high danger warning message
 */
function formatHighDangerWarning(
	_domain: string,
	_action: string,
	_resourceType: string | undefined,
): string {
	const lines: string[] = [
		colorRed("⚠️  WARNING: This is a HIGH DANGER operation"),
		colorRed("   This operation may have significant system impact."),
		"",
		colorRed("   Type 'yes' to confirm, or press Enter to cancel."),
	];

	return lines.join("\n");
}

/**
 * Format a medium danger warning message
 */
function formatMediumDangerWarning(
	_domain: string,
	_action: string,
	_resourceType: string | undefined,
): string {
	const lines: string[] = [
		colorYellow("⚠️  CAUTION: This operation may have significant effects"),
		colorYellow("   Review your command before proceeding."),
		"",
		colorYellow("   Type 'yes' to confirm, or press Enter to cancel."),
	];

	return lines.join("\n");
}

/**
 * Get the danger level for an operation
 */
export function getOperationDangerLevel(
	domain: string,
	action: string,
	resourceType?: string,
): DangerLevel {
	const opInfo = getOperationDescription(domain, action, resourceType);
	return (opInfo?.dangerLevel as DangerLevel) || "low";
}

/**
 * Check if an operation requires confirmation
 */
export function requiresConfirmation(
	domain: string,
	action: string,
	resourceType?: string,
): boolean {
	const opInfo = getOperationDescription(domain, action, resourceType);
	return opInfo?.confirmationRequired ?? opInfo?.dangerLevel === "high";
}

/**
 * Format safety warning for display before operation
 */
export function formatSafetyWarning(result: SafetyCheckResult): string {
	if (!result.warning) {
		return "";
	}
	return result.warning;
}
