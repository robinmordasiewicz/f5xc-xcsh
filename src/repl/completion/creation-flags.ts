/**
 * Creation Flags Registry
 *
 * Defines resource-specific flags for create/apply actions.
 * When a user types "create healthcheck <tab>", they should see
 * creation flags (--name, --type, etc.) instead of existing resource names.
 */

/**
 * Definition for a creation flag
 */
export interface CreationFlagDefinition {
	/** The full flag name (e.g., "--type") */
	name: string;
	/** Short form alias (e.g., "-t") */
	shortName?: string;
	/** Description shown in completion menu */
	description: string;
	/** Whether this flag is required for resource creation */
	required: boolean;
	/** Whether this flag expects a value */
	hasValue: boolean;
	/** Type of value expected */
	valueType?: "string" | "integer" | "enum";
	/** Allowed values for enum types */
	enumValues?: string[];
	/** Whether this flag can be specified multiple times (e.g., origin servers) */
	isRepeatable?: boolean;
	/** Maximum number of times the flag can be used (for repeatable flags) */
	maxOccurrences?: number;
}

/**
 * Healthcheck creation flags
 * Based on F5 XC healthcheck resource schema
 */
export const HEALTHCHECK_CREATION_FLAGS: CreationFlagDefinition[] = [
	// Required flags
	{
		name: "--name",
		shortName: "-n",
		description: "Resource name",
		required: true,
		hasValue: true,
		valueType: "string",
	},
	{
		name: "--type",
		shortName: "-t",
		description: "Health check type",
		required: true,
		hasValue: true,
		valueType: "enum",
		enumValues: ["http", "tcp", "dns", "udp-icmp"],
	},
	{
		name: "--interval",
		description: "Interval between checks (1-600 sec)",
		required: true,
		hasValue: true,
		valueType: "integer",
	},
	{
		name: "--timeout",
		description: "Timeout for each check (1-600 sec)",
		required: true,
		hasValue: true,
		valueType: "integer",
	},
	{
		name: "--healthy-threshold",
		description: "Successes before healthy (1-16)",
		required: true,
		hasValue: true,
		valueType: "integer",
	},
	{
		name: "--unhealthy-threshold",
		description: "Failures before unhealthy (1-16)",
		required: true,
		hasValue: true,
		valueType: "integer",
	},
	// HTTP-specific (conditionally required when type=http)
	{
		name: "--path",
		description: "HTTP path to check",
		required: false,
		hasValue: true,
		valueType: "string",
	},
	{
		name: "--expected-status",
		description: "Expected HTTP status codes",
		required: false,
		hasValue: true,
		valueType: "string",
	},
	{
		name: "--host-header",
		description: "Host header value",
		required: false,
		hasValue: true,
		valueType: "string",
	},
	{
		name: "--use-origin-server-name",
		description: "Use origin server hostname",
		required: false,
		hasValue: false,
	},
	{
		name: "--use-http2",
		description: "Use HTTP/2",
		required: false,
		hasValue: false,
	},
];

/**
 * Origin Pool creation flags
 * Based on F5 XC origin_pool resource schema
 */
export const ORIGIN_POOL_CREATION_FLAGS: CreationFlagDefinition[] = [
	// Required - Name
	{
		name: "--name",
		shortName: "-n",
		description: "Origin pool name",
		required: true,
		hasValue: true,
		valueType: "string",
	},

	// Port configuration (mutually exclusive group)
	{
		name: "--port",
		description: "Backend port (1-65535)",
		required: false,
		hasValue: true,
		valueType: "integer",
	},
	{
		name: "--automatic-port",
		description: "Use automatic port selection",
		required: false,
		hasValue: false,
	},
	{
		name: "--lb-port",
		description: "Use load balancer port",
		required: false,
		hasValue: false,
	},

	// Origin Server Types (ALL 10 - REPEATABLE)
	{
		name: "--public-ip",
		description: "Public IP origin server (repeatable)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 32,
	},
	{
		name: "--public-name",
		description: "Public DNS name origin (repeatable)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 32,
	},
	{
		name: "--private-ip",
		description: "Private IP origin (site required) (repeatable)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 32,
	},
	{
		name: "--private-name",
		description: "Private DNS name origin (site required) (repeatable)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 32,
	},
	{
		name: "--k8s-service",
		description:
			"Kubernetes service origin (format: namespace/service) (repeatable)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 32,
	},
	{
		name: "--consul-service",
		description: "Consul service origin (repeatable)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 32,
	},
	{
		name: "--custom-endpoint",
		description: "Custom endpoint object reference (repeatable)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 32,
	},
	{
		name: "--vn-private-ip",
		description: "Virtual network private IP (repeatable)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 32,
	},
	{
		name: "--vn-private-name",
		description: "Virtual network private DNS name (repeatable)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 32,
	},
	{
		name: "--cbip-service",
		description: "Cloud-based IP service (repeatable)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 32,
	},

	// Load Balancing Algorithm
	{
		name: "--algorithm",
		description: "Load balancing algorithm",
		required: false,
		hasValue: true,
		valueType: "enum",
		enumValues: [
			"ROUND_ROBIN",
			"LEAST_ACTIVE",
			"RANDOM",
			"SOURCE_IP_STICKINESS",
			"COOKIE_STICKINESS",
			"RING_HASH",
		],
	},

	// Health Checks (repeatable, max 4)
	{
		name: "--health-check",
		description: "Health check reference (repeatable, max 4)",
		required: false,
		hasValue: true,
		valueType: "string",
		isRepeatable: true,
		maxOccurrences: 4,
	},

	// TLS Configuration
	{
		name: "--no-tls",
		description: "Disable TLS for origin connections",
		required: false,
		hasValue: false,
	},
	{
		name: "--use-tls",
		description: "Enable TLS for origin connections",
		required: false,
		hasValue: false,
	},

	// Site reference (for private origins)
	{
		name: "--site",
		description: "Site reference for private origins",
		required: false,
		hasValue: true,
		valueType: "string",
	},
];

/**
 * Registry mapping resource types to their creation flags
 */
export const CREATION_FLAGS_REGISTRY = new Map<
	string,
	CreationFlagDefinition[]
>([
	["healthcheck", HEALTHCHECK_CREATION_FLAGS],
	["origin_pool", ORIGIN_POOL_CREATION_FLAGS],
]);

/**
 * Get creation flags for a resource type
 * @param resourceType - The resource type name (e.g., "healthcheck")
 * @returns Array of creation flag definitions, or empty array if not defined
 */
export function getCreationFlags(
	resourceType: string,
): CreationFlagDefinition[] {
	return CREATION_FLAGS_REGISTRY.get(resourceType) ?? [];
}

/**
 * Check if a resource type has creation flags defined
 * @param resourceType - The resource type name
 * @returns true if creation flags are defined for this resource type
 */
export function hasCreationFlags(resourceType: string): boolean {
	return CREATION_FLAGS_REGISTRY.has(resourceType);
}

/**
 * Get all flag names (including aliases) for a resource type
 * Used for filtering out already-used flags
 */
export function getAllCreationFlagNames(resourceType: string): Set<string> {
	const flags = getCreationFlags(resourceType);
	const names = new Set<string>();

	for (const flag of flags) {
		names.add(flag.name);
		if (flag.shortName) {
			names.add(flag.shortName);
		}
	}

	return names;
}
