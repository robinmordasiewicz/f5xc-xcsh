/**
 * Command Specification Generator
 * Generates AI-friendly JSON schema output for --spec flag
 */

import type {
	AIAssistantGuide,
	CommandSpec,
	ExampleSpec,
	FlagSpec,
	ResourceSpec,
} from "./types.js";
import { ALL_OUTPUT_FORMATS } from "./types.js";
import { CLI_VERSION } from "../branding/index.js";
import { EXIT_CODE_HELP } from "../cloudstatus/types.js";
import { customDomains } from "../domains/registry.js";
import { domainRegistry, validActions } from "../types/domains.js";
import {
	extractFieldSpecs,
	extractOneOfGroups,
	loadOpenApiSpec,
} from "./schema-extractor.js";
import { buildResourceSpec } from "./resource-spec-builder.js";
import { buildAIAssistantGuide } from "./ai-guide-builder.js";

/**
 * Full CLI specification for documentation generation
 * Matches the format expected by scripts/generate-docs.py
 */
export interface CLISpec {
	version: string;
	global_flags: GlobalFlagSpec[];
	commands: CLICommandSpec[];
}

/**
 * Global flag specification for CLI documentation
 */
export interface GlobalFlagSpec {
	name: string;
	type: string;
	description: string;
	shorthand: string;
	default: string;
}

/**
 * Command specification for CLI documentation
 * Matches Python dataclass structure in generate-docs.py
 */
export interface CLICommandSpec {
	path: string[];
	use: string;
	short: string;
	long: string;
	example: string;
	aliases: string[];
	flags: GlobalFlagSpec[];
	subcommands: CLICommandSpec[];
	resources?: {
		total: number;
		primary: number;
		discovered: number;
		categories: unknown;
		list: Array<{
			name: string;
			description: string;
			operations: string[] | undefined;
			category: unknown;
			isPrimary?: boolean | undefined;
			tier?: unknown;
		}>;
	};
}

/**
 * Build a command specification object
 */
export function buildCommandSpec(options: {
	command: string;
	description: string;
	usage?: string;
	flags?: FlagSpec[];
	examples?: ExampleSpec[];
	outputFormats?: string[];
	related?: string[];
	category?: string;
}): CommandSpec {
	const spec: CommandSpec = {
		command: options.command,
		description: options.description,
		usage: options.usage ?? `xcsh ${options.command} [options]`,
		flags: options.flags ?? [],
		examples: options.examples ?? [],
		outputFormats: options.outputFormats ?? [...ALL_OUTPUT_FORMATS],
	};

	// Only add optional properties if they have values (exactOptionalPropertyTypes)
	if (options.related !== undefined) {
		spec.related = options.related;
	}
	if (options.category !== undefined) {
		spec.category = options.category;
	}

	return spec;
}

/**
 * Format command spec as JSON string
 */
export function formatSpec(spec: CommandSpec): string {
	return JSON.stringify(spec, null, 2);
}

/**
 * Global flags that apply to all commands
 */
export const GLOBAL_FLAGS: FlagSpec[] = [
	{
		name: "--output",
		description: "Output format",
		type: "string",
		default: "table",
		choices: [...ALL_OUTPUT_FORMATS],
	},
	{
		name: "--namespace",
		description: "Namespace to use for the operation",
		type: "string",
	},
	{
		name: "--no-color",
		description: "Disable colored output",
		type: "boolean",
		default: "false",
	},
	{
		name: "--spec",
		description: "Output command specification as JSON (for AI assistants)",
		type: "boolean",
	},
	{
		name: "--help",
		description: "Show help information",
		type: "boolean",
	},
	{
		name: "--version",
		description: "Show version number",
		type: "boolean",
	},
];

/**
 * Build spec for cloudstatus domain commands
 */
