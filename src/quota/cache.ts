/**
 * Quota Cache
 *
 * Caches quota usage data to minimize API calls during create operations
 */

import type { SubscriptionClient } from "../domains/subscription/client.js";
import type { QuotaUsageItem, CachedQuotaData } from "./types.js";

/**
 * Cache TTL in milliseconds (1 minute)
 */
const CACHE_TTL_MS = 60_000;

/**
 * Quota Cache
 *
 * Provides cached access to quota usage data to minimize API calls
 * during rapid create operations.
 */
export class QuotaCache {
	private cache: Map<string, CachedQuotaData> = new Map();

	/**
	 * Get quota usage, using cache if available and fresh
	 *
	 * @param client - Subscription client for API calls
	 * @param namespace - Namespace to get quota for
	 * @returns Array of quota usage items
	 */
	async getQuotaUsage(
		client: SubscriptionClient,
		namespace: string,
	): Promise<QuotaUsageItem[]> {
		const cacheKey = this.getCacheKey(namespace);
		const cached = this.cache.get(cacheKey);

		// Return cached data if still fresh
		if (cached && !this.isExpired(cached.fetchedAt)) {
			return cached.usage;
		}

		// Fetch fresh data from API
		const response = await client.getQuotaUsage(namespace);

		// Transform API response to normalized format
		// API returns: { quota_usage: { "Healthcheck": { limit: { maximum: 150 }, usage: { current: 149 }, ... } } }
		const usage: QuotaUsageItem[] = [];

		if (response.quota_usage) {
			for (const [name, item] of Object.entries(response.quota_usage)) {
				const current = item.usage?.current ?? 0;
				const limit = item.limit?.maximum ?? 0;
				const percentage =
					limit > 0 ? Math.round((current / limit) * 100) : 0;

				usage.push({
					name,
					display_name: item.display_name || name,
					current,
					limit,
					percentage,
				});
			}
		}

		// Store in cache
		this.cache.set(cacheKey, {
			usage,
			fetchedAt: Date.now(),
			namespace,
		});

		return usage;
	}

	/**
	 * Find quota usage for a specific quota name
	 *
	 * @param client - Subscription client for API calls
	 * @param namespace - Namespace to get quota for
	 * @param quotaName - API quota name to find
	 * @returns Quota usage item or undefined if not found
	 */
	async findQuotaUsage(
		client: SubscriptionClient,
		namespace: string,
		quotaName: string,
	): Promise<QuotaUsageItem | undefined> {
		const usage = await this.getQuotaUsage(client, namespace);
		return usage.find((q) => q.name === quotaName);
	}

	/**
	 * Invalidate cache for a namespace or all namespaces
	 *
	 * @param namespace - Optional namespace to invalidate; if omitted, clears all
	 */
	invalidate(namespace?: string): void {
		if (namespace) {
			this.cache.delete(this.getCacheKey(namespace));
		} else {
			this.cache.clear();
		}
	}

	/**
	 * Generate cache key for a namespace
	 */
	private getCacheKey(namespace: string): string {
		return `quota:${namespace}`;
	}

	/**
	 * Check if cached data is expired
	 */
	private isExpired(fetchedAt: number): boolean {
		return Date.now() - fetchedAt > CACHE_TTL_MS;
	}
}

/**
 * Global quota cache instance
 */
let globalCache: QuotaCache | null = null;

/**
 * Get the global quota cache instance
 *
 * @returns Singleton quota cache instance
 */
export function getQuotaCache(): QuotaCache {
	if (!globalCache) {
		globalCache = new QuotaCache();
	}
	return globalCache;
}

/**
 * Reset the global quota cache (for testing or session changes)
 */
export function resetQuotaCache(): void {
	if (globalCache) {
		globalCache.invalidate();
	}
	globalCache = null;
}
