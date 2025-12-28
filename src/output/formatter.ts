/**
 * Output Formatter
 * Formats API responses as JSON, YAML, or table
 */

import YAML from "yaml";

/**
 * Output format types
 */
export type OutputFormat = "json" | "yaml" | "table" | "text" | "tsv" | "none";

/**
 * Formatter configuration
 */
export interface FormatterConfig {
	/** Output format */
	format: OutputFormat;
	/** Column widths for table format (optional) */
	columnWidths?: number[];
	/** Priority columns to show first */
	priorityColumns?: string[];
}

/**
 * Format data according to specified format
 */
export function formatOutput(
	data: unknown,
	format: OutputFormat = "yaml",
): string {
	if (format === "none") {
		return "";
	}

	switch (format) {
		case "json":
			return formatJSON(data);
		case "yaml":
			return formatYAML(data);
		case "table":
		case "text":
			return formatTable(data);
		case "tsv":
			return formatTSV(data);
		default:
			return formatYAML(data);
	}
}

/**
 * Format as pretty-printed JSON
 */
export function formatJSON(data: unknown): string {
	return JSON.stringify(data, null, 2);
}

/**
 * Format as YAML
 */
export function formatYAML(data: unknown): string {
	return YAML.stringify(data, { indent: 2 });
}

/**
 * Extract items from list response
 */
function extractItems(data: unknown): Record<string, unknown>[] {
	// Handle map with "items" key
	if (data && typeof data === "object" && "items" in data) {
		const items = (data as { items: unknown[] }).items;
		if (Array.isArray(items)) {
			return items.filter(
				(item): item is Record<string, unknown> =>
					item !== null && typeof item === "object",
			);
		}
	}

	// Handle array directly
	if (Array.isArray(data)) {
		return data.filter(
			(item): item is Record<string, unknown> =>
				item !== null && typeof item === "object",
		);
	}

	// Single item, wrap it
	if (data && typeof data === "object") {
		return [data as Record<string, unknown>];
	}

	return [];
}

/**
 * Get string value from nested path
 */
function getStringField(obj: Record<string, unknown>, key: string): string {
	const value = obj[key];
	if (typeof value === "string") {
		return value;
	}
	if (value !== null && value !== undefined) {
		return String(value);
	}
	return "";
}

/**
 * Format labels as map[key:value key:value]
 */
function formatLabels(obj: Record<string, unknown>): string {
	const labels = obj["labels"];
	if (!labels || typeof labels !== "object") {
		return "";
	}

	const labelMap = labels as Record<string, unknown>;
	const entries = Object.entries(labelMap)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([k, v]) => `${k}:${v}`);

	if (entries.length === 0) {
		return "";
	}

	return `map[${entries.join(" ")}]`;
}

/**
 * Wrap text to fit within max width
 */
function wrapText(text: string, maxWidth: number): string[] {
	if (text.length <= maxWidth) {
		return [text];
	}

	const lines: string[] = [];
	let remaining = text;

	while (remaining.length > 0) {
		if (remaining.length <= maxWidth) {
			lines.push(remaining);
			break;
		}

		// Find break point (prefer space)
		let breakPoint = maxWidth;
		for (let i = maxWidth - 1; i > 0; i--) {
			if (remaining[i] === " ") {
				breakPoint = i;
				break;
			}
		}

		lines.push(remaining.slice(0, breakPoint));
		remaining = remaining.slice(breakPoint).trimStart();
	}

	return lines;
}

/**
 * Format as ASCII box table
 */
