/**
 * Similar Resource Suggestions
 * Find similar resource names using Levenshtein distance for "Did you mean?" suggestions
 */

import type {
	SimilarResource,
	SimilarResourcesOptions,
	SimilarResourcesResult,
} from "./types.js";

/**
 * Calculate Levenshtein distance between two strings
 * Uses dynamic programming for O(m*n) time complexity
 */
export function levenshteinDistance(a: string, b: string): number {
	const aLower = a.toLowerCase();
	const bLower = b.toLowerCase();

	if (aLower === bLower) return 0;
	if (aLower.length === 0) return bLower.length;
	if (bLower.length === 0) return aLower.length;

	// Create matrix with explicit initialization
	const rows = bLower.length + 1;
	const cols = aLower.length + 1;
	const matrix: number[][] = Array.from({ length: rows }, () =>
		Array<number>(cols).fill(0),
	);

	// Initialize first column
	for (let i = 0; i <= bLower.length; i++) {
		matrix[i]![0] = i;
	}
	// Initialize first row
	for (let j = 0; j <= aLower.length; j++) {
		matrix[0]![j] = j;
	}

	// Fill matrix
	for (let i = 1; i <= bLower.length; i++) {
		for (let j = 1; j <= aLower.length; j++) {
			const bChar = bLower[i - 1];
			const aChar = aLower[j - 1];
			if (bChar === aChar) {
				matrix[i]![j] = matrix[i - 1]![j - 1]!;
			} else {
				matrix[i]![j] = Math.min(
					matrix[i - 1]![j - 1]! + 1, // substitution
					matrix[i]![j - 1]! + 1, // insertion
					matrix[i - 1]![j]! + 1, // deletion
				);
			}
		}
	}

	return matrix[bLower.length]![aLower.length]!;
}

/**
 * Calculate similarity score (0-1) from Levenshtein distance
 * Higher score means more similar
 */
export function calculateSimilarity(a: string, b: string): number {
	const distance = levenshteinDistance(a, b);
	const maxLength = Math.max(a.length, b.length);
	if (maxLength === 0) return 1;
	return 1 - distance / maxLength;
}

/**
 * Find similar resources from a list
 */
export function findSimilarFromList(
	originalName: string,
	resourceNames: string[],
	maxSuggestions: number = 5,
	minSimilarity: number = 0.3,
): SimilarResource[] {
	const suggestions: SimilarResource[] = [];

	for (const name of resourceNames) {
		// Skip exact matches
		if (name.toLowerCase() === originalName.toLowerCase()) continue;

		const distance = levenshteinDistance(originalName, name);
		const similarity = calculateSimilarity(originalName, name);

		if (similarity >= minSimilarity) {
			suggestions.push({
				name,
				distance,
				similarity,
			});
		}
	}

	// Sort by similarity (descending), then by name
	suggestions.sort((a, b) => {
		if (b.similarity !== a.similarity) {
			return b.similarity - a.similarity;
		}
		return a.name.localeCompare(b.name);
	});

	return suggestions.slice(0, maxSuggestions);
}

/**
 * Extract resource names from API list response
 */
function extractResourceNames(data: unknown): string[] {
	const names: string[] = [];

	// Handle F5 XC list response format: { items: [{ metadata: { name: "..." } }] }
	if (data && typeof data === "object" && "items" in data) {
		const items = (data as { items: unknown[] }).items;
		if (Array.isArray(items)) {
			for (const item of items) {
				if (
					item &&
					typeof item === "object" &&
					"metadata" in item &&
					(item as { metadata: { name?: string } }).metadata?.name
				) {
					names.push(
						(item as { metadata: { name: string } }).metadata.name,
					);
				}
			}
		}
	}

	return names;
}

/**
 * Find similar resources by querying the API
 */
export async function findSimilarResources(
	options: SimilarResourcesOptions,
): Promise<SimilarResourcesResult> {
	const {
		client,
		listPath,
		originalName,
		maxSuggestions = 5,
		minSimilarity = 0.3,
	} = options;

	try {
		// List resources in the namespace
		const response = await client.get(listPath);

		if (!response.ok) {
			return {
				success: false,
				suggestions: [],
				error: `Failed to list resources: HTTP ${response.statusCode}`,
			};
		}

		const resourceNames = extractResourceNames(response.data);
		const suggestions = findSimilarFromList(
			originalName,
			resourceNames,
			maxSuggestions,
			minSimilarity,
		);

		return {
			success: true,
			suggestions,
			totalCount: resourceNames.length,
		};
	} catch (error) {
		return {
			success: false,
			suggestions: [],
			error:
				error instanceof Error
					? error.message
					: "Unknown error listing resources",
		};
	}
}

/**
 * Format suggestions for display
 */
export function formatSuggestions(
	resourceType: string,
	suggestions: SimilarResource[],
): string[] {
	const lines: string[] = [];

	if (suggestions.length > 0) {
		lines.push("Did you mean one of these?");
		for (const suggestion of suggestions) {
			lines.push(`  - ${suggestion.name}`);
		}
	}

	lines.push(`Tip: Use 'list ${resourceType}' to see available resources`);

	return lines;
}
