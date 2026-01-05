#!/usr/bin/env npx tsx
/**
 * Domain Generator Script
 * Generates src/types/domains_generated.ts from .specs/index.json
 *
 * Run: npx tsx scripts/generate-domains.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";
import { execSync } from "child_process";

// Types matching the upstream spec structure
interface SpecPrimaryResource {
	name: string;
	description: string;
	description_short: string;
	tier: string;
	icon?: string;
	category?: string;
	supports_logs?: boolean;
	supports_metrics?: boolean;
	dependencies?: {
		required?: string[];
		optional?: string[];
	};
	relationship_hints?: string[];
}

interface SpecIndexEntry {
	domain: string;
	title: string;
	description: string;
	// x-f5xc-* extension fields (v2.0.2+ namespace)
	"x-f5xc-description-short"?: string; // ~60 chars for completions, badges
	"x-f5xc-description-medium"?: string; // ~150 chars for tooltips, summaries
	file: string;
	path_count: number;
	schema_count: number;
	"x-f5xc-complexity"?: string;
	"x-f5xc-is-preview"?: boolean;
	"x-f5xc-requires-tier"?: string;
	"x-f5xc-category"?: string;
	"x-f5xc-use-cases"?: string[];
	"x-f5xc-related-domains"?: string[];
	"x-f5xc-cli-metadata"?: Record<string, unknown>;
	// Visual identity fields (from upstream enrichment)
	"x-f5xc-icon"?: string; // Emoji icon
	"x-f5xc-logo-svg"?: string; // SVG data URI
	// Rich resource metadata (from upstream enrichment)
	"x-f5xc-primary-resources"?: SpecPrimaryResource[];
}

interface SpecIndex {
	version: string;
	timestamp: string;
	specifications: SpecIndexEntry[];
}

interface DomainConfig {
	version?: string;
	deprecated_domains?: Record<
		string,
		{
			maps_to: string;
			reason: string;
			deprecated_since: string;
		}
	>;
}

interface ResourceMetadata {
	name: string;
	description: string;
	descriptionShort: string;
	tier: string;
	icon?: string;
	category?: string;
	supportsLogs?: boolean;
	supportsMetrics?: boolean;
	dependencies?: {
		required?: string[];
		optional?: string[];
	};
	relationshipHints?: string[];
}

interface DomainInfo {
	name: string;
	displayName: string;
	description: string;
	descriptionShort: string;
	descriptionMedium: string;
	aliases: string[];
	complexity: string;
	isPreview: boolean;
	requiresTier: string;
	category: string;
	useCases: string[];
	relatedDomains: string[];
	cliMetadata?: Record<string, unknown>;
	// Visual identity fields
	icon?: string;
	logoSvg?: string;
	// Rich resource metadata
	primaryResources?: ResourceMetadata[];
}

/**
 * Convert snake_case to Title Case
 */
function titleCase(s: string): string {
	return s
		.split("_")
		.map((part) =>
			part.length > 0 ? part[0].toUpperCase() + part.slice(1) : "",
		)
		.join(" ");
}

/**
 * Escape string for TypeScript output
 */
function escapeString(s: string): string {
	return s
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/\n/g, "\\n")
		.replace(/\r/g, "\\r")
		.replace(/\t/g, "\\t");
}

/**
 * Generate TypeScript code for a resource metadata entry
 */
