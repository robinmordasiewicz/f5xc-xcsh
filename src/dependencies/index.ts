/**
 * Resource dependency detection module
 *
 * This module provides automatic detection of resource dependencies when delete
 * operations fail due to "in use" errors. Instead of showing generic error messages,
 * it queries related domains to find which resources are preventing deletion.
 *
 * @example
 * ```typescript
 * import { detectDependencies, formatDependencyError } from './dependencies';
 *
 * try {
 *   await client.delete(`/api/config/namespaces/default/origin_pools/my-pool`);
 * } catch (error) {
 *   if (error.status === 409) {
 *     const deps = await detectDependencies('origin_pool', 'my-pool', 'default', client);
 *     if (deps.found) {
 *       const errorLines = formatDependencyError('origin_pool', 'my-pool', deps);
 *       console.error(errorLines.join('\n'));
 *     }
 *   }
 * }
 * ```
 */

// Core detection
export { detectDependencies } from "./detector.js";

// Formatting
export { formatDependencyError } from "./formatter.js";

// Types
export type {
  DependencyReference,
  DependencyResult,
  RelationshipPattern,
  SearchOptions,
  FoundReference,
} from "./types.js";

// Relationship registry utilities
export {
  RELATIONSHIP_REGISTRY,
  getRelatedDomains,
  getSearchFields,
  hasKnownRelationships,
  getAllPatternsByPriority,
} from "./relationships.js";

// Search utilities
export {
  searchForReferences,
  searchResourceList,
  simplifyPath,
} from "./search.js";
