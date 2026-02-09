#!/usr/bin/env npx tsx
/**
 * Resource Discovery Script
 * Dynamically discovers ALL resources from OpenAPI specs without hardcoding
 *
 * Core Principle: ZERO STATIC DEFINITIONS
 * - Parses .specs/index.json and domain specs programmatically
 * - Extracts resource types from URL patterns using regex
 * - Auto-categorizes by pattern analysis (NO hardcoded lists)
 * - When upstream API changes → npm run build → everything updates
 *
 * Run: npx tsx scripts/discover-resources.ts
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Type Definitions
// ============================================================================

type ResourceCategory = "crud" | "analytics" | "utility" | "management";

interface DiscoveredResource {
  name: string; // Extracted from URL path
  operations: string[]; // Derived from HTTP methods
  paths: string[]; // Original OpenAPI paths
  category: ResourceCategory; // Auto-categorized
  description: string; // From OpenAPI description
  source: "discovered";
  httpMethods: string[]; // Raw HTTP methods found
}

interface PathInfo {
  domain: string;
  resourceType: string;
  isDataAPI: boolean;
  isConfigAPI: boolean;
}

interface OpenAPIOperation {
  summary?: string;
  description?: string;
  operationId?: string;
  "x-f5xc-operation-metadata"?: {
    purpose?: string;
    [key: string]: unknown;
  };
}

interface OpenAPIPathItem {
  get?: OpenAPIOperation;
  post?: OpenAPIOperation;
  put?: OpenAPIOperation;
  delete?: OpenAPIOperation;
  patch?: OpenAPIOperation;
}

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    description: string;
    "x-f5xc-cli-domain"?: string;
  };
  paths: Record<string, OpenAPIPathItem>;
}

interface SpecsIndex {
  specifications: Array<{
    domain: string;
    file: string;
    "x-f5xc-primary-resources"?: Array<{
      name: string;
      description?: string;
    }>;
  }>;
}

interface DomainDiscovery {
  domain: string;
  primaryResources: string[]; // From upstream x-f5xc-primary-resources
  discoveredResources: DiscoveredResource[];
  totalPaths: number;
  discoveryTimestamp: string;
}

// ============================================================================
// Path Parsing Logic - GENERIC, NO HARDCODING
// ============================================================================

/**
 * Parse resource path to extract resource type
 * Uses SIMPLE PATTERN: get last non-parameter segment
 * Matches generate-operations.ts approach - NO COMPLEX REGEX
 */
function parseResourcePath(pathPattern: string): PathInfo | null {
  // Skip non-API paths
  if (!pathPattern.startsWith("/api/")) {
    return null;
  }

  // Split path and filter out empty segments and parameters (starting with {)
  const segments = pathPattern
    .split("/")
    .filter((s) => s && !s.startsWith("{"));

  if (segments.length < 3) {
    // Need at least ["api", "config/ml/data", "..."]
    return null;
  }

  // Get the last segment - this is the resource type/operation
  const lastSegment = segments[segments.length - 1];
  const resourceType = singularize(lastSegment);

  // Determine if it's a data API (analytics) or config API
  const isDataAPI = pathPattern.includes("/api/ml/data/");
  const isConfigAPI = pathPattern.includes("/api/config/");

  return {
    domain: "unknown", // Will be set by caller
    resourceType,
    isDataAPI,
    isConfigAPI,
  };
}

/**
 * Singularize resource name (remove plural 's' or 'ies')
 * Pattern-based, not dictionary-based
 */
function singularize(resourceName: string): string {
  // Handle 'ies' → 'y' (e.g., policies → policy)
  if (resourceName.endsWith("ies")) {
    return resourceName.replace(/ies$/, "y");
  }

  // Handle 's' → '' (e.g., loadbalancers → loadbalancer)
  // But not 'ss' (e.g., address → address)
  if (resourceName.endsWith("s") && !resourceName.endsWith("ss")) {
    return resourceName.slice(0, -1);
  }

  return resourceName;
}

