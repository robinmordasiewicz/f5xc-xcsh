#!/usr/bin/env npx tsx
/**
 * Conflict Generator Script
 * Extracts x-f5xc-conflicts-with extension from OpenAPI specs
 *
 * Generates src/types/conflicts_generated.ts with property conflict mappings
 * that can be used to filter completion suggestions dynamically.
 *
 * Run: npx tsx scripts/generate-conflicts.ts
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// ============================================================================
// Type Definitions
// ============================================================================

interface OpenAPIProperty {
	type?: string;
	$ref?: string;
	description?: string;
	"x-f5xc-conflicts-with"?: string[];
	properties?: Record<string, OpenAPIProperty>;
	items?: OpenAPIProperty;
	allOf?: OpenAPIProperty[];
	oneOf?: OpenAPIProperty[];
	anyOf?: OpenAPIProperty[];
}

interface OpenAPISchema {
	type?: string;
	properties?: Record<string, OpenAPIProperty>;
	allOf?: OpenAPIProperty[];
	oneOf?: OpenAPIProperty[];
	anyOf?: OpenAPIProperty[];
}

interface OpenAPISpec {
	openapi: string;
	info: {
		title: string;
		version: string;
	};
	components?: {
		schemas?: Record<string, OpenAPISchema>;
	};
}

interface ConflictEntry {
	property: string;
	conflictsWith: string[];
	schemaName: string;
}

// ============================================================================
// Conflict Extraction Logic
// ============================================================================

/**
 * Recursively extract conflicts from a property
 */
function extractConflictsFromProperty(
	property: OpenAPIProperty,
	propertyName: string,
	schemaName: string,
	conflicts: ConflictEntry[],
): void {
	// Check if this property has conflicts
	if (
		property["x-f5xc-conflicts-with"] &&
		Array.isArray(property["x-f5xc-conflicts-with"])
	) {
		conflicts.push({
			property: propertyName,
			conflictsWith: property["x-f5xc-conflicts-with"],
			schemaName,
		});
	}

	// Recursively check nested properties
	if (property.properties) {
		for (const [nestedName, nestedProp] of Object.entries(
			property.properties,
		)) {
			extractConflictsFromProperty(
				nestedProp,
				nestedName,
				schemaName,
				conflicts,
			);
		}
	}

	// Check array items
	if (property.items) {
		extractConflictsFromProperty(
			property.items,
			`${propertyName}[]`,
			schemaName,
			conflicts,
		);
	}

	// Check allOf/oneOf/anyOf
	for (const compositeKey of ["allOf", "oneOf", "anyOf"] as const) {
		const composite = property[compositeKey];
		if (composite && Array.isArray(composite)) {
			for (const item of composite) {
				extractConflictsFromProperty(
					item,
					propertyName,
					schemaName,
					conflicts,
				);
			}
		}
	}
}

/**
 * Extract all conflicts from a schema
 */
function extractConflictsFromSchema(
	schema: OpenAPISchema,
	schemaName: string,
	conflicts: ConflictEntry[],
): void {
	// Check direct properties
	if (schema.properties) {
		for (const [propName, prop] of Object.entries(schema.properties)) {
			extractConflictsFromProperty(prop, propName, schemaName, conflicts);
		}
	}

	// Check allOf/oneOf/anyOf at schema level
	for (const compositeKey of ["allOf", "oneOf", "anyOf"] as const) {
		const composite = schema[compositeKey];
		if (composite && Array.isArray(composite)) {
			for (const item of composite) {
				if (item.properties) {
					for (const [propName, prop] of Object.entries(
						item.properties,
					)) {
						extractConflictsFromProperty(
							prop,
							propName,
							schemaName,
							conflicts,
						);
					}
				}
			}
		}
	}
}

/**
 * Extract all conflicts from an OpenAPI spec
 */
function extractConflictsFromSpec(spec: OpenAPISpec): ConflictEntry[] {
	const conflicts: ConflictEntry[] = [];

	if (!spec.components?.schemas) {
		return conflicts;
	}

	for (const [schemaName, schema] of Object.entries(spec.components.schemas)) {
		extractConflictsFromSchema(schema, schemaName, conflicts);
	}

	return conflicts;
}

/**
 * Build a consolidated conflict map from all entries
 * Ensures bidirectional conflicts are captured
 */
function buildConflictMap(entries: ConflictEntry[]): Map<string, Set<string>> {
	const conflictMap = new Map<string, Set<string>>();

	for (const entry of entries) {
		// Add forward conflicts
		if (!conflictMap.has(entry.property)) {
			conflictMap.set(entry.property, new Set());
		}
		for (const conflict of entry.conflictsWith) {
			conflictMap.get(entry.property)!.add(conflict);
		}

		// Add reverse conflicts (ensure bidirectionality)
		for (const conflict of entry.conflictsWith) {
			if (!conflictMap.has(conflict)) {
				conflictMap.set(conflict, new Set());
			}
			conflictMap.get(conflict)!.add(entry.property);
		}
	}

	return conflictMap;
}

/**
 * Convert property name to flag name
 * host_header → --host-header
 */
function propertyToFlagName(property: string): string {
	return "--" + property.replace(/_/g, "-");
}

/**
 * Convert flag name to property name
 * --host-header → host_header
 */
function flagToPropertyName(flag: string): string {
	return flag.replace(/^--/, "").replace(/-/g, "_");
}

// ============================================================================
// Main Generator
// ============================================================================

