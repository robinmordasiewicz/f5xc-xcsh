/**
 * Acceptance Tests: Get Action Argument Parsing
 *
 * Matrix-based acceptance tests for the `get` action argument parsing.
 * These tests verify the FULL execution path from root context through
 * domain navigation, argument parsing, API calls, and output formatting.
 *
 * Critical Bug Scenario:
 * Command: `virtual get http_loadbalancer --namespace r-mordasiewicz canadian-http-lb`
 * Expected: API called with name="canadian-http-lb", output shows resource data
 * Bug: Output showed `<None>` values because positional name after flags was ignored
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { REPLSession } from "../../src/repl/session.js";
import type { APIClient as APIClientType } from "../../src/api/client.js";
import type { ContextPath } from "../../src/repl/context.js";
import { executeCommand } from "../../src/repl/executor.js";

/**
 * Test case interface for matrix-based testing
 */
interface GetActionTestCase {
	description: string;
	command: string;
	initialContext: {
		domain: string | null;
		action: string | null;
	};
	expectedAPICall: {
		pathPattern: RegExp;
		method: "GET" | "POST" | "PUT" | "DELETE";
		namespace: string;
		resourceName: string;
	};
	mockResponse: {
		data: object;
		status: number;
	};
	expectedOutput: {
		shouldContain: string[];
		shouldNotContain: string[];
		format?: "json" | "yaml" | "table";
	};
}

// Store captured API calls for verification
let capturedAPICalls: { path: string; method: string }[] = [];
let mockClientResponse: { data: unknown; ok: boolean; statusCode: number } | null = null;
let mockClientError: Error | null = null;

function mockAPIResponse(data: unknown, status = 200) {
	mockClientResponse = { data, ok: status >= 200 && status < 300, statusCode: status };
	mockClientError = null;
}

function mockAPIErrorResponse(status: number, message: string) {
	mockClientResponse = null;
	mockClientError = new Error(message);
	(mockClientError as Error & { statusCode: number }).statusCode = status;
}

function createMockAPIClient(): APIClientType {
	return {
		isAuthenticated: () => true,
		isValidated: () => true,
		get: vi.fn().mockImplementation(async (path: string) => {
			capturedAPICalls.push({ path, method: "GET" });
			if (mockClientError) throw mockClientError;
			return mockClientResponse;
		}),
		post: vi.fn().mockImplementation(async (path: string) => {
			capturedAPICalls.push({ path, method: "POST" });
			if (mockClientError) throw mockClientError;
			return mockClientResponse;
		}),
		put: vi.fn().mockImplementation(async (path: string) => {
			capturedAPICalls.push({ path, method: "PUT" });
			if (mockClientError) throw mockClientError;
			return mockClientResponse;
		}),
		delete: vi.fn().mockImplementation(async (path: string) => {
			capturedAPICalls.push({ path, method: "DELETE" });
			if (mockClientError) throw mockClientError;
			return mockClientResponse;
		}),
	} as unknown as APIClientType;
}

function createMockContext(initialDomain?: string, initialAction?: string): ContextPath {
	let domain: string | null = initialDomain ?? null;
	let action: string | null = initialAction ?? null;

	return {
		get domain() { return domain; },
		get action() { return action; },
		resource: null,
		isRoot: () => !domain,
		isAction: () => !!action,
		isDomain: () => !!domain && !action,
		setDomain: (d: string) => { domain = d; },
		setAction: (a: string) => { action = a; },
		reset: () => { domain = null; action = null; },
		toString: () => domain ? (action ? `/${domain}/${action}` : `/${domain}`) : "/",
	} as unknown as ContextPath;
}

function createMockHistory() {
	return {
		add: vi.fn(),
		get: vi.fn().mockReturnValue([]),
		getAll: vi.fn().mockReturnValue([]),
		clear: vi.fn(),
		length: 0,
	};
}

function createMockSession(
	outputFormat = "table",
	namespace = "default",
	initialDomain?: string,
	initialAction?: string,
): REPLSession {
	const mockClient = createMockAPIClient();
	const mockHistory = createMockHistory();
	const mockContext = createMockContext(initialDomain, initialAction);

	return {
		getOutputFormat: () => outputFormat,
		getNamespace: () => namespace,
		getAPIClient: () => mockClient,
		getContextPath: () => mockContext,
		setOutputFormat: vi.fn(),
		addToHistory: vi.fn(),
		getHistory: () => mockHistory,
	} as unknown as REPLSession;
}

