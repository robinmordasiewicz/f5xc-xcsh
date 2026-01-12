/**
 * Beautiful Table Formatter
 * Unicode tables with F5 brand red borders
 * Auto-disables colors when piped/non-TTY
 */

import { colors } from "../branding/index.js";
import type {
	BoxCharacters,
	ColumnDefinition,
	TableConfig,
	TableStyle,
} from "./types.js";
import { DEFAULT_TABLE_STYLE, PLAIN_TABLE_STYLE } from "./types.js";
import { shouldUseColors } from "./resolver.js";
import { getTerminalWidth } from "./terminal.js";

/**
 * Unicode box drawing characters (rounded corners)
 */
const UNICODE_BOX: BoxCharacters = {
	topLeft: "\u256D", // ╭
	topRight: "\u256E", // ╮
	bottomLeft: "\u2570", // ╰
	bottomRight: "\u256F", // ╯
	horizontal: "\u2500", // ─
	vertical: "\u2502", // │
	leftT: "\u251C", // ├
	rightT: "\u2524", // ┤
	topT: "\u252C", // ┬
	bottomT: "\u2534", // ┴
	cross: "\u253C", // ┼
};

/**
 * ASCII box drawing characters
 */
const ASCII_BOX: BoxCharacters = {
	topLeft: "+",
	topRight: "+",
	bottomLeft: "+",
	bottomRight: "+",
	horizontal: "-",
	vertical: "|",
	leftT: "+",
	rightT: "+",
	topT: "+",
	bottomT: "+",
	cross: "+",
};

/**
 * Get box characters based on style
 */
function getBoxCharacters(style: TableStyle): BoxCharacters {
	return style.unicode ? UNICODE_BOX : ASCII_BOX;
}

/**
 * Apply color to text if colors are enabled
 */
function applyColor(text: string, color: string, useColors: boolean): string {
	if (!useColors) {
		return text;
	}
	return `${color}${text}${colors.reset}`;
}

/**
 * Wrap text to fit within max width, respecting word boundaries
 */
export function wrapText(text: string, maxWidth: number): string[] {
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
 * Get value from object using accessor
 * Supports both top-level properties (for list responses)
 * and metadata.* nested properties (for get responses)
 */
function getValue(
	row: Record<string, unknown>,
	accessor: string | ((row: Record<string, unknown>) => string),
): string {
	if (typeof accessor === "function") {
		return accessor(row);
	}

	// First try direct access
	let value = row[accessor];

	// If not found, try metadata.* path (for get responses)
	if (value === null || value === undefined) {
		const metadata = row["metadata"] as Record<string, unknown> | undefined;
		if (metadata && typeof metadata === "object") {
			value = metadata[accessor];
		}
	}

	if (value === null || value === undefined) {
		return "";
	}
	if (typeof value === "object") {
		// Handle labels object specially
		if (accessor === "labels") {
			return formatLabelsValue(value as Record<string, unknown>);
		}
		// Use tree formatting for complex values in table cells
		if (isComplexValue(value)) {
			return formatIndentedTree(value, 0, 4, 40).join("\n");
		}
		return JSON.stringify(value);
	}
	return String(value);
}

/**
 * Format labels as map[key:value key:value]
 */
function formatLabelsValue(labels: Record<string, unknown>): string {
	const entries = Object.entries(labels)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([k, v]) => `${k}:${v}`);

	if (entries.length === 0) {
		return "";
	}

	return `map[${entries.join(" ")}]`;
}

/**
 * Check if a value is complex enough to warrant tree formatting
 * Complex = nested objects, arrays with objects, or objects with >3 keys
 */
function isComplexValue(value: unknown): boolean {
	if (value === null || value === undefined) return false;
	if (typeof value !== "object") return false;

	if (Array.isArray(value)) {
		// Array with any objects inside is complex
		return value.some((item) => typeof item === "object" && item !== null);
	}

	// Object - check if any values are objects/arrays
	const obj = value as Record<string, unknown>;
	const keys = Object.keys(obj);

	// Object with more than 3 keys is complex
	if (keys.length > 3) return true;

	// Check if any child is an object/array
	return keys.some((k) => {
		const v = obj[k];
		return typeof v === "object" && v !== null;
	});
}

