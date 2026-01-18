import { getDomainInfo } from "../../types/domains.js";
import { formatDomainHelp } from "../help.js";
import { formatResourceHelp } from "./resource-help.js";
import type { ExecutionResult } from "../executor.js";

export interface HelpVerbOptions {
	session: any;
	ctx: any;
	domain: string;
	resourceType?: string;
	args: string[];
	domainResourceTypes: Set<string>;
}

export async function handleHelpVerb(
	options: HelpVerbOptions,
): Promise<ExecutionResult> {
	const { domain, resourceType, args } = options;

	// Check if user tried to specify a resource (even if not recognized)
	const attemptedResource = resourceType || args[0];

	if (!attemptedResource) {
		// Domain-level help: /virtual help
		const domainInfo = getDomainInfo(domain);
		if (!domainInfo) {
			return {
				output: [`Unknown domain: ${domain}`],
				shouldExit: false,
				shouldClear: false,
				contextChanged: false,
			};
		}

		return {
			output: formatDomainHelp(domainInfo),
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
		};
	}

	// Resource-specific help: /virtual help healthcheck
	// Use resourceType if it was recognized, otherwise use args[0] (which will fail in formatResourceHelp with proper error)
	return formatResourceHelp(domain, attemptedResource, args);
}
