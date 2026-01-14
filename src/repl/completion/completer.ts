/**
 * Completer - Tab completion engine for the REPL
 * Provides context-aware suggestions for domains, actions, flags, and built-in commands
 */

import type { CompletionSuggestion, ParsedInput } from "./types.js";
import type { REPLSession } from "../session.js";
import { customDomains, isCustomDomain } from "../../domains/index.js";
import { extensionRegistry } from "../../extensions/index.js";
import { CompletionCache } from "./cache.js";
import {
	completionRegistry,
	getActionDescriptions,
} from "../../completion/index.js";
import { ALL_OUTPUT_FORMATS, OUTPUT_FORMAT_HELP } from "../../output/types.js";
import { getDomainInfo } from "../../types/domains.js";
import { resourceFetcher } from "./resource-fetcher.js";
import { loadSettingsSync, type AppSettings } from "../../config/settings.js";

/**
 * Context for resource completion
 * Tracks where we are in the completion chain: domain → action → resourceType → resourceName
 */
interface ResourceContext {
	domain: string | null;
	action: string | null;
	resourceType: string | null;
	resourceNamePartial: string;
}

/**
 * Actions that can operate on resource types
 */
const RESOURCE_ACTIONS = new Set(["list", "get", "delete", "status"]);

/**
 * Parse input text into args array, handling quoted strings
 */
export function parseInputArgs(text: string): string[] {
	const args: string[] = [];
	let current = "";
	let inQuote = false;
	let quoteChar = "";

	for (const char of text) {
		if (inQuote) {
			if (char === quoteChar) {
				inQuote = false;
			} else {
				current += char;
			}
		} else if (char === '"' || char === "'") {
			inQuote = true;
			quoteChar = char;
		} else if (char === " " || char === "\t") {
			if (current) {
				args.push(current);
				current = "";
			}
		} else {
			current += char;
		}
	}

	if (current) {
		args.push(current);
	}

	return args;
}

/**
 * Parse input for completion context
 */
export function parseInput(text: string): ParsedInput {
	const trimmed = text.trimStart();
	const args = parseInputArgs(trimmed);

	// Check for "/" prefix escape
	let isEscapedToRoot = false;
	if (args.length > 0 && args[0]?.startsWith("/")) {
		isEscapedToRoot = true;
		args[0] = args[0].slice(1);
		if (args[0] === "") {
			args.shift();
		}
	}

	// Check if input ends with whitespace - means we're starting a new word
	const endsWithSpace = trimmed.length > 0 && /\s$/.test(trimmed);

	// Get current word being typed
	// If input ends with space, we're starting a new word (empty currentWord)
	const currentWord = endsWithSpace ? "" : (args[args.length - 1] ?? "");

	// Check if completing a flag
	const isCompletingFlag = currentWord.startsWith("-");

	// Check if completing a flag value
	// Patterns: "--flag " or "--flag=value" or "--flag val"
	let isCompletingFlagValue = false;
	let currentFlag: string | null = null;

	// Flags that expect values (not boolean flags)
	const valueFlagPatterns = [
		"--namespace",
		"-ns",
		"--output",
		"-o",
		"--name",
		"-n",
		"--file",
		"-f",
		"--limit",
		"--label",
	];

	if (args.length >= 1 && !currentWord.startsWith("-")) {
		// When there's a trailing space (currentWord is ""), check if the LAST arg is a value flag
		// When typing a value (currentWord is partial), check if the SECOND-TO-LAST arg is a value flag
		const flagIndex = endsWithSpace ? args.length - 1 : args.length - 2;
		const prevArg = args[flagIndex];
		if (prevArg && prevArg.startsWith("-") && !prevArg.includes("=")) {
			if (valueFlagPatterns.some((f) => prevArg === f)) {
				isCompletingFlagValue = true;
				currentFlag = prevArg;
			}
		}
	}

	// Check for --flag=value pattern
	if (currentWord.includes("=")) {
		const eqIndex = currentWord.indexOf("=");
		const flagPart = currentWord.slice(0, eqIndex);
		if (flagPart.startsWith("-")) {
			isCompletingFlagValue = true;
			currentFlag = flagPart;
		}
	}

	return {
		args,
		currentWord,
		isEscapedToRoot,
		isCompletingFlag,
		isCompletingFlagValue,
		currentFlag,
	};
}

/**
 * Completer provides context-aware tab completion
 */
export class Completer {
	private session: REPLSession | null = null;
	private cache: CompletionCache;
	private diagnosticMode: boolean = false;
	private lastDiagnostic: import("./types.js").CompletionDiagnostic | null =
		null;
	private settings: AppSettings;

