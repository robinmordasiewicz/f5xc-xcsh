/**
 * Completion Integration Tests
 * End-to-end tests for complete completion workflows
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
	createTestCompleter,
	MockAPIClient,
	MockREPLSession,
	createMockResourceResponse,
	clearResourceFetcherCache,
} from "../helpers/completion-mocks.js";
import type { Completer } from "../../src/repl/completion/completer.js";

describe("Completion Integration", () => {
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

	describe("Full Command Lifecycle", () => {
		it("should complete full command lifecycle from domain to resource name", async () => {
			// Setup mock responses for different stages
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["test-lb-1", "test-lb-2"]),
			);

			// Step 1: Complete after domain (should show actions/resource types)
			let suggestions = await completer.complete("get ");
			expect(suggestions.length).toBeGreaterThan(0);
			// Should include resource types like http_loadbalancer

			// Step 2: Complete after resource type (should show flags)
			suggestions = await completer.complete("get http_loadbalancer ");
			expect(suggestions.length).toBeGreaterThan(0);
			// Should include --name, --namespace flags

			// Step 3: Complete after --name flag (should show resource names)
			suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(2);
			expect(suggestions.some((s) => s.text === "test-lb-1")).toBe(true);
			expect(suggestions.some((s) => s.text === "test-lb-2")).toBe(true);
		});

		it("should handle multi-step workflow with filtering", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse([
					"prod-lb-1",
					"prod-lb-2",
					"staging-lb-1",
					"dev-lb-1",
				]),
			);

			// Start with full list
			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(4);

			// Filter to prod resources
			suggestions = await completer.complete(
				"get http_loadbalancer -n prod-",
			);
			expect(suggestions.length).toBe(2);
			expect(suggestions.every((s) => s.text.startsWith("prod-"))).toBe(true);

			// Further filter to specific resource
			suggestions = await completer.complete(
				"get http_loadbalancer -n prod-lb-1",
			);
			expect(suggestions.length).toBe(1);
			expect(suggestions[0].text).toBe("prod-lb-1");
		});

		it("should handle workflow with namespace switching", async () => {
			// Default namespace resources
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["default-lb"]),
			);

			// Production namespace resources
			mockClient.setResponse(
				"/api/config/namespaces/production/http_loadbalancers",
				createMockResourceResponse(["prod-lb"]),
			);

			// Complete in default namespace
			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(1);
			expect(suggestions[0].text).toBe("default-lb");

			// Complete in production namespace
			suggestions = await completer.complete(
				"get http_loadbalancer --namespace production -n ",
			);
			expect(suggestions.length).toBe(1);
			expect(suggestions[0].text).toBe("prod-lb");
		});
	});

	describe("Cache Behavior Integration", () => {
		it("should cache results across multiple completions", async () => {
			let apiCallCount = 0;

			// Track API calls
			const originalGet = mockClient.get.bind(mockClient);
			mockClient.get = async (endpoint: string) => {
				apiCallCount++;
				return originalGet(endpoint);
			};

			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["cached-lb"]),
			);

			// First call - should hit API
			await completer.complete("get http_loadbalancer -n ");
			expect(apiCallCount).toBe(1);

			// Second call within cache TTL - should use cache
			await completer.complete("get http_loadbalancer -n ");
			expect(apiCallCount).toBe(1); // No additional call

			// Third call with different partial - should still use cache
			await completer.complete("get http_loadbalancer -n cached-");
			expect(apiCallCount).toBe(1); // No additional call
		});

		it("should respect cache per namespace", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["default-lb"]),
			);
			mockClient.setResponse(
				"/api/config/namespaces/prod/http_loadbalancers",
				createMockResourceResponse(["prod-lb"]),
			);

			// Complete in default namespace
			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions[0].text).toBe("default-lb");

			// Complete in prod namespace - should fetch new data
			suggestions = await completer.complete(
				"get http_loadbalancer --namespace prod -n ",
			);
			expect(suggestions[0].text).toBe("prod-lb");

			// Return to default namespace - should use cache
			suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions[0].text).toBe("default-lb");
		});
	});

	describe("Multi-Domain Consistency", () => {
		it("should work consistently across different resource types", async () => {
			// Setup responses for different resource types
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["http-lb"]),
			);
			mockClient.setResponse(
				"/api/config/namespaces/default/origin_pools",
				createMockResourceResponse(["origin-pool-1"]),
			);
			mockClient.setResponse(
				"/api/config/namespaces/default/healthchecks",
				createMockResourceResponse(["health-check-1"]),
			);

			// Test http_loadbalancer
			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(1);
			expect(suggestions[0].text).toBe("http-lb");

			// Test origin_pool
			suggestions = await completer.complete("get origin_pool -n ");
			expect(suggestions.length).toBe(1);
			expect(suggestions[0].text).toBe("origin-pool-1");

			// Test healthcheck
			suggestions = await completer.complete("get healthcheck -n ");
			expect(suggestions.length).toBe(1);
			expect(suggestions[0].text).toBe("health-check-1");
		});
	});

	describe("Session State Management", () => {
		it("should handle session namespace changes", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/ns1/http_loadbalancers",
				createMockResourceResponse(["ns1-lb"]),
			);
			mockClient.setResponse(
				"/api/config/namespaces/ns2/http_loadbalancers",
				createMockResourceResponse(["ns2-lb"]),
			);

			// Set session to ns1
			mockSession.setNamespace("ns1");
			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions[0].text).toBe("ns1-lb");

			// Change session to ns2
			mockSession.setNamespace("ns2");
			suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions[0].text).toBe("ns2-lb");
		});

		it("should handle authentication state changes", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["auth-lb"]),
			);

			// Authenticated - should work
			mockClient.setAuthenticated(true);
			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(1);

			// Lose authentication
			mockClient.setAuthenticated(false);
			suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(0);

			// Regain authentication
			mockClient.setAuthenticated(true);
			suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(1);
		});
	});

	describe("Diagnostic Integration", () => {
		it("should track diagnostics through full workflow", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["diag-lb"]),
			);

			completer.enableDiagnostics();

			await completer.complete("get http_loadbalancer -n ");
			const diagnostic = completer.getLastDiagnostic();

			expect(diagnostic).toBeDefined();
			expect(diagnostic?.input).toBe("get http_loadbalancer -n ");
			expect(diagnostic?.authentication.isAuthenticated).toBe(true);
			expect(diagnostic?.namespace.resolved).toBe("default");
			expect(diagnostic?.suggestions.length).toBe(1);
			expect(diagnostic?.performance.totalMs).toBeGreaterThan(0);
		});

		it("should track failures in diagnostic mode", async () => {
			mockClient.setAuthenticated(false);
			completer.enableDiagnostics();

			await completer.complete("get http_loadbalancer -n ");
			const diagnostic = completer.getLastDiagnostic();

			expect(diagnostic?.failures).toBeDefined();
			expect(diagnostic?.failures?.length).toBeGreaterThan(0);
			expect(
				diagnostic?.failures?.some((f) => f.stage === "authentication"),
			).toBe(true);
		});
	});

	describe("Complex Scenarios", () => {
		it("should handle multiple flags in various orders", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/prod/http_loadbalancers",
				createMockResourceResponse(["multi-flag-lb"]),
			);

			// Flags in different orders should all work
			let suggestions = await completer.complete(
				"get http_loadbalancer --namespace prod -n ",
			);
			expect(suggestions[0].text).toBe("multi-flag-lb");

			suggestions = await completer.complete(
				"get http_loadbalancer -n multi- --namespace prod",
			);
			expect(suggestions[0].text).toBe("multi-flag-lb");
		});

		it("should handle rapid successive completions", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["rapid-lb-1", "rapid-lb-2", "rapid-lb-3"]),
			);

			// Rapid completions with different partials
			const results = await Promise.all([
				completer.complete("get http_loadbalancer -n "),
				completer.complete("get http_loadbalancer -n rapid-"),
				completer.complete("get http_loadbalancer -n rapid-lb-1"),
			]);

			expect(results[0].length).toBe(3);
			expect(results[1].length).toBe(3);
			expect(results[2].length).toBe(1);
		});

		it("should handle completion after error recovery", async () => {
			// Start with error
			mockClient.setAuthenticated(false);
			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(0);

			// Recover and setup data
			mockClient.setAuthenticated(true);
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["recovered-lb"]),
			);

			// Should work after recovery
			suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(1);
			expect(suggestions[0].text).toBe("recovered-lb");
		});
	});

	describe("Real-World User Scenarios", () => {
		it("should handle the original user scenario: canadian-http-lb", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse([
					"canadian-http-lb",
					"canadian-staging-lb",
					"us-http-lb",
				]),
			);

			// Complete with partial 'canadian-'
			const suggestions = await completer.complete(
				"get http_loadbalancer -n canadian-",
			);

			expect(suggestions.length).toBe(2);
			expect(suggestions.some((s) => s.text === "canadian-http-lb")).toBe(true);
			expect(
				suggestions.some((s) => s.text === "canadian-staging-lb"),
			).toBe(true);
		});

		it("should handle completion stops working mid-session scenario", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["session-lb"]),
			);

			// First completion works
			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(1);

			// Simulate session issue (auth expires)
			mockClient.setAuthenticated(false);

			// Completion stops working
			suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(0);

			// Diagnostic shows why
			completer.enableDiagnostics();
			await completer.complete("get http_loadbalancer -n ");
			const diagnostic = completer.getLastDiagnostic();
			expect(diagnostic?.authentication.isAuthenticated).toBe(false);
		});

		it("should handle completion inconsistent across domains scenario", async () => {
			// Setup different response qualities for different domains
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["http-lb"]),
			);

			// This domain works
			let suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);
			expect(suggestions.length).toBe(1);

			// Another domain might have auth issues
			mockClient.setAuthenticated(false);
			suggestions = await completer.complete("get origin_pool -n ");
			expect(suggestions.length).toBe(0);

			// Diagnostic reveals the inconsistency cause
			completer.enableDiagnostics();
			await completer.complete("get origin_pool -n ");
			const diagnostic = completer.getLastDiagnostic();
			expect(diagnostic?.failures?.some((f) => f.stage === "authentication")).toBe(
				true,
			);
		});
	});
});