export function buildCloudstatusSpecs(): Record<string, CommandSpec> {
	return {
		status: buildCommandSpec({
			command: "cloudstatus status",
			description:
				"Get the overall health indicator for F5 Distributed Cloud services. Returns status level (operational, degraded, major outage) with description.",
			usage: "xcsh cloudstatus status [--quiet]",
			flags: [
				{
					name: "--quiet",
					alias: "-q",
					description: `Return exit code only (${EXIT_CODE_HELP})`,
					type: "boolean",
				},
			],
			examples: [
				{
					command: "xcsh cloudstatus status",
					description: "Check current F5 XC service status",
				},
				{
					command:
						"xcsh cloudstatus status --quiet && echo 'All systems operational'",
					description: "Use in scripts for health checks",
				},
				{
					command: "xcsh cloudstatus status --output json",
					description: "Get status as JSON for automation",
				},
			],
			category: "cloudstatus",
			related: [
				"cloudstatus summary",
				"cloudstatus components",
				"cloudstatus incidents",
			],
		}),

		summary: buildCommandSpec({
			command: "cloudstatus summary",
			description:
				"Get complete status summary including overall health, component status, and active incidents.",
			usage: "xcsh cloudstatus summary",
			examples: [
				{
					command: "xcsh cloudstatus summary",
					description: "View full infrastructure health overview",
				},
				{
					command: "xcsh cloudstatus summary --output json",
					description: "Get complete summary as JSON",
				},
			],
			category: "cloudstatus",
			related: ["cloudstatus status", "cloudstatus components"],
		}),

		components: buildCommandSpec({
			command: "cloudstatus components",
			description:
				"List all infrastructure components and their current operational status.",
			usage: "xcsh cloudstatus components",
			examples: [
				{
					command: "xcsh cloudstatus components",
					description: "List all components with status",
				},
				{
					command: "xcsh cloudstatus components --output json",
					description:
						"Get components as JSON for monitoring integration",
				},
			],
			category: "cloudstatus",
			related: ["cloudstatus status", "cloudstatus summary"],
		}),

		incidents: buildCommandSpec({
			command: "cloudstatus incidents",
			description:
				"List active and recent incidents affecting F5 Distributed Cloud services.",
			usage: "xcsh cloudstatus incidents",
			examples: [
				{
					command: "xcsh cloudstatus incidents",
					description: "View active incidents",
				},
				{
					command: "xcsh cloudstatus incidents --output json",
					description: "Get incidents as JSON for alerting systems",
				},
			],
			category: "cloudstatus",
			related: ["cloudstatus status", "cloudstatus maintenance"],
		}),

		maintenance: buildCommandSpec({
			command: "cloudstatus maintenance",
			description:
				"List scheduled maintenance windows for F5 Distributed Cloud services.",
			usage: "xcsh cloudstatus maintenance",
			examples: [
				{
					command: "xcsh cloudstatus maintenance",
					description: "View upcoming maintenance windows",
				},
				{
					command: "xcsh cloudstatus maintenance --output json",
					description: "Get maintenance schedule as JSON",
				},
			],
			category: "cloudstatus",
			related: ["cloudstatus status", "cloudstatus incidents"],
		}),
	};
}

/**
 * Build spec for ai_services domain commands
 */
