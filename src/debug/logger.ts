/**
 * Debug Logger
 *
 * Comprehensive debug logging system for troubleshooting REPL issues.
 * Enable with: XCSH_DEBUG=1 or DEBUG=xcsh
 * Log file: XCSH_DEBUG_FILE=/path/to/file.log (default: ./xcsh-debug.log)
 *
 * Categories:
 * - output: Output buffer management
 * - render: Ink Static component rendering
 * - terminal: Terminal dimensions and resize events
 * - buffer: Buffer truncation and memory management
 */

import { appendFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DEBUG_ENABLED =
	process.env.XCSH_DEBUG === "1" ||
	process.env.DEBUG === "xcsh" ||
	process.env.DEBUG === "*";

const DEBUG_FILE = process.env.XCSH_DEBUG_FILE || "./xcsh-debug.log";

type LogCategory = "output" | "render" | "terminal" | "buffer" | "all";

// Initialize log file (truncate on start)
if (DEBUG_ENABLED) {
	const logPath = resolve(DEBUG_FILE);
	try {
		writeFileSync(
			logPath,
			`=== XCSH Debug Log Started at ${new Date().toISOString()} ===\n`,
		);
		console.error(`[DEBUG] Logging to: ${logPath}`);
	} catch (error) {
		console.error(`[DEBUG] Failed to initialize log file: ${error}`);
	}
}

/**
 * Check if a category is enabled for logging
 */
function isCategoryEnabled(category: LogCategory): boolean {
	if (!DEBUG_ENABLED) return false;

	const categoryFilter = process.env.XCSH_DEBUG_CATEGORY;
	if (!categoryFilter || categoryFilter === "all") return true;

	const enabledCategories = categoryFilter.split(",");
	return enabledCategories.includes(category);
}

/**
 * Format timestamp for logs
 */
function timestamp(): string {
	const now = new Date();
	const ms = now.getMilliseconds().toString().padStart(3, "0");
	return `${now.toISOString().slice(11, 19)}.${ms}`;
}

/**
 * Write log entry to file
 */
function writeToLog(entry: string): void {
	try {
		appendFileSync(DEBUG_FILE, entry + "\n");
	} catch {
		// Silently fail if we can't write to log file
	}
}

/**
 * Core debug logger
 */
export function debug(
	category: LogCategory,
	message: string,
	data?: unknown,
): void {
	if (!isCategoryEnabled(category)) return;

	const prefix = `[${timestamp()}] [${category.toUpperCase()}]`;

	let logEntry: string;
	if (data === undefined) {
		logEntry = `${prefix} ${message}`;
	} else if (typeof data === "object" && data !== null) {
		logEntry = `${prefix} ${message}\n${JSON.stringify(data, null, 2)}`;
	} else {
		logEntry = `${prefix} ${message}: ${data}`;
	}

	writeToLog(logEntry);
}

/**
 * Specialized loggers for each category
 */
export const debugOutput = (message: string, data?: unknown) =>
	debug("output", message, data);

export const debugRender = (message: string, data?: unknown) =>
	debug("render", message, data);

export const debugTerminal = (message: string, data?: unknown) =>
	debug("terminal", message, data);

export const debugBuffer = (message: string, data?: unknown) =>
	debug("buffer", message, data);

/**
 * Check if debug is enabled
 */
export function isDebugEnabled(): boolean {
	return DEBUG_ENABLED;
}

/**
 * Log a separator for readability
 */
export function debugSeparator(): void {
	if (!DEBUG_ENABLED) return;
	writeToLog("─".repeat(80));
}
