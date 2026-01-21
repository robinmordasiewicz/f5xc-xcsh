/**
 * Generic Resource Spec Builder
 * Builds ResourceSpec for any F5 XC resource type from OpenAPI schema
 */

import type { ResourceSpec } from "./types.js";
import {
	extractFieldSpecs,
	extractOneOfGroups,
	loadOpenApiSpec,
} from "./schema-extractor.js";
import { buildAIAssistantGuide } from "./ai-guide-builder.js";

/**
 * Cached OpenAPI specification (loaded once per process)
 */
let cachedOpenApiSpec: any = null;

/**
 * Cached resource specs (Map<resourceType, ResourceSpec>)
 */
const specCache = new Map<string, ResourceSpec>();

/**
 * Build resource specification for a given resource type
 * Uses caching for performance (<500ms cold, <50ms cached)
 *
 * @param resourceType - Resource type (e.g., "healthcheck", "origin_pool")
 * @returns ResourceSpec with fields, oneOf groups, and AI guide, or null if schema not found
 */
export function buildResourceSpec(resourceType: string): ResourceSpec | null {
	// Check cache first
	if (specCache.has(resourceType)) {
		return specCache.get(resourceType)!;
	}

	// Load OpenAPI spec once (singleton pattern)
	if (!cachedOpenApiSpec) {
		cachedOpenApiSpec = loadOpenApiSpec();
	}

	// Build uncached spec
	const spec = buildResourceSpecUncached(resourceType, cachedOpenApiSpec);

	// Cache if successful
	if (spec) {
		specCache.set(resourceType, spec);
	}

	return spec;
}

/**
 * Build resource spec without caching
 * Internal implementation used by buildResourceSpec
 *
 * @param resourceType - Resource type
 * @param openApiSpec - Full OpenAPI specification
 * @returns ResourceSpec or null if schema not found
 */
function buildResourceSpecUncached(
	resourceType: string,
	openApiSpec: any,
): ResourceSpec | null {
	// Get schema name: resourceType + "CreateSpecType"
	// e.g., "healthcheck" -> "healthcheckCreateSpecType"
	const schemaName = getCreateSchemaName(resourceType);

	// Check if schema exists
	if (!openApiSpec.components?.schemas?.[schemaName]) {
		return null;
	}

	// Extract fields and oneOf groups from schema
	const fields = extractFieldSpecs(schemaName, openApiSpec);
	const oneOfGroups = extractOneOfGroups(schemaName, openApiSpec);

	// Build AI assistant guide
	const aiAssistantGuide = buildAIAssistantGuide(
		resourceType,
		fields,
		oneOfGroups,
	);

	// Build complete resource spec
	const resourceSpec: ResourceSpec = {
		resourceType,
		fields,
		oneOfGroups,
	};

	// Attach AI guide to resource spec (for backward compatibility with existing code)
	// The AI guide will also be attached to CommandSpec in spec.ts
	(resourceSpec as any).aiAssistantGuide = aiAssistantGuide;

	return resourceSpec;
}

/**
 * Get OpenAPI schema name for a resource type's create operation
 * Convention: {resourceType}CreateSpecType
 *
 * @param resourceType - Resource type (e.g., "healthcheck", "origin_pool")
 * @returns OpenAPI schema name (e.g., "healthcheckCreateSpecType")
 */
export function getCreateSchemaName(resourceType: string): string {
	// Normalize resource type (replace hyphens with underscores)
	const normalized = normalizeResourceType(resourceType);
	return `${normalized}CreateSpecType`;
}

/**
 * Normalize resource type for schema lookups
 * Converts kebab-case to snake_case
 *
 * @param resourceType - Resource type (may contain hyphens)
 * @returns Normalized resource type (underscores only)
 */
export function normalizeResourceType(resourceType: string): string {
	return resourceType.replace(/-/g, "_");
}

/**
 * Clear spec cache (for testing)
 */
export function clearSpecCache(): void {
	specCache.clear();
}

/**
 * Clear OpenAPI cache (for testing)
 */
export function clearOpenApiCache(): void {
	cachedOpenApiSpec = null;
}

/**
 * Get cache statistics (for monitoring)
 */
export function getCacheStats(): {
	openApiCached: boolean;
	specsCached: number;
	cachedTypes: string[];
} {
	return {
		openApiCached: cachedOpenApiSpec !== null,
		specsCached: specCache.size,
		cachedTypes: Array.from(specCache.keys()),
	};
}
