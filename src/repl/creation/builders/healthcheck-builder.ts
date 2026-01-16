/**
 * Healthcheck Resource Builder
 *
 * Converts parsed CLI flags into F5 XC API request body for healthcheck resources.
 */

import {
	ParsedCreationFlags,
	getFlagValue,
	getFlagIntValue,
	isFlagSet,
} from "../flag-parser.js";

/**
 * F5 XC Healthcheck API request body structure
 */
export interface HealthcheckRequestBody {
	metadata: {
		name: string;
		namespace: string;
		labels?: Record<string, string>;
		annotations?: Record<string, string>;
	};
	spec: {
		http_health_check?: {
			path?: string;
			use_origin_server_name?: boolean;
			use_http2?: boolean;
			expected_status_codes?: string[];
			headers?: Record<string, string>;
		};
		tcp_health_check?: Record<string, unknown>;
		dns_health_check?: {
			name_to_resolve?: string;
			expected_response?: string;
		};
		timeout: number;
		interval: number;
		healthy_threshold: number;
		unhealthy_threshold: number;
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
 * Build healthcheck API request body from parsed flags
 *
 * @param flags - Parsed creation flags
 * @param namespace - Target namespace
 * @returns Healthcheck request body ready for API POST
 */
export function buildHealthcheckRequest(
	flags: ParsedCreationFlags,
	namespace: string,
): HealthcheckRequestBody {
	const name = getFlagValue(flags, "--name");
	const type = getFlagValue(flags, "--type");
	const interval = getFlagIntValue(flags, "--interval");
	const timeout = getFlagIntValue(flags, "--timeout");
	const healthyThreshold = getFlagIntValue(flags, "--healthy-threshold");
	const unhealthyThreshold = getFlagIntValue(flags, "--unhealthy-threshold");

	// Build base request
	const request: HealthcheckRequestBody = {
		metadata: {
			name: name || "",
			namespace: namespace,
		},
		spec: {
			timeout: timeout || 5,
			interval: interval || 10,
			healthy_threshold: healthyThreshold || 2,
			unhealthy_threshold: unhealthyThreshold || 3,
		},
	};

	// Add type-specific configuration
	switch (type) {
		case "http": {
			const path = getFlagValue(flags, "--path") || "/";
			const useOriginServerName = isFlagSet(
				flags,
				"--use-origin-server-name",
			);
			const useHttp2 = isFlagSet(flags, "--use-http2");
			const expectedStatus = getFlagValue(flags, "--expected-status");
			const hostHeader = getFlagValue(flags, "--host-header");

			request.spec.http_health_check = {
				path: path,
				use_origin_server_name: useOriginServerName,
				use_http2: useHttp2,
			};

			if (expectedStatus) {
				request.spec.http_health_check.expected_status_codes =
					expectedStatus.split(",").map((s) => s.trim());
			}

			if (hostHeader) {
				request.spec.http_health_check.headers = {
					Host: hostHeader,
				};
			}
			break;
		}

		case "tcp": {
			request.spec.tcp_health_check = {};
			break;
		}

		case "dns": {
			request.spec.dns_health_check = {};
			break;
		}

		case "udp-icmp": {
			// UDP-ICMP health check (basic config)
			// The API may have specific fields for this
			break;
		}
	}

	return request;
}

/**
 * Validate healthcheck flags before building
 *
 * @param flags - Parsed creation flags
 * @returns Validation result with errors if any
 */
export function validateHealthcheckFlags(
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

	const type = getFlagValue(flags, "--type");
	if (!type) {
		errors.push("--type is required (http, tcp, dns, or udp-icmp)");
	}

	const interval = getFlagIntValue(flags, "--interval");
	if (interval === undefined) {
		errors.push("--interval is required");
	} else if (interval < 1 || interval > 600) {
		errors.push("--interval must be between 1 and 600 seconds");
	}

	const timeout = getFlagIntValue(flags, "--timeout");
	if (timeout === undefined) {
		errors.push("--timeout is required");
	} else if (timeout < 1 || timeout > 600) {
		errors.push("--timeout must be between 1 and 600 seconds");
	}

	const healthyThreshold = getFlagIntValue(flags, "--healthy-threshold");
	if (healthyThreshold === undefined) {
		errors.push("--healthy-threshold is required");
	} else if (healthyThreshold < 1 || healthyThreshold > 16) {
		errors.push("--healthy-threshold must be between 1 and 16");
	}

	const unhealthyThreshold = getFlagIntValue(flags, "--unhealthy-threshold");
	if (unhealthyThreshold === undefined) {
		errors.push("--unhealthy-threshold is required");
	} else if (unhealthyThreshold < 1 || unhealthyThreshold > 16) {
		errors.push("--unhealthy-threshold must be between 1 and 16");
	}

	// Type-specific validation
	if (type === "http") {
		// Path should start with /
		const path = getFlagValue(flags, "--path");
		if (path && !path.startsWith("/")) {
			errors.push("--path must start with /");
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