/**
 * Format a complex value as an indented tree structure
 * @param value - The value to format (object or array)
 * @param indent - Current indentation level (number of spaces)
 * @param maxDepth - Maximum nesting depth before falling back to JSON
 * @param maxWidth - Maximum width for values before truncating
 * @returns Array of lines representing the tree structure
 */
function formatIndentedTree(
	value: unknown,
	indent: number = 0,
	maxDepth: number = 6,
	maxWidth: number = 60,
): string[] {
	const INDENT_SIZE = 2;
	const lines: string[] = [];

	// Base cases
	if (value === null) {
		return ["null"];
	}
	if (value === undefined) {
		return [""];
	}
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	) {
		return [String(value)];
	}

	// Depth limit check - fall back to compact JSON
	if (indent / INDENT_SIZE >= maxDepth) {
		const json = JSON.stringify(value);
		return json.length > maxWidth
			? [json.slice(0, maxWidth - 3) + "..."]
			: [json];
	}

	// Handle arrays
	if (Array.isArray(value)) {
		// Empty array
		if (value.length === 0) {
			return ["[]"];
		}
		// Simple array of primitives - show inline
		const isSimple = value.every(
			(v) =>
				typeof v === "string" ||
				typeof v === "number" ||
				typeof v === "boolean" ||
				v === null,
		);
		if (isSimple && value.length <= 5) {
			const inline = `[${value.map((v) => (v === null ? "null" : String(v))).join(", ")}]`;
			if (inline.length <= maxWidth) {
				return [inline];
			}
		}
		// Complex array - format each item
		for (let i = 0; i < value.length; i++) {
			const item = value[i];
			const prefix = `[${i}]: `;
			if (typeof item === "object" && item !== null) {
				lines.push(prefix);
				const subLines = formatIndentedTree(
					item,
					indent + INDENT_SIZE,
					maxDepth,
					maxWidth,
				);
				for (const subLine of subLines) {
					lines.push(" ".repeat(INDENT_SIZE) + subLine);
				}
			} else {
				const formatted = formatIndentedTree(
					item,
					indent,
					maxDepth,
					maxWidth,
				);
				lines.push(prefix + formatted[0]);
			}
		}
		return lines;
	}

	// Handle objects
	if (typeof value === "object") {
		const obj = value as Record<string, unknown>;
		const keys = Object.keys(obj);

		// Empty object
		if (keys.length === 0) {
			return ["{}"];
		}

		// Small object with only simple values - try inline format
		if (keys.length <= 2) {
			const allSimple = keys.every((k) => {
				const v = obj[k];
				return (
					v === null ||
					typeof v === "string" ||
					typeof v === "number" ||
					typeof v === "boolean" ||
					(typeof v === "object" &&
						v !== null &&
						Object.keys(v).length === 0)
				);
			});
			if (allSimple) {
				const inline = keys
					.map((k) => {
						const v = obj[k];
						if (v === null) return `${k}: null`;
						if (
							typeof v === "object" &&
							Object.keys(v as object).length === 0
						) {
							return Array.isArray(v) ? `${k}: []` : `${k}: {}`;
						}
						return `${k}: ${v}`;
					})
					.join(", ");
				if (inline.length <= maxWidth) {
					return [inline];
				}
			}
		}

		// Format each key-value pair
		for (const key of keys) {
			const childValue = obj[key];

			// Check if child is a complex object/array
			if (typeof childValue === "object" && childValue !== null) {
				const childObj = childValue as
					| Record<string, unknown>
					| unknown[];
				const isEmpty = Array.isArray(childObj)
					? childObj.length === 0
					: Object.keys(childObj).length === 0;

				if (isEmpty) {
					// Empty object/array - show inline
					lines.push(
						`${key}: ${Array.isArray(childObj) ? "[]" : "{}"}`,
					);
				} else {
					// Complex child - put key on its own line, indent children
					lines.push(`${key}:`);
					const subLines = formatIndentedTree(
						childValue,
						indent + INDENT_SIZE,
						maxDepth,
						maxWidth,
					);
					for (const subLine of subLines) {
						lines.push(" ".repeat(INDENT_SIZE) + subLine);
					}
				}
			} else {
				// Simple value - inline with key
				const formatted = formatIndentedTree(
					childValue,
					indent,
					maxDepth,
					maxWidth,
				);
				lines.push(`${key}: ${formatted[0]}`);
			}
		}
		return lines;
	}

	return [String(value)];
}

