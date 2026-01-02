#!/usr/bin/env npx tsx
/**
 * Operations Generator Script
 * Generates src/types/operations_generated.ts from .specs/domains/*.json OpenAPI specs
 *
 * Extracts operation-level descriptions to use upstream API specs as single source of truth.
 *
 * Run: npx tsx scripts/generate-operations.ts
 */

import * as fs from "fs";
import * as path from "path";

// Types for OpenAPI spec structure
interface OpenAPIOperation {
	summary?: string;
	description?: string;
	operationId?: string;
	tags?: string[];
	"x-ves-operation-metadata"?: {
		purpose?: string;
		side_effects?: Record<string, unknown>;
		common_errors?: string[];
	};
}

interface OpenAPIPathItem {
	get?: OpenAPIOperation;
	post?: OpenAPIOperation;
	put?: OpenAPIOperation;
	delete?: OpenAPIOperation;
	patch?: OpenAPIOperation;
	"x-displayname"?: string;
}

interface OpenAPISpec {
	openapi: string;
	info: {
		title: string;
		description: string;
		version: string;
		"x-ves-cli-domain"?: string;
	};
	paths: Record<string, OpenAPIPathItem>;
	tags?: Array<{
		name: string;
		description?: string;
	}>;
}

// Output types
interface OperationInfo {
	action: string; // "create", "list", "get", "delete", "replace"
	resourceType: string; // "http_loadbalancer", "api_crawler"
	operationId: string;
	summary: string;
	description: string;
	purpose?: string;
	path: string;
}

interface DomainOperations {
	domain: string;
	displayName: string;
	description: string;
	descriptionShort: string;
	operations: OperationInfo[];
	resourceTypes: string[];
}

/**
 * Map HTTP method + path pattern to CLI action
 */
function mapToAction(method: string, pathPattern: string): string {
	const isItemPath =
		pathPattern.includes("{name}") || pathPattern.includes("{metadata.name}");

	switch (method.toLowerCase()) {
		case "post":
			return "create";
		case "get":
			return isItemPath ? "get" : "list";
		case "put":
			return "replace";
		case "delete":
			return "delete";
		case "patch":
			return "update";
		default:
			return method.toLowerCase();
	}
}

/**
 * Extract resource type from path
 * e.g., "/api/config/namespaces/{ns}/http_loadbalancers" -> "http_loadbalancer"
 */
function extractResourceType(pathPattern: string): string {
	// Get the last segment before any {name} parameter
	const segments = pathPattern.split("/").filter((s) => s && !s.startsWith("{"));
	const lastSegment = segments[segments.length - 1] || "resource";

	// Singularize common patterns
	if (lastSegment.endsWith("ies")) {
		return lastSegment.replace(/ies$/, "y");
	}
	if (lastSegment.endsWith("s") && !lastSegment.endsWith("ss")) {
		return lastSegment.slice(0, -1);
	}

	return lastSegment;
}

/**
 * Escape string for TypeScript output
 */
