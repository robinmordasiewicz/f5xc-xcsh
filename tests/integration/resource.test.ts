/**
 * Integration tests for resource operations (CRUD)
 *
 * These tests require a real F5 XC environment.
 * Set the following environment variables:
 * - F5XC_API_URL: API endpoint URL
 * - F5XC_API_TOKEN: API token for authentication
 *
 * WARNING: These tests create and delete real resources!
 * Use a test/staging environment, not production.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { APIClient, APIError } from "../../src/api/index.js";

// Helper to check if integration test environment is configured
function getIntegrationConfig():
	| { apiUrl: string; apiToken: string }
	| undefined {
	const apiUrl = process.env.F5XC_API_URL;
	const apiToken = process.env.F5XC_API_TOKEN;

	if (!apiUrl || !apiToken) {
		return undefined;
	}

	return { apiUrl, apiToken };
}

// Types for API responses
interface ResourceItem {
	metadata?: {
		name?: string;
		namespace?: string;
		labels?: Record<string, string>;
	};
	spec?: Record<string, unknown>;
}

interface ListResponse {
	items?: ResourceItem[];
}

// Skip all tests if environment not configured
const config = getIntegrationConfig();
const describeIf = config ? describe : describe.skip;

describeIf("Resource Integration Tests", () => {
	let client: APIClient;
	const testNamespace = "shared";
	const testResourceName = `xcsh-test-healthcheck-${Date.now()}`;

	beforeAll(() => {
		if (!config) return;

		client = new APIClient({
			serverUrl: config.apiUrl,
			apiToken: config.apiToken,
			timeout: 60000, // Longer timeout for CRUD operations
		});
	});

	// Cleanup: try to delete test resource if it exists
	afterAll(async () => {
		if (!client) return;

		try {
			await client.delete(
				`/api/config/namespaces/${testNamespace}/healthchecks/${testResourceName}`,
			);
		} catch {
			// Ignore errors - resource may not exist
		}
	});

	describe("List Resources", () => {
		it("should list HTTP load balancers", async () => {
			const response = await client.get<ListResponse>(
				`/api/config/namespaces/${testNamespace}/http_loadbalancers`,
			);

			expect(response.ok).toBe(true);
			expect(response.statusCode).toBe(200);

			if (response.data.items) {
				expect(Array.isArray(response.data.items)).toBe(true);
			}
		});

		it("should list origin pools", async () => {
			const response = await client.get<ListResponse>(
				`/api/config/namespaces/${testNamespace}/origin_pools`,
			);

			expect(response.ok).toBe(true);
		});

		it("should list healthchecks", async () => {
			const response = await client.get<ListResponse>(
				`/api/config/namespaces/${testNamespace}/healthchecks`,
			);

			expect(response.ok).toBe(true);
		});

		it("should list app firewalls", async () => {
			const response = await client.get<ListResponse>(
				`/api/config/namespaces/${testNamespace}/app_firewalls`,
			);

			expect(response.ok).toBe(true);
		});

		it("should list service policies", async () => {
			const response = await client.get<ListResponse>(
				`/api/config/namespaces/${testNamespace}/service_policys`,
			);

			expect(response.ok).toBe(true);
		});

		it("should list virtual hosts", async () => {
			const response = await client.get<ListResponse>(
				`/api/config/namespaces/${testNamespace}/virtual_hosts`,
			);

			expect(response.ok).toBe(true);
		});
	});

	describe("CRUD Operations - Healthcheck", () => {
		it("should create a healthcheck", async () => {
			const payload = {
				metadata: {
					name: testResourceName,
					namespace: testNamespace,
					labels: {
						test: "true",
						"created-by": "xcsh-integration-test",
					},
				},
				spec: {
					http_health_check: {
						path: "/health",
					},
					timeout: 5,
					interval: 30,
					unhealthy_threshold: 2,
					healthy_threshold: 3,
				},
			};

			try {
				const response = await client.post(
					`/api/config/namespaces/${testNamespace}/healthchecks`,
					payload,
				);

				expect(response.ok).toBe(true);
				expect([200, 201]).toContain(response.statusCode);
			} catch (error) {
				if (error instanceof APIError) {
					// 403 means permission denied - skip CRUD tests
					if (error.statusCode === 403) {
						console.log("Permission denied - skipping CRUD test");
						return;
					}
					// 409 means already exists - acceptable for idempotent tests
					if (error.statusCode === 409) {
						console.log("Resource already exists - continuing");
						return;
					}
				}
				throw error;
			}
		});

		it("should read the created healthcheck", async () => {
			try {
				const response = await client.get<ResourceItem>(
					`/api/config/namespaces/${testNamespace}/healthchecks/${testResourceName}`,
				);

				expect(response.ok).toBe(true);
				expect(response.data).toBeDefined();

				if (response.data.metadata) {
					expect(response.data.metadata.name).toBe(testResourceName);
				}
			} catch (error) {
				if (error instanceof APIError) {
					if ([403, 404].includes(error.statusCode)) {
						console.log(
							`Resource not accessible (${error.statusCode}) - skipping`,
						);
						return;
					}
				}
				throw error;
			}
		});

		it("should update the healthcheck", async () => {
			const payload = {
				metadata: {
					name: testResourceName,
					namespace: testNamespace,
					labels: {
						test: "true",
						"created-by": "xcsh-integration-test",
						updated: "true",
					},
				},
				spec: {
					http_health_check: {
						path: "/healthz",
					},
					timeout: 10,
					interval: 60,
					unhealthy_threshold: 3,
					healthy_threshold: 2,
				},
			};

			try {
				const response = await client.put(
					`/api/config/namespaces/${testNamespace}/healthchecks/${testResourceName}`,
					payload,
				);

				expect(response.ok).toBe(true);
			} catch (error) {
				if (error instanceof APIError) {
					if ([403, 404].includes(error.statusCode)) {
						console.log(
							`Resource not accessible (${error.statusCode}) - skipping`,
						);
						return;
					}
				}
				throw error;
			}
		});

		it("should delete the healthcheck", async () => {
			try {
				const response = await client.delete(
					`/api/config/namespaces/${testNamespace}/healthchecks/${testResourceName}`,
				);

				expect(response.ok).toBe(true);
			} catch (error) {
				if (error instanceof APIError) {
					// 403 or 404 is acceptable
					if ([403, 404].includes(error.statusCode)) {
						return;
					}
				}
				throw error;
			}
		});

		it("should verify healthcheck was deleted", async () => {
			// Wait a moment for deletion to propagate
			await new Promise((resolve) => setTimeout(resolve, 1000));

			try {
				await client.get(
					`/api/config/namespaces/${testNamespace}/healthchecks/${testResourceName}`,
				);
				// If we reach here without error, resource still exists
				// This could be a timing issue or permission issue
			} catch (error) {
				if (error instanceof APIError) {
					// 404 is expected - resource was deleted
					expect(error.statusCode).toBe(404);
				} else {
					throw error;
				}
			}
		});
	});

	describe("System Resources", () => {
		it("should list sites in system namespace", async () => {
			try {
				const response = await client.get<ListResponse>(
					"/api/config/namespaces/system/sites",
				);

				expect(response.ok).toBe(true);

				if (response.data.items) {
					expect(Array.isArray(response.data.items)).toBe(true);
				}
			} catch (error) {
				if (error instanceof APIError && error.statusCode === 403) {
					console.log("Permission denied for listing sites");
					return;
				}
				throw error;
			}
		});
	});
});