/**
 * Calculate column widths based on content
 */
function calculateColumnWidths(
	columns: ColumnDefinition[],
	rows: Record<string, unknown>[],
	maxTableWidth?: number,
): number[] {
	const widths = columns.map((col) => {
		// Start with header width
		let width = col.header.length;

		// Check all row values
		for (const row of rows) {
			const value = getValue(row, col.accessor);
			width = Math.max(width, value.length);
		}

		// Apply min/max constraints
		if (col.minWidth) {
			width = Math.max(width, col.minWidth);
		}
		if (col.maxWidth) {
			width = Math.min(width, col.maxWidth);
		}
		if (col.width) {
			width = col.width;
		}

		return width;
	});

	// If max table width is set, proportionally reduce columns
	if (maxTableWidth) {
		const totalWidth =
			widths.reduce((a, b) => a + b, 0) + columns.length * 3 + 1;
		if (totalWidth > maxTableWidth) {
			const ratio = (maxTableWidth - columns.length * 3 - 1) / totalWidth;
			for (let i = 0; i < widths.length; i++) {
				widths[i] = Math.max(5, Math.floor(widths[i]! * ratio));
			}
		}
	}

	return widths;
}

/**
 * Format data as a beautiful table with F5 branding
 */
export function formatBeautifulTable(
	data: Record<string, unknown>[],
	config: TableConfig,
	noColor: boolean = false,
): string {
	if (data.length === 0) {
		return "";
	}

	// Determine style and colors
	const useColors = shouldUseColors(undefined, noColor);
	const style = useColors
		? (config.style ?? DEFAULT_TABLE_STYLE)
		: PLAIN_TABLE_STYLE;
	const box = getBoxCharacters(style);
	const borderColor = style.borderColor ?? colors.red;

	// Calculate column widths using terminal width if maxWidth not explicitly set
	const effectiveMaxWidth = config.maxWidth ?? getTerminalWidth();
	const widths = calculateColumnWidths(
		config.columns,
		data,
		effectiveMaxWidth,
	);

	// Build table lines
	const lines: string[] = [];

	// Helper to colorize borders
	const colorBorder = (text: string) =>
		applyColor(text, borderColor, useColors && style.coloredBorders);

	// Build horizontal line
	const buildHorizontalLine = (
		left: string,
		mid: string,
		right: string,
		fill: string,
	): string => {
		const segments = widths.map((w) => fill.repeat(w + 2));
		return colorBorder(left + segments.join(mid) + right);
	};

	// Top border with optional title
	if (config.title) {
		const title = ` ${config.title} `;
		const totalWidth =
			widths.reduce((a, b) => a + b, 0) + widths.length * 3 - 1;
		const remainingWidth = totalWidth - title.length;
		const leftDashes = 1;
		const rightDashes = Math.max(0, remainingWidth - leftDashes);

		lines.push(
			colorBorder(box.topLeft + box.horizontal.repeat(leftDashes)) +
				title +
				colorBorder(box.horizontal.repeat(rightDashes) + box.topRight),
		);
	} else {
		lines.push(
			buildHorizontalLine(
				box.topLeft,
				box.topT,
				box.topRight,
				box.horizontal,
			),
		);
	}

	// Header row
	const headerCells = config.columns.map((col, i) => {
		const padding = widths[i]! - col.header.length;
		const leftPad = Math.floor(padding / 2);
		const rightPad = padding - leftPad;
		const content = " ".repeat(leftPad) + col.header + " ".repeat(rightPad);
		return ` ${content} `;
	});
	lines.push(
		colorBorder(box.vertical) +
			headerCells.join(colorBorder(box.vertical)) +
			colorBorder(box.vertical),
	);

	// Header separator
	lines.push(
		buildHorizontalLine(box.leftT, box.cross, box.rightT, box.horizontal),
	);

	// Data rows
	for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
		const row = data[rowIndex]!;

		// Get cell values and wrap text
		const cellValues = config.columns.map((col, i) => {
			const value = getValue(row, col.accessor) || "<None>";
			return config.wrapText !== false
				? wrapText(value, widths[i]!)
				: [value.slice(0, widths[i]!)];
		});

		// Find max lines needed for this row
		const maxLines = Math.max(...cellValues.map((c) => c.length));

		// Output each line of the row
		for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
			const cells = cellValues.map((cellLines, i) => {
				const text = cellLines[lineIndex] ?? "";
				const padding = widths[i]! - text.length;
				const align = config.columns[i]?.align ?? "left";

				let content: string;
				if (align === "center") {
					const leftPad = Math.floor(padding / 2);
					const rightPad = padding - leftPad;
					content = " ".repeat(leftPad) + text + " ".repeat(rightPad);
				} else if (align === "right") {
					content = " ".repeat(padding) + text;
				} else {
					content = text + " ".repeat(padding);
				}

				return ` ${content} `;
			});

			lines.push(
				colorBorder(box.vertical) +
					cells.join(colorBorder(box.vertical)) +
					colorBorder(box.vertical),
			);
		}

		// Row separator (optional, or after last row as bottom border)
		if (rowIndex < data.length - 1 && config.rowSeparators) {
			lines.push(
				buildHorizontalLine(
					box.leftT,
					box.cross,
					box.rightT,
					box.horizontal,
				),
			);
		}
	}

	// Bottom border
	lines.push(
		buildHorizontalLine(
			box.bottomLeft,
			box.bottomT,
			box.bottomRight,
			box.horizontal,
		),
	);

	return lines.join("\n");
}

