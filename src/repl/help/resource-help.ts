import { getDomainInfo } from "../../types/domains.js";
import { CLI_NAME, colorBoldWhite } from "../../branding/index.js";
import { groupFlagsForHelp } from "./flag-grouping.js";
import { formatFlagEntry } from "./flag-formatter.js";
import { getUsageExamples } from "./examples.js";
import type { ExecutionResult } from "../executor.js";

export function formatResourceHelp(
	domain: string,
	resourceType: string,
	args: string[],
): ExecutionResult {
	const output: string[] = [];

	// Parse --type filter
	const typeFilter = extractTypeFilter(args);

	// Validate resource exists
	const domainInfo = getDomainInfo(domain);
	const allResources =
		domainInfo?.allResources || domainInfo?.primaryResources;
	const resource = allResources?.find((r) => r.name === resourceType);

	if (!resource) {
		return {
			output: [
				`Unknown resource: ${resourceType}`,
				"",
				`Available resources in ${domain}:`,
				...(allResources?.map((r) => `  ${r.name}`) || []),
			],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// NAME section
	output.push(colorBoldWhite("NAME"));
	const description = resource.description || resource.descriptionShort || "";
	output.push(`  ${resourceType} - ${description}`);
	output.push("");

	// SYNOPSIS section
	output.push(colorBoldWhite("SYNOPSIS"));
	output.push(`  ${CLI_NAME} ${domain} create ${resourceType} [options]`);
	if (typeFilter) {
		output.push(`  (showing only ${typeFilter} options)`);
	}
	output.push("");

	// DESCRIPTION section
	if (resource.description && resource.description !== description) {
		output.push(colorBoldWhite("DESCRIPTION"));
		output.push(`  ${resource.description}`);
		output.push("");
	}

	// FLAGS section (grouped)
	const groups = groupFlagsForHelp(resourceType, typeFilter);

	if (groups.length > 0) {
		output.push(colorBoldWhite("FLAGS"));
		output.push("");

		for (const group of groups) {
			output.push(colorBoldWhite(`  ${group.label}`));

			for (const flag of group.flags) {
				output.push(...formatFlagEntry(flag));
			}
		}
	}

	// EXAMPLES section
	const examples = getUsageExamples(domain, resourceType);
	if (examples.length > 0) {
		output.push(colorBoldWhite("EXAMPLES"));
		output.push("");

		for (const example of examples) {
			output.push(`  ${example.title}:`);
			output.push(`    ${example.command}`);
			output.push("");
		}
	}

	// SEE ALSO section
	output.push(colorBoldWhite("SEE ALSO"));
	output.push(`  ${CLI_NAME} ${domain} list ${resourceType}`);
	output.push(`  ${CLI_NAME} ${domain} get ${resourceType} <name>`);
	if (resource.dependencies?.optional?.length) {
		for (const dep of resource.dependencies.optional) {
			output.push(`  ${CLI_NAME} ${domain} help ${dep}`);
		}
	}
	output.push("");

	return {
		output,
		shouldExit: false,
		shouldClear: false,
		contextChanged: false,
	};
}

function extractTypeFilter(args: string[]): string | undefined {
	const typeIndex = args.findIndex((arg) => arg === "--type" || arg === "-t");
	return typeIndex >= 0 && typeIndex + 1 < args.length
		? args[typeIndex + 1]
		: undefined;
}