	constructor() {
		this.cache = new CompletionCache();
		this.settings = loadSettingsSync();

		// Check for CLI override via environment variable
		const cliCompletionMode = process.env.XCSH_COMPLETION_MODE;
		if (
			cliCompletionMode &&
			(cliCompletionMode === "all" || cliCompletionMode === "primary")
		) {
			this.settings.completionMode = cliCompletionMode;
		}
	}

	/**
	 * Set the session for context-aware completions
	 */
	setSession(session: REPLSession): void {
		this.session = session;
	}

	/**
	 * Get suggestions for the given input text
	 */
	async complete(text: string): Promise<CompletionSuggestion[]> {
		// If diagnostic mode is enabled, use diagnose() to track full diagnostic info
		if (this.diagnosticMode) {
			const diagnostic = await this.diagnose(text);
			return diagnostic.suggestions;
		}

		const trimmed = text.trimStart();

		// Empty input - show contextual suggestions
		if (trimmed === "") {
			return await this.getContextualSuggestions();
		}

		const parsed = parseInput(trimmed);

		// "/" alone - show root suggestions
		if (parsed.isEscapedToRoot && parsed.args.length === 0) {
			return this.getRootContextSuggestions();
		}

		// Check if first arg is a custom domain - delegate to domain completion
		// But only if user has finished typing the domain name (not still typing it)
		const firstArg = parsed.args[0]?.toLowerCase() ?? "";
		const isStillTypingDomain =
			parsed.args.length === 1 && parsed.currentWord === firstArg;
		if (
			isCustomDomain(firstArg) &&
			parsed.args.length >= 1 &&
			!isStillTypingDomain
		) {
			return await this.getCustomDomainCompletions(
				firstArg,
				parsed.args.slice(1),
				parsed.currentWord,
			);
		}

		// Check for resource context (domain/action/resourceType/resourceName chain)
		const resourceCtx = this.parseResourceContext(parsed);

		// Completing a flag value (e.g., "--output json" or "--output=json")
		if (parsed.isCompletingFlagValue && parsed.currentFlag) {
			return await this.getFlagValueCompletions(
				parsed.currentFlag,
				parsed.currentWord,
				parsed,
			);
		}

		// Completing a flag - pass detected action for action-specific flags
		if (parsed.isCompletingFlag) {
			return this.getFlagCompletions(
				parsed.currentWord,
				resourceCtx.action ?? undefined,
			);
		}

		// If we have a resource type, complete resource names from API
		if (resourceCtx.resourceType) {
			const resourceNames = await this.getResourceNameSuggestions(
				resourceCtx.resourceType,
				resourceCtx.resourceNamePartial,
			);
			if (resourceNames.length > 0) {
				return resourceNames;
			}
			// Resource type is specified but no resources exist - show flags only, not actions
			return this.getActionFlagSuggestions(
				resourceCtx.action ?? undefined,
			);
		}

		// If in domain context with an action that supports resources, show resource types
		if (
			resourceCtx.domain &&
			resourceCtx.action &&
			RESOURCE_ACTIONS.has(resourceCtx.action) &&
			!resourceCtx.resourceType
		) {
			const resourceTypes = this.getResourceTypeSuggestions(
				resourceCtx.domain,
			);
			if (resourceTypes.length > 0) {
				// If typing a word, filter resource types (unless word is the action itself)
				if (
					parsed.currentWord &&
					!parsed.currentWord.startsWith("-") &&
					parsed.currentWord.toLowerCase() !== resourceCtx.action
				) {
					const filtered = this.filterSuggestions(
						resourceTypes,
						parsed.currentWord,
					);
					if (filtered.length > 0) {
						return filtered;
					}
				} else if (
					!parsed.currentWord ||
					parsed.currentWord.toLowerCase() === resourceCtx.action
				) {
					// Just typed action + space (or typing action itself), show all resource types plus flags
					return [
						...resourceTypes,
						...this.getActionFlagSuggestions(resourceCtx.action),
					];
				}
			}
		}

		// Get base suggestions based on context
		let suggestions: CompletionSuggestion[];
		if (parsed.isEscapedToRoot) {
			const firstArg = parsed.args[0];
			if (parsed.args.length > 0 && firstArg && !isStillTypingDomain) {
				// /domain - navigating to a specific domain, show its children
				// Only if user has finished typing the domain name (not still typing it)
				const targetDomain = firstArg.toLowerCase();

				// Check if domain exists in completion registry (custom domains)
				const domainNode = completionRegistry.get(targetDomain);
				// Or check if it's an API domain
				const apiDomainInfo = getDomainInfo(targetDomain);

				if (domainNode || apiDomainInfo) {
					// Check if this is an API domain or a custom domain marked as API
					const isApiDomain =
						domainNode?.source === "api" || apiDomainInfo !== null;

					if (isApiDomain) {
						// API domain - check if action already typed (e.g., "/domain action")
						const hasAction =
							parsed.args.length > 1 &&
							RESOURCE_ACTIONS.has(
								parsed.args[1]?.toLowerCase() ?? "",
							);
						if (!hasAction) {
							// No action yet - show actions
							suggestions = this.getActionSuggestions();
						} else {
							// Action already typed - resource context logic above should have
							// handled showing resource types. If we got here, show flags.
							suggestions = this.getActionFlagSuggestions(
								parsed.args[1]?.toLowerCase(),
							);
						}
					} else {
						// Custom domain with children - show child suggestions
						suggestions = completionRegistry.getChildSuggestions(
							targetDomain,
							parsed.currentWord,
						);
					}
				} else {
					// Unknown domain - fall back to root suggestions filtered by prefix
					suggestions = this.getRootContextSuggestions();
				}
			} else {
				// Just "/" or still typing domain name - show all domains
				suggestions = this.getRootContextSuggestions();
			}
		} else {
			suggestions = await this.getContextualSuggestions();
		}

		// Filter by current word if present
		if (parsed.currentWord) {
			return this.filterSuggestions(suggestions, parsed.currentWord);
		}

		return suggestions;
	}