/**
 * Default columns for F5 XC resources (with namespace)
 */
export const DEFAULT_RESOURCE_COLUMNS: ColumnDefinition[] = [
	{ header: "NAMESPACE", accessor: "namespace", minWidth: 9 },
	{ header: "NAME", accessor: "name", minWidth: 10, maxWidth: 40 },
	{ header: "LABELS", accessor: "labels", minWidth: 10, maxWidth: 35 },
];

/**
 * Columns for top-level resources without namespace (e.g., namespaces themselves)
 */
export const TOP_LEVEL_RESOURCE_COLUMNS: ColumnDefinition[] = [
	{ header: "NAME", accessor: "name", minWidth: 10, maxWidth: 30 },
	{
		header: "DESCRIPTION",
		accessor: "description",
		minWidth: 15,
		maxWidth: 50,
	},
	{ header: "LABELS", accessor: "labels", minWidth: 10, maxWidth: 35 },
];

/**
 * Detect if items are top-level resources (no namespace)
 * Returns true if all items have empty or missing namespace field
 */
function isTopLevelResource(items: Record<string, unknown>[]): boolean {
	if (items.length === 0) return false;

	// Check if all items have empty/missing namespace
	return items.every((item) => {
		const ns = item.namespace;
		return ns === "" || ns === null || ns === undefined;
	});
}

/**
 * Format F5 XC resource list as beautiful table
 * Convenience function for common use case
 * Automatically detects top-level resources and adjusts columns
 */
export function formatResourceTable(
	data: unknown,
	noColor: boolean = false,
): string {
	const items = extractItems(data);
	if (items.length === 0) {
		return "";
	}

	// Choose columns based on whether resources have namespaces
	const columns = isTopLevelResource(items)
		? TOP_LEVEL_RESOURCE_COLUMNS
		: DEFAULT_RESOURCE_COLUMNS;

	return formatBeautifulTable(
		items,
		{
			columns,
			wrapText: true,
		},
		noColor,
	);
}

