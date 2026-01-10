/**
 * Profiling Module for xcsh
 *
 * Provides startup performance profiling with hierarchical span tracking,
 * memory snapshots, network instrumentation, and waterfall visualization.
 *
 * Usage:
 *   XCSH_PROFILE=true xcsh           # Basic timing output
 *   XCSH_PROFILE_LEVEL=detailed xcsh # With memory and phase breakdown
 *   XCSH_PROFILE_LEVEL=full xcsh     # Full waterfall visualization
 */

// Re-export types and classes
export {
	Profiler,
	getProfiler,
	initProfiler,
	type ProfileSpan,
	type NetworkSpan,
	type MemorySnapshot,
	type Bottleneck,
	type ProfileReport,
	type ProfileLevel,
	type ProfilerConfig,
} from "./profiler.js";

export {
	formatReport,
	formatReportJson,
	formatReportText,
	formatReportSummary,
	type ReportFormat,
} from "./reporter.js";

export { renderWaterfall, renderCompactWaterfall } from "./waterfall.js";

import { getProfiler, type ProfileLevel } from "./profiler.js";
import { formatReport, formatReportText } from "./reporter.js";
import { renderWaterfall, renderCompactWaterfall } from "./waterfall.js";

/**
 * Print the final profile report to stderr
 *
 * Call this at the end of startup to output the profiling results.
 */
export function printProfileReport(): void {
	const profiler = getProfiler();
	if (!profiler.isEnabled()) return;

	const report = profiler.generateReport();
	const level = profiler.getLevel();

	let output: string;
	switch (level) {
		case "full":
			output = renderWaterfall(report);
			break;
		case "detailed":
			output = formatReportText(report);
			break;
		case "basic":
			output = renderCompactWaterfall(report);
			break;
		default:
			return;
	}

	console.error("\n" + output);
}

/**
 * Get profile report as JSON string (for external tools)
 */
export function getProfileReportJson(): string | null {
	const profiler = getProfiler();
	if (!profiler.isEnabled()) return null;

	const report = profiler.generateReport();
	return formatReport(report, "json");
}

/**
 * Check if profiling is enabled
 */
export function isProfilingEnabled(): boolean {
	return getProfiler().isEnabled();
}

/**
 * Get current profiling level
 */
export function getProfilingLevel(): ProfileLevel {
	return getProfiler().getLevel();
}
