/**
 * Flag Alias Registry
 *
 * Defines alias groups for flags - when any form is used,
 * all forms should be excluded from completion suggestions.
 */

/**
 * Flag alias groups - when any form is used, all forms should be excluded
 * Each group contains all equivalent forms of a flag (long form, short form)
 */
export const FLAG_ALIAS_GROUPS: ReadonlyArray<ReadonlyArray<string>> = [
	// Common flags
	["--namespace", "-ns"],
	["--output", "-o"],
	["--name", "-n"],
	["--file", "-f"],
	["--url", "-u"],
	["--limit"],
	["--label"],
	["--show-labels"],
	["--force"],
	["--cascade"],
	// Creation flags for healthcheck
	["--type", "-t"],
	["--interval"],
	["--timeout"],
	["--healthy-threshold"],
	["--unhealthy-threshold"],
	["--path"],
	["--expected-status"],
	["--host-header"],
	["--use-origin-server-name"],
	["--use-http2"],
	// Creation flags for origin_pool
	["--port"],
	["--automatic-port"],
	["--lb-port"],
	["--public-ip"],
	["--public-name"],
	["--private-ip"],
	["--private-name"],
	["--k8s-service"],
	["--consul-service"],
	["--custom-endpoint"],
	["--vn-private-ip"],
	["--vn-private-name"],
	["--cbip-service"],
	["--algorithm"],
	["--health-check"],
	["--no-tls"],
	["--use-tls"],
	["--site"],
];

/**
 * Build reverse lookup: any flag form -> all equivalent forms
 * This allows quick lookup of all aliases for any flag
 */
export function buildFlagAliasLookup(): Map<string, Set<string>> {
	const lookup = new Map<string, Set<string>>();
	for (const group of FLAG_ALIAS_GROUPS) {
		const allForms = new Set(group);
		for (const flag of group) {
			lookup.set(flag, allForms);
		}
	}
	return lookup;
}

/**
 * Pre-built lookup table for flag aliases
 */
export const FLAG_ALIAS_LOOKUP = buildFlagAliasLookup();