/**
 * Mock resource data for http_loadbalancer
 */
const mockHTTPLoadBalancer = {
	metadata: {
		name: "canadian-http-lb",
		namespace: "r-mordasiewicz",
		uid: "uid-canadian-lb",
		creation_timestamp: "2024-01-15T10:00:00Z",
		labels: { env: "production", region: "canada" },
	},
	spec: {
		domains: ["canada.example.com"],
		http: { dns_volterra_managed: true },
		default_route_pools: [
			{ pool: { name: "origin-pool-canada", namespace: "r-mordasiewicz" }, weight: 1 },
		],
		advertise_on_public_default_vip: true,
	},
	system_metadata: {
		tenant: "r-mordasiewicz-tenant",
		creator_id: "user-robin",
	},
};

describe("Acceptance: Get Action Argument Parsing", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		capturedAPICalls = [];
		mockClientResponse = null;
		mockClientError = null;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	/**
	 * CRITICAL BUG FIX TEST MATRIX
	 *
	 * Tests the specific scenario where positional resource name appears AFTER flags.
	 * This was broken: name was ignored, resulting in <None> output.
	 */
	describe("positional name after flags (bug fix)", () => {
		const bugFixTestMatrix: GetActionTestCase[] = [
			{
				description: "name after --namespace flag: virtual get http_loadbalancer --namespace ns name",
				command: "http_loadbalancer --namespace r-mordasiewicz canadian-http-lb",
				initialContext: { domain: "virtual", action: "get" },
				expectedAPICall: {
					pathPattern: /\/http_loadbalancers\/canadian-http-lb/,
					method: "GET",
					namespace: "r-mordasiewicz",
					resourceName: "canadian-http-lb",
				},
				mockResponse: { data: mockHTTPLoadBalancer, status: 200 },
				expectedOutput: {
					shouldContain: ["canadian-http-lb", "r-mordasiewicz"],
					shouldNotContain: ["<None>", "undefined"],
				},
			},
			{
				description: "name after -ns flag: virtual get http_loadbalancer -ns ns name",
				command: "http_loadbalancer -ns r-mordasiewicz canadian-http-lb",
				initialContext: { domain: "virtual", action: "get" },
				expectedAPICall: {
					pathPattern: /\/http_loadbalancers\/canadian-http-lb/,
					method: "GET",
					namespace: "r-mordasiewicz",
					resourceName: "canadian-http-lb",
				},
				mockResponse: { data: mockHTTPLoadBalancer, status: 200 },
				expectedOutput: {
					shouldContain: ["canadian-http-lb"],
					shouldNotContain: ["<None>"],
				},
			},
			{
				description: "name after multiple flags: --namespace ns --output json name",
				command: "http_loadbalancer --namespace r-mordasiewicz --output json canadian-http-lb",
				initialContext: { domain: "virtual", action: "get" },
				expectedAPICall: {
					pathPattern: /\/http_loadbalancers\/canadian-http-lb/,
					method: "GET",
					namespace: "r-mordasiewicz",
					resourceName: "canadian-http-lb",
				},
				mockResponse: { data: mockHTTPLoadBalancer, status: 200 },
				expectedOutput: {
					shouldContain: ["canadian-http-lb"],
					shouldNotContain: ["<None>"],
					format: "json",
				},
			},
			{
				description: "name after --no-color flag",
				command: "http_loadbalancer --namespace r-mordasiewicz --no-color canadian-http-lb",
				initialContext: { domain: "virtual", action: "get" },
				expectedAPICall: {
					pathPattern: /\/http_loadbalancers\/canadian-http-lb/,
					method: "GET",
					namespace: "r-mordasiewicz",
					resourceName: "canadian-http-lb",
				},
				mockResponse: { data: mockHTTPLoadBalancer, status: 200 },
				expectedOutput: {
					shouldContain: ["canadian-http-lb"],
					shouldNotContain: ["<None>"],
				},
			},
		];

		for (const testCase of bugFixTestMatrix) {
			it(testCase.description, async () => {
				// Setup
				mockAPIResponse(testCase.mockResponse.data, testCase.mockResponse.status);
				const session = createMockSession(
					testCase.expectedOutput.format ?? "table",
					"default",
					testCase.initialContext.domain ?? undefined,
					testCase.initialContext.action ?? undefined,
				);

				// Execute
				const result = await executeCommand(testCase.command, session);

				// Verify API was called with correct path
				expect(capturedAPICalls.length).toBeGreaterThan(0);
				const apiCall = capturedAPICalls.find(
					(c) => c.method === testCase.expectedAPICall.method,
				);
				expect(apiCall).toBeDefined();
				expect(apiCall?.path).toMatch(testCase.expectedAPICall.pathPattern);
				expect(apiCall?.path).toContain(testCase.expectedAPICall.namespace);
				expect(apiCall?.path).toContain(testCase.expectedAPICall.resourceName);

				// Verify output
				expect(result.error).toBeUndefined();
				const output = result.output.join("\n");

				for (const expected of testCase.expectedOutput.shouldContain) {
					expect(output).toContain(expected);
				}
				for (const notExpected of testCase.expectedOutput.shouldNotContain) {
					expect(output).not.toContain(notExpected);
				}
			});
		}
	});

	/**
	 * COMPARISON: Positional name BEFORE flags (already working)
	 *
	 * These tests ensure we haven't broken the existing working syntax.
	 */
	describe("positional name before flags (regression)", () => {
		const regressionMatrix: GetActionTestCase[] = [
			{
				description: "name before --namespace flag: resourceType name --namespace ns",
				command: "http_loadbalancer canadian-http-lb --namespace r-mordasiewicz",
				initialContext: { domain: "virtual", action: "get" },
				expectedAPICall: {
					pathPattern: /\/http_loadbalancers\/canadian-http-lb/,
					method: "GET",
					namespace: "r-mordasiewicz",
					resourceName: "canadian-http-lb",
				},
				mockResponse: { data: mockHTTPLoadBalancer, status: 200 },
				expectedOutput: {
					shouldContain: ["canadian-http-lb"],
					shouldNotContain: ["<None>"],
				},
			},
			{
				description: "name between flags: --output json name --namespace ns",
				command: "http_loadbalancer --output json canadian-http-lb --namespace r-mordasiewicz",
				initialContext: { domain: "virtual", action: "get" },
				expectedAPICall: {
					pathPattern: /\/http_loadbalancers\/canadian-http-lb/,
					method: "GET",
					namespace: "r-mordasiewicz",
					resourceName: "canadian-http-lb",
				},
				mockResponse: { data: mockHTTPLoadBalancer, status: 200 },
				expectedOutput: {
					shouldContain: ["canadian-http-lb"],
					shouldNotContain: ["<None>"],
					format: "json",
				},
			},
		];

		for (const testCase of regressionMatrix) {
			it(testCase.description, async () => {
				mockAPIResponse(testCase.mockResponse.data, testCase.mockResponse.status);
				const session = createMockSession(
					testCase.expectedOutput.format ?? "table",
					"default",
					testCase.initialContext.domain ?? undefined,
					testCase.initialContext.action ?? undefined,
				);

				const result = await executeCommand(testCase.command, session);

				expect(capturedAPICalls.length).toBeGreaterThan(0);
				const apiCall = capturedAPICalls.find((c) => c.method === "GET");
				expect(apiCall?.path).toMatch(testCase.expectedAPICall.pathPattern);

				expect(result.error).toBeUndefined();
				const output = result.output.join("\n");

				for (const expected of testCase.expectedOutput.shouldContain) {
					expect(output).toContain(expected);
				}
				for (const notExpected of testCase.expectedOutput.shouldNotContain) {
					expect(output).not.toContain(notExpected);
				}
			});
		}
	});

	/**
	 * EXPLICIT --name FLAG (always worked)
	 *
	 * Tests the explicit --name flag syntax for comparison.
	 */
	describe("explicit --name flag", () => {
		it("--name flag with --namespace: --namespace ns --name resource-name", async () => {
			mockAPIResponse(mockHTTPLoadBalancer, 200);
			const session = createMockSession("table", "default", "virtual", "get");

			const result = await executeCommand(
				"http_loadbalancer --namespace r-mordasiewicz --name canadian-http-lb",
				session,
			);

			expect(capturedAPICalls.length).toBeGreaterThan(0);
			const apiCall = capturedAPICalls.find((c) => c.method === "GET");
			expect(apiCall?.path).toContain("canadian-http-lb");
			expect(apiCall?.path).toContain("r-mordasiewicz");

			expect(result.error).toBeUndefined();
			const output = result.output.join("\n");
			expect(output).toContain("canadian-http-lb");
			expect(output).not.toContain("<None>");
		});
	});

	/**
	 * OUTPUT FORMAT VERIFICATION
	 *
	 * Ensure different output formats work correctly with the fix.
	 */
	describe("output format verification", () => {
		const outputFormats = ["json", "yaml", "table"] as const;

		for (const format of outputFormats) {
			it(`returns correct ${format} output with positional name after flags`, async () => {
				mockAPIResponse(mockHTTPLoadBalancer, 200);
				const session = createMockSession(format, "default", "virtual", "get");

				const result = await executeCommand(
					`http_loadbalancer --namespace r-mordasiewicz canadian-http-lb`,
					session,
				);

				expect(result.error).toBeUndefined();
				const output = result.output.join("\n");

				// Verify format-specific output
				if (format === "json") {
					expect(() => JSON.parse(output)).not.toThrow();
					const parsed = JSON.parse(output);
					expect(parsed.metadata?.name).toBe("canadian-http-lb");
				} else if (format === "yaml") {
					expect(output).toContain("metadata:");
					expect(output).toContain("name:");
				} else if (format === "table") {
					expect(output).not.toContain("<None>");
				}
			});
		}
	});

	/**
	 * ERROR HANDLING VERIFICATION
	 *
	 * Ensure error messages include the correct resource name.
	 */
	describe("error handling with correct resource name", () => {
		it("404 error includes resource name from positional arg after flags", async () => {
			mockAPIErrorResponse(404, "Resource not found");
			const session = createMockSession("table", "default", "virtual", "get");

			const result = await executeCommand(
				"http_loadbalancer --namespace r-mordasiewicz missing-lb",
				session,
			);

			// Verify API was called with the correct name
			const apiCall = capturedAPICalls.find((c) => c.method === "GET");
			expect(apiCall?.path).toContain("missing-lb");

			expect(result.error).toBeDefined();
		});
	});

	/**
	 * NAMESPACE FLAG VARIATIONS
	 *
	 * Test all namespace flag variations with positional name after.
	 */
	describe("namespace flag variations with positional name after", () => {
		const namespaceVariations = [
			{ flag: "--namespace", value: "test-ns" },
			{ flag: "--ns", value: "test-ns" },
			{ flag: "-n", value: "test-ns" },
			{ flag: "-ns", value: "test-ns" },
		];

		for (const { flag, value } of namespaceVariations) {
			it(`${flag} with positional name after`, async () => {
				mockAPIResponse(mockHTTPLoadBalancer, 200);
				const session = createMockSession("table", "default", "virtual", "get");

				const result = await executeCommand(
					`http_loadbalancer ${flag} ${value} test-resource`,
					session,
				);

				const apiCall = capturedAPICalls.find((c) => c.method === "GET");
				expect(apiCall?.path).toContain("test-resource");
				expect(apiCall?.path).toContain(value);

				expect(result.error).toBeUndefined();
			});
		}
	});

	/**
	 * RESOURCE TYPE VARIATIONS
	 *
	 * Test different resource types in the virtual domain with positional name after flags.
	 */
	describe("resource type variations with positional name after flags", () => {
		const resourceTypes = [
			{ type: "http_loadbalancer", plural: "http_loadbalancers" },
			{ type: "origin_pool", plural: "origin_pools" },
			{ type: "healthcheck", plural: "healthchecks" },
		];

		for (const { type, plural } of resourceTypes) {
			it(`${type} with positional name after --namespace`, async () => {
				mockAPIResponse(
					{ metadata: { name: "test-resource", namespace: "test-ns" }, spec: {} },
					200,
				);
				const session = createMockSession("table", "default", "virtual", "get");

				const result = await executeCommand(
					`${type} --namespace test-ns test-resource`,
					session,
				);

				const apiCall = capturedAPICalls.find((c) => c.method === "GET");
				expect(apiCall?.path).toContain(plural);
				expect(apiCall?.path).toContain("test-resource");

				expect(result.error).toBeUndefined();
			});
		}
	});

	/**
	 * SPECIAL CHARACTER HANDLING
	 *
	 * Test resource names with special characters.
	 */
	describe("special characters in resource name after flags", () => {
		const specialNames = [
			"my-lb-v1.2.3",
			"production_lb_01",
			"lb-with-many-dashes",
			"LB_UPPERCASE",
		];

		for (const name of specialNames) {
			it(`handles resource name: ${name}`, async () => {
				mockAPIResponse(
					{ metadata: { name, namespace: "test-ns" }, spec: {} },
					200,
				);
				const session = createMockSession("table", "default", "virtual", "get");

				const result = await executeCommand(
					`http_loadbalancer --namespace test-ns ${name}`,
					session,
				);

				const apiCall = capturedAPICalls.find((c) => c.method === "GET");
				expect(apiCall?.path).toContain(name);

				expect(result.error).toBeUndefined();
			});
		}
	});

	/**
	 * DETAILS VIEW VS LIST VIEW
	 *
	 * Verify that single resource responses (get) show key-value details
	 * while list responses show summary table format.
	 */
	describe("details view vs list view formatting", () => {
		const mockListResponse = {
			items: [
				{
					name: "canadian-http-lb",
					namespace: "r-mordasiewicz",
					labels: { env: "production" },
				},
				{
					name: "us-http-lb",
					namespace: "r-mordasiewicz",
					labels: { env: "staging" },
				},
			],
		};

		it("get action (single resource) shows details view with key-value pairs", async () => {
			mockAPIResponse(mockHTTPLoadBalancer, 200);
			const session = createMockSession("table", "default", "virtual", "get");

			const result = await executeCommand(
				"http_loadbalancer --namespace r-mordasiewicz canadian-http-lb",
				session,
			);

			expect(result.error).toBeUndefined();
			const output = result.output.join("\n");

			// Details view should show resource name as title
			expect(output).toContain("canadian-http-lb");

			// Should show spec fields (not just NAMESPACE/NAME/LABELS columns)
			expect(output).toContain("domains");
			expect(output).toContain("canada.example.com");

			// Should not show summary table headers
			expect(output).not.toContain("NAMESPACE");
			expect(output).not.toContain("LABELS");
		});

		it("list action shows summary table with NAMESPACE/NAME/LABELS columns", async () => {
			mockAPIResponse(mockListResponse, 200);
			const session = createMockSession("table", "default", "virtual", "list");

			const result = await executeCommand(
				"http_loadbalancer --namespace r-mordasiewicz",
				session,
			);

			expect(result.error).toBeUndefined();
			const output = result.output.join("\n");

			// Summary table should show column headers
			expect(output).toContain("NAMESPACE");
			expect(output).toContain("NAME");
			expect(output).toContain("LABELS");

			// Should show both items
			expect(output).toContain("canadian-http-lb");
			expect(output).toContain("us-http-lb");
		});

		it("get action with json format returns raw json (not details view)", async () => {
			mockAPIResponse(mockHTTPLoadBalancer, 200);
			const session = createMockSession("json", "default", "virtual", "get");

			const result = await executeCommand(
				"http_loadbalancer --namespace r-mordasiewicz canadian-http-lb",
				session,
			);

			expect(result.error).toBeUndefined();
			const output = result.output.join("\n");

			// Should be valid JSON
			expect(() => JSON.parse(output)).not.toThrow();
			const parsed = JSON.parse(output);
			expect(parsed.metadata?.name).toBe("canadian-http-lb");
		});

		it("get action with yaml format returns yaml (not details view)", async () => {
			mockAPIResponse(mockHTTPLoadBalancer, 200);
			const session = createMockSession("yaml", "default", "virtual", "get");

			const result = await executeCommand(
				"http_loadbalancer --namespace r-mordasiewicz canadian-http-lb",
				session,
			);

			expect(result.error).toBeUndefined();
			const output = result.output.join("\n");

			// Should be YAML format
			expect(output).toContain("metadata:");
			expect(output).toContain("name: canadian-http-lb");
		});

		it("details view excludes internal fields like system_metadata", async () => {
			mockAPIResponse(mockHTTPLoadBalancer, 200);
			const session = createMockSession("table", "default", "virtual", "get");

			const result = await executeCommand(
				"http_loadbalancer --namespace r-mordasiewicz canadian-http-lb",
				session,
			);

			expect(result.error).toBeUndefined();
			const output = result.output.join("\n");

			// Should not show internal fields
			expect(output).not.toContain("system_metadata");
			expect(output).not.toContain("get_spec");
		});
	});
});

/**
 * CLI Subprocess Acceptance Tests
 *
 * These tests spawn the actual CLI as a subprocess to verify
 * end-to-end behavior including REPL input handling.
 */
describe("Acceptance: CLI Subprocess Tests", () => {
	// Skip if CLI is not built
	const cliBuilt = require("fs").existsSync(
		require("path").resolve(process.cwd(), "dist/cli.js"),
	);

	const describeIf = cliBuilt ? describe : describe.skip;

	describeIf("headless mode command parsing", () => {
		it.skip("placeholder for subprocess testing", () => {
			// These tests would spawn the actual CLI process
			// and verify behavior through the headless protocol
			// Skipped for now as they require environment setup
		});
	});
});
