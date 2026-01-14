/**
 * Debug test to verify mock setup
 */

import { describe, it, expect } from "vitest";
import {
	createTestCompleter,
	MockAPIClient,
	MockREPLSession,
	createMockResourceResponse,
	clearResourceFetcherCache,
} from "../helpers/completion-mocks.js";
import { parseInput } from "../../src/repl/completion/completer.js";
import { getDomainInfo } from "../../src/types/domains.js";

describe("Debug Mock Setup", () => {
	it("should verify getDomainInfo returns virtual domain with origin_pool", () => {
		const domainInfo = getDomainInfo("virtual");
		console.log("\n=== getDomainInfo Test ===");
		console.log("Domain info exists:", !!domainInfo);
		console.log(
			"Primary resources:",
			domainInfo?.primaryResources?.map((r) => r.name),
		);

		expect(domainInfo).toBeDefined();
		expect(domainInfo?.primaryResources).toBeDefined();

		const resourceNames = domainInfo?.primaryResources?.map((r) => r.name) ?? [];
		console.log("Resource names:", resourceNames);
		console.log("Has origin_pool:", resourceNames.includes("origin_pool"));
		console.log("Has http_loadbalancer:", resourceNames.includes("http_loadbalancer"));

		expect(resourceNames).toContain("origin_pool");
		expect(resourceNames).toContain("http_loadbalancer");
	});

	it("should verify API client mock returns correct format", async () => {
		const mockClient = new MockAPIClient(true);
		mockClient.setResponse(
			"/api/config/namespaces/default/http-loadbalancers",
			createMockResourceResponse(["test-lb"]),
		);

		const response = await mockClient.get(
			"/api/config/namespaces/default/http-loadbalancers",
		);

		console.log("API Response:", JSON.stringify(response, null, 2));

		expect(response.ok).toBe(true);
		expect(response.data).toBeDefined();
		expect(response.data.items).toBeDefined();
		expect(response.data.items.length).toBe(1);
		expect(response.data.items[0].name).toBe("test-lb");
	});

	it("should verify session has getContextPath", () => {
		const mockSession = new MockREPLSession();
		const ctx = mockSession.getContextPath();

		console.log("Context Path:", {
			domain: ctx.domain,
			action: ctx.action,
			isRoot: ctx.isRoot(),
			isDomain: ctx.isDomain(),
		});

		expect(ctx).toBeDefined();
		expect(typeof ctx.setDomain).toBe("function");
	});

	it("should verify completer is created with session", () => {
		const mockSession = new MockREPLSession();
		const completer = createTestCompleter(mockSession);

		expect(completer).toBeDefined();
	});

	it("should verify parseInput detects flag value completion", () => {
		const input = "get http_loadbalancer -n ";
		const parsed = parseInput(input);

		console.log("\n=== ParseInput Test ===");
		console.log("Input:", input);
		console.log("Parsed result:", JSON.stringify(parsed, null, 2));
		console.log("isCompletingFlagValue:", parsed.isCompletingFlagValue);
		console.log("currentFlag:", parsed.currentFlag);
		console.log("args:", parsed.args);
		console.log("currentWord:", parsed.currentWord);

		expect(parsed.isCompletingFlagValue).toBe(true);
		expect(parsed.currentFlag).toBe("-n");
	});

	it("should test actual completion flow", async () => {
		const mockClient = new MockAPIClient(true);
		const mockSession = new MockREPLSession(mockClient);
		const completer = createTestCompleter(mockSession);

		// Set domain context
		const ctx = mockSession.getContextPath();
		ctx.setDomain("virtual");

		console.log("=== Test Setup ===");
		console.log("Domain:", ctx.domain);
		console.log("Authenticated:", mockClient.isAuthenticated());
		console.log("Namespace:", mockSession.getNamespace());

		// Setup mock response - try multiple potential endpoints
		const responses = [
			"/api/config/namespaces/default/http-loadbalancers",
			"/api/config/namespaces/default/http_loadbalancers",
			"/api/config/namespaces/default/http-loadbalancer",
		];

		responses.forEach((endpoint) => {
			mockClient.setResponse(
				endpoint,
				createMockResourceResponse(["test-lb-1", "test-lb-2"]),
			);
			console.log("Mock response set for:", endpoint);
		});

		// Test parseInput first
		console.log("\n=== Parse Input Test ===");
		const parsed = parseInput("get http_loadbalancer -n ");
		console.log("Parsed:", JSON.stringify(parsed, null, 2));

		// Try completion
		console.log("\n=== Attempting Completion ===");
		console.log('Input: "get http_loadbalancer -n "');
		console.log('(Note: domain "virtual" is set in navigation context)');

		const suggestions = await completer.complete(
			"get http_loadbalancer -n ",
		);

		console.log("\n=== Results ===");
		console.log("Suggestions:", JSON.stringify(suggestions, null, 2));
		console.log("Suggestion count:", suggestions.length);

		// Check if API was called at all by adding a test response
		const testResponse = await mockClient.get(
			"/api/config/namespaces/default/http-loadbalancers",
		);
		console.log(
			"\n=== Verify Mock Works ===",
		);
		console.log("Direct API call works:", testResponse.ok);
		console.log("Has data:", !!testResponse.data);

		// This might fail, but we want to see the output
		expect(suggestions.length).toBeGreaterThan(0);
	});

	it("should test origin_pool resource type", async () => {
		const mockClient = new MockAPIClient(true);
		const mockSession = new MockREPLSession(mockClient);
		const completer = createTestCompleter(mockSession);

		// Set domain context
		const ctx = mockSession.getContextPath();
		ctx.setDomain("virtual");

		// Setup mock for origin_pool
		mockClient.setResponse(
			"/api/config/namespaces/default/origin_pools",
			createMockResourceResponse(["pool-1", "pool-2"]),
		);

		console.log("\n=== Test origin_pool ===");
		console.log("Input: 'get origin_pool -n '");
		console.log("Domain:", ctx.domain);
		console.log("Namespace:", mockSession.getNamespace());

		const parsed = parseInput("get origin_pool -n ");
		console.log("Parsed:", JSON.stringify(parsed, null, 2));

		const suggestions = await completer.complete("get origin_pool -n ");

		console.log("Suggestions:", JSON.stringify(suggestions, null, 2));
		console.log("Suggestion count:", suggestions.length);

		// Check what API endpoints were called
		const callLog = mockClient.getCallLog();
		console.log("API calls made:", callLog);

		// Also try direct API call to verify mock works
		mockClient.clearCallLog();
		const testResponse = await mockClient.get(
			"/api/config/namespaces/default/origin_pools",
		);
		console.log("Direct API call returns:", testResponse.ok, testResponse.data);

		expect(suggestions.length).toBe(2);
	});

	it("should test completion with flags after -n", async () => {
		const mockClient = new MockAPIClient(true);
		const mockSession = new MockREPLSession(mockClient);
		const completer = createTestCompleter(mockSession);

		const ctx = mockSession.getContextPath();
		ctx.setDomain("virtual");

		mockClient.setResponse(
			"/api/config/namespaces/default/http-loadbalancers",
			createMockResourceResponse([
				"canadian-http-lb",
				"canadian-staging-lb",
				"us-production-lb",
			]),
		);

		console.log("\n=== Test with flags after -n ===");
		const input = "get http_loadbalancer -n canadian- --format json";
		const parsed = parseInput(input);
		console.log("Parsed:", JSON.stringify(parsed, null, 2));

		const suggestions = await completer.complete(input);

		console.log("Suggestions:", JSON.stringify(suggestions, null, 2));
		console.log("Count:", suggestions.length);
		console.log(
			"Expected: Only 2 matching 'canadian-', got:",
			suggestions.length,
		);
	});
});
