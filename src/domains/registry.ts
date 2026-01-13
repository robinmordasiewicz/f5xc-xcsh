/**
 * Domain Registry - Extensible custom command domain system
 */

import type { REPLSession } from "../repl/session.js";
import { formatCustomDomainHelp } from "../repl/help.js";

/**
 * Configuration for entering chat mode
 */
export interface ChatModeConfig {
	/** Namespace for AI queries */
	namespace: string;
}

/**
 * Result from domain command execution
 * Compatible with ExecutionResult from executor
 */
export interface DomainCommandResult {
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
	/**
	 * Raw stdout content to write directly (bypassing Ink).
	 * When set, App.tsx will hide status bar first, write this content,
	 * then restore status bar. Used for commands that need cursor positioning
	 * like the image banner.
	 */
	rawStdout?: string;
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
}

/**
 * Command handler function signature
 */
export type CommandHandler = (
	args: string[],
	session: REPLSession,
) => Promise<DomainCommandResult>;

/**
 * Completion handler for a command
 */
export type CompletionHandler = (
	partial: string,
	args: string[],
	session: REPLSession,
) => Promise<string[]>;

/**
 * Definition of a single command within a domain
 */
export interface CommandDefinition {
	/** Command name (e.g., "list", "show", "create") */
	name: string;
	/** Long description (~500 chars) for detailed help */
	description: string;
	/** Short description (~60 chars) for completions, badges */
	descriptionShort: string;
	/** Medium description (~150 chars) for tooltips, summaries */
	descriptionMedium: string;
	/** Usage pattern (e.g., "<name> [options]") */
	usage?: string;
	/** Command execution handler */
	execute: CommandHandler;
	/** Optional completion handler */
	completion?: CompletionHandler;
	/** Aliases for this command */
	aliases?: string[];
}

/**
 * Definition of a subcommand group (e.g., "profile" under "login")
 */
export interface SubcommandGroup {
	/** Group name (e.g., "profile") */
	name: string;
	/** Long description (~500 chars) for detailed help */
	description: string;
	/** Short description (~60 chars) for completions, badges */
	descriptionShort: string;
	/** Medium description (~150 chars) for tooltips, summaries */
	descriptionMedium: string;
	/** Commands within this group */
	commands: Map<string, CommandDefinition>;
	/** Default command to run when subgroup is invoked with no args */
	defaultCommand?: CommandDefinition;
}

/**
 * Definition of an action group (e.g., "list" action)
 * Groups all resources that support a common action (verb-first routing)
 */
export interface ActionGroup {
	/** Action name (e.g., "list", "show", "create") */
	name: string;
	/** Long description (~500 chars) for detailed help */
	description: string;
	/** Short description (~60 chars) for completions, badges */
	descriptionShort: string;
	/** Medium description (~150 chars) for tooltips, summaries */
	descriptionMedium: string;
	/** Resource handlers for this action */
	resources: Map<string, CommandDefinition>;
	/** Default resource when action invoked with no args */
	defaultResource?: string;
}

/**
 * Definition of a custom domain
 */
export interface DomainDefinition {
	/** Domain name (e.g., "login") */
	name: string;
	/** Long description (~500 chars) for detailed help */
	description: string;
	/** Short description (~60 chars) for completions, badges */
	descriptionShort: string;
	/** Medium description (~150 chars) for tooltips, summaries */
	descriptionMedium: string;
	/** Verb-first action groups (PRIMARY - e.g., "list" action for "login list profile") */
	actions?: Map<string, ActionGroup>;
	/** Direct commands at domain level (e.g., "login" itself) */
	commands: Map<string, CommandDefinition>;
	/** Subcommand groups (LEGACY - backward compatibility for "login profile list") */
	subcommands: Map<string, SubcommandGroup>;
	/** Default command to run when domain is invoked with no args */
	defaultCommand?: CommandDefinition;
}

/**
 * Registry of custom domains
 * Custom domains take precedence over API-generated domains
 */
class DomainRegistry {
	private domains: Map<string, DomainDefinition> = new Map();

	/**
	 * Register a custom domain
	 */
	register(domain: DomainDefinition): void {
		this.domains.set(domain.name, domain);
	}