export function buildAIServicesSpecs(): Record<string, CommandSpec> {
	return {
		query: buildCommandSpec({
			command: "ai_services query",
			description:
				"Query the F5 Distributed Cloud AI assistant with a natural language question. Get intelligent responses about load balancers, WAF, sites, security events, and platform operations.",
			usage: "xcsh ai_services query <question> [--namespace <ns>] [--output <format>]",
			flags: [
				{
					name: "--namespace",
					alias: "-ns",
					description: "Namespace context for the query",
					type: "string",
				},
			],
			examples: [
				{
					command:
						'xcsh ai_services query "What load balancers exist?"',
					description: "Ask about load balancers in your tenant",
				},
				{
					command:
						'xcsh ai query "Show me all WAF policies" --output json',
					description: "Get WAF policies as JSON using short alias",
				},
				{
					command:
						'xcsh genai query "Are there any security events?" --namespace production',
					description:
						"Query security events in a specific namespace",
				},
			],
			category: "ai_services",
			related: ["ai_services chat", "ai_services feedback"],
		}),

		chat: buildCommandSpec({
			command: "ai_services chat",
			description:
				"Start an interactive multi-turn conversation with the AI assistant. Maintains context across exchanges for follow-up questions and complex troubleshooting.",
			usage: "xcsh ai_services chat [--namespace <ns>]",
			flags: [
				{
					name: "--namespace",
					alias: "-ns",
					description: "Default namespace context for the session",
					type: "string",
				},
			],
			examples: [
				{
					command: "xcsh ai_services chat",
					description: "Start an interactive chat session",
				},
				{
					command: "xcsh ai chat --namespace staging",
					description: "Start chat with default namespace context",
				},
			],
			category: "ai_services",
			related: ["ai_services query", "ai_services feedback"],
		}),

		feedback: buildCommandSpec({
			command: "ai_services feedback",
			description:
				"Submit feedback for AI responses to improve quality. Provide positive feedback for helpful responses or negative feedback with specific reasons.",
			usage: "xcsh ai_services feedback [--positive | --negative <type>] [--comment <text>] [--query-id <id>]",
			flags: [
				{
					name: "--positive",
					description: "Mark the response as helpful",
					type: "boolean",
				},
				{
					name: "--negative",
					description: "Mark response as needing improvement",
					type: "string",
					choices: [
						"inaccurate",
						"irrelevant",
						"incomplete",
						"poor_format",
						"slow",
						"other",
					],
				},
				{
					name: "--comment",
					alias: "-c",
					description: "Additional feedback comments",
					type: "string",
				},
				{
					name: "--query-id",
					description: "Specific query ID to provide feedback for",
					type: "string",
				},
			],
			examples: [
				{
					command: "xcsh ai_services feedback --positive",
					description: "Mark last response as helpful",
				},
				{
					command:
						"xcsh ai feedback --negative inaccurate --comment 'Response was outdated'",
					description: "Submit negative feedback with reason",
				},
			],
			category: "ai_services",
			related: ["ai_services query", "ai_services chat"],
		}),

		"eval query": buildCommandSpec({
			command: "ai_services eval query",
			description:
				"Test AI query access with RBAC evaluation. Evaluate whether a query would be permitted under current access control configuration.",
			usage: "xcsh ai_services eval query <question> [--namespace <ns>]",
			flags: [
				{
					name: "--namespace",
					alias: "-ns",
					description: "Namespace context for RBAC evaluation",
					type: "string",
				},
			],
			examples: [
				{
					command:
						'xcsh ai_services eval query "List all namespaces"',
					description: "Evaluate query access permissions",
				},
				{
					command:
						'xcsh ai eval query "Show security events" --namespace production',
					description: "Test namespace-scoped access",
				},
			],
			category: "ai_services",
			related: ["ai_services eval feedback", "ai_services query"],
		}),

		"eval feedback": buildCommandSpec({
			command: "ai_services eval feedback",
			description:
				"Test feedback submission access with RBAC evaluation. Verify feedback operations would be permitted without actually submitting.",
			usage: "xcsh ai_services eval feedback [--positive | --negative <type>]",
			flags: [
				{
					name: "--positive",
					description: "Test positive feedback submission",
					type: "boolean",
				},
				{
					name: "--negative",
					description: "Test negative feedback submission",
					type: "string",
					choices: [
						"inaccurate",
						"irrelevant",
						"incomplete",
						"poor_format",
						"slow",
						"other",
					],
				},
			],
			examples: [
				{
					command: "xcsh ai_services eval feedback --positive",
					description: "Evaluate positive feedback access",
				},
				{
					command: "xcsh ai eval feedback --negative incomplete",
					description: "Test negative feedback permission",
				},
			],
			category: "ai_services",
			related: ["ai_services eval query", "ai_services feedback"],
		}),
	};
}

/**
 * Build spec for login domain commands
 */
