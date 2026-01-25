/**
 * Executor - Command execution engine for the REPL
 * Handles built-in commands, domain navigation, and command routing
 */

import type { REPLSession } from "./session.js";
import type { ContextPath } from "./context.js";
import { allDomains, isValidDomain, validActions } from "../types/domains.js";
import {
	customDomains,
	isCustomDomain,
	resolveDomainAlias,
	getDomainAliases,
} from "../domains/index.js";
import { extensionRegistry } from "../extensions/index.js";
import {
	buildConnectionInfo,
	formatConnectionTable,
} from "../domains/login/profile/connection-table.js";
import { APIError } from "../api/index.js";
import {
	formatDomainOutput,
	formatAPIError,
	parseOutputFormat,
	getCommandSpec,
	formatSpec,
	ALL_OUTPUT_FORMATS,
	OUTPUT_FORMAT_HELP,
	type OutputFormat,
} from "../output/index.js";
import {
	detectDependencies,
	formatDependencyError,
} from "../dependencies/index.js";
import {
	performPreDeleteCheck,
	formatPreDeleteResult,
	type DeleteFlags,
} from "../preflight/index.js";
import { ExitCode } from "../errors/codes.js";
import { CLI_NAME, CLI_VERSION } from "../branding/index.js";
import {
	formatRootHelp,
	formatDomainHelp,
	formatActionHelp,
	formatTopicHelp,
} from "./help.js";
import { parseInputArgs } from "./completion/completer.js";
import { getDomainInfo } from "../types/domains.js";
import {
	validateNamespaceScope,
	checkOperationSafety,
	validateResourceName,
} from "../validation/index.js";
import { loadSettingsSync } from "../config/settings.js";
import {
	getOperationDefinition,
	substitutePathParams,
	hasUnsubstitutedParams,
} from "../operations/index.js";
import {
	parseCreationFlags,
	hasCreationFlagsInArgs,
	hasResourceBuilder,
	buildResource,
	validateResourceFlags,
} from "./creation/index.js";

/**
 * Write operations that require resource name validation.
 * Read operations (list, get, delete) skip validation to support legacy resources.
 */
const WRITE_OPERATIONS = new Set([
	"create",
	"replace",
	"apply",
	"patch",
	"add-labels",
	"remove-labels",
]);

/**
 * Configuration for entering chat mode
 */
export interface ChatModeConfig {
	/** Namespace for AI queries */
	namespace: string;
}

/**
 * Command execution result
 */
export interface ExecutionResult {
	/** Output lines to display */
	output: string[];
	/** Whether to exit the REPL */
	shouldExit: boolean;
	/** Whether to clear the screen */
	shouldClear: boolean;
	/** Whether the command modified context */
	contextChanged: boolean;
	/** Error message if command failed */
	error?: string;
	/** Exit code for headless/one-shot mode (defaults to 1 if error is set, 0 otherwise) */
	exitCode?: number;
	/**
	 * Raw stdout content to write directly (bypassing Ink).
	 * When set, App.tsx will hide status bar first, write this content,
	 * then restore status bar. Used for commands that need cursor positioning
	 * like the image banner.
	 */
	rawStdout?: string;
	/** Whether to trigger git status refresh */
	refreshGit?: boolean;
	/** Whether to trigger health check refresh (e.g., after login) */
	refreshHealth?: boolean;
	/**
	 * Signal to enter interactive chat mode.
	 * When set, App.tsx will switch to ChatMode component.
	 */
	enterChatMode?: boolean;
	/**
	 * Configuration for chat mode (required when enterChatMode is true)
	 */
	chatConfig?: ChatModeConfig;
	/**
	 * Signal to enter profile deletion wizard mode.
	 * When set, App.tsx will switch to ProfileDeleteWizard component.
	 */
	enterProfileDeleteMode?: boolean;
	/**
	 * Configuration for profile deletion wizard (required when enterProfileDeleteMode is true)
	 */
	profileDeleteConfig?: {
		profileName: string;
		isActive: boolean;
	};
	/**
	 * Signal to enter resource create confirmation mode.
	 * When set, App.tsx will switch to ResourceCreateConfirmation component.
	 */
	enterCreateConfirmMode?: boolean;
	/**
	 * Configuration for resource create confirmation (required when enterCreateConfirmMode is true)
	 */
	createConfirmConfig?: {
		resourceType: string;
		resourceName: string;
		namespace: string;
		domain: string;
		requestBody: Record<string, unknown>;
		onConfirm: () => Promise<ExecutionResult>;
		onCancel: () => ExecutionResult;
	};
}

/**
 * Built-in command names
 */
const BUILTIN_COMMANDS = new Set([
	"help",
	"--help",
	"-h",
	"clear",
	"quit",
	"exit",
	"back",
	"..",
	"root",
	"/",
	"context",
	"ctx",
	"history",
	"version",
	"--version",
	"-v",
	"domains",
	"whoami",
	"refresh",
	"debug-completion",
]);

/**
 * Parse command input into components
 */
interface ParsedCommand {
	/** Original raw input */
	raw: string;
	/** Is this a "/" prefixed domain navigation? */
	isDirectNavigation: boolean;
	/** Target domain (if navigation) */
	targetDomain?: string | undefined;
	/** Target action (if specified) */
	targetAction?: string | undefined;
	/** Command arguments */
	args: string[];
	/** Is this a built-in command? */
	isBuiltin: boolean;
}

/**
 * Parse user input into structured command
 */
export function parseCommand(input: string): ParsedCommand {
	const trimmed = input.trim();

	// Handle empty input
	if (!trimmed) {
		return {
			raw: trimmed,
			isDirectNavigation: false,
			args: [],
			isBuiltin: false,
		};
	}

	// Handle "/" prefix for direct domain navigation
	if (trimmed.startsWith("/") && trimmed.length > 1) {
		const parts = parseInputArgs(trimmed.slice(1));
		const domainPart = parts[0] ?? "";

		// Check if it's a valid domain (custom, extension, or API-generated)
		const hasExtension = extensionRegistry.hasExtension(domainPart);
		if (
			isValidDomain(domainPart) ||
			isCustomDomain(domainPart) ||
			hasExtension
		) {
			return {
				raw: trimmed,
				isDirectNavigation: true,
				targetDomain: domainPart,
				targetAction: parts[1],
				args: parts.slice(2),
				isBuiltin: false,
			};
		}
	}

	// Handle just "/" for root navigation
	if (trimmed === "/") {
		return {
			raw: trimmed,
			isDirectNavigation: false,
			isBuiltin: true,
			args: [],
		};
	}

	// Check for built-in commands
	const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase() ?? "";
	// Normalize: strip leading "/" for builtin check (e.g., "/help" → "help")
	const normalizedFirst = firstWord.startsWith("/")
		? firstWord.slice(1)
		: firstWord;
	if (
		BUILTIN_COMMANDS.has(firstWord) ||
		BUILTIN_COMMANDS.has(normalizedFirst)
	) {
		// Map --help/-h to help and --version/-v to version for execution
		let effectiveCommand = normalizedFirst;
		if (normalizedFirst === "--help" || normalizedFirst === "-h") {
			effectiveCommand = "help";
		} else if (
			normalizedFirst === "--version" ||
			normalizedFirst === "-v"
		) {
			effectiveCommand = "version";
		}
		return {
			raw: effectiveCommand,
			isDirectNavigation: false,
			isBuiltin: true,
			args: parseInputArgs(trimmed).slice(1),
		};
	}

	// Regular command - parse with quote handling
	const parts = parseInputArgs(trimmed);
	return {
		raw: trimmed,
		isDirectNavigation: false,
		isBuiltin: false,
		args: parts,
	};
}

