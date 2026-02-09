/**
 * Resource Existence Checking
 * Pre-flight checks for resource existence before delete operations
 */

import { APIError } from "../api/types.js";
import type {
  ExistenceCheckResult,
  ExistenceCheckOptions,
  PreDeleteResult,
  DeleteFlags,
} from "./types.js";
import { findSimilarResources, formatSuggestions } from "./similar.js";
import type { APIClient } from "../api/client.js";

/**
 * Check if a resource exists
 * Uses GET request and checks for 404 status
 */
export async function checkResourceExists(
  options: ExistenceCheckOptions,
): Promise<ExistenceCheckResult> {
  const { client, apiPath, resourceName } = options;

  try {
    const response = await client.get(apiPath);

    if (response.ok) {
      // Extract metadata from response if available
      const data = response.data as {
        metadata?: { name?: string; namespace?: string; uid?: string };
      };

      const result: ExistenceCheckResult = {
        exists: true,
        statusCode: response.statusCode,
      };

      if (data?.metadata) {
        result.metadata = {
          name: data.metadata.name || resourceName,
          namespace: data.metadata.namespace,
          uid: data.metadata.uid,
        };
      }

      return result;
    }

    // Non-OK response but not an error (shouldn't happen normally)
    return {
      exists: false,
      statusCode: response.statusCode,
    };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.statusCode === 404) {
        return {
          exists: false,
          statusCode: 404,
        };
      }

      // Other API errors (auth, server error, etc.)
      return {
        exists: false,
        statusCode: error.statusCode,
        error: error.message,
      };
    }

    // Network or other errors
    return {
      exists: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error checking resource existence",
    };
  }
}

/**
 * Build the list path from a resource path
 * Removes the resource name from the end
 */
function buildListPath(apiPath: string, resourceName: string): string {
  // If path ends with /name, remove it
  if (apiPath.endsWith(`/${resourceName}`)) {
    return apiPath.slice(0, -resourceName.length - 1);
  }
  return apiPath;
}

/**
 * Perform pre-delete checks for a resource
 */
export async function performPreDeleteCheck(
  client: APIClient,
  apiPath: string,
  resourceName: string,
  resourceType: string,
  namespace: string | undefined,
  flags: DeleteFlags,
): Promise<PreDeleteResult> {
  // Check if resource exists
  const existenceResult = await checkResourceExists({
    client,
    apiPath,
    resourceName,
    namespace,
  });

  // Handle errors during existence check
  if (existenceResult.error) {
    return {
      canProceed: false,
      exists: false,
      reason: existenceResult.error,
      message: `Error checking resource: ${existenceResult.error}`,
      hint: "Verify network connectivity and authentication",
    };
  }

  // Resource exists - can proceed
  if (existenceResult.exists) {
    if (flags.dryRun) {
      return {
        canProceed: false, // Don't actually delete in dry-run
        exists: true,
        message: `Would delete ${resourceType} '${resourceName}'${namespace ? ` in namespace '${namespace}'` : ""}`,
        hint: "Remove --dry-run flag to execute deletion",
      };
    }

    return {
      canProceed: true,
      exists: true,
      message: `Resource '${resourceName}' found, proceeding with deletion`,
    };
  }

  // Resource doesn't exist - provide suggestions for user info
  const listPath = buildListPath(apiPath, resourceName);
  const similarResult = await findSimilarResources({
    client,
    listPath,
    originalName: resourceName,
    maxSuggestions: 5,
    minSimilarity: 0.3,
  });

  const suggestionLines = formatSuggestions(
    resourceType,
    similarResult.suggestions,
  );
  const suggestions = similarResult.suggestions;

  return {
    canProceed: false,
    exists: false,
    suggestions,
    reason: "Resource not found",
    message: `Resource '${resourceName}' not found${namespace ? ` in namespace '${namespace}'` : ""}`,
    hint:
      suggestionLines.length > 1
        ? suggestionLines.join("\n")
        : `Use 'list ${resourceType}' to see available resources`,
  };
}

/**
 * Format pre-delete check result for display
 */
export function formatPreDeleteResult(result: PreDeleteResult): string[] {
  const lines: string[] = [];

  if (!result.exists && !result.canProceed) {
    lines.push(`Error: ${result.message}`);

    if (result.suggestions && result.suggestions.length > 0) {
      lines.push("Did you mean one of these?");
      for (const suggestion of result.suggestions) {
        lines.push(`  - ${suggestion.name}`);
      }
    }

    if (result.hint) {
      // Split hint on newlines in case it contains multiple lines
      const hintLines = result.hint.split("\n");
      for (const hintLine of hintLines) {
        if (!hintLine.startsWith("Did you mean")) {
          lines.push(hintLine);
        }
      }
    }
  } else if (result.exists && !result.canProceed) {
    // Dry-run case
    lines.push(result.message);
    if (result.hint) {
      lines.push(result.hint);
    }
  }

  return lines;
}
