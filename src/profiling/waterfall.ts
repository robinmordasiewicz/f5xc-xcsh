/**
 * ASCII Waterfall Visualization
 *
 * Renders a visual timeline of startup phases showing parallel operations
 * and bottlenecks in ASCII art format.
 */

import type { ProfileReport, ProfileSpan } from "./profiler.js";

const BOX_CHARS = {
	topLeft: "\u250c",
	topRight: "\u2510",
	bottomLeft: "\u2514",
	bottomRight: "\u2518",
	horizontal: "\u2500",
	vertical: "\u2502",
	cross: "\u253c",
	teeDown: "\u252c",
	teeUp: "\u2534",
	teeRight: "\u251c",
	teeLeft: "\u2524",
};

const TREE_CHARS = {
	branch: "\u251c",
	last: "\u2514",
	vertical: "\u2502",
	horizontal: "\u2500",
};

interface FlatSpan {
	name: string;
	label: string;
	startTime: number;
	duration: number;
	depth: number;
	isNetwork: boolean;
	isBottleneck: boolean;
	isLast: boolean;
}

/**
 * Flatten hierarchical spans into a list with depth info
 */
function flattenSpans(
	spans: ProfileSpan[],
	depth: number = 0,
	bottleneckIds: Set<string>,
): FlatSpan[] {
	const result: FlatSpan[] = [];

	for (let i = 0; i < spans.length; i++) {
		const span = spans[i];
		if (!span) continue;

		const isLast = i === spans.length - 1;

		result.push({
			name: span.name,
			label: span.label,
			startTime: span.startTime,
			duration: span.duration ?? 0,
			depth,
			isNetwork: span.isNetwork ?? false,
			isBottleneck: bottleneckIds.has(span.id),
			isLast,
		});

		if (span.children.length > 0) {
			result.push(
				...flattenSpans(span.children, depth + 1, bottleneckIds),
			);
		}
	}

	return result;
}

/**
 * Create tree prefix for indented items
 */
function createTreePrefix(depth: number, isLast: boolean): string {
	if (depth === 0) return "";

	const indent = "  ".repeat(depth - 1);
	const branch = isLast ? TREE_CHARS.last : TREE_CHARS.branch;
	return indent + branch + TREE_CHARS.horizontal;
}

/**
 * Render a timeline bar
 */
function renderBar(
	startTime: number,
	duration: number,
	totalTime: number,
	barWidth: number,
): string {
	if (totalTime === 0) return " ".repeat(barWidth);

	const startPos = Math.floor((startTime / totalTime) * barWidth);
	const barLen = Math.max(1, Math.ceil((duration / totalTime) * barWidth));

	const before = " ".repeat(Math.min(startPos, barWidth));
	const bar = "\u2588".repeat(Math.min(barLen, barWidth - startPos));
	const after = " ".repeat(Math.max(0, barWidth - startPos - barLen));

	return (before + bar + after).slice(0, barWidth);
}

/**
 * Format duration in appropriate units
 */
