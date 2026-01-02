/**
 * Unified Description Resolver
 *
 * Single API for fetching descriptions with fallback chain:
 * 1. CLI-specific domains (login, cloudstatus, completion) → custom YAML
 * 2. API domains → upstream generatedDomains/generatedOperations
 * 3. Fallback → generic defaults
 *
 * This establishes upstream API specs as the single source of truth for descriptions.
 */

import { generatedDomains } from "../types/domains_generated.js";
import {
	generatedOperations,
	type DomainOperationsInfo,
	type OperationInfo,
} from "../types/operations_generated.js";
import {
	generatedDescriptions,
	type DescriptionTiers,
	type DomainDescriptions,
	type SubcommandDescriptions,
} from "../domains/descriptions.generated.js";

/**
 * CLI-only domains that use custom descriptions (not from upstream API specs)
 */
const CLI_ONLY_DOMAINS = new Set(["login", "cloudstatus", "completion"]);

/**
 * Default descriptions for fallback scenarios
 */
const DEFAULT_DESCRIPTIONS: DescriptionTiers = {
	short: "Manage resources",
	medium: "Manage and configure resources in this domain.",
	long: "Manage and configure resources in this domain. Use subcommands to perform specific operations.",
};

/**
 * Check if a domain is CLI-specific (not from upstream API specs)
 */
export function isCliOnlyDomain(domain: string): boolean {
	return CLI_ONLY_DOMAINS.has(domain);
}

/**
 * Check if a domain exists in upstream API specs
 */
export function isUpstreamDomain(domain: string): boolean {
	return generatedDomains.has(domain);
}

/**
 * Get domain-level descriptions with fallback chain
 *
 * Priority:
 * 1. CLI-only domains → custom descriptions.generated.ts
 * 2. API domains → upstream domains_generated.ts
 * 3. Fallback → default descriptions
 */
export function getDomainDescriptions(domain: string): DescriptionTiers {
	// 1. CLI-only domains use custom descriptions
	if (isCliOnlyDomain(domain)) {
		const customDesc = generatedDescriptions.domains[domain];
		if (customDesc) {
			return {
				short: customDesc.short,
				medium: customDesc.medium,
				long: customDesc.long,
			};
		}
	}

	// 2. API domains use upstream specs
	const upstreamDomain = generatedDomains.get(domain);
	if (upstreamDomain) {
		return {
			short: upstreamDomain.descriptionShort,
			medium: upstreamDomain.descriptionMedium,
			long: upstreamDomain.description,
		};
	}

	// 3. Fallback to defaults
	return DEFAULT_DESCRIPTIONS;
}

/**
 * Get subcommand-level descriptions (for CLI domains like login/profile)
 *
 * Only applicable to CLI-only domains with nested subcommands
 */
export function getSubcommandDescriptions(
	domain: string,
	subcommand: string,
): DescriptionTiers | undefined {
	// Only CLI domains have subcommand descriptions
	if (!isCliOnlyDomain(domain)) {
		return undefined;
	}

	const domainDesc = generatedDescriptions.domains[domain] as
		| DomainDescriptions
		| undefined;
	if (!domainDesc?.subcommands) {
		return undefined;
	}

	const subDesc = domainDesc.subcommands[subcommand] as
		| SubcommandDescriptions
		| undefined;
	if (!subDesc) {
		return undefined;
	}

	return {
		short: subDesc.short,
		medium: subDesc.medium,
		long: subDesc.long,
	};
}

/**
 * Get operation-level descriptions from upstream OpenAPI specs
 *
 * @param domain - The domain name (e.g., "api", "dns")
 * @param action - The CLI action (e.g., "create", "list", "get", "delete")
 * @param resourceType - Optional resource type for more specific matching
 */
export function getOperationDescription(
	domain: string,
	action: string,
	resourceType?: string,
): OperationInfo | undefined {
	const domainOps = generatedOperations.get(domain);
	if (!domainOps) {
		return undefined;
	}

	// Find matching operation
	return domainOps.operations.find((op) => {
		if (op.action !== action) return false;
		if (resourceType && op.resourceType !== resourceType) return false;
		return true;
	});
}

/**
 * Get all operations for a domain
 */
export function getDomainOperations(
	domain: string,
): DomainOperationsInfo | undefined {
	return generatedOperations.get(domain);
}

/**
 * Get all resource types for a domain
 */
export function getDomainResourceTypes(domain: string): string[] {
	const domainOps = generatedOperations.get(domain);
	return domainOps?.resourceTypes || [];
}

/**
 * Get description for a specific action across all domains
 */
export function getActionDescription(action: string): DescriptionTiers {
	const actionDescriptions: Record<string, DescriptionTiers> = {
		create: {
			short: "Create a new resource",
			medium: "Create a new resource instance with the specified configuration.",
			long: "Create a new resource instance in the specified namespace. Provide the required configuration parameters.",
		},
		list: {
			short: "List all resources",
			medium: "List all resource instances in the namespace.",
			long: "List all resource instances in the specified namespace. Supports filtering and pagination options.",
		},
		get: {
			short: "Get resource details",
			medium: "Get detailed information about a specific resource.",
			long: "Retrieve complete configuration and status information for a specific resource by name.",
		},
		delete: {
			short: "Delete a resource",
			medium: "Delete a specific resource instance.",
			long: "Permanently delete a resource instance from the namespace. This action cannot be undone.",
		},
		replace: {
			short: "Replace resource configuration",
			medium: "Replace the entire configuration of an existing resource.",
			long: "Replace the complete configuration of an existing resource. All fields will be updated to the new values.",
		},
		update: {
			short: "Update resource configuration",
			medium: "Update specific fields of an existing resource.",
			long: "Update specific configuration fields of an existing resource. Only specified fields will be modified.",
		},
	};

	return (
		actionDescriptions[action] || {
			short: `Perform ${action} operation`,
			medium: `Perform ${action} operation on resources.`,
			long: `Perform ${action} operation on resources in this domain.`,
		}
	);
}

/**
 * Unified resolver interface for all description lookups
 */
export interface DescriptionResolver {
	getDomainDescription(domain: string): DescriptionTiers;
	getSubcommandDescription(
		domain: string,
		subcommand: string,
	): DescriptionTiers | undefined;
	getOperationDescription(
		domain: string,
		action: string,
		resourceType?: string,
	): OperationInfo | undefined;
	getActionDescription(action: string): DescriptionTiers;
	isUpstreamDomain(domain: string): boolean;
	isCliOnlyDomain(domain: string): boolean;
}

/**
 * Create a description resolver instance
 */
export function createDescriptionResolver(): DescriptionResolver {
	return {
		getDomainDescription: getDomainDescriptions,
		getSubcommandDescription: getSubcommandDescriptions,
		getOperationDescription,
		getActionDescription,
		isUpstreamDomain,
		isCliOnlyDomain,
	};
}

/**
 * Default resolver instance
 */
export const descriptionResolver = createDescriptionResolver();
