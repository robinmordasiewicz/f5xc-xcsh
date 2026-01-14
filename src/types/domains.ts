/**
 * Domain type definitions and registry interfaces.
 * These types mirror the Go types/domains.go structure.
 */

import {
	generatedDomains,
	SPEC_VERSION,
	DOMAIN_COUNT,
} from "./domains_generated.js";

/**
 * Resource dependency information
 */
export interface ResourceDependencies {
	required?: string[];
	optional?: string[];
}

/**
 * Subscription tier levels for resources
 */
export type SubscriptionTier =
	| "Free"
	| "Standard"
	| "Advanced"
	| "Enterprise"
	| "WAAP";

/**
 * Resource categories for classification
 */
export type ResourceCategory = "crud" | "analytics" | "utility" | "management";

/**
 * Resource categories breakdown
 */
export interface ResourceCategories {
	crud: string[]; // Standard CRUD operations
	analytics: string[]; // Reporting/statistics endpoints
	utilities: string[]; // Helper endpoints (swagger, pdf, etc.)
	management: string[]; // Operational endpoints (tickets, etc.)
}

/**
 * Resource metadata for primary resources within a domain
 * Contains tier, dependencies, and relationship information
 */
export interface ResourceMetadata {
	name: string;
	description: string;
	descriptionShort: string;
	tier: SubscriptionTier;
	icon?: string;
	category?: string;
	supportsLogs?: boolean;
	supportsMetrics?: boolean;
	dependencies?: ResourceDependencies;
	relationshipHints?: string[];

	// Dynamically discovered fields (Phase 1 enhancement)
	operations?: string[]; // ["list", "get", "create", "delete", ...]
	resourceCategory?: ResourceCategory; // "crud" | "analytics" | "utility" | "management"
	isPrimary?: boolean; // Whether this is in upstream primaryResources
}

/**
 * DomainInfo contains metadata about a resource domain
 */
export interface DomainInfo {
	name: string; // Canonical: "load_balancer"
	displayName: string; // Human: "Load Balancer"
	description: string; // Long description (~500 chars) for detailed help
	descriptionShort: string; // Short description (~60 chars) for completions, badges
	descriptionMedium: string; // Medium description (~150 chars) for tooltips, summaries
	aliases: string[]; // Short forms: ["lb"]

	// Fields from upstream specs
	complexity?: "simple" | "moderate" | "advanced";
	isPreview?: boolean;
	requiresTier?: string;
	category?: string;
	useCases?: string[];
	relatedDomains?: string[];
	cliMetadata?: Record<string, unknown>;

	// Visual identity fields (from upstream enrichment)
	icon?: string; // Emoji icon (e.g., "🌐")
	logoSvg?: string; // Inline SVG data URI
	uiCategory?: string; // UI grouping (e.g., "Load Balancing", "Security")

	// Rich resource metadata (from upstream enrichment)
	primaryResources?: ResourceMetadata[]; // Curated upstream resources

	// Dynamically discovered resources (Phase 1 enhancement)
	allResources?: ResourceMetadata[]; // ALL resources discovered from OpenAPI paths
	validationWarnings?: string[]; // Discrepancies between primary and discovered
	resourceCategories?: ResourceCategories; // Resources grouped by category
}

/**
 * Domain registry mapping canonical names to domain info
 */
export type DomainRegistry = Map<string, DomainInfo>;

// Global registries - populated from generated data
export const domainRegistry: DomainRegistry = new Map(generatedDomains);

// Export spec metadata
export { SPEC_VERSION, DOMAIN_COUNT };

/**
 * Get domain info by canonical name
 */
export function getDomainInfo(name: string): DomainInfo | undefined {
	return domainRegistry.get(name);
}

/**
 * Get all canonical domain names
 */
export function allDomains(): string[] {
	return Array.from(domainRegistry.keys()).sort();
}

/**
 * Check if a name is a valid domain
 */
export function isValidDomain(name: string): boolean {
	return domainRegistry.has(name);
}

/**
 * Valid action commands for domains
 */
export const validActions = new Set([
	"list",
	"get",
	"create",
	"delete",
	"replace",
	"apply",
	"status",
	"patch",
	"add-labels",
	"remove-labels",
]);

/**
 * Check if a name is a valid action command
 */
export function isValidAction(name: string): boolean {
	return validActions.has(name);
}
