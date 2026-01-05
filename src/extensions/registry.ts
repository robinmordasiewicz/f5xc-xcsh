/**
 * Extension Registry
 *
 * Manages domain extensions and provides merged views combining
 * upstream API domains with xcsh-specific functionality.
 *
 * Design philosophy:
 * - Upstream First: API domains are authoritative
 * - Extensions complement, don't compete
 * - Unique command names only (no conflicts with API actions)
 */

import type { DomainExtension, MergedDomain } from "./types.js";
import { validateExtension } from "./types.js";
import type {
	CommandDefinition,
	SubcommandGroup,
} from "../domains/registry.js";
import { domainRegistry, type DomainInfo } from "../types/domains.js";

/**
 * Registry for domain extensions
 *
 * Extensions augment generated API domains with xcsh-specific commands.
 * The registry handles:
 * - Extension registration with validation
 * - Merging extensions with generated domains
 * - Providing unified domain views for REPL execution
 */
export class ExtensionRegistry {
	private extensions: Map<string, DomainExtension> = new Map();
	private mergedCache: Map<string, MergedDomain> = new Map();

	/**
	 * Register a domain extension
	 *
	 * @param extension - Extension definition to register
	 * @throws Error if extension has command name conflicts with API actions
	 */
	register(extension: DomainExtension): void {
		// Validate no conflicts with reserved API actions
		validateExtension(extension);

		// Store extension by target domain (canonical name)
		this.extensions.set(extension.targetDomain, extension);

		// Invalidate merged cache for this domain
		this.mergedCache.delete(extension.targetDomain);
	}

	/**
	 * Get extension for a domain
	 *
	 * @param domain - Canonical domain name
	 * @returns Extension if registered, undefined otherwise
	 */
	getExtension(domain: string): DomainExtension | undefined {
		return this.extensions.get(domain);
	}

	/**
	 * Check if a domain has an extension
	 */
	hasExtension(domain: string): boolean {
		return this.extensions.has(domain);
	}

	/**
	 * Get merged domain view combining API domain + extension
	 *
	 * Resolution priority:
	 * 1. Check if canonical domain exists in generated domains
	 * 2. Check if extension exists for this domain
	 * 3. Merge if both exist, or return standalone if only one
	 *
	 * @param domain - Canonical domain name or alias
	 * @returns Merged domain view or undefined if neither exists
	 */
	getMergedDomain(domain: string): MergedDomain | undefined {
		// Use domain directly (aliases removed in v2.0.4)
		const canonical = domain;

		// Check cache first
		const cached = this.mergedCache.get(canonical);
		if (cached) {
			return cached;
		}

		// Get generated domain info (from upstream specs)
		const domainInfo = domainRegistry.get(canonical);

		// Get extension for this domain
		const extension = this.extensions.get(canonical);

		// If neither exists, domain is not valid
		if (!domainInfo && !extension) {
			return undefined;
		}

		// Build merged domain
		const merged = this.buildMergedDomain(canonical, domainInfo, extension);

		// Cache the result
		this.mergedCache.set(canonical, merged);

		return merged;
	}

	/**
	 * Build a merged domain from API domain info and/or extension
	 */
	private buildMergedDomain(
		name: string,
		domainInfo: DomainInfo | undefined,
		extension: DomainExtension | undefined,
	): MergedDomain {
		const hasGeneratedDomain = !!domainInfo;
		const hasExtension = !!extension;

		// Determine source type
		let source: "generated" | "extension" | "merged";
		if (hasGeneratedDomain && hasExtension) {
			source = "merged";
		} else if (hasGeneratedDomain) {
			source = "generated";
		} else {
			source = "extension";
		}

		// Build display name and description
		// Prefer upstream values, fall back to extension if standalone
		const displayName =
			domainInfo?.displayName ??
			this.toDisplayName(extension?.targetDomain ?? name);
		const description =
			domainInfo?.description ??
			extension?.description ??
			`Commands for ${displayName}`;

		const merged: MergedDomain = {
			name,
			displayName,
			description,
			source,
			hasGeneratedDomain,
			hasExtension,
			extensionCommands: extension?.commands ?? new Map(),
			extensionSubcommands: extension?.subcommands ?? new Map(),
		};

		// Only set metadata if domain info exists
		if (domainInfo) {
			merged.metadata = domainInfo;
		}

		return merged;
	}

