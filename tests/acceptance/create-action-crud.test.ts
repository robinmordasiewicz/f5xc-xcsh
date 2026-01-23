/**
 * Acceptance Tests: Create/Apply Action CRUD Operations
 *
 * Matrix-based acceptance tests for the `create`, `apply`, and `replace` actions.
 * Tests the FULL execution path including:
 * - Flag-based resource creation
 * - Validation error handling
 * - API error handling
 * - CRUD lifecycle (create → get → delete)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { REPLSession } from "../../src/repl/session.js";
import type { APIClient as APIClientType } from "../../src/api/client.js";
import type { ContextPath } from "../../src/repl/context.js";
import { executeCommand } from "../../src/repl/executor.js";
import { APIError } from "../../src/api/types.js";

/**
 * Test case interface for create action matrix testing
 */
interface CreateActionTestCase {
	description: string;
	command: string;
	initialContext: {
		domain: string | null;
		action: string | null;
	};
	expectedAPICall?: {
		pathPattern: RegExp;
		method: "GET" | "POST" | "PUT" | "DELETE";
		bodyContains?: string[];
		bodyNotContains?: string[];
	};
	mockResponse?: {
		data: object;
		status: number;
	};
	mockError?: {
		status: number;
		message: string;
	};
	expectedOutput: {
		shouldContain: string[];
		shouldNotContain?: string[];
		isError?: boolean;
	};
}

// Store captured API calls for verification
let capturedAPICalls: {
	path: string;
	method: string;
	body?: Record<string, unknown>;
}[] = [];
let mockClientResponse: {
	data: unknown;
	ok: boolean;
	statusCode: number;
} | null = null;
let mockClientError: Error | null = null;

function mockAPIResponse(data: unknown, status = 200) {
	mockClientResponse = {
		data,
		ok: status >= 200 && status < 300,
		statusCode: status,
	};
	mockClientError = null;
}

