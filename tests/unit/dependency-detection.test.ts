/**
 * Tests for resource dependency detection
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { detectDependencies } from "../../src/dependencies/detector.js";
import { formatDependencyError } from "../../src/dependencies/formatter.js";
import {
	searchForReferences,
	searchResourceList,
} from "../../src/dependencies/search.js";
import {
	getRelatedDomains,
	hasKnownRelationships,
} from "../../src/dependencies/relationships.js";
import type { APIClient } from "../../src/api/client.js";

describe("Dependency Detection", () => {
	describe("Relationship Registry", () => {
		it("should recognize known resource types", () => {
			expect(hasKnownRelationships("origin_pool")).toBe(true);
			expect(hasKnownRelationships("healthcheck")).toBe(true);
			expect(hasKnownRelationships("certificate")).toBe(true);
			expect(hasKnownRelationships("unknown_resource")).toBe(false);
		});

		it("should return related domains for origin_pool", () => {
			const domains = getRelatedDomains("origin_pool");
			expect(domains).toContain("http_loadbalancer");
			expect(domains).toContain("tcp_loadbalancer");
			expect(domains.length).toBeGreaterThanOrEqual(2);
		});

		it("should return related domains for healthcheck", () => {
			const domains = getRelatedDomains("healthcheck");
			expect(domains).toContain("origin_pool");
			expect(domains).toContain("http_loadbalancer");
			expect(domains.length).toBeGreaterThanOrEqual(2);
		});

		it("should return empty array for unknown resource type", () => {
			const domains = getRelatedDomains("unknown_resource");
			expect(domains).toEqual([]);
		});
	});

	describe("Reference Search", () => {
		it("should find direct string matches", () => {
			const obj = {
				spec: {
					origin_pool: "my-pool",
				},
			};

			const results = searchForReferences(obj, {
				targetName: "my-pool",
				targetType: "origin_pool",
			});

			expect(results.length).toBeGreaterThan(0);
			expect(results[0].path).toContain("origin_pool");
			expect(results[0].value).toBe("my-pool");
		});

		it("should find references in arrays", () => {
			const obj = {
				spec: {
					pools: [
						{ origin_pool: "pool-1" },
						{ origin_pool: "pool-2" },
						{ origin_pool: "target-pool" },
					],
				},
			};

			const results = searchForReferences(obj, {
				targetName: "target-pool",
				targetType: "origin_pool",
			});

			expect(results.length).toBeGreaterThan(0);
			expect(results[0].path).toContain("[2]");
		});

		it("should find nested references", () => {
			const obj = {
				metadata: { name: "my-lb" },
				spec: {
					default_pool: {
						pool: {
							name: "my-pool",
						},
					},
				},
			};

			const results = searchForReferences(obj, {
				targetName: "my-pool",
				targetType: "origin_pool",
			});

			expect(results.length).toBeGreaterThan(0);
		});

		it("should handle null and undefined values", () => {
			const obj = {
				spec: {
					pool: null,
					other: undefined,
				},
			};

			const results = searchForReferences(obj, {
				targetName: "any-pool",
				targetType: "origin_pool",
			});

			expect(results).toEqual([]);
		});
	});

	describe("Resource List Search", () => {
		it("should find references in resource list", () => {
			const resources = [
				{
					metadata: { name: "lb-1" },
					spec: {
						pools: [{ origin_pool: "target-pool" }],
					},
				},
				{
					metadata: { name: "lb-2" },
					spec: {
						default_pool: "other-pool",
					},
				},
				{
					metadata: { name: "lb-3" },
					spec: {
						pools: [{ origin_pool: "target-pool" }],
					},
				},
			];

			const matches = searchResourceList(
				resources,
				"target-pool",
				"origin_pool",
				"http_loadbalancer",
			);

			// Should find references in lb-1 and lb-3 (recursive search may find multiple paths)
			expect(matches.length).toBeGreaterThanOrEqual(2);
			const resourceNames = matches.map((m) => m.resourceName);
			expect(resourceNames).toContain("lb-1");
			expect(resourceNames).toContain("lb-3");
			expect(resourceNames).not.toContain("lb-2"); // lb-2 doesn't reference target-pool
		});

		it("should handle resources without metadata", () => {
			const resources = [
				{
					name: "resource-1",
					spec: {
						ref: "target",
					},
				},
			];

			const matches = searchResourceList(
				resources,
				"target",
				"some_type",
				"some_domain",
			);

			expect(matches.length).toBeGreaterThan(0);
			expect(matches[0].resourceName).toBe("resource-1");
		});
	});

	describe("Dependency Formatter", () => {
		it("should format single dependency", () => {
			const result = {
				found: true,
				references: [
					{
						domain: "http_loadbalancer",
						resourceName: "my-lb",
						namespace: "default",
						fieldPath: "spec.pools[0].origin_pool",
						fieldValue: "my-pool",
					},
				],
				searchedDomains: ["http_loadbalancer", "tcp_loadbalancer"],
				searchTimeMs: 456,
			};

			const lines = formatDependencyError("origin_pool", "my-pool", result);

			expect(lines[0]).toContain("ERROR:");
			expect(lines[0]).toContain("my-pool");
			expect(lines).toContain("Referenced by 1 resource:");
			expect(lines.some((l) => l.includes("http_loadbalancer:"))).toBe(true);
			expect(lines.some((l) => l.includes("my-lb"))).toBe(true);
			expect(lines[lines.length - 1]).toContain("Tip:");
		});

		it("should format multiple dependencies across domains", () => {
			const result = {
				found: true,
				references: [
					{
						domain: "http_loadbalancer",
						resourceName: "lb-1",
						namespace: "default",
						fieldPath: "spec.pools[0].origin_pool",
						fieldValue: "my-pool",
					},
					{
						domain: "http_loadbalancer",
						resourceName: "lb-2",
						namespace: "default",
						fieldPath: "spec.default_pool",
						fieldValue: "my-pool",
					},
					{
						domain: "tcp_loadbalancer",
						resourceName: "tcp-lb-1",
						namespace: "default",
						fieldPath: "spec.origin_pools[0]",
						fieldValue: "my-pool",
					},
				],
				searchedDomains: ["http_loadbalancer", "tcp_loadbalancer"],
				searchTimeMs: 523,
			};

			const lines = formatDependencyError("origin_pool", "my-pool", result);

			expect(lines[0]).toContain("ERROR:");
			expect(lines).toContain(
				"Referenced by 3 resource(s) across 2 domain(s):",
			);
			expect(lines.some((l) => l.includes("http_loadbalancer:"))).toBe(true);
			expect(lines.some((l) => l.includes("tcp_loadbalancer:"))).toBe(true);
			expect(lines.some((l) => l.includes("lb-1"))).toBe(true);
			expect(lines.some((l) => l.includes("lb-2"))).toBe(true);
			expect(lines.some((l) => l.includes("tcp-lb-1"))).toBe(true);
		});
	});

	describe("Dependency Detection with Mock API", () => {
		let mockClient: APIClient;

		beforeEach(() => {
			mockClient = {
				get: vi.fn().mockResolvedValue({ data: { items: [] } }),
			} as unknown as APIClient;
		});

		it("should query related domains for known resource types", async () => {
			const result = await detectDependencies(
				"origin_pool",
				"test-pool",
				"default",
				mockClient,
			);

			expect(mockClient.get).toHaveBeenCalledWith(
				expect.stringContaining("http_loadbalancers"),
			);
			expect(mockClient.get).toHaveBeenCalledWith(
				expect.stringContaining("tcp_loadbalancers"),
			);
			expect(result.searchedDomains.length).toBeGreaterThan(0);
		});

		it("should find dependencies when they exist", async () => {
			mockClient.get = vi.fn().mockImplementation((path: string) => {
				// Handle list request
				if (path.endsWith("/http_loadbalancers")) {
					return Promise.resolve({
						data: {
							items: [
								{
									metadata: { name: "my-lb" },
									name: "my-lb",
								},
							],
						},
					});
				}
				// Handle individual GET request for smart batching
				if (path.includes("/http_loadbalancers/my-lb")) {
					return Promise.resolve({
						data: {
							metadata: { name: "my-lb" },
							spec: {
								pools: [{ origin_pool: "test-pool" }],
							},
						},
					});
				}
				return Promise.resolve({ data: { items: [] } });
			});

			const result = await detectDependencies(
				"origin_pool",
				"test-pool",
				"default",
				mockClient,
			);

			expect(result.found).toBe(true);
			expect(result.references.length).toBeGreaterThan(0);
			expect(result.references[0].resourceName).toBe("my-lb");
			expect(result.references[0].domain).toBe("http_loadbalancer");
		});

		it("should handle API errors gracefully", async () => {
			mockClient.get = vi.fn().mockRejectedValue(new Error("API Error"));

			const result = await detectDependencies(
				"origin_pool",
				"test-pool",
				"default",
				mockClient,
			);

			expect(result.found).toBe(false);
			expect(result.references).toEqual([]);
		});

		it("should timeout after 3 seconds", async () => {
			mockClient.get = vi.fn().mockImplementation(
				() =>
					new Promise((resolve) => {
						setTimeout(() => resolve({ items: [] }), 5000);
					}),
			);

			const startTime = Date.now();
			const result = await detectDependencies(
				"origin_pool",
				"test-pool",
				"default",
				mockClient,
			);
			const elapsed = Date.now() - startTime;

			expect(elapsed).toBeLessThan(3500); // 3s timeout + some overhead
			expect(result.found).toBe(false);
		}, 10000);

		it("should use Tier 2 all-domain scan for unknown resource types", async () => {
			const result = await detectDependencies(
				"unknown_resource",
				"test",
				"default",
				mockClient,
			);

			expect(result.found).toBe(false);
			expect(result.searchedDomains.length).toBeGreaterThan(0);
			// Should search all available domains (38 domains)
			expect(result.searchedDomains.length).toBeGreaterThanOrEqual(38);
		});
	});
});
