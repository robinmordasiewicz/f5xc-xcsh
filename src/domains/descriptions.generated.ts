/**
 * Generated Description Types
 * Auto-generated from config/custom-domain-descriptions.yaml
 */

export interface DescriptionTiers {
	short: string;
	medium: string;
	long: string;
}

export type CommandDescriptions = DescriptionTiers;

export interface SubcommandDescriptions extends DescriptionTiers {
	commands?: Record<string, CommandDescriptions>;
}

export interface DomainDescriptions extends DescriptionTiers {
	subcommands?: Record<string, SubcommandDescriptions>;
	commands?: Record<string, CommandDescriptions>;
}

export type CliDescriptions = DescriptionTiers;

export interface GeneratedDescriptionsData {
	version: string;
	generatedAt: string;
	cli?: Record<string, CliDescriptions>;
	domains: Record<string, DomainDescriptions>;
}

/**
 * CLI Title from upstream OpenAPI spec (short description)
 * Extracted at build time from .specs/openapi.json info.title
 * This is the single source of truth - no local enrichment
 */
export const CLI_TITLE_FROM_SPEC: string | null = "F5 Distributed Cloud API";

/**
 * CLI Summary from upstream OpenAPI spec (medium description)
 * Extracted at build time from .specs/openapi.json info.summary
 * This is the single source of truth - no local enrichment
 */
export const CLI_SUMMARY_FROM_SPEC: string | null =
	"Multi-cloud application services with load balancing, WAF, DNS, and edge infrastructure. Unified platform for security and connectivity.";

/**
 * CLI Description from upstream OpenAPI spec (long description)
 * Extracted at build time from .specs/openapi.json info.description
 * This is the single source of truth - no local enrichment
 */
export const CLI_DESCRIPTION_FROM_SPEC: string | null =
	"Unified application services across multi-cloud, edge, and hybrid environments. Load balancers with origin pools and health checks for traffic distribution. Web application firewall and bot defense for application protection. DNS zones with geographic routing for name resolution. Cloud sites on AWS, Azure, and GCP for infrastructure deployment. Service policies, network security, and observability dashboards from a single control plane.";

/**
 * Generated Descriptions Data
 * Auto-generated from config/custom-domain-descriptions.yaml
 * Generated at: 2026-01-02T23:47:33.236Z
 *
 * DO NOT EDIT MANUALLY - Regenerate with: npm run generate:descriptions
 */
export const generatedDescriptions: GeneratedDescriptionsData = {
	version: "1.0.0",
	generatedAt: "2026-01-02T23:47:33.236Z",

	domains: {
		login: {
			short: "Configure authentication profiles and connection context",
			medium: "Store named credential profiles for multiple tenants, switch active connection contexts, verify session state, and display environment banners.",
			long: "Manage authentication lifecycle and identity configuration for CLI operations. Define reusable credential sets targeting different tenants without repeated login prompts. Toggle between saved identities to execute commands against distinct environments. Inspect current session details including endpoint URL and token expiration status. Show informational banners reflecting active configuration. Supports environment variable injection for automated pipelines and scripted workflows requiring non-interactive authentication.",
			subcommands: {
				profile: {
					short: "Manage saved authentication credentials for tenants",
					medium: "Store named credential sets for different environments, switch between active connections, and remove outdated entries.",
					long: "Organize authentication credentials across multiple tenants and environments. Create named entries for production, staging, or development contexts containing URLs and tokens. List available configurations, display stored details, designate which connection to use for subsequent commands, and delete obsolete records. Credentials persist locally, eliminating repeated entry when working across different tenants throughout the day.",
				},
				context: {
					short: "Set default namespace for scoped command execution",
					medium: "Configure, display, and switch the active namespace scope. Commands automatically target this namespace when no explicit --namespace flag is provided.",
					long: "Manage persistent namespace selection that determines where CLI operations execute by default. Subcommands include 'show' to reveal the current setting, 'set' to designate a new active namespace, and 'list' to enumerate all available choices. After configuration, subsequent commands operate within the selected namespace without requiring repetitive flag usage. Settings persist across terminal sessions, reducing overhead during extended work within a single namespace. Remove the stored value to restore explicit per-command namespace specification.",
				},
			},
		},
		cloudstatus: {
			short: "Check platform status and active incidents",
			medium: "Query operational health, view active incidents, track scheduled maintenance windows, and verify component availability across deployment regions.",
			long: "Display real-time service health and infrastructure component status. Retrieve incident details including severity levels, affected systems, and resolution progress. List upcoming maintenance windows for service interruption planning. Verify regional component availability before deployments. Access historical incident records for post-mortem analysis and SLA tracking. Output supports both human-readable summaries and JSON format for monitoring integration.",
		},
		completion: {
			short: "Generate tab-completion scripts for supported shells",
			medium: "Create shell-specific scripts enabling tab-assisted input for commands, subcommands, and flags in bash, zsh, or fish environments.",
			long: "Output completion scripts that integrate with native shell mechanisms for context-aware suggestions. Supports bash, zsh, and fish with format-specific output suitable for sourcing directly or saving to configuration files. After installation, pressing Tab auto-suggests partial command names, displays available options, and recommends valid flag values. Select the subcommand matching your environment to generate properly formatted output.",
		},
	},
};

/**
 * Get CLI descriptions
 */
export function getCliDescriptions(
	cliName: string = "xcsh",
): CliDescriptions | undefined {
	return generatedDescriptions.cli?.[cliName];
}

/**
 * Get descriptions for a domain
 */
export function getDomainDescriptions(
	domainName: string,
): DomainDescriptions | undefined {
	return generatedDescriptions.domains[domainName];
}

/**
 * Get descriptions for a subcommand within a domain
 */
export function getSubcommandDescriptions(
	domainName: string,
	subcommandName: string,
): SubcommandDescriptions | undefined {
	const domain = generatedDescriptions.domains[domainName];
	return domain?.subcommands?.[subcommandName];
}

/**
 * Get descriptions for a command within a domain or subcommand
 */
export function getCommandDescriptions(
	domainName: string,
	commandName: string,
	subcommandName?: string,
): CommandDescriptions | undefined {
	const domain = generatedDescriptions.domains[domainName];
	if (!domain) return undefined;

	if (subcommandName) {
		const subcommand = domain.subcommands?.[subcommandName];
		return subcommand?.commands?.[commandName];
	}

	return domain.commands?.[commandName];
}
