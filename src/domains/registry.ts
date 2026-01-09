/**
 * Domain Registry - Extensible custom command domain system
 */

import type { REPLSession } from "../repl/session.js";
import { formatCustomDomainHelp, formatSubcommandHelp } from "../repl/help.js";

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
	/** Direct commands at domain level (e.g., "login" itself) */
	commands: Map<string, CommandDefinition>;
	/** Subcommand groups (e.g., "login profile") */
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

		// Check for subcommand group first (e.g., "profile" in "login profile list")
		const subgroup = domain.subcommands.get(firstArg);
		if (subgroup) {
			// No args in subgroup - run default command if set, otherwise show help
			if (restArgs.length === 0) {
				if (subgroup.defaultCommand) {
					return subgroup.defaultCommand.execute([], session);
				}
				return this.showSubcommandHelp(domain, subgroup);
			}

			const cmdName = restArgs[0]?.toLowerCase() ?? "";

			// Handle --help, -h, or help as first arg in subgroup - show subgroup help
			if (
				cmdName === "--help" ||
				cmdName === "-h" ||
				cmdName === "help"
			) {
				return this.showSubcommandHelp(domain, subgroup);
			}
			const cmdArgs = restArgs.slice(1);

			// Find command in subgroup
			const cmd = subgroup.commands.get(cmdName);
			if (cmd) {
				// Validate args before executing
				const commandPath = `${domainName} ${firstArg} ${cmdName}`;
				const validationError = this.validateCommandArgs(
					cmd,
					cmdArgs,
					subgroup.commands,
					commandPath,
				);
				if (validationError) {
					return validationError;
				}
				return cmd.execute(cmdArgs, session);
			}

			// Check aliases
			for (const [, command] of subgroup.commands) {
				if (command.aliases?.includes(cmdName)) {
					// Validate args before executing
					const commandPath = `${domainName} ${firstArg} ${command.name}`;
					const validationError = this.validateCommandArgs(
						command,
						cmdArgs,
						subgroup.commands,
						commandPath,
					);
					if (validationError) {
						return validationError;
					}
					return command.execute(cmdArgs, session);
				}
			}

			return {
				output: [
					`Unknown command: ${domainName} ${firstArg} ${cmdName}`,
					``,
					`Run '${domainName} ${firstArg}' for available commands.`,
				],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
				error: "Unknown command",
			};
		}

		// Check for direct command at domain level
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

		// Check aliases
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

		// No args yet - suggest subcommands and commands
		if (args.length === 0) {
			// Add subcommand groups
			for (const [name, group] of domain.subcommands) {
				if (name.toLowerCase().startsWith(partial.toLowerCase())) {
					suggestions.push({
						text: name,
						description: group.descriptionShort,
						category: "subcommand",
					});
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

		// First arg is a subcommand group
		const firstArg = args[0]?.toLowerCase() ?? "";
		const subgroup = domain.subcommands.get(firstArg);
		if (subgroup && args.length === 1) {
			// Suggest commands within the subgroup
			for (const [name, cmd] of subgroup.commands) {
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

		// Delegate to command's completion handler if available
		if (subgroup && args.length >= 2) {
			const cmdName = args[1]?.toLowerCase() ?? "";
			const cmd = subgroup.commands.get(cmdName);
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
	 * Show help for a subcommand group using the unified help formatter.
	 * This ensures consistent professional formatting across all subcommands.
	 */
	private showSubcommandHelp(
		domain: DomainDefinition,
		subgroup: SubcommandGroup,
	): DomainCommandResult {
		return {
			output: formatSubcommandHelp(domain.name, subgroup),
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
