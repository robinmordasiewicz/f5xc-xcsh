/**
 * Domain Overview Helper
 *
 * Provides consistent formatting for domain entry experience.
 * When a user enters a domain (e.g., /ai_services), they see a
 * standardized overview of available commands, examples, and options.
 */

export interface DomainCommand {
	name: string;
	description: string;
}

export interface DomainOverviewConfig {
	/** Domain display name */
	name: string;
	/** Brief description of the domain */
	description: string;
	/** Available commands within the domain */
	commands: DomainCommand[];
	/** Usage examples */
	examples: string[];
	/** Whether domain commands support output format flags */
	supportsOutputFormats?: boolean;
	/** Additional notes or tips */
	notes?: string[];
}

/**
 * Format a domain overview for display when entering a domain context.
 *
 * @example
 * ```typescript
 * const overview = formatDomainOverview({
 *   name: "AI Services",
 *   description: "Query and chat with AI assistant",
 *   commands: [
 *     { name: "query <question>", description: "Ask a single question" },
 *     { name: "chat", description: "Start interactive chat session" },
 *   ],
 *   examples: [
 *     "query 'How do I create an HTTP load balancer?'",
 *     "chat --namespace production",
 *   ],
 *   supportsOutputFormats: true,
 * });
 * ```
 */
export function formatDomainOverview(config: DomainOverviewConfig): string[] {
	const lines: string[] = [];

	// Header
	lines.push("");
	lines.push(`${config.name} - ${config.description}`);
	lines.push("");

	// Commands section
	if (config.commands.length > 0) {
		lines.push("Commands:");
		const maxNameLen = Math.max(
			...config.commands.map((cmd) => cmd.name.length),
		);
		const padding = Math.min(maxNameLen + 2, 20);

		for (const cmd of config.commands) {
			lines.push(`  ${cmd.name.padEnd(padding)} ${cmd.description}`);
		}
		lines.push("");
	}

	// Examples section
	if (config.examples.length > 0) {
		lines.push("Examples:");
		for (const example of config.examples) {
			lines.push(`  ${example}`);
		}
		lines.push("");
	}

	// Output formats
	if (config.supportsOutputFormats) {
		lines.push("Output formats: --output json|yaml|table|tsv|none");
		lines.push("");
	}

	// Additional notes
	if (config.notes && config.notes.length > 0) {
		for (const note of config.notes) {
			lines.push(note);
		}
		lines.push("");
	}

	return lines;
}