export function formatTable(data: unknown): string {
	const items = extractItems(data);
	if (items.length === 0) {
		return "";
	}

	// Standard columns for F5 XC resources
	const headers = ["NAMESPACE", "NAME", "LABELS"];
	const widths = [9, 27, 30];

	// Build rows with wrapping
	const rows: string[][][] = [];
	for (const item of items) {
		const row = [
			getStringField(item, "namespace") || "<None>",
			getStringField(item, "name") || "<None>",
			formatLabels(item) || "<None>",
		];

		// Wrap each cell
		const wrappedCells = row.map((cell, i) => wrapText(cell, widths[i]!));
		const maxLines = Math.max(...wrappedCells.map((c) => c.length));

		const wrappedRows: string[][] = [];
		for (let line = 0; line < maxLines; line++) {
			wrappedRows.push(wrappedCells.map((c) => c[line] ?? ""));
		}
		rows.push(wrappedRows);
	}

	// Build output
	const lines: string[] = [];

	// Print box line
	const boxLine = "+" + widths.map((w) => "-".repeat(w + 2)).join("+") + "+";

	// Print header
	lines.push(boxLine);
	lines.push(
		"|" +
			headers
				.map((h, i) => {
					const padding = widths[i]! - h.length;
					const leftPad = Math.floor(padding / 2);
					const rightPad = padding - leftPad;
					return (
						" " +
						" ".repeat(leftPad) +
						h +
						" ".repeat(rightPad) +
						" "
					);
				})
				.join("|") +
			"|",
	);
	lines.push(boxLine);

	// Print data rows
	for (const wrappedRows of rows) {
		for (const row of wrappedRows) {
			lines.push(
				"|" +
					row
						.map((cell, i) => {
							const padding = widths[i]! - cell.length;
							return " " + cell + " ".repeat(padding) + " ";
						})
						.join("|") +
					"|",
			);
		}
		lines.push(boxLine);
	}

	return lines.join("\n");
}

/**
 * Format as tab-separated values
 */
export function formatTSV(data: unknown): string {
	const items = extractItems(data);
	if (items.length === 0) {
		return "";
	}

	// Get all keys
	const allKeys = new Set<string>();
	for (const item of items) {
		Object.keys(item).forEach((k) => allKeys.add(k));
	}

	// Priority order
	const priority = ["name", "namespace", "status", "created", "modified"];
	const headers = [
		...priority.filter((p) => allKeys.has(p)),
		...[...allKeys].filter((k) => !priority.includes(k)).sort(),
	];

	// Build rows
	const lines: string[] = [];
	for (const item of items) {
		const values = headers.map((h) => {
			const val = item[h];
			if (val === null || val === undefined) return "";
			if (typeof val === "object") return JSON.stringify(val);
			return String(val);
		});
		lines.push(values.join("\t"));
	}

	return lines.join("\n");
}

/**
 * Parse output format from string
 */
export function parseOutputFormat(format: string): OutputFormat {
	switch (format.toLowerCase()) {
		case "json":
			return "json";
		case "yaml":
			return "yaml";
		case "table":
		case "text":
		case "":
			return "table";
		case "tsv":
			return "tsv";
		case "none":
			return "none";
		default:
			return "yaml";
	}
}

/**
 * Format API error with helpful context
 */
export function formatAPIError(
	statusCode: number,
	body: unknown,
	operation: string,
): string {
	const lines: string[] = [];
	lines.push(`ERROR: ${operation} failed (HTTP ${statusCode})`);

	// Try to extract error details
	if (body && typeof body === "object") {
		const errResp = body as Record<string, unknown>;
		if (errResp.message) {
			lines.push(`  Message: ${errResp.message}`);
		}
		if (errResp.code) {
			lines.push(`  Code: ${errResp.code}`);
		}
		if (errResp.details) {
			lines.push(`  Details: ${errResp.details}`);
		}
	}

	// Add hints based on status code
	switch (statusCode) {
		case 401:
			lines.push(
				"\nHint: Authentication failed. Check your credentials with 'login profile show'",
			);
			break;
		case 403:
			lines.push(
				"\nHint: Permission denied. You may not have access to this resource.",
			);
			break;
		case 404:
			lines.push(
				"\nHint: Resource not found. Verify the name and namespace are correct.",
			);
			break;
		case 409:
			lines.push(
				"\nHint: Conflict - resource may already exist or be in a conflicting state.",
			);
			break;
		case 429:
			lines.push("\nHint: Rate limited. Please wait and try again.");
			break;
		case 500:
		case 502:
		case 503:
			lines.push(
				"\nHint: Server error. Please try again later or contact support.",
			);
			break;
	}

	return lines.join("\n");
}