	/**
	 * Get completions for custom domain commands
	 * Uses unified completion registry for structure navigation,
	 * falls back to domain handlers for argument completions
	 */
	async getCustomDomainCompletions(
		domainName: string,
		args: string[],
		currentWord: string,
	): Promise<CompletionSuggestion[]> {
		// Check if domain exists in registry
		const domainNode = completionRegistry.get(domainName);
		if (!domainNode) {
			return [];
		}

		// No args after domain - suggest children (subcommands and direct commands)
		if (args.length === 0) {
			return completionRegistry.getChildSuggestions(
				domainName,
				currentWord,
			);
		}

		// Check for subcommand groups (action groups)
		const subgroupName = args[0]?.toLowerCase() ?? "";
		const subgroupNode = domainNode.children?.get(subgroupName);

		// If we have exactly one arg and it matches currentWord, user is still typing
		// Show the action/subcommand as a completion suggestion
		if (args.length === 1 && currentWord === args[0]) {
			return completionRegistry.getChildSuggestions(
				domainName,
				currentWord,
			);
		}

		// First arg is a subcommand group - check for nested children

		if (subgroupNode?.children) {
			// Check if args[1] is a complete, valid command name
			const cmdName = args[1]?.toLowerCase() ?? "";
			const domain = customDomains.get(domainName);
			let cmd = domain?.actions
				?.get(subgroupName)
				?.resources.get(cmdName);

			// Fall back to old subcommand structure for legacy compatibility
			if (!cmd) {
				const subgroup = domain?.subcommands.get(subgroupName);
				cmd = subgroup?.commands.get(cmdName);
			}

			// Only suggest nested commands if:
			// 1. Only one arg so far (the subgroup name), OR
			// 2. Two args but the second arg is NOT a complete command name
			if (
				args.length === 1 ||
				(args.length === 2 && currentWord === args[1] && !cmd)
			) {
				const prefix = args.length === 2 ? currentWord : "";
				return completionRegistry.getNestedChildSuggestions(
					domainName,
					[subgroupName],
					prefix,
				);
			}

			// Deeper completion - delegate to original command's completion handler
			if (args.length >= 2 && this.session && cmd) {
				if (cmd?.completion) {
					try {
						const completions = await cmd.completion(
							currentWord,
							args.slice(2),
							this.session,
						);
						return completions.map((text) => ({
							text,
							description: "",
							category: "argument" as const,
						}));
					} catch {
						// Ignore completion errors
					}
				}
			}
		}

		// First arg is a direct command - delegate to command's completion handler
		const directCmdName = args[0]?.toLowerCase() ?? "";
		const domain = customDomains.get(domainName);
		const directCmd = domain?.commands.get(directCmdName);
		if (directCmd?.completion && this.session) {
			try {
				const completions = await directCmd.completion(
					currentWord,
					args.slice(1),
					this.session,
				);
				return completions.map((text) => ({
					text,
					description: "",
					category: "argument" as const,
				}));
			} catch {
				// Ignore completion errors
			}
		}

		return [];
	}

	/**
	 * Get suggestions based on current navigation context
	 * Note: Actions don't create sub-contexts - only domain-level navigation exists
	 */
	async getContextualSuggestions(): Promise<CompletionSuggestion[]> {
		if (!this.session) {
			return this.getRootContextSuggestions();
		}

		const ctx = this.session.getContextPath();

		if (ctx.isDomain()) {
			return this.getDomainContextSuggestions();
		}

		return this.getRootContextSuggestions();
	}