export function buildLoginSpecs(): Record<string, CommandSpec> {
	return {
		banner: buildCommandSpec({
			command: "login banner",
			description:
				"Display xcsh banner with logo and connection information.",
			usage: "xcsh login banner",
			examples: [
				{
					command: "xcsh login banner",
					description: "Show the xcsh welcome banner",
				},
			],
			category: "login",
			related: ["login profile show"],
		}),

		"profile list": buildCommandSpec({
			command: "login profile list",
			description: "List all saved connection profiles.",
			usage: "xcsh login profile list",
			examples: [
				{
					command: "xcsh login profile list",
					description: "List saved profiles",
				},
				{
					command: "xcsh login profile list --output json",
					description: "Get profiles as JSON",
				},
			],
			category: "login",
			related: [
				"login profile show",
				"login profile create",
				"login profile use",
			],
		}),

		"profile show": buildCommandSpec({
			command: "login profile show",
			description:
				"Show current connection profile and authentication status.",
			usage: "xcsh login profile show [name]",
			flags: [
				{
					name: "name",
					description:
						"Profile name to show (optional, defaults to active)",
					type: "string",
				},
			],
			examples: [
				{
					command: "xcsh login profile show",
					description: "Show active profile",
				},
				{
					command: "xcsh login profile show production",
					description: "Show specific profile",
				},
			],
			category: "login",
			related: ["login profile list", "login profile use"],
		}),

		"profile create": buildCommandSpec({
			command: "login profile create",
			description:
				"Create a new connection profile with URL and credentials.",
			usage: "xcsh login profile create <name>",
			flags: [
				{
					name: "name",
					description: "Profile name",
					type: "string",
					required: true,
				},
			],
			examples: [
				{
					command: "xcsh login profile create production",
					description: "Create a new profile named 'production'",
				},
			],
			category: "login",
			related: ["login profile list", "login profile use"],
		}),

		"profile use": buildCommandSpec({
			command: "login profile use",
			description: "Switch to a different connection profile.",
			usage: "xcsh login profile use <name>",
			flags: [
				{
					name: "name",
					description: "Profile name to activate",
					type: "string",
					required: true,
				},
			],
			examples: [
				{
					command: "xcsh login profile use staging",
					description: "Switch to staging profile",
				},
			],
			category: "login",
			related: ["login profile list", "login profile show"],
		}),

		"context show": buildCommandSpec({
			command: "login context show",
			description: "Show the current default namespace context.",
			usage: "xcsh login context show",
			examples: [
				{
					command: "xcsh login context show",
					description: "Display current namespace",
				},
			],
			category: "login",
			related: ["login context set", "login context list"],
		}),

		"context set": buildCommandSpec({
			command: "login context set",
			description: "Set the default namespace for subsequent operations.",
			usage: "xcsh login context set <namespace>",
			flags: [
				{
					name: "namespace",
					description: "Namespace to set as default",
					type: "string",
					required: true,
				},
			],
			examples: [
				{
					command: "xcsh login context set production",
					description: "Set production as default namespace",
				},
			],
			category: "login",
			related: ["login context show", "login context list"],
		}),
	};
}

/**
 * Get command spec by command path
 */