/**
 * Execute a built-in command
 * Returns ExecutionResult or Promise<ExecutionResult> for async commands like whoami
 */
function executeBuiltin(
	cmd: ParsedCommand,
	session: REPLSession,
	ctx: ContextPath,
): ExecutionResult | Promise<ExecutionResult> {
	const command = cmd.raw.toLowerCase();

	// Clear screen
	if (command === "clear") {
		return {
			output: [],
			shouldExit: false,
			shouldClear: true,
			contextChanged: false,
		};
	}

	// Exit/quit
	if (command === "quit") {
		return {
			output: ["Goodbye!"],
			shouldExit: true,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Navigate up (exit/back/..)
	if (command === "exit" || command === "back" || command === "..") {
		if (ctx.isRoot()) {
			return {
				output: ["Goodbye!"],
				shouldExit: true,
				shouldClear: false,
				contextChanged: false,
			};
		}
		ctx.navigateUp();
		const location = ctx.isRoot() ? "root" : ctx.domain;
		return {
			output: [`Navigated to ${location} context`],
			shouldExit: false,
			shouldClear: false,
			contextChanged: true,
		};
	}

	// Navigate to root
	if (command === "/" || command === "root") {
		if (!ctx.isRoot()) {
			ctx.reset();
			return {
				output: ["Navigated to root context"],
				shouldExit: false,
				shouldClear: false,
				contextChanged: true,
			};
		}
		return {
			output: ["Already at root context"],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Show current context
	if (command === "context" || command === "ctx") {
		let contextStr: string;
		if (ctx.isRoot()) {
			contextStr = "root";
		} else if (ctx.isDomain()) {
			contextStr = ctx.domain;
		} else {
			contextStr = `${ctx.domain} > ${ctx.action}`;
		}
		return {
			output: [`Current context: ${contextStr}`],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Show history
	if (command === "history") {
		const histMgr = session.getHistory();
		const hist = histMgr?.getHistory() ?? [];
		if (hist.length === 0) {
			return {
				output: ["No command history"],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}
		const lines = ["Command history:"];
		hist.slice(-20).forEach((histCmd, i) => {
			lines.push(`  ${i + 1}. ${histCmd}`);
		});
		return {
			output: lines,
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Show version
	if (command === "version") {
		return {
			output: [`${CLI_NAME} version ${CLI_VERSION}`],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// List available domains
	if (command === "domains") {
		const lines = ["Available domains:"];
		allDomains().forEach((domain) => {
			lines.push(`  ${domain}`);
		});
		return {
			output: lines,
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Show current user and connection info
	// Uses unified Connection Summary format for consistency
	if (command === "whoami" || command.startsWith("whoami ")) {
		// Use pre-parsed args from cmd (already parsed by parseCommand)
		const options: {
			includeQuotas?: boolean;
			includeAddons?: boolean;
			verbose?: boolean;
			json?: boolean;
		} = {};

		for (const arg of cmd.args) {
			const lowerArg = arg.toLowerCase();
			switch (lowerArg) {
				case "--quota":
				case "--quotas":
				case "-q":
					options.includeQuotas = true;
					break;
				case "--addons":
				case "--addon":
				case "-a":
					options.includeAddons = true;
					break;
				case "--verbose":
				case "-v":
					options.verbose = true;
					break;
				case "--json":
				case "-j":
					options.json = true;
					break;
			}
		}

		// Build connection info using the unified format
		// All data comes from session, no async API call needed
		const connectionInfo = buildConnectionInfo(
			session.getActiveProfileName() || "(environment)",
			session.getServerUrl(),
			session.isAuthenticated(),
			session.getNamespace(),
			!session.isOfflineMode(),
			session.isTokenValidated(),
			session.getValidationError() || undefined,
			session.getAuthSource() || undefined,
			session.getEnvVarsPresent(),
		);

		// Handle JSON output format
		if (options.json) {
			const jsonOutput = {
				profileName: connectionInfo.profileName,
				tenant: connectionInfo.tenant,
				apiUrl: connectionInfo.apiUrl,
				namespace: connectionInfo.namespace,
				isAuthenticated: connectionInfo.hasToken,
				isConnected: connectionInfo.isConnected,
				isValidated: connectionInfo.isValidated,
				authSource: connectionInfo.authSource,
			};
			return {
				output: [JSON.stringify(jsonOutput, null, 2)],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}

		// Table format (default) - use unified Connection Summary
		return {
			output: formatConnectionTable(connectionInfo),
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Debug completion system
	if (
		command === "debug-completion" ||
		command.startsWith("debug-completion ")
	) {
		const parts = parseInputArgs(command).slice(1); // Skip "debug-completion"
		const options: { verbose?: boolean; json?: boolean } = {};
		let inputArg = "";

		for (const arg of parts) {
			const lowerArg = arg.toLowerCase();
			if (lowerArg === "--verbose" || lowerArg === "-v") {
				options.verbose = true;
			} else if (lowerArg === "--json" || lowerArg === "-j") {
				options.json = true;
			} else if (!inputArg) {
				inputArg = arg;
			}
		}

		// Import diagnostic module and generate report
		return import("./diagnostics/completion-diagnostics.js")
			.then(({ generateDiagnosticReport }) =>
				generateDiagnosticReport(session, inputArg, options),
			)
			.then((output) => ({
				output,
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			}))
			.catch((error: unknown) => ({
				output: [
					`Diagnostic failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
				error: "diagnostic-failed",
			}));
	}

	// Help command - context-aware
	if (command === "help" || command.startsWith("help ")) {
		// Check if a specific topic was requested
		// Topic comes from cmd.args (parsed command arguments)
		const topic = cmd.args[0]?.trim() ?? "";

		if (topic) {
			// Help for a specific topic
			return {
				output: formatTopicHelp(topic),
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}

		// Context-aware help
		if (ctx.isRoot()) {
			// Root context: show comprehensive help
			return {
				output: formatRootHelp(),
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}

		if (ctx.isDomain()) {
			// Domain context: show domain-specific help (no global flags/env vars)
			const domain = ctx.domain ?? "";
			const domainInfo = getDomainInfo(domain);
			if (domainInfo) {
				return {
					output: formatDomainHelp(domainInfo),
					shouldExit: false,
					shouldClear: false,
					contextChanged: false,
				};
			}
			// Fallback for unknown domain
			return {
				output: [
					`Help for domain: ${domain}`,
					"",
					"Use 'help' at root for full help.",
				],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}

		if (ctx.isAction()) {
			// Action context: show action-specific help
			const domain = ctx.domain ?? "";
			const action = ctx.action ?? "";
			return {
				output: formatActionHelp(domain, action),
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}

		// Fallback to root help
		return {
			output: formatRootHelp(),
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Refresh git status
	if (command === "refresh") {
		return {
			output: ["Git status refreshed"],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			refreshGit: true,
		};
	}

	// Unknown built-in
	return {
		output: [`Unknown command: ${cmd.raw}`],
		shouldExit: false,
		shouldClear: false,
		contextChanged: false,
		error: "Unknown command",
	};
}

/**
 * Handle direct domain navigation with "/" prefix
 *
 * Resolution order:
 * 1. Custom domains (login, cloudstatus) - full custom implementation
 * 2. Extension commands - xcsh-specific augmentations
 * 3. API domains - generated from upstream specs
 */
async function handleDirectNavigation(
	cmd: ParsedCommand,
	ctx: ContextPath,
	session: REPLSession,
): Promise<ExecutionResult> {
	if (!cmd.targetDomain) {
		return {
			output: ["Invalid domain"],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: "Invalid domain",
		};
	}

	// Check if it's a custom domain (including aliases) - execute directly with all args
	// Custom domains handle their own --help
	if (isCustomDomain(cmd.targetDomain)) {
		const canonicalDomain = resolveDomainAlias(cmd.targetDomain);
		const allArgs = [cmd.targetAction, ...cmd.args].filter(
			(arg): arg is string => arg !== undefined,
		);
		return customDomains.execute(canonicalDomain, allArgs, session);
	}

	// Check for --help or -h flag on API/extension domains - show domain-specific help
	// Note: "help" without dashes is treated as an action verb, not a flag
	if (cmd.targetAction === "--help" || cmd.targetAction === "-h") {
		const domainInfo = getDomainInfo(cmd.targetDomain);
		if (domainInfo) {
			return {
				output: formatDomainHelp(domainInfo),
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}
		// For domains without domain info, show a basic message
		return {
			output: [
				`${cmd.targetDomain} - Run '${cmd.targetDomain}' for available commands.`,
				"",
				`For global options, run: help`,
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Check for extension commands
	// Extensions augment API domains with xcsh-specific functionality
	const extensionDomain = cmd.targetDomain;
	const merged = extensionRegistry.getMergedDomain(extensionDomain);

	if (merged?.hasExtension && cmd.targetAction) {
		// Check if action is an extension command (not an API action)
		const extCmd = extensionRegistry.getExtensionCommand(
			extensionDomain,
			cmd.targetAction,
		);
		if (extCmd) {
			// Execute extension command
			const result = await extCmd.execute(cmd.args, session);
			const execResult: ExecutionResult = {
				output: result.output,
				shouldExit: result.shouldExit ?? false,
				shouldClear: result.shouldClear ?? false,
				contextChanged: result.contextChanged ?? false,
			};
			if (result.error) {
				execResult.error = result.error;
			}
			return execResult;
		}
	}

	// Handle standalone extensions (extension exists but no API domain yet)
	if (merged?.hasExtension && !merged.hasGeneratedDomain) {
		// Standalone extension - if no action, show available commands
		if (!cmd.targetAction) {
			const lines = [`${merged.displayName} commands:`];
			lines.push("");
			for (const [name, cmdDef] of merged.extensionCommands) {
				const aliases = cmdDef.aliases
					? ` (${cmdDef.aliases.join(", ")})`
					: "";
				lines.push(`  ${name}${aliases} - ${cmdDef.description}`);
			}
			return {
				output: lines,
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}

		// Action specified but not found in extension
		return {
			output: [
				`Unknown command: ${cmd.targetAction}`,
				"",
				`Available ${merged.displayName} commands:`,
				...Array.from(merged.extensionCommands.keys()).map(
					(c) => `  ${c}`,
				),
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: `Unknown command: ${cmd.targetAction}`,
		};
	}

	// Validate API-generated domain
	if (!isValidDomain(cmd.targetDomain) && !merged?.hasExtension) {
		return {
			output: [`Unknown domain: ${cmd.targetDomain}`],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: "Unknown domain",
		};
	}

	// If we have domain + action + args, execute the command directly
	// e.g., /tenant_and_identity list namespace -> execute, don't just navigate
	if (cmd.targetAction && cmd.args.length > 0) {
		// Set context for the execution
		ctx.reset();
		ctx.setDomain(cmd.targetDomain);
		ctx.setAction(cmd.targetAction);

		// Build a ParsedCommand for executeAPICommand
		const apiCmd: ParsedCommand = {
			raw: [cmd.targetDomain, cmd.targetAction, ...cmd.args].join(" "),
			args: cmd.args,
			isBuiltin: false,
			isDirectNavigation: false,
		};
		return await executeAPICommand(session, ctx, apiCmd);
	}

	// Special handling for help action - execute even without args
	// e.g., /virtual help -> show domain help, don't navigate
	if (cmd.targetAction === "help") {
		const domainInfo = getDomainInfo(cmd.targetDomain);
		const domainResourceTypes = new Set(
			domainInfo?.primaryResources?.map((r) => r.name) ?? [],
		);

		// Parse args to extract resourceType (e.g., /virtual help healthcheck)
		const { resourceType } = parseCommandArgs(
			cmd.args,
			domainResourceTypes,
		);

		const { handleHelpVerb } = await import("./help/verb-handler.js");
		return handleHelpVerb({
			session,
			ctx,
			domain: cmd.targetDomain,
			resourceType: resourceType ?? "",
			args: cmd.args,
			domainResourceTypes,
		});
	}

	// Navigate to domain (API domain or merged domain with API support)
	ctx.reset();
	ctx.setDomain(cmd.targetDomain);

	// If action was also specified (but no args), just navigate
	if (cmd.targetAction) {
		ctx.setAction(cmd.targetAction);
		return {
			output: [`Navigated to ${cmd.targetDomain} > ${cmd.targetAction}`],
			shouldExit: false,
			shouldClear: false,
			contextChanged: true,
		};
	}

	return {
		output: [`Navigated to ${cmd.targetDomain} context`],
		shouldExit: false,
		shouldClear: false,
		contextChanged: true,
	};
}

/**
 * Handle domain navigation (entering a domain from root)
 *
 * Resolution order:
 * 1. Custom domains (login, cloudstatus) - full custom implementation
 * 2. Extension domains - check for extension commands
 * 3. API domains - generated from upstream specs
 */
async function handleDomainNavigation(
	domain: string,
	args: string[],
	ctx: ContextPath,
	session: REPLSession,
): Promise<ExecutionResult> {
	// Check if it's a custom domain (including aliases) - execute directly
	// Custom domains handle their own --help
	if (isCustomDomain(domain)) {
		const canonicalDomain = resolveDomainAlias(domain);

		// If the alias is a command name (or command alias) in the canonical domain,
		// prepend it to args. This allows "query 'question'" to work as
		// "ai_services query 'question'" and "ask 'question'" to work similarly.
		let effectiveArgs = args;
		if (domain !== canonicalDomain) {
			const domainDef = customDomains.get(canonicalDomain);
			if (domainDef) {
				// Check if it's a direct command name
				let isCommand = domainDef.commands.has(domain);

				// Also check if it's a command alias
				if (!isCommand) {
					for (const cmd of domainDef.commands.values()) {
						if (cmd.aliases?.includes(domain)) {
							isCommand = true;
							break;
						}
					}
				}

				if (isCommand) {
					effectiveArgs = [domain, ...args];
				}
			}
		}

		return customDomains.execute(canonicalDomain, effectiveArgs, session);
	}

	// Check for --help or -h flag on API/extension domains - show domain-specific help
	// Note: "help" without dashes is treated as an action verb, not a flag
	const firstArg = args[0]?.toLowerCase() ?? "";
	if (firstArg === "--help" || firstArg === "-h") {
		const domainInfo = getDomainInfo(domain);
		if (domainInfo) {
			return {
				output: formatDomainHelp(domainInfo),
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}
		// For domains without domain info, show a basic message
		return {
			output: [
				`${domain} - Run '${domain}' for available commands.`,
				"",
				`For global options, run: help`,
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Check for extension domain
	const merged = extensionRegistry.getMergedDomain(domain);

	if (merged?.hasExtension) {
		// If args provided, check if first arg is an extension command
		if (args.length > 0) {
			const action = args[0];
			const extCmd = extensionRegistry.getExtensionCommand(
				domain,
				action ?? "",
			);
			if (extCmd) {
				// Execute extension command
				const result = await extCmd.execute(args.slice(1), session);
				const execResult: ExecutionResult = {
					output: result.output,
					shouldExit: result.shouldExit ?? false,
					shouldClear: result.shouldClear ?? false,
					contextChanged: result.contextChanged ?? false,
				};
				if (result.error) {
					execResult.error = result.error;
				}
				return execResult;
			}
		}

		// Standalone extension with no API domain - show commands
		if (!merged.hasGeneratedDomain) {
			if (args.length === 0) {
				const lines = [`${merged.displayName} commands:`];
				lines.push("");
				for (const [name, cmdDef] of merged.extensionCommands) {
					const aliases = cmdDef.aliases
						? ` (${cmdDef.aliases.join(", ")})`
						: "";
					lines.push(`  ${name}${aliases} - ${cmdDef.description}`);
				}
				return {
					output: lines,
					shouldExit: false,
					shouldClear: false,
					contextChanged: false,
				};
			}

			// Unknown command for standalone extension
			return {
				output: [
					`Unknown command: ${args[0]}`,
					"",
					`Available ${merged.displayName} commands:`,
					...Array.from(merged.extensionCommands.keys()).map(
						(c) => `  ${c}`,
					),
				],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
				error: `Unknown command: ${args[0]}`,
			};
		}
	}

	// Check if it's an API-generated domain
	if (!isValidDomain(domain) && !merged?.hasExtension) {
		return {
			output: [`Unknown domain: ${domain}`],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: "Unknown domain",
		};
	}

	// Set domain context first
	ctx.setDomain(domain);

	// If there are remaining args, check if first is an action to execute
	if (args.length > 0) {
		const firstArg = args[0]?.toLowerCase() ?? "";

		if (validActions.has(firstArg)) {
			// Create a ParsedCommand from the args and execute API command
			const cmd: ParsedCommand = {
				raw: args.join(" "),
				args: args,
				isBuiltin: false,
				isDirectNavigation: false,
			};
			return await executeAPICommand(session, ctx, cmd);
		}
	}

	// No action args - just return context change
	return {
		output: [`Entered ${domain} context`],
		shouldExit: false,
		shouldClear: false,
		contextChanged: true,
	};
}

/**
 * Execute a command in context
 */
export async function executeCommand(
	input: string,
	session: REPLSession,
): Promise<ExecutionResult> {
	const cmd = parseCommand(input);
	const ctx = session.getContextPath();

	// Handle empty input
	if (!cmd.raw) {
		return {
			output: [],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Add ALL non-empty commands to history (before execution)
	// This ensures direct navigation, builtins, and API commands are all recorded
	session.addToHistory(input);

	// Handle "/" prefix direct navigation
	if (cmd.isDirectNavigation) {
		return handleDirectNavigation(cmd, ctx, session);
	}

	// Handle built-in commands
	if (cmd.isBuiltin) {
		return executeBuiltin(cmd, session, ctx);
	}

	// Check if first word is a domain (custom, extension, or API-generated)
	// This applies at root OR when user types a full domain command from any context
	const firstWord = cmd.args[0]?.toLowerCase() ?? "";
	const hasExtension = extensionRegistry.hasExtension(firstWord);
	const isDomainCommand =
		isValidDomain(firstWord) || isCustomDomain(firstWord) || hasExtension;

	if (isDomainCommand) {
		// Reset context when user explicitly types a domain command
		// This ensures "virtual get ..." always works, regardless of current context
		if (!ctx.isRoot()) {
			ctx.reset();
		}
		// Pass remaining args for domain execution
		const domainArgs = cmd.args.slice(1);
		return handleDomainNavigation(firstWord, domainArgs, ctx, session);
	}

	// In domain context, execute API command directly (no action sub-context)
	// Execute API command
	return await executeAPICommand(session, ctx, cmd);
}

/**
 * Convert domain name to API resource path
 */
function domainToResourcePath(domain: string): string {
	// F5 XC API uses snake_case for resource paths (not kebab-case)
	// e.g., http_loadbalancer → http_loadbalancers (plural)
	const resourceName = domain;

	// Add 's' for plural form (most F5 XC resources are plural in API)
	return resourceName.endsWith("s") ? resourceName : `${resourceName}s`;
}

/**
 * Parsed command arguments
 */
export interface ParsedArgs {
	resourceType: string | undefined;
	name: string | undefined;
	namespace: string | undefined;
	outputFormat: OutputFormat | undefined;
	spec: boolean;
	noColor: boolean;
	/** Delete flags for pre-flight checks */
	dryRun: boolean;
	checkDeps: boolean;
}

/**
 * Parse command arguments for resource type, name, namespace, output format, and other flags
 * @param args - Command arguments to parse
 * @param domainResourceTypes - Set of valid resource type names for the current domain
 */
export function parseCommandArgs(
	args: string[],
	domainResourceTypes?: Set<string>,
): ParsedArgs {
	let resourceType: string | undefined;
	let name: string | undefined;
	let namespace: string | undefined;
	let outputFormat: OutputFormat | undefined;
	let spec = false;
	let noColor = false;
	let dryRun = false;
	let checkDeps = false;
	let positionalIndex = 0;

	// Track indices consumed as flag values to properly handle trailing positional args
	const consumedAsValue = new Set<number>();

	for (let i = 0; i < args.length; i++) {
		const arg = args[i] ?? "";

		if (arg.startsWith("--")) {
			const flagName = arg.slice(2).toLowerCase();
			const nextArg = args[i + 1];

			switch (flagName) {
				case "namespace":
				case "ns":
					namespace = nextArg;
					consumedAsValue.add(i + 1);
					i++;
					break;
				case "name":
					name = nextArg;
					consumedAsValue.add(i + 1);
					i++;
					break;
				case "output":
					if (nextArg) {
						outputFormat = parseOutputFormat(nextArg);
						consumedAsValue.add(i + 1);
						i++;
					}
					break;
				case "spec":
					spec = true;
					break;
				case "no-color":
					noColor = true;
					break;
				case "dry-run":
					dryRun = true;
					break;
				case "check-deps":
					checkDeps = true;
					break;
				case "yes":
				case "y":
				case "force":
				case "f":
					// Boolean flags - don't consume next arg
					break;
				default:
					// Skip other flags with values
					if (nextArg && !nextArg.startsWith("--")) {
						consumedAsValue.add(i + 1);
						i++;
					}
			}
		} else if (arg.startsWith("-")) {
			const flagName = arg.slice(1);
			const nextArg = args[i + 1];

			switch (flagName) {
				case "n":
					name = nextArg;
					consumedAsValue.add(i + 1);
					i++;
					break;
				case "ns":
					namespace = nextArg;
					consumedAsValue.add(i + 1);
					i++;
					break;
				case "o":
					if (nextArg) {
						outputFormat = parseOutputFormat(nextArg);
						consumedAsValue.add(i + 1);
						i++;
					}
					break;
				case "y":
				case "f":
					// Boolean flags - don't consume next arg
					break;
				default:
					// Skip other flags with values
					if (nextArg && !nextArg.startsWith("-")) {
						consumedAsValue.add(i + 1);
						i++;
					}
			}
		} else {
			// Positional argument
			if (positionalIndex === 0) {
				// First positional arg: could be resource type or resource name
				if (domainResourceTypes?.has(arg.toLowerCase())) {
					// It's a valid resource type for this domain
					resourceType = arg.toLowerCase();
				} else {
					// Not a resource type, treat as resource name
					name = arg;
				}
			} else if (positionalIndex === 1 && resourceType && !name) {
				// Second positional arg after resource type: resource name
				name = arg;
			}
			positionalIndex++;
		}
	}

	// After parsing, check for remaining positional args that weren't consumed as flag values
	// This handles cases like: get http_loadbalancer --namespace foo resource-name
	// where the resource name appears after flags
	if (!name && resourceType) {
		const remainingPositionals: string[] = [];
		for (let i = 0; i < args.length; i++) {
			const arg = args[i] ?? "";
			// Skip flags, flag values, and the resourceType itself
			if (
				!arg.startsWith("-") &&
				!consumedAsValue.has(i) &&
				arg.toLowerCase() !== resourceType
			) {
				remainingPositionals.push(arg);
			}
		}
		// Use the last remaining positional as the name
		if (remainingPositionals.length > 0) {
			name = remainingPositionals[remainingPositionals.length - 1];
		}
	}

	return {
		resourceType,
		name,
		namespace,
		outputFormat,
		spec,
		noColor,
		dryRun,
		checkDeps,
	};
}

/**
 * Execute an API command against the F5 XC API
 */
async function executeAPICommand(
	session: REPLSession,
	ctx: ContextPath,
	cmd: ParsedCommand,
): Promise<ExecutionResult> {
	const client = session.getAPIClient();

	// Check if connected
	if (!client) {
		return {
			output: [
				"ERROR: Not connected to F5 XC API",
				"Tip: Run 'login use profile <name>' to connect",
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: "Not connected. Use 'login profile use <profile>' to connect.",
		};
	}

	// Check if authenticated
	if (!client.isAuthenticated()) {
		return {
			output: [
				"ERROR: Not authenticated - API token required",
				"Tip: Run 'login use profile <name>' to authenticate",
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: "Not authenticated. Configure a profile with API token.",
		};
	}

	// Determine domain and action from context and command
	let domain: string;
	let action: string;
	let args: string[];

	if (ctx.isAction()) {
		// Already in action context, command is arguments
		domain = ctx.domain ?? "";
		action = ctx.action ?? "";
		args = cmd.args;
	} else if (ctx.domain) {
		// In domain context, first arg might be action
		domain = ctx.domain;
		const firstArg = cmd.args[0]?.toLowerCase() ?? "";
		if (validActions.has(firstArg)) {
			action = firstArg;
			args = cmd.args.slice(1);
		} else {
			// Default to list if no action specified
			action = "list";
			args = cmd.args;
		}
	} else {
		// At root, parse domain/action from command with quote handling
		const parts = parseInputArgs(cmd.raw);
		domain = parts[0] ?? "";
		action = parts[1]?.toLowerCase() ?? "list";
		args = parts.slice(validActions.has(action) ? 2 : 1);

		// If second part is not a valid action, treat as args
		if (!validActions.has(action)) {
			action = "list";
		}
	}

	// Use domain directly (aliases removed in v2.0.4)
	const canonicalDomain = domain;

	// Get valid resource types for this domain
	const domainInfo = getDomainInfo(canonicalDomain);

	// Validate domain exists (prevent unknown domain API calls)
	if (!domainInfo) {
		return {
			output: [
				`ERROR: Unknown domain '${canonicalDomain}'`,
				"",
				"Tip: Run 'domains' to see available domains",
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: `Unknown domain: ${canonicalDomain}`,
		};
	}

	const domainResourceTypes = new Set(
		domainInfo.primaryResources?.map((r) => r.name) ?? [],
	);

	// Parse arguments (with resource type detection)
	const {
		resourceType = "",
		name,
		namespace,
		outputFormat,
		spec,
		noColor,
		dryRun,
		checkDeps,
	} = parseCommandArgs(args, domainResourceTypes);
	const effectiveNamespace = namespace ?? session.getNamespace();

	// Validate namespace name for CLI safety (security: prevent injection attacks)
	if (effectiveNamespace) {
		const nsNameValidation = validateResourceName(effectiveNamespace, {
			resourceType: "namespace",
		});
		if (!nsNameValidation.valid) {
			const errorMsg =
				nsNameValidation.message ?? "Invalid namespace name";
			const tip = nsNameValidation.suggestion
				? `Tip: Try '${nsNameValidation.suggestion}' instead`
				: "Tip: Check the namespace name format and try again";
			return {
				output: [
					`ERROR: Invalid namespace name '${effectiveNamespace}'`,
					tip,
				],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
				error: errorMsg,
			};
		}
	}

	// Validate resource name for write operations only
	// Read operations (list, get, delete) skip validation to support legacy resources
	if (WRITE_OPERATIONS.has(action) && name) {
		const nameValidation = validateResourceName(name, {
			resourceType: resourceType ?? canonicalDomain,
		});
		if (!nameValidation.valid) {
			const errorMsg = nameValidation.message ?? "Invalid resource name";
			const tip = nameValidation.suggestion
				? `Tip: Try '${nameValidation.suggestion}' instead`
				: "Tip: Check the resource name format and try again";
			return {
				output: [`ERROR: Invalid resource name '${name}'`, tip],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
				error: errorMsg,
			};
		}
	}

	// Determine which resource to use for the API path
	// If a resource type was specified (e.g., "list http_loadbalancer"), use it
	// Otherwise, fall back to the domain name
	const effectiveResource = resourceType ?? canonicalDomain;

	// Validate namespace scope (from upstream enrichment)
	const nsValidation = validateNamespaceScope(
		canonicalDomain,
		action,
		effectiveNamespace,
	);
	if (!nsValidation.valid) {
		const errorMsg =
			nsValidation.message || "Invalid namespace for this operation";
		const lines = [`ERROR: ${errorMsg}`];
		if (nsValidation.suggestion) {
			lines.push(`Tip: Use --namespace ${nsValidation.suggestion}`);
		} else {
			lines.push("Tip: Check namespace requirements for this operation");
		}
		return {
			output: lines,
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: errorMsg,
		};
	}

	// Check operation safety and show warnings for dangerous operations
	const safetyCheck = checkOperationSafety(
		canonicalDomain,
		action,
		resourceType ?? "",
	);
	const warningOutput: string[] = [];

	// Load settings to check warning mode
	const settings = loadSettingsSync();
	const shouldShowWarning =
		settings.safetyWarnings === "enabled" ||
		(settings.safetyWarnings === "high-only" &&
			safetyCheck.dangerLevel === "high");

	if (safetyCheck.warning && shouldShowWarning) {
		warningOutput.push(safetyCheck.warning);
		warningOutput.push("");
	}

	// Handle --spec flag: return command specification for AI assistants
	if (spec) {
		// Use effectiveResource (resourceType or domain) for proper spec lookup
		// e.g., "healthcheck create" instead of "virtual create"
		const commandPath = `${effectiveResource} ${action}`;
		const cmdSpec = getCommandSpec(commandPath);
		if (cmdSpec) {
			return {
				output: [formatSpec(cmdSpec)],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}
		// Build a basic spec for API commands
		const basicSpec = {
			command: `${CLI_NAME} ${canonicalDomain} ${action}`,
			description: `Execute ${action} on ${canonicalDomain} resources`,
			usage: `${CLI_NAME} ${canonicalDomain} ${action} [name] [options]`,
			flags: [
				{
					name: "--namespace",
					alias: "-ns",
					type: "string",
					description: "Target namespace",
				},
				{
					name: "--output",
					alias: "-o",
					type: "string",
					description: `Output format (${OUTPUT_FORMAT_HELP})`,
				},
				{
					name: "--name",
					type: "string",
					description: "Resource name",
				},
			],
			outputFormats: [...ALL_OUTPUT_FORMATS],
		};
		return {
			output: [JSON.stringify(basicSpec, null, 2)],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Look up the operation definition from generated specs
	// This gives us the actual API path from the OpenAPI spec
	// If resourceType wasn't detected from primaryResources, try using the first arg
	// as it might be a valid resourceType defined in operations
	let effectiveResourceType = resourceType;
	if (!effectiveResourceType && args.length > 0) {
		// The first positional arg might be a resource type
		effectiveResourceType = args[0]?.toLowerCase() ?? "";
	}

	const operation = getOperationDefinition(
		canonicalDomain,
		action,
		effectiveResourceType,
	);

	// Build API path - prefer operation path from spec, fall back to generic
	let apiPath: string;
	let usedOperationPath = false;

	if (operation?.path) {
		// Use the actual path from the OpenAPI spec
		const pathParams: { namespace?: string; name?: string; site?: string } =
			{
				namespace: effectiveNamespace,
			};
		if (name) {
			pathParams.name = name;
		}
		apiPath = substitutePathParams(operation.path, pathParams);
		usedOperationPath = true;

		// Check if path still has unsubstituted placeholders
		if (hasUnsubstitutedParams(apiPath)) {
			// Some placeholders couldn't be substituted - fall back to generic
			const resourcePath = domainToResourcePath(effectiveResource);
			apiPath = `/api/config/namespaces/${effectiveNamespace}/${resourcePath}`;
			usedOperationPath = false;
		}
	} else {
		// Fallback to generic path construction (backwards compatibility)
		const resourcePath = domainToResourcePath(effectiveResource);
		apiPath = `/api/config/namespaces/${effectiveNamespace}/${resourcePath}`;
	}

	// Execute based on action
	try {
		let result: unknown;

		switch (action) {
			case "list": {
				const response = await client.get(apiPath);
				result = response.data;
				break;
			}

			case "get": {
				if (!name) {
					return {
						output: [
							"Error: Resource name required for 'get' action",
						],
						shouldExit: false,
						shouldClear: false,
						contextChanged: false,
						error: "Usage: get <name>",
					};
				}
				// Only append name if we didn't use operation path (which includes {name})
				if (!usedOperationPath) {
					apiPath += `/${name}`;
				}
				const response = await client.get(apiPath);
				result = response.data;
				break;
			}

			case "delete": {
				if (!name) {
					return {
						output: [
							"Error: Resource name required for 'delete' action",
						],
						shouldExit: false,
						shouldClear: false,
						contextChanged: false,
						error: "Usage: delete <name>",
					};
				}

				// Build the full API path for the resource
				let deleteApiPath = apiPath;
				if (!usedOperationPath) {
					deleteApiPath += `/${name}`;
				}

				// Perform pre-flight existence check
				const deleteFlags: DeleteFlags = {
					dryRun,
					checkDeps,
				};

				const preDeleteResult = await performPreDeleteCheck(
					client,
					deleteApiPath,
					name,
					effectiveResourceType || canonicalDomain,
					effectiveNamespace,
					deleteFlags,
				);

				// Handle dry-run: show what would be deleted without executing
				if (dryRun) {
					const dryRunOutput = formatPreDeleteResult(preDeleteResult);
					if (preDeleteResult.exists) {
						// Show dependency info if requested
						if (checkDeps && preDeleteResult.dependencies) {
							dryRunOutput.push(
								"Dependencies that would be affected:",
							);
							for (const dep of preDeleteResult.dependencies) {
								dryRunOutput.push(`  - ${dep}`);
							}
						}
						return {
							output: dryRunOutput,
							shouldExit: false,
							shouldClear: false,
							contextChanged: false,
						};
					}
					// Resource doesn't exist in dry-run mode - return error
					return {
						output: dryRunOutput,
						shouldExit: false,
						shouldClear: false,
						contextChanged: false,
						error: `Resource '${name}' not found`,
						exitCode: ExitCode.NotFoundError,
					};
				}

				// Handle resource not found - idempotent delete succeeds with informational message
				if (!preDeleteResult.exists) {
					const resourceTypeName =
						effectiveResourceType || canonicalDomain;
					return {
						output: [
							`Resource ${resourceTypeName} '${name}' does not exist in namespace ${effectiveNamespace}`,
						],
						shouldExit: false,
						shouldClear: false,
						contextChanged: false,
						// No error field = exit code 0 (idempotent success)
					};
				}

				// Pre-flight passed, execute the delete
				await client.delete(deleteApiPath);
				result = { message: `Deleted ${canonicalDomain} '${name}'` };
				break;
			}

			case "create":
			case "replace":
			case "apply": {
				// For create/replace/apply, we need a request body
				// Check for flag-based creation

				let requestBody: Record<string, unknown> | null = null;

				// Check for creation flags
				if (
					effectiveResourceType &&
					hasResourceBuilder(effectiveResourceType) &&
					hasCreationFlagsInArgs(args, effectiveResourceType)
				) {
					// Parse creation flags
					const parsed = parseCreationFlags(
						args,
						effectiveResourceType,
					);

					// Check for parsing errors
					if (parsed.errors.length > 0) {
						return {
							output: [
								"Error parsing creation flags:",
								...parsed.errors.map((e) => `  - ${e}`),
							],
							shouldExit: false,
							shouldClear: false,
							contextChanged: false,
							error: "Parse error",
						};
					}

					// Validate flags
					const validation = validateResourceFlags(
						effectiveResourceType,
						parsed,
					);
					if (!validation.valid) {
						return {
							output: [
								"Validation errors:",
								...validation.errors.map((e) => `  - ${e}`),
							],
							shouldExit: false,
							shouldClear: false,
							contextChanged: false,
							error: "Validation failed",
						};
					}

					// Build request body
					requestBody = buildResource(
						effectiveResourceType,
						parsed,
						effectiveNamespace,
					);
				}
				// Neither --file nor creation flags provided
				else {
					const supportsFlagCreation =
						effectiveResourceType &&
						hasResourceBuilder(effectiveResourceType);
					const hints = [
						`Action '${action}' requires a resource specification.`,
						"",
						"Options:",
						"  1. Use --file <path> to provide resource YAML/JSON",
					];

					if (supportsFlagCreation) {
						hints.push(
							`  2. Use creation flags (e.g., --name, --type, etc.)`,
							"",
							`Example with flags:`,
							`  create ${effectiveResourceType} --name my-resource ...`,
						);
					}

					return {
						output: hints,
						shouldExit: false,
						shouldClear: false,
						contextChanged: false,
					};
				}

				if (!requestBody) {
					return {
						output: ["Error: Failed to build request body"],
						shouldExit: false,
						shouldClear: false,
						contextChanged: false,
					};
				}

				// Quota pre-check for create operations
				if (action === "create" && effectiveResourceType) {
					const { SubscriptionClient } =
						await import("../domains/subscription/client.js");
					const { checkQuotaBeforeCreate, formatQuotaWarning } =
						await import("../quota/index.js");

					const subscriptionClient = new SubscriptionClient(client);
					const forceFlag = args.some(
						(a) => a === "--force" || a === "-f",
					);
					const quotaResult = await checkQuotaBeforeCreate(
						subscriptionClient,
						{
							resourceType: effectiveResourceType,
							namespace: effectiveNamespace,
							force: forceFlag,
						},
					);

					if (quotaResult.level !== "none") {
						const quotaWarningLines =
							formatQuotaWarning(quotaResult);

						if (!quotaResult.proceed) {
							return {
								output: quotaWarningLines,
								shouldExit: false,
								shouldClear: false,
								contextChanged: false,
								error: "Quota exceeded",
							};
						}

						// Show warning before proceeding
						warningOutput.push(...quotaWarningLines, "");
					}
				}

				// Execute the API call
				if (action === "create") {
					// Check for skip confirmation flags
					const skipConfirmFlag = args.some(
						(a) =>
							a === "--yes" ||
							a === "-y" ||
							a === "--force" ||
							a === "-f",
					);

					// If no skip flag, enter confirmation mode
					if (!skipConfirmFlag && requestBody) {
						const resourceName =
							(requestBody.metadata as Record<string, unknown>)
								?.name ??
							name ??
							"";
						const effectiveNs =
							(requestBody.metadata as Record<string, unknown>)
								?.namespace ??
							effectiveNamespace ??
							"";

						return {
							output: [],
							shouldExit: false,
							shouldClear: false,
							contextChanged: false,
							enterCreateConfirmMode: true,
							createConfirmConfig: {
								resourceType: effectiveResourceType ?? "",
								resourceName: String(resourceName),
								namespace: String(effectiveNs),
								domain: canonicalDomain,
								requestBody,
								onConfirm:
									async (): Promise<ExecutionResult> => {
										const response = await client.post(
											apiPath,
											requestBody,
										);
										const createResult = response.data ?? {
											message: `Created ${canonicalDomain}`,
										};
										const formatted = formatDomainOutput(
											createResult,
											{
												format: "text",
												noColor: false,
											},
										);
										return {
											output: [
												...warningOutput,
												...(formatted.length > 0
													? formatted
													: [
															`Created ${canonicalDomain}`,
														]),
											],
											shouldExit: false,
											shouldClear: false,
											contextChanged: false,
										};
									},
								onCancel: (): ExecutionResult => {
									return {
										output: ["Operation cancelled."],
										shouldExit: false,
										shouldClear: false,
										contextChanged: false,
									};
								},
							},
						};
					}

					const response = await client.post(apiPath, requestBody);
					result = response.data ?? {
						message: `Created ${canonicalDomain}`,
					};
				} else if (action === "replace") {
					// Replace uses PUT with name in path
					const resourceName =
						(requestBody.metadata as Record<string, unknown>)
							?.name ?? name;
					if (resourceName && !usedOperationPath) {
						apiPath += `/${resourceName}`;
					}
					const response = await client.put(apiPath, requestBody);
					result = response.data ?? {
						message: `Replaced ${canonicalDomain}`,
					};
				} else {
					// Apply - POST for create or PUT for update
					// Try POST first, if 409 conflict, use PUT
					try {
						const response = await client.post(
							apiPath,
							requestBody,
						);
						result = response.data ?? {
							message: `Applied ${canonicalDomain}`,
						};
					} catch (postError) {
						if (
							postError instanceof APIError &&
							postError.statusCode === 409
						) {
							// Resource exists, use PUT to update
							const resourceName =
								(
									requestBody.metadata as Record<
										string,
										unknown
									>
								)?.name ?? name;
							let putPath = apiPath;
							if (resourceName && !usedOperationPath) {
								putPath += `/${resourceName}`;
							}
							const response = await client.put(
								putPath,
								requestBody,
							);
							result = response.data ?? {
								message: `Updated ${canonicalDomain}`,
							};
						} else {
							throw postError;
						}
					}
				}
				break;
			}

			case "status": {
				if (!name) {
					return {
						output: [
							"Error: Resource name required for 'status' action",
						],
						shouldExit: false,
						shouldClear: false,
						contextChanged: false,
						error: "Usage: status <name>",
					};
				}
				// Only append name/status if we didn't use operation path
				if (!usedOperationPath) {
					apiPath += `/${name}/status`;
				}
				const response = await client.get(apiPath);
				result = response.data;
				break;
			}

			case "help": {
				const { handleHelpVerb } =
					await import("./help/verb-handler.js");
				return handleHelpVerb({
					session,
					ctx,
					domain: canonicalDomain,
					resourceType: resourceType ?? "",
					args,
					domainResourceTypes,
				});
			}

			case "spec": {
				// Extract resource type from args
				const { resourceType: specResourceType } = parseCommandArgs(
					args,
					domainResourceTypes,
				);

				if (!specResourceType) {
					const primaryResources = domainInfo.primaryResources ?? [];
					return {
						output: [
							"ERROR: Resource type required",
							"",
							`Usage: ${canonicalDomain} spec <resource-type>`,
							"",
							"Available resources:",
							...primaryResources.map(
								(r) => `  - ${r.name}: ${r.description}`,
							),
						],
						shouldExit: false,
						shouldClear: false,
						contextChanged: false,
						error: "Resource type required for spec action",
					};
				}

				// Build command path for spec lookup
				const commandPath = `${specResourceType} create`;
				const cmdSpec = getCommandSpec(commandPath);

				if (cmdSpec) {
					// Format and return spec
					return {
						output: [formatSpec(cmdSpec)],
						shouldExit: false,
						shouldClear: false,
						contextChanged: false,
					};
				}

				// Fallback: No spec available
				return {
					output: [
						`⚠ No specification available for ${specResourceType}`,
						"",
						`Try: ${canonicalDomain} create ${specResourceType} --spec`,
					],
					shouldExit: false,
					shouldClear: false,
					contextChanged: false,
					error: `No specification available for ${specResourceType}`,
				};
			}

			default: {
				return {
					output: [`Unknown action: ${action}`],
					shouldExit: false,
					shouldClear: false,
					contextChanged: false,
					error: `Valid actions: ${Array.from(validActions).join(", ")}`,
				};
			}
		}

		// Format output
		// Priority: CLI flag (--output) > session format (from env var or default)
		const effectiveFormat = outputFormat ?? session.getOutputFormat();
		const formatted = formatDomainOutput(result, {
			format: effectiveFormat,
			noColor: noColor ?? false,
		});

		// Prepend safety warnings if any
		const finalOutput = [
			...warningOutput,
			...(formatted.length > 0 ? formatted : ["(no output)"]),
		];

		return {
			output: finalOutput,
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	} catch (error) {
		if (error instanceof APIError) {
			// Special handling for 409 "in use" errors on delete
			if (
				error.statusCode === 409 &&
				action === "delete" &&
				name &&
				typeof error.response === "object" &&
				error.response !== null
			) {
				const errResp = error.response as Record<string, unknown>;
				const message = String(errResp.message || "");
				if (
					message.toLowerCase().includes("in use") ||
					message.toLowerCase().includes("cannot be deleted")
				) {
					// The API doesn't provide referring_objects in the response
					// Automatically detect dependencies by querying related domains
					const effectiveResource = resourceType || canonicalDomain;

					try {
						// Attempt to detect dependencies
						const dependencies = await detectDependencies(
							effectiveResource,
							name,
							effectiveNamespace,
							client,
						);

						let output: string[];
						if (dependencies.found) {
							// Format detailed error with actual dependencies
							output = formatDependencyError(
								effectiveResource,
								name,
								dependencies,
							);
						} else {
							// Fall back to generic tip if no dependencies found
							output = [
								`ERROR: Cannot delete ${effectiveResource} '${name}' - resource is in use`,
							];
						}

						return {
							output,
							shouldExit: false,
							shouldClear: false,
							contextChanged: false,
							error: error.message,
						};
					} catch {
						// If dependency detection fails, show fallback error
						return {
							output: [
								`ERROR: Cannot delete ${effectiveResource} '${name}' - resource is in use`,
							],
							shouldExit: false,
							shouldClear: false,
							contextChanged: false,
							error: error.message,
						};
					}
				}
			}

			// Standard error formatting
			const formatted = formatAPIError(
				error.statusCode,
				error.response,
				`${action} ${canonicalDomain}`,
			);
			return {
				output: [formatted],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
				error: error.message,
			};
		}

		// Handle other errors
		const message = error instanceof Error ? error.message : String(error);
		return {
			output: [
				`ERROR: ${message}`,
				"Tip: Check your input and try again, or use 'help' for usage information",
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: message,
		};
	}
}

/**
 * Get suggestions for current context and input
 */
export function getCommandSuggestions(
	input: string,
	session: REPLSession,
): Array<{ text: string; description: string; category: string }> {
	const ctx = session.getContextPath();
	const suggestions: Array<{
		text: string;
		description: string;
		category: string;
	}> = [];

	// At root, suggest domains and built-ins
	if (ctx.isRoot()) {
		// Add custom domain suggestions first (higher priority)
		for (const domain of customDomains.all()) {
			if (
				!input ||
				domain.name.toLowerCase().startsWith(input.toLowerCase())
			) {
				suggestions.push({
					text: domain.name,
					description: domain.description,
					category: "domain",
				});
			}
		}

		// Add domain aliases
		for (const [alias, canonical] of getDomainAliases()) {
			if (!input || alias.toLowerCase().startsWith(input.toLowerCase())) {
				const domain = customDomains.get(canonical);
				suggestions.push({
					text: alias,
					description: domain
						? `${domain.description} (alias)`
						: `Alias for ${canonical}`,
					category: "domain",
				});
			}
		}

		// Add extension domain suggestions (standalone extensions not in API)
		for (const extDomain of extensionRegistry.getExtendedDomains()) {
			// Skip if already added as custom domain or API domain
			if (isCustomDomain(extDomain) || isValidDomain(extDomain)) continue;

			if (
				!input ||
				extDomain.toLowerCase().startsWith(input.toLowerCase())
			) {
				const merged = extensionRegistry.getMergedDomain(extDomain);
				suggestions.push({
					text: extDomain,
					description: merged?.description ?? `${extDomain} commands`,
					category: "domain",
				});
			}
		}

		// Add API-generated domain suggestions
		allDomains().forEach((domain) => {
			// Skip if already added as custom domain
			if (isCustomDomain(domain)) return;

			if (
				!input ||
				domain.toLowerCase().startsWith(input.toLowerCase())
			) {
				const merged = extensionRegistry.getMergedDomain(domain);
				const hasExt = merged?.hasExtension ? " (+ext)" : "";
				suggestions.push({
					text: domain,
					description: `Navigate to ${domain} domain${hasExt}`,
					category: "domain",
				});
			}
		});

		// Add built-in commands
		BUILTIN_COMMANDS.forEach((cmd) => {
			if (!input || cmd.toLowerCase().startsWith(input.toLowerCase())) {
				suggestions.push({
					text: cmd,
					description: getBuiltinDescription(cmd),
					category: "builtin",
				});
			}
		});
	}

	// In domain context, suggest actions
	if (ctx.isDomain() && !ctx.isAction()) {
		const domain = ctx.domain ?? "";

		// Add extension commands first (higher priority for xcsh-specific)
		const extCmds = extensionRegistry.getExtensionCommandNames(domain);
		for (const cmd of extCmds) {
			if (!input || cmd.toLowerCase().startsWith(input.toLowerCase())) {
				const cmdDef = extensionRegistry.getExtensionCommand(
					domain,
					cmd,
				);
				suggestions.push({
					text: cmd,
					description: cmdDef?.description ?? `${cmd} command`,
					category: "extension",
				});
			}
		}

		// Add API actions
		const commonActions = ["list", "get", "create", "delete", "update"];
		commonActions.forEach((action) => {
			if (
				!input ||
				action.toLowerCase().startsWith(input.toLowerCase())
			) {
				suggestions.push({
					text: action,
					description: `${action} ${domain} resources`,
					category: "action",
				});
			}
		});
	}

	return suggestions;
}

/**
 * Get description for built-in command
 */
function getBuiltinDescription(cmd: string): string {
	const descriptions = new Map<string, string>([
		["help", "Show help information"],
		["clear", "Clear the screen"],
		["quit", "Exit the shell"],
		["exit", "Navigate up or exit"],
		["back", "Navigate up one level"],
		["..", "Navigate up one level"],
		["root", "Navigate to root"],
		["/", "Navigate to root"],
		["context", "Show current context"],
		["ctx", "Show current context"],
		["history", "Show command history"],
		["version", "Show version info"],
		["domains", "List available domains"],
		["refresh", "Refresh git status"],
	]);
	return descriptions.get(cmd) ?? "Built-in command";
}

export default {
	parseCommand,
	parseCommandArgs,
	executeCommand,
	getCommandSuggestions,
};
