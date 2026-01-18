/**
 * Type-Specific Conditional Flag Completion - Comprehensive Test Matrix
 *
 * This file provides comprehensive user acceptance testing for the type-specific
 * conditional flag completion feature. It tests all scenarios from the implementation plan.
 *
 * TEST MATRIX STRUCTURE:
 * - HTTP Type Scenarios
 * - TCP Type Scenarios
 * - DNS Type Scenarios
 * - UDP-ICMP Type Scenarios
 * - No Type Specified Scenarios
 * - Type Change Mid-Command Scenarios
 * - Edge Cases and Format Variations
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

setupTestEnvironment();

describe("Type-Specific Conditional Flag Completion - User Acceptance Test Matrix", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	// ============================================================================
	// TEST CATEGORY 1: HTTP TYPE SCENARIOS
	// ============================================================================

	describe("CATEGORY 1: HTTP Type Scenarios", () => {
		describe("1.1: HTTP Type - Shows HTTP-specific flags", () => {
			it("✓ TEST 1.1.1: --type http shows HTTP-specific flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http ",
				);
				const result = suggestions.map((s) => s.text);

				// EXPECTED: HTTP-specific flags
				expect(result).toContain("--path");
				expect(result).toContain("--expected-status-codes");
				expect(result).toContain("--host-header");
				expect(result).toContain("--use-http2");
				expect(result).toContain("--use-origin-server-name");
				expect(result).toContain("--request-headers-to-remove");

				// EXPECTED: Common flags still shown
				expect(result).toContain("--name");
				expect(result).toContain("--interval");
				expect(result).toContain("--timeout");

				// NOT EXPECTED: TCP-specific flags
				expect(result).not.toContain("--expected-response");
				expect(result).not.toContain("--send-payload");

				// NOT EXPECTED: DNS-specific flags
				expect(result).not.toContain("--query-name");
				expect(result).not.toContain("--expected-response-dns");
			});

			it("✓ TEST 1.1.2: Short form -t http works identically", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck -t http ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--path");
				expect(result).toContain("--host-header");
				expect(result).not.toContain("--send-payload");
			});

			it("✓ TEST 1.1.3: Equals syntax --type=http works", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type=http ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--path");
				expect(result).toContain("--host-header");
			});
		});

		describe("1.2: HTTP Type - Excludes non-HTTP flags", () => {
			it("✓ TEST 1.2.1: HTTP type EXCLUDES TCP flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).not.toContain("--expected-response");
				expect(result).not.toContain("--send-payload");
			});

			it("✓ TEST 1.2.2: HTTP type EXCLUDES DNS flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).not.toContain("--query-name");
				expect(result).not.toContain("--expected-response-dns");
			});
		});

		describe("1.3: HTTP Type - Flag ordering and metadata", () => {
			it("✓ TEST 1.3.1: Core flags (required + defaults) appear first", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http ",
				);

				const coreFlags = ["--name", "--type", "--interval", "--timeout", "--healthy-threshold", "--unhealthy-threshold"];
				const optionalFlags = ["--path", "--host-header"];

				// Find first core and first optional
				let firstCoreIndex = Infinity;
				let firstOptionalIndex = -1;

				suggestions.forEach((s, idx) => {
					if (coreFlags.includes(s.text)) {
						firstCoreIndex = Math.min(firstCoreIndex, idx);
					}
					if (optionalFlags.includes(s.text)) {
						firstOptionalIndex = Math.max(firstOptionalIndex, idx);
					}
				});

				// Core flags should come before optional
				expect(firstCoreIndex).toBeLessThan(firstOptionalIndex);
			});

			it("✓ TEST 1.3.2: Repeatable flag shows repeatable marker", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http ",
				);

				const repeatableFlag = suggestions.find((s) => s.text === "--request-headers-to-remove");
				expect(repeatableFlag).toBeDefined();
				expect(repeatableFlag?.description).toContain("repeatable");
			});
		});
	});

	// ============================================================================
	// TEST CATEGORY 2: TCP TYPE SCENARIOS
	// ============================================================================

	describe("CATEGORY 2: TCP Type Scenarios", () => {
		describe("2.1: TCP Type - Shows TCP-specific flags", () => {
			it("✓ TEST 2.1.1: --type tcp shows TCP-specific flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type tcp ",
				);
				const result = suggestions.map((s) => s.text);

				// EXPECTED: TCP-specific flags
				expect(result).toContain("--expected-response");
				expect(result).toContain("--send-payload");

				// EXPECTED: Common flags
				expect(result).toContain("--name");
				expect(result).toContain("--interval");

				// NOT EXPECTED: HTTP-specific flags
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--host-header");
				expect(result).not.toContain("--use-http2");
				expect(result).not.toContain("--use-origin-server-name");
				expect(result).not.toContain("--request-headers-to-remove");

				// NOT EXPECTED: DNS-specific flags
				expect(result).not.toContain("--query-name");
				expect(result).not.toContain("--expected-response-dns");
			});

			it("✓ TEST 2.1.2: Short form -t tcp works", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck -t tcp ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--expected-response");
				expect(result).toContain("--send-payload");
			});

			it("✓ TEST 2.1.3: Equals syntax --type=tcp works", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type=tcp ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--expected-response");
				expect(result).toContain("--send-payload");
			});
		});

		describe("2.2: TCP Type - Excludes non-TCP flags", () => {
			it("✓ TEST 2.2.1: TCP type EXCLUDES all 6 HTTP flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type tcp ",
				);
				const result = suggestions.map((s) => s.text);

				const httpFlags = ["--path", "--expected-status", "--host-header", "--use-http2", "--use-origin-server-name", "--request-headers-to-remove"];

				for (const flag of httpFlags) {
					expect(result).not.toContain(flag);
				}
			});

			it("✓ TEST 2.2.2: TCP type EXCLUDES DNS flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type tcp ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).not.toContain("--query-name");
				expect(result).not.toContain("--expected-response-dns");
			});
		});
	});

	// ============================================================================
	// TEST CATEGORY 3: DNS TYPE SCENARIOS
	// ============================================================================

	describe("CATEGORY 3: DNS Type Scenarios", () => {
		describe("3.1: DNS Type - Shows DNS-specific flags", () => {
			it("✓ TEST 3.1.1: --type dns shows DNS-specific flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type dns ",
				);
				const result = suggestions.map((s) => s.text);

				// EXPECTED: DNS-specific flags
				expect(result).toContain("--query-name");
				expect(result).toContain("--expected-response-dns");

				// EXPECTED: Common flags
				expect(result).toContain("--name");
				expect(result).toContain("--interval");

				// NOT EXPECTED: HTTP flags
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--host-header");

				// NOT EXPECTED: TCP flags
				expect(result).not.toContain("--expected-response");
				expect(result).not.toContain("--send-payload");
			});

			it("✓ TEST 3.1.2: Short form -t dns works", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck -t dns ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--query-name");
				expect(result).toContain("--expected-response-dns");
			});

			it("✓ TEST 3.1.3: Equals syntax --type=dns works", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type=dns ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--query-name");
				expect(result).toContain("--expected-response-dns");
			});
		});

		describe("3.2: DNS Type - Excludes non-DNS flags", () => {
			it("✓ TEST 3.2.1: DNS type EXCLUDES all HTTP flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type dns ",
				);
				const result = suggestions.map((s) => s.text);

				const httpFlags = ["--path", "--expected-status", "--host-header", "--use-http2", "--use-origin-server-name", "--request-headers-to-remove"];

				for (const flag of httpFlags) {
					expect(result).not.toContain(flag);
				}
			});

			it("✓ TEST 3.2.2: DNS type EXCLUDES all TCP flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type dns ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).not.toContain("--expected-response");
				expect(result).not.toContain("--send-payload");
			});
		});
	});

	// ============================================================================
	// TEST CATEGORY 4: UDP-ICMP TYPE SCENARIOS
	// ============================================================================

	describe("CATEGORY 4: UDP-ICMP Type Scenarios", () => {
		describe("4.1: UDP-ICMP Type - Shows only common flags", () => {
			it("✓ TEST 4.1.1: --type udp-icmp shows NO type-specific flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type udp-icmp ",
				);
				const result = suggestions.map((s) => s.text);

				// EXPECTED: Common flags only
				expect(result).toContain("--name");
				expect(result).toContain("--interval");
				expect(result).toContain("--timeout");
				expect(result).toContain("--healthy-threshold");

				// NOT EXPECTED: Any type-specific flags
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--host-header");
				expect(result).not.toContain("--expected-response");
				expect(result).not.toContain("--send-payload");
				expect(result).not.toContain("--query-name");
				expect(result).not.toContain("--expected-response-dns");
			});

			it("✓ TEST 4.1.2: Short form -t udp-icmp works", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck -t udp-icmp ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--name");
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--send-payload");
			});
		});
	});

	// ============================================================================
	// TEST CATEGORY 5: NO TYPE SPECIFIED SCENARIOS
	// ============================================================================

	describe("CATEGORY 5: No Type Specified Scenarios", () => {
		describe("5.1: No Type - Shows only common flags", () => {
			it("✓ TEST 5.1.1: No --type specified shows ONLY common flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck ",
				);
				const result = suggestions.map((s) => s.text);

				// EXPECTED: Common flags
				expect(result).toContain("--name");
				expect(result).toContain("--type");
				expect(result).toContain("--interval");
				expect(result).toContain("--timeout");
				expect(result).toContain("--healthy-threshold");
				expect(result).toContain("--unhealthy-threshold");
				expect(result).toContain("--jitter-percent");
				expect(result).toContain("--file");

				// NOT EXPECTED: ANY type-specific flags
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--host-header");
				expect(result).not.toContain("--use-http2");
				expect(result).not.toContain("--use-origin-server-name");
				expect(result).not.toContain("--request-headers-to-remove");
				expect(result).not.toContain("--expected-status");
				expect(result).not.toContain("--expected-response");
				expect(result).not.toContain("--send-payload");
				expect(result).not.toContain("--query-name");
				expect(result).not.toContain("--expected-response-dns");
			});

			it("✓ TEST 5.1.2: No type with other flags still hides type-specific", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --name test --interval 10 ",
				);
				const result = suggestions.map((s) => s.text);

				// Should still hide type-specific flags
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--send-payload");
				expect(result).not.toContain("--query-name");
			});
		});

		describe("5.2: No Type - Count verification", () => {
			it("✓ TEST 5.2.1: Verify exact count of type-specific flags hidden", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck ",
				);
				const result = suggestions.map((s) => s.text);

				// Count type-specific flags that should be hidden
				const typeSpecificFlags = [
					"--path", "--expected-status", "--host-header",
					"--use-http2", "--use-origin-server-name", "--request-headers-to-remove",
					"--expected-response", "--send-payload",
					"--query-name", "--expected-response-dns"
				];

				const foundTypeSpecific = result.filter(flag => typeSpecificFlags.includes(flag));
				expect(foundTypeSpecific).toHaveLength(0);
			});
		});
	});

	// ============================================================================
	// TEST CATEGORY 6: TYPE CHANGE MID-COMMAND SCENARIOS
	// ============================================================================

	describe("CATEGORY 6: Type Change Mid-Command Scenarios", () => {
		describe("6.1: Type Change - Reflects current type", () => {
			it("✓ TEST 6.1.1: HTTP → TCP change shows TCP flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http --path /health --type tcp ",
				);
				const result = suggestions.map((s) => s.text);

				// EXPECTED: TCP flags (current type)
				expect(result).toContain("--expected-response");
				expect(result).toContain("--send-payload");

				// NOT EXPECTED: HTTP flags (overridden)
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--host-header");
				expect(result).not.toContain("--use-http2");
			});

			it("✓ TEST 6.1.2: TCP → DNS change shows DNS flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type tcp --expected-response 0x4f4b --type dns ",
				);
				const result = suggestions.map((s) => s.text);

				// EXPECTED: DNS flags
				expect(result).toContain("--query-name");
				expect(result).toContain("--expected-response-dns");

				// NOT EXPECTED: TCP flags
				expect(result).not.toContain("--send-payload");
				expect(result).not.toContain("--expected-response");
			});

			it("✓ TEST 6.1.3: DNS → HTTP change shows HTTP flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type dns --query-name example.com --type http ",
				);
				const result = suggestions.map((s) => s.text);

				// EXPECTED: HTTP flags
				expect(result).toContain("--path");
				expect(result).toContain("--host-header");

				// NOT EXPECTED: DNS flags
				expect(result).not.toContain("--query-name");
				expect(result).not.toContain("--expected-response-dns");
			});

			it("✓ TEST 6.1.4: Multiple type changes - last one wins", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http --type tcp --type dns ",
				);
				const result = suggestions.map((s) => s.text);

				// Should show DNS flags (final type)
				expect(result).toContain("--query-name");
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--send-payload");
			});
		});
	});

	// ============================================================================
	// TEST CATEGORY 7: MIXED FLAG FORMAT SCENARIOS
	// ============================================================================

	describe("CATEGORY 7: Mixed Flag Format Scenarios", () => {
		describe("7.1: Flag format variations", () => {
			it("✓ TEST 7.1.1: Mixed --flag value and --flag=value", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --name=test --type http --interval 10 ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--path");
				expect(result).toContain("--host-header");
			});

			it("✓ TEST 7.1.2: Flags in any order work correctly", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --interval 10 --type http --name test ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--path");
				expect(result).toContain("--host-header");
			});

			it("✓ TEST 7.1.3: Short and long forms mixed", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck -t http --name test -ns default ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--path");
				expect(result).toContain("--host-header");
			});

			it("✓ TEST 7.1.4: Type at end of command", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --name test --interval 10 --type tcp ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--expected-response");
				expect(result).toContain("--send-payload");
			});
		});
	});

	// ============================================================================
	// TEST CATEGORY 8: APPLY ACTION SCENARIOS
	// ============================================================================

	describe("CATEGORY 8: Apply Action Scenarios", () => {
		describe("8.1: Apply action works identically to create", () => {
			it("✓ TEST 8.1.1: apply with --type http shows HTTP flags", async () => {
				const suggestions = await completer.complete(
					"/virtual apply healthcheck --type http ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--path");
				expect(result).toContain("--host-header");
				expect(result).not.toContain("--send-payload");
			});

			it("✓ TEST 8.1.2: apply with --type tcp shows TCP flags", async () => {
				const suggestions = await completer.complete(
					"/virtual apply healthcheck --type tcp ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--expected-response");
				expect(result).toContain("--send-payload");
				expect(result).not.toContain("--path");
			});

			it("✓ TEST 8.1.3: apply with no type shows only common flags", async () => {
				const suggestions = await completer.complete(
					"/virtual apply healthcheck ",
				);
				const result = suggestions.map((s) => s.text);

				expect(result).toContain("--name");
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--send-payload");
			});
		});
	});

	// ============================================================================
	// TEST CATEGORY 9: EDGE CASES AND BOUNDARY CONDITIONS
	// ============================================================================

	describe("CATEGORY 9: Edge Cases and Boundary Conditions", () => {
		describe("9.1: Invalid or unusual inputs", () => {
			it("✓ TEST 9.1.1: Invalid type value shows no type-specific flags", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type invalid ",
				);
				const result = suggestions.map((s) => s.text);

				// Should not show any type-specific flags for invalid type
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--send-payload");
				expect(result).not.toContain("--query-name");

				// Should still show common flags
				expect(result).toContain("--name");
				expect(result).toContain("--interval");
			});

			it("✓ TEST 9.1.2: Empty type value treated as no type", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type  ",
				);
				const result = suggestions.map((s) => s.text);

				// Should not show type-specific flags
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--send-payload");
			});

			it("✓ TEST 9.1.3: Case sensitivity matters for type values", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type HTTP ",
				);
				const result = suggestions.map((s) => s.text);

				// "HTTP" (uppercase) should not match "http"
				expect(result).not.toContain("--path");
				expect(result).not.toContain("--host-header");
			});
		});

		describe("9.2: Global flags always available", () => {
			it("✓ TEST 9.2.1: Global flags shown regardless of type", async () => {
				const suggestions = await completer.complete(
					"/virtual create healthcheck --type http ",
				);
				const result = suggestions.map((s) => s.text);

				// Global flags should always be present
				expect(result).toContain("--namespace");
				expect(result).toContain("--output");
			});

			it("✓ TEST 9.2.2: --file flag always shown for create/apply", async () => {
				const httpSuggestions = await completer.complete(
					"/virtual create healthcheck --type http ",
				);
				const tcpSuggestions = await completer.complete(
					"/virtual create healthcheck --type tcp ",
				);
				const noTypeSuggestions = await completer.complete(
					"/virtual create healthcheck ",
				);

				expect(httpSuggestions.map(s => s.text)).toContain("--file");
				expect(tcpSuggestions.map(s => s.text)).toContain("--file");
				expect(noTypeSuggestions.map(s => s.text)).toContain("--file");
			});
		});
	});

	// ============================================================================
	// TEST CATEGORY 10: REGRESSION PREVENTION
	// ============================================================================

	describe("CATEGORY 10: Regression Prevention", () => {
		describe("10.1: Origin pool flags unaffected", () => {
			it("✓ TEST 10.1.1: Origin pool flags still work (no applicableTypes)", async () => {
				const suggestions = await completer.complete(
					"/virtual create origin_pool ",
				);
				const result = suggestions.map((s) => s.text);

				// Origin pool has no type-specific filtering
				expect(result).toContain("--name");
				expect(result).toContain("--port");
				expect(result).toContain("--public-ip");
				expect(result).toContain("--algorithm");
			});
		});

		describe("10.2: Common healthcheck flags always work", () => {
			it("✓ TEST 10.2.1: Required common flags always shown (when not yet used)", async () => {
				const noType = await completer.complete("/virtual create healthcheck ");
				const noTypeResult = noType.map(s => s.text);

				// When no type specified, all common flags should be shown
				const commonFlags = ["--name", "--type", "--interval", "--timeout", "--healthy-threshold", "--unhealthy-threshold"];
				for (const flag of commonFlags) {
					expect(noTypeResult).toContain(flag);
				}
			});

			it("✓ TEST 10.2.2: Common flags (except --type) shown after type specified", async () => {
				const httpType = await completer.complete("/virtual create healthcheck --type http ");
				const tcpType = await completer.complete("/virtual create healthcheck --type tcp ");
				const httpResult = httpType.map(s => s.text);
				const tcpResult = tcpType.map(s => s.text);

				// Common flags should still be shown (except --type which is already used)
				const commonFlagsAfterType = ["--name", "--interval", "--timeout", "--healthy-threshold", "--unhealthy-threshold", "--jitter-percent"];

				for (const flag of commonFlagsAfterType) {
					expect(httpResult).toContain(flag);
					expect(tcpResult).toContain(flag);
				}

				// --type should NOT be shown again (already used)
				expect(httpResult).not.toContain("--type");
				expect(tcpResult).not.toContain("--type");
			});
		});
	});
});
