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
interface CommonError {
  code: number;
  message: string;
  solution?: string;
}

interface SideEffects {
  creates?: string[];
  updates?: string[];
  deletes?: string[];
}

interface OperationConditions {
  prerequisites?: string[];
  postconditions?: string[];
}

interface OperationMetadata {
  purpose?: string;
  required_fields?: string[];
  optional_fields?: string[];
  field_docs?: Record<string, string>;
  conditions?: OperationConditions;
  side_effects?: SideEffects;
  danger_level?: string;
  confirmation_required?: boolean;
  common_errors?: CommonError[];
  performance_impact?: {
    latency?: string;
    resource_usage?: string;
  };
}

interface ExternalDocs {
  url?: string;
  description?: string;
}

interface OpenAPISchemaProperty {
  type?: string;
  description?: string;
  default?: unknown;
  "x-f5xc-server-default"?: boolean;
  "x-f5xc-required-for"?: {
    create?: boolean;
    update?: boolean;
    read?: boolean;
    minimum_config?: boolean;
  };
  "x-ves-required"?: string;
  properties?: Record<string, OpenAPISchemaProperty>;
  $ref?: string;
}

interface OpenAPISchema {
  type?: string;
  properties?: Record<string, OpenAPISchemaProperty>;
  required?: string[];
}

interface OpenAPIRequestBody {
  content?: {
    "application/json"?: {
      schema?: {
        $ref?: string;
      };
    };
  };
}

interface OpenAPIOperation {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  externalDocs?: ExternalDocs;
  "x-f5xc-danger-level"?: string;
  "x-f5xc-namespace-scope"?: string | null;
  "x-f5xc-operation-metadata"?: OperationMetadata;
  requestBody?: OpenAPIRequestBody;
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
    "x-f5xc-cli-domain"?: string;
  };
  paths: Record<string, OpenAPIPathItem>;
  components?: {
    schemas?: Record<string, OpenAPISchema>;
  };
  tags?: Array<{
    name: string;
    description?: string;
  }>;
}

// Output types - safety metadata
interface OperationSideEffects {
  creates?: string[];
  updates?: string[];
  deletes?: string[];
}

interface OperationCommonError {
  code: number;
  message: string;
  solution?: string;
}

interface OperationExternalDocs {
  url?: string;
  description?: string;
}

interface OperationInfo {
  action: string; // "create", "list", "get", "delete", "replace"
  resourceType: string; // "http_loadbalancer", "api_crawler"
  operationId: string;
  summary: string;
  description: string;
  purpose?: string;
  path: string;
  // Safety metadata (from upstream enrichment)
  dangerLevel?: "low" | "medium" | "high";
  requiredFields?: string[];
  optionalFields?: string[];
  sideEffects?: OperationSideEffects;
  confirmationRequired?: boolean;
  commonErrors?: OperationCommonError[];
  // Documentation
  externalDocs?: OperationExternalDocs;
  // Namespace scope
  namespaceScope?: "system" | "shared" | "any" | null;
  // Field defaults from spec
  fieldDefaults?: Record<
    string,
    {
      value: unknown;
      serverDefault: boolean;
      requiredForCreate: boolean;
    }
  >;
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
  const segments = pathPattern
    .split("/")
    .filter((s) => s && !s.startsWith("{"));
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

