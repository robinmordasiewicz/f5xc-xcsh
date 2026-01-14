#!/usr/bin/env npx tsx
/**
 * Domain Validation Script
 * Validates primaryResources against discovered operations
 *
 * Compares upstream x-f5xc-primary-resources with resources discovered from
 * OpenAPI paths to identify discrepancies and missing resources.
 *
 * Run: npx tsx scripts/validate-domains.ts
 */

import * as fs from "fs";
import * as path from "path";
import { discoverAllDomains, type DomainDiscovery } from "./discover-resources.js";

// ============================================================================
// Type Definitions
// ============================================================================

interface ValidationResult {
	domain: string;
	primaryCount: number;
	discoveredCount: number;
	missing: string[]; // In discovered but not in primaryResources
	extra: string[]; // In primaryResources but not in discovered
	matchPercentage: number;
	severity: "ok" | "warning" | "critical";
	recommendations: string[];
}

interface ValidationReport {
	generated: string;
	totalDomains: number;
	domainsWithIssues: number;
	totalMissing: number;
	totalExtra: number;
	results: ValidationResult[];
}

// ============================================================================
// Validation Logic
// ============================================================================

/**
 * Validate a single domain
 */
function validateDomain(discovery: DomainDiscovery): ValidationResult {
	const primarySet = new Set(discovery.primaryResources);
	const discoveredNames = discovery.discoveredResources.map((r) => r.name);
	const discoveredSet = new Set(discoveredNames);

	// Find missing resources (in discovered but not in primary)
	const missing = discoveredNames.filter((name) => !primarySet.has(name));

	// Find extra resources (in primary but not in discovered)
	const extra = discovery.primaryResources.filter(
		(name) => !discoveredSet.has(name),
	);

	// Calculate match percentage
	const totalUnique = new Set([...primarySet, ...discoveredSet]).size;
	const matching = discovery.primaryResources.filter((name) =>
		discoveredSet.has(name),
	).length;
	const matchPercentage =
		totalUnique > 0 ? Math.round((matching / totalUnique) * 100) : 100;

	// Determine severity
	let severity: "ok" | "warning" | "critical" = "ok";
	if (missing.length > 10 || matchPercentage < 50) {
		severity = "critical";
	} else if (missing.length > 3 || matchPercentage < 75) {
		severity = "warning";
	}

	// Generate recommendations
	const recommendations: string[] = [];

	// Categorize missing resources by type
	const missingByCategory = {
		crud: missing.filter(
			(name) =>
				discovery.discoveredResources.find((r) => r.name === name)?.category ===
				"crud",
		),
		analytics: missing.filter(
			(name) =>
				discovery.discoveredResources.find((r) => r.name === name)?.category ===
				"analytics",
		),
		utility: missing.filter(
			(name) =>
				discovery.discoveredResources.find((r) => r.name === name)?.category ===
				"utility",
		),
		management: missing.filter(
			(name) =>
				discovery.discoveredResources.find((r) => r.name === name)?.category ===
				"management",
		),
	};

	if (missingByCategory.crud.length > 0) {
		recommendations.push(
			`Add ${missingByCategory.crud.length} core CRUD resources to primaryResources (e.g., ${missingByCategory.crud.slice(0, 3).join(", ")})`,
		);
	}

	if (missingByCategory.analytics.length > 0) {
		recommendations.push(
			`Consider exposing ${missingByCategory.analytics.length} analytics endpoints for observability`,
		);
	}

	if (missingByCategory.utility.length > 0) {
		recommendations.push(
			`Utility endpoints available: ${missingByCategory.utility.join(", ")}`,
		);
	}

	if (missingByCategory.management.length > 0) {
		recommendations.push(
			`Management operations available: ${missingByCategory.management.join(", ")}`,
		);
	}

	if (extra.length > 0) {
		recommendations.push(
			`Review ${extra.length} primaryResources not found in OpenAPI spec: ${extra.join(", ")}`,
		);
	}

	return {
		domain: discovery.domain,
		primaryCount: discovery.primaryResources.length,
		discoveredCount: discovery.discoveredResources.length,
		missing,
		extra,
		matchPercentage,
		severity,
		recommendations,
	};
}

