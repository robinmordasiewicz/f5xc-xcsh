/**
 * Output Formatter
 * Formats API responses as JSON, YAML, or table
 * Unified formatting with beautiful tables and color auto-detection
 */

import YAML from "yaml";
import { formatResourceTable, formatResourceDetails } from "./table.js";
import { shouldUseColors } from "./resolver.js";

// Re-export types from types.ts for backward compatibility
export type { OutputFormat } from "./types.js";
export { isValidOutputFormat } from "./types.js";

// Import OutputFormat for local use
import type { OutputFormat } from "./types.js";

/**
 * Formatter configuration
 */
export interface FormatterConfig {
  /** Output format */
  format: import("./types.js").OutputFormat;
  /** Column widths for table format (optional) */
  columnWidths?: number[];
  /** Priority columns to show first */
  priorityColumns?: string[];
  /** Disable colors (for piped output) */
  noColor?: boolean;
}

/**
 * Format data according to specified format
 */
export function formatOutput(
  data: unknown,
  format: import("./types.js").OutputFormat = "table",
  noColor: boolean = false,
): string {
  if (format === "none") {
    return "";
  }

  // Auto-detect color support if not explicitly disabled
  const useNoColor = noColor || !shouldUseColors();

  switch (format) {
    case "json":
      return formatJSON(data);
    case "yaml":
      return formatYAML(data);
    case "table":
    case "text":
      return formatTable(data, useNoColor);
    case "tsv":
      return formatTSV(data);
    case "spec":
      // Spec format is handled at command level
      return formatJSON(data);
    default:
      return formatTable(data, useNoColor);
  }
}

/**
 * Format as pretty-printed JSON
 */
export function formatJSON(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Format as YAML
 */
export function formatYAML(data: unknown): string {
  return YAML.stringify(data, { indent: 2 });
}

/**
 * Extract items from list response
 */
function extractItems(data: unknown): Record<string, unknown>[] {
  // Handle map with "items" key
  if (data && typeof data === "object" && "items" in data) {
    const items = (data as { items: unknown[] }).items;
    if (Array.isArray(items)) {
      return items.filter(
        (item): item is Record<string, unknown> =>
          item !== null && typeof item === "object",
      );
    }
  }

  // Handle array directly
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === "object",
    );
  }

  // Single item, wrap it
  if (data && typeof data === "object") {
    return [data as Record<string, unknown>];
  }

  return [];
}

// NOTE: Helper functions getStringField, formatLabels, and wrapText
// have been moved to table.ts for direct use in beautiful table formatting.

/**
 * Check if data represents a single resource response (not a list)
 * Single resources have metadata/spec structure without items array
 */
function isSingleResourceResponse(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  // List responses have "items" array
  if ("items" in data) return false;
  // Array is a list
  if (Array.isArray(data)) return false;
  // Single object with metadata or spec is a single resource
  // Also check for object_type which F5 XC uses
  const obj = data as Record<string, unknown>;
  return (
    "metadata" in obj ||
    "spec" in obj ||
    ("name" in obj && "namespace" in obj) ||
    "object_type" in obj
  );
}

/**
 * Format as beautiful Unicode table with F5 red borders
 * Falls back to plain ASCII when colors are disabled
 * For single resources (get action), shows detailed key-value view
 * For lists, shows summary table
 */
export function formatTable(data: unknown, noColor: boolean = false): string {
  // Is this a single resource response?
  if (isSingleResourceResponse(data)) {
    return formatResourceDetails(data as Record<string, unknown>, noColor);
  }
  // Otherwise, format as list table
  return formatResourceTable(data, noColor);
}

/**
 * Format as tab-separated values
 */
export function formatTSV(data: unknown): string {
  const items = extractItems(data);
  if (items.length === 0) {
    return "";
  }

  // Get all keys
  const allKeys = new Set<string>();
  for (const item of items) {
    Object.keys(item).forEach((k) => allKeys.add(k));
  }

  // Priority order
  const priority = ["name", "namespace", "status", "created", "modified"];
  const headers = [
    ...priority.filter((p) => allKeys.has(p)),
    ...[...allKeys].filter((k) => !priority.includes(k)).sort(),
  ];

  // Build rows
  const lines: string[] = [];
  for (const item of items) {
    const values = headers.map((h) => {
      const val = item[h];
      if (val === null || val === undefined) return "";
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    });
    lines.push(values.join("\t"));
  }

  return lines.join("\n");
}

/**
 * Parse output format from string
 */