	/**
	 * Convert snake_case domain name to display name
	 */
	private toDisplayName(name: string): string {
		return name
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	/**
	 * Get all domains with extensions (for iteration)
	 */
	getExtendedDomains(): string[] {
		return Array.from(this.extensions.keys());
	}

	/**
	 * Get all merged domains (generated + extended)
	 *
	 * Returns domains that either:
	 * - Have generated API commands (from upstream)
	 * - Have extension commands (xcsh-specific)
	 * - Have both (merged)
	 */
	getAllMergedDomains(): MergedDomain[] {
		const domains = new Set<string>();

		// Add all generated domains
		for (const name of domainRegistry.keys()) {
			domains.add(name);
		}

		// Add all extended domains (including standalone extensions)
		for (const name of this.extensions.keys()) {
			domains.add(name);
		}

		// Build merged views for all
		const merged: MergedDomain[] = [];
		for (const name of domains) {
			const domain = this.getMergedDomain(name);
			if (domain) {
				merged.push(domain);
			}
		}

		return merged.sort((a, b) => a.name.localeCompare(b.name));
	}

	/**
	 * Get extension command by name
	 *
	 * @param domain - Canonical domain name
	 * @param command - Command name
	 * @returns Command definition if found
	 */
	getExtensionCommand(
		domain: string,
		command: string,
	): CommandDefinition | undefined {
		const extension = this.getExtension(domain);
		if (!extension) {
			return undefined;
		}

		// Check direct command match
		const cmd = extension.commands.get(command);
		if (cmd) {
			return cmd;
		}

		// Check command aliases
		for (const [, cmdDef] of extension.commands) {
			if (cmdDef.aliases?.includes(command)) {
				return cmdDef;
			}
		}

		return undefined;
	}

	/**
	 * Get extension subcommand group
	 *
	 * @param domain - Canonical domain name
	 * @param subcommand - Subcommand group name
	 * @returns Subcommand group if found
	 */
	getExtensionSubcommand(
		domain: string,
		subcommand: string,
	): SubcommandGroup | undefined {
		const extension = this.getExtension(domain);
		return extension?.subcommands?.get(subcommand);
	}

	/**
	 * Check if a command exists in extension
	 */
	hasExtensionCommand(domain: string, command: string): boolean {
		return this.getExtensionCommand(domain, command) !== undefined;
	}

	/**
	 * Get all extension command names for a domain
	 * Used for tab completion
	 */
	getExtensionCommandNames(domain: string): string[] {
		const extension = this.getExtension(domain);
		if (!extension) {
			return [];
		}

		const names: string[] = [];
		for (const [name, cmd] of extension.commands) {
			names.push(name);
			if (cmd.aliases) {
				names.push(...cmd.aliases);
			}
		}

		return names;
	}

	/**
	 * Clear the merged domain cache
	 * Call this if generated domains change
	 */
	clearCache(): void {
		this.mergedCache.clear();
	}

	/**
	 * Get registry statistics
	 */
	getStats(): {
		extensionCount: number;
		standaloneCount: number;
		mergedCount: number;
	} {
		let standaloneCount = 0;
		let mergedCount = 0;

		for (const [domain] of this.extensions) {
			if (domainRegistry.has(domain)) {
				mergedCount++;
			} else {
				standaloneCount++;
			}
		}

		return {
			extensionCount: this.extensions.size,
			standaloneCount,
			mergedCount,
		};
	}
}

/**
 * Global extension registry singleton
 */
export const extensionRegistry = new ExtensionRegistry();
