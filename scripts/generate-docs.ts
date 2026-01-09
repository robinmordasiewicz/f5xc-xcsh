#!/usr/bin/env npx tsx
/**
 * Documentation Generator Script
 * Generates docs/guides/*.md from .specs/index.json and local xcsh examples
 *
 * Run: npx tsx scripts/generate-docs.ts
 *
 * Data sources:
 * - UPSTREAM (.specs/index.json): Resource descriptions, best practices, field docs
 * - LOCAL (docs/config/xcsh-examples.yaml): CLI command syntax, xcsh-specific workflows
 *
 * This separation ensures:
 * - Global API content comes from upstream (shared with other downstream projects)
 * - CLI-specific content stays local (implementation-specific to xcsh)
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";

// Types for spec data
interface SpecPrimaryResource {
	name: string;
	description: string;
	description_short: string;
	tier: string;
	icon?: string;
	category?: string;
	dependencies?: {
		required?: string[];
		optional?: string[];
	};
	relationship_hints?: string[];
}

interface WorkflowStep {
	order: number;
	action: string;
	resource?: string;
	description: string;
	example_ref?: string;
	command?: string;
}

interface CliMetadata {
	common_workflows?: Array<{
		id: string;
		title: string;
		description?: string;
		steps?: WorkflowStep[];
	}>;
	quick_start?: string;
	troubleshooting?: Array<{
		issue: string;
		solution: string;
	}>;
}

// Future extensions (feature requests #324, #325, #326)
interface GuidedWorkflow {
	id: string;
	title: string;
	description?: string;
	difficulty?: string;
	estimated_time?: string;
	prerequisites?: string[];
	steps: WorkflowStep[];
	validation?: string[];
	troubleshooting_ref?: string;
}

interface Example {
	description: string;
	use_case?: string;
	yaml: string;
}

interface BestPractices {
	security?: Array<{
		id: string;
		severity?: string;
		title: string;
		description: string;
		remediation?: string;
	}>;
	performance?: Array<{
		id: string;
		title: string;
		description: string;
		impact?: string;
		configuration?: string;
	}>;
	pitfalls?: Array<{
		id: string;
		title: string;
		symptom?: string;
		cause?: string;
		solution: string;
		prevention?: string;
	}>;
}

interface SpecIndexEntry {
	domain: string;
	title: string;
	description: string;
	"x-f5xc-description-short"?: string;
	"x-f5xc-description-medium"?: string;
	"x-f5xc-icon"?: string;
	"x-f5xc-category"?: string;
	"x-f5xc-use-cases"?: string[];
	"x-f5xc-related-domains"?: string[];
	"x-f5xc-cli-metadata"?: CliMetadata;
	"x-f5xc-primary-resources"?: SpecPrimaryResource[];
	// Future extensions (when implemented upstream)
	"x-f5xc-guided-workflows"?: GuidedWorkflow[];
	"x-f5xc-examples"?: Record<string, Record<string, Example>>;
	"x-f5xc-best-practices"?: BestPractices;
}

interface SpecIndex {
	version: string;
	timestamp: string;
	specifications: SpecIndexEntry[];
}

// Types for LOCAL xcsh-specific examples (docs/config/xcsh-examples.yaml)
interface XcshExample {
	description: string;
	command: string;
	output?: string;
}

interface XcshWorkflowStep {
	order: number;
	description: string;
	command: string;
}

interface XcshWorkflow {
	title: string;
	description?: string;
	steps: XcshWorkflowStep[];
}

interface XcshDomainConfig {
	display_name: string;
	cli_domain: string;
	examples?: Record<string, XcshExample>;
	workflows?: Record<string, XcshWorkflow>;
}

interface QuickRefCommand {
	description: string;
	command: string;
}

interface QuickRefCategory {
	category: string;
	commands: QuickRefCommand[];
}

interface XcshExamplesConfig {
	version: string;
	cli_patterns: Record<string, string>;
	domains: Record<string, XcshDomainConfig>;
	quick_reference: QuickRefCategory[];
	ai_assistant?: {
		description: string;
		examples: Array<{ query: string; interpretation: string }>;
	};
}

/**
 * Escape markdown special characters
 */
