/**
 * Profile Report Generator
 *
 * Generates formatted reports from profile data in JSON or text format.
 */

import type {
	ProfileReport,
	ProfileSpan,
	Bottleneck,
	MemorySnapshot,
} from "./profiler.js";

/**
 * Report format options
 */
export type ReportFormat = "json" | "text" | "summary";

/**
 * Format a profile report as JSON
 */
export function formatReportJson(report: ProfileReport): string {
	return JSON.stringify(report, null, 2);
}

/**
 * Format duration with appropriate units
 */
function formatDuration(ms: number): string {
	if (ms < 1000) {
		return `${Math.round(ms)}ms`;
	}
	return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format a span for text output
 */
function formatSpanText(
	span: ProfileSpan,
	indent: number = 0,
	totalTime: number,
): string[] {
	const lines: string[] = [];
	const prefix = "  ".repeat(indent);
	const duration = span.duration ?? 0;
	const percentage =
		totalTime > 0 ? ((duration / totalTime) * 100).toFixed(1) : "0";
	const networkTag = span.isNetwork ? " [N]" : "";
	const warning = duration > 500 ? " !!" : duration > 100 ? " !" : "";

	lines.push(
		`${prefix}${span.label}${networkTag}: ${formatDuration(duration)} (${percentage}%)${warning}`,
	);

	// Add metadata if present
	if (Object.keys(span.metadata).length > 0) {
		const metaStr = Object.entries(span.metadata)
			.map(([k, v]) => `${k}=${JSON.stringify(v)}`)
			.join(", ");
		lines.push(`${prefix}  metadata: ${metaStr}`);
	}

	// Recursively format children
	for (const child of span.children) {
		lines.push(...formatSpanText(child, indent + 1, totalTime));
	}

	return lines;
}

/**
 * Format bottlenecks for text output
 */
function formatBottlenecksText(bottlenecks: Bottleneck[]): string[] {
	if (bottlenecks.length === 0) {
		return ["  No bottlenecks detected"];
	}

	const lines: string[] = [];
	for (let i = 0; i < bottlenecks.length; i++) {
		const b = bottlenecks[i];
		if (!b) continue;
		lines.push(`  ${i + 1}. ${b.spanName}: ${formatDuration(b.duration)}`);
		lines.push(`     Threshold: ${formatDuration(b.threshold)}`);
		lines.push(`     Suggestion: ${b.suggestion}`);
	}
	return lines;
}

/**
 * Format memory snapshots for text output
 */
function formatMemoryText(snapshots: MemorySnapshot[]): string[] {
	if (snapshots.length === 0) {
		return ["  No memory snapshots"];
	}

	const first = snapshots[0];
	const last = snapshots[snapshots.length - 1];
	const peak = Math.max(...snapshots.map((s) => s.rssMB));

	const lines: string[] = [];
	lines.push(
		`  Start: ${first?.rssMB.toFixed(1)}MB -> Peak: ${peak.toFixed(1)}MB -> End: ${last?.rssMB.toFixed(1)}MB`,
	);
	lines.push(
		`  Delta: ${((last?.rssMB ?? 0) - (first?.rssMB ?? 0)).toFixed(1)}MB`,
	);

	return lines;
}

/**
 * Format a profile report as text
 */
export function formatReportText(report: ProfileReport): string {
	const lines: string[] = [];

	lines.push("=".repeat(60));
	lines.push(`XCSH Startup Profile Report`);
	lines.push(`Total Time: ${formatDuration(report.startupTimeMs)}`);
	lines.push(`Profile Level: ${report.level}`);
	lines.push("=".repeat(60));

	// Phase breakdown
	lines.push("");
	lines.push("PHASES:");
	lines.push("-".repeat(40));
	for (const span of report.spans) {
		lines.push(...formatSpanText(span, 0, report.startupTimeMs));
	}

	// Network calls
	if (report.networkSpans.length > 0) {
		lines.push("");
		lines.push("NETWORK CALLS:");
		lines.push("-".repeat(40));
		for (const span of report.networkSpans) {
			const status = span.error
				? `ERROR: ${span.error}`
				: `${span.statusCode ?? "?"}`;
			const retries =
				span.retryCount > 0 ? ` (${span.retryCount} retries)` : "";
			lines.push(
				`  ${span.method} ${span.url.slice(0, 50)}: ${formatDuration(span.duration ?? 0)} - ${status}${retries}`,
			);
		}
	}

	// Memory
	if (report.memorySnapshots.length > 0) {
		lines.push("");
		lines.push("MEMORY:");
		lines.push("-".repeat(40));
		lines.push(...formatMemoryText(report.memorySnapshots));
	}

	// Bottlenecks
	if (report.bottlenecks.length > 0) {
		lines.push("");
		lines.push("BOTTLENECKS:");
		lines.push("-".repeat(40));
		lines.push(...formatBottlenecksText(report.bottlenecks));
	}

	lines.push("");
	lines.push("=".repeat(60));
	lines.push(
		"[N] = Network call  !! = Critical (>500ms)  ! = Warning (>100ms)",
	);
	lines.push("=".repeat(60));

	return lines.join("\n");
}

/**
 * Format a brief summary of the profile
 */
export function formatReportSummary(report: ProfileReport): string {
	const lines: string[] = [];

	lines.push(
		`[PROFILE SUMMARY] Total: ${formatDuration(report.startupTimeMs)}`,
	);

	if (report.memorySnapshots.length > 0) {
		const delta = report.memoryDeltaMB;
		lines.push(
			`  Memory: peak=${report.memoryPeakMB.toFixed(1)}MB delta=${delta >= 0 ? "+" : ""}${delta.toFixed(1)}MB`,
		);
	}

	if (report.bottlenecks.length > 0) {
		lines.push(`  Bottlenecks: ${report.bottlenecks.length}`);
		const top = report.bottlenecks[0];
		if (top) {
			lines.push(
				`    Top: ${top.spanName} (${formatDuration(top.duration)})`,
			);
		}
	}

	return lines.join("\n");
}

/**
 * Format a profile report in the specified format
 */
export function formatReport(
	report: ProfileReport,
	format: ReportFormat = "text",
): string {
	switch (format) {
		case "json":
			return formatReportJson(report);
		case "summary":
			return formatReportSummary(report);
		case "text":
		default:
			return formatReportText(report);
	}
}