function mockAPIErrorResponse(status: number, message: string) {
	mockClientResponse = null;
	const error = new Error(message) as Error & { statusCode: number };
	error.statusCode = status;
	mockClientError = error;
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
		post: vi
			.fn()
			.mockImplementation(async (path: string, body?: Record<string, unknown>) => {
				capturedAPICalls.push({ path, method: "POST", body });
				if (mockClientError) throw mockClientError;
				return mockClientResponse;
			}),
		put: vi
			.fn()
			.mockImplementation(async (path: string, body?: Record<string, unknown>) => {
				capturedAPICalls.push({ path, method: "PUT", body });
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

function createMockContext(
	initialDomain?: string,
	initialAction?: string,
): ContextPath {
	let domain: string | null = initialDomain ?? null;
	let action: string | null = initialAction ?? null;

	return {
		get domain() {
			return domain;
		},
		get action() {
			return action;
		},
		resource: null,
		isRoot: () => !domain,
		isAction: () => !!action,
		isDomain: () => !!domain && !action,
		setDomain: (d: string) => {
			domain = d;
		},
		setAction: (a: string) => {
			action = a;
		},
		reset: () => {
			domain = null;
			action = null;
		},
		toString: () =>
			domain ? (action ? `/${domain}/${action}` : `/${domain}`) : "/",
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
	outputFormat = "json",
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

describe("Acceptance: Create Action with Flags", () => {
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
	 * HEALTHCHECK CREATE - SUCCESS SCENARIOS
	 */
	describe("healthcheck create - success scenarios", () => {
		const successMatrix: CreateActionTestCase[] = [
			{
				description: "create HTTP healthcheck with all required flags",
				command:
					"healthcheck --yes --name test-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /\/healthchecks$/,
					method: "POST",
					bodyContains: ['"name":"test-hc"', '"interval":10', '"timeout":5'],
				},
				mockResponse: {
					data: { metadata: { name: "test-hc" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-hc"],
					isError: false,
				},
			},
			{
				description: "create HTTP healthcheck with optional path flag",
				command:
					"healthcheck --yes --name test-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3 --path /health",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /\/healthchecks$/,
					method: "POST",
					bodyContains: ['"path":"/health"'],
				},
				mockResponse: {
					data: { metadata: { name: "test-hc" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-hc"],
					isError: false,
				},
			},
			{
				description: "create TCP healthcheck",
				command:
					"healthcheck --yes --name test-tcp-hc --type tcp --interval 15 --timeout 10 --healthy-threshold 3 --unhealthy-threshold 5",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /\/healthchecks$/,
					method: "POST",
					bodyContains: ['"name":"test-tcp-hc"', "tcp_health_check"],
				},
				mockResponse: {
					data: { metadata: { name: "test-tcp-hc" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-tcp-hc"],
					isError: false,
				},
			},
			{
				description: "create healthcheck with --flag=value syntax",
				command:
					"healthcheck --yes --name=test-hc --type=http --interval=10 --timeout=5 --healthy-threshold=2 --unhealthy-threshold=3",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /\/healthchecks$/,
					method: "POST",
					bodyContains: ['"name":"test-hc"'],
				},
				mockResponse: {
					data: { metadata: { name: "test-hc" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-hc"],
					isError: false,
				},
			},
			{
				description: "create healthcheck with custom namespace",
				command:
					"healthcheck --yes --namespace prod --name test-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /namespaces\/prod\/healthchecks$/,
					method: "POST",
				},
				mockResponse: {
					data: { metadata: { name: "test-hc", namespace: "prod" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-hc"],
					isError: false,
				},
			},
		];

		for (const testCase of successMatrix) {
			it(testCase.description, async () => {
				mockAPIResponse(
					testCase.mockResponse?.data ?? {},
					testCase.mockResponse?.status ?? 200,
				);
				const session = createMockSession(
					"json",
					"default",
					testCase.initialContext.domain ?? undefined,
					testCase.initialContext.action ?? undefined,
				);

				const result = await executeCommand(testCase.command, session);

				// Verify API was called
				if (testCase.expectedAPICall) {
					expect(capturedAPICalls.length).toBeGreaterThan(0);
					const apiCall = capturedAPICalls.find(
						(c) => c.method === testCase.expectedAPICall?.method,
					);
					expect(apiCall).toBeDefined();
					expect(apiCall?.path).toMatch(testCase.expectedAPICall.pathPattern);

					// Verify request body contains expected content
					if (testCase.expectedAPICall.bodyContains && apiCall?.body) {
						const bodyStr = JSON.stringify(apiCall.body);
						for (const expected of testCase.expectedAPICall.bodyContains) {
							expect(bodyStr).toContain(expected);
						}
					}
				}

				// Verify output
				if (!testCase.expectedOutput.isError) {
					expect(result.error).toBeUndefined();
				}
				const output = result.output.join("\n");
				for (const expected of testCase.expectedOutput.shouldContain) {
					expect(output).toContain(expected);
				}
			});
		}
	});

	/**
	 * HEALTHCHECK CREATE - FAILURE SCENARIOS
	 */
	describe("healthcheck create - failure scenarios", () => {
		const failureMatrix: CreateActionTestCase[] = [
			{
				description: "missing required --name flag",
				command:
					"healthcheck --yes --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["--name"],
					isError: true,
				},
			},
			{
				description: "invalid --type value",
				command:
					"healthcheck --yes --name test-hc --type invalid --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["Invalid value"],
					isError: true,
				},
			},
			{
				description: "invalid integer for --interval",
				command:
					"healthcheck --yes --name test-hc --type http --interval abc --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["Invalid integer"],
					isError: true,
				},
			},
			{
				description: "interval out of range (too high)",
				command:
					"healthcheck --yes --name test-hc --type http --interval 1000 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["interval", "600"],
					isError: true,
				},
			},
			{
				description: "path must start with /",
				command:
					"healthcheck --yes --name test-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3 --path health",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["--path must start with /"],
					isError: true,
				},
			},
			{
				description: "duplicate non-repeatable flag",
				command:
					"healthcheck --yes --name test-hc --name another-name --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["cannot be specified multiple times"],
					isError: true,
				},
			},
		];

		for (const testCase of failureMatrix) {
			it(testCase.description, async () => {
				const session = createMockSession(
					"json",
					"default",
					testCase.initialContext.domain ?? undefined,
					testCase.initialContext.action ?? undefined,
				);

				const result = await executeCommand(testCase.command, session);

				// For validation failures, API should NOT be called
				const postCalls = capturedAPICalls.filter((c) => c.method === "POST");
				expect(postCalls.length).toBe(0);

				// Verify error output
				const output = result.output.join("\n");
				for (const expected of testCase.expectedOutput.shouldContain) {
					expect(output.toLowerCase()).toContain(expected.toLowerCase());
				}
			});
		}
	});

	/**
	 * ORIGIN POOL CREATE - SUCCESS SCENARIOS
	 */
	describe("origin_pool create - success scenarios", () => {
		const successMatrix: CreateActionTestCase[] = [
			{
				description: "create origin pool with single public IP",
				command: "origin_pool --yes --yes --name test-pool --port 80 --public-ip 1.2.3.4",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /\/origin_pools$/,
					method: "POST",
					bodyContains: ['"name":"test-pool"', '"port":80', '"ip":"1.2.3.4"'],
				},
				mockResponse: {
					data: { metadata: { name: "test-pool" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-pool"],
					isError: false,
				},
			},
			{
				description: "create origin pool with multiple public IPs (repeatable flag)",
				command:
					"origin_pool --yes --name test-pool --port 80 --public-ip 1.2.3.4 --public-ip 5.6.7.8 --public-ip 9.10.11.12",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /\/origin_pools$/,
					method: "POST",
					bodyContains: ['"ip":"1.2.3.4"', '"ip":"5.6.7.8"', '"ip":"9.10.11.12"'],
				},
				mockResponse: {
					data: { metadata: { name: "test-pool" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-pool"],
					isError: false,
				},
			},
			{
				description: "create origin pool with algorithm",
				command:
					"origin_pool --yes --name test-pool --port 80 --public-ip 1.2.3.4 --algorithm ROUND_ROBIN",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /\/origin_pools$/,
					method: "POST",
					bodyContains: ['"loadbalancer_algorithm":"ROUND_ROBIN"'],
				},
				mockResponse: {
					data: { metadata: { name: "test-pool" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-pool"],
					isError: false,
				},
			},
			{
				description: "create origin pool with --no-tls flag",
				command:
					"origin_pool --yes --name test-pool --port 80 --public-ip 1.2.3.4 --no-tls",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /\/origin_pools$/,
					method: "POST",
					bodyContains: ['"no_tls"'],
				},
				mockResponse: {
					data: { metadata: { name: "test-pool" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-pool"],
					isError: false,
				},
			},
			{
				description: "create origin pool with public DNS name",
				command:
					"origin_pool --yes --name test-pool --port 443 --public-name api.example.com --use-tls",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /\/origin_pools$/,
					method: "POST",
					bodyContains: ['"dns_name":"api.example.com"', '"use_tls"'],
				},
				mockResponse: {
					data: { metadata: { name: "test-pool" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-pool"],
					isError: false,
				},
			},
			{
				description: "create origin pool with health check reference",
				command:
					"origin_pool --yes --name test-pool --port 80 --public-ip 1.2.3.4 --health-check my-healthcheck",
				initialContext: { domain: "virtual", action: "create" },
				expectedAPICall: {
					pathPattern: /\/origin_pools$/,
					method: "POST",
					bodyContains: ['"healthcheck"', '"name":"my-healthcheck"'],
				},
				mockResponse: {
					data: { metadata: { name: "test-pool" } },
					status: 200,
				},
				expectedOutput: {
					shouldContain: ["test-pool"],
					isError: false,
				},
			},
		];

		for (const testCase of successMatrix) {
			it(testCase.description, async () => {
				mockAPIResponse(
					testCase.mockResponse?.data ?? {},
					testCase.mockResponse?.status ?? 200,
				);
				const session = createMockSession(
					"json",
					"default",
					testCase.initialContext.domain ?? undefined,
					testCase.initialContext.action ?? undefined,
				);

				const result = await executeCommand(testCase.command, session);

				if (testCase.expectedAPICall) {
					expect(capturedAPICalls.length).toBeGreaterThan(0);
					const apiCall = capturedAPICalls.find(
						(c) => c.method === testCase.expectedAPICall?.method,
					);
					expect(apiCall).toBeDefined();
					expect(apiCall?.path).toMatch(testCase.expectedAPICall.pathPattern);

					if (testCase.expectedAPICall.bodyContains && apiCall?.body) {
						const bodyStr = JSON.stringify(apiCall.body);
						for (const expected of testCase.expectedAPICall.bodyContains) {
							expect(bodyStr).toContain(expected);
						}
					}
				}

				if (!testCase.expectedOutput.isError) {
					expect(result.error).toBeUndefined();
				}
				const output = result.output.join("\n");
				for (const expected of testCase.expectedOutput.shouldContain) {
					expect(output).toContain(expected);
				}
			});
		}
	});

	/**
	 * ORIGIN POOL CREATE - FAILURE SCENARIOS
	 */
	describe("origin_pool create - failure scenarios", () => {
		const failureMatrix: CreateActionTestCase[] = [
			{
				description: "missing required --name flag",
				command: "origin_pool --yes --yes --port 80 --public-ip 1.2.3.4",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["--name"],
					isError: true,
				},
			},
			{
				description: "missing origin server (no --public-ip or similar)",
				command: "origin_pool --yes --yes --name test-pool --port 80",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["origin server"],
					isError: true,
				},
			},
			{
				description: "invalid algorithm value",
				command:
					"origin_pool --yes --name test-pool --public-ip 1.2.3.4 --algorithm INVALID_ALGO",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["Invalid value"],
					isError: true,
				},
			},
			{
				description: "mutually exclusive TLS flags",
				command:
					"origin_pool --yes --name test-pool --public-ip 1.2.3.4 --no-tls --use-tls",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["mutually exclusive"],
					isError: true,
				},
			},
			{
				description: "private IP without --site flag",
				command: "origin_pool --yes --yes --name test-pool --private-ip 10.0.0.1",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["--site is required"],
					isError: true,
				},
			},
			{
				description: "port out of range",
				command: "origin_pool --yes --yes --name test-pool --public-ip 1.2.3.4 --port 99999",
				initialContext: { domain: "virtual", action: "create" },
				expectedOutput: {
					shouldContain: ["port", "65535"],
					isError: true,
				},
			},
		];

		for (const testCase of failureMatrix) {
			it(testCase.description, async () => {
				const session = createMockSession(
					"json",
					"default",
					testCase.initialContext.domain ?? undefined,
					testCase.initialContext.action ?? undefined,
				);

				const result = await executeCommand(testCase.command, session);

				const postCalls = capturedAPICalls.filter((c) => c.method === "POST");
				expect(postCalls.length).toBe(0);

				const output = result.output.join("\n");
				for (const expected of testCase.expectedOutput.shouldContain) {
					expect(output.toLowerCase()).toContain(expected.toLowerCase());
				}
			});
		}
	});

	/**
	 * API ERROR HANDLING
	 */
	describe("API error handling", () => {
		it("handles 401 Unauthorized error", async () => {
			mockAPIErrorResponse(401, "Unauthorized");
			const session = createMockSession("json", "default", "virtual", "create");

			const result = await executeCommand(
				"healthcheck --yes --name test-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				session,
			);

			expect(result.error).toBeDefined();
		});

		it("handles 403 Forbidden error", async () => {
			mockAPIErrorResponse(403, "Forbidden");
			const session = createMockSession("json", "default", "virtual", "create");

			const result = await executeCommand(
				"healthcheck --yes --name test-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				session,
			);

			expect(result.error).toBeDefined();
		});

		it("handles 409 Conflict (resource already exists)", async () => {
			mockAPIErrorResponse(409, "Resource already exists");
			const session = createMockSession("json", "default", "virtual", "create");

			const result = await executeCommand(
				"healthcheck --yes --name existing-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				session,
			);

			expect(result.error).toBeDefined();
		});

		it("handles 500 Internal Server Error", async () => {
			mockAPIErrorResponse(500, "Internal Server Error");
			const session = createMockSession("json", "default", "virtual", "create");

			const result = await executeCommand(
				"healthcheck --yes --name test-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
				session,
			);

			expect(result.error).toBeDefined();
		});
	});

	/**
	 * NO FLAGS PROVIDED - HELPFUL ERROR MESSAGE
	 */
	describe("no flags provided - helpful error", () => {
		it("shows helpful message when no flags provided for healthcheck", async () => {
			const session = createMockSession("json", "default", "virtual", "create");

			const result = await executeCommand("healthcheck", session);

			const output = result.output.join("\n");
			expect(output).toContain("requires a resource specification");
			expect(output).toContain("--name");
		});

		it("shows helpful message when no flags provided for origin_pool", async () => {
			const session = createMockSession("json", "default", "virtual", "create");

			const result = await executeCommand("origin_pool", session);

			const output = result.output.join("\n");
			expect(output).toContain("requires a resource specification");
		});
	});
});

describe("Acceptance: Apply Action (Create or Update)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		capturedAPICalls = [];
		mockClientResponse = null;
		mockClientError = null;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("apply creates new resource when it does not exist", async () => {
		mockAPIResponse({ metadata: { name: "apply-test-hc" } }, 200);
		const session = createMockSession("json", "default", "virtual", "apply");

		const result = await executeCommand(
			"healthcheck --yes --name apply-test-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
			session,
		);

		// Should call POST for new resource
		const postCall = capturedAPICalls.find((c) => c.method === "POST");
		expect(postCall).toBeDefined();
		expect(result.error).toBeUndefined();
	});

	it("apply updates existing resource on 409 conflict", async () => {
		// First POST returns 409 (conflict - resource exists)
		// Then PUT succeeds
		const mockClient = createMockAPIClient();
		(mockClient.post as ReturnType<typeof vi.fn>).mockImplementation(
			async (path: string, body?: Record<string, unknown>) => {
				capturedAPICalls.push({ path, method: "POST", body });
				// Use the actual APIError class so instanceof check works
				throw new APIError("Resource exists", 409);
			},
		);
		(mockClient.put as ReturnType<typeof vi.fn>).mockImplementation(
			async (path: string, body?: Record<string, unknown>) => {
				capturedAPICalls.push({ path, method: "PUT", body });
				return { data: { metadata: { name: "apply-test-hc" } }, ok: true };
			},
		);

		const session = {
			getOutputFormat: () => "json",
			getNamespace: () => "default",
			getAPIClient: () => mockClient,
			getContextPath: () => createMockContext("virtual", "apply"),
			setOutputFormat: vi.fn(),
			addToHistory: vi.fn(),
			getHistory: () => createMockHistory(),
		} as unknown as REPLSession;

		const result = await executeCommand(
			"healthcheck --yes --name apply-test-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
			session,
		);

		// Should have called POST first, then PUT
		expect(capturedAPICalls.find((c) => c.method === "POST")).toBeDefined();
		expect(capturedAPICalls.find((c) => c.method === "PUT")).toBeDefined();
		expect(result.error).toBeUndefined();
	});
});

describe("Acceptance: Replace Action", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		capturedAPICalls = [];
		mockClientResponse = null;
		mockClientError = null;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("replace uses PUT to update existing resource", async () => {
		mockAPIResponse({ metadata: { name: "replace-test-hc" } }, 200);
		const session = createMockSession("json", "default", "virtual", "replace");

		const result = await executeCommand(
			"healthcheck --yes --name replace-test-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
			session,
		);

		// Should call PUT (not POST)
		const putCall = capturedAPICalls.find((c) => c.method === "PUT");
		expect(putCall).toBeDefined();
		expect(putCall?.path).toContain("replace-test-hc");
		expect(result.error).toBeUndefined();
	});
});

describe("Acceptance: Full CRUD Lifecycle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		capturedAPICalls = [];
		mockClientResponse = null;
		mockClientError = null;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("complete healthcheck CRUD cycle: create → get → delete", async () => {
		const mockHC = {
			metadata: { name: "lifecycle-hc", namespace: "default" },
			spec: {
				http_health_check: { path: "/health" },
				interval: 10,
				timeout: 5,
			},
		};

		// CREATE
		mockAPIResponse(mockHC, 200);
		let session = createMockSession("json", "default", "virtual", "create");
		let result = await executeCommand(
			"healthcheck --yes --name lifecycle-hc --type http --interval 10 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3",
			session,
		);
		expect(result.error).toBeUndefined();
		expect(capturedAPICalls.find((c) => c.method === "POST")).toBeDefined();

		// Reset for GET
		capturedAPICalls = [];
		mockAPIResponse(mockHC, 200);
		session = createMockSession("json", "default", "virtual", "get");
		result = await executeCommand("healthcheck lifecycle-hc", session);
		expect(result.error).toBeUndefined();
		expect(capturedAPICalls.find((c) => c.method === "GET")).toBeDefined();
		expect(result.output.join("\n")).toContain("lifecycle-hc");

		// Reset for DELETE
		capturedAPICalls = [];
		mockAPIResponse({ message: "Deleted" }, 200);
		session = createMockSession("json", "default", "virtual", "delete");
		result = await executeCommand("healthcheck --yes lifecycle-hc", session);
		expect(result.error).toBeUndefined();
		expect(capturedAPICalls.find((c) => c.method === "DELETE")).toBeDefined();
	});

	it("complete origin_pool CRUD cycle: create → get → delete", async () => {
		const mockPool = {
			metadata: { name: "lifecycle-pool", namespace: "default" },
			spec: {
				origin_servers: [{ public_ip: { ip: "1.2.3.4" } }],
				port: 80,
			},
		};

		// CREATE
		mockAPIResponse(mockPool, 200);
		let session = createMockSession("json", "default", "virtual", "create");
		let result = await executeCommand(
			"origin_pool --yes --name lifecycle-pool --port 80 --public-ip 1.2.3.4",
			session,
		);
		expect(result.error).toBeUndefined();
		expect(capturedAPICalls.find((c) => c.method === "POST")).toBeDefined();

		// Reset for GET
		capturedAPICalls = [];
		mockAPIResponse(mockPool, 200);
		session = createMockSession("json", "default", "virtual", "get");
		result = await executeCommand("origin_pool lifecycle-pool", session);
		expect(result.error).toBeUndefined();
		expect(capturedAPICalls.find((c) => c.method === "GET")).toBeDefined();

		// Reset for DELETE
		capturedAPICalls = [];
		mockAPIResponse({ message: "Deleted" }, 200);
		session = createMockSession("json", "default", "virtual", "delete");
		result = await executeCommand("origin_pool --yes lifecycle-pool", session);
		expect(result.error).toBeUndefined();
		expect(capturedAPICalls.find((c) => c.method === "DELETE")).toBeDefined();
	});
});
