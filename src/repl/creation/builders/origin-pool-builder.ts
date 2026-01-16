/**
 * Origin Pool Resource Builder
 *
 * Converts parsed CLI flags into F5 XC API request body for origin_pool resources.
 */

import {
	ParsedCreationFlags,
	getFlagValue,
	getFlagValues,
	getFlagIntValue,
	isFlagSet,
} from "../flag-parser.js";

/**
 * Origin server type in F5 XC API
 */
interface OriginServer {
	public_ip?: { ip: string };
	public_name?: { dns_name: string };
	private_ip?: {
		ip: string;
		site_locator?: { site: { name: string; namespace: string } };
	};
	private_name?: {
		dns_name: string;
		site_locator?: { site: { name: string; namespace: string } };
	};
	k8s_service?: {
		service_name: string;
		site_locator?: { site: { name: string; namespace: string } };
	};
	consul_service?: {
		service_name: string;
		site_locator?: { site: { name: string; namespace: string } };
	};
	custom_endpoint_object?: { endpoint: { name: string; namespace: string } };
	vn_private_ip?: {
		ip: string;
		virtual_network?: { name: string; namespace: string };
	};
	vn_private_name?: {
		dns_name: string;
		virtual_network?: { name: string; namespace: string };
	};
	labels?: Record<string, string>;
}

/**
 * F5 XC Origin Pool API request body structure
 */
export interface OriginPoolRequestBody {
	metadata: {
		name: string;
		namespace: string;
		labels?: Record<string, string>;
		annotations?: Record<string, string>;
	};
	spec: {
		origin_servers: OriginServer[];
		port?: number;
		automatic_port?: Record<string, unknown>;
		lb_port?: Record<string, unknown>;
		loadbalancer_algorithm?:
			| "ROUND_ROBIN"
			| "LEAST_ACTIVE"
			| "RANDOM"
			| "SOURCE_IP_STICKINESS"
			| "COOKIE_STICKINESS"
			| "RING_HASH";
		no_tls?: Record<string, unknown>;
		use_tls?: {
			use_host_header_as_sni?: Record<string, unknown>;
			tls_config?: {
				default_security?: Record<string, unknown>;
			};
			skip_server_verification?: Record<string, unknown>;
		};
		healthcheck?: Array<{ name: string; namespace?: string }>;
	};
}

/**
 * Validation result from builder
 */
export interface BuilderValidationResult {
	valid: boolean;
	errors: string[];
}

/**
 * Build origin pool API request body from parsed flags
 *
 * @param flags - Parsed creation flags
 * @param namespace - Target namespace
 * @returns Origin pool request body ready for API POST
 */
export function buildOriginPoolRequest(
	flags: ParsedCreationFlags,
	namespace: string,
): OriginPoolRequestBody {
	const name = getFlagValue(flags, "--name");
	const port = getFlagIntValue(flags, "--port");
	const algorithm = getFlagValue(flags, "--algorithm");
	const site = getFlagValue(flags, "--site");

	// Build origin servers from repeatable flags
	const originServers: OriginServer[] = [];

	// Public IP origins
	const publicIps = getFlagValues(flags, "--public-ip");
	for (const ip of publicIps) {
		originServers.push({ public_ip: { ip } });
	}

	// Public name origins
	const publicNames = getFlagValues(flags, "--public-name");
	for (const dnsName of publicNames) {
		originServers.push({ public_name: { dns_name: dnsName } });
	}

	// Private IP origins (require site)
	const privateIps = getFlagValues(flags, "--private-ip");
	for (const ip of privateIps) {
		const origin: OriginServer = {
			private_ip: { ip },
		};
		if (site) {
			origin.private_ip!.site_locator = {
				site: { name: site, namespace: "system" },
			};
		}
		originServers.push(origin);
	}

	// Private name origins (require site)
	const privateNames = getFlagValues(flags, "--private-name");
	for (const dnsName of privateNames) {
		const origin: OriginServer = {
			private_name: { dns_name: dnsName },
		};
		if (site) {
			origin.private_name!.site_locator = {
				site: { name: site, namespace: "system" },
			};
		}
		originServers.push(origin);
	}

	// K8s service origins
	const k8sServices = getFlagValues(flags, "--k8s-service");
	for (const svc of k8sServices) {
		const origin: OriginServer = {
			k8s_service: { service_name: svc },
		};
		if (site) {
			origin.k8s_service!.site_locator = {
				site: { name: site, namespace: "system" },
			};
		}
		originServers.push(origin);
	}

	// Consul service origins
	const consulServices = getFlagValues(flags, "--consul-service");
	for (const svc of consulServices) {
		const origin: OriginServer = {
			consul_service: { service_name: svc },
		};
		if (site) {
			origin.consul_service!.site_locator = {
				site: { name: site, namespace: "system" },
			};
		}
		originServers.push(origin);
	}

	// Custom endpoint origins
	const customEndpoints = getFlagValues(flags, "--custom-endpoint");
	for (const endpoint of customEndpoints) {
		originServers.push({
			custom_endpoint_object: {
				endpoint: { name: endpoint, namespace: namespace },
			},
		});
	}

	// VN private IP origins
	const vnPrivateIps = getFlagValues(flags, "--vn-private-ip");
	for (const ip of vnPrivateIps) {
		originServers.push({
			vn_private_ip: { ip },
		});
	}

	// VN private name origins
	const vnPrivateNames = getFlagValues(flags, "--vn-private-name");
	for (const dnsName of vnPrivateNames) {
		originServers.push({
			vn_private_name: { dns_name: dnsName },
		});
	}

	// Build base request
	const request: OriginPoolRequestBody = {
		metadata: {
			name: name || "",
			namespace: namespace,
		},
		spec: {
			origin_servers: originServers,
		},
	};

	// Port configuration (mutually exclusive)
	if (port !== undefined) {
		request.spec.port = port;
	} else if (isFlagSet(flags, "--automatic-port")) {
		request.spec.automatic_port = {};
	} else if (isFlagSet(flags, "--lb-port")) {
		request.spec.lb_port = {};
	}

	// Load balancing algorithm
	if (algorithm) {
		request.spec.loadbalancer_algorithm = algorithm as
			| "ROUND_ROBIN"
			| "LEAST_ACTIVE"
			| "RANDOM"
			| "SOURCE_IP_STICKINESS"
			| "COOKIE_STICKINESS"
			| "RING_HASH";
	}

	// TLS configuration (mutually exclusive)
	if (isFlagSet(flags, "--no-tls")) {
		request.spec.no_tls = {};
	} else if (isFlagSet(flags, "--use-tls")) {
		request.spec.use_tls = {
			use_host_header_as_sni: {},
			tls_config: {
				default_security: {},
			},
			skip_server_verification: {},
		};
	}

	// Health checks
	const healthChecks = getFlagValues(flags, "--health-check");
	if (healthChecks.length > 0) {
		request.spec.healthcheck = healthChecks.map((hc) => ({
			name: hc,
			namespace: namespace,
		}));
	}

	return request;
}

