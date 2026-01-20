/**
 * Quota Helper for Completion
 *
 * Provides quota information for resource type completions
 * Leverages existing quota cache for efficient lookups
 */

import { getQuotaCache } from "../../quota/cache.js";
import { getQuotaMapping } from "../../quota/mapping.js";
import { SubscriptionClient } from "../../domains/subscription/client.js";
import type { APIClient } from "../../api/client.js";

/**
 * Quota information for a resource type
 */
export interface QuotaInfo {
	/** Current usage count */
	current: number;
	/** Maximum limit */
	limit: number;
	/** Usage percentage (0-100) */
	percentage: number;
	/** Quota level for coloring */
	level: "none" | "warning" | "error";
	/** Display string (e.g., "149/150") */
	display: string;
}

/**
 * Get quota information for a specific resource type
 *
 * @param apiClient - API client for making requests
 * @param namespace - Namespace to get quota for
 * @param resourceType - CLI resource type (e.g., "healthcheck")
 * @returns Quota information or null if not available
 */
export async function getQuotaForResourceType(
	apiClient: APIClient,
	namespace: string,
	resourceType: string,
): Promise<QuotaInfo | null> {
	// Get quota mapping for this resource type
	const mapping = getQuotaMapping(resourceType);
	if (!mapping) {
		return null; // No quota mapping for this resource
	}

	try {
		const subscriptionClient = new SubscriptionClient(apiClient);
		const cache = getQuotaCache();
		const usage = await cache.findQuotaUsage(
			subscriptionClient,
			namespace,
			mapping.quotaName,
		);

		if (!usage) {
			return null; // No quota data available
		}

		// Handle unlimited quotas (limit = -1)
		if (usage.limit < 0) {
			return {
				current: usage.current,
				limit: usage.limit,
				percentage: 0,
				level: "none" as const,
				display: `${usage.current} (unlimited)`,
			};
		}

		// Handle zero or invalid limit
		if (usage.limit === 0) {
			return null;
		}

		// Normal finite quota
		const percentage = Math.round((usage.current / usage.limit) * 100);
		const level: QuotaInfo["level"] =
			percentage >= 100 ? "error" : percentage >= 90 ? "warning" : "none";

		return {
			current: usage.current,
			limit: usage.limit,
			percentage,
			level,
			display: `${usage.current}/${usage.limit}`,
		};
	} catch {
		return null; // Fail gracefully
	}
}

/**
 * Get quota information for multiple resource types
 *
 * @param apiClient - API client for making requests
 * @param namespace - Namespace to get quotas for
 * @param resourceTypes - Array of CLI resource types
 * @returns Map of resource type to quota info
 */
export async function getQuotasForResourceTypes(
	apiClient: APIClient,
	namespace: string,
	resourceTypes: string[],
): Promise<Map<string, QuotaInfo>> {
	const results = new Map<string, QuotaInfo>();

	// Fetch all quotas in parallel (cache handles deduplication)
	await Promise.all(
		resourceTypes.map(async (rt) => {
			const info = await getQuotaForResourceType(
				apiClient,
				namespace,
				rt,
			);
			if (info) {
				results.set(rt, info);
			}
		}),
	);

	return results;
}