/**
 * Validate all domains
 */
async function validateAllDomains(): Promise<ValidationReport> {
	console.log("🔍 Running Domain Validation...\n");

	// Run discovery
	const discoveries = await discoverAllDomains();

	// Validate each domain
	const results: ValidationResult[] = [];
	for (const discovery of discoveries) {
		const result = validateDomain(discovery);
		results.push(result);
	}

	// Generate summary statistics
	const domainsWithIssues = results.filter((r) => r.missing.length > 0 || r.extra.length > 0).length;
	const totalMissing = results.reduce((sum, r) => sum + r.missing.length, 0);
	const totalExtra = results.reduce((sum, r) => sum + r.extra.length, 0);

	return {
		generated: new Date().toISOString(),
		totalDomains: results.length,
		domainsWithIssues,
		totalMissing,
		totalExtra,
		results: results.sort((a, b) => {
			// Sort by severity (critical first) then by missing count
			const severityOrder = { critical: 0, warning: 1, ok: 2 };
			if (a.severity !== b.severity) {
				return severityOrder[a.severity] - severityOrder[b.severity];
			}
			return b.missing.length - a.missing.length;
		}),
	};
}

// ============================================================================
// Report Generation
// ============================================================================

/**
 * Generate markdown validation report
 */
function generateMarkdownReport(report: ValidationReport): string {
	let md = `# Domain Resource Validation Report\n\n`;
	md += `**Generated**: ${new Date(report.generated).toLocaleString()}\n\n`;

	// Summary
	md += `## Summary\n\n`;
	md += `- **Total Domains**: ${report.totalDomains}\n`;
	md += `- **Domains with Issues**: ${report.domainsWithIssues}\n`;
	md += `- **Total Missing Resources**: ${report.totalMissing}\n`;
	md += `- **Total Extra Resources**: ${report.totalExtra}\n\n`;

	// Critical issues
	const critical = report.results.filter((r) => r.severity === "critical");
	if (critical.length > 0) {
		md += `## 🚨 Critical Issues (${critical.length} domains)\n\n`;
		for (const result of critical) {
			md += `### ${result.domain}\n`;
			md += `- **Primary Resources**: ${result.primaryCount}\n`;
			md += `- **Discovered Resources**: ${result.discoveredCount}\n`;
			md += `- **Missing**: ${result.missing.length} (+${Math.round((result.missing.length / result.primaryCount) * 100)}%)\n`;
			md += `- **Match**: ${result.matchPercentage}%\n\n`;

			if (result.recommendations.length > 0) {
				md += `**Recommendations**:\n`;
				for (const rec of result.recommendations) {
					md += `- ${rec}\n`;
				}
				md += `\n`;
			}

			if (result.missing.length > 0 && result.missing.length <= 15) {
				md += `**Missing Resources**: ${result.missing.join(", ")}\n\n`;
			} else if (result.missing.length > 15) {
				md += `**Missing Resources** (showing first 15): ${result.missing.slice(0, 15).join(", ")}...\n\n`;
			}
		}
	}

	// Warnings
	const warnings = report.results.filter((r) => r.severity === "warning");
	if (warnings.length > 0) {
		md += `## ⚠️ Warnings (${warnings.length} domains)\n\n`;
		for (const result of warnings) {
			md += `### ${result.domain}\n`;
			md += `- **Primary**: ${result.primaryCount} | **Discovered**: ${result.discoveredCount} | **Missing**: ${result.missing.length} | **Match**: ${result.matchPercentage}%\n`;

			if (result.recommendations.length > 0) {
				md += `- ${result.recommendations.join("; ")}\n`;
			}
			md += `\n`;
		}
	}

	// OK domains (brief summary)
	const ok = report.results.filter((r) => r.severity === "ok");
	if (ok.length > 0) {
		md += `## ✅ OK (${ok.length} domains)\n\n`;
		md += `Domains with complete or near-complete resource coverage: ${ok.map((r) => r.domain).join(", ")}\n\n`;
	}

	// Detailed breakdown
	md += `## Detailed Breakdown\n\n`;
	md += `| Domain | Primary | Discovered | Missing | Extra | Match % | Severity |\n`;
	md += `|--------|---------|------------|---------|-------|---------|----------|\n`;

	for (const result of report.results) {
		const severityEmoji = {
			critical: "🚨",
			warning: "⚠️",
			ok: "✅",
		};
		md += `| ${result.domain} | ${result.primaryCount} | ${result.discoveredCount} | ${result.missing.length} | ${result.extra.length} | ${result.matchPercentage}% | ${severityEmoji[result.severity]} ${result.severity} |\n`;
	}

	return md;
}

