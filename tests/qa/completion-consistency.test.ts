/**
 * QA Test Suite: Completion Consistency
 *
 * Automated verification that completion handlers match usage specifications.
 * These tests fail when drift is detected, preventing inconsistencies from
 * reaching production.
 *
 * This suite complements the analyze-command-consistency.ts script by:
 * - Running in CI/CD pipeline automatically
 * - Failing the build when critical inconsistencies are found
 * - Providing detailed test output for debugging
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { customDomains } from "../../src/domains/index.js";
import type { CommandDefinition } from "../../src/domains/registry.js";
import {
	parseUsage,
	validateCompletionMatchesUsage,
} from "../utils/usage-parser.js";
import type { UsageRequirements } from "../utils/usage-parser.js";
import { REPLSession } from "../../src/repl/session.js";

/**
 * Command metadata for testing
 */
interface CommandMetadata {
	path: string;
	domain: string;
	command: CommandDefinition;
	usage: UsageRequirements;
	hasCompletion: boolean;
}

/**
 * Discover all commands that need consistency testing
 */
function discoverTestableCommands(): CommandMetadata[] {
	const commands: CommandMetadata[] = [];
	const domains = customDomains.all();

	for (const domain of domains) {
		// Process action groups (verb-first routing)
		if (domain.actions) {
			for (const [actionName, actionGroup] of domain.actions) {
				for (const [resourceName, cmd] of actionGroup.resources) {
					const path = `${domain.name} ${actionName} ${resourceName}`;
					const usage = parseUsage(cmd.usage);

					// Only test commands that have both usage and completion
					if (cmd.usage && cmd.completion) {
						commands.push({
							path,
							domain: domain.name,
							command: cmd,
							usage,
							hasCompletion: true,
						});
					}
				}
			}
		}

		// Process direct commands at domain level
		for (const [commandName, cmd] of domain.commands) {
			const path = `${domain.name} ${commandName}`;
			const usage = parseUsage(cmd.usage);

			if (cmd.usage && cmd.completion) {
				commands.push({
					path,
					domain: domain.name,
					command: cmd,
					usage,
					hasCompletion: true,
				});
			}
		}

		// Process subcommand groups (legacy)
		for (const [subgroupName, subgroup] of domain.subcommands) {
			for (const [commandName, cmd] of subgroup.commands) {
				const path = `${domain.name} ${subgroupName} ${commandName}`;
				const usage = parseUsage(cmd.usage);

				if (cmd.usage && cmd.completion) {
					commands.push({
						path,
						domain: domain.name,
						command: cmd,
						usage,
						hasCompletion: true,
					});
				}
			}
		}
	}

	return commands;
}

/**
 * Get source file path for a command
 */
