/**
 * Domain Verb → Resource Name Completion Tests
 *
 * Tests for the completion regression fix: ensure that after typing a verb
 * like "create", the system shows resource names, NOT verbs again.
 *
 * Bug: /virtual create<TAB> was showing verbs (list, get, create, delete...)
 * Fix: /virtual create<TAB> now shows resources (http_loadbalancer, origin_pool...)
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

describe("Domain Verb → Resource Name Completion (Regression Tests)", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("Virtual Domain - All Resource Actions", () => {
		it("should show resource names after 'create' verb (PRIMARY BUG FIX)", async () => {
			const suggestions = await completer.complete("/virtual create ");
			const result = suggestions.map((s) => s.text);

			// Should contain virtual domain primary resources
			expect(result).toContain("http_loadbalancer");
			expect(result).toContain("tcp_loadbalancer");
			expect(result).toContain("origin_pool");
			expect(result).toContain("healthcheck");

			// Should NOT contain verbs (no double verb display)
			expect(result).not.toContain("list");
			expect(result).not.toContain("get");
			expect(result).not.toContain("create");
			expect(result).not.toContain("delete");
			expect(result).not.toContain("replace");
			expect(result).not.toContain("apply");
			expect(result).not.toContain("status");
			expect(result).not.toContain("patch");
		});

		it("should show resource names after 'replace' verb", async () => {
			const suggestions = await completer.complete("/virtual replace ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http_loadbalancer");
			expect(result).toContain("tcp_loadbalancer");
			expect(result).not.toContain("create");
			expect(result).not.toContain("list");
		});

		it("should show resource names after 'patch' verb", async () => {
			const suggestions = await completer.complete("/virtual patch ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http_loadbalancer");
			expect(result).toContain("origin_pool");
			expect(result).not.toContain("delete");
			expect(result).not.toContain("get");
		});

		it("should show resource names after 'apply' verb", async () => {
			const suggestions = await completer.complete("/virtual apply ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http_loadbalancer");
			expect(result).not.toContain("status");
			expect(result).not.toContain("patch");
		});

		it("should show resource names after 'add-labels' verb", async () => {
			const suggestions = await completer.complete("/virtual add-labels ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http_loadbalancer");
			expect(result).not.toContain("remove-labels");
			expect(result).not.toContain("add-labels");
		});

		it("should show resource names after 'remove-labels' verb", async () => {
			const suggestions = await completer.complete("/virtual remove-labels ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http_loadbalancer");
			expect(result).not.toContain("add-labels");
			expect(result).not.toContain("list");
		});

		it("should show resource names after 'list' verb (existing behavior)", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);


			expect(result).toContain("http_loadbalancer");
			expect(result).not.toContain("list");
			expect(result).not.toContain("create");
		});

		it("should show resource names after 'get' verb (existing behavior)", async () => {
			const suggestions = await completer.complete("/virtual get ");
			const result = suggestions.map((s) => s.text);


			expect(result).toContain("http_loadbalancer");
			expect(result).not.toContain("get");
			expect(result).not.toContain("delete");
		});

		it("should show resource names after 'delete' verb (existing behavior)", async () => {
			const suggestions = await completer.complete("/virtual delete ");
			const result = suggestions.map((s) => s.text);


			expect(result).toContain("http_loadbalancer");
			expect(result).not.toContain("delete");
			expect(result).not.toContain("create");
		});

		it("should show resource names after 'status' verb (existing behavior)", async () => {
			const suggestions = await completer.complete("/virtual status ");
			const result = suggestions.map((s) => s.text);


			expect(result).toContain("http_loadbalancer");
			expect(result).not.toContain("status");
			expect(result).not.toContain("list");
		});
	});

	describe("Certificates Domain - All Resource Actions", () => {
		it("should show certificate resources after 'create' verb", async () => {
			const suggestions = await completer.complete("/certificates create ");
			const result = suggestions.map((s) => s.text);


			// Should contain certificate domain resources
			expect(result.length).toBeGreaterThan(0);
			expect(result).toContain("certificate");

			// Should NOT contain verbs
			expect(result).not.toContain("create");
			expect(result).not.toContain("list");
			expect(result).not.toContain("delete");
		});

		it("should show certificate resources after 'replace' verb", async () => {
			const suggestions = await completer.complete("/certificates replace ");
			const result = suggestions.map((s) => s.text);


			expect(result).toContain("certificate");
			expect(result).not.toContain("replace");
			expect(result).not.toContain("patch");
		});

		it("should show certificate resources after 'patch' verb", async () => {
			const suggestions = await completer.complete("/certificates patch ");
			const result = suggestions.map((s) => s.text);


			expect(result).toContain("certificate");
			expect(result).not.toContain("patch");
			expect(result).not.toContain("create");
		});

		it("should show certificate resources after 'list' verb", async () => {
			const suggestions = await completer.complete("/certificates list ");
			const result = suggestions.map((s) => s.text);


			expect(result).toContain("certificate");
			expect(result).not.toContain("list");
			expect(result).not.toContain("get");
		});
	});

	describe("API Domain - All Resource Actions", () => {
		it("should show API resources after 'create' verb", async () => {
			const suggestions = await completer.complete("/api create ");
			const result = suggestions.map((s) => s.text);


			// Should contain at least one API resource
			expect(result.length).toBeGreaterThan(0);

			// Should NOT contain verbs
			expect(result).not.toContain("create");
			expect(result).not.toContain("list");
			expect(result).not.toContain("delete");
			expect(result).not.toContain("replace");
			expect(result).not.toContain("apply");
		});

		it("should show API resources after 'replace' verb", async () => {
			const suggestions = await completer.complete("/api replace ");
			const result = suggestions.map((s) => s.text);


			expect(result.length).toBeGreaterThan(0);
			expect(result).not.toContain("replace");
			expect(result).not.toContain("patch");
		});

		it("should show API resources after 'list' verb", async () => {
			const suggestions = await completer.complete("/api list ");
			const result = suggestions.map((s) => s.text);


			expect(result.length).toBeGreaterThan(0);
			expect(result).not.toContain("list");
			expect(result).not.toContain("get");
		});
	});

	describe("Comprehensive Verb Coverage Matrix", () => {
		const resourceActions = [
			"list",
			"get",
			"create",
			"delete",
			"replace",
			"apply",
			"status",
			"patch",
			"add-labels",
			"remove-labels",
		];

		// Test all actions for virtual domain
		for (const action of resourceActions) {
			it(`virtual domain: '${action}' verb should show resources, not verbs`, async () => {
				const suggestions = await completer.complete(`/virtual ${action} `);
			const result = suggestions.map((s) => s.text);


				// Should contain at least one resource name
				expect(result.length).toBeGreaterThan(0);

				// Should NOT contain ANY verb names (no double verb display)
				for (const verb of resourceActions) {
					expect(result).not.toContain(verb);
				}

				// Should contain at least one known virtual resource
				const hasResource =
					result.includes("http_loadbalancer") ||
					result.includes("tcp_loadbalancer") ||
					result.includes("origin_pool") ||
					result.includes("healthcheck");
				expect(hasResource).toBe(true);
			});
		}
	});

	describe("Regression Prevention - Verify Initial Verb Display Still Works", () => {
		it("should show verbs when only domain is typed (no verb yet)", async () => {
			const suggestions = await completer.complete("/virtual ");
			const result = suggestions.map((s) => s.text);


			// Should show ALL verbs initially
			expect(result).toContain("list");
			expect(result).toContain("get");
			expect(result).toContain("create");
			expect(result).toContain("delete");
			expect(result).toContain("replace");
			expect(result).toContain("apply");
			expect(result).toContain("status");
			expect(result).toContain("patch");

			// Should NOT show resource names at this stage
			expect(result).not.toContain("http_loadbalancer");
			expect(result).not.toContain("origin_pool");
		});

		it("should show verbs for certificates domain initially", async () => {
			const suggestions = await completer.complete("/certificates ");
			const result = suggestions.map((s) => s.text);


			expect(result).toContain("list");
			expect(result).toContain("create");
			expect(result).toContain("delete");

			// Should NOT show resources yet
			expect(result).not.toContain("certificate");
			expect(result).not.toContain("ca_certificate");
		});

		it("should show verbs for api domain initially", async () => {
			const suggestions = await completer.complete("/api ");
			const result = suggestions.map((s) => s.text);


			expect(result).toContain("list");
			expect(result).toContain("create");
			expect(result).toContain("get");

			// Result should be verbs, not resources
			// (API has many resources, but none should appear here)
			const hasVerbs =
				result.includes("list") || result.includes("get") || result.includes("create");
			expect(hasVerbs).toBe(true);
		});
	});

	describe("Complete Flow End-to-End", () => {
		it("should follow correct completion flow: domain → verb → resource", async () => {
			// Step 1: /virtual<TAB> (with space) - Show verbs
			const step1Suggestions = await completer.complete("/virtual ");
			const step1 = step1Suggestions.map((s) => s.text);
			expect(step1).toContain("create");
			expect(step1).toContain("list");
			expect(step1).not.toContain("http_loadbalancer"); // No resources yet

			// Step 2: /virtual create<TAB> (with space) - Show resources
			const step2Suggestions = await completer.complete("/virtual create ");
			const step2 = step2Suggestions.map((s) => s.text);
			expect(step2).toContain("http_loadbalancer");
			expect(step2).not.toContain("create"); // No verbs anymore
			expect(step2).not.toContain("list");

			// Step 3: Partial resource name - Show filtered resources
			const step3Suggestions = await completer.complete("/virtual create http");
			const step3 = step3Suggestions.map((s) => s.text);
			expect(step3).toContain("http_loadbalancer");
			expect(step3).not.toContain("tcp_loadbalancer"); // Filtered out
		});

		it("should follow correct flow for certificates domain", async () => {
			// Step 1: Show verbs
			const step1Suggestions = await completer.complete("/certificates ");
			const step1 = step1Suggestions.map((s) => s.text);
			expect(step1).toContain("create");
			expect(step1).not.toContain("certificate");

			// Step 2: Show resources
			const step2Suggestions = await completer.complete("/certificates create ");
			const step2 = step2Suggestions.map((s) => s.text);
			expect(step2).toContain("certificate");
			expect(step2).not.toContain("create");
		});
	});

	describe("Edge Cases and Special Scenarios", () => {
		it("should handle partial verb typing correctly", async () => {
			// User types "/virtual cre" (partial verb)
			const suggestions = await completer.complete("/virtual cre");
			const result = suggestions.map((s) => s.text);


			// Should show "create" verb (completing the partial)
			expect(result).toContain("create");

			// Should NOT show resources yet (verb not fully selected)
			expect(result).not.toContain("http_loadbalancer");
		});

		it("should handle case sensitivity correctly", async () => {
			// Lowercase verb should work
			const suggestions1 = await completer.complete("/virtual create ");
			const result1 = suggestions1.map((s) => s.text);
			expect(result1).toContain("http_loadbalancer");

			// Note: Command system normalizes to lowercase, so uppercase won't match
			// but this tests that the fix doesn't break case handling
		});

		it("should handle hyphenated verbs correctly", async () => {
			// Test that add-labels and remove-labels work
			const suggestions1 = await completer.complete("/virtual add-labels ");
			const result1 = suggestions1.map((s) => s.text);
			expect(result1).toContain("http_loadbalancer");
			expect(result1).not.toContain("add-labels");

			const suggestions2 = await completer.complete("/virtual remove-labels ");
			const result2 = suggestions2.map((s) => s.text);
			expect(result2).toContain("http_loadbalancer");
			expect(result2).not.toContain("remove-labels");
		});
	});

	describe("Fall-Through Bug Regression Guards", () => {
		/**
		 * These tests specifically target the recurring regression where
		 * `domain verb ` falls through to domain-level suggestions.
		 *
		 * Bug pattern: When filterSuggestions() returns empty array,
		 * the code would fall through instead of returning all resource types.
		 */

		it("CRITICAL: filterSuggestions empty result should show all resources", async () => {
			// Type a partial that matches NO resources
			// This triggers the edge case where filtered.length === 0
			const suggestions = await completer.complete("/virtual get xyznonexistent");
			const result = suggestions.map((s) => s.text);

			// Should show ALL resources as fallback (the fix)
			expect(result).toContain("http_loadbalancer");
			expect(result).toContain("tcp_loadbalancer");
			expect(result).toContain("origin_pool");

			// Must NOT show verbs (fall-through to domain suggestions)
			expect(result).not.toContain("list");
			expect(result).not.toContain("get");
			expect(result).not.toContain("create");
			expect(result).not.toContain("delete");
		});

		it("CRITICAL: non-escaped domain verb shows resources", async () => {
			// Without "/" prefix - this path was also affected
			const suggestions = await completer.complete("virtual get ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http_loadbalancer");
			expect(result).not.toContain("list");
			expect(result).not.toContain("get");
		});

		it("CRITICAL: all verbs behave consistently (matrix check)", async () => {
			const verbs = ["list", "get", "create", "delete", "replace", "apply", "status", "patch"];

			for (const verb of verbs) {
				const suggestions = await completer.complete(`/virtual ${verb} `);
				const result = suggestions.map((s) => s.text);

				// Every verb should show resources
				expect(result).toContain("http_loadbalancer");

				// No verb should show other verbs
				for (const otherVerb of verbs) {
					expect(result).not.toContain(otherVerb);
				}
			}
		});

		it("CRITICAL: suggestions include action-specific flags", async () => {
			// After the fix, we always return resources + action flags
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			// Should have resources
			expect(result).toContain("http_loadbalancer");

			// Should also have flags (action-specific)
			expect(result.some(r => r.startsWith("--"))).toBe(true);
		});
	});
});
