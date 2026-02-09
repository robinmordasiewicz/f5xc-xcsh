/**
 * Pre-flight Module Tests
 *
 * Tests for resource existence checking, similar name suggestions,
 * and delete pre-flight operations.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { APIClient as APIClientType } from "../../src/api/client.js";
import { APIError } from "../../src/api/types.js";
import {
  levenshteinDistance,
  calculateSimilarity,
  findSimilarFromList,
  checkResourceExists,
  performPreDeleteCheck,
  formatPreDeleteResult,
  type DeleteFlags,
} from "../../src/preflight/index.js";

// Mock API response storage
let mockClientResponse: {
  data: unknown;
  ok: boolean;
  statusCode: number;
} | null = null;
let mockClientError: Error | null = null;

// Create mock API client
function createMockAPIClient(): APIClientType {
  return {
    isAuthenticated: () => true,
    isValidated: () => true,
    get: vi.fn().mockImplementation(async () => {
      if (mockClientError) {
        throw mockClientError;
      }
      return mockClientResponse;
    }),
    post: vi.fn().mockImplementation(async () => {
      if (mockClientError) {
        throw mockClientError;
      }
      return mockClientResponse;
    }),
    put: vi.fn().mockImplementation(async () => {
      if (mockClientError) {
        throw mockClientError;
      }
      return mockClientResponse;
    }),
    delete: vi.fn().mockImplementation(async () => {
      if (mockClientError) {
        throw mockClientError;
      }
      return mockClientResponse;
    }),
  } as unknown as APIClientType;
}

// Helper to set mock API response
function mockAPIResponse(data: unknown, status = 200) {
  mockClientResponse = {
    data,
    ok: status >= 200 && status < 300,
    statusCode: status,
  };
  mockClientError = null;
}

// Helper to set mock API error
function mockAPIError(status: number, message: string) {
  mockClientResponse = null;
  mockClientError = new APIError(message, status);
}

describe("Levenshtein Distance", () => {
  beforeEach(() => {
    mockClientResponse = null;
    mockClientError = null;
  });

  it("should return 0 for identical strings", () => {
    expect(levenshteinDistance("hello", "hello")).toBe(0);
    expect(levenshteinDistance("", "")).toBe(0);
  });

  it("should return correct distance for single character changes", () => {
    expect(levenshteinDistance("hello", "hallo")).toBe(1); // substitution
    expect(levenshteinDistance("hello", "helloo")).toBe(1); // insertion
    expect(levenshteinDistance("hello", "helo")).toBe(1); // deletion
  });

  it("should return string length for empty string comparison", () => {
    expect(levenshteinDistance("hello", "")).toBe(5);
    expect(levenshteinDistance("", "hello")).toBe(5);
  });

  it("should handle case insensitivity", () => {
    expect(levenshteinDistance("Hello", "hello")).toBe(0);
    expect(levenshteinDistance("HELLO", "hello")).toBe(0);
  });

  it("should calculate correct distance for common typos", () => {
    expect(levenshteinDistance("my-pool", "my-poo")).toBe(1);
    expect(levenshteinDistance("healthcheck", "healtcheck")).toBe(1);
    expect(levenshteinDistance("loadbalancer", "loadblancer")).toBe(1);
  });
});

describe("Calculate Similarity", () => {
  it("should return 1 for identical strings", () => {
    expect(calculateSimilarity("hello", "hello")).toBe(1);
  });

  it("should return 0 for completely different strings of same length", () => {
    expect(calculateSimilarity("aaaa", "bbbb")).toBe(0);
  });

  it("should return higher similarity for closer strings", () => {
    const sim1 = calculateSimilarity("my-pool", "my-poo");
    const sim2 = calculateSimilarity("my-pool", "xyz");
    expect(sim1).toBeGreaterThan(sim2);
  });

  it("should handle empty strings", () => {
    expect(calculateSimilarity("", "")).toBe(1);
    expect(calculateSimilarity("hello", "")).toBe(0);
  });
});

describe("Find Similar From List", () => {
  const resourceNames = [
    "my-pool",
    "my-pool-2",
    "other-pool",
    "test-origin",
    "prod-backend",
  ];

  it("should find similar resources", () => {
    const suggestions = findSimilarFromList("my-poo", resourceNames);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]?.name).toBe("my-pool");
  });

  it("should exclude exact matches", () => {
    const suggestions = findSimilarFromList("my-pool", resourceNames);
    const names = suggestions.map((s) => s.name);
    expect(names).not.toContain("my-pool");
  });

  it("should respect maxSuggestions limit", () => {
    const suggestions = findSimilarFromList("pool", resourceNames, 2);
    expect(suggestions.length).toBeLessThanOrEqual(2);
  });

  it("should filter by minimum similarity", () => {
    const suggestions = findSimilarFromList(
      "xyz-completely-different",
      resourceNames,
      5,
      0.8,
    );
    expect(suggestions.length).toBe(0);
  });

  it("should sort by similarity descending", () => {
    const suggestions = findSimilarFromList("my-pool-1", resourceNames);
    for (let i = 1; i < suggestions.length; i++) {
      const prev = suggestions[i - 1];
      const curr = suggestions[i];
      expect(prev?.similarity).toBeGreaterThanOrEqual(curr?.similarity ?? 0);
    }
  });
});

describe("Check Resource Exists", () => {
  beforeEach(() => {
    mockClientResponse = null;
    mockClientError = null;
  });

  it("should return exists=true when resource found", async () => {
    const client = createMockAPIClient();
    mockAPIResponse({
      metadata: {
        name: "test-resource",
        namespace: "default",
        uid: "abc123",
      },
    });

    const result = await checkResourceExists({
      client,
      apiPath: "/api/web/namespaces/default/resources/test-resource",
      resourceName: "test-resource",
      namespace: "default",
    });

    expect(result.exists).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.metadata?.name).toBe("test-resource");
  });

  it("should return exists=false when resource not found (404)", async () => {
    const client = createMockAPIClient();
    mockAPIError(404, "Not Found");

    const result = await checkResourceExists({
      client,
      apiPath: "/api/web/namespaces/default/resources/missing",
      resourceName: "missing",
      namespace: "default",
    });

    expect(result.exists).toBe(false);
    expect(result.statusCode).toBe(404);
    expect(result.error).toBeUndefined();
  });

  it("should return error for non-404 failures", async () => {
    const client = createMockAPIClient();
    mockAPIError(500, "Internal Server Error");

    const result = await checkResourceExists({
      client,
      apiPath: "/api/web/namespaces/default/resources/test",
      resourceName: "test",
      namespace: "default",
    });

    expect(result.exists).toBe(false);
    expect(result.statusCode).toBe(500);
    expect(result.error).toBe("Internal Server Error");
  });

  it("should handle undefined namespace", async () => {
    const client = createMockAPIClient();
    mockAPIResponse({ metadata: { name: "test" } });

    const result = await checkResourceExists({
      client,
      apiPath: "/api/web/resources/test",
      resourceName: "test",
      namespace: undefined,
    });

    expect(result.exists).toBe(true);
  });
});

describe("Perform Pre-Delete Check", () => {
  beforeEach(() => {
    mockClientResponse = null;
    mockClientError = null;
  });

  const defaultFlags: DeleteFlags = {
    dryRun: false,
    checkDeps: false,
  };

  it("should allow deletion when resource exists", async () => {
    const client = createMockAPIClient();
    mockAPIResponse({ metadata: { name: "test-resource" } });

    const result = await performPreDeleteCheck(
      client,
      "/api/web/namespaces/default/resources/test-resource",
      "test-resource",
      "resource",
      "default",
      defaultFlags,
    );

    expect(result.canProceed).toBe(true);
    expect(result.exists).toBe(true);
  });

  it("should return not found info when resource doesn't exist", async () => {
    const client = createMockAPIClient();
    // First call (existence check) returns 404
    mockAPIError(404, "Not Found");

    const result = await performPreDeleteCheck(
      client,
      "/api/web/namespaces/default/resources/missing",
      "missing",
      "resource",
      "default",
      defaultFlags,
    );

    expect(result.canProceed).toBe(false);
    expect(result.exists).toBe(false);
    expect(result.reason).toBe("Resource not found");
  });

  it("should show plan with --dry-run flag when resource exists", async () => {
    const client = createMockAPIClient();
    mockAPIResponse({ metadata: { name: "test-resource" } });

    const result = await performPreDeleteCheck(
      client,
      "/api/web/namespaces/default/resources/test-resource",
      "test-resource",
      "resource",
      "default",
      { ...defaultFlags, dryRun: true },
    );

    expect(result.canProceed).toBe(false); // Don't actually delete
    expect(result.exists).toBe(true);
    expect(result.message).toContain("Would delete");
  });

  it("should return error with --dry-run flag when resource not found", async () => {
    const client = createMockAPIClient();
    mockAPIError(404, "Not Found");

    const result = await performPreDeleteCheck(
      client,
      "/api/web/namespaces/default/resources/missing",
      "missing",
      "resource",
      "default",
      { ...defaultFlags, dryRun: true },
    );

    expect(result.canProceed).toBe(false);
    expect(result.exists).toBe(false);
  });
});

describe("Format Pre-Delete Result", () => {
  it("should format not found error with suggestions", () => {
    const result = formatPreDeleteResult({
      canProceed: false,
      exists: false,
      suggestions: [
        { name: "my-pool", distance: 1, similarity: 0.9 },
        { name: "my-pool-2", distance: 2, similarity: 0.8 },
      ],
      reason: "Resource not found",
      message: "Resource 'my-poo' not found in namespace 'default'",
      hint: "Use 'list origin_pool' to see available resources",
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((line) => line.includes("my-poo"))).toBe(true);
    expect(result.some((line) => line.includes("Did you mean"))).toBe(true);
    expect(result.some((line) => line.includes("my-pool"))).toBe(true);
  });

  it("should format dry-run output", () => {
    const result = formatPreDeleteResult({
      canProceed: false,
      exists: true,
      message: "Would delete resource 'test-resource'",
      hint: "Remove --dry-run flag to execute deletion",
    });

    expect(result.some((line) => line.includes("Would delete"))).toBe(true);
    expect(result.some((line) => line.includes("--dry-run"))).toBe(true);
  });

  it("should return empty array when deletion can proceed", () => {
    const result = formatPreDeleteResult({
      canProceed: true,
      exists: true,
      message: "Resource found, proceeding with deletion",
    });

    // When canProceed is true, no error output needed
    expect(result.length).toBe(0);
  });
});
