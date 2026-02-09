/**
 * Pre-flight Module
 * Pre-flight checks for delete operations including existence checking
 * and similar resource suggestions
 */

// Types
export type {
  ResourceExistenceMetadata,
  ExistenceCheckResult,
  ExistenceCheckOptions,
  SimilarResource,
  SimilarResourcesResult,
  SimilarResourcesOptions,
  PreDeleteResult,
  DeleteFlags,
} from "./types.js";

// Existence checking
export {
  checkResourceExists,
  performPreDeleteCheck,
  formatPreDeleteResult,
} from "./existence.js";

// Similar resource suggestions
export {
  levenshteinDistance,
  calculateSimilarity,
  findSimilarFromList,
  findSimilarResources,
  formatSuggestions,
} from "./similar.js";