function escapeMarkdown(s: string): string {
	return s.replace(/([_*`])/g, "\\$1");
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
 * Generate workflow documentation from cli_metadata
 */
function generateWorkflowSection(
	domain: string,
	cliMetadata: CliMetadata,
): string {
	const workflows = cliMetadata.common_workflows || [];
	if (workflows.length === 0) return "";

	let content = "## Common Workflows\n\n";

	for (const workflow of workflows) {
		// Skip workflows with missing or invalid title
		const title = workflow.title;
		if (!title || typeof title !== "string") continue;

		content += `### ${title}\n\n`;
		if (workflow.description && typeof workflow.description === "string") {
			content += `${workflow.description}\n\n`;
		}

		if (workflow.steps && Array.isArray(workflow.steps) && workflow.steps.length > 0) {
			for (const step of workflow.steps) {
				// Skip steps with missing order or description
				if (typeof step.order !== "number" || !step.description) continue;

				content += `${step.order}. ${step.description}\n\n`;
				if (step.command && typeof step.command === "string") {
					content += "```bash\n";
					content += `${step.command}\n`;
					content += "```\n\n";
				}
			}
		}
	}

	// Return empty if no valid workflows were generated
	if (content === "## Common Workflows\n\n") return "";

	return content;
}

/**
 * Generate troubleshooting section from cli_metadata
 */
function generateTroubleshootingSection(cliMetadata: CliMetadata): string {
	const troubleshooting = cliMetadata.troubleshooting || [];
	if (!Array.isArray(troubleshooting) || troubleshooting.length === 0) return "";

	let content = "## Troubleshooting\n\n";
	let hasValidItems = false;

	for (const item of troubleshooting) {
		// Skip items with missing issue or solution
		if (!item.issue || typeof item.issue !== "string") continue;
		if (!item.solution || typeof item.solution !== "string") continue;

		content += `### ${item.issue}\n\n`;
		content += `**Solution:** ${item.solution}\n\n`;
		hasValidItems = true;
	}

	return hasValidItems ? content : "";
}

/**
 * Generate quick start section from cli_metadata
 */
function generateQuickStartSection(cliMetadata: CliMetadata): string {
	const quickStart = cliMetadata.quick_start;
	// Skip if missing or not a valid string
	if (!quickStart || typeof quickStart !== "string") return "";

	return `## Quick Start\n\n${quickStart}\n\n`;
}

/**
 * Generate resource reference from primary_resources
 */
function generateResourceReference(
	resources: SpecPrimaryResource[],
): string {
	if (resources.length === 0) return "";

	let content = "## Resource Reference\n\n";
	content +=
		"| Resource | Description | Tier | Dependencies |\n";
	content +=
		"|----------|-------------|------|-------------|\n";

	for (const resource of resources) {
		const deps = resource.dependencies?.required?.join(", ") || "None";
		content += `| \`${resource.name}\` | ${resource.description_short || resource.description} | ${resource.tier} | ${deps} |\n`;
	}

	content += "\n";
	return content;
}

/**
 * Generate use cases section
 */
function generateUseCasesSection(useCases: string[]): string {
	if (useCases.length === 0) return "";

	let content = "## Use Cases\n\n";
	for (const useCase of useCases) {
		content += `- ${useCase}\n`;
	}
	content += "\n";
	return content;
}

/**
 * Generate related domains section
 */
function generateRelatedSection(
	relatedDomains: string[],
	allDomains: Map<string, SpecIndexEntry>,
): string {
	if (relatedDomains.length === 0) return "";

	// Filter to only include domains that have documentation
	const validDomains = relatedDomains.filter((domain) => allDomains.has(domain));
	if (validDomains.length === 0) return "";

	let content = "## Related Domains\n\n";
	content += "| Domain | Description |\n";
	content += "|--------|-------------|\n";

	for (const related of validDomains) {
		const relatedSpec = allDomains.get(related);
		const desc = relatedSpec?.["x-f5xc-description-short"] || relatedSpec?.description || "";
		content += `| [${titleCase(related)}](${related}.md) | ${desc} |\n`;
	}

	content += "\n";
	return content;
}

/**
 * Generate CLI examples section from LOCAL xcsh config
 */
function generateCliExamplesSection(xcshDomain: XcshDomainConfig): string {
	const examples = xcshDomain.examples;
	if (!examples || Object.keys(examples).length === 0) return "";

	let content = "## CLI Examples\n\n";

	for (const [operation, example] of Object.entries(examples)) {
		content += `### ${titleCase(operation)}\n\n`;
		content += `${example.description}\n\n`;
		content += "```bash\n";
		content += `${example.command}\n`;
		content += "```\n\n";

		if (example.output) {
			content += "**Output:**\n\n";
			content += "```text\n";
			content += `${example.output}`;
			content += "```\n\n";
		}
	}

	return content;
}

/**
 * Generate CLI workflows section from LOCAL xcsh config
 */
function generateCliWorkflowsSection(xcshDomain: XcshDomainConfig): string {
	const workflows = xcshDomain.workflows;
	if (!workflows || Object.keys(workflows).length === 0) return "";

	let content = "## CLI Workflows\n\n";

	for (const [, workflow] of Object.entries(workflows)) {
		content += `### ${workflow.title}\n\n`;
		if (workflow.description) {
			content += `${workflow.description}\n\n`;
		}

		for (const step of workflow.steps) {
			content += `${step.order}. ${step.description}\n\n`;
			content += "```bash\n";
			content += `${step.command}\n`;
			content += "```\n\n";
		}
	}

	return content;
}

/**
 * Generate quick reference guide from LOCAL xcsh config
 */
function generateQuickReferenceDoc(xcshConfig: XcshExamplesConfig): string {
	let content = "# Quick Reference\n\n";
	content += "Common xcsh CLI commands and patterns.\n\n";

	for (const category of xcshConfig.quick_reference) {
		content += `## ${category.category}\n\n`;
		content += "| Description | Command |\n";
		content += "|-------------|--------|\n";

		for (const cmd of category.commands) {
			content += `| ${cmd.description} | \`${cmd.command}\` |\n`;
		}
		content += "\n";
	}

	// AI Assistant section
	if (xcshConfig.ai_assistant) {
		content += "## AI Assistant\n\n";
		content += `${xcshConfig.ai_assistant.description}\n\n`;
		content += "| Query | Interpretation |\n";
		content += "|-------|---------------|\n";
		for (const ex of xcshConfig.ai_assistant.examples) {
			content += `| "${ex.query}" | ${ex.interpretation} |\n`;
		}
		content += "\n";
	}

	content += "---\n\n";
	content += "*CLI examples specific to xcsh. See domain guides for API resource details.*\n";

	return content;
}

/**
 * Generate domain documentation page
 * Merges UPSTREAM spec data with LOCAL xcsh examples
 */
function generateDomainDoc(
	spec: SpecIndexEntry,
	allDomains: Map<string, SpecIndexEntry>,
	xcshConfig?: XcshExamplesConfig,
): string {
	const icon = spec["x-f5xc-icon"] || "";
	const title = `${icon} ${titleCase(spec.domain)}`.trim();

	let content = `# ${title}\n\n`;

	// Description (from UPSTREAM)
	const description =
		spec["x-f5xc-description-medium"] || spec.description;
	content += `${description}\n\n`;

	// Category badge (from UPSTREAM)
	const category = spec["x-f5xc-category"];
	if (category) {
		content += `**Category:** ${category}\n\n`;
	}

	// Quick start (from UPSTREAM cli_metadata)
	if (spec["x-f5xc-cli-metadata"]) {
		content += generateQuickStartSection(spec["x-f5xc-cli-metadata"]);
	}

	// CLI Examples (from LOCAL xcsh config)
	const xcshDomain = xcshConfig?.domains[spec.domain];
	if (xcshDomain) {
		content += generateCliExamplesSection(xcshDomain);
	}

	// Use cases (from UPSTREAM)
	if (spec["x-f5xc-use-cases"]) {
		content += generateUseCasesSection(spec["x-f5xc-use-cases"]);
	}

	// Resource reference (from UPSTREAM primary_resources)
	if (spec["x-f5xc-primary-resources"]) {
		content += generateResourceReference(spec["x-f5xc-primary-resources"]);
	}

	// Common workflows (from UPSTREAM cli_metadata)
	if (spec["x-f5xc-cli-metadata"]) {
		content += generateWorkflowSection(
			spec.domain,
			spec["x-f5xc-cli-metadata"],
		);
	}

	// CLI Workflows (from LOCAL xcsh config)
	if (xcshDomain) {
		content += generateCliWorkflowsSection(xcshDomain);
	}

	// Troubleshooting (from UPSTREAM cli_metadata)
	if (spec["x-f5xc-cli-metadata"]) {
		content += generateTroubleshootingSection(spec["x-f5xc-cli-metadata"]);
	}

	// Related domains (from UPSTREAM)
	if (spec["x-f5xc-related-domains"]) {
		content += generateRelatedSection(
			spec["x-f5xc-related-domains"],
			allDomains,
		);
	}

	// Footer
	content += "---\n\n";
	content += `*Generated from enriched API specs and local xcsh examples.*\n`;

	return content;
}

/**
 * Generate index page for all domains
 */
function generateIndexDoc(
	specs: SpecIndexEntry[],
	version: string,
): string {
	let content = "# Domain Reference\n\n";
	content += `Generated from enriched API specifications v${version}.\n\n`;

	// Group by category
	const byCategory = new Map<string, SpecIndexEntry[]>();
	for (const spec of specs) {
		const category = spec["x-f5xc-category"] || "Other";
		if (!byCategory.has(category)) {
			byCategory.set(category, []);
		}
		byCategory.get(category)!.push(spec);
	}

	// Sort categories
	const sortedCategories = Array.from(byCategory.keys()).sort();

	for (const category of sortedCategories) {
		const categorySpecs = byCategory.get(category)!;
		content += `## ${category}\n\n`;
		content += "| Domain | Description |\n";
		content += "|--------|-------------|\n";

		for (const spec of categorySpecs.sort((a, b) =>
			a.domain.localeCompare(b.domain),
		)) {
			const icon = spec["x-f5xc-icon"] || "";
			const title = `${icon} ${titleCase(spec.domain)}`.trim();
			const desc = spec["x-f5xc-description-short"] || "";
			content += `| [${title}](${spec.domain}.md) | ${desc} |\n`;
		}
		content += "\n";
	}

	return content;
}

/**
 * Main generator function
 */
async function main(): Promise<void> {
	console.log("📚 Generating documentation from enriched specs...");

	const specsDir = ".specs";
	const indexPath = path.join(specsDir, "index.json");
	const xcshConfigPath = "docs/config/cli-examples.yaml";
	const outputDir = "docs/guides/generated";

	// Read UPSTREAM spec index
	if (!fs.existsSync(indexPath)) {
		console.error(`❌ Spec index not found: ${indexPath}`);
		console.error(
			"   Run 'npm run reconcile:specs' first to download API specifications.",
		);
		process.exit(1);
	}

	const indexData = fs.readFileSync(indexPath, "utf-8");
	const specIndex: SpecIndex = JSON.parse(indexData);
	console.log(
		`✓ Loaded UPSTREAM spec index v${specIndex.version} with ${specIndex.specifications.length} domains`,
	);

	// Read LOCAL xcsh examples config
	let xcshConfig: XcshExamplesConfig | undefined;
	if (fs.existsSync(xcshConfigPath)) {
		const xcshConfigData = fs.readFileSync(xcshConfigPath, "utf-8");
		xcshConfig = yaml.parse(xcshConfigData) as XcshExamplesConfig;
		console.log(
			`✓ Loaded LOCAL xcsh examples v${xcshConfig.version} with ${Object.keys(xcshConfig.domains).length} domains`,
		);
	} else {
		console.log(`⚠️  Local xcsh examples not found: ${xcshConfigPath}`);
	}

	// Filter to non-empty domains (have upstream metadata OR local examples)
	const activeSpecs = specIndex.specifications.filter(
		(spec) =>
			spec["x-f5xc-cli-metadata"] ||
			spec["x-f5xc-primary-resources"]?.length ||
			xcshConfig?.domains[spec.domain],
	);

	console.log(
		`✓ Found ${activeSpecs.length} domains with documentation content`,
	);

	// Build domain lookup
	const allDomains = new Map<string, SpecIndexEntry>();
	for (const spec of specIndex.specifications) {
		allDomains.set(spec.domain, spec);
	}

	// Ensure output directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// Generate domain docs (merging UPSTREAM + LOCAL)
	let generatedCount = 0;
	for (const spec of activeSpecs) {
		const content = generateDomainDoc(spec, allDomains, xcshConfig);
		const outputPath = path.join(outputDir, `${spec.domain}.md`);
		fs.writeFileSync(outputPath, content, "utf-8");
		generatedCount++;
	}

	console.log(`✓ Generated ${generatedCount} domain documentation files`);

	// Generate index
	const indexContent = generateIndexDoc(activeSpecs, specIndex.version);
	const indexOutputPath = path.join(outputDir, "index.md");
	fs.writeFileSync(indexOutputPath, indexContent, "utf-8");
	console.log(`✓ Generated: ${indexOutputPath}`);

	// Generate quick reference from LOCAL config
	if (xcshConfig) {
		const quickRefContent = generateQuickReferenceDoc(xcshConfig);
		const quickRefPath = path.join(outputDir, "quick-reference.md");
		fs.writeFileSync(quickRefPath, quickRefContent, "utf-8");
		console.log(`✓ Generated: ${quickRefPath}`);
	}

	console.log(`✅ Documentation generation complete!`);
	console.log(`   - UPSTREAM: Resource descriptions, best practices`);
	console.log(`   - LOCAL: CLI command syntax, xcsh-specific workflows`);
}

main().catch((err) => {
	console.error("❌ Generation failed:", err);
	process.exit(1);
});