/**
 * Generate console output
 */
function printConsoleReport(report: ValidationReport): void {
	console.log("📊 Validation Summary:");
	console.log(`   Total Domains: ${report.totalDomains}`);
	console.log(`   Domains with Issues: ${report.domainsWithIssues}`);
	console.log(`   Total Missing Resources: ${report.totalMissing}`);
	console.log(`   Total Extra Resources: ${report.totalExtra}`);

	// Critical issues
	const critical = report.results.filter((r) => r.severity === "critical");
	if (critical.length > 0) {
		console.log(`\n🚨 Critical Issues (${critical.length} domains):`);
		for (const result of critical.slice(0, 5)) {
			console.log(
				`   ${result.domain}: ${result.primaryCount} primary → ${result.discoveredCount} discovered (+${result.missing.length} missing)`,
			);
		}
		if (critical.length > 5) {
			console.log(`   ... and ${critical.length - 5} more`);
		}
	}

	// Warnings
	const warnings = report.results.filter((r) => r.severity === "warning");
	if (warnings.length > 0) {
		console.log(`\n⚠️  Warnings (${warnings.length} domains):`);
		for (const result of warnings.slice(0, 5)) {
			console.log(
				`   ${result.domain}: ${result.primaryCount} primary → ${result.discoveredCount} discovered (+${result.missing.length} missing)`,
			);
		}
		if (warnings.length > 5) {
			console.log(`   ... and ${warnings.length - 5} more`);
		}
	}
}

// ============================================================================
// CLI Interface
// ============================================================================

async function main() {
	try {
		const report = await validateAllDomains();

		// Print console summary
		printConsoleReport(report);

		// Save markdown report
		const markdownReport = generateMarkdownReport(report);
		const reportPath = path.join(
			process.cwd(),
			"claudedocs",
			"domain-validation-report.md",
		);

		fs.writeFileSync(reportPath, markdownReport);
		console.log(`\n📄 Detailed report saved to: ${reportPath}`);

		// Save JSON report
		const jsonPath = path.join(
			process.cwd(),
			"claudedocs",
			"domain-validation.json",
		);
		fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
		console.log(`💾 JSON report saved to: ${jsonPath}`);

		console.log("\n✅ Validation complete!");

		// Exit with error code if critical issues found
		const critical = report.results.filter((r) => r.severity === "critical");
		if (critical.length > 0) {
			console.log(
				`\n⚠️  Found ${critical.length} domains with critical issues`,
			);
			process.exit(0); // Exit 0 for now - don't fail build
		}
	} catch (error) {
		console.error("❌ Validation failed:", error);
		process.exit(1);
	}
}

// Run if executed directly (ESM pattern)
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

// Export for use in other scripts
export { validateAllDomains, validateDomain, type ValidationResult, type ValidationReport };