function getCommandSourcePath(domain: string, commandPath: string): string | null {
	const parts = commandPath.split(" ");

	// Remove domain from start if present
	if (parts[0] === domain) {
		parts.shift();
	}

	if (parts.length === 2) {
		// Action group: domain action resource → src/domains/domain/resource/action.ts
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
		// Direct command: domain command → src/domains/domain/command.ts
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
 * Extract "Usage: ..." strings from source file
 */
function extractUsageStringsFromFile(filePath: string): string[] {
	if (!filePath || !fs.existsSync(filePath)) {
		return [];
	}

	try {
		const content = fs.readFileSync(filePath, "utf-8");
		const patterns = [
			/"Usage:\s*([^"]+)"/g,
			/'Usage:\s*([^']+)'/g,
			/`Usage:\s*([^`]+)`/g,
		];

		const foundStrings: string[] = [];
		for (const pattern of patterns) {
			let match;
			pattern.lastIndex = 0;
			while ((match = pattern.exec(content)) !== null) {
				const usageString = match[1]?.trim();
				if (usageString) {
					foundStrings.push(usageString);
				}
			}
		}

		return foundStrings;
	} catch (error) {
		return [];
	}
}

describe("QA: Completion Consistency", () => {
	let session: REPLSession;

	// Discover commands at module level so they're available for test generation
	const testableCommands = discoverTestableCommands();

	beforeAll(() => {
		// Create mock session for completion testing
		session = new REPLSession();
	});

	describe("All Commands With Usage and Completion", () => {
		it("should have discovered commands to test", () => {
			expect(testableCommands.length).toBeGreaterThan(0);
		});

		// Generate a test for each command
		testableCommands.forEach((cmd) => {
			describe(cmd.path, () => {
				it("completion handler should match usage specification", async () => {
					// Call completion handler with empty args to get base suggestions
					const completionSuggestions = await cmd.command.completion!(
						"",
						[],
						session,
					);

					// Validate completion against usage
					const validation = validateCompletionMatchesUsage(
						cmd.usage,
						completionSuggestions,
					);

					// Fail test if critical issues found
					if (!validation.consistent) {
						const errorMessage = [
							`Completion handler does not match usage specification:`,
							``,
							`Usage: ${cmd.usage.raw}`,
							``,
							`Issues:`,
							...validation.issues.map((issue) => `  - ${issue}`),
							``,
							`Warnings:`,
							...validation.warnings.map((warning) => `  - ${warning}`),
							``,
							`Completion suggestions: ${JSON.stringify(completionSuggestions)}`,
						].join("\n");

						// Use expect to fail with detailed message
						expect(validation.consistent, errorMessage).toBe(true);
					}
				});

				it("should acknowledge required positional arguments", async () => {
					// Skip if no required positional arguments
					const requiredPositional = cmd.usage.positional.filter(
						(p) => p.required,
					);
					if (requiredPositional.length === 0) {
						return; // No positional args to check
					}

					// Call completion handler with empty args
					const completionSuggestions = await cmd.command.completion!(
						"",
						[],
						session,
					);

					// If completion immediately suggests only flags, it's ignoring positional args
					const onlyFlags = completionSuggestions.every((s) =>
						s.startsWith("--"),
					);

					if (onlyFlags && completionSuggestions.length > 0) {
						const errorMessage = [
							`Completion handler suggests flags without acknowledging required positional argument`,
							``,
							`Usage: ${cmd.usage.raw}`,
							`Required positional: <${requiredPositional[0]?.name}>`,
							``,
							`Completion suggestions: ${JSON.stringify(completionSuggestions)}`,
							``,
							`Expected behavior:`,
							`  - Return empty array to let user type positional arg`,
							`  - OR check args.length to determine if positional arg is provided`,
							`  - OR return context-aware suggestions for positional arg`,
						].join("\n");

						// This is a warning, not a critical error
						// But we should track it
						expect(
							onlyFlags,
							`Warning: ${errorMessage}`,
						).toBe(false);
					}
				});

				it("should not throw errors during completion", async () => {
					// Ensure completion handler doesn't crash
					await expect(
						cmd.command.completion!("", [], session),
					).resolves.not.toThrow();
				});

				it("should return an array of strings", async () => {
					const result = await cmd.command.completion!("", [], session);

					expect(Array.isArray(result)).toBe(true);
					result.forEach((item) => {
						expect(typeof item).toBe("string");
					});
				});
			});
		});
	});

	describe("Usage Specification Quality", () => {
		it("all commands should have usage specifications", () => {
			const allCommands: Array<{ path: string; hasUsage: boolean }> = [];
			const domains = customDomains.all();

			for (const domain of domains) {
				// Check action groups
				if (domain.actions) {
					for (const [actionName, actionGroup] of domain.actions) {
						for (const [resourceName, cmd] of actionGroup.resources) {
							const path = `${domain.name} ${actionName} ${resourceName}`;
							allCommands.push({
								path,
								hasUsage: !!(cmd.usage && cmd.usage.trim()),
							});
						}
					}
				}

				// Check direct commands
				for (const [commandName, cmd] of domain.commands) {
					const path = `${domain.name} ${commandName}`;
					allCommands.push({
						path,
						hasUsage: !!(cmd.usage && cmd.usage.trim()),
					});
				}

				// Check subcommands
				for (const [subgroupName, subgroup] of domain.subcommands) {
					for (const [commandName, cmd] of subgroup.commands) {
						const path = `${domain.name} ${subgroupName} ${commandName}`;
						allCommands.push({
							path,
							hasUsage: !!(cmd.usage && cmd.usage.trim()),
						});
					}
				}
			}

			const missingUsage = allCommands.filter((cmd) => !cmd.hasUsage);

			if (missingUsage.length > 0) {
				const message = [
					`${missingUsage.length} commands are missing usage specifications:`,
					"",
					...missingUsage.map((cmd) => `  - ${cmd.path}`),
					"",
					"All commands should have usage specifications for consistency.",
				].join("\n");

				// Log warning but don't fail the test (this is informational)
				console.warn(message);
			}

			// Assert that we checked something
			expect(allCommands.length).toBeGreaterThan(0);
		});
	});

	describe("Completion Handler Quality", () => {
		it("commands with arguments should have completion handlers", () => {
			const commandsNeedingCompletion: Array<{
				path: string;
				hasCompletion: boolean;
				argCount: number;
			}> = [];
			const domains = customDomains.all();

			for (const domain of domains) {
				// Check action groups
				if (domain.actions) {
					for (const [actionName, actionGroup] of domain.actions) {
						for (const [resourceName, cmd] of actionGroup.resources) {
							const path = `${domain.name} ${actionName} ${resourceName}`;
							const usage = parseUsage(cmd.usage);
							const argCount = usage.positional.length + usage.flags.length;

							if (argCount > 0) {
								commandsNeedingCompletion.push({
									path,
									hasCompletion: !!cmd.completion,
									argCount,
								});
							}
						}
					}
				}

				// Check direct commands
				for (const [commandName, cmd] of domain.commands) {
					const path = `${domain.name} ${commandName}`;
					const usage = parseUsage(cmd.usage);
					const argCount = usage.positional.length + usage.flags.length;

					if (argCount > 0) {
						commandsNeedingCompletion.push({
							path,
							hasCompletion: !!cmd.completion,
							argCount,
						});
					}
				}

				// Check subcommands
				for (const [subgroupName, subgroup] of domain.subcommands) {
					for (const [commandName, cmd] of subgroup.commands) {
						const path = `${domain.name} ${subgroupName} ${commandName}`;
						const usage = parseUsage(cmd.usage);
						const argCount = usage.positional.length + usage.flags.length;

						if (argCount > 0) {
							commandsNeedingCompletion.push({
								path,
								hasCompletion: !!cmd.completion,
								argCount,
							});
						}
					}
				}
			}

			const missingCompletion = commandsNeedingCompletion.filter(
				(cmd) => !cmd.hasCompletion,
			);

			if (missingCompletion.length > 0) {
				const message = [
					`${missingCompletion.length} commands with arguments are missing completion handlers:`,
					"",
					...missingCompletion.map(
						(cmd) => `  - ${cmd.path} (${cmd.argCount} args)`,
					),
					"",
					"Commands with arguments should provide completion handlers for better UX.",
				].join("\n");

				// Log warning but don't fail the test (this is informational)
				console.warn(message);
			}

			// Assert that we checked something
			expect(commandsNeedingCompletion.length).toBeGreaterThan(0);
		});
	});

	describe("Command Path Order Consistency", () => {
		it("all commands should have consistent path order between registry and error messages", () => {
			const pathOrderIssues: Array<{
				command: string;
				registryPath: string;
				errorPath: string;
				issue: string;
			}> = [];

			// Test each command with usage specification
			testableCommands.forEach((cmd) => {
				// Get source file
				const sourceFile = getCommandSourcePath(cmd.domain, cmd.path);
				if (!sourceFile) return;

				// Extract error messages
				const errorUsageStrings = extractUsageStringsFromFile(sourceFile);
				if (errorUsageStrings.length === 0) return;

				// Check each error message for path order
				for (const errorUsage of errorUsageStrings) {
					// Validate path order
					const commandPathRegex = new RegExp(`^${cmd.path.replace(/\s+/g, "\\s+")}\\s+`);
					const hasCorrectPath = commandPathRegex.test(errorUsage);

					// Check for alternate (incorrect) order
					const parts = cmd.path.split(" ");
					if (parts.length === 3) {
						// Action group: domain verb noun
						const alternatePath = `${parts[0]} ${parts[2]} ${parts[1]}`; // domain noun verb
						const alternateRegex = new RegExp(`^${alternatePath.replace(/\s+/g, "\\s+")}\\s+`);
						const hasAlternatePath = alternateRegex.test(errorUsage);

						if (hasAlternatePath && !hasCorrectPath) {
							pathOrderIssues.push({
								command: cmd.path,
								registryPath: cmd.path,
								errorPath: alternatePath,
								issue: `Error message uses "${alternatePath}" but registry path is "${cmd.path}"`,
							});
						}
					}

					// Also validate that path is present at all
					const usageMatch = errorUsage.match(/^Usage:\s+(.+?)(?:\s+<|\s+\[|\s*$)/);
					if (usageMatch) {
						const extractedPath = usageMatch[1].trim();
						// Check if extracted path matches registry path
						if (extractedPath !== cmd.path && !extractedPath.startsWith(cmd.path)) {
							pathOrderIssues.push({
								command: cmd.path,
								registryPath: cmd.path,
								errorPath: extractedPath,
								issue: `Error message path "${extractedPath}" doesn't match registry "${cmd.path}"`,
							});
						}
					}
				}
			});

			// Report issues
			if (pathOrderIssues.length > 0) {
				const message = [
					`${pathOrderIssues.length} command path order inconsistencies found:`,
					"",
					...pathOrderIssues.map(
						(issue) =>
							`  ${issue.command}:\n    Registry: ${issue.registryPath}\n    Error msg: ${issue.errorPath}\n    Issue: ${issue.issue}`,
					),
					"",
					"ALL command paths must match registry order. See claudedocs/COMMAND_PATH_CONSISTENCY.md",
				].join("\n");

				expect(pathOrderIssues.length, message).toBe(0);
			}
		});

		it("generateUsageError calls should use correct registry paths", () => {
			const generateUsageErrorIssues: Array<{
				file: string;
				issue: string;
			}> = [];

			// Check all commands using generateUsageError
			testableCommands.forEach((cmd) => {
				const sourceFile = getCommandSourcePath(cmd.domain, cmd.path);
				if (!sourceFile || !fs.existsSync(sourceFile)) return;

				try {
					const content = fs.readFileSync(sourceFile, "utf-8");

					// Find generateUsageError calls
					const generateUsageErrorPattern = /generateUsageError\s*\(\s*["']([^"']+)["']/g;
					let match;
					while ((match = generateUsageErrorPattern.exec(content)) !== null) {
						const usedPath = match[1];

						// Validate that used path matches registry path
						if (usedPath !== cmd.path) {
							// Check if it's alternate order
							const parts = cmd.path.split(" ");
							if (parts.length === 3) {
								const alternatePath = `${parts[0]} ${parts[2]} ${parts[1]}`;
								if (usedPath === alternatePath) {
									generateUsageErrorIssues.push({
										file: sourceFile,
										issue: `generateUsageError uses "${usedPath}" but registry path is "${cmd.path}" (wrong order)`,
									});
								}
							} else if (usedPath !== cmd.path) {
								generateUsageErrorIssues.push({
									file: sourceFile,
									issue: `generateUsageError uses "${usedPath}" but registry path is "${cmd.path}"`,
								});
							}
						}
					}
				} catch (error) {
					// Skip files that can't be read
				}
			});

			// Report issues
			if (generateUsageErrorIssues.length > 0) {
				const message = [
					`${generateUsageErrorIssues.length} generateUsageError() calls use wrong command paths:`,
					"",
					...generateUsageErrorIssues.map((issue) => `  ${issue.file}:\n    ${issue.issue}`),
					"",
					"generateUsageError() first parameter MUST match registry path exactly.",
				].join("\n");

				expect(generateUsageErrorIssues.length, message).toBe(0);
			}
		});
	});

	describe("Error Message Consistency", () => {
		it("error messages should match usage specifications", () => {
			const inconsistencies: Array<{
				path: string;
				issue: string;
			}> = [];

			// Test each command that has a usage specification
			testableCommands.forEach((cmd) => {
				// Get source file path
				const sourceFile = getCommandSourcePath(cmd.domain, cmd.path);
				if (!sourceFile) {
					return; // Skip if source file not found
				}

				// Extract error message usage strings
				const errorUsageStrings = extractUsageStringsFromFile(sourceFile);
				if (errorUsageStrings.length === 0) {
					return; // No error messages to check
				}

				// Parse canonical usage
				const canonicalUsage = cmd.usage;

				// Check each error message
				for (const errorUsage of errorUsageStrings) {
					// Strip command path prefix (handle different orderings)
					const cleanedError = errorUsage
						.replace(
							new RegExp(`^${cmd.path.replace(/\s+/g, "\\s+")}\\s*`),
							"",
						)
						.trim();

					// Also try alternate ordering for action groups
					const parts = cmd.path.split(" ");
					if (parts.length === 3) {
						const alternatePath = `${parts[0]} ${parts[2]} ${parts[1]}`;
						const alternateClean = errorUsage
							.replace(
								new RegExp(`^${alternatePath.replace(/\s+/g, "\\s+")}\\s*`),
								"",
							)
							.trim();
						if (alternateClean.length < cleanedError.length) {
							// Use cleaner result
							const errorParsed = parseUsage(alternateClean);
							checkErrorMessageConsistency(
								cmd,
								errorParsed,
								inconsistencies,
							);
							continue;
						}
					}

					const errorParsed = parseUsage(cleanedError);
					checkErrorMessageConsistency(cmd, errorParsed, inconsistencies);
				}
			});

			// Report any inconsistencies found
			if (inconsistencies.length > 0) {
				const message = [
					`${inconsistencies.length} error message inconsistencies found:`,
					"",
					...inconsistencies.map((inc) => `  ${inc.path}:`),
					...inconsistencies.map((inc) => `    ${inc.issue}`),
					"",
					"Error messages should be generated from usage field using generateUsageError().",
				].join("\n");

				// Fail the test with detailed information
				expect(inconsistencies.length, message).toBe(0);
			}

			// If we didn't test any commands, fail
			expect(testableCommands.length).toBeGreaterThan(0);
		});
	});
});

