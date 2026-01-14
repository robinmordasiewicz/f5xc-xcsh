#!/usr/bin/env tsx
/**
 * QA Analysis Script: Command Consistency Analysis
 *
 * Comprehensive audit of all commands to identify drift between:
 * - Tab completion suggestions
 * - Help text / usage specifications
 * - Command execution behavior
 * - Error message usage strings (NEW)
 *
 * Generates a drift report categorized by severity:
 * - 🚨 CRITICAL: Required elements missing or incorrect
 * - ⚠️ WARNING: Optional elements inconsistent or missing
 * - ✅ CLEAN: Consistent across all sources
 */

import * as fs from "fs";
import * as path from "path";
import { customDomains } from "../src/domains/index.js";
import type {
	DomainDefinition,
	CommandDefinition,
	ActionGroup,
	SubcommandGroup,
} from "../src/domains/registry.js";
import {
	parseUsage,
	validateCompletionMatchesUsage,
	formatUsageRequirements,
} from "../src/utils/usage-parser.js";
import type { UsageRequirements } from "../src/utils/usage-parser.js";
import { REPLSession } from "../src/repl/session.js";

/**
 * Command metadata for analysis
 */
interface CommandMetadata {
	/** Full command path (e.g., "login create profile") */
	path: string;
	/** Domain name */
	domain: string;
	/** Command definition */
	command: CommandDefinition;
	/** Parsed usage requirements */
	usage: UsageRequirements;
	/** Whether command has completion handler */
	hasCompletion: boolean;
	/** Source location (for context) */
	source: "action" | "direct" | "subcommand";
}

/**
 * Issue found during analysis
 */
interface ConsistencyIssue {
	/** Issue severity */
	severity: "critical" | "warning";
	/** Command path affected */
	command: string;
	/** Issue description */
	issue: string;
	/** Recommendation for fix */
	recommendation?: string;
}

/**
 * Analysis report summary
 */
interface AnalysisReport {
	/** Total commands analyzed */
	totalCommands: number;
	/** Commands with no issues */
	clean: CommandMetadata[];
	/** Critical issues found */
	critical: ConsistencyIssue[];
	/** Warnings found */
	warnings: ConsistencyIssue[];
	/** Commands missing completion handlers */
	missingCompletion: CommandMetadata[];
	/** Commands missing usage specifications */
	missingUsage: CommandMetadata[];
}

/**
 * Discover all commands from the domain registry
 */
function discoverAllCommands(): CommandMetadata[] {
	const commands: CommandMetadata[] = [];
	const domains = customDomains.all();

	for (const domain of domains) {
		// Process action groups (verb-first routing)
		if (domain.actions) {
			for (const [actionName, actionGroup] of domain.actions) {
				for (const [resourceName, cmd] of actionGroup.resources) {
					const path = `${domain.name} ${actionName} ${resourceName}`;
					commands.push({
						path,
						domain: domain.name,
						command: cmd,
						usage: parseUsage(cmd.usage),
						hasCompletion: !!cmd.completion,
						source: "action",
					});
				}
			}
		}

		// Process direct commands at domain level
		for (const [commandName, cmd] of domain.commands) {
			const path = `${domain.name} ${commandName}`;
			commands.push({
				path,
				domain: domain.name,
				command: cmd,
				usage: parseUsage(cmd.usage),
				hasCompletion: !!cmd.completion,
				source: "direct",
			});
		}

		// Process subcommand groups (legacy)
		for (const [subgroupName, subgroup] of domain.subcommands) {
			for (const [commandName, cmd] of subgroup.commands) {
				const path = `${domain.name} ${subgroupName} ${commandName}`;
				commands.push({
					path,
					domain: domain.name,
					command: cmd,
					usage: parseUsage(cmd.usage),
					hasCompletion: !!cmd.completion,
					source: "subcommand",
				});
			}
		}
	}

	return commands;
}

/**
 * Map command path to source file location
 *
 * @param domain - Domain name (e.g., "login")
 * @param commandPath - Full command path (e.g., "login create profile")
 * @returns Absolute path to source file or null if not found
 *
 * @example
 * getCommandSourcePath("login", "login create profile")
 * // Returns: "src/domains/login/profile/create.ts"
 */