	/**
	 * Get suggestions for root context
	 */
	getRootContextSuggestions(): CompletionSuggestion[] {
		const suggestions: CompletionSuggestion[] = [];

		// Add domains from registry
		suggestions.push(...this.getDomainSuggestions());

		// Add built-in commands
		suggestions.push(
			{
				text: "quit",
				description: "Exit the shell",
				category: "builtin",
			},
			{
				text: "help",
				description: "Show help information",
				category: "builtin",
			},
			{
				text: "clear",
				description: "Clear the screen",
				category: "builtin",
			},
			{
				text: "history",
				description: "Show command history",
				category: "builtin",
			},
			{
				text: "context",
				description: "Show current navigation context",
				category: "builtin",
			},
			{
				text: "ctx",
				description: "Show current navigation context (alias)",
				category: "builtin",
			},
		);

		return suggestions;
	}

	/**
	 * Get suggestions when in a domain context
	 */
	getDomainContextSuggestions(): CompletionSuggestion[] {
		const suggestions: CompletionSuggestion[] = [];

		// Add actions
		suggestions.push(...this.getActionSuggestions());

		// Add extension commands if domain has an extension
		if (this.session) {
			const ctx = this.session.getContextPath();
			if (ctx.domain) {
				suggestions.push(
					...this.getExtensionCommandSuggestions(ctx.domain),
				);
			}
		}

		// Add navigation commands
		suggestions.push(
			{
				text: "exit",
				description: "Go up to root context",
				category: "navigation",
			},
			{
				text: "back",
				description: "Go up to root context",
				category: "navigation",
			},
			{
				text: "..",
				description: "Go up to root context",
				category: "navigation",
			},
			{
				text: "help",
				description: "Show context help",
				category: "builtin",
			},
		);

		return suggestions;
	}

	/**
	 * Get extension command suggestions for a domain
	 */
	getExtensionCommandSuggestions(domain: string): CompletionSuggestion[] {
		const suggestions: CompletionSuggestion[] = [];
		const extension = extensionRegistry.getExtension(domain);

		if (!extension) {
			return suggestions;
		}

		// Add extension commands
		for (const [name, cmd] of extension.commands) {
			suggestions.push({
				text: name,
				description: cmd.description,
				category: "command",
			});

			// Add command aliases
			if (cmd.aliases) {
				for (const alias of cmd.aliases) {
					suggestions.push({
						text: alias,
						description: `${cmd.description} (alias for ${name})`,
						category: "command",
					});
				}
			}
		}

		// Add extension subcommand groups
		if (extension.subcommands) {
			for (const [name, group] of extension.subcommands) {
				suggestions.push({
					text: name,
					description: group.description,
					category: "subcommand",
				});
			}
		}

		return suggestions;
	}

	/**
	 * Get resource-related suggestions for a domain with an action
	 * Called when user types an action (list, get, delete) followed by space
	 */
	getResourceSuggestionsForAction(
		domain: string,
		action: string,
	): CompletionSuggestion[] {
		const suggestions: CompletionSuggestion[] = [];

		// If action operates on resource types, add resource type suggestions
		if (RESOURCE_ACTIONS.has(action)) {
			const resourceTypes = this.getResourceTypeSuggestions(domain);
			suggestions.push(...resourceTypes);
		}

		// Add common flags for the action
		suggestions.push(...this.getCommonFlagSuggestions());

		return suggestions;
	}

	/**
	 * Get common flag suggestions (for use within domain context)
	 */
	getCommonFlagSuggestions(): CompletionSuggestion[] {
		return [
			{ text: "--namespace", description: "Namespace", category: "flag" },
			{
				text: "--output",
				description: `Output format (${OUTPUT_FORMAT_HELP})`,
				category: "flag",
			},
			{
				text: "-o",
				description: "Output format (short)",
				category: "flag",
			},
		];
	}

	/**
	 * Get domain suggestions from unified registry
	 */
	getDomainSuggestions(): CompletionSuggestion[] {
		// Use unified completion registry for domain suggestions
		return completionRegistry.getDomainSuggestions();
	}

	/**
	 * Get action suggestions from unified registry
	 */
	getActionSuggestions(): CompletionSuggestion[] {
		// Use shared action descriptions from completion module
		const actionDescriptions = getActionDescriptions();
		return Object.entries(actionDescriptions).map(
			([action, description]) => ({
				text: action,
				description,
				category: "action" as const,
			}),
		);
	}