/**
 * Helper to check error message consistency
 */
function checkErrorMessageConsistency(
	cmd: CommandMetadata,
	errorParsed: UsageRequirements,
	inconsistencies: Array<{ path: string; issue: string }>,
): void {
	const canonicalUsage = cmd.usage;

	// Compare positional arguments
	if (canonicalUsage.positional.length !== errorParsed.positional.length) {
		inconsistencies.push({
			path: cmd.path,
			issue: `Error message has ${errorParsed.positional.length} positional args, usage has ${canonicalUsage.positional.length}`,
		});
	}

	// Compare flags
	const canonicalFlags = new Set(canonicalUsage.flags.map((f) => f.name));
	const errorFlags = new Set(errorParsed.flags.map((f) => f.name));

	for (const flag of canonicalFlags) {
		if (!errorFlags.has(flag)) {
			const flagDef = canonicalUsage.flags.find((f) => f.name === flag);
			inconsistencies.push({
				path: cmd.path,
				issue: `Error message missing ${flagDef?.required ? "required" : "optional"} flag '${flag}'`,
			});
		}
	}

	for (const flag of errorFlags) {
		if (!canonicalFlags.has(flag)) {
			inconsistencies.push({
				path: cmd.path,
				issue: `Error message has extra flag '${flag}' not in usage`,
			});
		}
	}
}
