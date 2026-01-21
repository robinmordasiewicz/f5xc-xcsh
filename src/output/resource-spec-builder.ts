/**
 * Generic Resource Spec Builder
 * Builds ResourceSpec for any F5 XC resource type from OpenAPI schema
 */

import type { ResourceSpec, FieldSpec, OneOfGroup } from "./types.js";
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
	// Try multiple schema name patterns
	const schemaName = findCreateSchemaName(resourceType, openApiSpec);

	// Check if schema exists
	if (!schemaName || !openApiSpec.components?.schemas?.[schemaName]) {
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

	// Build minimum configuration
	const minimumConfiguration = buildMinimumConfiguration(
		resourceType,
		fields,
		oneOfGroups,
	);

	// Build complete resource spec
	const resourceSpec = {
		resourceType,
		fields,
		oneOfGroups,
		...(minimumConfiguration !== undefined && { minimumConfiguration }),
	} as ResourceSpec;

	// Attach AI guide to resource spec (for backward compatibility with existing code)
	// The AI guide will also be attached to CommandSpec in spec.ts
	(resourceSpec as any).aiAssistantGuide = aiAssistantGuide;

	return resourceSpec;
}

/**
 * Build minimum configuration for a resource type
 */
function buildMinimumConfiguration(
	resourceType: string,
	fields: FieldSpec[],
	oneOfGroups: OneOfGroup[],
): ResourceSpec["minimumConfiguration"] {
	// Collect required fields
	const requiredFields = fields
		.filter((f) => f.required || f.extensions.requiredFor?.create)
		.map((f) => `spec.${f.name}`);

	// Always include metadata fields
	requiredFields.unshift("metadata.name", "metadata.namespace");

	// Build mutually exclusive groups from oneOf
	const mutuallyExclusiveGroups = oneOfGroups.map((group) => ({
		fields: group.variants.map((v) => `spec.${v}`),
		reason: `Choose exactly one ${group.groupName} type`,
	}));

	// Build a simple example
	const exampleObject: any = {
		metadata: {
			name: `example-${resourceType}`,
			namespace: "default",
		},
		spec: {},
	};

	// Add required fields to example
	for (const field of fields) {
		if (field.required || field.extensions.requiredFor?.create) {
			if (field.extensions.recommendedValue !== undefined) {
				exampleObject.spec[field.name] =
					field.extensions.recommendedValue;
			} else if (field.extensions.example !== undefined) {
				exampleObject.spec[field.name] = field.extensions.example;
			}
		}
	}

	return {
		description: `Minimum configuration required for ${resourceType} resource`,
		requiredFields,
		mutuallyExclusiveGroups,
		exampleJson: JSON.stringify(exampleObject, null, 2),
	};
}

/**
 * Find the create schema name for a resource type by trying multiple patterns
 * @param resourceType - Resource type (e.g., "healthcheck", "origin_pool")
 * @param openApiSpec - Full OpenAPI specification
 * @returns OpenAPI schema name if found, null otherwise
 */
function findCreateSchemaName(
	resourceType: string,
	openApiSpec: any,
): string | null {
	const normalized = normalizeResourceType(resourceType);
	const schemas = openApiSpec.components?.schemas || {};

	// Try multiple patterns in order of likelihood
	const patterns = [
		`${normalized}CreateSpecType`, // Standard pattern: healthcheckCreateSpecType
		`views${normalized}CreateSpecType`, // Views prefix: viewsorigin_poolCreateSpecType
		`${normalized}SpecType`, // Without Create: healthcheckSpecType
		`views${normalized}SpecType`, // Views prefix without Create
	];

	for (const pattern of patterns) {
		if (schemas[pattern]) {
			return pattern;
		}
	}

	return null;
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