	/**
	 * Get resource type suggestions for a domain
	 * Phase 1 Enhancement: Uses allResources (dynamically discovered) by default
	 * Falls back to primaryResources if allResources not available
	 * Respects user configuration setting for completion mode
	 */
	getResourceTypeSuggestions(domain: string): CompletionSuggestion[] {
		const domainInfo = getDomainInfo(domain);
		if (!domainInfo) {
			return [];
		}

		// Select resources based on user's completion mode preference
		let resources;
		if (this.settings.completionMode === "primary") {
			// User prefers primary resources only
			resources = domainInfo.primaryResources;
		} else {
			// Default: "all" mode - use allResources (discovered from OpenAPI) if available
			resources = domainInfo.allResources || domainInfo.primaryResources;
		}

		if (!resources || resources.length === 0) {
			return [];
		}

		// Sort resources: primary first, then by category, then alphabetically
		const sortedResources = [...resources].sort((a, b) => {
			// Primary resources first
			if (a.isPrimary && !b.isPrimary) return -1;
			if (!a.isPrimary && b.isPrimary) return 1;

			// Then by category: crud → analytics → utility → management
			const categoryOrder = {
				crud: 0,
				analytics: 1,
				utility: 2,
				management: 3,
			};
			const aCat = categoryOrder[a.resourceCategory || "crud"];
			const bCat = categoryOrder[b.resourceCategory || "crud"];
			if (aCat !== bCat) return aCat - bCat;

			// Finally alphabetically
			return a.name.localeCompare(b.name);
		});

		return sortedResources.map((resource) => {
			// Mark primary resources with indicator (only in "all" mode)
			const isPrimaryIndicator =
				this.settings.completionMode === "all" && resource.isPrimary
					? " ⭐"
					: "";
			const description =
				(resource.descriptionShort || resource.description) +
				isPrimaryIndicator;

			return {
				text: resource.name,
				description,
				category: "resource" as const,
			};
		});
	}

	/**
	 * Get resource name suggestions from live API
	 * Fetches actual resource names for a given resource type
	 */
	async getResourceNameSuggestions(
		resourceType: string,
		partial: string = "",
	): Promise<CompletionSuggestion[]> {
		if (!this.session) return [];

		const namespace = this.session.getNamespace();
		const client = this.session.getAPIClient();

		const names = await resourceFetcher.fetchResourceNames(
			client,
			namespace,
			resourceType,
			partial,
		);

		return names.map((name) => ({
			text: name,
			description: `${resourceType} resource`,
			category: "resource-name" as const,
		}));
	}

	/**
	 * Parse resource context from input
	 * Detects: domain → action → resourceType → resourceName
	 * Note: Actions are detected from input args, not navigation context
	 *
	 * Key distinction:
	 * - "list http_loadbalancer" (no space) → still typing resource type
	 * - "list http_loadbalancer " (with space) → resource type complete, ready for resource name
	 */
	parseResourceContext(parsed: ParsedInput): ResourceContext {
		const ctx: ResourceContext = {
			domain: null,
			action: null,
			resourceType: null,
			resourceNamePartial: "",
		};

		// Get current navigation context from session (or empty if no session)
		const navCtx = this.session?.getContextPath() || {
			domain: null,
			resourceType: null,
		};

		// Detect domain and action from input args
		// Two patterns:
		// 1. Navigation-based: IN domain context, typing action → domain from navCtx, action from args[0]
		// 2. Command-based: Full command on one line → domain from args[0], action from args[1]

		let argOffset = 0; // Offset to find the action

		// If input starts with "/" (isEscapedToRoot), ignore navigation context and use command-based parsing
		// Check if we're in navigation context (already in a domain) AND not escaped to root
		if (navCtx.domain && !parsed.isEscapedToRoot) {
			// Pattern 1: Navigation-based
			ctx.domain = navCtx.domain;
			argOffset = 0; // Action is at args[0]
		} else if (parsed.args.length > 0) {
			// Pattern 2: Command-based - check if first arg is an API domain
			const firstArg = parsed.args[0]?.toLowerCase() ?? "";
			const domainInfo = getDomainInfo(firstArg);
			if (domainInfo) {
				// First arg is an API domain
				ctx.domain = firstArg;
				argOffset = 1; // Action is at args[1]
			}
		}

		// Check for action at the detected offset
		if (parsed.args.length > argOffset) {
			const actionArg = parsed.args[argOffset]?.toLowerCase() ?? "";
			if (RESOURCE_ACTIONS.has(actionArg)) {
				ctx.action = actionArg;
			}
		}

		// If we have domain + action that supports resources, check for resource type
		if (ctx.domain && ctx.action && RESOURCE_ACTIONS.has(ctx.action)) {
			const domainInfo = getDomainInfo(ctx.domain);
			// Phase 1 Enhancement: Use allResources (discovered from OpenAPI) if available
			const resources =
				domainInfo?.allResources || domainInfo?.primaryResources;
			const resourceNames = new Set(resources?.map((r) => r.name) ?? []);

			// Find which arg might be a resource type (start after the action position)
			// argOffset is 0 for navigation-based, 1 for command-based
			// Resource type is at argOffset + 1 (after domain and/or action)
			for (let i = argOffset + 1; i < parsed.args.length; i++) {
				const arg = parsed.args[i]?.toLowerCase() ?? "";
				if (resourceNames.has(arg)) {
					// Check if this is the last arg AND equals currentWord (user still typing)
					const isLastArg = i === parsed.args.length - 1;
					const isStillTyping =
						isLastArg && parsed.currentWord.toLowerCase() === arg;

					if (isStillTyping) {
						// User is still typing the resource type (no trailing space)
						// Don't set resourceType - let it fall through to resource type suggestions
						break;
					}

					ctx.resourceType = arg;
					// The next arg or current word is the resource name partial (but NOT if it's a flag)
					if (i < parsed.args.length - 1) {
						const nextArg = parsed.args[i + 1]?.toLowerCase() ?? "";
						// Only treat as resource name partial if it's not a flag
						if (!nextArg.startsWith("-")) {
							ctx.resourceNamePartial = nextArg;
						}
					} else if (!parsed.currentWord) {
						// Trailing space after resource type - ready for resource name
						ctx.resourceNamePartial = "";
					}
					break;
				}
			}
		}

		return ctx;
	}