function formatDuration(ms: number): string {
	if (ms < 1000) {
		return `${Math.round(ms)}ms`;
	}
	return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Generate ASCII waterfall visualization
 */
export function renderWaterfall(report: ProfileReport): string {
	const lines: string[] = [];
	const totalTime = report.startupTimeMs;

	// Configuration
	const labelWidth = 28;
	const barWidth = 35;
	const timeWidth = 10;
	const totalWidth = labelWidth + barWidth + timeWidth + 6;

	// Collect bottleneck IDs
	const bottleneckIds = new Set(report.bottlenecks.map((b) => b.spanId));

	// Flatten all spans
	const flatSpans = flattenSpans(report.spans, 0, bottleneckIds);

	// Header
	lines.push(
		BOX_CHARS.topLeft +
			BOX_CHARS.horizontal.repeat(totalWidth - 2) +
			BOX_CHARS.topRight,
	);
	lines.push(
		BOX_CHARS.vertical +
			` XCSH Startup Profile`.padEnd(totalWidth - 14) +
			`Total: ${formatDuration(totalTime)}`.padStart(12) +
			BOX_CHARS.vertical,
	);
	lines.push(
		BOX_CHARS.teeRight +
			BOX_CHARS.horizontal.repeat(totalWidth - 2) +
			BOX_CHARS.teeLeft,
	);

	// Column headers
	const headerPhase = "Phase".padEnd(labelWidth);
	const headerTimeline = "Timeline".padEnd(barWidth);
	const headerTime = "Time".padStart(timeWidth);
	lines.push(
		BOX_CHARS.vertical +
			` ${headerPhase}${BOX_CHARS.vertical} ${headerTimeline}${BOX_CHARS.vertical}${headerTime} ` +
			BOX_CHARS.vertical,
	);
	lines.push(
		BOX_CHARS.teeRight +
			BOX_CHARS.horizontal.repeat(labelWidth + 1) +
			BOX_CHARS.cross +
			BOX_CHARS.horizontal.repeat(barWidth + 1) +
			BOX_CHARS.cross +
			BOX_CHARS.horizontal.repeat(timeWidth + 1) +
			BOX_CHARS.teeLeft,
	);

	// Render each span
	for (const span of flatSpans) {
		const prefix = createTreePrefix(span.depth, span.isLast);
		const networkTag = span.isNetwork ? " [N]" : "";
		const label = (prefix + span.label + networkTag)
			.slice(0, labelWidth)
			.padEnd(labelWidth);

		const bar = renderBar(
			span.startTime,
			span.duration,
			totalTime,
			barWidth,
		);
		const time = formatDuration(span.duration).padStart(timeWidth - 2);

		const warning = span.isBottleneck
			? " !!"
			: span.duration > 100
				? "  !"
				: "   ";

		lines.push(
			BOX_CHARS.vertical +
				` ${label}${BOX_CHARS.vertical} ${bar}${BOX_CHARS.vertical}${time}${warning}` +
				BOX_CHARS.vertical,
		);
	}

	// Footer
	lines.push(
		BOX_CHARS.bottomLeft +
			BOX_CHARS.horizontal.repeat(totalWidth - 2) +
			BOX_CHARS.bottomRight,
	);

	// Legend
	lines.push(
		"[N] = Network call  !! = Bottleneck (>500ms)  ! = Slow (>100ms)",
	);

	// Memory summary
	if (report.memorySnapshots.length > 0) {
		const first = report.memorySnapshots[0];
		const last = report.memorySnapshots[report.memorySnapshots.length - 1];
		lines.push("");
		lines.push(
			`Memory: ${first?.rssMB.toFixed(1)}MB -> Peak ${report.memoryPeakMB.toFixed(1)}MB -> ${last?.rssMB.toFixed(1)}MB (${report.memoryDeltaMB >= 0 ? "+" : ""}${report.memoryDeltaMB.toFixed(1)}MB)`,
		);
	}

	// Bottleneck summary
	if (report.bottlenecks.length > 0) {
		lines.push("");
		lines.push("Bottlenecks Identified:");
		for (let i = 0; i < Math.min(report.bottlenecks.length, 3); i++) {
			const b = report.bottlenecks[i];
			if (!b) continue;
			lines.push(
				`  ${i + 1}. ${b.spanName}: ${formatDuration(b.duration)} - ${b.suggestion}`,
			);
		}
	}

	return lines.join("\n");
}

/**
 * Render a compact waterfall (for basic mode)
 */
export function renderCompactWaterfall(report: ProfileReport): string {
	const lines: string[] = [];
	const totalTime = report.startupTimeMs;

	lines.push(`\n[PROFILE] Startup: ${formatDuration(totalTime)}`);

	// Just show top-level spans
	for (const span of report.spans) {
		const duration = span.duration ?? 0;
		const percentage = ((duration / totalTime) * 100).toFixed(0);
		const bar = "\u2588".repeat(
			Math.min(20, Math.ceil((duration / totalTime) * 20)),
		);
		lines.push(
			`  ${span.label.padEnd(20)} ${bar.padEnd(20)} ${formatDuration(duration).padStart(8)} (${percentage}%)`,
		);
	}

	return lines.join("\n");
}
