/**
 * Quota Pre-Check Types
 *
 * Type definitions for quota pre-check system
 */

/**
 * Mapping between CLI resource types and API quota names
 */
export interface QuotaMapping {
	/** CLI resource type (e.g., "healthcheck") */
	resourceType: string;
	/** API quota name (e.g., "health_checks") */
	quotaName: string;
	/** Human-readable display name (e.g., "Health Checks") */
	displayName: string;
}

/**
 * Result of a quota pre-check operation
 */
export interface QuotaCheckResult {
	/** Whether the operation should proceed */
	proceed: boolean;
	/** Severity level of the quota check */
	level: "none" | "warning" | "error";
	/** Optional message describing the quota status */
	message?: string;
	/** Quota details when relevant */
	quota?: {
		/** API quota name */
		name: string;
		/** Human-readable display name */
		displayName: string;
		/** Current usage count */
		current: number;
		/** Maximum limit */
		limit: number;
		/** Usage percentage (0-100) */
		percentage: number;
	};
}

/**
 * Options for quota pre-check
 */
export interface QuotaCheckOptions {
	/** CLI resource type being created */
	resourceType: string;
	/** Namespace for the operation */
	namespace: string;
	/** Force creation even if at quota limit */
	force?: boolean;
}

/**
 * Cached quota data with timestamp
 */
export interface CachedQuotaData {
	/** Quota usage data from API */
	usage: QuotaUsageItem[];
	/** Timestamp when data was fetched */
	fetchedAt: number;
	/** Namespace the data applies to */
	namespace: string;
}

/**
 * Simplified quota usage item (mirrors QuotaUsage from subscription types)
 */
export interface QuotaUsageItem {
	name: string;
	display_name?: string | undefined;
	current: number;
	limit: number;
	percentage?: number | undefined;
	unit?: string | undefined;
	category?: string | undefined;
}