function getCommandSourcePath(
	domain: string,
	commandPath: string,
): string | null {
	const parts = commandPath.split(" ");

	// Remove domain from start if present
	if (parts[0] === domain) {
		parts.shift();
	}

	if (parts.length === 2) {
		// Action group pattern: domain action resource
		// e.g., "login create profile" -> src/domains/login/profile/create.ts
		const [action, resource] = parts;
		const filePath = path.join(
			process.cwd(),
			"src",
			"domains",
			domain,
			resource,
			`${action}.ts`,
		);
		return fs.existsSync(filePath) ? filePath : null;
	} else if (parts.length === 1) {
		// Direct command: domain command
		// e.g., "login status" -> src/domains/login/status.ts
		const filePath = path.join(
			process.cwd(),
			"src",
			"domains",
			domain,
			`${parts[0]}.ts`,
		);
		return fs.existsSync(filePath) ? filePath : null;
	}

	return null;
}

/**
 * Extract all "Usage: ..." strings from a source file
 *
 * @param filePath - Absolute path to TypeScript source file
 * @returns Array of usage strings found in error messages
 *
 * @example
 * extractUsageStringsFromFile("src/domains/login/profile/create.ts")
 * // Returns: ["login profile create <name> --url <api-url> --token <api-token>"]
 */
function extractUsageStringsFromFile(filePath: string): string[] {
	if (!filePath || !fs.existsSync(filePath)) {
		return [];
	}

	try {
		const content = fs.readFileSync(filePath, "utf-8");

		// Regex patterns to match "Usage: ..." strings in various quote styles
		const patterns = [
			/"Usage:\s*([^"]+)"/g, // Double quotes
			/'Usage:\s*([^']+)'/g, // Single quotes
			/`Usage:\s*([^`]+)`/g, // Template literals
		];

		const foundStrings: string[] = [];

		for (const pattern of patterns) {
			let match;
			// Reset regex lastIndex to ensure all matches are found
			pattern.lastIndex = 0;
			while ((match = pattern.exec(content)) !== null) {
				// Extract the usage string after "Usage: "
				const usageString = match[1]?.trim();
				if (usageString) {
					foundStrings.push(usageString);
				}
			}
		}

		return foundStrings;
	} catch (error) {
		// Silently return empty array on read errors
		return [];
	}
}

/**
 * Validate that usage field matches all error message usage strings
 *
 * @param commandPath - Full command path from registry (e.g., "login create profile")
 * @param usageField - Canonical usage from CommandDefinition.usage
 * @param sourceFilePath - Path to source file containing execute() function
 * @returns Array of consistency issues found
 */
function validateAllUsageSources(
	commandPath: string,
	usageField: string,
	sourceFilePath: string | null,
): ConsistencyIssue[] {
	const issues: ConsistencyIssue[] = [];

	if (!sourceFilePath || !fs.existsSync(sourceFilePath)) {
		return issues;
	}

	// Extract all "Usage: ..." strings from source file
	const errorUsageStrings = extractUsageStringsFromFile(sourceFilePath);

	if (errorUsageStrings.length === 0) {
		// No error messages found - this is OK for some commands
		return issues;
	}

	// Parse the canonical usage field
	const canonicalUsage = parseUsage(usageField);

	// Compare each error message usage string
	for (const errorUsage of errorUsageStrings) {
		// CRITICAL: Validate command path order consistency
		// Registry path: "login create profile" (verb-first)
		// Error message MUST show same order, not "login profile create"

		// Check if error message contains the registry command path
		const commandPathRegex = new RegExp(`^${commandPath.replace(/\s+/g, "\\s+")}\\s+`);
		const hasCorrectPath = commandPathRegex.test(errorUsage);

		// Check if error message has alternate (incorrect) path order
		const parts = commandPath.split(" ");
		if (parts.length === 3) {
			// Action group pattern: domain verb noun
			const alternatePath = `${parts[0]} ${parts[2]} ${parts[1]}`; // domain noun verb
			const alternateRegex = new RegExp(`^${alternatePath.replace(/\s+/g, "\\s+")}\\s+`);
			const hasAlternatePath = alternateRegex.test(errorUsage);

			if (hasAlternatePath && !hasCorrectPath) {
				issues.push({
					severity: "critical",
					command: commandPath,
					issue: `Error message shows incorrect command path order: "${alternatePath}" instead of "${commandPath}"`,
					recommendation: `Update error message to use registry path: "Usage: ${commandPath} ${usageField}"`,
				});
				continue; // Skip argument validation if path is wrong
			}
		}

		// Strip command path prefix (use correct registry path)
		const cleanedError = errorUsage
			.replace(commandPathRegex, "")
			.trim();

		// If we couldn't strip the path, the error message doesn't contain it
		if (cleanedError === errorUsage) {
			// Error message doesn't start with command path - might be partial
			// Try to extract just the arguments portion
			const argMatch = errorUsage.match(/^Usage:\s+(.+)$/);
			if (!argMatch) continue;

			const fullUsageLine = argMatch[1];
			// Check if this matches any part of the expected command path
			if (!fullUsageLine.startsWith(commandPath)) {
				issues.push({
					severity: "critical",
					command: commandPath,
					issue: `Error message usage doesn't start with registry path "${commandPath}"`,
					recommendation: `Ensure error message uses: "Usage: ${commandPath} ${usageField}"`,
				});
				continue;
			}
		}

		const errorParsed = parseUsage(cleanedError);
		compareUsageParsed(
			commandPath,
			canonicalUsage,
			errorParsed,
			usageField,
			issues,
		);
	}

	return issues;
}

