/**
 * Flag Parser Unit Tests
 *
 * Tests for parsing creation flags from CLI arguments.
 */

import { describe, it, expect } from "vitest";
import {
	parseCreationFlags,
	hasCreationFlagsInArgs,
	getFlagValue,
	getFlagValues,
	getFlagIntValue,
	isFlagSet,
} from "../../src/repl/creation/flag-parser.js";

describe("Flag Parser - hasCreationFlagsInArgs", () => {
	it("detects healthcheck creation flags", () => {
		expect(
			hasCreationFlagsInArgs(["--name", "test-hc", "--type", "http"], "healthcheck"),
		).toBe(true);
	});

	it("detects origin_pool creation flags", () => {
		expect(
			hasCreationFlagsInArgs(["--name", "test-pool", "--public-ip", "1.2.3.4"], "origin_pool"),
		).toBe(true);
	});

	it("returns false for unknown resource type", () => {
		expect(hasCreationFlagsInArgs(["--name", "test"], "unknown_type")).toBe(false);
	});

	it("returns false for empty args", () => {
		expect(hasCreationFlagsInArgs([], "healthcheck")).toBe(false);
	});

	it("returns false when only non-creation flags present", () => {
		expect(hasCreationFlagsInArgs(["--output", "json"], "healthcheck")).toBe(false);
	});

	it("handles --flag=value format", () => {
		expect(hasCreationFlagsInArgs(["--name=test-hc"], "healthcheck")).toBe(true);
	});
});

describe("Flag Parser - parseCreationFlags for healthcheck", () => {
	it("parses all required healthcheck flags", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(parsed.errors).toHaveLength(0);
		expect(parsed.hasFlags).toBe(true);
		expect(getFlagValue(parsed, "--name")).toBe("test-hc");
		expect(getFlagValue(parsed, "--type")).toBe("http");
		expect(getFlagIntValue(parsed, "--interval")).toBe(10);
		expect(getFlagIntValue(parsed, "--timeout")).toBe(5);
		expect(getFlagIntValue(parsed, "--healthy-threshold")).toBe(2);
		expect(getFlagIntValue(parsed, "--unhealthy-threshold")).toBe(3);
	});

	it("parses optional HTTP flags", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
			"--path", "/health",
			"--use-http2",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(parsed.errors).toHaveLength(0);
		expect(getFlagValue(parsed, "--path")).toBe("/health");
		expect(isFlagSet(parsed, "--use-http2")).toBe(true);
	});

	it("validates enum values", () => {
		const args = [
			"--name", "test-hc",
			"--type", "invalid-type",
			"--interval", "10",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(parsed.errors.length).toBeGreaterThan(0);
		expect(parsed.errors.some((e) => e.includes("Invalid value 'invalid-type'"))).toBe(true);
	});

	it("parses minimum flags with defaults applied", () => {
		const args = ["--name", "test-hc"];
		const parsed = parseCreationFlags(args, "healthcheck");

		// --type is now optional with default "http", so no error expected
		// Only --name is required
		expect(parsed.errors.filter((e) => e.includes("--type"))).toHaveLength(0);
		expect(parsed.hasFlags).toBe(true);
		expect(parsed.values.get("--name")).toBe("test-hc");
	});

	it("handles --flag=value format", () => {
		const args = [
			"--name=test-hc",
			"--type=http",
			"--interval=10",
			"--timeout=5",
			"--healthy-threshold=2",
			"--unhealthy-threshold=3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(parsed.errors).toHaveLength(0);
		expect(getFlagValue(parsed, "--name")).toBe("test-hc");
		expect(getFlagValue(parsed, "--type")).toBe("http");
	});
});

describe("Flag Parser - parseCreationFlags for origin_pool", () => {
	it("parses basic origin pool flags", () => {
		const args = [
			"--name", "test-pool",
			"--port", "80",
			"--public-ip", "1.2.3.4",
		];
		const parsed = parseCreationFlags(args, "origin_pool");

		expect(parsed.errors).toHaveLength(0);
		expect(parsed.hasFlags).toBe(true);
		expect(getFlagValue(parsed, "--name")).toBe("test-pool");
		expect(getFlagIntValue(parsed, "--port")).toBe(80);
		expect(getFlagValues(parsed, "--public-ip")).toEqual(["1.2.3.4"]);
	});

	it("handles repeatable flags", () => {
		const args = [
			"--name", "test-pool",
			"--port", "80",
			"--public-ip", "1.2.3.4",
			"--public-ip", "5.6.7.8",
			"--public-ip", "9.10.11.12",
		];
		const parsed = parseCreationFlags(args, "origin_pool");

		expect(parsed.errors).toHaveLength(0);
		const ips = getFlagValues(parsed, "--public-ip");
		expect(ips).toHaveLength(3);
		expect(ips).toContain("1.2.3.4");
		expect(ips).toContain("5.6.7.8");
		expect(ips).toContain("9.10.11.12");
	});

	it("validates algorithm enum", () => {
		const args = [
			"--name", "test-pool",
			"--public-ip", "1.2.3.4",
			"--algorithm", "ROUND_ROBIN",
		];
		const parsed = parseCreationFlags(args, "origin_pool");

		expect(parsed.errors).toHaveLength(0);
		expect(getFlagValue(parsed, "--algorithm")).toBe("ROUND_ROBIN");
	});

	it("rejects invalid algorithm", () => {
		const args = [
			"--name", "test-pool",
			"--public-ip", "1.2.3.4",
			"--algorithm", "INVALID_ALGO",
		];
		const parsed = parseCreationFlags(args, "origin_pool");

		expect(parsed.errors.some((e) => e.includes("Invalid value 'INVALID_ALGO'"))).toBe(true);
	});

	it("handles boolean flags", () => {
		const args = [
			"--name", "test-pool",
			"--public-ip", "1.2.3.4",
			"--no-tls",
		];
		const parsed = parseCreationFlags(args, "origin_pool");

		expect(parsed.errors).toHaveLength(0);
		expect(isFlagSet(parsed, "--no-tls")).toBe(true);
	});
});

describe("Flag Parser - Edge Cases", () => {
	it("ignores --file and --namespace flags", () => {
		const args = [
			"--file", "config.yaml",
			"--namespace", "default",
			"--name", "test-hc",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		// Should not include --file or --namespace in values
		expect(parsed.values.has("--file")).toBe(false);
		expect(parsed.values.has("--namespace")).toBe(false);
		expect(getFlagValue(parsed, "--name")).toBe("test-hc");
	});

	it("validates integer values", () => {
		const args = [
			"--name", "test-hc",
			"--type", "http",
			"--interval", "not-a-number",
			"--timeout", "5",
			"--healthy-threshold", "2",
			"--unhealthy-threshold", "3",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(parsed.errors.some((e) => e.includes("Invalid integer value"))).toBe(true);
	});

	it("prevents non-repeatable flag duplication", () => {
		const args = [
			"--name", "test-hc",
			"--name", "another-name",
		];
		const parsed = parseCreationFlags(args, "healthcheck");

		expect(parsed.errors.some((e) => e.includes("cannot be specified multiple times"))).toBe(true);
	});
});
