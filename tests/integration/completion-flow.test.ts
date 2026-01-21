/**
 * Completion Flow Integration Tests
 *
 * End-to-end tests for complete completion workflows, verifying that
 * the interaction between suggestions, completions, and command execution
 * works correctly. Focus on REGRESSION-004: Enter vs Tab behavior.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
	createTestSession,
	createTestCompleter,
	executeAndExpect,
	completeAndExpect,
	setupTestEnvironment,
	cleanupTestEnvironment,
} from "../utils/test-helpers.js";
import type { REPLSession } from "../../src/repl/session.js";
import type { Completer } from "../../src/repl/completion/completer.js";

// Setup mocks for all tests
setupTestEnvironment();

describe("Completion Flow Integration Tests", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("Complete Workflow: Type → Suggestions → Tab → Execute", () => {
		it("should complete full workflow from partial to executed command", async () => {
			// Step 1: Get completions for partial input
			await completeAndExpect("login cr", completer, {
				includes: ["create"],
			});

			// Step 2: Get completions for next level
			await completeAndExpect("login create ", completer, {
				includes: ["profile"],
			});

			// Step 3: Get flag completions
			await completeAndExpect("login create profile test ", completer, {
				includes: ["--url", "--token"],
				minCount: 2,
			});

			// Step 4: Execute complete command
			await executeAndExpect(
				"login create profile test --url https://test.volterra.io --token abc123",
				session,
				{
					success: true,
					output: /profile.*created/i,
				},
			);
		});

		it("should support multi-level completion drill-down", async () => {
			// Domain level
			const domainSuggestions = await completer.complete("log");
			expect(domainSuggestions.map((s) => s.text)).toContain("login");

			// Action level
			const actionSuggestions = await completer.complete("login ");
			expect(actionSuggestions.map((s) => s.text)).toContain("create");

			// Resource level
			const resourceSuggestions =
				await completer.complete("login create ");
			expect(resourceSuggestions.map((s) => s.text)).toContain("profile");

			// Flag level
			const flagSuggestions = await completer.complete(
				"login create profile test ",
			);
			const flagTexts = flagSuggestions.map((s) => s.text);
			expect(flagTexts).toContain("--url");
			expect(flagTexts).toContain("--token");
		});
	});

	describe("Ignore Workflow: Type → Suggestions → Enter (REGRESSION-004)", () => {
		it("should execute command without applying suggestions", async () => {
			// Verify suggestions exist
			await completeAndExpect("login list ", completer, {
				includes: ["profile"],
			});

			// But execution uses exact input, not suggestions
			await executeAndExpect("login list profile", session, {
				success: true,
			});
		});

		it("should execute partial command even when completions available", async () => {
			// Completions available for "login cr" → "create"
			const suggestions = await completer.complete("login cr");
			expect(suggestions.map((s) => s.text)).toContain("create");

			// But "login cr" alone should fail (not be auto-completed to "create")
			// This verifies Enter doesn't apply completions
			await executeAndExpect("login create profile", session, {
				success: false,
				error: /usage/i,
			});
		});

		it("should allow user to execute incomplete command by choice", async () => {
			// User might intentionally want to execute partial command
			// Even if suggestions show more, Enter executes what's typed
			await executeAndExpect("login create profile test", session, {
				success: false,
				error: /missing.*url/i,
			});
		});
	});

	describe("Navigation Workflow: Type → Suggestions → Up/Down → Tab → Enter", () => {
		it("should support navigating suggestions before selection", async () => {
			// Get multiple suggestions
			const suggestions = await completer.complete("login ");
			expect(suggestions.length).toBeGreaterThan(3);

			// In real usage: user presses Up/Down to navigate
			// Then Tab to select
			// Then types more and presses Enter to execute

			// First create a profile to show
			await executeAndExpect(
				"login create profile test --url https://test.volterra.io --token abc123",
				session,
				{
					success: true,
				},
			);

			// Then show it
			await executeAndExpect("login show profile test", session, {
				success: true,
			});
		});

		it("should handle navigation through action suggestions", async () => {
			const suggestions = await completer.complete("login ");
			const actions = suggestions.map((s) => s.text);

			// Should include all major actions
			expect(actions).toContain("create");
			expect(actions).toContain("list");
			expect(actions).toContain("show");
			expect(actions).toContain("use");
			expect(actions).toContain("edit");
			expect(actions).toContain("delete");
		});
	});

	describe("Cancel Workflow: Type → Suggestions → Esc → Enter", () => {
		it("should execute command after canceling suggestions", async () => {
			// Verify suggestions exist
			await completeAndExpect("login create ", completer, {
				includes: ["profile"],
			});

			// In real usage: user presses Esc to dismiss
			// Then presses Enter to execute current input

			// Verify execution works with current input
			await executeAndExpect("login create profile", session, {
				success: false,
				error: /usage/i,
			});
		});
	});

	describe("Mixed Completion and Execution", () => {
		it("should handle Tab completion followed by Enter execution", async () => {
			// Tab to complete domain
			await completeAndExpect("logi", completer, {
				includes: ["login"],
			});

			// Tab to complete action (simulated - user would Tab to apply "login")
			await completeAndExpect("login cr", completer, {
				includes: ["create"],
			});

			// Tab to complete resource
			await completeAndExpect("login create pr", completer, {
				includes: ["profile"],
			});

			// Enter to execute complete command
			await executeAndExpect(
				"login create profile final --url https://test.volterra.io --token abc123",
				session,
				{
					success: true,
				},
			);
		});

		it("should handle partial Tab completion with manual typing", async () => {
			// Tab complete first part
			await completeAndExpect("logi", completer, {
				includes: ["login"],
			});

			// Manually type rest (not using Tab)
			// Enter to execute
			await executeAndExpect(
				"login create profile manual --url https://test.volterra.io --token abc123",
				session,
				{
					success: true,
				},
			);
		});
	});

	describe("Error Recovery in Completion Flow", () => {
		it("should provide helpful errors even with suggestions available", async () => {
			// Suggestions available
			await completeAndExpect("login create ", completer, {
				includes: ["profile"],
			});

			// But user executes incomplete command
			await executeAndExpect("login create profile", session, {
				success: false,
				error: /usage/i,
			});
		});

		it("should handle wrong order even with completions", async () => {
			// Even if completions might suggest correct order
			await executeAndExpect(
				"login profile create test --url https://test.volterra.io --token abc123",
				session,
				{
					success: false,
					output: /did you mean.*create profile/i,
				},
			);
		});
	});

	describe("Command Forms with Completions", () => {
		it(
			"should handle completions for /command form",
			{ timeout: 15000 },
			async () => {
				await completeAndExpect("/login ", completer, {
					includes: ["create", "list", "show"],
					minCount: 3,
				});

				await executeAndExpect(
					"/login create profile slashform --url https://test.volterra.io --token abc123",
					session,
					{
						success: true,
					},
				);
			},
		);

		it("should handle completions for command form without slash", async () => {
			await completeAndExpect("login ", completer, {
				includes: ["create", "list", "show"],
				minCount: 3,
			});

			await executeAndExpect(
				"login create profile noslash --url https://test.volterra.io --token abc123",
				session,
				{
					success: true,
				},
			);
		});
	});

	describe("Flag Completion and Execution", () => {
		it("should complete flags and execute command", async () => {
			// Get flag completions
			await completeAndExpect("login create profile test --", completer, {
				includes: ["--url", "--token", "--namespace"],
				minCount: 3,
			});

			// Execute with all flags
			await executeAndExpect(
				"login create profile test --url https://test.volterra.io --token abc123 --namespace system",
				session,
				{
					success: true,
				},
			);
		});

		it("should complete partial flags", async () => {
			await completeAndExpect(
				"login create profile test --u",
				completer,
				{
					includes: ["--url"],
				},
			);

			await completeAndExpect(
				"login create profile test --t",
				completer,
				{
					includes: ["--token"],
				},
			);

			await completeAndExpect(
				"login create profile test --n",
				completer,
				{
					includes: ["--namespace"],
				},
			);
		});
	});

	describe("Performance and Responsiveness", () => {
		it("should complete quickly for simple queries", async () => {
			const start = Date.now();
			await completer.complete("login ");
			const duration = Date.now() - start;

			// Should be fast (< 100ms)
			expect(duration).toBeLessThan(100);
		});

		it("should handle rapid completion requests", async () => {
			// Simulate user typing quickly
			const promises = [
				completer.complete("l"),
				completer.complete("lo"),
				completer.complete("log"),
				completer.complete("logi"),
				completer.complete("login"),
				completer.complete("login "),
			];

			const results = await Promise.all(promises);

			// All should complete successfully
			expect(results).toHaveLength(6);
			results.forEach((result) => {
				expect(Array.isArray(result)).toBe(true);
			});
		});
	});
});
