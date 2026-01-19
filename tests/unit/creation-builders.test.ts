/**
 * Resource Builders Unit Tests
 *
 * Tests for building API request bodies from parsed flags.
 */

import { describe, it, expect, vi } from "vitest";
import {
	buildHealthcheckRequest,
	validateHealthcheckFlags,
} from "../../src/repl/creation/builders/healthcheck-builder.js";
import {
	buildOriginPoolRequest,
	validateOriginPoolFlags,
} from "../../src/repl/creation/builders/origin-pool-builder.js";
import {
	getResourceBuilder,
	hasResourceBuilder,
	buildResource,
	validateResourceFlags,
} from "../../src/repl/creation/builders/index.js";
import { parseCreationFlags } from "../../src/repl/creation/flag-parser.js";

describe("Healthcheck Builder - buildHealthcheckRequest", () => {
	it("builds HTTP healthcheck request", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--path", "/health",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.metadata.name).toBe("test-hc");
		expect(request.metadata.namespace).toBe("default");
		expect(request.spec.interval).toBe(10);
		expect(request.spec.timeout).toBe(5);
		expect(request.spec.healthy_threshold).toBe(2);
		expect(request.spec.unhealthy_threshold).toBe(3);
		expect(request.spec.http_health_check).toBeDefined();
		expect(request.spec.http_health_check?.path).toBe("/health");
	});

	it("builds HTTP healthcheck with optional flags", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--use-http2",
			"--use-origin-server-name",
			"--expected-status-codes", "200",
			"--expected-status-codes", "201",
			"--expected-status-codes", "204",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		// use_http2 is a boolean field
		expect(request.spec.http_health_check?.use_http2).toBe(true);
		// use_origin_server_name is an empty object field (choice)
		expect(request.spec.http_health_check?.use_origin_server_name).toEqual({});
		expect(request.spec.http_health_check?.expected_status_codes).toEqual([
			"200",
			"201",
			"204",
		]);
	});

	it("omits use_origin_server_name when flag not set", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--path", "/health",
			// Note: --use-origin-server-name NOT set
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.http_health_check?.use_origin_server_name).toBeUndefined();
	});

	it("builds HTTP healthcheck with host_header as separate field", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--host-header", "api.example.com",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		// host_header should be a separate field, NOT in headers map
		expect(request.spec.http_health_check?.host_header).toBe("api.example.com");
		expect(request.spec.http_health_check?.headers?.Host).toBeUndefined();
		expect(request.spec.http_health_check?.use_origin_server_name).toBeUndefined();
	});

	it("builds HTTP healthcheck with custom headers separate from host_header", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--host-header", "api.example.com",
			"--headers", "X-Custom:value",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		// host_header is separate from headers map
		expect(request.spec.http_health_check?.host_header).toBe("api.example.com");
		expect(request.spec.http_health_check?.headers).toEqual({ "X-Custom": "value" });
		// Host should NOT be in headers map
		expect(request.spec.http_health_check?.headers?.Host).toBeUndefined();
	});

	it("prefers use_origin_server_name over host_header in builder (validation catches conflict)", () => {
		// When both flags are set, use_origin_server_name takes precedence in builder
		// (validation should catch this as an error, but builder has deterministic behavior)
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--use-origin-server-name",
			"--host-header", "example.com",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		// use_origin_server_name wins
		expect(request.spec.http_health_check?.use_origin_server_name).toEqual({});
		expect(request.spec.http_health_check?.host_header).toBeUndefined();
	});

	it("omits use_http2 when flag not set", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--path", "/health",
			// Note: --use-http2 NOT set
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.http_health_check?.use_http2).toBeUndefined();
	});

	it("builds HTTP healthcheck with single request header to remove", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--request-headers-to-remove", "X-Debug-Mode",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.http_health_check?.request_headers_to_remove).toEqual(["X-Debug-Mode"]);
	});

	it("builds HTTP healthcheck with multiple request headers to remove", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--request-headers-to-remove", "X-Debug-Mode",
			"--request-headers-to-remove", "X-Custom-Header",
			"--request-headers-to-remove", "X-Test-Flag",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.http_health_check?.request_headers_to_remove).toEqual([
			"X-Debug-Mode",
			"X-Custom-Header",
			"X-Test-Flag",
		]);
	});

	it("omits request_headers_to_remove when flag not set", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--path", "/health",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.http_health_check?.request_headers_to_remove).toBeUndefined();
	});

	it("rejects more than 16 request headers to remove (validation at parse time)", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--request-headers-to-remove", "Header-1",
			"--request-headers-to-remove", "Header-2",
			"--request-headers-to-remove", "Header-3",
			"--request-headers-to-remove", "Header-4",
			"--request-headers-to-remove", "Header-5",
			"--request-headers-to-remove", "Header-6",
			"--request-headers-to-remove", "Header-7",
			"--request-headers-to-remove", "Header-8",
			"--request-headers-to-remove", "Header-9",
			"--request-headers-to-remove", "Header-10",
			"--request-headers-to-remove", "Header-11",
			"--request-headers-to-remove", "Header-12",
			"--request-headers-to-remove", "Header-13",
			"--request-headers-to-remove", "Header-14",
			"--request-headers-to-remove", "Header-15",
			"--request-headers-to-remove", "Header-16",
			"--request-headers-to-remove", "Header-17",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		// The flag parser validates maxOccurrences at parse time
		expect(parsed.errors.length).toBeGreaterThan(0);
		expect(parsed.errors.some((e) => e.includes("can only be used 16 times"))).toBe(true);
	});

	it("rejects request header name longer than 256 characters", () => {
		const longHeader = "X-" + "A".repeat(255); // 257 characters total
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--request-headers-to-remove", longHeader,
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(() => buildHealthcheckRequest(parsed, "default")).toThrow(
			"Header name too long (max 256 chars)"
		);
	});

	it("builds TCP healthcheck request", () => {
		const args = [
			"--name", "test-hc",
			"--type", "tcp",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.tcp_health_check).toBeDefined();
		expect(request.spec.http_health_check).toBeUndefined();
	});

	it("encodes plain text payloads to hex in TCP healthcheck", () => {
		const args = [
			"--name", "test-hc",
			"--type", "tcp",
			"--interval", "10",
			"--timeout", "5",
			"--send-payload", "PING",
			"--expected-response", "OK",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.tcp_health_check).toBeDefined();
		expect(request.spec.tcp_health_check.send_payload).toBe("50494E47"); // "PING"
		expect(request.spec.tcp_health_check.expected_response).toBe("4F4B"); // "OK"
	});

	it("normalizes hex payloads with 0x prefix in TCP healthcheck", () => {
		const args = [
			"--name", "test-hc",
			"--type", "tcp",
			"--interval", "10",
			"--timeout", "5",
			"--send-payload", "0x50494E47",
			"--expected-response", "0x4F4B",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.tcp_health_check.send_payload).toBe("50494E47");
		expect(request.spec.tcp_health_check.expected_response).toBe("4F4B");
	});

	it("normalizes hex payloads without 0x prefix in TCP healthcheck", () => {
		const args = [
			"--name", "test-hc",
			"--type", "tcp",
			"--interval", "10",
			"--timeout", "5",
			"--send-payload", "50494E47",
			"--expected-response", "4F4B",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.tcp_health_check.send_payload).toBe("50494E47");
		expect(request.spec.tcp_health_check.expected_response).toBe("4F4B");
	});

	it("throws on invalid hex payload in TCP healthcheck", () => {
		const args = [
			"--name", "test-hc",
			"--type", "tcp",
			"--interval", "10",
			"--timeout", "5",
			"--send-payload", "0xGGGG",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(() => buildHealthcheckRequest(parsed, "default")).toThrow(/Invalid --send-payload/);
	});

	it("throws on invalid hex in expected-response for TCP healthcheck", () => {
		const args = [
			"--name", "test-hc",
			"--type", "tcp",
			"--interval", "10",
			"--timeout", "5",
			"--expected-response", "0xZZZZ", // 0x prefix with invalid hex chars
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(() => buildHealthcheckRequest(parsed, "default")).toThrow(/Invalid --expected-response/);
	});

	it("handles empty TCP healthcheck (connect-only)", () => {
		const args = [
			"--name", "test-hc",
			"--type", "tcp",
			"--interval", "10",
			"--timeout", "5",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.tcp_health_check).toEqual({});
		expect(request.spec.tcp_health_check.send_payload).toBeUndefined();
		expect(request.spec.tcp_health_check.expected_response).toBeUndefined();
	});

	it("handles only send-payload in TCP healthcheck", () => {
		const args = [
			"--name", "test-hc",
			"--type", "tcp",
			"--interval", "10",
			"--timeout", "5",
			"--send-payload", "PING",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.tcp_health_check.send_payload).toBe("50494E47");
		expect(request.spec.tcp_health_check.expected_response).toBeUndefined();
	});

	it("handles only expected-response in TCP healthcheck", () => {
		const args = [
			"--name", "test-hc",
			"--type", "tcp",
			"--interval", "10",
			"--timeout", "5",
			"--expected-response", "OK",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.tcp_health_check.send_payload).toBeUndefined();
		expect(request.spec.tcp_health_check.expected_response).toBe("4F4B");
	});

	// Tests for jitter_percent (v2.0.31)
	it("includes jitter_percent in request when specified", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "15",
			"--timeout", "3",
			"--healthy-threshold", "3",
			"--unhealthy-threshold", "1",
			"--jitter-percent", "30",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.jitter_percent).toBe(30);
	});

	it("applies default jitter_percent when not specified", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.jitter_percent).toBe(30);
	});

	// Tests for --expected-status-codes (v2.0.31)
	it("builds HTTP healthcheck with new --expected-status-codes flag", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--expected-status-codes", "200",
			"--expected-status-codes", "201",
			"--expected-status-codes", "204",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.http_health_check?.expected_status_codes).toEqual([
			"200",
			"201",
			"204",
		]);
	});

	it("supports status code ranges in --expected-status-codes", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--expected-status-codes", "200-299",
			"--expected-status-codes", "404",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.http_health_check?.expected_status_codes).toEqual([
			"200-299",
			"404",
		]);
	});

	it("rejects invalid status code format", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--expected-status-codes", "999",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(() => buildHealthcheckRequest(parsed, "default")).toThrow(
			"Invalid HTTP status code",
		);
	});

	// Tests for --headers (v2.0.31)
	it("builds HTTP healthcheck with single custom header", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--headers", "X-API-Key:secret123",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.http_health_check?.headers).toEqual({
			"X-API-Key": "secret123",
		});
	});

	it("builds HTTP healthcheck with multiple custom headers", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--headers", "X-API-Key:secret123",
			"--headers", "X-Request-ID:req-001",
			"--headers", "X-Debug:true",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.http_health_check?.headers).toEqual({
			"X-API-Key": "secret123",
			"X-Request-ID": "req-001",
			"X-Debug": "true",
		});
	});

	it("keeps --headers and --host-header separate (host_header_choice OneOf)", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--host-header", "example.com",
			"--headers", "X-API-Key:secret123",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		// host_header is a separate field (host_header_choice OneOf)
		expect(request.spec.http_health_check?.host_header).toBe("example.com");
		// Custom headers in headers map, Host NOT added
		expect(request.spec.http_health_check?.headers).toEqual({
			"X-API-Key": "secret123",
		});
	});

	it("rejects invalid header format (missing colon)", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--headers", "X-API-Key-secret123",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(() => buildHealthcheckRequest(parsed, "default")).toThrow(
			"Invalid header format",
		);
	});

	it("rejects header key longer than 256 characters", () => {
		const longKey = "X-" + "A".repeat(255); // 257 characters total
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--headers", `${longKey}:value`,
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(() => buildHealthcheckRequest(parsed, "default")).toThrow(
			"Header key length must be 1-256 chars",
		);
	});

	it("rejects header value longer than 2048 characters", () => {
		const longValue = "A".repeat(2049);
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--headers", `X-Long:${longValue}`,
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(() => buildHealthcheckRequest(parsed, "default")).toThrow(
			"Header value length must be 1-2048 chars",
		);
	});

	it("handles duplicate header keys with warning", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--headers", "X-API-Key:first",
			"--headers", "X-API-Key:second",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("Duplicate header key"),
		);
		expect(request.spec.http_health_check?.headers).toEqual({
			"X-API-Key": "second", // Last value wins
		});
		consoleWarnSpy.mockRestore();
	});
});