/**
 * Extract items from various data formats
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
 * Format a simple key-value box (like whoami)
 * Uses F5 brand red borders with title
 * Supports optional maxWidth for constraining box to terminal width
 */
export function formatKeyValueBox(
	data: Array<{ label: string; value: string }>,
	title: string,
	noColor: boolean = false,
	maxWidth?: number,
): string {
	if (data.length === 0) {
		return "";
	}

	const useColors = shouldUseColors(undefined, noColor);
	const box = useColors ? UNICODE_BOX : ASCII_BOX;
	const borderColor = colors.red;

	const colorBorder = (text: string) =>
		applyColor(text, borderColor, useColors);

	// Find max label width for alignment
	const maxLabelWidth = Math.max(...data.map((d) => d.label.length));

	// Calculate effective max width (terminal width or explicit)
	// Box structure: "│ " + label + ":  " + value + " │"
	// That's 2 (left border + space) + label + 3 (":  ") + value + 2 (space + right border)
	const effectiveMaxWidth = maxWidth ?? getTerminalWidth();
	const boxOverhead = 7; // "│ " + ":  " + " │"
	const maxValueWidth = Math.max(
		20,
		effectiveMaxWidth - maxLabelWidth - boxOverhead,
	);

	// Format content lines with value wrapping and multi-line support
	const contentLines: string[] = [];
	for (const d of data) {
		const paddedLabel = d.label.padEnd(maxLabelWidth);
		const indent = " ".repeat(maxLabelWidth + 3); // align with value after ":  "

		// Split value by newlines first (for tree-formatted values)
		const valueLines = d.value.split("\n");

		// Process each line of the value
		let isFirstLine = true;
		for (const valueLine of valueLines) {
			// Wrap each line if it exceeds max width
			const wrappedLines = wrapText(valueLine, maxValueWidth);

			for (const wrappedLine of wrappedLines) {
				if (isFirstLine) {
					// First line includes the label
					contentLines.push(`${paddedLabel}:  ${wrappedLine}`);
					isFirstLine = false;
				} else {
					// Continuation lines are indented to align with value column
					contentLines.push(`${indent}${wrappedLine}`);
				}
			}
		}
	}

	// Calculate box width - use min of content width and effective max
	const titleText = ` ${title} `;
	const maxContentWidth = Math.min(
		Math.max(...contentLines.map((l) => l.length), titleText.length),
		effectiveMaxWidth - 4, // 4 = borders + padding on each side
	);
	const innerWidth = maxContentWidth + 2;

	const lines: string[] = [];

	// Top border with title
	const remainingWidth = innerWidth - titleText.length;
	const leftDashes = 1;
	const rightDashes = Math.max(0, remainingWidth - leftDashes);
	lines.push(
		colorBorder(box.topLeft + box.horizontal.repeat(leftDashes)) +
			titleText +
			colorBorder(box.horizontal.repeat(rightDashes) + box.topRight),
	);

	// Content lines
	for (const text of contentLines) {
		// Truncate if still too long (shouldn't happen with wrapping, but safety)
		const displayText = text.slice(0, innerWidth - 2);
		const padding = innerWidth - displayText.length;
		lines.push(
			colorBorder(box.vertical) +
				` ${displayText}${" ".repeat(Math.max(0, padding - 1))}` +
				colorBorder(box.vertical),
		);
	}

	// Bottom border
	lines.push(
		colorBorder(
			box.bottomLeft +
				box.horizontal.repeat(innerWidth) +
				box.bottomRight,
		),
	);

	return lines.join("\n");
}

/**
 * Fields to exclude from resource details display
 * These are internal/system fields not useful for users
 */
const EXCLUDED_FIELDS = new Set([
	"system_metadata",
	"get_spec",
	"status",
	"referring_objects",
	"disabled_referred_objects",
	"object_type",
]);

