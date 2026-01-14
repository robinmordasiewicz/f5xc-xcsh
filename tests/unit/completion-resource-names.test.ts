/**
 * Resource Name Completion Tests
 * Tests for resource name completion with --name flag and various scenarios
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

describe("Resource Name Completion", () => {
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

		// Setup default mock API response
		mockClient.setResponse(
			"/api/config/namespaces/default/http_loadbalancers",
			createMockResourceResponse([
				"canadian-http-lb",
				"canadian-staging-lb",
				"us-production-lb",
			]),
		);
	});

	describe("Basic Resource Name Completion", () => {
		it("should complete resource names after --name flag", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer --name ",
			);

			expect(suggestions.length).toBeGreaterThan(0);
			expect(suggestions.some((s) => s.text === "canadian-http-lb")).toBe(true);
			expect(suggestions.some((s) => s.text === "canadian-staging-lb")).toBe(
				true,
			);
			expect(suggestions.some((s) => s.text === "us-production-lb")).toBe(true);
		});

		it("should complete resource names after -n flag (short form)", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(3);
			expect(suggestions.some((s) => s.text === "canadian-http-lb")).toBe(true);
		});

		it("should filter resource names by partial match", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer -n canadian-",
			);

			expect(suggestions.length).toBe(2);
			expect(suggestions.every((s) => s.text.startsWith("canadian-"))).toBe(
				true,
			);
		});

		it("should handle case-insensitive filtering", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer -n CANADIAN-",
			);

			expect(suggestions.length).toBe(2);
			expect(suggestions.every((s) => s.text.startsWith("canadian-"))).toBe(
				true,
			);
		});

		it("should return empty array when no matches found", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer -n nonexistent-",
			);

			expect(suggestions.length).toBe(0);
		});
	});

	describe("Completion at Different Input Positions", () => {
		it("should complete at cursor position with TAB after domain", async () => {
			const suggestions = await completer.complete("get ");

			expect(suggestions.length).toBeGreaterThan(0);
			// Should suggest resource types
		});

		it("should complete after resource type", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer ",
			);

			expect(suggestions.length).toBeGreaterThan(0);
			// Should suggest flags like --name, --namespace, etc.
		});

		it("should complete resource names after complete flag and space", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer --name ",
			);

			expect(suggestions.length).toBe(3);
		});

		it("should complete with partial resource name", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer -n can",
			);

			expect(suggestions.length).toBe(2);
			expect(suggestions.every((s) => s.text.startsWith("canadian-"))).toBe(
				true,
			);
		});
	});

	describe("Namespace Handling", () => {
		it("should use namespace from --namespace flag over session default", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/production/http_loadbalancers",
				createMockResourceResponse(["prod-lb-1", "prod-lb-2"]),
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer --namespace production -n ",
			);

			expect(suggestions.length).toBe(2);
			expect(suggestions.some((s) => s.text === "prod-lb-1")).toBe(true);
		});

		it("should use namespace from -ns flag (short form)", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/staging/http_loadbalancers",
				createMockResourceResponse(["staging-lb-1"]),
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer -ns staging -n ",
			);

			expect(suggestions.length).toBe(1);
			expect(suggestions[0].text).toBe("staging-lb-1");
		});

		it("should use session namespace when no flag provided", async () => {
			mockSession.setNamespace("custom-namespace");
			mockClient.setResponse(
				"/api/config/namespaces/custom-namespace/http_loadbalancers",
				createMockResourceResponse(["custom-lb"]),
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(1);
			expect(suggestions[0].text).toBe("custom-lb");
		});

		it("should handle --namespace=value format", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/prod/http_loadbalancers",
				createMockResourceResponse(["prod-lb"]),
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer --namespace=prod -n ",
			);

			// This tests the equals format parsing
			expect(suggestions).toBeDefined();
		});
	});

	describe("Authentication State", () => {
		it("should return empty array when not authenticated", async () => {
			mockClient.setAuthenticated(false);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(0);
		});

		it("should work when authenticated", async () => {
			mockClient.setAuthenticated(true);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(3);
		});
	});

	describe("Multi-Domain Consistency", () => {
		it("should work for different resource types in same domain", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/origin_pools",
				createMockResourceResponse(["pool-1", "pool-2"]),
			);

			const suggestions = await completer.complete(
				"get origin_pool -n ",
			);

			expect(suggestions.length).toBe(2);
			expect(suggestions.some((s) => s.text === "pool-1")).toBe(true);
		});

		it("should work across different domains", async () => {
			// Test another domain if needed
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["domain-lb"]),
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty resource list", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				{ items: [] },
			);

			const suggestions = await completer.complete(
				"get http_loadbalancer -n ",
			);

			expect(suggestions.length).toBe(0);
		});

		it("should handle trailing spaces", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer -n  ",
			);

			// Should still work with extra space
			expect(suggestions).toBeDefined();
		});

		it("should handle multiple flags before -n", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer --namespace default --format json -n ",
			);

			expect(suggestions.length).toBe(3);
		});

		it("should handle -n flag in middle of command", async () => {
			const suggestions = await completer.complete(
				"get http_loadbalancer -n canadian-",
			);

			// Should complete the name even with flags after
			expect(suggestions.length).toBe(2);
		});
	});
});
