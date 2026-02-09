/**
 * Pre-flight Types
 * Type definitions for delete operation pre-flight checks
 */

import type { APIClient } from "../api/client.js";

/**
 * Resource metadata from existence check
 */
export interface ResourceExistenceMetadata {
  name: string;
  namespace: string | undefined;
  uid: string | undefined;
}

/**
 * Result of a resource existence check
 */
export interface ExistenceCheckResult {
  /** Whether the resource exists */
  exists: boolean;
  /** HTTP status code from check (200, 404, etc.) */
  statusCode?: number;
  /** Error message if check failed for reasons other than 404 */
  error?: string;
  /** Resource metadata if exists */
  metadata?: ResourceExistenceMetadata;
}

/**
 * Similar resource suggestion
 */
export interface SimilarResource {
  /** Resource name */
  name: string;
  /** Levenshtein distance from original query */
  distance: number;
  /** Similarity score (0-1, higher is more similar) */
  similarity: number;
}

/**
 * Result of finding similar resources
 */
export interface SimilarResourcesResult {
  /** Whether the lookup was successful */
  success: boolean;
  /** List of similar resources, sorted by similarity */
  suggestions: SimilarResource[];
  /** Total resources in namespace (for context) */
  totalCount?: number;
  /** Error message if lookup failed */
  error?: string;
}

/**
 * Pre-delete check result
 */
export interface PreDeleteResult {
  /** Whether deletion can proceed */
  canProceed: boolean;
  /** Whether resource exists */
  exists: boolean;
  /** Similar resource suggestions if not found */
  suggestions?: SimilarResource[];
  /** Dependencies if check-deps was requested */
  dependencies?: string[];
  /** Reason if cannot proceed */
  reason?: string;
  /** User-friendly message */
  message: string;
  /** Hint for recovery */
  hint?: string;
}

/**
 * Delete operation flags
 */
export interface DeleteFlags {
  /** Show what would be deleted without executing */
  dryRun: boolean;
  /** Pre-check dependencies before delete */
  checkDeps: boolean;
}

/**
 * Options for existence check
 */
export interface ExistenceCheckOptions {
  /** API client instance */
  client: APIClient;
  /** API path to the resource */
  apiPath: string;
  /** Resource name for error messages */
  resourceName: string;
  /** Namespace for error messages */
  namespace: string | undefined;
}

/**
 * Options for finding similar resources
 */
export interface SimilarResourcesOptions {
  /** API client instance */
  client: APIClient;
  /** API path to list resources (without the name) */
  listPath: string;
  /** Original resource name that was not found */
  originalName: string;
  /** Maximum suggestions to return */
  maxSuggestions?: number;
  /** Minimum similarity threshold (0-1) */
  minSimilarity?: number;
}
