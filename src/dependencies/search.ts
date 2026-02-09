/**
 * Reference search utilities for finding resource references in object trees
 */

import type { FoundReference, SearchOptions } from "./types.js";

/**
 * Common field names that typically contain resource references
 */
const REFERENCE_FIELD_NAMES = [
  "name",
  "pool_name",
  "origin_pool",
  "healthcheck",
  "health_check",
  "certificate",
  "ref",
  "reference",
  "tenant",
  "namespace",
  "kind",
];

/**
 * Recursively search an object tree for references to a target resource
 *
 * @param obj - The object to search
 * @param options - Search options
 * @param currentPath - Current path in the object tree (for recursion)
 * @param depth - Current depth in the object tree (for recursion)
 * @param results - Accumulated results (for recursion)
 * @returns Array of found references
 */
export function searchForReferences(
  obj: unknown,
  options: SearchOptions,
  currentPath = "",
  depth = 0,
  results: FoundReference[] = [],
): FoundReference[] {
  const maxDepth = options.maxDepth ?? 10;

  // Stop if we've gone too deep
  if (depth > maxDepth) {
    return results;
  }

  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return results;
  }

  // Check if current value is a direct string match
  if (typeof obj === "string" && obj === options.targetName) {
    results.push({ path: currentPath || "(root)", value: obj });
    return results;
  }

  // Handle objects and arrays
  if (typeof obj === "object") {
    // Handle arrays
    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => {
        const itemPath = currentPath ? `${currentPath}[${idx}]` : `[${idx}]`;
        searchForReferences(item, options, itemPath, depth + 1, results);
      });
    }
    // Handle objects
    else {
      const record = obj as Record<string, unknown>;

      // First check common reference fields
      for (const fieldName of REFERENCE_FIELD_NAMES) {
        if (fieldName in record && record[fieldName] === options.targetName) {
          const fieldPath = currentPath
            ? `${currentPath}.${fieldName}`
            : fieldName;
          results.push({
            path: fieldPath,
            value: options.targetName,
          });
        }
      }

      // Then recurse into all fields
      for (const [key, value] of Object.entries(record)) {
        const fieldPath = currentPath ? `${currentPath}.${key}` : key;
        searchForReferences(value, options, fieldPath, depth + 1, results);
      }
    }
  }

  return results;
}

/**
 * Search a list of resources for references to a target
 *
 * @param resources - Array of resource objects to search
 * @param targetName - Name of the resource to find references to
 * @param targetType - Type of the resource being searched for
 * @param domainName - Domain name of the resources being searched
 * @returns Array of found references with resource names and paths
 */
export function searchResourceList(
  resources: Array<Record<string, unknown>>,
  targetName: string,
  targetType: string,
  _domainName: string,
): Array<{ resourceName: string; fieldPath: string; fieldValue: string }> {
  const matches: Array<{
    resourceName: string;
    fieldPath: string;
    fieldValue: string;
  }> = [];

  for (const resource of resources) {
    const resourceName =
      (resource.metadata as Record<string, unknown>)?.name ??
      (resource.name as string) ??
      "(unknown)";

    const options: SearchOptions = {
      targetName,
      targetType,
      maxDepth: 10,
    };

    const references = searchForReferences(resource, options);

    for (const ref of references) {
      matches.push({
        resourceName: String(resourceName),
        fieldPath: ref.path,
        fieldValue: String(ref.value),
      });
    }
  }

  return matches;
}

/**
 * Extract a simplified path for display (removes array indices in some cases)
 *
 * @param path - Full path from search
 * @returns Simplified path for display
 */
export function simplifyPath(path: string): string {
  // Convert spec.pools[0].origin_pool to spec.pools[].origin_pool for readability
  return path.replace(/\[\d+\]/g, "[]");
}
