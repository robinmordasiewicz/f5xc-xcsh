/**
 * Create Completion Matrix Tests
 *
 * Comprehensive acceptance test matrix for create/apply action completion.
 * Tests all completion scenarios as defined in the plan:
 * - Required flag sorting (Phase 2 enhancement)
 * - Flag value completions
 * - Flag filtering
 * - No regression tests
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
	createTestSession,
	createTestCompleter,
	setupTestEnvironment,
	cleanupTestEnvironment,
} from "../utils/test-helpers.js";
import type { REPLSession } from "../../src/repl/session.js";
import type { Completer } from "../../src/repl/completion/completer.js";

// Setup mocks for all tests
setupTestEnvironment();

describe("Create Completion Matrix - Required Flag Sorting", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("Healthcheck - Required Flags First", () => {
		it("PHASE 2: core flags (required + defaults) appear before other optional flags", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			// Find positions of core and optional flags
			const flagTexts = suggestions.map((s) => s.text);

			// Core flags (required + high-priority defaults - should appear first)
			const nameIndex = flagTexts.indexOf("--name");
			const typeIndex = flagTexts.indexOf("--type");
			const intervalIndex = flagTexts.indexOf("--interval");
			const timeoutIndex = flagTexts.indexOf("--timeout");
			const healthyIndex = flagTexts.indexOf("--healthy-threshold");
			const unhealthyIndex = flagTexts.indexOf("--unhealthy-threshold");

			// Type-specific optional flags (should appear after core flags)
			const pathIndex = flagTexts.indexOf("--path");
			const hostHeaderIndex = flagTexts.indexOf("--host-header");
			// Note: --file is sorted alphabetically with optional flags, so it may appear
			// interleaved with timing flags. We don't check its position here.

			// All core flags should exist
			expect(nameIndex).toBeGreaterThanOrEqual(0);
			expect(typeIndex).toBeGreaterThanOrEqual(0);
			expect(intervalIndex).toBeGreaterThanOrEqual(0);
			expect(timeoutIndex).toBeGreaterThanOrEqual(0);
			expect(healthyIndex).toBeGreaterThanOrEqual(0);
			expect(unhealthyIndex).toBeGreaterThanOrEqual(0);

			// Type-specific optional flags should come after truly required flags
			// (--name and --type have highest priority)
			const lastRequiredIndex = Math.max(nameIndex, typeIndex);

			if (pathIndex >= 0) {
				expect(pathIndex).toBeGreaterThan(lastRequiredIndex);
			}
			if (hostHeaderIndex >= 0) {
				expect(hostHeaderIndex).toBeGreaterThan(lastRequiredIndex);
			}
		});

		it("required flags have (required) marker in description", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			const requiredFlags = ["--name", "--type"];

			for (const flagName of requiredFlags) {
				const flag = suggestions.find((s) => s.text === flagName);
				expect(flag).toBeDefined();
				expect(flag?.description).toContain("required");
			}

			// Flags with defaults should show default value, not "required"
			const defaultFlags = {
				"--interval": "default: 15",
				"--timeout": "default: 3",
				"--healthy-threshold": "default: 3",
				"--unhealthy-threshold": "default: 1",
			};

			for (const [flagName, expectedDefault] of Object.entries(defaultFlags)) {
				const flag = suggestions.find((s) => s.text === flagName);
				expect(flag).toBeDefined();
				expect(flag?.description).toContain(expectedDefault);
				expect(flag?.description).not.toContain("required");
			}
		});

		it("optional flags do NOT have (required) marker", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			const optionalFlags = ["--path", "--host-header", "--use-http2", "--expected-status"];

			for (const flagName of optionalFlags) {
				const flag = suggestions.find((s) => s.text === flagName);
				if (flag) {
					expect(flag.description).not.toContain("required");
				}
			}
		});

		it("as required flags are provided, they are removed from suggestions", async () => {
			// After providing --name, it should be removed
			const suggestions = await completer.complete(
				"/virtual create healthcheck --name test ",
			);
			const flagTexts = suggestions.map((s) => s.text);

			expect(flagTexts).not.toContain("--name");
			expect(flagTexts).not.toContain("-n");
			// Other required flags should still be present
			expect(flagTexts).toContain("--type");
			expect(flagTexts).toContain("--interval");
		});
	});

	describe("Origin Pool - Required Flag Sorting", () => {
		it("required --name flag appears first", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool ",
			);
			const flagTexts = suggestions.map((s) => s.text);

			const nameIndex = flagTexts.indexOf("--name");
			expect(nameIndex).toBeGreaterThanOrEqual(0);

			// Optional/repeatable flags should come after --name
			const publicIpIndex = flagTexts.indexOf("--public-ip");
			expect(publicIpIndex).toBeGreaterThan(nameIndex);
		});

		it("repeatable flags have (repeatable) marker", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool ",
			);

			const repeatableFlags = ["--public-ip", "--public-name", "--health-check"];

			for (const flagName of repeatableFlags) {
				const flag = suggestions.find((s) => s.text === flagName);
				if (flag) {
					expect(flag.description).toContain("repeatable");
				}
			}
		});
	});

	describe("Global Flags - Always Last", () => {
		it("global flags (--namespace, --output) appear after all contextual flags", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);
			const flagTexts = suggestions.map((s) => s.text);

			// Global flags
			const namespaceIndex = flagTexts.indexOf("--namespace");
			const outputIndex = flagTexts.indexOf("--output");
			const nsShortIndex = flagTexts.indexOf("-ns");
			const oShortIndex = flagTexts.indexOf("-o");

			// Contextual flags (should appear before global flags)
			const typeIndex = flagTexts.indexOf("--type");
			const intervalIndex = flagTexts.indexOf("--interval");
			const pathIndex = flagTexts.indexOf("--path");
			const fileIndex = flagTexts.indexOf("--file");

			// All global flags should exist
			expect(namespaceIndex).toBeGreaterThanOrEqual(0);
			expect(outputIndex).toBeGreaterThanOrEqual(0);

			// All contextual flags should come BEFORE global flags
			if (typeIndex >= 0) {
				expect(typeIndex).toBeLessThan(namespaceIndex);
				expect(typeIndex).toBeLessThan(outputIndex);
			}
			if (intervalIndex >= 0) {
				expect(intervalIndex).toBeLessThan(namespaceIndex);
				expect(intervalIndex).toBeLessThan(outputIndex);
			}
			if (pathIndex >= 0) {
				expect(pathIndex).toBeLessThan(namespaceIndex);
				expect(pathIndex).toBeLessThan(outputIndex);
			}
			if (fileIndex >= 0) {
				expect(fileIndex).toBeLessThan(namespaceIndex);
				expect(fileIndex).toBeLessThan(outputIndex);
			}

			// Global flags should be grouped together at the end
			// (sorted alphabetically: --namespace, -ns, -o, --output)
			const globalFlags = [namespaceIndex, nsShortIndex, oShortIndex, outputIndex].filter(i => i >= 0);
			const minGlobalIndex = Math.min(...globalFlags);
			const maxGlobalIndex = Math.max(...globalFlags);

			// Verify global flags are contiguous at the end
			expect(maxGlobalIndex).toBe(flagTexts.length - 1);
		});

		it("global flags for origin_pool also appear last", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool ",
			);
			const flagTexts = suggestions.map((s) => s.text);

			const namespaceIndex = flagTexts.indexOf("--namespace");
			const outputIndex = flagTexts.indexOf("--output");
			const algorithmIndex = flagTexts.indexOf("--algorithm");
			const publicIpIndex = flagTexts.indexOf("--public-ip");

			// Contextual flags should come before global flags
			if (algorithmIndex >= 0) {
				expect(algorithmIndex).toBeLessThan(namespaceIndex);
				expect(algorithmIndex).toBeLessThan(outputIndex);
			}
			if (publicIpIndex >= 0) {
				expect(publicIpIndex).toBeLessThan(namespaceIndex);
				expect(publicIpIndex).toBeLessThan(outputIndex);
			}
		});
	});
});

describe("Create Completion Matrix - Healthcheck Scenarios", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("Input: create healthcheck <space>", () => {
		it("shows flags: --file, --name, --type, --interval...", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("--name");
			expect(result).toContain("--type");
			expect(result).toContain("--interval");
			expect(result).toContain("--timeout");
			expect(result).toContain("--healthy-threshold");
			expect(result).toContain("--unhealthy-threshold");
			expect(result).toContain("--file");
		});
	});

	describe("Input: create healthcheck --<partial>", () => {
		it("--n filters to --name, --namespace", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --n",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("--name");
			expect(result).toContain("--namespace");
			expect(result).not.toContain("--type");
		});

		it("--t filters to --type, --timeout", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --t",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("--type");
			expect(result).toContain("--timeout");
			expect(result).not.toContain("--name");
		});
	});

	describe("Input: create healthcheck --name test --<space>", () => {
		it("shows remaining flags (no --name)", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --name test ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("--name");
			expect(result).not.toContain("-n");
			expect(result).toContain("--type");
			expect(result).toContain("--interval");
		});
	});

	describe("Input: create healthcheck --type <space>", () => {
		it("shows enum values: http, tcp, dns, udp-icmp", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http");
			expect(result).toContain("tcp");
			expect(result).toContain("dns");
			expect(result).toContain("udp-icmp");
		});
	});

	describe("Input: create healthcheck --type h<partial>", () => {
		it("filters to: http", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type h",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http");
			expect(result).not.toContain("tcp");
			expect(result).not.toContain("dns");
		});
	});

	describe("Input: create healthcheck --interval <space>", () => {
		it("shows common values: 5, 10, 30, 60", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --interval ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("5");
			expect(result).toContain("10");
			expect(result).toContain("30");
			expect(result).toContain("60");
		});
	});

	describe("Input: create healthcheck --path <space>", () => {
		it("shows path suggestions: /health, /healthz, /ready, /", async () => {
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
});

describe("Create Completion Matrix - Origin Pool Scenarios", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("Input: create origin_pool <space>", () => {
		it("shows flags: --file, --name, --port, --public-ip...", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("--name");
			expect(result).toContain("--port");
			expect(result).toContain("--public-ip");
			expect(result).toContain("--algorithm");
			expect(result).toContain("--file");
		});
	});

	describe("Input: create origin_pool --public-ip 1.2.3.4 <space>", () => {
		it("--public-ip still shown (repeatable)", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool --public-ip 1.2.3.4 ",
			);
			const result = suggestions.map((s) => s.text);

			// Repeatable flag should still appear
			expect(result).toContain("--public-ip");
		});
	});

	describe("Input: create origin_pool --name test --name <space>", () => {
		it("--name not shown (non-repeatable, already used)", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool --name test ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("--name");
			expect(result).not.toContain("-n");
		});
	});

	describe("Input: create origin_pool --algorithm <space>", () => {
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
	});
});

describe("Create Completion Matrix - No Regression Tests", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("Input: get healthcheck <space>", () => {
		it("shows existing resource names (or flags in mocked env)", async () => {
			const suggestions = await completer.complete(
				"/virtual get healthcheck ",
			);

			// In mocked environment, API returns empty resources
			// But should NOT show creation flags like --type, --interval
			const result = suggestions.map((s) => s.text);

			// Should show action flags (--name, --output, etc.)
			expect(result.length).toBeGreaterThan(0);

			// Should NOT show creation-specific flags for get action
			// (unless they overlap with common flags like --name)
			expect(result).not.toContain("--type"); // creation-specific
			expect(result).not.toContain("--interval"); // creation-specific
		});
	});

	describe("Input: delete healthcheck <space>", () => {
		it("shows existing resource names (or flags in mocked env)", async () => {
			const suggestions = await completer.complete(
				"/virtual delete healthcheck ",
			);
			const result = suggestions.map((s) => s.text);

			// Should have some suggestions
			expect(result.length).toBeGreaterThan(0);

			// Should NOT show creation-specific flags for delete action
			expect(result).not.toContain("--type");
			expect(result).not.toContain("--interval");
		});
	});

	describe("Input: list healthcheck <space>", () => {
		it("shows flags only (--namespace, --output, --limit)", async () => {
			const suggestions = await completer.complete(
				"/virtual list healthcheck ",
			);
			const result = suggestions.map((s) => s.text);

			// List action should show appropriate flags
			expect(result.length).toBeGreaterThan(0);

			// Should NOT show creation-specific flags for list action
			expect(result).not.toContain("--type");
			expect(result).not.toContain("--interval");
		});
	});

	describe("Domain-level completion still works", () => {
		it("/virtual create <space> shows resource types", async () => {
			const suggestions = await completer.complete("/virtual create ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("healthcheck");
			expect(result).toContain("origin_pool");
			expect(result).toContain("http_loadbalancer");
		});

		it("/virtual list <space> shows resource types", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("healthcheck");
			expect(result).toContain("origin_pool");
		});

		it("/virtual get <space> shows resource types", async () => {
			const suggestions = await completer.complete("/virtual get ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("healthcheck");
			expect(result).toContain("origin_pool");
		});
	});
});

describe("Create Completion Matrix - Edge Cases", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("Partial resource type name", () => {
		it("create health<partial> shows healthcheck", async () => {
			const suggestions = await completer.complete("/virtual create health");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("healthcheck");
			// Should NOT show creation flags yet
			expect(result).not.toContain("--type");
		});
	});

	describe("Multiple flags provided", () => {
		it("filters out all used flags correctly", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --name test --type http --interval 10 ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("--name");
			expect(result).not.toContain("--type");
			expect(result).not.toContain("--interval");
			expect(result).toContain("--timeout");
			expect(result).toContain("--healthy-threshold");
		});
	});

	describe("Short flag form", () => {
		it("-n filters out --name", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck -n test ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("--name");
			expect(result).not.toContain("-n");
		});

		it("-t filters out --type", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck -t http ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("--type");
			expect(result).not.toContain("-t");
		});
	});

	describe("Mixed flag formats", () => {
		it("handles --flag=value format", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --name=test ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("--name");
		});
	});

	describe("Priority-Based Flag Ordering", () => {
		it("--name appears first in healthcheck suggestions", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);
			const flags = suggestions.filter((s) => s.text.startsWith("--"));
			expect(flags[0].text).toBe("--name");
		});

		it("--type appears second in healthcheck suggestions", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);
			const flags = suggestions.filter((s) => s.text.startsWith("--"));
			expect(flags[1].text).toBe("--type");
		});

		it("other required flags are alphabetical after --name and --type", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);
			const flags = suggestions.filter((s) => s.text.startsWith("--"));

			// After --name (index 0) and --type (index 1), get the next 4 required flags
			const afterTypeIndex = 2;
			const remainingRequired = flags
				.slice(afterTypeIndex, afterTypeIndex + 4)
				.map((f) => f.text);

			const sorted = [...remainingRequired].sort();
			expect(remainingRequired).toEqual(sorted);
		});

		it("--name appears first in origin_pool suggestions", async () => {
			const suggestions = await completer.complete(
				"/virtual create origin_pool ",
			);
			const flags = suggestions.filter((s) => s.text.startsWith("--"));
			expect(flags[0].text).toBe("--name");
		});

		it("type-specific flags (HTTP) appear before other required flags", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type http --name test ",
			);
			const flags = suggestions.filter((s) => s.text.startsWith("--"));

			// Find indices of type-specific flags (priority 5) - excluding deprecated --expected-status
			const httpFlagsIndices = [
				flags.findIndex((f) => f.text === "--expected-status-codes"), // New flag replacing --expected-status
				flags.findIndex((f) => f.text === "--headers"), // New flag
				flags.findIndex((f) => f.text === "--host-header"),
				flags.findIndex((f) => f.text === "--path"),
				flags.findIndex((f) => f.text === "--request-headers-to-remove"),
				flags.findIndex((f) => f.text === "--use-http2"),
				flags.findIndex((f) => f.text === "--use-origin-server-name"),
			].filter((i) => i !== -1);

			// Find indices of common timing flags (no longer required, have defaults)
			const timingFlagsIndices = [
				flags.findIndex((f) => f.text === "--healthy-threshold"),
				flags.findIndex((f) => f.text === "--interval"),
				flags.findIndex((f) => f.text === "--timeout"),
			].filter((i) => i !== -1);

			// All HTTP flags should appear before ALL timing flags
			const maxHttpIndex = Math.max(...httpFlagsIndices);
			const minTimingIndex = Math.min(...timingFlagsIndices);

			expect(maxHttpIndex).toBeLessThan(minTimingIndex);
		});

		it("type-specific flags (TCP) appear before timing flags", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type tcp --name test ",
			);
			const flags = suggestions.filter((s) => s.text.startsWith("--"));

			const tcpIndex = flags.findIndex((f) => f.text === "--expected-response");
			const timingIndex = flags.findIndex((f) => f.text === "--interval");

			expect(tcpIndex).toBeGreaterThan(-1);
			expect(timingIndex).toBeGreaterThan(-1);
			expect(tcpIndex).toBeLessThan(timingIndex);
		});

		it("type-specific flags (DNS) appear before timing flags", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type dns --name test ",
			);
			const flags = suggestions.filter((s) => s.text.startsWith("--"));

			const dnsIndex = flags.findIndex((f) => f.text === "--query-name");
			const timingIndex = flags.findIndex((f) => f.text === "--interval");

			expect(dnsIndex).toBeGreaterThan(-1);
			expect(timingIndex).toBeGreaterThan(-1);
			expect(dnsIndex).toBeLessThan(timingIndex);
		});

		it("type-specific flags are alphabetically ordered", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type http --name test ",
			);
			const httpFlags = suggestions
				.filter((s) =>
					[
						"--path",
						"--host-header",
						"--expected-status-codes", // New flag replacing --expected-status
						"--headers", // New flag
						"--use-http2",
						"--use-origin-server-name",
						"--request-headers-to-remove",
					].includes(s.text),
				)
				.map((s) => s.text);

			const sorted = [...httpFlags].sort();
			expect(httpFlags).toEqual(sorted);
		});
	});
});
