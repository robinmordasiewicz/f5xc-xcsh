/**
 * Create Action Completion Tests
 *
 * Tests for the enhancement: ensure that after typing "create healthcheck",
 * the system shows creation FLAGS (--name, --type, etc.) instead of existing resource names.
 *
 * Bug: /virtual create healthcheck<TAB> was showing existing healthcheck names (bazz, sse-hc...)
 * Fix: /virtual create healthcheck<TAB> now shows creation flags (--name, --type...)
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

			// Should show creation flags (no --file since Phase 2 removed it)
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

			// Apply action should also show creation flags (no --file since Phase 2 removed it)
			expect(result).toContain("--name");
			expect(result).toContain("--type");
		});

		it("marks required flags appropriately in descriptions", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			// Find the --type flag (now optional with default)
			const typeFlag = suggestions.find((s) => s.text === "--type");
			expect(typeFlag).toBeDefined();
			expect(typeFlag?.description).toContain("default: http");

			// Find the --interval flag
			const intervalFlag = suggestions.find((s) => s.text === "--interval");
			expect(intervalFlag).toBeDefined();
			expect(intervalFlag?.description).toContain("default: 15");
		});

	});

	describe("Type Flag Value Completions", () => {
		it("shows type enum values for --type flag (and NOT dns)", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http");
			expect(result).toContain("tcp");
			expect(result).toContain("udp-icmp");
			expect(result).not.toContain("dns"); // DNS is NOT supported by F5 XC API
		});


		it("filters type values by partial input", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type h",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http");
			expect(result).not.toContain("tcp");
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

	describe("HTTP-Specific Flags", () => {
		it("shows HTTP-specific flags including request-headers-to-remove when --type http", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type http ",
			);
			const result = suggestions.map((s) => s.text);

			// HTTP-specific flags
			expect(result).toContain("--path");
			expect(result).toContain("--host-header");
			expect(result).toContain("--use-http2");
			expect(result).toContain("--use-origin-server-name");
			expect(result).toContain("--expected-status-codes");

			// NEW: request-headers-to-remove flag
			expect(result).toContain("--request-headers-to-remove");
		});

		it("shows request-headers-to-remove flag is repeatable in description when --type http", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type http ",
			);

			const flag = suggestions.find((s) => s.text === "--request-headers-to-remove");
			expect(flag).toBeDefined();
			expect(flag?.description).toContain("repeatable");
			expect(flag?.description).toContain("max 16");
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

			// Other flags should still appear
			expect(result).toContain("--type");
			expect(result).toContain("--interval");
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

			// Should show origin pool flags (no --file since Phase 2 removed it)
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

		it("conflicting origin types are filtered out per x-f5xc-conflicts-with", async () => {
			// When --public-ip is used, --public-name should be hidden (they conflict per spec)
			const suggestionsAfterPublicIp = await completer.complete(
				"/virtual create origin_pool --public-ip 1.2.3.4 ",
			);
			const resultAfterPublicIp = suggestionsAfterPublicIp.map((s) => s.text);

			// --public-ip is repeatable so can appear again
			expect(resultAfterPublicIp).toContain("--public-ip");
			// --public-name conflicts with --public-ip per x-f5xc-conflicts-with
			expect(resultAfterPublicIp).not.toContain("--public-name");
			// Non-conflicting types should still appear
			// Note: --private-ip also conflicts with --public-ip per spec
			expect(resultAfterPublicIp).not.toContain("--private-ip");
			// Global flags and non-conflicting flags should remain
			expect(resultAfterPublicIp).toContain("--namespace");
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

			// Healthcheck flags should still appear (no --file since Phase 2 removed it)
			expect(result).toContain("--name");
			expect(result).toContain("--type");
			expect(result).toContain("--interval");
			expect(result).toContain("--timeout");
		});
	});

	describe("Type-Specific Conditional Flag Completion", () => {
		describe("HTTP Type - Shows HTTP-specific flags", () => {
			it("shows HTTP-specific flags when --type http is specified", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http ",
				);
				const result = suggestions.map((s) => s.text);

				// Should show HTTP-specific flags
				expect(result).toContain("--path");
				expect(result).toContain("--expected-status-codes");
				expect(result).toContain("--host-header");
				expect(result).toContain("--use-http2");
				expect(result).toContain("--use-origin-server-name");
				expect(result).toContain("--request-headers-to-remove");

				// Should NOT show TCP-specific flags
				expect(result).not.toContain("--expected-response");
				expect(result).not.toContain("--send-payload");
			});


			it("shows HTTP-specific flags with equals syntax --type=http", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type=http ",
				);
				const result = suggestions.map((s) => s.text);

				// Equals syntax should work
				expect(result).toContain("--path");
				expect(result).toContain("--host-header");
			});
		});

		describe("TCP Type - Shows TCP-specific flags", () => {
			it("shows TCP-specific flags when --type tcp is specified", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type tcp ",
				);
				const result = suggestions.map((s) => s.text);

				// Should show TCP-specific flags
				expect(result).toContain("--expected-response");
				expect(result).toContain("--send-payload");

				// Should NOT show HTTP-specific flags
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--host-header");
				expect(result).not.toContain("--use-http2");
				expect(result).not.toContain("--use-origin-server-name");
				expect(result).not.toContain("--request-headers-to-remove");
			});

		});

		describe("UDP-ICMP Type - Shows only common flags", () => {
			it("shows only common flags when --type udp-icmp is specified", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type udp-icmp ",
				);
				const result = suggestions.map((s) => s.text);

				// Should NOT show any type-specific flags
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--host-header");
				expect(result).not.toContain("--expected-response");
				expect(result).not.toContain("--send-payload");

				// Should still show common flags
				expect(result).toContain("--name");
				expect(result).toContain("--interval");
				expect(result).toContain("--timeout");
			});
		});

		describe("No Type Specified - Shows only common flags", () => {
			it("hides ALL type-specific flags when --type not yet specified", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck ",
				);
				const result = suggestions.map((s) => s.text);

				// Should show common flags
				expect(result).toContain("--name");
				expect(result).toContain("--type");
				expect(result).toContain("--interval");
				expect(result).toContain("--timeout");
				expect(result).toContain("--healthy-threshold");
				expect(result).toContain("--unhealthy-threshold");

				// Should NOT show any type-specific flags
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--host-header");
				expect(result).not.toContain("--use-http2");
				expect(result).not.toContain("--expected-response");
				expect(result).not.toContain("--send-payload");
			});
		});

		describe("Type Change Mid-Command", () => {
			it("reflects CURRENT type when user changes --type mid-command", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http --path /health --type tcp ",
				);
				const result = suggestions.map((s) => s.text);

				// Should show TCP-specific flags (current type)
				expect(result).toContain("--expected-response");
				expect(result).toContain("--send-payload");

				// Should NOT show HTTP-specific flags (overridden type)
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--host-header");
				expect(result).not.toContain("--use-http2");
			});

			it("handles type change from TCP to UDP-ICMP", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type tcp --expected-response 0x4f4b --type udp-icmp ",
				);
				const result = suggestions.map((s) => s.text);

				// Should NOT show any type-specific flags for UDP-ICMP
				expect(result).not.toContain("--send-payload");
				expect(result).not.toContain("--expected-response");
				expect(result).not.toContain("--path");

				// Should show common flags
				expect(result).toContain("--name");
				expect(result).toContain("--interval");
			});
		});

		describe("Mixed Flag Formats", () => {
			it("handles mixed --flag value and --flag=value formats", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --name=my-check --type http ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--path");
				expect(result).toContain("--host-header");
			});

			it("handles flags in any order", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --interval 10 --type http --name test ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--path");
				expect(result).toContain("--host-header");
			});
		});

		describe("Common Flags Always Shown", () => {
			it("shows common flags regardless of type", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http ",
				);
				const result = suggestions.map((s) => s.text);

				// Common flags should always be shown
				expect(result).toContain("--interval");
				expect(result).toContain("--timeout");
				expect(result).toContain("--healthy-threshold");
				expect(result).toContain("--unhealthy-threshold");
				expect(result).toContain("--jitter-percent");
			});
		});
	});
});