/**
 * Helper function to compare parsed usage structures
 */
function compareUsageParsed(
	commandPath: string,
	canonicalUsage: UsageRequirements,
	errorParsed: UsageRequirements,
	usageField: string,
	issues: ConsistencyIssue[],
): void {
	// Compare positional arguments
	if (canonicalUsage.positional.length !== errorParsed.positional.length) {
		issues.push({
			severity: "critical",
			command: commandPath,
			issue: `Error message has ${errorParsed.positional.length} positional args, usage field has ${canonicalUsage.positional.length}`,
			recommendation: `Update error message to include all positional arguments from usage specification`,
		});
	}

	// Compare flags
	const canonicalFlags = new Set(canonicalUsage.flags.map((f) => f.name));
	const errorFlags = new Set(errorParsed.flags.map((f) => f.name));

	// Check for missing flags in error message
	for (const flag of canonicalFlags) {
		if (!errorFlags.has(flag)) {
			const flagDef = canonicalUsage.flags.find((f) => f.name === flag);
			issues.push({
				severity: "critical",
				command: commandPath,
				issue: `Error message missing ${flagDef?.required ? "required" : "optional"} flag '${flag}' from usage specification`,
				recommendation: `Update error message to: "Usage: ${commandPath} ${usageField}"`,
			});
		}
	}

	// Check for extra flags in error message
	for (const flag of errorFlags) {
		if (!canonicalFlags.has(flag)) {
			issues.push({
				severity: "warning",
				command: commandPath,
				issue: `Error message includes flag '${flag}' not in usage specification`,
				recommendation: `Add '${flag}' to usage field or remove from error message`,
			});
		}
	}
}

/**
 * Analyze a command for consistency issues
 */