	/**
	 * Get flag suggestions for a given action
	 * @param action - The action to get flags for (optional, uses common flags if not provided)
	 */
	getActionFlagSuggestions(action?: string): CompletionSuggestion[] {
		// Common flags that apply to most actions
		const commonFlags: CompletionSuggestion[] = [
			{ text: "--name", description: "Resource name", category: "flag" },
			{
				text: "-n",
				description: "Resource name (short)",
				category: "flag",
			},
			{ text: "--namespace", description: "Namespace", category: "flag" },
			{
				text: "--output",
				description: `Output format (${OUTPUT_FORMAT_HELP})`,
				category: "flag",
			},
			{
				text: "-o",
				description: "Output format (short)",
				category: "flag",
			},
		];

		if (!action) {
			return commonFlags;
		}

		// Add action-specific flags
		const actionFlags: CompletionSuggestion[] = [...commonFlags];

		switch (action) {
			case "list":
				actionFlags.push(
					{
						text: "--limit",
						description: "Maximum results to return",
						category: "flag",
					},
					{
						text: "--label",
						description: "Filter by label",
						category: "flag",
					},
				);
				break;
			case "get":
				actionFlags.push({
					text: "--show-labels",
					description: "Show resource labels",
					category: "flag",
				});
				break;
			case "create":
			case "apply":
				actionFlags.push(
					{
						text: "--file",
						description: "Configuration file path",
						category: "flag",
					},
					{
						text: "-f",
						description: "Configuration file (short)",
						category: "flag",
					},
				);
				break;
			case "delete":
				actionFlags.push(
					{
						text: "--force",
						description: "Force deletion",
						category: "flag",
					},
					{
						text: "--cascade",
						description: "Cascade delete",
						category: "flag",
					},
				);
				break;
		}

		return actionFlags;
	}

	/**
	 * Get flag completions filtered by prefix
	 * @param prefix - The prefix to filter by
	 * @param action - Optional action for action-specific flags
	 */
	getFlagCompletions(
		prefix: string,
		action?: string,
	): CompletionSuggestion[] {
		const allFlags = this.getActionFlagSuggestions(action);
		return this.filterSuggestions(allFlags, prefix);
	}

	/**
	 * Extract a flag value from args array
	 * @param args - Array of command arguments
	 * @param flagNames - Flag names to look for (e.g., ["--namespace", "-ns"])
	 * @returns The flag value or undefined if not found
	 */
	private extractFlagValue(
		args: string[],
		flagNames: string[],
	): string | undefined {
		for (let i = 0; i < args.length - 1; i++) {
			if (flagNames.includes(args[i] ?? "")) {
				return args[i + 1];
			}
		}
		return undefined;
	}