export function parseOutputFormat(format: string): OutputFormat {
  switch (format.toLowerCase()) {
    case "json":
      return "json";
    case "yaml":
      return "yaml";
    case "table":
    case "text":
    case "":
      return "table";
    case "tsv":
      return "tsv";
    case "none":
      return "none";
    default:
      return "table";
  }
}

/**
 * Extract resource information from F5 XC error message
 * Example: "ves.io.schema.views.http_loadbalancer.Object: Key tenant/namespace/name does not exist"
 */
function extractResourceInfo(message: string): {
  resourceType?: string;
  namespace?: string;
  name?: string;
} {
  // Match pattern: ves.io.schema.views.{resource_type}.Object: Key {tenant}/{namespace}/{name}
  const resourceMatch = message.match(
    /ves\.io\.schema\.views\.([^.]+)\.Object/,
  );
  const keyMatch = message.match(/Key [^/]+\/([^/]+)\/([^\s]+)/);

  // Only include properties if they exist (exactOptionalPropertyTypes requirement)
  const result: {
    resourceType?: string;
    namespace?: string;
    name?: string;
  } = {};

  if (resourceMatch?.[1]) result.resourceType = resourceMatch[1];
  if (keyMatch?.[1]) result.namespace = keyMatch[1];
  if (keyMatch?.[2]) result.name = keyMatch[2];

  return result;
}

/**
 * Format API error with helpful context (max 2 lines for human readability)
 */
export function formatAPIError(
  statusCode: number,
  body: unknown,
  operation: string,
): string {
  // Extract error message from response body
  let errorMessage = "";
  if (body && typeof body === "object") {
    const errResp = body as Record<string, unknown>;
    if (errResp.message) {
      errorMessage = String(errResp.message);
    }
  }

  // Build concise, human-readable error (max 2 lines)
  const lines: string[] = [];

  switch (statusCode) {
    case 401: {
      lines.push(
        "ERROR: Authentication failed - invalid or expired credentials",
      );
      lines.push("Tip: Run 'login use profile <name>' to authenticate");
      break;
    }

    case 403: {
      lines.push("ERROR: Permission denied - insufficient access rights");
      lines.push("Tip: Contact your administrator for required permissions");
      break;
    }

    case 404: {
      const info = extractResourceInfo(errorMessage);
      if (info.name && info.namespace) {
        lines.push(
          `ERROR: Resource '${info.name}' not found in namespace '${info.namespace}'`,
        );
        if (info.resourceType) {
          lines.push(
            `Tip: Use 'list ${info.resourceType}' to see available resources`,
          );
        } else {
          lines.push("Tip: Check the resource name and namespace are correct");
        }
      } else {
        lines.push("ERROR: Resource not found");
        lines.push("Tip: Verify the resource name and namespace are correct");
      }
      break;
    }

    case 409: {
      // Check for specific conflict types
      if (
        errorMessage.toLowerCase().includes("in use") ||
        errorMessage.toLowerCase().includes("cannot be deleted")
      ) {
        lines.push("ERROR: Resource is currently in use by other resources");
        lines.push(
          "Tip: Use 'get' command to identify dependencies, then delete those first",
        );
      } else if (errorMessage.toLowerCase().includes("already exists")) {
        const info = extractResourceInfo(errorMessage);
        if (info.name) {
          lines.push(`ERROR: Resource '${info.name}' already exists`);
        } else {
          lines.push("ERROR: Resource already exists");
        }
        lines.push("Tip: Use a different name or delete the existing resource");
      } else {
        lines.push("ERROR: Conflict - resource in unexpected state");
        lines.push("Tip: Use 'get' command to inspect current resource state");
      }
      break;
    }

    case 429: {
      lines.push("ERROR: Rate limit exceeded - too many requests");
      lines.push("Tip: Wait a moment and try again");
      break;
    }

    case 500:
    case 502:
    case 503: {
      lines.push("ERROR: Server error - service temporarily unavailable");
      lines.push("Tip: Try again in a moment");
      break;
    }

    default: {
      // Generic error format for other status codes
      lines.push(`ERROR: ${operation} failed (HTTP ${statusCode})`);
      // Try to extract a simple message
      if (errorMessage) {
        // Clean up technical F5 XC message format
        const cleanMsg = errorMessage
          .replace(/ves\.io\.schema\.\w+\.\w+\.Object:\s*/g, "")
          .replace(/Key [^:]+:\s*/g, "")
          .trim();
        if (cleanMsg && cleanMsg.length < 100) {
          lines.push(`Tip: ${cleanMsg}`);
        }
      }
    }
  }

  return lines.join("\n");
}