async function analyzeCommand(
	metadata: CommandMetadata,
	session: REPLSession,
): Promise<ConsistencyIssue[]> {
	const issues: ConsistencyIssue[] = [];

	// Check if usage specification exists
	if (!metadata.command.usage || metadata.command.usage.trim() === "") {
		issues.push({
			severity: "warning",
			command: metadata.path,
			issue: "No usage specification defined",
			recommendation: "Add usage pattern to command definition",
		});
		return issues;
	}

	// Check if completion handler exists
	if (!metadata.hasCompletion) {
		// Some commands may not need completion (like help, exit)
		// But commands with arguments should have completion
		if (
			metadata.usage.positional.length > 0 ||
			metadata.usage.flags.length > 0
		) {
			issues.push({
				severity: "warning",
				command: metadata.path,
				issue: "No completion handler defined for command with arguments",
				recommendation: "Add completion handler to assist with argument input",
			});
		}
		return issues;
	}

	// If we have both usage and completion, verify consistency
	try {
		// Call completion handler with empty args to get base suggestions
		const completionSuggestions = await metadata.command.completion!(
			"",
			[],
			session,
		);

		// Validate completion against usage
		const validation = validateCompletionMatchesUsage(
			metadata.usage,
			completionSuggestions,
		);

		// Add critical issues
		for (const issue of validation.issues) {
			issues.push({
				severity: "critical",
				command: metadata.path,
				issue,
				recommendation:
					"Update completion handler to suggest all required flags",
			});
		}

		// Add warnings
		for (const warning of validation.warnings) {
			issues.push({
				severity: "warning",
				command: metadata.path,
				issue: warning,
				recommendation: "Update usage specification or completion handler",
			});
		}

		// Check positional arguments handling
		if (metadata.usage.positional.length > 0) {
			// Completion should acknowledge positional args exist
			// Either by suggesting values OR by using context-aware logic
			const hasRequiredPositional = metadata.usage.positional.some(
				(p) => p.required,
			);

			if (hasRequiredPositional && completionSuggestions.length > 0) {
				// If completion returns flags immediately without considering positional args
				const onlyFlags = completionSuggestions.every((s) =>
					s.startsWith("--"),
				);
				if (onlyFlags) {
					issues.push({
						severity: "warning",
						command: metadata.path,
						issue: `Completion suggests flags immediately but usage requires positional argument '<${metadata.usage.positional[0]?.name}>' first`,
						recommendation:
							"Update completion handler to be positional-argument aware",
					});
				}
			}
		}
	} catch (error) {
		issues.push({
			severity: "warning",
			command: metadata.path,
			issue: `Completion handler threw error: ${error instanceof Error ? error.message : String(error)}`,
			recommendation: "Fix completion handler error",
		});
	}

	// NEW: Validate error messages match usage field
	const sourceFile = getCommandSourcePath(metadata.domain, metadata.path);
	if (sourceFile && metadata.command.usage) {
		const usageSourceIssues = validateAllUsageSources(
			metadata.path,
			metadata.command.usage,
			sourceFile,
		);
		issues.push(...usageSourceIssues);
	}

	return issues;
}

/**
 * Generate comprehensive analysis report
 */
async function generateReport(): Promise<AnalysisReport> {
	console.log("🔍 Discovering commands...");
	const allCommands = discoverAllCommands();
	console.log(`   Found ${allCommands.length} commands\n`);

	console.log("🔬 Analyzing consistency...");

	// Create mock session for completion handler testing
	const session = new REPLSession();

	const critical: ConsistencyIssue[] = [];
	const warnings: ConsistencyIssue[] = [];
	const clean: CommandMetadata[] = [];
	const missingCompletion: CommandMetadata[] = [];
	const missingUsage: CommandMetadata[] = [];

	for (const cmd of allCommands) {
		const issues = await analyzeCommand(cmd, session);

		if (issues.length === 0) {
			clean.push(cmd);
		} else {
			for (const issue of issues) {
				if (issue.severity === "critical") {
					critical.push(issue);
				} else {
					warnings.push(issue);
				}
			}
		}

		// Track missing components
		if (!cmd.hasCompletion) {
			missingCompletion.push(cmd);
		}
		if (!cmd.command.usage || cmd.command.usage.trim() === "") {
			missingUsage.push(cmd);
		}
	}

	console.log(`   Analysis complete\n`);

	return {
		totalCommands: allCommands.length,
		clean,
		critical,
		warnings,
		missingCompletion,
		missingUsage,
	};
}

/**
 * Format and display the analysis report
 */