function escapeString(s: string): string {
	return s
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/\n/g, " ")
		.replace(/\r/g, "")
		.replace(/\t/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Convert snake_case to Title Case
 */
function titleCase(s: string): string {
	return s
		.split("_")
		.map((part) =>
			part.length > 0 ? part[0].toUpperCase() + part.slice(1) : "",
		)
		.join(" ");
}

/**
 * Process a single OpenAPI spec file
 */
function processSpec(specPath: string): DomainOperations | null {
	const content = fs.readFileSync(specPath, "utf-8");
	const spec: OpenAPISpec = JSON.parse(content);

	const domain = spec.info["x-ves-cli-domain"] || path.basename(specPath, ".json");
	const operations: OperationInfo[] = [];
	const resourceTypesSet = new Set<string>();

	// Process all paths
	for (const [pathPattern, pathItem] of Object.entries(spec.paths)) {
		// Skip non-operation keys
		if (!pathItem || typeof pathItem !== "object") continue;

		// Process each HTTP method
		const methods: Array<[string, OpenAPIOperation | undefined]> = [
			["get", pathItem.get],
			["post", pathItem.post],
			["put", pathItem.put],
			["delete", pathItem.delete],
			["patch", pathItem.patch],
		];

		for (const [method, operation] of methods) {
			if (!operation) continue;

			const action = mapToAction(method, pathPattern);
			const resourceType = extractResourceType(pathPattern);
			resourceTypesSet.add(resourceType);

			const opInfo: OperationInfo = {
				action,
				resourceType,
				operationId: operation.operationId || `${domain}.${action}.${resourceType}`,
				summary: operation.summary || `${titleCase(action)} ${titleCase(resourceType)}`,
				description: operation.description || operation.summary || "",
				path: pathPattern,
			};

			// Extract purpose from x-ves-operation-metadata if available
			if (operation["x-ves-operation-metadata"]?.purpose) {
				opInfo.purpose = operation["x-ves-operation-metadata"].purpose;
			}

			operations.push(opInfo);
		}
	}

	// Skip domains with no operations
	if (operations.length === 0) {
		return null;
	}

	// Create short description from full description
	const fullDescription = spec.info.description || "";
	const descriptionShort = fullDescription.length > 60
		? fullDescription.substring(0, 57) + "..."
		: fullDescription;

	return {
		domain,
		displayName: titleCase(domain),
		description: fullDescription,
		descriptionShort,
		operations,
		resourceTypes: Array.from(resourceTypesSet).sort(),
	};
}

/**
 * Generate TypeScript code for operations
 */
function generateOperationEntry(op: OperationInfo): string {
	let code = `\t\t{\n`;
	code += `\t\t\taction: "${op.action}",\n`;
	code += `\t\t\tresourceType: "${escapeString(op.resourceType)}",\n`;
	code += `\t\t\toperationId: "${escapeString(op.operationId)}",\n`;
	code += `\t\t\tsummary: "${escapeString(op.summary)}",\n`;
	code += `\t\t\tdescription: "${escapeString(op.description)}",\n`;
	if (op.purpose) {
		code += `\t\t\tpurpose: "${escapeString(op.purpose)}",\n`;
	}
	code += `\t\t\tpath: "${escapeString(op.path)}",\n`;
	code += `\t\t}`;
	return code;
}

/**
 * Generate TypeScript code for a domain
 */
function generateDomainEntry(domainOps: DomainOperations): string {
	const operationEntries = domainOps.operations.map(generateOperationEntry).join(",\n");
	const resourceTypesArray = domainOps.resourceTypes.map((r) => `"${escapeString(r)}"`).join(", ");

	let code = `\t["${domainOps.domain}", {\n`;
	code += `\t\tdomain: "${domainOps.domain}",\n`;
	code += `\t\tdisplayName: "${escapeString(domainOps.displayName)}",\n`;
	code += `\t\tdescription: "${escapeString(domainOps.description)}",\n`;
	code += `\t\tdescriptionShort: "${escapeString(domainOps.descriptionShort)}",\n`;
	code += `\t\tresourceTypes: [${resourceTypesArray}],\n`;
	code += `\t\toperations: [\n${operationEntries}\n\t\t],\n`;
	code += `\t}]`;
	return code;
}

/**
 * Main generator function
 */
async function main(): Promise<void> {
	console.log("🏗️  Generating operations from upstream OpenAPI specs...");

	const specsDir = path.join(".specs", "domains");
	const outputPath = path.join("src", "types", "operations_generated.ts");

	// Check if specs directory exists
	if (!fs.existsSync(specsDir)) {
		console.error(`❌ Specs directory not found: ${specsDir}`);
		console.error(
			"   Run 'make download-specs' first to download API specifications.",
		);
		process.exit(1);
	}

	// Get all JSON spec files
	const specFiles = fs
		.readdirSync(specsDir)
		.filter((f) => f.endsWith(".json"))
		.sort();

	console.log(`✓ Found ${specFiles.length} OpenAPI spec files`);

	// Process all specs
	const domainOperations: DomainOperations[] = [];
	let totalOperations = 0;
	let totalResources = 0;

	for (const specFile of specFiles) {
		const specPath = path.join(specsDir, specFile);
		try {
			const domainOps = processSpec(specPath);
			if (domainOps) {
				domainOperations.push(domainOps);
				totalOperations += domainOps.operations.length;
				totalResources += domainOps.resourceTypes.length;
				console.log(
					`  ✓ ${domainOps.domain}: ${domainOps.operations.length} operations, ${domainOps.resourceTypes.length} resources`,
				);
			} else {
				console.log(`  ⊘ ${specFile}: no operations`);
			}
		} catch (err) {
			console.error(`  ✗ ${specFile}: ${err}`);
		}
	}

	// Sort domains alphabetically
	domainOperations.sort((a, b) => a.domain.localeCompare(b.domain));

	console.log(`✓ Processed ${domainOperations.length} domains with ${totalOperations} total operations`);

	// Generate TypeScript file
	const domainEntries = domainOperations.map(generateDomainEntry).join(",\n");

	// Read spec version from index.json if available
	let specVersion = "unknown";
	const indexPath = path.join(".specs", "index.json");
	if (fs.existsSync(indexPath)) {
		try {
			const indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
			specVersion = indexData.version || specVersion;
		} catch {
			// Ignore errors
		}
	}

	const outputContent = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from .specs/domains/*.json OpenAPI specifications
 * Spec version: ${specVersion}
 * Run: npx tsx scripts/generate-operations.ts
 */

/**
 * Operation information extracted from OpenAPI specs
 */
export interface OperationInfo {
	/** CLI action: create, list, get, delete, replace, update */
	action: string;
	/** Resource type (singular): http_loadbalancer, api_crawler */
	resourceType: string;
	/** OpenAPI operationId */
	operationId: string;
	/** Short summary from OpenAPI */
	summary: string;
	/** Full description from OpenAPI */
	description: string;
	/** Purpose from x-ves-operation-metadata (if available) */
	purpose?: string;
	/** API path pattern */
	path: string;
}

/**
 * Domain operations container
 */
export interface DomainOperationsInfo {
	/** Domain name (e.g., "api", "dns") */
	domain: string;
	/** Human-readable display name */
	displayName: string;
	/** Full domain description from OpenAPI */
	description: string;
	/** Short description (~60 chars) */
	descriptionShort: string;
	/** Resource types available in this domain */
	resourceTypes: string[];
	/** All operations in this domain */
	operations: OperationInfo[];
}

/**
 * Spec version used for generation
 */
export const OPERATIONS_SPEC_VERSION = "${specVersion}";

/**
 * Generated operations data from upstream OpenAPI specifications
 */
export const generatedOperations: Map<string, DomainOperationsInfo> = new Map([
${domainEntries}
]);

/**
 * Total statistics
 */
export const OPERATIONS_STATS = {
	domainCount: ${domainOperations.length},
	operationCount: ${totalOperations},
	resourceTypeCount: ${totalResources},
};

/**
 * Get operations for a specific domain
 */
export function getDomainOperations(domain: string): DomainOperationsInfo | undefined {
	return generatedOperations.get(domain);
}

/**
 * Get operation description for a specific domain, action, and resource
 */
export function getOperationDescription(
	domain: string,
	action: string,
	resourceType?: string
): OperationInfo | undefined {
	const domainOps = generatedOperations.get(domain);
	if (!domainOps) return undefined;

	// Find matching operation
	return domainOps.operations.find((op) => {
		if (op.action !== action) return false;
		if (resourceType && op.resourceType !== resourceType) return false;
		return true;
	});
}

/**
 * Get all resource types for a domain
 */
export function getDomainResourceTypes(domain: string): string[] {
	const domainOps = generatedOperations.get(domain);
	return domainOps?.resourceTypes || [];
}
`;

	// Ensure output directory exists
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// Write output file
	fs.writeFileSync(outputPath, outputContent, "utf-8");
	console.log(`✓ Generated: ${outputPath}`);
	console.log(`✅ Operations generation complete!`);
	console.log(`   ${domainOperations.length} domains, ${totalOperations} operations, ${totalResources} resource types`);
}

main().catch((err) => {
	console.error("❌ Generation failed:", err);
	process.exit(1);
});
