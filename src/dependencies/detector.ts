/**
 * Main dependency detection logic
 *
 * Detects which resources are referencing a target resource by querying
 * related domains and searching for references.
 */

import type { APIClient } from "../api/client.js";
import type { DependencyReference, DependencyResult } from "./types.js";
import { getRelatedDomains, hasKnownRelationships } from "./relationships.js";
import { searchResourceList } from "./search.js";
import { allDomains } from "../types/domains.js";

/**
 * Batch size for parallel domain queries (Tier 1)
 */
const BATCH_SIZE = 5;

/**
 * Batch size for Tier 2 all-domain scan
 */
const TIER2_BATCH_SIZE = 10;

/**
 * Timeout for detection in milliseconds
 */
const DETECTION_TIMEOUT_MS = 3000;

/**
 * Maximum number of resources to fetch full specs for (smart batching threshold)
 */
const MAX_RESOURCES_FOR_GET = 10;

/**
 * Pluralize a domain name for API endpoints
 * Simple pluralization - adds 's' or handles common patterns
 *
 * @param domain - Domain name to pluralize
 * @returns Pluralized domain name
 */
function pluralize(domain: string): string {
  // Handle common irregular plurals
  if (domain.endsWith("_policy")) {
    return domain.replace(/_policy$/, "_policies");
  }
  if (domain.endsWith("ss")) {
    return `${domain}es`;
  }
  if (domain.endsWith("ch")) {
    return `${domain}es`;
  }
  if (domain.endsWith("x")) {
    return `${domain}es`;
  }
  // Default: just add 's'
  return `${domain}s`;
}

/**
 * Query multiple domains in parallel batches
 *
 * @param domains - List of domains to query
 * @param namespace - Namespace to query in
 * @param client - API client
 * @param batchSize - Optional batch size (defaults to BATCH_SIZE)
 * @returns Map of domain name to resource list
 */
async function queryDomainsInParallel(
  domains: string[],
  namespace: string,
  client: APIClient,
  batchSize: number = BATCH_SIZE,
): Promise<Map<string, Array<Record<string, unknown>>>> {
  const results = new Map<string, Array<Record<string, unknown>>>();

  // Process domains in batches
  for (let i = 0; i < domains.length; i += batchSize) {
    const batch = domains.slice(i, i + batchSize);

    // Create parallel requests for this batch
    const promises = batch.map((domain) => {
      const pluralDomain = pluralize(domain);
      const apiPath = `/api/config/namespaces/${namespace}/${pluralDomain}`;

      return client
        .get(apiPath)
        .then((response) => {
          // API client returns { statusCode, data, headers, ok }
          // The actual response data is in the 'data' field
          const responseData = (response as { data?: unknown }).data;
          const items =
            (
              responseData as {
                items?: Array<Record<string, unknown>>;
              }
            )?.items ?? [];
          return { domain, items };
        })
        .catch(() => {
          // Ignore errors (e.g., domain doesn't exist), continue with empty results
          return { domain, items: [] };
        });
    });

    // Wait for batch to complete
    const batchResults = await Promise.all(promises);

    // Store results
    for (const { domain, items } of batchResults) {
      results.set(domain, items);
    }
  }

  return results;
}

/**
 * Enrich resource list with full specs by making individual GET requests
 * Only fetches specs if the list is small enough (<=MAX_RESOURCES_FOR_GET)
 *
 * @param domain - Domain name
 * @param resources - List of resources (with metadata only)
 * @param namespace - Namespace
 * @param client - API client
 * @returns Enriched resources with full specs, or original list if too large
 */
async function enrichWithFullSpecs(
  domain: string,
  resources: Array<Record<string, unknown>>,
  namespace: string,
  client: APIClient,
): Promise<Array<Record<string, unknown>>> {
  // Skip if list is too large or empty
  if (resources.length === 0 || resources.length > MAX_RESOURCES_FOR_GET) {
    return resources;
  }

  const pluralDomain = pluralize(domain);
  const enrichedResources: Array<Record<string, unknown>> = [];

  // Fetch full spec for each resource
  for (const resource of resources) {
    const resourceName =
      (resource.metadata as Record<string, unknown>)?.name ??
      (resource.name as string);

    if (!resourceName) {
      enrichedResources.push(resource);
      continue;
    }

    try {
      const apiPath = `/api/config/namespaces/${namespace}/${pluralDomain}/${resourceName}`;
      const response = await client.get(apiPath);
      // API client returns { statusCode, data, headers, ok }
      // Extract the actual resource data
      const fullSpec = (response as { data?: unknown }).data as Record<
        string,
        unknown
      >;
      enrichedResources.push(fullSpec);
    } catch {
      // If GET fails, use the original resource
      enrichedResources.push(resource);
    }
  }

  return enrichedResources;
}

/**
 * Detect dependencies for a resource using Tier 1 (known relationships)
 *
 * @param resourceType - Type of resource being deleted
 * @param resourceName - Name of resource being deleted
 * @param namespace - Namespace containing the resource
 * @param client - API client
 * @returns Dependency detection result
 */
