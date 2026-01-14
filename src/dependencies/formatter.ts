/**
 * Format dependency detection results into human-readable error messages
 */

import type { DependencyResult } from "./types.js";
import { simplifyPath } from "./search.js";

/**
 * Group items by a key
 *
 * @param items - Array of items to group
 * @param keyFn - Function to extract the grouping key
 * @returns Map of key to array of items
 */
function groupBy<T, K>(items: T[], keyFn: (item: T) => K): Map<K, T[]> {
	const groups = new Map<K, T[]>();

	for (const item of items) {
		const key = keyFn(item);
		const group = groups.get(key) ?? [];
		group.push(item);
		groups.set(key, group);
	}

	return groups;
}

/**
 * Format a dependency detection result into an error message
 *
 * @param resourceType - Type of resource that couldn't be deleted
 * @param resourceName - Name of resource that couldn't be deleted
 * @param dependencies - Detection results
 * @returns Formatted error message lines
 */
export function formatDependencyError(
	resourceType: string,
	resourceName: string,
	dependencies: DependencyResult,
): string[] {
	const output: string[] = [];

	// Error header
	output.push(
		`ERROR: Cannot delete ${resourceType} '${resourceName}' - resource is in use`,
	);
	output.push("");

	// Group references by domain for cleaner output
	const byDomain = groupBy(dependencies.references, (ref) => ref.domain);

	// Show count of references
	const totalRefs = dependencies.references.length;
	const domainCount = byDomain.size;

	if (totalRefs === 1) {
		output.push("Referenced by 1 resource:");
	} else {
		output.push(
			`Referenced by ${totalRefs} resource(s) across ${domainCount} domain(s):`,
		);
	}

	// Show each domain and its references
	for (const [domain, refs] of byDomain.entries()) {
		output.push(`  ${domain}:`);

		// Show unique resource names (a resource might reference the target multiple times)
		const uniqueRefs = new Map<string, string[]>();

		for (const ref of refs) {
			const paths = uniqueRefs.get(ref.resourceName) ?? [];
			const simplePath = simplifyPath(ref.fieldPath);
			if (!paths.includes(simplePath)) {
				paths.push(simplePath);
			}
			uniqueRefs.set(ref.resourceName, paths);
		}

		for (const [refName, paths] of uniqueRefs.entries()) {
			if (paths.length === 1) {
				output.push(`    - ${refName} (in ${paths[0]})`);
			} else {
				output.push(`    - ${refName} (in ${paths.length} locations)`);
			}
		}
	}

	output.push("");

	// Actionable tip
	output.push("Tip: Delete the resources listed above first, then retry");

	return output;
}
