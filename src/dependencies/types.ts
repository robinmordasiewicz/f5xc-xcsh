/**
 * Type definitions for resource dependency detection
 */

/**
 * A single reference to a resource found during dependency detection
 */
export interface DependencyReference {
	/** The domain where the referring resource lives (e.g., "http_loadbalancer") */
	domain: string;

	/** The name of the resource that references the target */
	resourceName: string;

	/** The namespace containing the referring resource */
	namespace: string;

	/** The path within the resource spec where the reference was found */
	fieldPath: string;

	/** The actual value of the reference */
	fieldValue: string;
}

/**
 * Result of a dependency detection operation
 */
export interface DependencyResult {
	/** Whether any dependencies were found */
	found: boolean;

	/** List of all references discovered */
	references: DependencyReference[];

	/** Domains that were searched */
	searchedDomains: string[];

	/** Time taken for detection in milliseconds */
	searchTimeMs: number;
}

/**
 * Known relationship pattern for a resource type
 */
export interface RelationshipPattern {
	/** The source resource type (e.g., "origin_pool") */
	sourceType: string;

	/** List of resource types that might reference this source */
	referencedBy: string[];

	/** Optional: specific fields to check for references */
	searchFields?: string[];

	/** Priority for search order (lower = higher priority) */
	priority: number;
}

/**
 * Options for reference search
 */
export interface SearchOptions {
	/** The resource name to search for */
	targetName: string;

	/** The resource type being searched for */
	targetType: string;

	/** Whether to also search for UUID references */
	searchUUIDs?: boolean;

	/** Maximum depth for recursive search */
	maxDepth?: number;
}

/**
 * A found reference within an object
 */
export interface FoundReference {
	/** Path to the reference in dot notation */
	path: string;

	/** The value found at this path */
	value: unknown;
}