export function getCommandSpec(commandPath: string): CommandSpec | undefined {
	const cloudstatusSpecs = buildCloudstatusSpecs();
	const loginSpecs = buildLoginSpecs();
	const aiServicesSpecs = buildAIServicesSpecs();

	// Normalize command path
	const normalized = commandPath.toLowerCase().trim();

	// Handle generic resource create commands (e.g., "healthcheck create", "origin_pool create")
	if (normalized.includes(" create")) {
		const parts = normalized.split(" ");
		if (parts.length >= 2 && parts[parts.length - 1] === "create") {
			// Extract domain/resource type (everything before "create")
			const resourceType = parts.slice(0, -1).join("_");

			// Try to build resource spec from OpenAPI schema
			const resourceSpec = buildResourceSpec(resourceType);

			if (resourceSpec) {
				// Build AI assistant guide
				const aiAssistantGuide = buildAIAssistantGuide(
					resourceType,
					resourceSpec.fields,
					resourceSpec.oneOfGroups,
				);

				return {
					command: `${resourceType.replace(/_/g, " ")} create`,
					description: `Create ${resourceType.replace(/_/g, " ")} resource`,
					usage: `xcsh ${resourceType.replace(/_/g, " ")} create [flags]`,
					flags: buildResourceFlags(resourceSpec),
					examples: buildResourceExamples(
						resourceType,
						aiAssistantGuide,
					),
					outputFormats: [...ALL_OUTPUT_FORMATS],
					category: resourceType,
					resourceSpec,
					aiAssistantGuide,
				};
			}
		}
	}

	// Check cloudstatus commands
	if (normalized.startsWith("cloudstatus ")) {
		const subcommand = normalized.replace("cloudstatus ", "");
		return cloudstatusSpecs[subcommand];
	}

	// Check login commands
	if (normalized.startsWith("login ")) {
		const subcommand = normalized.replace("login ", "");
		return loginSpecs[subcommand];
	}

	// Check ai_services commands (including aliases: ai, genai, assistant)
	const aiAliases = ["ai_services ", "ai ", "genai ", "assistant "];
	for (const alias of aiAliases) {
		if (normalized.startsWith(alias)) {
			const subcommand = normalized.replace(alias, "");
			return aiServicesSpecs[subcommand];
		}
	}

	return undefined;
}

/**
 * List all available command specs
 */
export function listAllCommandSpecs(): CommandSpec[] {
	return [
		...Object.values(buildCloudstatusSpecs()),
		...Object.values(buildLoginSpecs()),
		...Object.values(buildAIServicesSpecs()),
	];
}

/**
 * Convert FlagSpec to GlobalFlagSpec format
 */
function toGlobalFlagSpec(flag: FlagSpec): GlobalFlagSpec {
	return {
		name: flag.name,
		type: flag.type ?? "string",
		description: flag.description,
		shorthand: flag.alias ?? "",
		default: flag.default ?? "",
	};
}

/**
 * Build spec for a custom domain from the registry
 */
function buildCustomDomainSpec(domainName: string): CLICommandSpec | null {
	const domain = customDomains.get(domainName);
	if (!domain) return null;

	const subcommands: CLICommandSpec[] = [];

	// Add direct commands
	for (const [cmdName, cmd] of domain.commands) {
		subcommands.push({
			path: [domainName, cmdName],
			use: cmd.usage ?? cmdName,
			short: cmd.descriptionShort,
			long: cmd.description,
			example: "",
			aliases: cmd.aliases ?? [],
			flags: [],
			subcommands: [],
		});
	}

	// Add subcommand groups
	for (const [groupName, group] of domain.subcommands) {
		const groupSubcommands: CLICommandSpec[] = [];

		for (const [cmdName, cmd] of group.commands) {
			groupSubcommands.push({
				path: [domainName, groupName, cmdName],
				use: cmd.usage ?? cmdName,
				short: cmd.descriptionShort,
				long: cmd.description,
				example: "",
				aliases: cmd.aliases ?? [],
				flags: [],
				subcommands: [],
			});
		}

		subcommands.push({
			path: [domainName, groupName],
			use: groupName,
			short: group.descriptionShort,
			long: group.description,
			example: "",
			aliases: [],
			flags: [],
			subcommands: groupSubcommands,
		});
	}

	return {
		path: [domainName],
		use: domainName,
		short: domain.descriptionShort,
		long: domain.description,
		example: "",
		aliases: [],
		flags: [],
		subcommands,
	};
}

/**
 * Build enhanced resource spec for healthcheck
 */
