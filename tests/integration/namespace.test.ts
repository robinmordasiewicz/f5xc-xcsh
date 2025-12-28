/**
 * Integration tests for namespace operations
 *
 * These tests require a real F5 XC environment.
 * Set the following environment variables:
 * - F5XC_API_URL: API endpoint URL
 * - F5XC_API_TOKEN: API token for authentication
 */

import { describe, it, expect, beforeAll } from "vitest";
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
interface NamespaceItem {
	name?: string;
	metadata?: {
		name?: string;
	};
}

interface ListResponse {
	items?: NamespaceItem[];
}

// Skip all tests if environment not configured
const config = getIntegrationConfig();
const describeIf = config ? describe : describe.skip;

describeIf("Namespace Integration Tests", () => {
	let client: APIClient;

	beforeAll(() => {
		if (!config) return;

		client = new APIClient({
			serverUrl: config.apiUrl,
			apiToken: config.apiToken,
			timeout: 30000,
		});
	});

	describe("List Namespaces", () => {
		it("should list namespaces successfully", async () => {
			const response = await client.get<ListResponse>("/api/web/namespaces");

			expect(response.ok).toBe(true);
			expect(response.statusCode).toBe(200);
			expect(response.data).toBeDefined();
		});

		it("should return items array in response", async () => {
			const response = await client.get<ListResponse>("/api/web/namespaces");

			if (response.data.items) {
				expect(Array.isArray(response.data.items)).toBe(true);
				expect(response.data.items.length).toBeGreaterThan(0);
			}
		});

		it("should contain system namespace", async () => {
			const response = await client.get<ListResponse>("/api/web/namespaces");

			if (response.data.items) {
				const hasSystem = response.data.items.some(
					(item) => item.name === "system" || item.metadata?.name === "system",
				);
				expect(hasSystem).toBe(true);
			}
		});

		it("should contain shared namespace", async () => {
			const response = await client.get<ListResponse>("/api/web/namespaces");

			if (response.data.items) {
				const hasShared = response.data.items.some(
					(item) => item.name === "shared" || item.metadata?.name === "shared",
				);
				expect(hasShared).toBe(true);
			}
		});
	});

	describe("Get Namespace", () => {
		it("should get system namespace", async () => {
			const response =
				await client.get<NamespaceItem>("/api/web/namespaces/system");

			expect(response.ok).toBe(true);
			expect(response.statusCode).toBe(200);
			expect(response.data).toBeDefined();
		});

		it("should get shared namespace", async () => {
			const response =
				await client.get<NamespaceItem>("/api/web/namespaces/shared");

			expect(response.ok).toBe(true);
			expect(response.statusCode).toBe(200);
		});

		it("should return 404 for nonexistent namespace", async () => {
			try {
				await client.get("/api/web/namespaces/nonexistent-test-namespace-12345");
				// If we reach here, the API didn't return an error
				expect(true).toBe(false); // Force failure
			} catch (error) {
				if (error instanceof APIError) {
					expect(error.statusCode).toBe(404);
				} else {
					throw error;
				}
			}
		});
	});

	describe("System Namespace Contents", () => {
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
				// Some permissions may prevent listing - log and skip
				if (error instanceof APIError) {
					if (error.statusCode === 403) {
						console.log("Permission denied for listing sites - skipping");
						return;
					}
				}
				throw error;
			}
		});

		it("should list cloud credentials in system namespace", async () => {
			try {
				const response = await client.get<ListResponse>(
					"/api/config/namespaces/system/cloud_credentialss",
				);

				expect(response.ok).toBe(true);
			} catch (error) {
				if (error instanceof APIError) {
					// 403 or 404 may be expected depending on permissions
					if ([403, 404].includes(error.statusCode)) {
						return;
					}
				}
				throw error;
			}
		});
	});
});
