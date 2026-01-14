/**
 * Completion Error Scenario Tests
 * Tests for authentication failures, API errors, and error handling
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
	createTestCompleter,
	MockAPIClient,
	MockREPLSession,
	createMockResourceResponse,
	clearResourceFetcherCache,
	createMockError,
} from "../helpers/completion-mocks.js";
import type { Completer } from "../../src/repl/completion/completer.js";

describe("Completion Error Scenarios", () => {
	let mockClient: MockAPIClient;
	let mockSession: MockREPLSession;
	let completer: Completer;

	beforeEach(() => {
		// Clear resource fetcher cache for test isolation
		clearResourceFetcherCache();

		mockClient = new MockAPIClient(true);
		mockSession = new MockREPLSession(mockClient);
		completer = createTestCompleter(mockSession);

		// Set domain context to "virtual" for completion tests
		const ctx = mockSession.getContextPath();
		ctx.setDomain("virtual");
	});

	describe("Authentication Failures", () => {
		it("should return empty array when not authenticated", async () => {
			mockClient.setAuthenticated(false);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(0);
		});

		it("should report authentication failure in diagnostic mode", async () => {
			mockClient.setAuthenticated(false);
			completer.enableDiagnostics();

			await completer.complete("get http_loadbalancer -n ");
			const diagnostic = completer.getLastDiagnostic();

			expect(diagnostic).toBeDefined();
			expect(diagnostic?.authentication.isAuthenticated).toBe(false);
			expect(diagnostic?.failures).toBeDefined();
			expect(
				diagnostic?.failures?.some(
					(f) =>
						f.stage === "authentication" &&
						f.message.includes("Not authenticated"),
				),
			).toBe(true);
		});

		it("should provide actionable suggestion for auth failure", async () => {
			mockClient.setAuthenticated(false);
			completer.enableDiagnostics();

			await completer.complete("get http_loadbalancer -n ");
			const diagnostic = completer.getLastDiagnostic();

			const authFailure = diagnostic?.failures?.find(
				(f) => f.stage === "authentication",
			);
			expect(authFailure?.suggestion).toBeDefined();
			expect(authFailure?.suggestion).toContain("login");
		});

		it("should handle authentication expiry mid-session", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["test-lb"]),
			);

			// First completion succeeds
			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(1);

			// Authentication expires
			mockClient.setAuthenticated(false);

			// Second completion fails gracefully
			suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(0);
		});
	});

	describe("API Error Handling", () => {
		it("should handle 404 Not Found errors gracefully", async () => {
			mockClient.setError(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockError("404 Not Found", "404"),
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(0);
			// Should not throw error
		});

		it("should handle 401 Unauthorized errors", async () => {
			mockClient.setError(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockError("401 Unauthorized", "401"),
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(0);
		});

		it("should handle 500 Internal Server Error", async () => {
			mockClient.setError(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockError("500 Internal Server Error", "500"),
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(0);
		});

		it("should handle network timeout errors", async () => {
			mockClient.setError(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockError("Network timeout", "ETIMEDOUT"),
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(0);
		});

		it("should track API errors in diagnostic mode", async () => {
			mockClient.setError(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockError("API Error: Connection refused"),
			);
			completer.enableDiagnostics();

			await completer.complete("get http_loadbalancer -n ");
			const diagnostic = completer.getLastDiagnostic();

			expect(diagnostic?.apiRequest?.error).toBeDefined();
			expect(diagnostic?.apiRequest?.error).toContain("Connection refused");
		});
	});

	describe("Session State Errors", () => {
		it("should handle null session gracefully", async () => {
			const isolatedCompleter = new (
				await import("../../src/repl/completion/completer.js")
			).Completer();
			// No session set

			const suggestions = await isolatedCompleter.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(0);
			// Should not throw error
		});

		it("should report null session in diagnostic mode", async () => {
			const isolatedCompleter = new (
				await import("../../src/repl/completion/completer.js")
			).Completer();
			isolatedCompleter.enableDiagnostics();

			await isolatedCompleter.complete("get http_loadbalancer -n ");
			const diagnostic = isolatedCompleter.getLastDiagnostic();

			expect(diagnostic?.failures).toBeDefined();
			expect(
				diagnostic?.failures?.some((f) => f.stage === "initialization"),
			).toBe(true);
		});

		it("should handle missing namespace gracefully", async () => {
			// Session with undefined namespace
			mockSession.setNamespace("");

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			// Should fallback to default or handle gracefully
			expect(suggestions).toBeDefined();
		});
	});

	describe("Malformed Input Handling", () => {
		it("should handle empty input string", async () => {
			const suggestions = await completer.complete("");

			expect(suggestions).toBeDefined();
			expect(Array.isArray(suggestions)).toBe(true);
		});

		it("should handle input with only whitespace", async () => {
			const suggestions = await completer.complete("   ");

			expect(suggestions).toBeDefined();
			expect(Array.isArray(suggestions)).toBe(true);
		});

		it("should handle invalid flag format", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer -n=",
			);

			expect(suggestions).toBeDefined();
		});

		it("should handle multiple consecutive spaces", async () => {
			const suggestions = await completer.complete(
				"virtual  get  http_loadbalancer  -n  ",
			);

			expect(suggestions).toBeDefined();
		});

		it("should handle special characters in input", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["test-lb-1", "test-lb-2"]),
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n test-",
			);

			expect(suggestions.length).toBe(2);
		});
	});

	describe("Resource Fetcher Error Tracking", () => {
		it("should track errors through resource fetcher", async () => {
			mockClient.setError(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockError("Fetch failed"),
			);
			completer.enableDiagnostics();

			await completer.complete("get http_loadbalancer -n ");
			const diagnostic = completer.getLastDiagnostic();

			expect(diagnostic?.apiRequest?.error).toContain("Fetch failed");
		});

		it("should track authentication errors through resource fetcher", async () => {
			mockClient.setAuthenticated(false);
			completer.enableDiagnostics();

			await completer.complete("get http_loadbalancer -n ");
			const diagnostic = completer.getLastDiagnostic();

			expect(diagnostic?.apiRequest?.error).toContain("Not authenticated");
		});
	});

	describe("Error Recovery", () => {
		it("should recover after API error is resolved", async () => {
			// First call fails
			mockClient.setError(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockError("Temporary error"),
			);

			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(0);

			// Clear error and set success response
			mockClient.clear();
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["recovered-lb"]),
			);

			// Second call succeeds
			suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(1);
			expect(suggestions[0].text).toBe("recovered-lb");
		});

		it("should recover after authentication is restored", async () => {
			// Not authenticated
			mockClient.setAuthenticated(false);

			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(0);

			// Restore authentication
			mockClient.setAuthenticated(true);
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["auth-restored-lb"]),
			);

			suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(1);
		});
	});

	describe("Diagnostic Mode Error Reporting", () => {
		it("should capture all error details in diagnostic mode", async () => {
			mockClient.setError(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockError("Comprehensive error test"),
			);
			completer.enableDiagnostics();

			await completer.complete("get http_loadbalancer -n ");
			const diagnostic = completer.getLastDiagnostic();

			expect(diagnostic).toBeDefined();
			expect(diagnostic?.input).toBe("get http_loadbalancer -n ");
			expect(diagnostic?.apiRequest?.error).toBe("Comprehensive error test");
			expect(diagnostic?.suggestions.length).toBe(0);
			expect(diagnostic?.performance).toBeDefined();
			expect(diagnostic?.performance.totalMs).toBeGreaterThan(0);
		});

		it("should not retain diagnostics when disabled", async () => {
			completer.enableDiagnostics();
			await completer.complete("get http_loadbalancer -n ");

			expect(completer.getLastDiagnostic()).toBeDefined();

			completer.disableDiagnostics();
			expect(completer.getLastDiagnostic()).toBeNull();
		});
	});
});
