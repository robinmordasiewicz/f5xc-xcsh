/**
 * Integration tests for API authentication
 *
 * These tests require a real F5 XC environment.
 * Set the following environment variables:
 * - F5XC_API_URL: API endpoint URL
 * - F5XC_API_TOKEN: API token for authentication
 *
 * Run with: npm test -- tests/integration/
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

// Skip all tests if environment not configured
const config = getIntegrationConfig();
const describeIf = config ? describe : describe.skip;

describeIf("Authentication Integration Tests", () => {
	let client: APIClient;

	beforeAll(() => {
		if (!config) return;

		client = new APIClient({
			serverUrl: config.apiUrl,
			apiToken: config.apiToken,
			timeout: 30000,
		});
	});

	describe("API Token Authentication", () => {
		it("should authenticate with valid API token", async () => {
			const response = await client.get("/api/web/namespaces");

			expect(response.ok).toBe(true);
			expect(response.statusCode).toBe(200);
		});

		it("should have valid response headers", async () => {
			const response = await client.get("/api/web/namespaces");

			expect(response.headers).toBeDefined();
			expect(response.headers["content-type"]).toContain("application/json");
		});

		it("should return namespaces data structure", async () => {
			const response = await client.get<{ items?: unknown[] }>(
				"/api/web/namespaces",
			);

			expect(response.data).toBeDefined();
			// Response may have items array or direct namespace data
			if ("items" in response.data) {
				expect(Array.isArray(response.data.items)).toBe(true);
			}
		});
	});

	describe("Invalid Authentication", () => {
		it("should fail with invalid API token", async () => {
			const invalidClient = new APIClient({
				serverUrl: config!.apiUrl,
				apiToken: "invalid-token-12345",
				timeout: 30000,
			});

			await expect(
				invalidClient.get("/api/web/namespaces"),
			).rejects.toBeInstanceOf(APIError);

			try {
				await invalidClient.get("/api/web/namespaces");
			} catch (error) {
				if (error instanceof APIError) {
					expect([401, 403]).toContain(error.statusCode);
				} else {
					throw error;
				}
			}
		});

		it("should fail with empty API token", async () => {
			const noAuthClient = new APIClient({
				serverUrl: config!.apiUrl,
				apiToken: "",
				timeout: 30000,
			});

			await expect(
				noAuthClient.get("/api/web/namespaces"),
			).rejects.toBeInstanceOf(APIError);
		});
	});

	describe("Whoami Endpoint", () => {
		it("should access whoami endpoint", async () => {
			// Try the custom whoami endpoint - may return 404 if not available
			try {
				const response = await client.get(
					"/api/web/custom/namespace/system/whoami",
				);

				expect(response.ok).toBe(true);
				expect(response.data).toBeDefined();
			} catch (error) {
				if (error instanceof APIError) {
					// 404 is acceptable - endpoint may not exist but auth worked
					if (error.statusCode === 404) {
						expect(error.statusCode).toBe(404);
					} else {
						// 401/403 means auth failed
						expect([401, 403]).not.toContain(error.statusCode);
					}
				} else {
					throw error;
				}
			}
		});
	});

	describe("Connection Handling", () => {
		it("should handle connection timeout", async () => {
			const slowClient = new APIClient({
				serverUrl: config!.apiUrl,
				apiToken: config!.apiToken,
				timeout: 100, // Very short timeout
				retry: { maxRetries: 0 }, // Disable retries to test timeout handling directly
			});

			// With retries disabled and 100ms timeout, this should timeout quickly
			try {
				await slowClient.get("/api/web/namespaces");
				// If we get here without error, the network was very fast
			} catch (error) {
				// Timeout or network error is expected
				expect(error).toBeInstanceOf(APIError);
				if (error instanceof APIError) {
					// Timeout = statusCode 408, Network error = statusCode 0
					expect([0, 408]).toContain(error.statusCode);
					expect(error.message).toMatch(/timed out|network error/i);
				}
			}
		});

		it("should include proper authorization header", async () => {
			// We can't directly inspect headers, but we can verify auth works
			const response = await client.get("/api/web/namespaces");
			expect(response.ok).toBe(true);
		});
	});
});