export function buildHealthcheckResourceSpec(): ResourceSpec {
	const openApiSpec = loadOpenApiSpec();
	const schemaName = "healthcheckCreateSpecType";

	// Extract field specifications
	const fields = extractFieldSpecs(schemaName, openApiSpec);

	// Extract oneOf groups
	const oneOfGroups = extractOneOfGroups(schemaName, openApiSpec);

	return {
		resourceType: "healthcheck",
		fields,
		oneOfGroups,
		minimumConfiguration: {
			description:
				"Health check configuration for monitoring origin servers",
			requiredFields: [
				"metadata.name",
				"metadata.namespace",
				"spec.interval",
				"spec.timeout",
				"spec.healthy_threshold",
				"spec.unhealthy_threshold",
			],
			mutuallyExclusiveGroups: [
				{
					fields: [
						"spec.http_health_check",
						"spec.tcp_health_check",
						"spec.udp_icmp_health_check",
					],
					reason: "Choose exactly one health check type",
				},
			],
			exampleJson: JSON.stringify(
				{
					metadata: {
						name: "http-health",
						namespace: "default",
					},
					spec: {
						http_health_check: {
							path: "/health",
							use_origin_server_name: {},
						},
						interval: 15,
						timeout: 3,
						unhealthy_threshold: 1,
						healthy_threshold: 3,
						jitter_percent: 30,
					},
				},
				null,
				2,
			),
		},
	};
}

/**
 * Map constraint type to flag type
 */
function mapConstraintTypeToFlagType(
	type: string,
): "string" | "boolean" | "number" {
	if (type === "integer" || type === "number") return "number";
	if (type === "boolean") return "boolean";
	return "string";
}

/**
 * Build CLI flags from field specifications
 */
export function buildHealthcheckFlags(resourceSpec: ResourceSpec): FlagSpec[] {
	const flags: FlagSpec[] = [
		{
			name: "--name",
			description: "Health check resource name",
			type: "string",
			required: true,
		},
		{
			name: "--namespace",
			description: "Namespace for the health check",
			type: "string",
		},
		{
			name: "--type",
			description: "Health check type",
			type: "string",
			default: "http",
			choices: ["http", "tcp", "udp-icmp"],
		},
	];

	// Add flags from field specs (only top-level fields)
	for (const field of resourceSpec.fields) {
		// Skip oneOf variant fields - they're handled by --type
		if (field.oneOfGroup === "health_check") continue;

		const flagName = `--${field.name.replace(/_/g, "-")}`;
		const flag: FlagSpec = {
			name: flagName,
			description: field.extensions.descriptionShort || field.description,
			type: mapConstraintTypeToFlagType(field.constraints.type),
			required: field.required,
		};

		if (field.default !== undefined) {
			flag.default = String(field.default);
		}

		if (field.constraints.enum) {
			flag.choices = field.constraints.enum as string[];
		}

		flags.push(flag);
	}

	return flags;
}

/**
 * Build example invocations for healthcheck creation
 */
export function buildHealthcheckExamples(): ExampleSpec[] {
	return [
		{
			command:
				"xcsh healthcheck create --name http-health --type http --path /health --interval 15 --timeout 3",
			description: "Create HTTP health check with recommended values",
		},
		{
			command:
				'xcsh healthcheck create --name tcp-health --type tcp --interval 10 --timeout 5 --send-payload "0x48454C4C4F"',
			description: "Create TCP health check with hex payload",
		},
		{
			command:
				"xcsh healthcheck create --name ping-health --type udp-icmp --interval 30 --timeout 10",
			description: "Create UDP/ICMP health check",
		},
	];
}

/**
 * Build generic resource flags from resource spec
 * Generic version of buildHealthcheckFlags for all resource types
 */
function buildResourceFlags(resourceSpec: ResourceSpec): FlagSpec[] {
	const flags: FlagSpec[] = [
		{
			name: "--name",
			description: "Resource name",
			type: "string",
			required: true,
		},
		{
			name: "--namespace",
			description: "Namespace for the resource",
			type: "string",
		},
	];

	// Add flags from field specs
	for (const field of resourceSpec.fields) {
		// Skip oneOf variant fields - they should be handled specially
		if (field.oneOfGroup) continue;

		const flagName = `--${field.name.replace(/_/g, "-")}`;
		const flag: FlagSpec = {
			name: flagName,
			description: field.extensions.descriptionShort || field.description,
			type: mapConstraintTypeToFlagType(field.constraints.type),
			required: field.required,
		};

		if (field.default !== undefined) {
			flag.default = String(field.default);
		}

		if (field.constraints.enum) {
			flag.choices = field.constraints.enum as string[];
		}

		flags.push(flag);
	}

	return flags;
}

