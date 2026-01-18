/**
 * Healthcheck Resource Builder
 *
 * Converts parsed CLI flags into F5 XC API request body for healthcheck resources.
 */

import {
	ParsedCreationFlags,
	getFlagValue,
	getFlagValues,
	getFlagIntValue,
	isFlagSet,
} from "../flag-parser.js";
import { toApiHex } from "../../../utils/hex-encoding.js";

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
			use_origin_server_name?: Record<string, unknown>; // Empty object choice field
			use_http2?: boolean;
			expected_status_codes?: string[];
			headers?: Record<string, string>;
			request_headers_to_remove?: string[];
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
		jitter_percent?: number;
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
 * Validate HTTP status code or range format
 * Valid formats: "200", "200-299", "404"
 */
function isValidHttpStatusCodeOrRange(codeStr: string): boolean {
	// Single code: 3 digits, 100-599
	const singleCodeMatch = /^(\d{3})$/.exec(codeStr);
	if (singleCodeMatch && singleCodeMatch[1]) {
		const code = parseInt(singleCodeMatch[1], 10);
		return code >= 100 && code <= 599;
	}

	// Range: format "200-299"
	const rangeMatch = /^(\d{3})-(\d{3})$/.exec(codeStr);
	if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
		const start = parseInt(rangeMatch[1], 10);
		const end = parseInt(rangeMatch[2], 10);
		return (
			start >= 100 &&
			start <= 599 &&
			end >= 100 &&
			end <= 599 &&
			start <= end
		);
	}

	return false;
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
	const jitterPercent = getFlagIntValue(flags, "--jitter-percent");

	// Build base request
	const request: HealthcheckRequestBody = {
		metadata: {
			name: name || "",
			namespace: namespace,
		},
		spec: {
			timeout: timeout ?? 3,
			interval: interval ?? 15,
			healthy_threshold: healthyThreshold ?? 3,
			unhealthy_threshold: unhealthyThreshold ?? 1,
			jitter_percent: jitterPercent ?? 30,
		},
	};

	// Add type-specific configuration
	switch (type) {
		case "http": {
			const path = getFlagValue(flags, "--path") || "/";

			// Build HTTP health check configuration
			request.spec.http_health_check = {
				path: path,
			};

			// use_origin_server_name: Empty object type (choice field)
			// Only include when flag is set
			if (isFlagSet(flags, "--use-origin-server-name")) {
				request.spec.http_health_check.use_origin_server_name = {};
			}

			// use_http2: Boolean type
			// Include as boolean value when flag is set
			if (isFlagSet(flags, "--use-http2")) {
				request.spec.http_health_check.use_http2 = true;
			}

			// Handle --expected-status-codes (repeatable array with range support)
			const expectedStatusCodes = getFlagValues(
				flags,
				"--expected-status-codes",
			);

			if (expectedStatusCodes.length > 0) {
				// Validate each status code (single code or range like "200-299")
				for (const code of expectedStatusCodes) {
					if (!isValidHttpStatusCodeOrRange(code)) {
						throw new Error(
							`Invalid HTTP status code or range: ${code}. Use format '200' or '200-299'`,
						);
					}
				}
				request.spec.http_health_check.expected_status_codes =
					expectedStatusCodes;
			}

			// Parse custom headers from --headers flags
			const customHeaders = getFlagValues(flags, "--headers");
			const headersObj: Record<string, string> = {};

			// Add Host header if specified via --host-header
			const hostHeader = getFlagValue(flags, "--host-header");
			if (hostHeader) {
				headersObj.Host = hostHeader;
			}

			// Parse and add custom headers from --headers flags
			for (const headerStr of customHeaders) {
				const colonIndex = headerStr.indexOf(":");
				if (colonIndex === -1) {
					throw new Error(
						`Invalid header format: ${headerStr}. Expected 'Key:Value'`,
					);
				}

				const key = headerStr.substring(0, colonIndex).trim();
				const value = headerStr.substring(colonIndex + 1).trim();

				// Validate key and value lengths (API constraints)
				if (key.length === 0 || key.length > 256) {
					throw new Error(
						`Header key length must be 1-256 chars: ${key}`,
					);
				}
				if (value.length === 0 || value.length > 2048) {
					throw new Error(
						`Header value length must be 1-2048 chars: ${value}`,
					);
				}

				// Check for duplicate keys
				if (headersObj[key]) {
					console.warn(
						`Duplicate header key '${key}'. Using last value.`,
					);
				}

				headersObj[key] = value;
			}

			// Only add headers field if there are headers to add
			if (Object.keys(headersObj).length > 0) {
				request.spec.http_health_check.headers = headersObj;
			}

			// Parse request_headers_to_remove flags (repeatable)
			// Note: maxOccurrences (16) is validated by the flag parser
			const requestHeadersToRemove = getFlagValues(
				flags,
				"--request-headers-to-remove",
			);
			if (requestHeadersToRemove.length > 0) {
				// Validate each header string (max 256 chars per API spec)
				for (const header of requestHeadersToRemove) {
					if (header.length > 256) {
						throw new Error(
							`Header name too long (max 256 chars): ${header}`,
						);
					}
				}

				request.spec.http_health_check.request_headers_to_remove =
					requestHeadersToRemove;
			}
			break;
		}

		case "tcp": {
			request.spec.tcp_health_check = {};

			// Handle --send-payload (optional)
			const sendPayload = getFlagValue(flags, "--send-payload");
			if (sendPayload) {
				try {
					request.spec.tcp_health_check.send_payload =
						toApiHex(sendPayload);
				} catch (error) {
					throw new Error(
						`Invalid --send-payload: ${error instanceof Error ? error.message : "must be hex or plain text"}`,
					);
				}
			}

			// Handle --expected-response (optional)
			const expectedResponse = getFlagValue(flags, "--expected-response");
			if (expectedResponse) {
				try {
					request.spec.tcp_health_check.expected_response =
						toApiHex(expectedResponse);
				} catch (error) {
					throw new Error(
						`Invalid --expected-response: ${error instanceof Error ? error.message : "must be hex or plain text"}`,
					);
				}
			}

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
	if (interval !== undefined && (interval < 1 || interval > 600)) {
		errors.push("--interval must be between 1 and 600 seconds");
	}

	const timeout = getFlagIntValue(flags, "--timeout");
	if (timeout !== undefined && (timeout < 1 || timeout > 600)) {
		errors.push("--timeout must be between 1 and 600 seconds");
	}

	const healthyThreshold = getFlagIntValue(flags, "--healthy-threshold");
	if (
		healthyThreshold !== undefined &&
		(healthyThreshold < 1 || healthyThreshold > 16)
	) {
		errors.push("--healthy-threshold must be between 1 and 16");
	}

	const unhealthyThreshold = getFlagIntValue(flags, "--unhealthy-threshold");
	if (
		unhealthyThreshold !== undefined &&
		(unhealthyThreshold < 1 || unhealthyThreshold > 16)
	) {
		errors.push("--unhealthy-threshold must be between 1 and 16");
	}

	// Type-specific validation
	if (type === "http") {
		// Path should start with /
		const path = getFlagValue(flags, "--path");
		if (path && !path.startsWith("/")) {
			errors.push("--path must start with /");
		}

		// Validate jitter_percent range (0, or 10-50)
		const jitterPercent = getFlagIntValue(flags, "--jitter-percent");
		if (jitterPercent !== undefined) {
			if (
				jitterPercent !== 0 &&
				(jitterPercent < 10 || jitterPercent > 50)
			) {
				errors.push("--jitter-percent must be 0 or between 10 and 50");
			}
		}

		// Validate expected status codes format
		const expectedStatusCodes = getFlagValues(
			flags,
			"--expected-status-codes",
		);

		for (const code of expectedStatusCodes) {
			if (!isValidHttpStatusCodeOrRange(code)) {
				errors.push(
					`Invalid HTTP status code or range: ${code}. Use format '200' or '200-299'`,
				);
			}
		}

		// Validate custom headers format
		const customHeaders = getFlagValues(flags, "--headers");
		for (const headerStr of customHeaders) {
			if (!headerStr.includes(":")) {
				errors.push(
					`Invalid --headers format: ${headerStr}. Expected 'Key:Value'`,
				);
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
