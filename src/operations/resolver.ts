/**
 * Operation Resolver
 * Looks up operation definitions from generated specs and resolves API paths
 */

import {
	generatedOperations,
	type OperationInfo,
} from "../types/operations_generated.js";

/**
 * Look up operation definition from generated specs
 *
 * Data structure: generatedOperations is Map<string, DomainOperationsInfo>
 * where DomainOperationsInfo.operations is OperationInfo[]
 */
export function getOperationDefinition(
	domain: string,
	action: string,
	resourceType?: string,
): OperationInfo | null {
	const domainOps = generatedOperations.get(domain);
	if (!domainOps?.operations) return null;

	// Find matching operation - prefer exact resourceType match
	if (resourceType) {
		const exactMatch = domainOps.operations.find(
			(op) => op.action === action && op.resourceType === resourceType,
		);
		if (exactMatch) return exactMatch;
	}

	// Fallback to action-only match if no resourceType specified
	return domainOps.operations.find((op) => op.action === action) ?? null;
}

/**
 * Substitute path parameters with actual values
 * Handles: {namespace}, {name}, {metadata.namespace}, {metadata.name}, {site}
 */
export function substitutePathParams(
	pathTemplate: string,
	params: { namespace?: string; name?: string; site?: string },
): string {
	let path = pathTemplate;

	if (params.namespace) {
		path = path.replace(/\{namespace\}/g, params.namespace);
		path = path.replace(/\{metadata\.namespace\}/g, params.namespace);
	}

	if (params.name) {
		path = path.replace(/\{name\}/g, params.name);
		path = path.replace(/\{metadata\.name\}/g, params.name);
	}

	if (params.site) {
		path = path.replace(/\{site\}/g, params.site);
	}

	return path;
}

/**
 * Infer HTTP method from action name
 */
export function inferMethodFromAction(
	action: string,
): "get" | "post" | "put" | "delete" {
	switch (action) {
		case "list":
		case "get":
		case "status":
			return "get";
		case "create":
		case "apply":
			return "post";
		case "replace":
		case "patch":
			return "put";
		case "delete":
			return "delete";
		default:
			return "get";
	}
}

/**
 * Check if path has unsubstituted placeholders
 */
export function hasUnsubstitutedParams(path: string): boolean {
	return /\{[^}]+\}/.test(path);
}

/**
 * Get all placeholder names from a path template
 */
export function getPathPlaceholders(pathTemplate: string): string[] {
	const matches = pathTemplate.match(/\{([^}]+)\}/g);
	if (!matches) return [];
	return matches.map((m) => m.slice(1, -1)); // Remove { and }
}