	/**
	 * Get flag value completions based on the flag being completed
	 */
	async getFlagValueCompletions(
		flag: string,
		partial: string,
		parsed: ParsedInput,
	): Promise<CompletionSuggestion[]> {
		// Extract partial after "=" if present
		let valuePartial = partial;
		if (partial.includes("=")) {
			valuePartial = partial.slice(partial.indexOf("=") + 1);
		}

		const lowerPartial = valuePartial.toLowerCase();

		switch (flag) {
			case "--output":
			case "-o":
				return ALL_OUTPUT_FORMATS.map((fmt) => ({
					text: fmt,
					description: `${fmt.toUpperCase()} format`,
					category: "value" as const,
				})).filter((s) =>
					s.text.toLowerCase().startsWith(lowerPartial),
				);

			case "--namespace":
			case "-ns":
				return this.completeNamespace(valuePartial);

			case "--name":
			case "-n": {
				// Resource name completion - use command context for resource type
				if (!this.session) {
					return [];
				}

				// Get resource type from command args (e.g., "get http_loadbalancer" → "http_loadbalancer")
				const resourceCtx = this.parseResourceContext(parsed);
				const navCtx = this.session.getContextPath();

				// Prefer resource type from command, fall back to navigation domain
				const resourceType =
					resourceCtx.resourceType || navCtx.domain || null;

				// Get namespace from --namespace flag in args, or session default
				const nsFromFlag = this.extractFlagValue(parsed.args, [
					"--namespace",
					"-ns",
				]);
				const namespace = nsFromFlag || this.session.getNamespace();

				if (resourceType && namespace) {
					return this.completeResourceName(
						resourceType, // Will be pluralized for API path (e.g., 'http_loadbalancer' → 'http_loadbalancers')
						resourceType,
						valuePartial,
						namespace,
					);
				}
				return [];
			}

			case "--limit":
				// Common limit values
				return [
					{
						text: "10",
						description: "10 results",
						category: "value" as const,
					},
					{
						text: "25",
						description: "25 results",
						category: "value" as const,
					},
					{
						text: "50",
						description: "50 results",
						category: "value" as const,
					},
					{
						text: "100",
						description: "100 results",
						category: "value" as const,
					},
				].filter((s) => s.text.startsWith(valuePartial));

			default:
				return [];
		}
	}

	/**
	 * Complete namespace names with caching
	 */
	async completeNamespace(partial: string): Promise<CompletionSuggestion[]> {
		const namespaces = await this.cache.getNamespaces(async () => {
			// Fetch from API client if available
			const client = this.session?.getAPIClient();
			if (client?.isAuthenticated()) {
				try {
					const response = await client.get<{
						items?: Array<{ name?: string }>;
					}>("/api/web/namespaces");
					if (response.ok && response.data?.items) {
						return response.data.items
							.map((item) => item.name)
							.filter((name): name is string => !!name);
					}
				} catch {
					// Fall back to defaults on error
				}
			}
			// Return common defaults if not connected
			return ["default", "system", "shared"];
		});

		return namespaces
			.filter((ns) => ns.toLowerCase().startsWith(partial.toLowerCase()))
			.map((ns) => ({
				text: ns,
				description: "Namespace",
				category: "value" as const,
			}));
	}

	/**
	 * Convert resource type to API resource path
	 * F5 XC API paths keep underscores and use plural form
	 * Example: http_loadbalancer → http_loadbalancers
	 */
	private domainToResourcePath(resourceType: string): string {
		// F5 XC API paths keep underscores (not kebab-case)
		// Just add 's' for plural form
		return resourceType.endsWith("s") ? resourceType : `${resourceType}s`;
	}

	/**
	 * Complete resource names with caching
	 */
	async completeResourceName(
		domain: string,
		_resourceType: string,
		partial: string,
		namespaceOverride?: string,
	): Promise<CompletionSuggestion[]> {
		const namespace =
			namespaceOverride || this.session?.getNamespace() || "default";
		const cacheKey = `${domain}:${namespace}`;
		const names = await this.cache.getResourceNames(cacheKey, async () => {
			// Fetch from API client if available
			const client = this.session?.getAPIClient();
			if (client?.isAuthenticated()) {
				try {
					const resourcePath = this.domainToResourcePath(domain);
					const response = await client.get<{
						items?: Array<{ name?: string }>;
					}>(`/api/config/namespaces/${namespace}/${resourcePath}`);
					if (response.ok && response.data?.items) {
						return response.data.items
							.map((item) => item.name)
							.filter((name): name is string => !!name);
					}
				} catch {
					// Return empty on error
				}
			}
			return [];
		});

		return names
			.filter((name) =>
				name.toLowerCase().startsWith(partial.toLowerCase()),
			)
			.map((name) => ({
				text: name,
				description: "Resource",
				category: "argument" as const,
			}));
	}

	/**
	 * Get the completion cache (for testing/debugging)
	 */
	getCache(): CompletionCache {
		return this.cache;
	}