  const domain =
    spec.info["x-f5xc-cli-domain"] || path.basename(specPath, ".json");
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
        operationId:
          operation.operationId || `${domain}.${action}.${resourceType}`,
        summary:
          operation.summary ||
          `${titleCase(action)} ${titleCase(resourceType)}`,
        description: operation.description || operation.summary || "",
        path: pathPattern,
      };

      // Extract operation metadata if available
      const metadata = operation["x-f5xc-operation-metadata"];
      if (metadata) {
        if (metadata.purpose) {
          opInfo.purpose = metadata.purpose;
        }
        if (metadata.required_fields?.length) {
          opInfo.requiredFields = metadata.required_fields;
        }
        if (metadata.optional_fields?.length) {
          opInfo.optionalFields = metadata.optional_fields;
        }
        if (metadata.side_effects) {
          opInfo.sideEffects = {
            creates: metadata.side_effects.creates,
            updates: metadata.side_effects.updates,
            deletes: metadata.side_effects.deletes,
          };
        }
        if (metadata.confirmation_required !== undefined) {
          opInfo.confirmationRequired = metadata.confirmation_required;
        }
        if (metadata.common_errors?.length) {
          opInfo.commonErrors = metadata.common_errors.map((e) => ({
            code: e.code,
            message: e.message,
            solution: e.solution,
          }));
        }
        // danger_level from metadata takes precedence
        if (metadata.danger_level) {
          opInfo.dangerLevel = metadata.danger_level as
            | "low"
            | "medium"
            | "high";
        }
      }

      // Extract x-f5xc-danger-level (top-level takes precedence if present)
      if (operation["x-f5xc-danger-level"]) {
        opInfo.dangerLevel = operation["x-f5xc-danger-level"] as
          | "low"
          | "medium"
          | "high";
      }

      // Extract x-f5xc-namespace-scope
      if (operation["x-f5xc-namespace-scope"] !== undefined) {
        opInfo.namespaceScope = operation["x-f5xc-namespace-scope"] as
          | "system"
          | "shared"
          | "any"
          | null;
      }

      // Extract externalDocs
      if (operation.externalDocs) {
        opInfo.externalDocs = {
          url: operation.externalDocs.url,
          description: operation.externalDocs.description,
        };
      }

      // Extract field defaults from requestBody schema (for create operations)
      if (
        action === "create" &&
        operation.requestBody?.content?.["application/json"]?.schema?.$ref
      ) {
        const schemaRef =
          operation.requestBody.content["application/json"].schema.$ref;
        const schemaName = schemaRef.split("/").pop();

        if (schemaName && spec.components?.schemas?.[schemaName]) {
          let schema = spec.components.schemas[schemaName];

          // Handle nested spec references (e.g., healthcheckCreateRequest -> spec -> healthcheckCreateSpecType)
          if (schema.properties?.spec?.["$ref"]) {
            const specRef = schema.properties.spec["$ref"];
            const specSchemaName = specRef.split("/").pop();
            if (specSchemaName && spec.components.schemas[specSchemaName]) {
              schema = spec.components.schemas[specSchemaName];
            }
          }

          const fieldDefaults: Record<
            string,
            {
              value: unknown;
              serverDefault: boolean;
              requiredForCreate: boolean;
            }
          > = {};

          // Extract defaults from schema properties
          if (schema.properties) {
            for (const [fieldName, prop] of Object.entries(schema.properties)) {
              // Only include fields with actual defaults or server defaults
              if (
                prop.default !== undefined ||
                prop["x-f5xc-server-default"] === true
              ) {
                fieldDefaults[fieldName] = {
                  value: prop.default,
                  serverDefault: prop["x-f5xc-server-default"] === true,
                  requiredForCreate:
                    prop["x-f5xc-required-for"]?.create === true,
                };
              }
            }
          }

          // Only add fieldDefaults if we found any
          if (Object.keys(fieldDefaults).length > 0) {
            opInfo.fieldDefaults = fieldDefaults;
          }
        }
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
  const descriptionShort =
    fullDescription.length > 60
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

  // Safety metadata
  if (op.dangerLevel) {
    code += `\t\t\tdangerLevel: "${op.dangerLevel}",\n`;
  }
  if (op.requiredFields?.length) {
    const fields = op.requiredFields
      .map((f) => `"${escapeString(f)}"`)
      .join(", ");
    code += `\t\t\trequiredFields: [${fields}],\n`;
  }
  if (op.optionalFields?.length) {
    const fields = op.optionalFields
      .map((f) => `"${escapeString(f)}"`)
      .join(", ");
    code += `\t\t\toptionalFields: [${fields}],\n`;
  }
  if (op.sideEffects) {
    const parts: string[] = [];
    if (op.sideEffects.creates?.length) {
      parts.push(
        `creates: [${op.sideEffects.creates.map((c) => `"${escapeString(c)}"`).join(", ")}]`,
      );
    }
    if (op.sideEffects.updates?.length) {
      parts.push(
        `updates: [${op.sideEffects.updates.map((u) => `"${escapeString(u)}"`).join(", ")}]`,
      );
    }
    if (op.sideEffects.deletes?.length) {
      parts.push(
        `deletes: [${op.sideEffects.deletes.map((d) => `"${escapeString(d)}"`).join(", ")}]`,
      );
    }
    if (parts.length > 0) {
      code += `\t\t\tsideEffects: { ${parts.join(", ")} },\n`;
    }
  }
  if (op.confirmationRequired !== undefined) {
    code += `\t\t\tconfirmationRequired: ${op.confirmationRequired},\n`;
  }
  if (op.commonErrors?.length) {
    const errors = op.commonErrors
      .map((e) => {
        const errParts = [
          `code: ${e.code}`,
          `message: "${escapeString(e.message)}"`,
        ];
        if (e.solution) {
          errParts.push(`solution: "${escapeString(e.solution)}"`);
        }
        return `{ ${errParts.join(", ")} }`;
      })
      .join(", ");
    code += `\t\t\tcommonErrors: [${errors}],\n`;
  }

  // External docs
  if (op.externalDocs?.url) {
    const docParts = [`url: "${escapeString(op.externalDocs.url)}"`];
    if (op.externalDocs.description) {
      docParts.push(
        `description: "${escapeString(op.externalDocs.description)}"`,
      );
    }
    code += `\t\t\texternalDocs: { ${docParts.join(", ")} },\n`;
  }

  // Namespace scope
  if (op.namespaceScope !== undefined) {
    if (op.namespaceScope === null) {
      code += `\t\t\tnamespaceScope: null,\n`;
    } else {
      code += `\t\t\tnamespaceScope: "${op.namespaceScope}",\n`;
    }
  }

  // Field defaults
  if (op.fieldDefaults && Object.keys(op.fieldDefaults).length > 0) {
    const defaultEntries: string[] = [];
    for (const [fieldName, defaults] of Object.entries(op.fieldDefaults)) {
      const valueStr = JSON.stringify(defaults.value);
      defaultEntries.push(
        `"${escapeString(fieldName)}": { value: ${valueStr}, serverDefault: ${defaults.serverDefault}, requiredForCreate: ${defaults.requiredForCreate} }`,
      );
    }
    code += `\t\t\tfieldDefaults: { ${defaultEntries.join(", ")} },\n`;
  }

  code += `\t\t}`;
  return code;
}