describe("Healthcheck Builder - validateHealthcheckFlags", () => {
	it("validates valid healthcheck flags", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(true);
		expect(validation.errors).toHaveLength(0);
	});

	it("rejects missing name", () => {
		const args = [
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(validation.errors.some((e) => e.includes("--name"))).toBe(true);
	});

	it("rejects invalid interval range", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "1000",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(validation.errors.some((e) => e.includes("interval"))).toBe(true);
	});

	it("validates path starts with /", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--path", "health",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(validation.errors.some((e) => e.includes("--path must start with /"))).toBe(
			true,
		);
	});

	// Validation tests for host_header_choice OneOf
	it("rejects mutually exclusive host header flags", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--use-origin-server-name",
			"--host-header", "example.com",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(
			validation.errors.some((e) => e.includes("mutually exclusive")),
		).toBe(true);
	});

	it("accepts --use-origin-server-name alone", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--use-origin-server-name",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(true);
	});

	it("accepts --host-header alone", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--host-header", "api.example.com",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(true);
	});

	it("accepts neither host header flag (API applies default)", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(true);
	});

	// Validation tests for v2.0.31 enhancements
	it("validates jitter_percent must be 0 or 10-50", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--jitter-percent", "5", // Invalid: not 0 and not 10-50
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(
			validation.errors.some((e) =>
				e.includes("--jitter-percent must be 0 or between 10 and 50"),
			),
		).toBe(true);
	});

	it("accepts valid jitter_percent value of 0", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--jitter-percent", "0",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(true);
	});

	it("accepts valid jitter_percent value in range 10-50", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--jitter-percent", "30",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(true);
	});

	it("validates invalid status code in --expected-status-codes", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--expected-status-codes", "invalid",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(
			validation.errors.some((e) => e.includes("Invalid HTTP status code")),
		).toBe(true);
	});

	it("validates invalid range in --expected-status-codes", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--expected-status-codes", "300-200", // Invalid: start > end
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(
			validation.errors.some((e) => e.includes("Invalid HTTP status code")),
		).toBe(true);
	});

	it("validates invalid header format in --headers", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--headers", "InvalidFormat",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(
			validation.errors.some((e) => e.includes("Invalid --headers format")),
		).toBe(true);
	});

	// Tests for optional flags with defaults (v2.1.0)
	it("validates healthcheck without optional timing flags", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			// interval, timeout, healthy-threshold, unhealthy-threshold NOT provided
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(true);
		expect(validation.errors).toHaveLength(0);
	});

	it("uses default interval when not provided", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			// --interval NOT provided
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.interval).toBe(15); // Default
	});

	it("uses default timeout when not provided", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			// --timeout NOT provided
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.timeout).toBe(3); // Default
	});

	it("uses default healthy-threshold when not provided", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.healthy_threshold).toBe(3); // Default
	});

	it("uses default unhealthy-threshold when not provided", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.unhealthy_threshold).toBe(1); // Default
	});

	it("allows overriding defaults", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "30", // Override
			"--timeout", "10", // Override
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.interval).toBe(30);
		expect(request.spec.timeout).toBe(10);
		expect(request.spec.healthy_threshold).toBe(3); // Still default
		expect(request.spec.unhealthy_threshold).toBe(1); // Still default
	});

	it("validates range even when using defaults", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "1000", // Out of range
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(validation.errors.some((e) => e.includes("interval"))).toBe(true);
	});

	// Tests for default type (Phase 0 enhancement)
	it("uses default type 'http' when --type not specified", () => {
		const args = [
			"--name", "test-hc",
			// --type NOT provided
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(true);
		expect(validation.errors).toHaveLength(0);
	});

	it("builds HTTP healthcheck when --type not specified", () => {
		const args = [
			"--name", "test-minimal-hc",
			// --type NOT provided - should default to http
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.metadata.name).toBe("test-minimal-hc");
		expect(request.spec.http_health_check).toBeDefined();
		expect(request.spec.http_health_check?.path).toBe("/");
		expect(request.spec.interval).toBe(15);
		expect(request.spec.timeout).toBe(3);
	});

	it("minimal command creates valid HTTP healthcheck with all defaults", () => {
		const args = [
			"--name", "minimal",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);
		const request = buildHealthcheckRequest(parsed, "default");

		expect(validation.valid).toBe(true);
		expect(request.spec.http_health_check).toBeDefined();
		expect(request.spec.interval).toBe(15);
		expect(request.spec.timeout).toBe(3);
		expect(request.spec.healthy_threshold).toBe(3);
		expect(request.spec.unhealthy_threshold).toBe(1);
		expect(request.spec.jitter_percent).toBe(30);
	});
});