async function main(): Promise<void> {
	console.log("🔍 Extracting x-f5xc-conflicts-with from OpenAPI specs...\n");

	const specsDir = ".specs";
	const mainSpecPath = path.join(specsDir, "openapi.json");
	const outputPath = path.join("src", "types", "conflicts_generated.ts");

	// Read main spec
	if (!fs.existsSync(mainSpecPath)) {
		console.error(`❌ OpenAPI spec not found: ${mainSpecPath}`);
		console.error(
			"   Run 'make download-specs' first to download API specifications.",
		);
		process.exit(1);
	}

	console.log(`📖 Reading ${mainSpecPath}...`);
	const specContent = fs.readFileSync(mainSpecPath, "utf-8");
	const spec: OpenAPISpec = JSON.parse(specContent);
	console.log(`✓ Loaded spec v${spec.info.version}`);

	// Extract conflicts
	console.log("\n🔍 Extracting conflicts from schemas...");
	const allConflicts = extractConflictsFromSpec(spec);
	console.log(`✓ Found ${allConflicts.length} conflict definitions`);

	// Build consolidated conflict map
	const conflictMap = buildConflictMap(allConflicts);
	console.log(`✓ Built conflict map with ${conflictMap.size} unique properties`);

	// Count total conflict relationships
	let totalRelationships = 0;
	for (const conflicts of conflictMap.values()) {
		totalRelationships += conflicts.size;
	}
	console.log(`✓ Total conflict relationships: ${totalRelationships}`);

	// Generate TypeScript file
	console.log("\n📝 Generating TypeScript file...");

	// Sort entries for deterministic output
	const sortedEntries = Array.from(conflictMap.entries()).sort((a, b) =>
		a[0].localeCompare(b[0]),
	);

	// Build the map entries as string
	const mapEntries = sortedEntries
		.map(([property, conflicts]) => {
			const conflictArray = Array.from(conflicts).sort();
			const conflictStrings = conflictArray
				.map((c) => `"${c}"`)
				.join(", ");
			return `\t["${property}", [${conflictStrings}]]`;
		})
		.join(",\n");

	const outputContent = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from .specs/openapi.json v${spec.info.version}
 * Contains property conflict mappings from x-f5xc-conflicts-with extension
 *
 * Run: npx tsx scripts/generate-conflicts.ts
 */

/**
 * Property conflicts extracted from OpenAPI spec
 * Maps property names to arrays of conflicting property names
 *
 * Example:
 *   "host_header" → ["use_origin_server_name"]
 *   "use_origin_server_name" → ["host_header"]
 *
 * When a flag derived from one property is used, flags derived from
 * conflicting properties should be hidden from completion suggestions.
 */
export const PROPERTY_CONFLICTS: Map<string, string[]> = new Map([
${mapEntries}
]);

/**
 * Convert property name to CLI flag name
 * @param property - OpenAPI property name (e.g., "host_header")
 * @returns CLI flag name (e.g., "--host-header")
 */
export function propertyToFlagName(property: string): string {
	return "--" + property.replace(/_/g, "-");
}

/**
 * Convert CLI flag name to property name
 * @param flag - CLI flag name (e.g., "--host-header")
 * @returns OpenAPI property name (e.g., "host_header")
 */
export function flagToPropertyName(flag: string): string {
	return flag.replace(/^--/, "").replace(/-/g, "_");
}

/**
 * Get conflicting flags for a given flag
 * @param flagName - CLI flag name (e.g., "--host-header")
 * @returns Array of conflicting flag names (e.g., ["--use-origin-server-name"])
 */
export function getConflictsForFlag(flagName: string): string[] {
	const propertyName = flagToPropertyName(flagName);
	const conflicts = PROPERTY_CONFLICTS.get(propertyName);
	if (!conflicts || conflicts.length === 0) {
		return [];
	}
	return conflicts.map(propertyToFlagName);
}

/**
 * Check if two flags conflict with each other
 * @param flag1 - First CLI flag name
 * @param flag2 - Second CLI flag name
 * @returns true if the flags conflict
 */
export function flagsConflict(flag1: string, flag2: string): boolean {
	const conflicts = getConflictsForFlag(flag1);
	return conflicts.includes(flag2);
}

/**
 * Spec version used for generation
 */
export const CONFLICTS_SPEC_VERSION = "${spec.info.version}";

/**
 * Total number of properties with conflicts
 */
export const CONFLICT_PROPERTY_COUNT = ${conflictMap.size};

/**
 * Total number of conflict relationships
 */
export const CONFLICT_RELATIONSHIP_COUNT = ${totalRelationships};
`;

	// Ensure output directory exists
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// Write output file
	fs.writeFileSync(outputPath, outputContent, "utf-8");

	// Format with Prettier
	try {
		execSync(`npx prettier --write "${outputPath}"`, {
			stdio: "pipe",
			encoding: "utf-8",
		});
		console.log(`✓ Formatted: ${outputPath}`);
	} catch {
		console.warn(`⚠️  Prettier formatting skipped (not available)`);
	}

	console.log(`✓ Generated: ${outputPath}`);
	console.log(
		`\n✅ Conflict generation complete! (${conflictMap.size} properties, ${totalRelationships} relationships)`,
	);

	// Show some example conflicts
	console.log("\n📋 Sample conflicts:");
	let shown = 0;
	for (const [property, conflicts] of sortedEntries) {
		if (shown >= 5) break;
		const flagName = propertyToFlagName(property);
		const conflictFlags = Array.from(conflicts)
			.map(propertyToFlagName)
			.join(", ");
		console.log(`   ${flagName} ⚔️  ${conflictFlags}`);
		shown++;
	}
	if (sortedEntries.length > 5) {
		console.log(`   ... and ${sortedEntries.length - 5} more`);
	}
}

main().catch((err) => {
	console.error("❌ Generation failed:", err);
	process.exit(1);
});
