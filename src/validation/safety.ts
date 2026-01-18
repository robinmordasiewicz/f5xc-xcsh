/**
 * Operation Safety Validation
 *
 * Provides warnings and validation for potentially dangerous operations
 * based on danger levels from enriched upstream specs.
 */

import { getOperationDescription } from "../descriptions/resolver.js";
import { colorRed, colorYellow, colorDim } from "../branding/index.js";

/**
 * Danger level values from upstream enrichment
 */
export type DangerLevel = "low" | "medium" | "high";

/**
 * Side effects structure from upstream enrichment
 */
export interface SideEffects {
	creates?: string[];
	updates?: string[];
	deletes?: string[];
}

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
	/** Side effects of the operation */
	sideEffects?: SideEffects;
}

/**
 * Check the danger level of an operation
 *
 * @param domain - The domain name
 * @param action - The CLI action
 * @param resourceType - Optional resource type
 * @returns Safety check result with warnings and side effects
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
	const sideEffects = opInfo?.sideEffects;

	// Build the result object
	const result: SafetyCheckResult = {
		proceed: dangerLevel !== "high", // High danger requires explicit confirmation
		dangerLevel,
		requiresConfirmation,
	};

	// Add optional fields only when defined
	if (dangerLevel === "high") {
		result.warning = formatHighDangerWarning(
			domain,
			action,
			resourceType,
			sideEffects,
		);
	} else if (dangerLevel === "medium") {
		result.warning = formatMediumDangerWarning(
			domain,
			action,
			resourceType,
			sideEffects,
		);
	}

	if (sideEffects) {
		result.sideEffects = sideEffects;
	}

	return result;
}

/**
 * Check if side effects are trivial (obvious consequences of the action)
 *
 * @param action - The action being performed (e.g., "create", "delete")
 * @param resourceType - The resource type being operated on
 * @param sideEffects - The side effects of the operation
 * @returns true if the side effects are trivial and should not generate a warning
 */
function isTrivialSideEffect(
	action: string,
	resourceType: string | undefined,
	sideEffects: SideEffects,
): boolean {
	// Only check for create/delete actions with a specific resource type
	if (!resourceType) {
		return false;
	}

	// For create actions: trivial if only creating the same resource type
	if (action === "create" && sideEffects.creates) {
		return (
			sideEffects.creates.length === 1 &&
			sideEffects.creates[0] === resourceType &&
			!sideEffects.updates?.length &&
			!sideEffects.deletes?.length
		);
	}

	// For delete actions: trivial if only deleting the same resource type
	if (action === "delete" && sideEffects.deletes) {
		return (
			sideEffects.deletes.length === 1 &&
			sideEffects.deletes[0] === resourceType &&
			!sideEffects.updates?.length &&
			!sideEffects.creates?.length
		);
	}

	return false;
}

/**
 * Format a high danger warning message
 */
function formatHighDangerWarning(
	_domain: string,
	_action: string,
	_resourceType: string | undefined,
	sideEffects?: SideEffects,
): string {
	const lines: string[] = [
		colorRed("⚠️  WARNING: This is a HIGH DANGER operation"),
		"",
	];

	if (sideEffects) {
		if (sideEffects.deletes && sideEffects.deletes.length > 0) {
			lines.push(
				colorRed(`  Will DELETE: ${sideEffects.deletes.join(", ")}`),
			);
		}
		if (sideEffects.updates && sideEffects.updates.length > 0) {
			lines.push(`  Will UPDATE: ${sideEffects.updates.join(", ")}`);
		}
		if (sideEffects.creates && sideEffects.creates.length > 0) {
			lines.push(
				colorDim(`  Will CREATE: ${sideEffects.creates.join(", ")}`),
			);
		}
		lines.push("");
	}

	lines.push(
		colorRed("This action may be destructive and cannot be undone."),
	);

	return lines.join("\n");
}

/**
 * Format a medium danger warning message
 */
function formatMediumDangerWarning(
	_domain: string,
	action: string,
	resourceType: string | undefined,
	sideEffects?: SideEffects,
): string {
	// Skip warning for trivial side effects (e.g., creating X only lists X as created)
	if (sideEffects && isTrivialSideEffect(action, resourceType, sideEffects)) {
		return "";
	}

	const lines: string[] = [
		colorYellow("⚠️  CAUTION: This operation may have significant effects"),
		"",
	];

	if (sideEffects) {
		const effects: string[] = [];
		if (sideEffects.creates && sideEffects.creates.length > 0) {
			effects.push(`creates: ${sideEffects.creates.join(", ")}`);
		}
		if (sideEffects.updates && sideEffects.updates.length > 0) {
			effects.push(`updates: ${sideEffects.updates.join(", ")}`);
		}
		if (sideEffects.deletes && sideEffects.deletes.length > 0) {
			effects.push(`deletes: ${sideEffects.deletes.join(", ")}`);
		}
		if (effects.length > 0) {
			lines.push(`  Side effects: ${effects.join("; ")}`);
			lines.push("");
		}
	}

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

/**
 * Get side effects for an operation
 */
export function getOperationSideEffects(
	domain: string,
	action: string,
	resourceType?: string,
): SideEffects | undefined {
	const opInfo = getOperationDescription(domain, action, resourceType);
	return opInfo?.sideEffects;
}