async function detectWithKnownPatterns(
  resourceType: string,
  resourceName: string,
  namespace: string,
  client: APIClient,
): Promise<DependencyReference[]> {
  const references: DependencyReference[] = [];

  // Get related domains from registry
  const relatedDomains = getRelatedDomains(resourceType);

  if (relatedDomains.length === 0) {
    return references;
  }

  // Query related domains in parallel
  const domainResults = await queryDomainsInParallel(
    relatedDomains,
    namespace,
    client,
  );

  // Search each domain's resources for references
  for (const [domain, resources] of domainResults.entries()) {
    // Smart batching: fetch full specs if list is small
    const enrichedResources = await enrichWithFullSpecs(
      domain,
      resources,
      namespace,
      client,
    );

    const matches = searchResourceList(
      enrichedResources,
      resourceName,
      resourceType,
      domain,
    );

    for (const match of matches) {
      references.push({
        domain,
        resourceName: match.resourceName,
        namespace,
        fieldPath: match.fieldPath,
        fieldValue: match.fieldValue,
      });
    }
  }

  return references;
}

/**
 * Detect dependencies for a resource using Tier 2 (all-domain scan)
 *
 * Queries all available domains in the namespace to find references.
 * Used as a fallback when Tier 1 finds no dependencies or for unknown resource types.
 *
 * @param resourceName - Name of resource being deleted
 * @param namespace - Namespace containing the resource
 * @param client - API client
 * @returns Array of dependency references found
 */
async function detectWithAllDomainScan(
  resourceName: string,
  namespace: string,
  client: APIClient,
): Promise<DependencyReference[]> {
  const references: DependencyReference[] = [];

  // Get all available domains
  const allDomainNames = allDomains();

  // Query all domains in parallel batches (with larger batch size for Tier 2)
  const domainResults = await queryDomainsInParallel(
    allDomainNames,
    namespace,
    client,
    TIER2_BATCH_SIZE,
  );

  // Search each domain's resources for references
  for (const [domain, resources] of domainResults.entries()) {
    // Smart batching: fetch full specs if list is small
    const enrichedResources = await enrichWithFullSpecs(
      domain,
      resources,
      namespace,
      client,
    );

    // Use empty resourceType since we're doing a broad scan
    const matches = searchResourceList(
      enrichedResources,
      resourceName,
      "",
      domain,
    );

    for (const match of matches) {
      references.push({
        domain,
        resourceName: match.resourceName,
        namespace,
        fieldPath: match.fieldPath,
        fieldValue: match.fieldValue,
      });
    }
  }

  return references;
}

/**
 * Main dependency detection function
 *
 * Detects which resources are referencing the target resource by:
 * 1. Checking known relationship patterns (Tier 1)
 * 2. If no references found, scanning all domains (Tier 2)
 * 3. Timing out after 3 seconds with graceful fallback
 *
 * @param resourceType - Type of resource being deleted
 * @param resourceName - Name of resource being deleted
 * @param namespace - Namespace containing the resource
 * @param client - API client
 * @returns Promise resolving to dependency detection result
 */
export async function detectDependencies(
  resourceType: string,
  resourceName: string,
  namespace: string,
  client: APIClient,
): Promise<DependencyResult> {
  const startTime = Date.now();

  // Create timeout promise
  const timeoutPromise = new Promise<DependencyResult>((resolve) => {
    setTimeout(() => {
      resolve({
        found: false,
        references: [],
        searchedDomains: [],
        searchTimeMs: DETECTION_TIMEOUT_MS,
      });
    }, DETECTION_TIMEOUT_MS);
  });

  // Create detection promise
  const detectionPromise = async (): Promise<DependencyResult> => {
    const references: DependencyReference[] = [];
    const searchedDomains: string[] = [];

    try {
      // Tier 1: Known relationship patterns
      if (hasKnownRelationships(resourceType)) {
        const relatedDomains = getRelatedDomains(resourceType);
        searchedDomains.push(...relatedDomains);

        const tier1References = await detectWithKnownPatterns(
          resourceType,
          resourceName,
          namespace,
          client,
        );

        references.push(...tier1References);

        // Early exit if references found
        if (references.length > 0) {
          const searchTimeMs = Date.now() - startTime;
          return {
            found: true,
            references,
            searchedDomains,
            searchTimeMs,
          };
        }
      }

      // Tier 2: All-domain scan if no references found in Tier 1 or no known relationships
      const tier2References = await detectWithAllDomainScan(
        resourceName,
        namespace,
        client,
      );

      references.push(...tier2References);

      // Update searched domains to include all domains for Tier 2
      const allDomainNames = allDomains();
      searchedDomains.length = 0; // Clear Tier 1 domains
      searchedDomains.push(...allDomainNames);

      const searchTimeMs = Date.now() - startTime;
      return {
        found: references.length > 0,
        references,
        searchedDomains,
        searchTimeMs,
      };
    } catch (error) {
      console.warn(`Dependency detection error: ${error}`);
      const searchTimeMs = Date.now() - startTime;
      return {
        found: false,
        references: [],
        searchedDomains,
        searchTimeMs,
      };
    }
  };

  // Race between detection and timeout
  return Promise.race([detectionPromise(), timeoutPromise]);
}