function displayReport(report: AnalysisReport): void {
	console.log("═══════════════════════════════════════════════════════════");
	console.log("  COMMAND CONSISTENCY ANALYSIS REPORT");
	console.log("═══════════════════════════════════════════════════════════\n");

	// Summary
	console.log("📊 SUMMARY");
	console.log("─────────────────────────────────────────────────────────\n");
	console.log(`  Total Commands:        ${report.totalCommands}`);
	console.log(`  ✅ Clean:              ${report.clean.length}`);
	console.log(`  🚨 Critical Issues:    ${report.critical.length}`);
	console.log(`  ⚠️  Warnings:           ${report.warnings.length}`);
	console.log(`  📝 Missing Completion: ${report.missingCompletion.length}`);
	console.log(`  📋 Missing Usage:      ${report.missingUsage.length}\n`);

	// Critical Issues
	if (report.critical.length > 0) {
		console.log("🚨 CRITICAL ISSUES");
		console.log("─────────────────────────────────────────────────────────\n");
		for (const issue of report.critical) {
			console.log(`  Command: ${issue.command}`);
			console.log(`  Issue:   ${issue.issue}`);
			if (issue.recommendation) {
				console.log(`  Fix:     ${issue.recommendation}`);
			}
			console.log();
		}
	}

	// Warnings
	if (report.warnings.length > 0) {
		console.log("⚠️  WARNINGS");
		console.log("─────────────────────────────────────────────────────────\n");

		// Group warnings by command for readability
		const warningsByCommand = new Map<string, ConsistencyIssue[]>();
		for (const warning of report.warnings) {
			const existing = warningsByCommand.get(warning.command) || [];
			existing.push(warning);
			warningsByCommand.set(warning.command, existing);
		}

		for (const [command, warnings] of warningsByCommand) {
			console.log(`  Command: ${command}`);
			for (const warning of warnings) {
				console.log(`  • ${warning.issue}`);
				if (warning.recommendation) {
					console.log(`    → ${warning.recommendation}`);
				}
			}
			console.log();
		}
	}

	// Clean Commands (sample)
	if (report.clean.length > 0) {
		console.log("✅ CONSISTENT COMMANDS (sample)");
		console.log("─────────────────────────────────────────────────────────\n");
		const sampleSize = Math.min(5, report.clean.length);
		for (let i = 0; i < sampleSize; i++) {
			const cmd = report.clean[i];
			console.log(`  • ${cmd?.path}`);
		}
		if (report.clean.length > sampleSize) {
			console.log(`  ... and ${report.clean.length - sampleSize} more\n`);
		} else {
			console.log();
		}
	}

	// Missing Components Detail
	if (report.missingCompletion.length > 0) {
		console.log("📝 COMMANDS WITHOUT COMPLETION HANDLERS");
		console.log("─────────────────────────────────────────────────────────\n");
		for (const cmd of report.missingCompletion) {
			const argCount =
				cmd.usage.positional.length + cmd.usage.flags.length;
			if (argCount > 0) {
				console.log(`  • ${cmd.path} (${argCount} args)`);
			}
		}
		console.log();
	}

	// Bottom Line
	console.log("═══════════════════════════════════════════════════════════");
	if (report.critical.length === 0 && report.warnings.length === 0) {
		console.log("  ✅ ALL COMMANDS CONSISTENT - NO ISSUES FOUND");
	} else if (report.critical.length === 0) {
		console.log("  ⚠️  WARNINGS FOUND - REVIEW RECOMMENDED");
	} else {
		console.log("  🚨 CRITICAL ISSUES FOUND - ACTION REQUIRED");
	}
	console.log("═══════════════════════════════════════════════════════════\n");
}

/**
 * Main execution
 */
async function main() {
	try {
		const report = await generateReport();
		displayReport(report);

		// Exit with appropriate code
		if (report.critical.length > 0) {
			process.exit(1); // Critical issues = failure
		} else if (report.warnings.length > 0) {
			process.exit(0); // Warnings = success but with notes
		} else {
			process.exit(0); // All clean = success
		}
	} catch (error) {
		console.error("❌ Analysis failed:");
		console.error(error);
		process.exit(2);
	}
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

export { generateReport, displayReport };