/**
 * Auto-categorize resource by pattern analysis
 * NO HARDCODED LISTS - uses naming patterns only
 */
function categorizeResource(
  name: string,
  isDataAPI: boolean,
  httpMethods: string[] = [],
): ResourceCategory {
  // Analytics/Data API patterns
  if (isDataAPI) {
    return "analytics";
  }

  // Analytics keywords in resource name
  if (
    name.includes("stat") ||
    name.includes("metric") ||
    name.includes("analytics") ||
    name.includes("calls_by") ||
    name.includes("top_") ||
    name.includes("summary")
  ) {
    return "analytics";
  }

  // Utility patterns
  if (
    name === "swagger_spec" ||
    name === "pdf" ||
    name === "schema" ||
    name.includes("schema") ||
    name.includes("swagger")
  ) {
    return "utility";
  }

  // Management/operational patterns
  if (
    name.includes("subscribe") ||
    name.includes("unsubscribe") ||
    name.includes("assign") ||
    name.includes("ticket") ||
    name.includes("subscription") ||
    name === "available"
  ) {
    return "management";
  }

  // Default: CRUD resource
  // Has standard HTTP methods (GET, POST, PUT, DELETE)
  return "crud";
}

/**
 * Map HTTP methods to CLI actions
 */
function mapMethodsToOperations(
  methods: string[],
  hasNameParameter: boolean,
): string[] {
  const operations: string[] = [];

  for (const method of methods) {
    switch (method.toLowerCase()) {
      case "get":
        operations.push(hasNameParameter ? "get" : "list");
        break;
      case "post":
        operations.push("create");
        break;
      case "put":
        operations.push("replace");
        break;
      case "delete":
        operations.push("delete");
        break;
      case "patch":
        operations.push("update");
        break;
    }
  }

  return operations;
}

// ============================================================================
// Resource Discovery Engine
// ============================================================================

/**
 * Discover all resources from a single OpenAPI spec
 * ZERO HARDCODING - everything discovered from paths
 */