/**
 * Fields to prioritize at the top of details display
 */
const PRIORITY_FIELDS = [
	"name",
	"namespace",
	"labels",
	"description",
	"domains",
];

/**
 * Format a value for display in details view
 * Simple values: display directly
 * Simple arrays of strings: show as [item1, item2, ...]
 * Complex objects/arrays: show as compact JSON
 */
function formatDetailValue(value: unknown): string {
	if (value === null || value === undefined) {
		return "";
	}

	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	) {
		return String(value);
	}

	if (Array.isArray(value)) {
		// Check if it's a simple array of strings/numbers
		const isSimple = value.every(
			(v) => typeof v === "string" || typeof v === "number",
		);
		if (isSimple && value.length <= 5) {
			return `[${value.join(", ")}]`;
		}
		// Complex array - use tree format
		return formatIndentedTree(value, 0, 6, 60).join("\n");
	}

	if (typeof value === "object") {
		// Check for labels - format specially
		const obj = value as Record<string, unknown>;
		const keys = Object.keys(obj);

		// If it's a small object with only simple values, show inline
		if (keys.length <= 3) {
			const allSimple = keys.every((k) => {
				const v = obj[k];
				return (
					typeof v === "string" ||
					typeof v === "number" ||
					typeof v === "boolean"
				);
			});
			if (allSimple) {
				return keys.map((k) => `${k}: ${obj[k]}`).join(", ");
			}
		}

		// Complex object - use tree format
		return formatIndentedTree(value, 0, 6, 60).join("\n");
	}

	return String(value);
}

/**
 * Flatten resource data into key-value pairs for display
 * Merges metadata and spec into a single flat structure
 */
function flattenResourceData(
	data: Record<string, unknown>,
): Array<{ key: string; value: string }> {
	const result: Array<{ key: string; value: string }> = [];
	const seen = new Set<string>();

	// Helper to add a field
	const addField = (key: string, value: unknown) => {
		if (EXCLUDED_FIELDS.has(key) || seen.has(key)) return;
		if (value === null || value === undefined) return;

		seen.add(key);
		const formatted = formatDetailValue(value);
		if (formatted) {
			result.push({ key, value: formatted });
		}
	};

	// First pass: extract from metadata
	const metadata = data.metadata as Record<string, unknown> | undefined;
	if (metadata && typeof metadata === "object") {
		for (const key of PRIORITY_FIELDS) {
			if (key in metadata) {
				addField(key, metadata[key]);
			}
		}
		// Add remaining metadata fields
		for (const [key, value] of Object.entries(metadata)) {
			addField(key, value);
		}
	}

	// Second pass: extract from spec
	const spec = data.spec as Record<string, unknown> | undefined;
	if (spec && typeof spec === "object") {
		for (const [key, value] of Object.entries(spec)) {
			addField(key, value);
		}
	}

	// Third pass: top-level fields (for flat responses)
	for (const key of PRIORITY_FIELDS) {
		if (key in data && key !== "metadata" && key !== "spec") {
			addField(key, data[key]);
		}
	}
	for (const [key, value] of Object.entries(data)) {
		if (key !== "metadata" && key !== "spec") {
			addField(key, value);
		}
	}

	return result;
}

/**
 * Format a single resource as a details table (key-value pairs)
 * Similar to kubectl get <resource> <name> but with beautiful formatting
 */
export function formatResourceDetails(
	data: Record<string, unknown>,
	noColor: boolean = false,
): string {
	const fields = flattenResourceData(data);
	if (fields.length === 0) {
		return "";
	}

	// Get resource name for title
	const metadata = data.metadata as Record<string, unknown> | undefined;
	const name =
		(metadata?.name as string) ||
		(data.name as string) ||
		"Resource Details";

	// Convert to formatKeyValueBox format
	const boxData = fields.map((f) => ({
		label: f.key,
		value: f.value,
	}));

	return formatKeyValueBox(boxData, name, noColor);
}
