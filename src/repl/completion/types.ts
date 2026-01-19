/**
 * Completion system type definitions
 */

/**
 * A completion suggestion
 */
export interface CompletionSuggestion {
	text: string;
	description: string;
	category?:
		| "domain"
		| "action"
		| "flag"
		| "builtin"
		| "navigation"
		| "value"
		| "argument"
		| "subcommand"
		| "command"
		| "resource"
		| "resource-name"
		| "context"; // Non-selectable informational items (e.g., showing taken names)
	isPrimary?: boolean; // For primary resources - renders with brighter styling
	priority?: number; // For priority-based sorting
	quotaLevel?: "none" | "warning" | "error"; // For quota status coloring in descriptions
	quotaInfo?: string; // Quota display info (e.g., "149/150") - shown right-justified
}

/**
 * Resource quota information for status line display
 */
export interface ResourceQuotaInfo {
	resourceType: string; // e.g., "healthcheck"
	displayName: string; // e.g., "Health Checks"
	current: number;
	limit: number;
	level: "none" | "warning" | "error";
}

/**
 * Completion result with suggestions and optional metadata
 */
export interface CompletionResult {
	suggestions: CompletionSuggestion[];
	resourceQuotaInfo?: ResourceQuotaInfo; // Quota for current resource type (when showing creation flags)
}

/**
 * Completion context information
 */
export interface CompletionContext {
	input: string;
	cursorPosition: number;
	contextDomain: string;
	contextAction: string;
}

/**
 * Result of parsing input for completion
 */
export interface ParsedInput {
	args: string[];
	currentWord: string;
	isEscapedToRoot: boolean;
	isCompletingFlag: boolean;
	isCompletingFlagValue: boolean;
	currentFlag: string | null;
}

/**
 * Resource fetch result with error information
 */
export interface ResourceFetchResult {
	names: string[];
	error?: string;
	cached: boolean;
	timestamp: number;
}

/**
 * Comprehensive diagnostic information for completion troubleshooting
 */
export interface CompletionDiagnostic {
	input: string;
	cursorPosition: number;
	parsedContext: ParsedInput;

	authentication: {
		clientConnected: boolean;
		isAuthenticated: boolean;
		tenant?: string;
	};

	namespace: {
		fromFlag?: string;
		fromSession: string;
		resolved: string;
	};

	resourceContext?: {
		domain: string | null;
		action: string | null;
		resourceType: string | null;
		resourceNamePartial: string;
	};

	apiRequest?: {
		endpoint: string;
		method: string;
		cacheStatus: "hit" | "miss" | "expired" | "loading";
		error?: string;
	};

	suggestions: CompletionSuggestion[];

	performance: {
		parsingMs: number;
		apiCallMs?: number;
		filteringMs: number;
		totalMs: number;
	};

	failures?: Array<{
		stage: string;
		message: string;
		suggestion?: string;
	}>;
}
