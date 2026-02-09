/**
 * Namespace Scope Validation
 *
 * Validates operations against namespace scope requirements from enriched upstream specs.
 * Uses the x-f5xc-namespace-scope field to determine if an operation is valid
 * for the current namespace context.
 */

import { getOperationDescription } from "../descriptions/resolver.js";

/**
 * Namespace scope values from upstream enrichment
 */
export type NamespaceScope = "system" | "shared" | "any";

/**
 * Result of namespace scope validation
 */
export interface NamespaceValidationResult {
  /** Whether the operation is valid in the current namespace */
  valid: boolean;
  /** Scope required for this operation */
  scope?: NamespaceScope;
  /** User-friendly message explaining the validation result */
  message?: string;
  /** Suggested namespace to use instead */
  suggestion?: string;
}

/**
 * Human-readable descriptions for namespace scopes
 */
const SCOPE_DESCRIPTIONS: Record<NamespaceScope, string> = {
  system: "This operation is only available in the 'system' namespace",
  shared: "This operation is available in 'shared' namespace",
  any: "This operation works in any namespace",
};

/**
 * Validate if an operation is allowed in the specified namespace
 *
 * @param domain - The domain name (e.g., "virtual", "dns")
 * @param action - The CLI action (e.g., "create", "list", "get", "delete")
 * @param currentNamespace - The namespace where the operation will be executed
 * @param resourceType - Optional resource type for more specific matching
 * @returns Validation result with details
 */
export function validateNamespaceScope(
  domain: string,
  action: string,
  currentNamespace: string,
  resourceType?: string,
): NamespaceValidationResult {
  // Get operation metadata from upstream enriched specs
  const opInfo = getOperationDescription(domain, action, resourceType);

  // If no operation info or no namespace scope, assume any namespace is valid
  if (!opInfo?.namespaceScope) {
    return { valid: true };
  }

  const scope = opInfo.namespaceScope as NamespaceScope;
  const normalizedNamespace = currentNamespace.toLowerCase();

  switch (scope) {
    case "system":
      if (normalizedNamespace !== "system") {
        return {
          valid: false,
          scope,
          message: `${action} on ${resourceType || domain} requires the 'system' namespace`,
          suggestion: "system",
        };
      }
      return { valid: true, scope };

    case "shared":
      if (normalizedNamespace !== "shared") {
        return {
          valid: false,
          scope,
          message: `${action} on ${resourceType || domain} requires the 'shared' namespace`,
          suggestion: "shared",
        };
      }
      return { valid: true, scope };

    case "any":
    default:
      return { valid: true, scope };
  }
}

/**
 * Get the namespace scope for an operation
 *
 * @param domain - The domain name
 * @param action - The CLI action
 * @param resourceType - Optional resource type
 * @returns The namespace scope or undefined if not specified
 */
export function getNamespaceScope(
  domain: string,
  action: string,
  resourceType?: string,
): NamespaceScope | undefined {
  const opInfo = getOperationDescription(domain, action, resourceType);
  return opInfo?.namespaceScope as NamespaceScope | undefined;
}

/**
 * Get human-readable description of a namespace scope
 */
export function getNamespaceScopeDescription(scope: NamespaceScope): string {
  return SCOPE_DESCRIPTIONS[scope] || `Namespace scope: ${scope}`;
}

/**
 * Check if an operation requires a specific namespace
 *
 * @param domain - The domain name
 * @param action - The CLI action
 * @param resourceType - Optional resource type
 * @returns true if the operation requires a specific namespace (system or shared)
 */
export function requiresSpecificNamespace(
  domain: string,
  action: string,
  resourceType?: string,
): boolean {
  const scope = getNamespaceScope(domain, action, resourceType);
  return scope === "system" || scope === "shared";
}

/**
 * Format a validation error message for display
 */
export function formatValidationError(
  result: NamespaceValidationResult,
): string {
  if (result.valid) {
    return "";
  }

  let message = result.message || "Invalid namespace for this operation";

  if (result.suggestion) {
    message += `\n  Suggestion: Use --namespace ${result.suggestion}`;
  }

  return message;
}
