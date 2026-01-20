/**
 * Resource Builders Registry
 *
 * Central registry for resource-specific builders that convert
 * CLI flags into F5 XC API request bodies.
 */

import { ParsedCreationFlags } from "../flag-parser.js";
import {
	buildHealthcheckRequest,
	validateHealthcheckFlags,
	HealthcheckRequestBody,
} from "./healthcheck-builder.js";
import {
	buildOriginPoolRequest,
	validateOriginPoolFlags,
	OriginPoolRequestBody,
} from "./origin-pool-builder.js";
import {
	buildAppFirewallRequest,
	validateAppFirewallFlags,
	AppFirewallRequestBody,
} from "./app-firewall-builder.js";

/**
 * Generic validation result
 */
export interface ValidationResult {
	valid: boolean;
	errors: string[];
}

/**
 * Resource builder interface
 */
export interface ResourceBuilder<T = Record<string, unknown>> {
	build: (flags: ParsedCreationFlags, namespace: string) => T;
	validate: (flags: ParsedCreationFlags) => ValidationResult;
}

/**
 * Registry of resource builders
 * Using explicit type casting to allow specific return types to satisfy the generic interface
 */
const BUILDERS_REGISTRY: Record<string, ResourceBuilder> = {
	healthcheck: {
		build: (flags, namespace) =>
			buildHealthcheckRequest(flags, namespace) as unknown as Record<
				string,
				unknown
			>,
		validate: validateHealthcheckFlags,
	},
	origin_pool: {
		build: (flags, namespace) =>
			buildOriginPoolRequest(flags, namespace) as unknown as Record<
				string,
				unknown
			>,
		validate: validateOriginPoolFlags,
	},
	app_firewall: {
		build: (flags, namespace) =>
			buildAppFirewallRequest(flags, namespace) as unknown as Record<
				string,
				unknown
			>,
		validate: validateAppFirewallFlags,
	},
};

/**
 * Get builder for a resource type
 *
 * @param resourceType - The resource type name (e.g., "healthcheck", "origin_pool")
 * @returns Resource builder or undefined if not found
 */
export function getResourceBuilder(
	resourceType: string,
): ResourceBuilder | undefined {
	return BUILDERS_REGISTRY[resourceType];
}

/**
 * Check if a resource type has a builder
 *
 * @param resourceType - The resource type name
 * @returns true if a builder exists for this resource type
 */
export function hasResourceBuilder(resourceType: string): boolean {
	return resourceType in BUILDERS_REGISTRY;
}

/**
 * Get list of resource types with builders
 */
export function getBuilderResourceTypes(): string[] {
	return Object.keys(BUILDERS_REGISTRY);
}

/**
 * Build a resource from flags
 *
 * @param resourceType - The resource type
 * @param flags - Parsed creation flags
 * @param namespace - Target namespace
 * @returns Built resource body or null if no builder found
 */
export function buildResource(
	resourceType: string,
	flags: ParsedCreationFlags,
	namespace: string,
): Record<string, unknown> | null {
	const builder = getResourceBuilder(resourceType);
	if (!builder) {
		return null;
	}
	return builder.build(flags, namespace) as Record<string, unknown>;
}

/**
 * Validate flags for a resource type
 *
 * @param resourceType - The resource type
 * @param flags - Parsed creation flags
 * @returns Validation result
 */
export function validateResourceFlags(
	resourceType: string,
	flags: ParsedCreationFlags,
): ValidationResult {
	const builder = getResourceBuilder(resourceType);
	if (!builder) {
		return {
			valid: false,
			errors: [`No builder found for resource type: ${resourceType}`],
		};
	}
	return builder.validate(flags);
}

// Re-export types for convenience
export type {
	HealthcheckRequestBody,
	OriginPoolRequestBody,
	AppFirewallRequestBody,
};
