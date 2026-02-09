/**
 * Completer - Tab completion engine for the REPL
 * Provides context-aware suggestions for domains, actions, flags, and built-in commands
 */

import type {
  CompletionSuggestion,
  ParsedInput,
  CompletionResult,
  ResourceQuotaInfo,
} from "./types.js";
import type { REPLSession } from "../session.js";
import { customDomains, isCustomDomain } from "../../domains/index.js";
import { extensionRegistry } from "../../extensions/index.js";
import { CompletionCache } from "./cache.js";
import {
  completionRegistry,
  getActionDescriptions,
} from "../../completion/index.js";
import { ALL_OUTPUT_FORMATS, OUTPUT_FORMAT_HELP } from "../../output/types.js";
import {
  getDomainInfo,
  type ResourceCategory,
  type ResourceMetadata,
} from "../../types/domains.js";
import { resourceFetcher } from "./resource-fetcher.js";
import { loadSettingsSync, type AppSettings } from "../../config/settings.js";
import {
  extractUsedFlags,
  filterUsedFlags,
  countFlagUsage,
  parseCreationFlagValues,
  formatDefaultValue,
} from "./flag-utils.js";
import {
  getCreationFlags,
  hasCreationFlags,
  getConflictsForFlag,
} from "./creation-flags.js";

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
const RESOURCE_ACTIONS = new Set([
  "list",
  "get",
  "create",
  "delete",
  "replace",
  "apply",
  "status",
  "patch",
  "add-labels",
  "remove-labels",
  "help",
]);

/**
 * Actions that create new resources (show creation flags instead of existing resource names)
 */
const CREATION_ACTIONS = new Set(["create", "apply"]);

/**
 * Generic descriptions indicating utility endpoints, not user-manageable resources.
 * Resources with these descriptions are typically auto-generated from x-f5xc-operation-metadata.purpose
 * and represent internal/utility endpoints rather than CRUD-manageable resources.
 */
const GENERIC_RESOURCE_DESCRIPTIONS = new Set([
  "Resource retrieval operation",
  "Resource creation operation",
  "Resource update operation",
  "Resource deletion operation",
]);

/**
 * Resource categories to exclude from standard completion.
 * These represent internal/utility endpoints that shouldn't clutter the completion list.
 */
const EXCLUDED_RESOURCE_CATEGORIES = new Set<ResourceCategory>([
  "analytics",
  "utility",
  "management",
]);

/**
 * Check if a resource should appear in standard completion mode.
 * Filters out utility endpoints and resources with generic descriptions.
 *
 * @param resource - The resource metadata to check
 * @returns true if the resource should be shown in standard completion
 */
