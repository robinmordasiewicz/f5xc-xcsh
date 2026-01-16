/**
 * Resource Builders Unit Tests
 *
 * Tests for building API request bodies from parsed flags.
 */

import { describe, it, expect } from "vitest";
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
			"--expected-status", "200,201,204",
		];
		const parsed = parseCreationFlags(args, "healthcheck");
		const request = buildHealthcheckRequest(parsed, "default");

		expect(request.spec.http_health_check?.use_http2).toBe(true);
		expect(request.spec.http_health_check?.use_origin_server_name).toBe(true);
		expect(request.spec.http_health_check?.expected_status_codes).toEqual([
			"200",
			"201",
			"204",
		]);
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
		expect(validation.errors.some((e) => e.includes("--path must start with /"))).toBe(true);
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