/**
 * Build generic resource examples from AI assistant guide
 * Uses common patterns from aiAssistantGuide if available
 */
function buildResourceExamples(
	resourceType: string,
	aiAssistantGuide: AIAssistantGuide | undefined,
): ExampleSpec[] {
	const examples: ExampleSpec[] = [];

	// Use common patterns from AI guide if available
	if (aiAssistantGuide?.commonPatterns) {
		for (const pattern of aiAssistantGuide.commonPatterns.slice(0, 3)) {
			examples.push({
				command: `xcsh ${resourceType.replace(/_/g, " ")} create --from-pattern ${pattern.name}`,
				description: pattern.description,
			});
		}
	}

	// Fallback: create a basic example
	if (examples.length === 0) {
		examples.push({
			command: `xcsh ${resourceType.replace(/_/g, " ")} create --name my-${resourceType} --namespace default`,
			description: `Create ${resourceType.replace(/_/g, " ")} resource`,
		});
	}

	return examples;
}

/**
 * Build spec for an API-generated domain
 * Phase 1 Enhancement: Includes allResources to show all available resource types
 */
function buildApiDomainSpec(domainName: string): CLICommandSpec | null {
	const info = domainRegistry.get(domainName);
	if (!info) return null;

	// API domains have standard CRUD actions
	const actions = Array.from(validActions);
	const subcommands: CLICommandSpec[] = actions.map((action) => ({
		path: [domainName, action],
		use: action,
		short: `${action.charAt(0).toUpperCase() + action.slice(1)} ${info.displayName} resources`,
		long: `${action.charAt(0).toUpperCase() + action.slice(1)} ${info.displayName} resources in F5 Distributed Cloud`,
		example: `xcsh ${domainName} ${action}`,
		aliases: [],
		flags: [],
		subcommands: [],
	}));

	// Build spec with resource information
	const spec: CLICommandSpec = {
		path: [domainName],
		use: domainName,
		short: info.descriptionShort,
		long: info.description,
		example: "",
		aliases: info.aliases,
		flags: [],
		subcommands,
	};

	// Phase 1 Enhancement: Add resource information to spec
	// Include both counts and categorized resource lists
	const resources = info.allResources || info.primaryResources;
	if (resources && resources.length > 0) {
		// Add as metadata in the spec (extend the type if needed via casting)
		spec.resources = {
			total: resources.length,
			primary: info.primaryResources?.length || 0,
			discovered: resources.length - (info.primaryResources?.length || 0),
			categories: info.resourceCategories,
			list: resources.map((r) => ({
				name: r.name,
				description: r.descriptionShort || r.description,
				operations: r.operations,
				category: r.resourceCategory,
				isPrimary: r.isPrimary,
				tier: r.tier,
			})),
		};
	}

	return spec;
}

/**
 * Build the complete CLI specification for documentation generation
 * This is used by scripts/generate-docs.py when running `xcsh --spec`
 */
export function buildFullCLISpec(): CLISpec {
	const commands: CLICommandSpec[] = [];

	// Add custom domains first
	for (const domain of customDomains.all()) {
		const spec = buildCustomDomainSpec(domain.name);
		if (spec) {
			commands.push(spec);
		}
	}

	// Add API-generated domains (skip if already added as custom domain)
	const customDomainNames = new Set(customDomains.list());
	for (const [domainName] of domainRegistry) {
		if (!customDomainNames.has(domainName)) {
			const spec = buildApiDomainSpec(domainName);
			if (spec) {
				commands.push(spec);
			}
		}
	}

	// Sort commands by name for consistent output
	commands.sort((a, b) => (a.path[0] ?? "").localeCompare(b.path[0] ?? ""));

	return {
		version: CLI_VERSION,
		global_flags: GLOBAL_FLAGS.map(toGlobalFlagSpec),
		commands,
	};
}

/**
 * Format the full CLI spec as JSON string
 */
export function formatFullCLISpec(): string {
	return JSON.stringify(buildFullCLISpec(), null, 2);
}