	/**
	 * Filter suggestions by prefix (case-insensitive)
	 */
	filterSuggestions(
		suggestions: CompletionSuggestion[],
		prefix: string,
	): CompletionSuggestion[] {
		if (!prefix) {
			return suggestions;
		}

		const lowerPrefix = prefix.toLowerCase();
		return suggestions.filter((s) =>
			s.text.toLowerCase().startsWith(lowerPrefix),
		);
	}

	/**
	 * Enable diagnostic mode for troubleshooting completion issues
	 */
	enableDiagnostics(): void {
		this.diagnosticMode = true;
	}

	/**
	 * Disable diagnostic mode
	 */
	disableDiagnostics(): void {
		this.diagnosticMode = false;
		this.lastDiagnostic = null;
	}

	/**
	 * Get the last diagnostic result (if diagnostic mode was enabled)
	 */
	getLastDiagnostic(): import("./types.js").CompletionDiagnostic | null {
		return this.lastDiagnostic;
	}

	/**
	 * Run completion with full diagnostic tracking
	 * This method performs the same logic as complete() but captures detailed diagnostic information
	 */
	async diagnose(
		text: string,
	): Promise<import("./types.js").CompletionDiagnostic> {
		const startTime = Date.now();
		const trimmed = text.trimStart();
		const parsed = parseInput(trimmed);

		// Initialize diagnostic object
		const diagnostic: import("./types.js").CompletionDiagnostic = {
			input: text,
			cursorPosition: text.length,
			parsedContext: parsed,
			authentication: {
				clientConnected: false,
				isAuthenticated: false,
			},
			namespace: {
				fromSession: "default",
				resolved: "default",
			},
			suggestions: [],
			performance: {
				parsingMs: Date.now() - startTime,
				filteringMs: 0,
				totalMs: 0,
			},
			failures: [],
		};

		// Check session and authentication
		const client = this.session?.getAPIClient() || null;
		diagnostic.authentication.clientConnected = client !== null;
		diagnostic.authentication.isAuthenticated =
			client?.isAuthenticated() ?? false;

		if (this.session) {
			const tenant = this.session.getTenant?.();
			if (tenant) {
				diagnostic.authentication.tenant = tenant;
			}
		}

		// Get namespace
		const sessionNamespace = this.session?.getNamespace?.() || "default";
		diagnostic.namespace.fromSession = sessionNamespace;
		diagnostic.namespace.resolved = sessionNamespace;

		// Check for namespace in flags
		for (let i = 0; i < parsed.args.length; i++) {
			const arg = parsed.args[i];
			if (arg === "--namespace" || arg === "-ns") {
				const nsValue = parsed.args[i + 1];
				if (nsValue) {
					diagnostic.namespace.fromFlag = nsValue;
					diagnostic.namespace.resolved = nsValue;
				}
			}
		}

		// Track failures
		if (!client) {
			diagnostic.failures?.push({
				stage: "initialization",
				message: "No API client available",
				suggestion: "Ensure session is properly initialized",
			});
		}

		if (!diagnostic.authentication.isAuthenticated) {
			diagnostic.failures?.push({
				stage: "authentication",
				message: "Not authenticated",
				suggestion: "Run 'login use profile <name>' to re-authenticate",
			});
		}

		// Try to complete and capture timing
		// Temporarily disable diagnostic mode to avoid infinite recursion
		const wasDiagnosticMode = this.diagnosticMode;
		this.diagnosticMode = false;
		const completeStart = Date.now();
		try {
			diagnostic.suggestions = await this.complete(text);
		} catch (error: unknown) {
			diagnostic.failures?.push({
				stage: "completion",
				message:
					error instanceof Error
						? error.message
						: "Unknown error during completion",
				suggestion: "Check console for detailed error information",
			});
		} finally {
			// Restore diagnostic mode
			this.diagnosticMode = wasDiagnosticMode;
		}

		// Get resource fetcher error if available
		const fetcherError = resourceFetcher.getLastError();
		if (fetcherError.error) {
			diagnostic.apiRequest = {
				endpoint: "unknown",
				method: "GET",
				cacheStatus: "miss",
				error: fetcherError.error,
			};
		}

		// Calculate final timings
		diagnostic.performance.apiCallMs = Date.now() - completeStart;
		diagnostic.performance.totalMs = Date.now() - startTime;

		this.lastDiagnostic = diagnostic;
		return diagnostic;
	}
}

/**
 * Create and configure a completer for the session
 */
export function createCompleter(session?: REPLSession): Completer {
	const completer = new Completer();
	if (session) {
		completer.setSession(session);
	}
	return completer;
}

export default Completer;