/**
 * Generate TypeScript code for a domain
 */
function generateDomainEntry(domainOps: DomainOperations): string {
  const operationEntries = domainOps.operations
    .map(generateOperationEntry)
    .join(",\n");
  const resourceTypesArray = domainOps.resourceTypes
    .map((r) => `"${escapeString(r)}"`)
    .join(", ");

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

  console.log(
    `✓ Processed ${domainOperations.length} domains with ${totalOperations} total operations`,
  );

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
 * Side effects of an operation
 */
export interface OperationSideEffects {
	creates?: string[];
	updates?: string[];
	deletes?: string[];
}

/**
 * Common error with solution
 */
export interface OperationCommonError {
	code: number;
	message: string;
	solution?: string;
}

/**
 * External documentation link
 */
export interface OperationExternalDocs {
	url?: string;
	description?: string;
}

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
	/** Purpose from x-f5xc-operation-metadata (if available) */
	purpose?: string;
	/** API path pattern */
	path: string;
	/** Danger level for safety warnings */
	dangerLevel?: "low" | "medium" | "high";
	/** Required fields for this operation */
	requiredFields?: string[];
	/** Optional fields for this operation */
	optionalFields?: string[];
	/** Side effects (creates, updates, deletes) */
	sideEffects?: OperationSideEffects;
	/** Whether confirmation is required before execution */
	confirmationRequired?: boolean;
	/** Common errors with solutions */
	commonErrors?: OperationCommonError[];
	/** External documentation link */
	externalDocs?: OperationExternalDocs;
	/** Namespace scope restriction */
	namespaceScope?: "system" | "shared" | "any" | null;
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
  console.log(
    `   ${domainOperations.length} domains, ${totalOperations} operations, ${totalResources} resource types`,
  );
}

main().catch((err) => {
  console.error("❌ Generation failed:", err);
  process.exit(1);
});