function generateResourceMetadata(resource: ResourceMetadata): string {
	let code = "{\n";
	code += `\t\t\t\tname: "${escapeString(resource.name)}",\n`;
	code += `\t\t\t\tdescription: "${escapeString(resource.description)}",\n`;
	code += `\t\t\t\tdescriptionShort: "${escapeString(resource.descriptionShort)}",\n`;
	code += `\t\t\t\ttier: "${resource.tier}" as const,\n`;

	if (resource.icon) {
		code += `\t\t\t\ticon: "${escapeString(resource.icon)}",\n`;
	}
	if (resource.category) {
		code += `\t\t\t\tcategory: "${escapeString(resource.category)}",\n`;
	}
	if (resource.supportsLogs !== undefined) {
		code += `\t\t\t\tsupportsLogs: ${resource.supportsLogs},\n`;
	}
	if (resource.supportsMetrics !== undefined) {
		code += `\t\t\t\tsupportsMetrics: ${resource.supportsMetrics},\n`;
	}
	if (resource.dependencies) {
		const depsRequired = resource.dependencies.required?.length
			? `required: [${resource.dependencies.required.map((r) => `"${escapeString(r)}"`).join(", ")}]`
			: "";
		const depsOptional = resource.dependencies.optional?.length
			? `optional: [${resource.dependencies.optional.map((o) => `"${escapeString(o)}"`).join(", ")}]`
			: "";
		const depsParts = [depsRequired, depsOptional].filter(Boolean);
		if (depsParts.length > 0) {
			code += `\t\t\t\tdependencies: { ${depsParts.join(", ")} },\n`;
		}
	}
	if (resource.relationshipHints?.length) {
		const hints = resource.relationshipHints
			.map((h) => `"${escapeString(h)}"`)
			.join(", ");
		code += `\t\t\t\trelationshipHints: [${hints}],\n`;
	}

	code += "\t\t\t}";
	return code;
}

/**
 * Generate TypeScript code for a domain
 */
function generateDomainEntry(domain: DomainInfo): string {
	const aliasArray = domain.aliases
		.map((a) => `"${escapeString(a)}"`)
		.join(", ");
	const useCasesArray = domain.useCases
		.map((u) => `"${escapeString(u)}"`)
		.join(", ");
	const relatedArray = domain.relatedDomains
		.map((r) => `"${escapeString(r)}"`)
		.join(", ");

	let code = `\t["${domain.name}", {\n`;
	code += `\t\tname: "${domain.name}",\n`;
	code += `\t\tdisplayName: "${escapeString(domain.displayName)}",\n`;
	code += `\t\tdescription: "${escapeString(domain.description)}",\n`;
	code += `\t\tdescriptionShort: "${escapeString(domain.descriptionShort)}",\n`;
	code += `\t\tdescriptionMedium: "${escapeString(domain.descriptionMedium)}",\n`;
	code += `\t\taliases: [${aliasArray}],\n`;
	code += `\t\tcomplexity: "${domain.complexity}" as const,\n`;
	code += `\t\tisPreview: ${domain.isPreview},\n`;
	code += `\t\trequiresTier: "${domain.requiresTier}",\n`;
	code += `\t\tcategory: "${domain.category}",\n`;
	code += `\t\tuseCases: [${useCasesArray}],\n`;
	code += `\t\trelatedDomains: [${relatedArray}],\n`;

	if (domain.cliMetadata && Object.keys(domain.cliMetadata).length > 0) {
		code += `\t\tcliMetadata: ${JSON.stringify(domain.cliMetadata, null, 2).replace(/\n/g, "\n\t\t")},\n`;
	}

	// Visual identity fields
	if (domain.icon) {
		code += `\t\ticon: "${escapeString(domain.icon)}",\n`;
	}
	if (domain.logoSvg) {
		code += `\t\tlogoSvg: "${escapeString(domain.logoSvg)}",\n`;
	}

	// Rich resource metadata
	if (domain.primaryResources && domain.primaryResources.length > 0) {
		const resourceEntries = domain.primaryResources
			.map((r) => generateResourceMetadata(r))
			.join(",\n\t\t\t");
		code += `\t\tprimaryResources: [\n\t\t\t${resourceEntries}\n\t\t],\n`;
	}

	code += `\t}]`;
	return code;
}

/**
 * Main generator function
 */