describe("UDP-ICMP Healthcheck Tests", () => {
	it("builds basic UDP-ICMP healthcheck", () => {
		const args = [
			"--name", "test-icmp",
			"--type", "udp-icmp",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.metadata.name).toBe("test-icmp");
		expect(request.spec.udp_icmp_health_check).toBeDefined();
		expect(request.spec.http_health_check).toBeUndefined();
		expect(request.spec.tcp_health_check).toBeUndefined();
	});

	it("includes only common fields for UDP-ICMP", () => {
		const args = [
			"--name", "test-icmp",
			"--type", "udp-icmp",
			"--interval", "20",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.interval).toBe(20);
		expect(request.spec.timeout).toBe(5);
		expect(request.spec.healthy_threshold).toBe(2);
		expect(request.spec.unhealthy_threshold).toBe(3);
	});

	it("creates empty udp_icmp_health_check object", () => {
		const args = [
			"--name", "test-icmp",
			"--type", "udp-icmp",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.udp_icmp_health_check).toEqual({});
	});

	it("validates UDP-ICMP with all common flags", () => {
		const args = [
			"--name", "test-icmp",
			"--type", "udp-icmp",
			"--interval", "15",
			"--timeout", "3",
			"--healthy-threshold", "3",
			"--unhealthy-threshold", "1",
			"--jitter-percent", "30",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateHealthcheckFlags(parsed);

		expect(validation.valid).toBe(true);
		expect(validation.errors).toHaveLength(0);
	});

	it("verifies UDP-ICMP type in request body", () => {
		const args = [
			"--name", "test-icmp",
			"--type", "udp-icmp",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		// Only udp_icmp_health_check should be defined
		expect(request.spec.udp_icmp_health_check).toEqual({});
		expect(request.spec.http_health_check).toBeUndefined();
		expect(request.spec.tcp_health_check).toBeUndefined();
		expect(request.spec.dns_health_check).toBeUndefined();
	});

	it("uses default values for UDP-ICMP healthcheck", () => {
		const args = [
			"--name", "test-icmp",
			"--type", "udp-icmp",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.interval).toBe(15);
		expect(request.spec.timeout).toBe(3);
		expect(request.spec.healthy_threshold).toBe(3);
		expect(request.spec.unhealthy_threshold).toBe(1);
		expect(request.spec.jitter_percent).toBe(30);
	});
});

describe("Origin Pool Builder - buildOriginPoolRequest", () => {
	it("builds origin pool with public IPs", () => {
		const args = [
			"--name", "test-pool",
			"--port", "80",
			"--public-ip", "1.2.3.4",
			"--public-ip", "5.6.7.8",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.metadata.name).toBe("test-pool");
		expect(request.metadata.namespace).toBe("default");
		expect(request.spec.port).toBe(80);
		expect(request.spec.origin_servers).toHaveLength(2);
		expect(request.spec.origin_servers[0].public_ip?.ip).toBe("1.2.3.4");
		expect(request.spec.origin_servers[1].public_ip?.ip).toBe("5.6.7.8");
	});

	// === SMART DEFAULTS TESTS ===

	it("applies smart default port 80 when no port specified", () => {
		const args = [
			"--name", "minimal-pool",
			"--public-ip", "192.0.2.10",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.port).toBe(80);
		expect(request.spec.automatic_port).toBeUndefined();
		expect(request.spec.lb_port).toBeUndefined();
	});

	it("applies smart default no_tls when no TLS specified and port is not 443", () => {
		const args = [
			"--name", "minimal-pool",
			"--public-ip", "192.0.2.10",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.no_tls).toEqual({});
		expect(request.spec.use_tls).toBeUndefined();
	});

	it("applies smart default use_tls when port is 443 and no TLS specified", () => {
		const args = [
			"--name", "https-pool",
			"--public-ip", "192.0.2.10",
			"--port", "443",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.use_tls).toBeDefined();
		expect(request.spec.use_tls?.use_host_header_as_sni).toEqual({});
		expect(request.spec.no_tls).toBeUndefined();
	});

	it("explicit port overrides smart default", () => {
		const args = [
			"--name", "custom-port-pool",
			"--public-ip", "192.0.2.10",
			"--port", "8080",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.port).toBe(8080);
	});

	it("automatic-port removes smart default port", () => {
		const args = [
			"--name", "auto-port-pool",
			"--public-ip", "192.0.2.10",
			"--automatic-port",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.port).toBeUndefined();
		expect(request.spec.automatic_port).toEqual({});
	});

	it("lb-port removes smart default port", () => {
		const args = [
			"--name", "lb-port-pool",
			"--public-ip", "192.0.2.10",
			"--lb-port",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.port).toBeUndefined();
		expect(request.spec.lb_port).toEqual({});
	});

	it("explicit no-tls overrides smart default", () => {
		const args = [
			"--name", "explicit-no-tls-pool",
			"--public-ip", "192.0.2.10",
			"--port", "443",
			"--no-tls",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.no_tls).toEqual({});
		expect(request.spec.use_tls).toBeUndefined();
	});

	it("explicit use-tls overrides smart default", () => {
		const args = [
			"--name", "explicit-tls-pool",
			"--public-ip", "192.0.2.10",
			"--port", "80",
			"--use-tls",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.use_tls).toBeDefined();
		expect(request.spec.no_tls).toBeUndefined();
	});

	it("minimal command with multiple origins works with smart defaults", () => {
		const args = [
			"--name", "multi-minimal-pool",
			"--public-ip", "192.0.2.10",
			"--public-ip", "192.0.2.11",
			"--public-ip", "192.0.2.12",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.origin_servers).toHaveLength(3);
		expect(request.spec.port).toBe(80);
		expect(request.spec.no_tls).toEqual({});
	});

	it("minimal command passes validation", () => {
		const args = [
			"--name", "minimal-pool",
			"--public-ip", "192.0.2.10",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const validation = validateOriginPoolFlags(parsed);

		expect(validation.valid).toBe(true);
		expect(validation.errors).toHaveLength(0);
	});

	// === END SMART DEFAULTS TESTS ===

	it("builds origin pool with public names", () => {
		const args = [
			"--name", "test-pool",
			"--port", "443",
			"--public-name", "api.example.com",
			"--use-tls",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.origin_servers[0].public_name?.dns_name).toBe("api.example.com");
		expect(request.spec.use_tls).toBeDefined();
	});

	it("builds origin pool with algorithm", () => {
		const args = [
			"--name", "test-pool",
			"--port", "80",
			"--public-ip", "1.2.3.4",
			"--algorithm", "ROUND_ROBIN",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.loadbalancer_algorithm).toBe("ROUND_ROBIN");
	});

	it("builds origin pool with health checks", () => {
		const args = [
			"--name", "test-pool",
			"--port", "80",
			"--public-ip", "1.2.3.4",
			"--health-check", "my-healthcheck",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.healthcheck).toBeDefined();
		expect(request.spec.healthcheck).toHaveLength(1);
		expect(request.spec.healthcheck![0].name).toBe("my-healthcheck");
		expect(request.spec.healthcheck![0].namespace).toBe("default");
	});

	it("builds origin pool with no TLS", () => {
		const args = [
			"--name", "test-pool",
			"--port", "80",
			"--public-ip", "1.2.3.4",
			"--no-tls",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.no_tls).toBeDefined();
		expect(request.spec.use_tls).toBeUndefined();
	});

	it("builds origin pool with private IPs and site", () => {
		const args = [
			"--name", "test-pool",
			"--port", "80",
			"--private-ip", "10.0.0.1",
			"--site", "my-site",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const request = buildOriginPoolRequest(parsed, "default");

		expect(request.spec.origin_servers[0].private_ip?.ip).toBe("10.0.0.1");
		expect(request.spec.origin_servers[0].private_ip?.site_locator?.site.name).toBe("my-site");
	});
});

describe("Origin Pool Builder - validateOriginPoolFlags", () => {
	it("validates valid origin pool flags", () => {
		const args = [
			"--name", "test-pool",
			"--port", "80",
			"--public-ip", "1.2.3.4",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const validation = validateOriginPoolFlags(parsed);

		expect(validation.valid).toBe(true);
		expect(validation.errors).toHaveLength(0);
	});

	it("rejects missing name", () => {
		const args = [
			"--port", "80",
			"--public-ip", "1.2.3.4",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const validation = validateOriginPoolFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(validation.errors.some((e) => e.includes("--name"))).toBe(true);
	});

	it("rejects missing origin servers", () => {
		const args = [
			"--name", "test-pool",
			"--port", "80",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const validation = validateOriginPoolFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(validation.errors.some((e) => e.includes("origin server"))).toBe(true);
	});

	it("rejects mutually exclusive TLS flags", () => {
		const args = [
			"--name", "test-pool",
			"--public-ip", "1.2.3.4",
			"--no-tls",
			"--use-tls",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const validation = validateOriginPoolFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(validation.errors.some((e) => e.includes("mutually exclusive"))).toBe(true);
	});

	it("requires site for private origins", () => {
		const args = [
			"--name", "test-pool",
			"--private-ip", "10.0.0.1",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const validation = validateOriginPoolFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(validation.errors.some((e) => e.includes("--site is required"))).toBe(true);
	});

	it("rejects invalid port range", () => {
		const args = [
			"--name", "test-pool",
			"--public-ip", "1.2.3.4",
			"--port", "99999",
		];
		const parsed = parseCreationFlags(args, "origin_pool");
		const validation = validateOriginPoolFlags(parsed);

		expect(validation.valid).toBe(false);
		expect(validation.errors.some((e) => e.includes("port"))).toBe(true);
	});
});

describe("Builders Registry", () => {
	it("has healthcheck builder", () => {
		expect(hasResourceBuilder("healthcheck")).toBe(true);
		expect(getResourceBuilder("healthcheck")).toBeDefined();
	});

	it("has origin_pool builder", () => {
		expect(hasResourceBuilder("origin_pool")).toBe(true);
		expect(getResourceBuilder("origin_pool")).toBeDefined();
	});

	it("returns undefined for unknown resource type", () => {
		expect(hasResourceBuilder("unknown")).toBe(false);
		expect(getResourceBuilder("unknown")).toBeUndefined();
	});

	it("buildResource works via registry", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const result = buildResource("healthcheck", parsed, "default");

		expect(result).not.toBeNull();
		expect((result as Record<string, unknown>).metadata).toBeDefined();
	});

	it("validateResourceFlags works via registry", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const validation = validateResourceFlags("healthcheck", parsed);

		expect(validation.valid).toBe(true);
	});
});

describe("Origin Pool Builder - Advanced Features", () => {
	// CBIP Service (2 tests)
	describe("CBIP Service Origins", () => {
		it("builds origin pool with cbip-service origin", () => {
			const args = [
				"--name", "cbip-pool",
				"--cbip-service", "my-service",
				"--site", "my-site",
				"--port", "8080",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.origin_servers).toHaveLength(1);
			expect(result.spec.origin_servers[0].cbip_service).toBeDefined();
			expect(result.spec.origin_servers[0].cbip_service?.service_name).toBe("my-service");
			expect(result.spec.origin_servers[0].cbip_service?.site_locator).toBeDefined();
		});

		it("builds origin pool with cbip-service without site", () => {
			const args = [
				"--name", "cbip-pool",
				"--cbip-service", "my-service",
				"--port", "8080",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.origin_servers).toHaveLength(1);
			expect(result.spec.origin_servers[0].cbip_service).toBeDefined();
			expect(result.spec.origin_servers[0].cbip_service?.site_locator).toBeUndefined();
		});
	});

	// Connection Pool Reuse (3 tests)
	describe("Connection Pool Reuse", () => {
		it("enables connection pool reuse", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--connection-pool", "enable-reuse",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options).toBeDefined();
			expect(result.spec.advanced_options?.enable_conn_pool_reuse).toEqual({});
		});

		it("disables connection pool reuse", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--connection-pool", "disable-reuse",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options).toBeDefined();
			expect(result.spec.advanced_options?.disable_conn_pool_reuse).toEqual({});
		});
	});

	// Health Check Port (3 tests)
	describe("Health Check Port", () => {
		it("uses same port as endpoint for health checks", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--health-check-port-source", "same-as-endpoint",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.same_as_endpoint_port).toEqual({});
		});

		it("uses custom health check port", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--health-check-port-source", "custom",
				"--health-check-port", "9090",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.health_check_port).toBe(9090);
		});

		it("validates child flag requires parent flag", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--health-check-port", "9090",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
			expect(validation.errors).toContain(
				"--health-check-port requires --health-check-port-source=custom"
			);
		});
	});

	// Endpoint Selection (4 tests)
	describe("Endpoint Selection", () => {
		it("sets endpoint selection to DISTRIBUTED", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--endpoint-selection", "DISTRIBUTED",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.endpoint_selection).toBe("DISTRIBUTED");
		});

		it("sets endpoint selection to LOCAL_ONLY", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--endpoint-selection", "LOCAL_ONLY",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.endpoint_selection).toBe("LOCAL_ONLY");
		});

		it("sets endpoint selection to LOCAL_PREFERRED", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--endpoint-selection", "LOCAL_PREFERRED",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.endpoint_selection).toBe("LOCAL_PREFERRED");
		});

		it("validates invalid endpoint selection value", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--endpoint-selection", "INVALID",
			];
			const parsed = parseCreationFlags(args, "origin_pool");

			// Parser rejects invalid enum values, so check parse errors
			expect(parsed.errors.length).toBeGreaterThan(0);
			expect(parsed.errors[0]).toContain("Invalid value 'INVALID'");
		});
	});

	// Circuit Breaker (6 tests)
	describe("Circuit Breaker", () => {
		it("enables default circuit breaker", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--circuit-breaker", "default",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.default_circuit_breaker).toEqual({});
		});

		it("disables circuit breaker", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--circuit-breaker", "disable",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.disable_circuit_breaker).toEqual({});
		});

		it("configures custom circuit breaker", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--circuit-breaker", "custom",
				"--cb-connection-limit", "1000",
				"--cb-max-requests", "500",
				"--cb-priority", "HIGH",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.circuit_breaker).toBeDefined();
			expect(result.spec.advanced_options?.circuit_breaker?.connection_limit).toBe(1000);
			expect(result.spec.advanced_options?.circuit_breaker?.max_requests).toBe(500);
			expect(result.spec.advanced_options?.circuit_breaker?.priority).toBe("HIGH");
		});

		it("validates child flags require parent mode", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--cb-connection-limit", "1000",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
			expect(validation.errors[0]).toContain("require --circuit-breaker=custom");
		});

		it("validates circuit breaker connection limit range", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--circuit-breaker", "custom",
				"--cb-connection-limit", "99999",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
			expect(validation.errors).toContain("--cb-connection-limit must be between 0 and 32768");
		});

		it("validates circuit breaker priority enum", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--circuit-breaker", "custom",
				"--cb-priority", "INVALID",
			];
			const parsed = parseCreationFlags(args, "origin_pool");

			// Parser rejects invalid enum values, so check parse errors
			expect(parsed.errors.length).toBeGreaterThan(0);
			expect(parsed.errors[0]).toContain("Invalid value 'INVALID'");
		});
	});

	// Outlier Detection (5 tests)
	describe("Outlier Detection", () => {
		it("disables outlier detection", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--outlier-detection", "disable",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.disable_outlier_detection).toEqual({});
		});

		it("configures custom outlier detection", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--outlier-detection", "custom",
				"--od-consecutive-5xx", "5",
				"--od-max-ejection-percent", "50",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.outlier_detection).toBeDefined();
			expect(result.spec.advanced_options?.outlier_detection?.consecutive_5xx).toBe(5);
			expect(result.spec.advanced_options?.outlier_detection?.max_ejection_percent).toBe(50);
		});

		it("validates child flags require parent mode", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--od-consecutive-5xx", "5",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
			expect(validation.errors[0]).toContain("require --outlier-detection=custom");
		});

		it("validates consecutive 5xx range", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--outlier-detection", "custom",
				"--od-consecutive-5xx", "9999",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
			expect(validation.errors).toContain("--od-consecutive-5xx must be between 0 and 1024");
		});

		it("validates max ejection percent range", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--outlier-detection", "custom",
				"--od-max-ejection-percent", "150",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
			expect(validation.errors).toContain("--od-max-ejection-percent must be between 0 and 100");
		});
	});

	// Panic Threshold (3 tests)
	describe("Panic Threshold", () => {
		it("disables panic threshold", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--panic-threshold-mode", "none",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.no_panic_threshold).toEqual({});
		});

		it("sets custom panic threshold", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--panic-threshold-mode", "percentage",
				"--panic-threshold", "50",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.panic_threshold).toBe(50);
		});

		it("validates child flag requires parent mode", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--panic-threshold", "50",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
			expect(validation.errors).toContain(
				"--panic-threshold requires --panic-threshold-mode=percentage"
			);
		});
	});

	// HTTP Protocol (5 tests)
	describe("HTTP Protocol", () => {
		it("enables auto HTTP config", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--http-protocol", "auto",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.auto_http_config).toEqual({});
		});

		it("configures HTTP/1.1 header transformation", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--http-protocol", "http1",
				"--http1-header-transform", "proper_case_header_transformation",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.http1_config).toBeDefined();
			expect(result.spec.advanced_options?.http1_config?.header_transformation).toBe(
				"proper_case_header_transformation"
			);
		});

		it("enables HTTP/2", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--http-protocol", "http2",
				"--http2-enabled", "true",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.http2_options).toBeDefined();
			expect(result.spec.advanced_options?.http2_options?.enabled).toBe(true);
		});

		it("validates child flags require parent mode", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--http1-header-transform", "proper_case_header_transformation",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
			expect(validation.errors[0]).toContain("requires --http-protocol=http1");
		});

		it("validates invalid header transformation type", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--http-protocol", "http1",
				"--http1-header-transform", "invalid_transform",
			];
			const parsed = parseCreationFlags(args, "origin_pool");

			// Parser rejects invalid enum values, so check parse errors
			expect(parsed.errors.length).toBeGreaterThan(0);
			expect(parsed.errors[0]).toContain("Invalid value 'invalid_transform'");
		});
	});

	// Proxy Protocol (3 tests)
	describe("Proxy Protocol", () => {
		it("disables proxy protocol", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--proxy-protocol", "disable",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.disable_proxy_protocol).toEqual({});
		});

		it("enables proxy protocol v1", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--proxy-protocol", "v1",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.proxy_protocol_v1).toEqual({});
		});

		it("enables proxy protocol v2", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--proxy-protocol", "v2",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.proxy_protocol_v2).toEqual({});
		});
	});

	// Source IP Persistence (2 tests)
	describe("Source IP Persistence", () => {
		it("disables source IP persistence", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--source-ip-persistence", "disable",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.disable_lb_source_ip_persistance).toEqual({});
		});

		it("enables source IP persistence", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--source-ip-persistence", "enable",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.enable_lb_source_ip_persistance).toEqual({});
		});
	});

	// Subset Load Balancing (7 tests)
	describe("Subset Load Balancing", () => {
		it("disables subsets", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--subset-lb", "disable",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.disable_subsets).toEqual({});
		});

		it("enables subsets with keys", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--subset-lb", "enable",
				"--subset-keys", "zone,version",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.enable_subsets).toBeDefined();
			expect(result.spec.advanced_options?.enable_subsets?.endpoint_subsets).toBeDefined();
		});

		it("configures subset fallback policy", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--subset-lb", "enable",
				"--subset-keys", "zone",
				"--subset-default-fallback", "ANY_ENDPOINT",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.enable_subsets?.default_subset).toBeDefined();
			expect(
				result.spec.advanced_options?.enable_subsets?.default_subset?.default_fallback_policy
			).toBe("ANY_ENDPOINT");
		});

		it("validates child flags require parent mode", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--subset-keys", "zone",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
			expect(validation.errors[0]).toContain("--subset-keys requires --subset-lb=enable");
		});

		it("validates subset key count limit", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--subset-lb", "enable",
			];
			// Add 33 subset keys (exceeds max of 32)
			for (let i = 0; i < 33; i++) {
				args.push("--subset-keys", `key${i}`);
			}
			const parsed = parseCreationFlags(args, "origin_pool");

			// Parser enforces maxOccurrences, so check parse errors
			expect(parsed.errors.length).toBeGreaterThan(0);
			expect(parsed.errors[0]).toContain("can only be used 32 times");
		});

		it("validates subset fallback policy enum", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--subset-lb", "enable",
				"--subset-keys", "zone",
				"--subset-default-fallback", "INVALID",
			];
			const parsed = parseCreationFlags(args, "origin_pool");

			// Parser rejects invalid enum values, so check parse errors
			expect(parsed.errors.length).toBeGreaterThan(0);
			expect(parsed.errors[0]).toContain("Invalid value 'INVALID'");
		});

		it("handles multiple subset key groups", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--subset-lb", "enable",
				"--subset-keys", "zone,region",
				"--subset-keys", "version",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.enable_subsets?.endpoint_subsets).toHaveLength(2);
		expect((result.spec.advanced_options?.enable_subsets?.endpoint_subsets as any)?.[0]?.keys).toHaveLength(2);
		expect((result.spec.advanced_options?.enable_subsets?.endpoint_subsets as any)?.[1]?.keys).toHaveLength(1);
		});
	});

	// Integration Tests (10 tests)
	describe("Integration Tests", () => {
		it("handles complex configuration with multiple advanced options", () => {
			const args = [
				"--name", "complex-pool",
				"--public-name", "api.example.com",
				"--port", "443",
				"--use-tls",
				"--connection-pool", "enable-reuse",
				"--endpoint-selection", "LOCAL_PREFERRED",
				"--circuit-breaker", "default",
				"--panic-threshold-mode", "percentage",
				"--panic-threshold", "50",
				"--health-check", "my-health",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.enable_conn_pool_reuse).toEqual({});
			expect(result.spec.endpoint_selection).toBe("LOCAL_PREFERRED");
			expect(result.spec.advanced_options?.default_circuit_breaker).toEqual({});
			expect(result.spec.advanced_options?.panic_threshold).toBe(50);
			expect(result.spec.use_tls).toBeDefined();
			expect(result.spec.healthcheck).toHaveLength(1);
		});

		it("handles timeouts configuration", () => {
			const args = [
				"--name", "timeout-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--connection-timeout", "5000",
				"--http-idle-timeout", "60000",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.connection_timeout).toBe(5000);
			expect(result.spec.advanced_options?.http_idle_timeout).toBe(60000);
		});

		it("validates child flags without parent modes", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--cb-connection-limit", "1000",
				"--health-check-port", "9090",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
			expect(validation.errors.length).toBeGreaterThan(1);
		});

		it("handles edge case with no advanced options", () => {
			const args = [
				"--name", "simple-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options).toBeUndefined();
		});

		it("validates boundary values for ranges", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--health-check-port-source", "custom",
				"--health-check-port", "1",
				"--panic-threshold-mode", "percentage",
				"--panic-threshold", "0",
				"--circuit-breaker", "custom",
				"--cb-connection-limit", "32768",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(true);
		});

		it("validates upper boundary violations", () => {
			const args = [
				"--name", "test-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--health-check-port", "65536",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);

			expect(validation.valid).toBe(false);
		});

		it("handles mixed origin types with advanced options", () => {
			const args = [
				"--name", "mixed-pool",
				"--public-ip", "192.0.2.10",
				"--private-ip", "10.0.1.20",
				"--site", "my-site",
				"--port", "8080",
				"--circuit-breaker", "default",
				"--source-ip-persistence", "enable",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.origin_servers).toHaveLength(2);
			expect(result.spec.advanced_options?.default_circuit_breaker).toEqual({});
			expect(result.spec.advanced_options?.enable_lb_source_ip_persistance).toEqual({});
		});

		it("validates complete production-grade configuration", () => {
			const args = [
				"--name", "prod-pool",
				"--public-name", "prod1.example.com",
				"--public-name", "prod2.example.com",
				"--port", "443",
				"--use-tls",
				"--algorithm", "ROUND_ROBIN",
				"--health-check", "prod-health",
				"--connection-pool", "enable-reuse",
				"--endpoint-selection", "DISTRIBUTED",
				"--circuit-breaker", "default",
				"--panic-threshold-mode", "percentage",
				"--panic-threshold", "50",
				"--source-ip-persistence", "enable",
				"--http-protocol", "auto",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const validation = validateOriginPoolFlags(parsed);
			const result = buildOriginPoolRequest(parsed, "default");

			expect(validation.valid).toBe(true);
			expect(result.spec.origin_servers).toHaveLength(2);
			expect(result.spec.use_tls).toBeDefined();
			expect(result.spec.loadbalancer_algorithm).toBe("ROUND_ROBIN");
			expect(result.spec.advanced_options).toBeDefined();
		});

		it("handles HTTP protocol combinations", () => {
			const args = [
				"--name", "http-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--http-protocol", "http1",
				"--http1-header-transform", "proper_case_header_transformation",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.http1_config).toBeDefined();
		});

		it("validates custom circuit breaker with all parameters", () => {
			const args = [
				"--name", "cb-pool",
				"--public-ip", "192.0.2.10",
				"--port", "8080",
				"--circuit-breaker", "custom",
				"--cb-connection-limit", "1000",
				"--cb-max-requests", "500",
				"--cb-max-pending-requests", "200",
				"--cb-priority", "HIGH",
			];
			const parsed = parseCreationFlags(args, "origin_pool");
			const result = buildOriginPoolRequest(parsed, "default");

			expect(result.spec.advanced_options?.circuit_breaker).toEqual({
				connection_limit: 1000,
				max_requests: 500,
				max_pending_requests: 200,
				priority: "HIGH",
			});
		});
	});
});
