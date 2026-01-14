/**
 * Diagnostic Command Tests
 * Tests for the debug-completion command and diagnostic report generation
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
	MockAPIClient,
	MockREPLSession,
	createMockResourceResponse,
	clearResourceFetcherCache,
	createMockError,
} from "../helpers/completion-mocks.js";
import {
	generateDiagnosticReport,
	formatDiagnostic,
	formatDiagnosticJSON,
} from "../../src/repl/diagnostics/completion-diagnostics.js";
import type { CompletionDiagnostic } from "../../src/repl/completion/types.js";

describe("Diagnostic Command", () => {
	let mockClient: MockAPIClient;
	let mockSession: MockREPLSession;

	beforeEach(() => {
		// Clear resource fetcher cache for test isolation
		clearResourceFetcherCache();

		mockClient = new MockAPIClient(true);
		mockSession = new MockREPLSession(mockClient);

		// Set domain context to "virtual" for completion tests
		const ctx = mockSession.getContextPath();
		ctx.setDomain("virtual");
	});

	describe("Basic Diagnostic Report Generation", () => {
		it("should generate diagnostic report for valid input", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["test-lb"]),
			);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{ verbose: false },
			);

			expect(output.length).toBeGreaterThan(0);
			expect(output.join("\n")).toContain("🔍 Completion Diagnostic Report");
			expect(output.join("\n")).toContain("✓ Authentication");
			expect(output.join("\n")).toContain("test-lb");
		});

		it("should include input and cursor position", async () => {
			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain('Input: "get');
			expect(output.join("\n")).toContain("Cursor Position:");
		});

		it("should include parsed context information", async () => {
			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain("✓ Parsed Context:");
			expect(output.join("\n")).toContain("Args:");
			expect(output.join("\n")).toContain("Current Word:");
		});

		it("should include namespace resolution", async () => {
			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain("✓ Namespace Resolution:");
			expect(output.join("\n")).toContain("Using:");
		});

		it("should include performance metrics", async () => {
			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain("⏱ Performance:");
			expect(output.join("\n")).toContain("Parsing:");
			expect(output.join("\n")).toContain("Total:");
		});
	});

	describe("Authentication Failure Reporting", () => {
		it("should clearly show authentication failure", async () => {
			mockClient.setAuthenticated(false);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain("✗ Authentication");
			expect(output.join("\n")).toContain("Not authenticated");
			expect(output.join("\n")).toContain("💡 Suggestion");
		});

		it("should provide actionable suggestion for auth failure", async () => {
			mockClient.setAuthenticated(false);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain("login");
		});

		it("should show success when authenticated", async () => {
			mockClient.setAuthenticated(true);
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["test-lb"]),
			);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain("✓ Authentication");
			expect(output.join("\n")).toContain("Authenticated: Yes");
		});
	});

	describe("API Error Reporting", () => {
		it("should report API errors", async () => {
			mockClient.setError(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockError("Connection refused"),
			);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain("✗ API Request");
			expect(output.join("\n")).toContain("Connection refused");
		});

		it("should show cache status", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["test-lb"]),
			);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			// Cache status should be present (hit/miss)
			expect(output.join("\n")).toMatch(/Cache:/);
		});
	});

	describe("Suggestion Reporting", () => {
		it("should list suggestions when found", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["lb-1", "lb-2", "lb-3"]),
			);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain("✓ Suggestions (3)");
			expect(output.join("\n")).toContain("lb-1");
			expect(output.join("\n")).toContain("lb-2");
			expect(output.join("\n")).toContain("lb-3");
		});

		it("should show NONE when no suggestions found", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				{ items: [] },
			);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain("⏭ Suggestions: NONE");
		});

		it("should limit suggestions to 10 in non-verbose mode", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(
					Array.from({ length: 20 }, (_, i) => `lb-${i + 1}`),
				),
			);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{ verbose: false },
			);

			expect(output.join("\n")).toContain("... and 10 more");
			expect(output.join("\n")).toContain("use --verbose to see all");
		});

		it("should show all suggestions in verbose mode", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(
					Array.from({ length: 20 }, (_, i) => `lb-${i + 1}`),
				),
			);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{ verbose: true },
			);

			expect(output.join("\n")).toContain("lb-20");
			expect(output.join("\n")).not.toContain("... and");
		});
	});

	describe("JSON Output Format", () => {
		it("should output JSON format when --json flag is used", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["test-lb"]),
			);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{ json: true },
			);

			expect(output.length).toBe(1);
			const parsed = JSON.parse(output[0]);
			expect(parsed).toHaveProperty("input");
			expect(parsed).toHaveProperty("authentication");
			expect(parsed).toHaveProperty("suggestions");
		});

		it("should include all diagnostic data in JSON", async () => {
			mockClient.setResponse(
				"/api/config/namespaces/default/http_loadbalancers",
				createMockResourceResponse(["test-lb"]),
			);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{ json: true },
			);

			const parsed = JSON.parse(output[0]);
			expect(parsed).toHaveProperty("cursorPosition");
			expect(parsed).toHaveProperty("parsedContext");
			expect(parsed).toHaveProperty("namespace");
			expect(parsed).toHaveProperty("performance");
		});

		it("should include failures in JSON when present", async () => {
			mockClient.setAuthenticated(false);

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{ json: true },
			);

			const parsed = JSON.parse(output[0]);
			expect(parsed.failures).toBeDefined();
			expect(Array.isArray(parsed.failures)).toBe(true);
			expect(parsed.failures.length).toBeGreaterThan(0);
		});
	});

	describe("Format Diagnostic Function", () => {
		it("should format diagnostic object into human-readable text", () => {
			const diagnostic: CompletionDiagnostic = {
				input: "test input",
				cursorPosition: 10,
				parsedContext: {
					args: ["test"],
					currentWord: "input",
					isCompletingFlag: false,
					isCompletingFlagValue: false,
				},
				authentication: {
					clientConnected: true,
					isAuthenticated: true,
					tenant: "test-tenant",
				},
				namespace: {
					fromSession: "default",
					resolved: "default",
				},
				suggestions: [],
				performance: {
					parsingMs: 1,
					filteringMs: 0,
					totalMs: 2,
				},
			};

			const output = formatDiagnostic(diagnostic, false);

			expect(output.length).toBeGreaterThan(0);
			expect(output.join("\n")).toContain("🔍 Completion Diagnostic Report");
		});
	});

	describe("Format Diagnostic JSON Function", () => {
		it("should format diagnostic object as JSON string", () => {
			const diagnostic: CompletionDiagnostic = {
				input: "test",
				cursorPosition: 4,
				parsedContext: {
					args: [],
					currentWord: "",
					isCompletingFlag: false,
					isCompletingFlagValue: false,
				},
				authentication: {
					clientConnected: true,
					isAuthenticated: true,
				},
				namespace: {
					fromSession: "default",
					resolved: "default",
				},
				suggestions: [],
				performance: {
					parsingMs: 1,
					filteringMs: 0,
					totalMs: 1,
				},
			};

			const json = formatDiagnosticJSON(diagnostic);
			const parsed = JSON.parse(json);

			expect(parsed.input).toBe("test");
			expect(parsed.cursorPosition).toBe(4);
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty input", async () => {
			const output = await generateDiagnosticReport(mockSession as any, "", {});

			expect(output.length).toBeGreaterThan(0);
			expect(output.join("\n")).toContain('Input: ""');
		});

		it("should handle whitespace-only input", async () => {
			const output = await generateDiagnosticReport(
				mockSession as any,
				"   ",
				{},
			);

			expect(output.length).toBeGreaterThan(0);
		});

		it("should handle very long input", async () => {
			const longInput = "get http_loadbalancer " + "a".repeat(500);

			const output = await generateDiagnosticReport(
				mockSession as any,
				longInput,
				{},
			);

			expect(output.length).toBeGreaterThan(0);
		});
	});

	describe("Namespace Reporting", () => {
		it("should show namespace from flag when present", async () => {
			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer --namespace production -n ",
				{},
			);

			expect(output.join("\n")).toContain("From flag: production");
			expect(output.join("\n")).toContain("Using: production");
		});

		it("should show session namespace when no flag", async () => {
			mockSession.setNamespace("custom-ns");

			const output = await generateDiagnosticReport(
				mockSession as any,
				"get http_loadbalancer -n ",
				{},
			);

			expect(output.join("\n")).toContain("From session: custom-ns");
			expect(output.join("\n")).toContain("Using: custom-ns");
		});
	});
});