function discoverResourcesFromSpec(spec: OpenAPISpec): DiscoveredResource[] {
  const resources = new Map<string, DiscoveredResource>();

  // Parse ALL paths in OpenAPI spec
  for (const [pathPattern, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem || typeof pathItem !== "object") continue;

    const parsed = parseResourcePath(pathPattern);
    if (!parsed) continue;

    const { resourceType, isDataAPI } = parsed;
    const hasNameParam =
      pathPattern.includes("{name}") || pathPattern.includes("{metadata.name}");

    // Collect HTTP methods
    const methods: string[] = [];
    if (pathItem.get) methods.push("GET");
    if (pathItem.post) methods.push("POST");
    if (pathItem.put) methods.push("PUT");
    if (pathItem.delete) methods.push("DELETE");
    if (pathItem.patch) methods.push("PATCH");

    // Create or update resource entry
    if (!resources.has(resourceType)) {
      const category = categorizeResource(resourceType, isDataAPI, methods);

      // Priority: x-f5xc-operation-metadata.purpose > description > summary
      const description =
        pathItem.post?.["x-f5xc-operation-metadata"]?.purpose ||
        pathItem.get?.["x-f5xc-operation-metadata"]?.purpose ||
        pathItem.post?.description ||
        pathItem.get?.description ||
        pathItem.post?.summary ||
        pathItem.get?.summary ||
        "";

      resources.set(resourceType, {
        name: resourceType,
        operations: [],
        paths: [],
        category,
        description,
        source: "discovered",
        httpMethods: [],
      });
    }

    const resource = resources.get(resourceType)!;

    // Add operations derived from HTTP methods
    const ops = mapMethodsToOperations(methods, hasNameParam);
    for (const op of ops) {
      if (!resource.operations.includes(op)) {
        resource.operations.push(op);
      }
    }

    // Track paths and methods
    resource.paths.push(pathPattern);
    for (const method of methods) {
      if (!resource.httpMethods.includes(method)) {
        resource.httpMethods.push(method);
      }
    }
  }

  return Array.from(resources.values()).sort((a, b) => {
    // Sort by category first, then name
    if (a.category !== b.category) {
      const order = { crud: 0, analytics: 1, utility: 2, management: 3 };
      return order[a.category] - order[b.category];
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Load and discover resources for all domains
 */
async function discoverAllDomains(): Promise<DomainDiscovery[]> {
  const indexPath = path.join(process.cwd(), ".specs", "index.json");
  const domainsDir = path.join(process.cwd(), ".specs", "domains");

  if (!fs.existsSync(indexPath)) {
    throw new Error(
      `Specs index not found: ${indexPath}\nRun 'make download-specs' first`,
    );
  }

  const indexContent = fs.readFileSync(indexPath, "utf-8");
  const specsIndex: SpecsIndex = JSON.parse(indexContent);

  const discoveries: DomainDiscovery[] = [];

  for (const specInfo of specsIndex.specifications) {
    const specPath = path.join(domainsDir, specInfo.file);

    if (!fs.existsSync(specPath)) {
      console.warn(`⚠️  Spec file not found: ${specPath}`);
      continue;
    }

    const specContent = fs.readFileSync(specPath, "utf-8");
    const spec: OpenAPISpec = JSON.parse(specContent);

    const discoveredResources = discoverResourcesFromSpec(spec);

    // Extract primary resources from upstream
    const primaryResources =
      specInfo["x-f5xc-primary-resources"]?.map((r) => r.name) || [];

    discoveries.push({
      domain: specInfo.domain,
      primaryResources,
      discoveredResources,
      totalPaths: Object.keys(spec.paths).length,
      discoveryTimestamp: new Date().toISOString(),
    });

    console.log(
      `✅ ${specInfo.domain}: ${discoveredResources.length} resources discovered from ${Object.keys(spec.paths).length} paths`,
    );
  }

  return discoveries;
}

// ============================================================================
// CLI Interface
// ============================================================================

async function main() {
  console.log("🔍 Resource Discovery Starting...\n");
  console.log("Core Principle: ZERO STATIC DEFINITIONS");
  console.log("All resources discovered from OpenAPI specs\n");

  try {
    const discoveries = await discoverAllDomains();

    // Summary statistics
    const totalDiscovered = discoveries.reduce(
      (sum, d) => sum + d.discoveredResources.length,
      0,
    );
    const totalPrimary = discoveries.reduce(
      (sum, d) => sum + d.primaryResources.length,
      0,
    );

    console.log("\n📊 Discovery Summary:");
    console.log(`   Total Domains: ${discoveries.length}`);
    console.log(`   Total Primary Resources: ${totalPrimary}`);
    console.log(`   Total Discovered Resources: ${totalDiscovered}`);
    console.log(
      `   Discovery Coverage: ${totalDiscovered - totalPrimary} additional resources`,
    );

    // Save discoveries to file
    const outputPath = path.join(
      process.cwd(),
      "claudedocs",
      "resource-discovery.json",
    );
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(discoveries, null, 2));
    console.log(`\n💾 Discovery results saved to: ${outputPath}`);

    // Show domains with significant differences
    console.log("\n🔍 Domains with Missing Resources (Primary < Discovered):");
    const significant = discoveries
      .filter(
        (d) => d.discoveredResources.length > d.primaryResources.length + 2,
      )
      .sort(
        (a, b) =>
          b.discoveredResources.length -
          b.primaryResources.length -
          (a.discoveredResources.length - a.primaryResources.length),
      );

    for (const d of significant.slice(0, 10)) {
      const missing = d.discoveredResources.length - d.primaryResources.length;
      console.log(
        `   ${d.domain}: ${d.primaryResources.length} primary → ${d.discoveredResources.length} discovered (+${missing})`,
      );
    }

    console.log("\n✅ Resource discovery complete!");
  } catch (error) {
    console.error("❌ Discovery failed:", error);
    process.exit(1);
  }
}

// Export for use in other scripts
export { discoverResourcesFromSpec, discoverAllDomains, type DomainDiscovery };

// Run if executed directly (ESM pattern)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
