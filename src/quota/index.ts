/**
 * Quota Pre-Check Module
 *
 * Provides quota pre-check functionality for create operations.
 * Checks quota usage before API calls and warns/blocks when near or at limits.
 *
 * @example
 * ```typescript
 * import { checkQuotaBeforeCreate, formatQuotaWarning } from './quota/index.js';
 *
 * const result = await checkQuotaBeforeCreate(subscriptionClient, {
 *   resourceType: 'healthcheck',
 *   namespace: 'default',
 * });
 *
 * if (result.level !== 'none') {
 *   console.log(formatQuotaWarning(result).join('\n'));
 * }
 *
 * if (!result.proceed) {
 *   throw new Error('Quota exceeded');
 * }
 * ```
 */

// Types
export type {
  QuotaMapping,
  QuotaCheckResult,
  QuotaCheckOptions,
  CachedQuotaData,
  QuotaUsageItem,
} from "./types.js";

// Pre-check service (main API)
export {
  checkQuotaBeforeCreate,
  formatQuotaWarning,
  formatQuotaStatusLine,
} from "./pre-check.js";

// Mapping utilities
export {
  getQuotaMapping,
  getQuotaMappingByName,
  getAllQuotaMappings,
  hasQuotaMapping,
} from "./mapping.js";

// Cache utilities
export { QuotaCache, getQuotaCache, resetQuotaCache } from "./cache.js";