async function main(): Promise<void> {
	console.log("🏗️  Generating domains from upstream specs...");

	const specsDir = ".specs";
	const indexPath = path.join(specsDir, "index.json");
	const configPath = path.join(specsDir, "domain_config.yaml");
	const outputPath = path.join("src", "types", "domains_generated.ts");

	// Read spec index
	if (!fs.existsSync(indexPath)) {
		console.error(`❌ Spec index not found: ${indexPath}`);
		console.error(
			"   Run 'make download-specs' first to download API specifications.",
		);
		process.exit(1);
	}

	const indexData = fs.readFileSync(indexPath, "utf-8");
	const specIndex: SpecIndex = JSON.parse(indexData);
	console.log(
		`✓ Loaded spec index v${specIndex.version} with ${specIndex.specifications.length} domains`,
	);

	// Read domain config (optional, for deprecated domains)
	let config: DomainConfig = { deprecated_domains: {} };
	if (fs.existsSync(configPath)) {
		const configData = fs.readFileSync(configPath, "utf-8");
		config = yaml.parse(configData) || config;
		console.log(`✓ Loaded domain config`);
	}

	// Build domain registry
	const domains: DomainInfo[] = [];

	for (const spec of specIndex.specifications) {
		// Skip empty domains
		if (spec.path_count === 0 && spec.schema_count === 0) {
			console.log(`⊘ Skipping empty domain: ${spec.domain}`);
			continue;
		}

		// Transform primary_resources from upstream format to internal format
		const primaryResources: ResourceMetadata[] | undefined =
			spec["x-f5xc-primary-resources"]?.map((r) => ({
				name: r.name,
				description: r.description || "",
				descriptionShort: r.description_short || "",
				tier: r.tier || "Standard",
				icon: r.icon,
				category: r.category,
				supportsLogs: r.supports_logs,
				supportsMetrics: r.supports_metrics,
				dependencies: r.dependencies,
				relationshipHints: r.relationship_hints,
			}));

		const domainInfo: DomainInfo = {
			name: spec.domain,
			displayName: titleCase(spec.domain),
			description: spec.description,
			descriptionShort: spec["x-f5xc-description-short"] || "",
			descriptionMedium: spec["x-f5xc-description-medium"] || "",
			aliases: [], // Aliases removed from upstream v2.0.4 (Issue #306)
			complexity: spec["x-f5xc-complexity"] || "moderate",
			isPreview: spec["x-f5xc-is-preview"] || false,
			requiresTier: spec["x-f5xc-requires-tier"] || "Standard",
			category: spec["x-f5xc-category"] || "Other",
			useCases: spec["x-f5xc-use-cases"] || [],
			relatedDomains: spec["x-f5xc-related-domains"] || [],
			cliMetadata: spec["x-f5xc-cli-metadata"],
			// Visual identity fields
			icon: spec["x-f5xc-icon"],
			logoSvg: spec["x-f5xc-logo-svg"],
			// Rich resource metadata
			primaryResources,
		};

		domains.push(domainInfo);
	}

	// Sort domains alphabetically for consistent output
	domains.sort((a, b) => a.name.localeCompare(b.name));

	console.log(`✓ Generated registry with ${domains.length} active domains`);

	// Generate TypeScript file
	const domainEntries = domains.map(generateDomainEntry).join(",\n");

	const outputContent = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from .specs/index.json v${specIndex.version}
 * Run: npx tsx scripts/generate-domains.ts
 */

import type { DomainInfo, ResourceMetadata, SubscriptionTier } from "./domains.js";

// Re-export types for consumers
export type { ResourceMetadata, SubscriptionTier };

/**
 * Spec version used for generation
 */
export const SPEC_VERSION = "${specIndex.version}";

/**
 * Generated domain data from upstream API specifications
 */
export const generatedDomains: Map<string, DomainInfo> = new Map([
${domainEntries}
]);

/**
 * Total domain count
 */
export const DOMAIN_COUNT = ${domains.length};
`;

	// Ensure output directory exists
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// Write output file
	fs.writeFileSync(outputPath, outputContent, "utf-8");

	// Format with Prettier to ensure consistent output
	try {
		execSync(`npx prettier --write "${outputPath}"`, {
			stdio: "pipe",
			encoding: "utf-8",
		});
		console.log(`✓ Formatted: ${outputPath}`);
	} catch {
		console.warn(`⚠️  Prettier formatting skipped (not available)`);
	}

	console.log(`✓ Generated: ${outputPath}`);
	console.log(`✅ Domain generation complete! (${domains.length} domains)`);
}

main().catch((err) => {
	console.error("❌ Generation failed:", err);
	process.exit(1);
});