function isResourceCompletionAppropriate(resource: ResourceMetadata): boolean {
  // Primary resources always shown
  if (resource.isPrimary) {
    return true;
  }

  // Exclude non-CRUD categories
  if (
    resource.resourceCategory &&
    EXCLUDED_RESOURCE_CATEGORIES.has(resource.resourceCategory)
  ) {
    return false;
  }

  // Exclude generic descriptions
  const desc = resource.descriptionShort || resource.description || "";
  if (GENERIC_RESOURCE_DESCRIPTIONS.has(desc)) {
    return false;
  }

  // Exclude self-referential descriptions (name as description)
  // e.g., resource "stat" with description "stat" or "Stat"
  if (desc.toLowerCase() === resource.name.toLowerCase().replace(/_/g, " ")) {
    return false;
  }

  return true;
}

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
    "--output",
    "--name",
    "--limit",
    "--label",
    // Creation flags for healthcheck
    "--type",
    "--interval",
    "--timeout",
    "--healthy-threshold",
    "--unhealthy-threshold",
    "--path",
    "--expected-status",
    "--host-header",
    // Creation flags for origin_pool
    "--port",
    "--public-ip",
    "--public-name",
    "--private-ip",
    "--private-name",
    "--k8s-service",
    "--consul-service",
    "--custom-endpoint",
    "--vn-private-ip",
    "--vn-private-name",
    "--cbip-service",
    "--algorithm",
    "--health-check",
    "--site",
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
      (cliCompletionMode === "all" ||
        cliCompletionMode === "primary" ||
        cliCompletionMode === "standard")
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
    // Also filter out flags that have already been used in the command
    if (parsed.isCompletingFlag) {
      // For creation actions with creation flags, use those instead of generic flags
      if (
        resourceCtx.resourceType &&
        resourceCtx.action &&
        CREATION_ACTIONS.has(resourceCtx.action) &&
        hasCreationFlags(resourceCtx.resourceType)
      ) {
        const creationSuggestions = this.getCreationFlagSuggestions(
          resourceCtx.resourceType,
          parsed.args,
        );
        return this.filterSuggestions(creationSuggestions, parsed.currentWord);
      }
      return this.getAvailableFlagCompletions(
        parsed.currentWord,
        resourceCtx.action ?? undefined,
        parsed.args,
      );
    }

    // If we have a resource type, branch based on action type
    if (resourceCtx.resourceType) {
      // For creation actions (create, apply), show creation flags if defined
      // instead of existing resource names
      if (
        resourceCtx.action &&
        CREATION_ACTIONS.has(resourceCtx.action) &&
        hasCreationFlags(resourceCtx.resourceType)
      ) {
        return this.getCreationFlagSuggestions(
          resourceCtx.resourceType,
          parsed.args,
        );
      }

      // For existing resource actions (get, delete, list, etc.), show resource names from API
      const resourceNames = await this.getResourceNameSuggestions(
        resourceCtx.resourceType,
        resourceCtx.resourceNamePartial,
      );
      if (resourceNames.length > 0) {
        return resourceNames;
      }
      // Resource type is specified but no resources exist - show flags only, not actions
      // Filter out already-used flags
      const allFlags = this.getActionFlagSuggestions(
        resourceCtx.action ?? undefined,
      );
      const usedFlags = extractUsedFlags(parsed.args);
      return filterUsedFlags(allFlags, usedFlags);
    }

    // If in domain context with an action that supports resources, show resource types
    // CRITICAL: This block MUST return when conditions are met to prevent fall-through
    // to domain-level suggestions (the recurring regression bug)
    if (
      resourceCtx.domain &&
      resourceCtx.action &&
      RESOURCE_ACTIONS.has(resourceCtx.action) &&
      !resourceCtx.resourceType
    ) {
      // Special handling for "help" action - suggest resource types, not instances
      if (resourceCtx.action === "help") {
        const domainInfo = getDomainInfo(resourceCtx.domain);
        const suggestions: CompletionSuggestion[] = [];

        if (domainInfo?.primaryResources) {
          for (const resource of domainInfo.primaryResources) {
            suggestions.push({
              text: resource.name,
              description: resource.descriptionShort || resource.description,
              category: "resource",
            });
          }
        }

        return suggestions;
      }

      const resourceTypes = await this.getResourceTypeSuggestionsWithQuota(
        resourceCtx.domain,
        this.session?.getNamespace() ?? null,
        this.session?.getAPIClient() ?? null,
      );
      if (resourceTypes.length > 0) {
        let suggestions = resourceTypes;

        // If typing a word that's not a flag and not the action itself, filter
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
            suggestions = filtered;
          }
          // If filtered is empty, keep all resource types as fallback
          // (user may be typing something that doesn't match yet)
        }

        // ALWAYS return resource types + flags when in resource action context
        // This prevents fall-through to domain-level suggestions
        // Filter out already-used flags
        const actionFlags = this.getActionFlagSuggestions(resourceCtx.action);
        const usedFlagsInContext = extractUsedFlags(parsed.args);
        const availableActionFlags = filterUsedFlags(
          actionFlags,
          usedFlagsInContext,
        );
        return [...suggestions, ...availableActionFlags];
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
              RESOURCE_ACTIONS.has(parsed.args[1]?.toLowerCase() ?? "");
            if (!hasAction) {
              // No action yet - show actions
              suggestions = this.getActionSuggestions();
            } else {
              // Action already typed - resource context logic above should have
              // handled showing resource types. If we got here, show flags.
              // Filter out already-used flags
              const flagsForAction = this.getActionFlagSuggestions(
                parsed.args[1]?.toLowerCase(),
              );
              const usedFlagsHere = extractUsedFlags(parsed.args);
              suggestions = filterUsedFlags(flagsForAction, usedFlagsHere);
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
   * Get suggestions with metadata (including resource quota info)
   * Use this when you need quota info for the status line
   */
  async completeWithMeta(text: string): Promise<CompletionResult> {
    const trimmed = text.trimStart();
    const parsed = parseInput(trimmed);
    const resourceCtx = this.parseResourceContext(parsed);

    // Get the suggestions
    const suggestions = await this.complete(text);

    // Check if we're showing creation flags for a resource type
    let resourceQuotaInfo: ResourceQuotaInfo | undefined;

    if (
      resourceCtx.resourceType &&
      resourceCtx.action &&
      CREATION_ACTIONS.has(resourceCtx.action) &&
      hasCreationFlags(resourceCtx.resourceType) &&
      this.session
    ) {
      // Fetch quota info for this resource type
      try {
        const { getQuotaForResourceType } = await import("./quota-helper.js");
        const { getQuotaMapping } = await import("../../quota/mapping.js");

        const namespace = this.session.getNamespace();
        const client = this.session.getAPIClient();
        const mapping = getQuotaMapping(resourceCtx.resourceType);

        if (namespace && client && mapping) {
          const quotaInfo = await getQuotaForResourceType(
            client,
            namespace,
            resourceCtx.resourceType,
          );

          if (quotaInfo) {
            resourceQuotaInfo = {
              resourceType: resourceCtx.resourceType,
              displayName: mapping.displayName,
              current: quotaInfo.current,
              limit: quotaInfo.limit,
              level: quotaInfo.level,
            };
          }
        }
      } catch {
        // Fail silently - quota info is optional
      }
    }

    const result: CompletionResult = {
      suggestions,
    };
    if (resourceQuotaInfo) {
      result.resourceQuotaInfo = resourceQuotaInfo;
    }
    return result;
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
      return completionRegistry.getChildSuggestions(domainName, currentWord);
    }

    // Check for subcommand groups (action groups)
    const subgroupName = args[0]?.toLowerCase() ?? "";
    const subgroupNode = domainNode.children?.get(subgroupName);

    // If we have exactly one arg and it matches currentWord, user is still typing
    // Show the action/subcommand as a completion suggestion
    if (args.length === 1 && currentWord === args[0]) {
      return completionRegistry.getChildSuggestions(domainName, currentWord);
    }

    // First arg is a subcommand group - check for nested children

    if (subgroupNode?.children) {
      // Check if args[1] is a complete, valid command name
      const cmdName = args[1]?.toLowerCase() ?? "";
      const domain = customDomains.get(domainName);
      let cmd = domain?.actions?.get(subgroupName)?.resources.get(cmdName);

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
        suggestions.push(...this.getExtensionCommandSuggestions(ctx.domain));
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
    return Object.entries(actionDescriptions).map(([action, description]) => ({
      text: action,
      description,
      category: "action" as const,
    }));
  }

  /**
   * Get resource type suggestions for a domain
   * Phase 1 Enhancement: Uses allResources (dynamically discovered) by default
   * Falls back to primaryResources if allResources not available
   * Respects user configuration setting for completion mode:
   * - "primary": Only curated primary resources
   * - "standard": Primary + CRUD resources with meaningful descriptions (default)
   * - "all": Everything discovered from OpenAPI
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
    } else if (this.settings.completionMode === "standard") {
      // Default: "standard" mode - filter to appropriate resources
      const allResources =
        domainInfo.allResources || domainInfo.primaryResources;
      resources = allResources?.filter(isResourceCompletionAppropriate);

      // Fallback to primary if filtering removed everything
      if (!resources || resources.length === 0) {
        resources = domainInfo.primaryResources;
      }
    } else {
      // "all" mode - use allResources (discovered from OpenAPI) unfiltered
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
      // Mark primary resources (only in "all" mode) - styling handled by Suggestions component
      const isPrimary =
        (this.settings.completionMode === "all" && resource.isPrimary) || false;

      const description =
        resource.descriptionShort || resource.description || "";

      return {
        text: resource.name,
        description,
        category: "resource" as const,
        isPrimary,
      };
    });
  }

  /**
   * Get resource type suggestions with quota information
   *
   * Enhanced version of getResourceTypeSuggestions that includes quota usage
   * data for resources that have quota mappings. Quota info is displayed
   * right-justified with color coding:
   * - White: Normal usage (< 90%)
   * - Yellow: Warning (90-99%)
   * - Red: At quota limit (100%)
   *
   * @param domain - The domain to get resource types for
   * @param namespace - The namespace to get quota for
   * @param client - The API client for quota lookups
   * @returns Promise of completion suggestions with quota info
   */
  async getResourceTypeSuggestionsWithQuota(
    domain: string,
    namespace: string | null,
    client: import("../../api/client.js").APIClient | null,
  ): Promise<CompletionSuggestion[]> {
    // Get base suggestions (existing logic)
    const baseSuggestions = this.getResourceTypeSuggestions(domain);

    // If no client or namespace, return without quota
    if (!client || !namespace) {
      return baseSuggestions;
    }

    try {
      const { getQuotasForResourceTypes } = await import("./quota-helper.js");
      const resourceTypes = baseSuggestions.map((s) => s.text);
      const quotas = await getQuotasForResourceTypes(
        client,
        namespace,
        resourceTypes,
      );

      return baseSuggestions.map((suggestion) => {
        const quota = quotas.get(suggestion.text);
        if (!quota) return suggestion;

        return {
          ...suggestion,
          quotaLevel: quota.level,
          quotaInfo: quota.display,
        };
      });
    } catch {
      return baseSuggestions; // Graceful degradation
    }
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
      { text: "--namespace", description: "Namespace", category: "flag" },
      {
        text: "--output",
        description: `Output format (${OUTPUT_FORMAT_HELP})`,
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
   * Priority-aware sorting function for flag suggestions.
   *
   * Sorts by priority (lower number = higher priority), then alphabetically.
   * This creates logical flag ordering: --name → --type → type-specific → required → optional → global
   *
   * @param a - First suggestion
   * @param b - Second suggestion
   * @returns -1 if a comes first, 1 if b comes first, 0 if equal
   *
   * Priority defaults applied before sorting:
   * - --name (priority 1) and --type (priority 2) explicitly set
   * - Type-specific flags (priority 5) - HTTP/TCP/DNS specific options
   * - Required flags without priority default to 10
   * - Optional flags without priority default to 50
   * - Global flags without priority default to 100
   *
   * @example
   * prioritySort(
   *   { text: "--name", priority: 1 },
   *   { text: "--type", priority: 2 }
   * ) // Returns -1 (--name comes first)
   *
   * @example
   * // Equal priority: alphabetical order
   * prioritySort(
   *   { text: "--zebra", priority: 10 },
   *   { text: "--alpha", priority: 10 }
   * ) // Returns 1 (--alpha comes first alphabetically)
   */
  private prioritySort = (
    a: CompletionSuggestion,
    b: CompletionSuggestion,
  ): number => {
    // Get priority values (should already have defaults applied)
    const aPriority = a.priority ?? 999; // Fallback for safety
    const bPriority = b.priority ?? 999;

    // If priorities differ, lower priority comes first
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Same priority: fall back to alphabetical order
    return a.text.localeCompare(b.text);
  };

  /**
   * Apply default priorities based on flag group
   */
  private applyDefaultPriority = (
    suggestion: CompletionSuggestion,
    group: "required" | "optional" | "global",
  ): CompletionSuggestion => {
    if (suggestion.priority !== undefined) {
      return suggestion; // Already has priority
    }

    const defaults = {
      required: 10,
      optional: 50,
      global: 100,
    };

    return { ...suggestion, priority: defaults[group] };
  };

  /**
   * Get creation flag suggestions for a resource type
   * Shows flags needed to create a new resource (--name, --type, etc.)
   * instead of existing resource names
   *
   * Handles repeatable flags (e.g., --public-ip can be specified multiple times)
   * by checking maxOccurrences instead of simply filtering out used flags.
   *
   * Phase 2 Enhancement: Sorts suggestions with required flags first,
   * contextual flags next, and global flags last.
   *
   * Sorting order:
   * 1. Required flags (alphabetically)
   * 2. Optional contextual flags (alphabetically) - includes --file and resource-specific flags
   * 3. Global flags (alphabetically) - --namespace, --output, -o, -ns
   *
   * @param resourceType - The resource type being created
   * @param args - Current command arguments to filter out used flags
   * @returns Array of flag suggestions for resource creation, sorted by importance
   */
  getCreationFlagSuggestions(
    resourceType: string,
    args: string[],
  ): CompletionSuggestion[] {
    const creationFlags = getCreationFlags(resourceType);
    const usedFlags = extractUsedFlags(args);
    const flagUsageCounts = countFlagUsage(args);

    // Parse flag values for conditional filtering
    const flagValues = parseCreationFlagValues(args);

    // Get current --type value
    const currentType = flagValues.get("--type");

    // Track three groups for sorting: required, optional contextual, global
    const requiredFlagSuggestions: CompletionSuggestion[] = [];
    const optionalContextualSuggestions: CompletionSuggestion[] = [];
    const globalFlagSuggestions: CompletionSuggestion[] = [];

    // Add resource-specific creation flags
    for (const flag of creationFlags) {
      // === TYPE-BASED CONDITIONS (existing logic) ===
      // Check conditional applicability based on --type flag
      if (flag.applicableTypes && flag.applicableTypes.length > 0) {
        // This flag only applies to specific types

        if (!currentType) {
          // --type not yet specified - SKIP type-specific flags
          continue;
        }

        if (!flag.applicableTypes.includes(currentType)) {
          // Current --type doesn't match - SKIP this flag
          continue;
        }
      }

      // === VALUE-BASED CONDITIONS (new logic for hierarchical flags) ===
      // Check conditional visibility based on parent flag value
      if (flag.conditionalOn) {
        const parentFlagValue = flagValues.get(flag.conditionalOn.flagName);

        if (!parentFlagValue) {
          // Parent flag not specified - SKIP child flags
          continue;
        }

        if (!flag.conditionalOn.values.includes(parentFlagValue)) {
          // Parent flag value doesn't match required values - SKIP child flag
          continue;
        }
      }

      // === CONFLICT-BASED CONDITIONS (spec-driven from x-f5xc-conflicts-with) ===
      // Check if this flag conflicts with any already-used flags
      const conflicts = getConflictsForFlag(flag.name, resourceType);
      if (conflicts.length > 0) {
        const hasConflict = conflicts.some((cf) => usedFlags.has(cf));
        if (hasConflict) {
          // A conflicting flag is already used - SKIP this flag
          continue;
        }
      }

      // Handle repeatable flags: check if max occurrences reached
      if (flag.isRepeatable) {
        const count = flagUsageCounts.get(flag.name) || 0;
        const max = flag.maxOccurrences || Infinity;
        if (count >= max) continue; // Skip if maxed out

        // Repeatable flags should still be shown even if used before
        // Format suffix with max occurrences info if available
        const repeatableSuffix = flag.maxOccurrences
          ? ` (repeatable, max ${flag.maxOccurrences})`
          : " (repeatable)";
        let desc = flag.description + repeatableSuffix;

        // Prefer recommendedValue over defaultValue when both exist
        const displayValue = flag.recommendedValue ?? flag.defaultValue;
        if (displayValue !== undefined) {
          const formattedDefault = formatDefaultValue(displayValue);
          if (formattedDefault !== null) {
            desc += ` [default: ${formattedDefault}]`;
          }
        }
        optionalContextualSuggestions.push({
          text: flag.name,
          description: desc,
          category: "flag",
          ...(flag.priority !== undefined && {
            priority: flag.priority,
          }),
        });
      } else {
        // Non-repeatable: skip if already used
        if (usedFlags.has(flag.name)) continue;

        if (flag.required) {
          // Required flag not yet provided - show with "(required)" marker
          requiredFlagSuggestions.push({
            text: flag.name,
            description: flag.description + " (required)",
            category: "flag",
            ...(flag.priority !== undefined && {
              priority: flag.priority,
            }),
          });
        } else {
          // Optional flag - add default hint if present
          // Prefer recommendedValue over defaultValue when both exist
          let desc = flag.description;
          const displayValue = flag.recommendedValue ?? flag.defaultValue;
          if (displayValue !== undefined) {
            const formattedDefault = formatDefaultValue(displayValue);
            if (formattedDefault !== null) {
              desc += ` (default: ${formattedDefault})`;
            }
          }
          optionalContextualSuggestions.push({
            text: flag.name,
            description: desc,
            category: "flag",
            ...(flag.priority !== undefined && {
              priority: flag.priority,
            }),
          });
        }
      }
    }

    // Add global flags (--namespace, --output) - these go last
    const globalFlags = this.getGlobalFlagSuggestions();
    for (const flag of globalFlags) {
      if (!usedFlags.has(flag.text)) {
        globalFlagSuggestions.push(flag);
      }
    }

    // Apply default priorities to all suggestions
    const withPriorities = [
      ...requiredFlagSuggestions.map((s) =>
        this.applyDefaultPriority(s, "required"),
      ),
      ...optionalContextualSuggestions.map((s) =>
        this.applyDefaultPriority(s, "optional"),
      ),
      ...globalFlagSuggestions.map((s) =>
        this.applyDefaultPriority(s, "global"),
      ),
    ];

    // Sort all suggestions globally by priority
    // This allows type-specific flags (priority 5) to appear before required flags (priority 10)
    withPriorities.sort(this.prioritySort);

    return withPriorities;
  }

  /**
   * Get global flag suggestions that apply to all commands
   * These are shown last in completion to prioritize contextual flags
   */
  getGlobalFlagSuggestions(): CompletionSuggestion[] {
    // Get namespace from session (profile default or "default")
    const namespace = this.session?.getNamespace() ?? "default";
    return [
      {
        text: "--namespace",
        description: `Namespace (default: ${namespace})`,
        category: "flag",
      },
      {
        text: "--output",
        description: `Output format (${OUTPUT_FORMAT_HELP})`,
        category: "flag",
      },
    ];
  }

  /**
   * Get flag completions filtered by prefix
   * @param prefix - The prefix to filter by
   * @param action - Optional action for action-specific flags
   */
  getFlagCompletions(prefix: string, action?: string): CompletionSuggestion[] {
    const allFlags = this.getActionFlagSuggestions(action);
    return this.filterSuggestions(allFlags, prefix);
  }

  /**
   * Get available flag completions excluding already-used flags
   * @param prefix - The prefix to filter by
   * @param action - Optional action for action-specific flags
   * @param args - Current command arguments to check for used flags
   */
  getAvailableFlagCompletions(
    prefix: string,
    action?: string,
    args: string[] = [],
  ): CompletionSuggestion[] {
    const allFlags = this.getActionFlagSuggestions(action);
    const usedFlags = extractUsedFlags(args);
    const availableFlags = filterUsedFlags(allFlags, usedFlags);
    return this.filterSuggestions(availableFlags, prefix);
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
        return ALL_OUTPUT_FORMATS.map((fmt) => ({
          text: fmt,
          description: `${fmt.toUpperCase()} format`,
          category: "value" as const,
        })).filter((s) => s.text.toLowerCase().startsWith(lowerPartial));

      case "--namespace":
        return this.completeNamespace(valuePartial);

      case "--name": {
        // Resource name completion - use command context for resource type
        if (!this.session) {
          return [];
        }

        // Get resource type from command args (e.g., "get http_loadbalancer" → "http_loadbalancer")
        const resourceCtx = this.parseResourceContext(parsed);
        const navCtx = this.session.getContextPath();

        // Prefer resource type from command, fall back to navigation domain
        const resourceType = resourceCtx.resourceType || navCtx.domain || null;

        // Get namespace from --namespace flag in args, or session default
        const nsFromFlag = this.extractFlagValue(parsed.args, ["--namespace"]);
        const namespace = nsFromFlag || this.session.getNamespace();

        if (!resourceType || !namespace) {
          return [];
        }

        // Check if this is a create/apply action
        const action = resourceCtx.action;
        if (action && CREATION_ACTIONS.has(action)) {
          // For CREATE/APPLY: Show existing names as context, prompt for unique name
          const existingNames = await this.completeResourceName(
            resourceType,
            resourceType,
            "", // Fetch all names, not filtered by partial
            namespace,
          );

          if (existingNames.length === 0) {
            // No existing resources - any name is valid
            return [
              {
                text: "",
                description: "Enter a name for the new resource",
                category: "context" as const,
              },
            ];
          }

          // Show header + each existing name as a separate context item
          const contextItems: CompletionSuggestion[] = [
            {
              text: "",
              description: "Enter a unique name (names already taken):",
              category: "context" as const,
            },
            ...existingNames.map((n) => ({
              text: "",
              description: `  • ${n.text}`,
              category: "context" as const,
            })),
          ];

          return contextItems;
        }

        // For GET/DELETE/LIST: Show existing resource names as selectable
        return this.completeResourceName(
          resourceType, // Will be pluralized for API path (e.g., 'http_loadbalancer' → 'http_loadbalancers')
          resourceType,
          valuePartial,
          namespace,
        );
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

      // Creation flag value completions for healthcheck
      case "--type":
        return [
          {
            text: "http",
            description: "HTTP health check",
            category: "value" as const,
          },
          {
            text: "tcp",
            description: "TCP health check",
            category: "value" as const,
          },
          {
            text: "udp-icmp",
            description: "UDP ICMP health check",
            category: "value" as const,
          },
        ].filter((s) => s.text.startsWith(lowerPartial));

      case "--interval":
      case "--timeout":
        return [
          {
            text: "5",
            description: "5 seconds",
            category: "value" as const,
          },
          {
            text: "10",
            description: "10 seconds",
            category: "value" as const,
          },
          {
            text: "30",
            description: "30 seconds",
            category: "value" as const,
          },
          {
            text: "60",
            description: "1 minute",
            category: "value" as const,
          },
        ].filter((s) => s.text.startsWith(valuePartial));

      case "--healthy-threshold":
      case "--unhealthy-threshold":
        return [
          {
            text: "2",
            description: "2 checks",
            category: "value" as const,
          },
          {
            text: "3",
            description: "3 checks",
            category: "value" as const,
          },
          {
            text: "5",
            description: "5 checks",
            category: "value" as const,
          },
        ].filter((s) => s.text.startsWith(valuePartial));

      case "--path":
        return [
          {
            text: "/health",
            description: "Common health endpoint",
            category: "value" as const,
          },
          {
            text: "/healthz",
            description: "Kubernetes-style",
            category: "value" as const,
          },
          {
            text: "/ready",
            description: "Readiness endpoint",
            category: "value" as const,
          },
          {
            text: "/",
            description: "Root path",
            category: "value" as const,
          },
        ].filter((s) => s.text.toLowerCase().startsWith(lowerPartial));

      // Origin pool flag value completions
      case "--algorithm":
        return [
          {
            text: "ROUND_ROBIN",
            description: "Round robin distribution",
            category: "value" as const,
          },
          {
            text: "LEAST_REQUEST",
            description: "Least request algorithm",
            category: "value" as const,
          },
          {
            text: "RANDOM",
            description: "Random selection",
            category: "value" as const,
          },
          {
            text: "SOURCE_IP_STICKINESS",
            description: "Sticky by source IP",
            category: "value" as const,
          },
          {
            text: "COOKIE_STICKINESS",
            description: "Sticky by cookie",
            category: "value" as const,
          },
          {
            text: "RING_HASH",
            description: "Consistent ring hash",
            category: "value" as const,
          },
        ].filter((s) => s.text.toLowerCase().startsWith(lowerPartial));

      case "--port":
        return [
          {
            text: "80",
            description: "HTTP port",
            category: "value" as const,
          },
          {
            text: "443",
            description: "HTTPS port",
            category: "value" as const,
          },
          {
            text: "8080",
            description: "Alt HTTP port",
            category: "value" as const,
          },
          {
            text: "8443",
            description: "Alt HTTPS port",
            category: "value" as const,
          },
        ].filter((s) => s.text.startsWith(valuePartial));

      case "--health-check":
        // Complete health check references from existing healthchecks
        return this.getResourceNameSuggestions("healthcheck", valuePartial);

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
      .filter((name) => name.toLowerCase().startsWith(partial.toLowerCase()))
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
      if (arg === "--namespace") {
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