/**
 * Validate origin pool flags before building
 *
 * @param flags - Parsed creation flags
 * @returns Validation result with errors if any
 */
export function validateOriginPoolFlags(
	flags: ParsedCreationFlags,
): BuilderValidationResult {
	const errors: string[] = [];

	// Check required fields
	const name = getFlagValue(flags, "--name");
	if (!name) {
		errors.push("--name is required");
	} else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(name) && name.length > 1) {
		errors.push(
			"--name must contain only lowercase alphanumeric characters and hyphens",
		);
	}

	// Check for at least one origin server
	const originFlagNames = [
		"--public-ip",
		"--public-name",
		"--private-ip",
		"--private-name",
		"--k8s-service",
		"--consul-service",
		"--custom-endpoint",
		"--vn-private-ip",
		"--vn-private-name",
		"--cbip-service",
	];

	let hasOrigin = false;
	for (const flagName of originFlagNames) {
		if (getFlagValues(flags, flagName).length > 0) {
			hasOrigin = true;
			break;
		}
	}

	if (!hasOrigin) {
		errors.push(
			"At least one origin server is required (e.g., --public-ip, --public-name)",
		);
	}

	// Validate port
	const port = getFlagIntValue(flags, "--port");
	if (port !== undefined && (port < 1 || port > 65535)) {
		errors.push("--port must be between 1 and 65535");
	}

	// Check for mutually exclusive port options
	const portOptions = [
		isFlagSet(flags, "--port") || port !== undefined,
		isFlagSet(flags, "--automatic-port"),
		isFlagSet(flags, "--lb-port"),
	].filter(Boolean).length;

	if (portOptions > 1) {
		errors.push(
			"--port, --automatic-port, and --lb-port are mutually exclusive",
		);
	}

	// Check for mutually exclusive TLS options
	if (isFlagSet(flags, "--no-tls") && isFlagSet(flags, "--use-tls")) {
		errors.push("--no-tls and --use-tls are mutually exclusive");
	}

	// Validate private origins require site
	const privateIps = getFlagValues(flags, "--private-ip");
	const privateNames = getFlagValues(flags, "--private-name");
	const k8sServices = getFlagValues(flags, "--k8s-service");
	const consulServices = getFlagValues(flags, "--consul-service");

	if (
		(privateIps.length > 0 ||
			privateNames.length > 0 ||
			k8sServices.length > 0 ||
			consulServices.length > 0) &&
		!getFlagValue(flags, "--site")
	) {
		errors.push(
			"--site is required when using private origins (--private-ip, --private-name, --k8s-service, --consul-service)",
		);
	}

	// Validate health check count
	const healthChecks = getFlagValues(flags, "--health-check");
	if (healthChecks.length > 4) {
		errors.push("Maximum of 4 health checks allowed");
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