	/**
	 * Check if a domain is registered
	 */
	has(name: string): boolean {
		return this.domains.has(name);
	}

	/**
	 * Get a domain by name
	 */
	get(name: string): DomainDefinition | undefined {
		return this.domains.get(name);
	}

	/**
	 * Get all registered domain names
	 */
	list(): string[] {
		return Array.from(this.domains.keys());
	}

	/**
	 * Get all domains
	 */
	all(): DomainDefinition[] {
		return Array.from(this.domains.values());
	}

	/**
	 * Execute a command within a domain
	 * Handles routing through subcommand groups
	 *
	 * @param domainName - Name of the domain (e.g., "login")
	 * @param args - Command arguments (e.g., ["profile", "list"])
	 * @param session - REPL session
	 */
	async execute(
		domainName: string,
		args: string[],
		session: REPLSession,
	): Promise<DomainCommandResult> {
		const domain = this.domains.get(domainName);
		if (!domain) {
			return {
				output: [`Unknown domain: ${domainName}`],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
				error: "Unknown domain",
			};
		}

		// No args - run default command if set, otherwise show help
		if (args.length === 0) {
			if (domain.defaultCommand) {
				return domain.defaultCommand.execute([], session);
			}
			return this.showDomainHelp(domain);
		}

		const firstArg = args[0]?.toLowerCase() ?? "";
		const restArgs = args.slice(1);

		// Handle --help, -h, or help as first arg - show domain help
		if (firstArg === "--help" || firstArg === "-h" || firstArg === "help") {
			return this.showDomainHelp(domain);
		}

		// ROUTING ORDER:
		// 1. Check actions (verb-first: "login list profile")
		// 2. Check direct commands (domain-level: "cloudstatus status")

		// 1. Check for action group first (verb-first routing)
		const actionGroup = domain.actions?.get(firstArg);
		if (actionGroup) {
			return this.executeActionCommand(
				domain,
				domainName,
				firstArg,
				restArgs,
				session,
			);
		}

		// 2. Check for direct command at domain level
		const cmd = domain.commands.get(firstArg);
		if (cmd) {
			// Validate args before executing
			const commandPath = `${domainName} ${firstArg}`;
			const validationError = this.validateCommandArgs(
				cmd,
				restArgs,
				domain.commands,
				commandPath,
			);
			if (validationError) {
				return validationError;
			}
			return cmd.execute(restArgs, session);
		}

		// Check aliases for direct commands
		for (const [, command] of domain.commands) {
			if (command.aliases?.includes(firstArg)) {
				// Validate args before executing
				const commandPath = `${domainName} ${command.name}`;
				const validationError = this.validateCommandArgs(
					command,
					restArgs,
					domain.commands,
					commandPath,
				);
				if (validationError) {
					return validationError;
				}
				return command.execute(restArgs, session);
			}
		}

		// If we get here, nothing matched
		return {
			output: [
				`Unknown command: ${domainName} ${firstArg}`,
				``,
				`Run '${domainName}' for available commands.`,
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: "Unknown command",
		};
	}

	/**
	 * Execute an action-based command (verb-first routing)
	 * E.g., "login list profile" → action="list", resource="profile"
	 */
	private async executeActionCommand(
		domain: DomainDefinition,
		domainName: string,
		actionName: string,
		args: string[],
		session: REPLSession,
	): Promise<DomainCommandResult> {
		const actionGroup = domain.actions?.get(actionName);
		if (!actionGroup) {
			return {
				output: [
					`Unknown action: ${domainName} ${actionName}`,
					``,
					`Run '${domainName}' for available commands.`,
				],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
				error: "Unknown action",
			};
		}

		// No resource specified - use default or show help
		if (args.length === 0) {
			if (actionGroup.defaultResource) {
				const cmd = actionGroup.resources.get(
					actionGroup.defaultResource,
				);
				if (cmd) {
					return cmd.execute([], session);
				}
			}
			return this.showActionGroupHelp(domain, domainName, actionGroup);
		}

		const resourceName = args[0]?.toLowerCase() ?? "";
		const resourceArgs = args.slice(1);

		// Handle --help, -h, or help as first arg - show action group help
		if (
			resourceName === "--help" ||
			resourceName === "-h" ||
			resourceName === "help"
		) {
			return this.showActionGroupHelp(domain, domainName, actionGroup);
		}

		// Find resource handler
		const cmd = actionGroup.resources.get(resourceName);
		if (cmd) {
			// Validate args before executing
			const commandPath = `${domainName} ${actionName} ${resourceName}`;
			const validationError = this.validateCommandArgs(
				cmd,
				resourceArgs,
				actionGroup.resources,
				commandPath,
			);
			if (validationError) {
				return validationError;
			}
			return cmd.execute(resourceArgs, session);
		}

		return {
			output: [
				`Unknown resource: ${domainName} ${actionName} ${resourceName}`,
				``,
				`Run '${domainName} ${actionName}' for available resources.`,
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: "Unknown resource",
		};
	}

	/**
	 * Show help for an action group
	 */
	private showActionGroupHelp(
		_domain: DomainDefinition,
		domainName: string,
		actionGroup: ActionGroup,
	): DomainCommandResult {
		const output: string[] = [];

		// Header
		output.push(`${domainName} ${actionGroup.name}`);
		output.push(actionGroup.description);
		output.push(``);

		// Available resources
		output.push(`Available resources:`);
		for (const [resourceName, cmd] of actionGroup.resources) {
			output.push(`  ${resourceName.padEnd(20)} ${cmd.descriptionShort}`);
		}

		output.push(``);
		output.push(
			`Usage: ${domainName} ${actionGroup.name} <resource> [options]`,
		);

		return {
			output,
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	/**
	 * Get completions for a domain command
	 */
	async getCompletions(
		domainName: string,
		args: string[],
		partial: string,
		session: REPLSession,
	): Promise<Array<{ text: string; description: string; category: string }>> {
		const domain = this.domains.get(domainName);
		if (!domain) {
			return [];
		}

		const suggestions: Array<{
			text: string;
			description: string;
			category: string;
		}> = [];

		// No args yet - suggest actions and commands (action-first priority)
		if (args.length === 0) {
			// Add action groups first (verb-first priority)
			if (domain.actions) {
				for (const [name, group] of domain.actions) {
					if (name.toLowerCase().startsWith(partial.toLowerCase())) {
						suggestions.push({
							text: name,
							description: group.descriptionShort,
							category: "action",
						});
					}
				}
			}

			// Add direct commands
			for (const [name, cmd] of domain.commands) {
				if (name.toLowerCase().startsWith(partial.toLowerCase())) {
					suggestions.push({
						text: name,
						description: cmd.descriptionShort,
						category: "command",
					});
				}
			}

			return suggestions;
		}

		// First arg might be an action group
		const firstArg = args[0]?.toLowerCase() ?? "";
		const actionGroup = domain.actions?.get(firstArg);
		if (actionGroup && args.length === 1) {
			// Suggest resources within the action group
			for (const [name, cmd] of actionGroup.resources) {
				if (name.toLowerCase().startsWith(partial.toLowerCase())) {
					suggestions.push({
						text: name,
						description: cmd.descriptionShort,
						category: "resource",
					});
				}
			}
			return suggestions;
		}

		// Delegate to resource command's completion handler if available
		if (actionGroup && args.length >= 2) {
			const resourceName = args[1]?.toLowerCase() ?? "";
			const cmd = actionGroup.resources.get(resourceName);
			if (cmd?.completion) {
				const completions = await cmd.completion(
					partial,
					args.slice(2),
					session,
				);
				return completions.map((text) => ({
					text,
					description: "",
					category: "argument",
				}));
			}
		}

		// First arg might be a direct command
		const directCmd = domain.commands.get(firstArg);
		if (directCmd?.completion && args.length >= 1) {
			const completions = await directCmd.completion(
				partial,
				args.slice(1),
				session,
			);
			return completions.map((text) => ({
				text,
				description: "",
				category: "argument",
			}));
		}

		return suggestions;
	}

	/**
	 * Show help for a domain using the unified help formatter.
	 * This ensures consistent professional formatting across all domains.
	 */
	private showDomainHelp(domain: DomainDefinition): DomainCommandResult {
		return {
			output: formatCustomDomainHelp(domain),
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	/**
	 * Filter out global flags from command arguments.
	 * Returns args without global flags like --output/-o.
	 */
	private filterGlobalFlags(args: string[]): string[] {
		const filtered: string[] = [];
		let i = 0;

		while (i < args.length) {
			const arg = args[i] ?? "";

			// --output <value> or -o <value>
			if (arg === "--output" || arg === "-o") {
				// Skip the flag and its value
				i += 2;
				continue;
			}

			// --output=<value> or -o=<value>
			if (arg.startsWith("--output=") || arg.startsWith("-o=")) {
				i++;
				continue;
			}

			filtered.push(arg);
			i++;
		}

		return filtered;
	}

	/**
	 * Validate command arguments and check for conflicts with sibling commands.
	 * Returns an error result if validation fails, undefined if OK to proceed.
	 */
	private validateCommandArgs(
		cmd: CommandDefinition,
		cmdArgs: string[],
		siblingCommands: Map<string, CommandDefinition>,
		commandPath: string,
	): DomainCommandResult | undefined {
		// Filter out global flags (--output, -o) before validation
		// These flags are handled by parseDomainOutputFlags in commands
		const filteredArgs = this.filterGlobalFlags(cmdArgs);

		// If no extra args after filtering global flags, nothing to validate
		if (filteredArgs.length === 0) {
			return undefined;
		}

		// If command has a usage pattern expecting args, allow them
		if (cmd.usage && cmd.usage.trim().length > 0) {
			return undefined;
		}

		// Check if first extra arg is a sibling command (conflict)
		const firstExtraArg = filteredArgs[0]?.toLowerCase() ?? "";

		// Direct match with sibling command
		const siblingCmd = siblingCommands.get(firstExtraArg);
		if (siblingCmd) {
			// Build the suggested command
			const pathParts = commandPath.split(" ");
			pathParts.pop(); // Remove the current command name
			const suggestedPath = [...pathParts, ...filteredArgs].join(" ");

			return {
				output: [
					`Error: Cannot combine '${cmd.name}' with '${firstExtraArg}'.`,
					``,
					`Did you mean: ${suggestedPath}`,
				],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
				error: `Conflicting subcommands: '${cmd.name}' and '${firstExtraArg}'`,
			};
		}

		// Check if first extra arg matches a sibling command alias
		for (const [siblingName, sibling] of siblingCommands) {
			if (sibling.aliases?.includes(firstExtraArg)) {
				const pathParts = commandPath.split(" ");
				pathParts.pop();
				const suggestedPath = [...pathParts, ...filteredArgs].join(" ");

				return {
					output: [
						`Error: Cannot combine '${cmd.name}' with '${firstExtraArg}' (alias for '${siblingName}').`,
						``,
						`Did you mean: ${suggestedPath}`,
					],
					shouldExit: false,
					shouldClear: false,
					contextChanged: false,
					error: `Conflicting subcommands: '${cmd.name}' and '${firstExtraArg}'`,
				};
			}
		}

		// Command has no usage pattern but received args - warn about unexpected args
		return {
			output: [
				`Error: Unexpected arguments for '${cmd.name}': ${filteredArgs.join(" ")}`,
				``,
				`Usage: ${commandPath}`,
				``,
				`The '${cmd.name}' command does not accept additional arguments.`,
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			error: `Unexpected arguments: ${filteredArgs.join(" ")}`,
		};
	}
}

// Singleton instance
export const customDomains = new DomainRegistry();

/**
 * Helper to create a success result
 */
export function successResult(
	output: string[],
	contextChanged: boolean = false,
): DomainCommandResult {
	return {
		output,
		shouldExit: false,
		shouldClear: false,
		contextChanged,
	};
}

/**
 * Helper to create an error result
 */
export function errorResult(message: string): DomainCommandResult {
	return {
		output: [message],
		shouldExit: false,
		shouldClear: false,
		contextChanged: false,
		error: message,
	};
}

/**
 * Helper to create a result with raw stdout content
 * Used for commands that need cursor positioning (e.g., image banner)
 */
export function rawStdoutResult(content: string): DomainCommandResult {
	return {
		output: [], // No regular output - rawStdout is used instead
		shouldExit: false,
		shouldClear: false,
		contextChanged: false,
		rawStdout: content,
	};
}
