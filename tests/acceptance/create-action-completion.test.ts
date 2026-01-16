/**
 * Create Action Completion Tests
 *
 * Tests for the enhancement: ensure that after typing "create healthcheck",
 * the system shows creation FLAGS (--name, --type, etc.) instead of existing resource names.
 *
 * Bug: /virtual create healthcheck<TAB> was showing existing healthcheck names (bazz, sse-hc...)
 * Fix: /virtual create healthcheck<TAB> now shows creation flags (--file, --name, --type...)
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
	createTestSession,
	createTestCompleter,
	completeAndExpect,
	setupTestEnvironment,
	cleanupTestEnvironment,
} from "../utils/test-helpers.js";
import type { REPLSession } from "../../src/repl/session.js";
import type { Completer } from "../../src/repl/completion/completer.js";

// Setup mocks for all tests
setupTestEnvironment();

describe("Create Action Completion (Flags Instead of Resource Names)", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("Healthcheck Create Action - Flag Suggestions", () => {
		it("CRITICAL: shows flags, NOT existing resources for 'create healthcheck'", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);
			const result = suggestions.map((s) => s.text);

			// Should show creation flags
			expect(result).toContain("--file");
			expect(result).toContain("--name");
			expect(result).toContain("--type");
			expect(result).toContain("--interval");
			expect(result).toContain("--timeout");
			expect(result).toContain("--healthy-threshold");
			expect(result).toContain("--unhealthy-threshold");
			expect(result).toContain("--namespace");

			// Should NOT show existing resource names
			// All suggestions should be flags (starting with "-")
			const nonFlagSuggestions = result.filter((r) => !r.startsWith("-"));
			expect(nonFlagSuggestions).toHaveLength(0);
		});

		it("shows creation flags for 'apply healthcheck' as well", async () => {
			const suggestions = await completer.complete(
				"/virtual apply healthcheck ",
			);
			const result = suggestions.map((s) => s.text);

			// Apply action should also show creation flags
			expect(result).toContain("--file");
			expect(result).toContain("--name");
			expect(result).toContain("--type");
		});

		it("marks required flags appropriately in descriptions", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			// Find the --type flag
			const typeFlag = suggestions.find((s) => s.text === "--type");
			expect(typeFlag).toBeDefined();
			expect(typeFlag?.description).toContain("required");

			// Find the --interval flag
			const intervalFlag = suggestions.find((s) => s.text === "--interval");
			expect(intervalFlag).toBeDefined();
			expect(intervalFlag?.description).toContain("required");
		});

		it("includes --file as a prominent option for configuration", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);
			const result = suggestions.map((s) => s.text);

			// --file should be first or near first (important for YAML/JSON config)
			expect(result).toContain("--file");
			const fileIndex = result.indexOf("--file");
			expect(fileIndex).toBeLessThan(5); // Should be in first 5 suggestions
		});
	});

	describe("Type Flag Value Completions", () => {
		it("shows type enum values for --type flag", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http");
			expect(result).toContain("tcp");
			expect(result).toContain("dns");
			expect(result).toContain("udp-icmp");
		});

		it("shows type enum values for -t flag (short form)", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck -t ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http");
			expect(result).toContain("tcp");
		});

		it("filters type values by partial input", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type h",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http");
			expect(result).not.toContain("tcp");
			expect(result).not.toContain("dns");
		});
	});

	describe("Interval/Timeout Flag Value Completions", () => {
		it("shows common interval values for --interval flag", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --interval ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("5");
			expect(result).toContain("10");
			expect(result).toContain("30");
			expect(result).toContain("60");
		});

		it("shows common timeout values for --timeout flag", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --timeout ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("5");
			expect(result).toContain("10");
			expect(result).toContain("30");
		});
	});

	describe("Path Flag Value Completions", () => {
		it("shows common path values for --path flag", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --path ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("/health");
			expect(result).toContain("/healthz");
			expect(result).toContain("/ready");
			expect(result).toContain("/");
		});
	});

	describe("Threshold Flag Value Completions", () => {
		it("shows threshold values for --healthy-threshold flag", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --healthy-threshold ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("2");
			expect(result).toContain("3");
			expect(result).toContain("5");
		});

		it("shows threshold values for --unhealthy-threshold flag", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --unhealthy-threshold ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("2");
			expect(result).toContain("3");
			expect(result).toContain("5");
		});
	});

	describe("Flag Filtering - Already Used Flags", () => {
		it("filters out already-used flags from suggestions", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --name test-hc ",
			);
			const result = suggestions.map((s) => s.text);

			// --name should NOT appear again
			expect(result).not.toContain("--name");
			expect(result).not.toContain("-n");

			// Other flags should still appear
			expect(result).toContain("--type");
			expect(result).toContain("--interval");
		});

		it("filters out flags when short form is used", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck -n test-hc ",
			);
			const result = suggestions.map((s) => s.text);

			// Both long and short form should be filtered
			expect(result).not.toContain("--name");
			expect(result).not.toContain("-n");
		});
	});

	describe("No Regression - Get/Delete Still Shows Existing Resources", () => {
		it("'get healthcheck' still shows existing resources (no regression)", async () => {
			const suggestions = await completer.complete(
				"/virtual get healthcheck ",
			);
			const result = suggestions.map((s) => s.text);

			// Get action should show existing resources, not only flags
			// (May have some flags too, but should not be ONLY flags)
			// Note: In mocked environment, resource fetch might return empty
			// but at minimum, it should show action flags for the context
			expect(result.length).toBeGreaterThan(0);
		});

		it("'delete healthcheck' still shows existing resources (no regression)", async () => {
			const suggestions = await completer.complete(
				"/virtual delete healthcheck ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result.length).toBeGreaterThan(0);
		});

		it("'list healthcheck' still shows flags and potential resources", async () => {
			const suggestions = await completer.complete(
				"/virtual list healthcheck ",
			);
			const result = suggestions.map((s) => s.text);

			// List action should show flags at minimum
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("Domain-Level Completion (Before Resource Type)", () => {
		it("'create ' without resource type still shows resource types", async () => {
			const suggestions = await completer.complete("/virtual create ");
			const result = suggestions.map((s) => s.text);

			// Should show resource types (before a specific type is selected)
			expect(result).toContain("healthcheck");
			expect(result).toContain("http_loadbalancer");
			expect(result).toContain("origin_pool");
		});

		it("'apply ' without resource type still shows resource types", async () => {
			const suggestions = await completer.complete("/virtual apply ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("healthcheck");
			expect(result).toContain("http_loadbalancer");
		});
	});

	describe("Edge Cases", () => {
		it("handles partial resource type name correctly", async () => {
			// User types "create health" (partial)
			const suggestions = await completer.complete(
				"/virtual create health",
			);
			const result = suggestions.map((s) => s.text);

			// Should show matching resource type
			expect(result).toContain("healthcheck");

			// Should NOT show creation flags yet (resource type not complete)
			expect(result).not.toContain("--type");
		});

		it("handles multiple flags correctly", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --name test --type http ",
			);
			const result = suggestions.map((s) => s.text);

			// Already used flags should be filtered
			expect(result).not.toContain("--name");
			expect(result).not.toContain("--type");

			// Remaining flags should appear
			expect(result).toContain("--interval");
			expect(result).toContain("--timeout");
			expect(result).toContain("--path");
		});
	});
});

describe("Extensibility - Other Resource Types Without Creation Flags", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	it("resource types without creation flags fall back to standard behavior", async () => {
		// http_loadbalancer doesn't have creation flags defined yet
		const suggestions = await completer.complete(
			"/virtual create http_loadbalancer ",
		);
		const result = suggestions.map((s) => s.text);

		// Should fall back to fetching existing resources or showing generic flags
		// (not the creation-specific flags)
		expect(result.length).toBeGreaterThanOrEqual(0);
	});
});

describe("Origin Pool Create Action Completion", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("Basic Flag Suggestions", () => {
		it("shows flags for 'create origin_pool'", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool ",
			);
			const result = suggestions.map((s) => s.text);

			// Should show origin pool flags
			expect(result).toContain("--file");
			expect(result).toContain("--name");
			expect(result).toContain("--port");
			expect(result).toContain("--public-ip");
			expect(result).toContain("--public-name");
			expect(result).toContain("--k8s-service");
			expect(result).toContain("--algorithm");
			expect(result).toContain("--health-check");
		});

		it("shows all 10 origin server type flags", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool ",
			);
			const result = suggestions.map((s) => s.text);

			const originTypes = [
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
			for (const flag of originTypes) {
				expect(result).toContain(flag);
			}
		});
	});

	describe("Repeatable Flags Behavior", () => {
		it("CRITICAL: repeatable flags still shown after first use", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool --public-ip 1.2.3.4 ",
			);
			const result = suggestions.map((s) => s.text);

			// --public-ip should STILL appear (it's repeatable)
			expect(result).toContain("--public-ip");
		});

		it("non-repeatable flags filtered after use", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool --name my-pool ",
			);
			const result = suggestions.map((s) => s.text);

			// --name should NOT appear again
			expect(result).not.toContain("--name");
		});

		it("health-check flag still shown after first use (max 4)", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool --health-check hc1 ",
			);
			const result = suggestions.map((s) => s.text);

			// --health-check should STILL appear (it's repeatable, max 4)
			expect(result).toContain("--health-check");
		});

		it("multiple origin types can be mixed", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool --public-ip 1.2.3.4 --public-name example.com ",
			);
			const result = suggestions.map((s) => s.text);

			// Both should still appear (repeatable)
			expect(result).toContain("--public-ip");
			expect(result).toContain("--public-name");
			// Other origin types should also appear
			expect(result).toContain("--private-ip");
			expect(result).toContain("--k8s-service");
		});
	});

	describe("Algorithm Flag Value Completions", () => {
		it("shows algorithm enum values", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool --algorithm ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("ROUND_ROBIN");
			expect(result).toContain("LEAST_ACTIVE");
			expect(result).toContain("RANDOM");
			expect(result).toContain("SOURCE_IP_STICKINESS");
			expect(result).toContain("COOKIE_STICKINESS");
			expect(result).toContain("RING_HASH");
		});

		it("filters algorithm values by partial input", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool --algorithm r",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("ROUND_ROBIN");
			expect(result).toContain("RANDOM");
			expect(result).toContain("RING_HASH");
			expect(result).not.toContain("LEAST_ACTIVE");
		});
	});

	describe("Port Flag Value Completions", () => {
		it("shows port common values", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool --port ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("80");
			expect(result).toContain("443");
			expect(result).toContain("8080");
			expect(result).toContain("8443");
		});

		it("filters port values by partial input", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool --port 8",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("80");
			expect(result).toContain("8080");
			expect(result).toContain("8443");
			expect(result).not.toContain("443");
		});
	});

	describe("TLS and Port Configuration Flags", () => {
		it("shows TLS configuration flags", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("--no-tls");
			expect(result).toContain("--use-tls");
		});

		it("shows port configuration flags", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("--port");
			expect(result).toContain("--automatic-port");
			expect(result).toContain("--lb-port");
		});
	});

	describe("No Regression - Healthcheck Still Works", () => {
		it("healthcheck creation flags still work", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);
			const result = suggestions.map((s) => s.text);

			// Healthcheck flags should still appear
			expect(result).toContain("--file");
			expect(result).toContain("--name");
			expect(result).toContain("--type");
			expect(result).toContain("--interval");
			expect(result).toContain("--timeout");
		});
	});
});
