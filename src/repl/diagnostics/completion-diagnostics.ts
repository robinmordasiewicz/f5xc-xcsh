/**
 * Completion Diagnostic Report Generation
 * Generates human-readable diagnostic reports for troubleshooting completion issues
 */

import type { REPLSession } from "../session.js";
import type { CompletionDiagnostic } from "../completion/types.js";
import { Completer } from "../completion/completer.js";

/**
 * Generate a diagnostic report for completion troubleshooting
 */
export async function generateDiagnosticReport(
	session: REPLSession,
	input: string,
	options: { verbose?: boolean; json?: boolean } = {},
): Promise<string[]> {
	// Create a completer and run diagnostics
	const completer = new Completer();
	completer.setSession(session);

	const diagnostic = await completer.diagnose(input);

	// Return JSON format if requested
	if (options.json) {
		return [formatDiagnosticJSON(diagnostic)];
	}

	// Return formatted text report
	return formatDiagnostic(diagnostic, options.verbose ?? false);
}

/**
 * Format diagnostic as JSON string
 */
export function formatDiagnosticJSON(diagnostic: CompletionDiagnostic): string {
	return JSON.stringify(diagnostic, null, 2);
}

/**
 * Format diagnostic as human-readable text
 */
export function formatDiagnostic(
	diagnostic: CompletionDiagnostic,
	verbose: boolean,
): string[] {
	const output: string[] = [];

	// Header
	output.push("🔍 Completion Diagnostic Report");
	output.push("━".repeat(40));
	output.push("");

	// Input information
	output.push(`Input: "${diagnostic.input}"`);
	output.push(`Cursor Position: ${diagnostic.cursorPosition}`);
	output.push("");

	// Parsed context
	output.push("✓ Parsed Context:");
	output.push(`  Args: [${diagnostic.parsedContext.args.join(", ")}]`);
	output.push(`  Current Word: "${diagnostic.parsedContext.currentWord}"`);
	output.push(`  Is Flag: ${diagnostic.parsedContext.isCompletingFlag}`);
	output.push(
		`  Is Flag Value: ${diagnostic.parsedContext.isCompletingFlagValue}`,
	);
	if (diagnostic.parsedContext.currentFlag) {
		output.push(`  Current Flag: ${diagnostic.parsedContext.currentFlag}`);
	}
	output.push("");

	// Authentication status
	const authSymbol = diagnostic.authentication.isAuthenticated ? "✓" : "✗";
	output.push(`${authSymbol} Authentication:`);
	output.push(
		`  Client: ${diagnostic.authentication.clientConnected ? "Connected" : "Not Connected"}`,
	);
	output.push(
		`  Authenticated: ${diagnostic.authentication.isAuthenticated ? "Yes" : "NO"}`,
	);
	if (diagnostic.authentication.tenant) {
		output.push(`  Tenant: ${diagnostic.authentication.tenant}`);
	}
	output.push("");

	// Namespace resolution
	output.push("✓ Namespace Resolution:");
	if (diagnostic.namespace.fromFlag) {
		output.push(`  From flag: ${diagnostic.namespace.fromFlag}`);
	} else {
		output.push(`  From flag: Not specified`);
	}
	output.push(`  From session: ${diagnostic.namespace.fromSession}`);
	output.push(`  Using: ${diagnostic.namespace.resolved}`);
	output.push("");

	// Resource context (if available)
	if (diagnostic.resourceContext) {
		output.push("✓ Resource Context:");
		output.push(`  Domain: ${diagnostic.resourceContext.domain || "none"}`);
		output.push(`  Action: ${diagnostic.resourceContext.action || "none"}`);
		output.push(
			`  Resource Type: ${diagnostic.resourceContext.resourceType || "none"}`,
		);
		output.push(
			`  Name Partial: "${diagnostic.resourceContext.resourceNamePartial}"`,
		);
		output.push("");
	}

	// API Request (if available)
	if (diagnostic.apiRequest) {
		const apiSymbol = diagnostic.apiRequest.error ? "✗" : "✓";
		output.push(`${apiSymbol} API Request:`);
		output.push(`  Endpoint: ${diagnostic.apiRequest.endpoint}`);
		output.push(`  Method: ${diagnostic.apiRequest.method}`);
		output.push(
			`  Cache: ${diagnostic.apiRequest.cacheStatus.toUpperCase()}`,
		);
		if (diagnostic.apiRequest.error) {
			output.push(`  ⚠️  Error: ${diagnostic.apiRequest.error}`);
		}
		output.push("");
	}

	// Failures (if any)
	if (diagnostic.failures && diagnostic.failures.length > 0) {
		output.push("⚠️  Failures:");
		for (const failure of diagnostic.failures) {
			output.push(`  Stage: ${failure.stage}`);
			output.push(`  Message: ${failure.message}`);
			if (failure.suggestion) {
				output.push(`  💡 Suggestion: ${failure.suggestion}`);
			}
			output.push("");
		}
	}

	// Suggestions
	if (diagnostic.suggestions.length > 0) {
		output.push(`✓ Suggestions (${diagnostic.suggestions.length}):`);
		const displayCount = verbose
			? diagnostic.suggestions.length
			: Math.min(10, diagnostic.suggestions.length);
		for (let i = 0; i < displayCount; i++) {
			const suggestion = diagnostic.suggestions[i];
			if (suggestion) {
				output.push(`  ${i + 1}. ${suggestion.text}`);
				if (verbose && suggestion.description) {
					output.push(`     ${suggestion.description}`);
				}
			}
		}
		if (!verbose && diagnostic.suggestions.length > 10) {
			output.push(
				`  ... and ${diagnostic.suggestions.length - 10} more (use --verbose to see all)`,
			);
		}
		output.push("");
	} else {
		output.push("⏭ Suggestions: NONE");
		output.push("");
	}

	// Performance metrics
	output.push("⏱ Performance:");
	output.push(`  Parsing: ${diagnostic.performance.parsingMs}ms`);
	if (diagnostic.performance.apiCallMs !== undefined) {
		output.push(`  API Call: ${diagnostic.performance.apiCallMs}ms`);
	}
	output.push(`  Filtering: ${diagnostic.performance.filteringMs}ms`);
	output.push(`  Total: ${diagnostic.performance.totalMs}ms`);

	return output;
}
