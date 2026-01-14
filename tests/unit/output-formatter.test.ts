/**
 * Output Formatter Tests
 * Tests for main formatter routing and format-specific functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
	formatOutput,
	formatJSON,
	formatYAML,
	formatTSV,
	formatAPIError,
	parseOutputFormat,
} from "../../src/output/formatter.js";
import {
	standardResource,
	resourceList,
	wrappedItems,
	nestedData,
	emptyData,
	specialCharsData,
	apiErrorResponses,
	unicodeData,
} from "./output-test-fixtures.js";

describe("formatOutput", () => {
	beforeEach(() => {
		// Mock TTY detection for consistent color behavior
		vi.stubEnv("NO_COLOR", "1");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	describe("format routing", () => {
		it("routes to JSON format", () => {
			const result = formatOutput(standardResource, "json");
			expect(result).toBe(JSON.stringify(standardResource, null, 2));
		});

		it("routes to YAML format", () => {
			const result = formatOutput(standardResource, "yaml");
			expect(result).toContain("name: test-resource");
			expect(result).toContain("namespace: default");
		});

		it("routes to table format", () => {
			const result = formatOutput(resourceList, "table", true);
			expect(result).toContain("NAME");
			expect(result).toContain("resource-1");
		});

		it("routes text to table format", () => {
			const result = formatOutput(resourceList, "text", true);
			expect(result).toContain("NAME");
		});

		it("routes to TSV format", () => {
			const result = formatOutput(resourceList, "tsv");
			expect(result).toContain("\t");
			expect(result).toContain("resource-1");
		});

		it("returns empty string for none format", () => {
			const result = formatOutput(standardResource, "none");
			expect(result).toBe("");
		});

		it("routes spec format to JSON", () => {
			const result = formatOutput(standardResource, "spec");
			expect(result).toBe(JSON.stringify(standardResource, null, 2));
		});

		it("defaults to table format", () => {
			const result = formatOutput(resourceList, undefined, true);
			expect(result).toContain("NAME");
		});
	});

	describe("noColor parameter", () => {
		it("respects noColor=true", () => {
			const result = formatOutput(resourceList, "table", true);
			// Should use ASCII box characters when colors disabled
			expect(result).toContain("+");
			expect(result).not.toContain("\x1b[");
		});
	});
});

describe("formatJSON", () => {
	it("formats standard object with 2-space indent", () => {
		const result = formatJSON(standardResource);
		expect(result).toBe(JSON.stringify(standardResource, null, 2));
	});

	it("formats nested objects", () => {
		const result = formatJSON(nestedData);
		expect(result).toContain("level1");
		expect(result).toContain("deeply nested");
	});

	it("formats arrays", () => {
		const result = formatJSON(resourceList);
		expect(result.startsWith("[")).toBe(true);
		expect(result.endsWith("]")).toBe(true);
	});

	it("handles null value", () => {
		const result = formatJSON(null);
		expect(result).toBe("null");
	});

	it("handles empty array", () => {
		const result = formatJSON([]);
		expect(result).toBe("[]");
	});

	it("handles empty object", () => {
		const result = formatJSON({});
		expect(result).toBe("{}");
	});

	it("preserves special characters in strings", () => {
		const result = formatJSON(specialCharsData);
		expect(result).toContain("path/with/slashes");
		expect(result).toContain('"quotes"');
	});

	it("handles unicode characters", () => {
		const result = formatJSON(unicodeData);
		expect(result).toContain("🚀");
		expect(result).toContain("日本語テスト");
	});
});

describe("formatYAML", () => {
	it("formats standard object", () => {
		const result = formatYAML(standardResource);
		expect(result).toContain("name: test-resource");
		expect(result).toContain("namespace: default");
		expect(result).toContain("status: ACTIVE");
	});

	it("formats nested structures", () => {
		const result = formatYAML(nestedData);
		expect(result).toContain("level1:");
		expect(result).toContain("level2:");
		expect(result).toContain("deeply nested");
	});

	it("formats arrays", () => {
		const result = formatYAML(resourceList);
		expect(result).toContain("- name:");
	});

	it("handles null value", () => {
		const result = formatYAML(null);
		expect(result.trim()).toBe("null");
	});

	it("handles empty array", () => {
		const result = formatYAML([]);
		expect(result.trim()).toBe("[]");
	});

	it("handles empty object", () => {
		const result = formatYAML({});
		expect(result.trim()).toBe("{}");
	});

	it("handles unicode characters", () => {
		const result = formatYAML(unicodeData);
		expect(result).toContain("🚀");
		expect(result).toContain("日本語テスト");
	});

	it("escapes special YAML characters", () => {
		const data = { key: "value: with colon" };
		const result = formatYAML(data);
		// YAML should properly handle the colon in the value
		expect(result).toContain("value: with colon");
	});
});

describe("formatTSV", () => {
	it("formats array of objects as TSV", () => {
		const result = formatTSV(resourceList);
		const lines = result.split("\n");
		expect(lines.length).toBe(3);
		expect(lines[0]).toContain("\t");
	});

	it("prioritizes common columns (name, namespace, status)", () => {
		const result = formatTSV(resourceList);
		const firstLine = result.split("\n")[0];
		const columns = firstLine?.split("\t") ?? [];
		// Name should appear early
		expect(columns.some((col) => col?.includes("resource-1"))).toBe(true);
	});

	it("handles items wrapper", () => {
		const result = formatTSV(wrappedItems);
		expect(result).toContain("resource-1");
		expect(result.split("\n").length).toBe(3);
	});

	it("returns empty string for empty data", () => {
		expect(formatTSV(emptyData.emptyArray)).toBe("");
		expect(formatTSV(emptyData.emptyItems)).toBe("");
	});

	it("handles null values in objects", () => {
		const data = [{ name: "test", value: null }];
		const result = formatTSV(data);
		expect(result).toContain("test");
	});

	it("stringifies nested objects", () => {
		const data = [{ name: "test", nested: { key: "value" } }];
		const result = formatTSV(data);
		expect(result).toContain('{"key":"value"}');
	});

	it("handles single item", () => {
		const result = formatTSV(standardResource);
		expect(result).toContain("test-resource");
	});
});

describe("formatAPIError", () => {
	/**
	 * Helper to validate error message follows human-readable style guide:
	 * - Exactly 2 lines
	 * - Line 1: ERROR message (no technical jargon)
	 * - Line 2: Tip with actionable guidance
	 * - No JSON, no code numbers, no internal paths
	 */
	function validateErrorFormat(result: string, statusCode: number): void {
		const lines = result.split("\n");

		// Must be exactly 2 lines
		expect(lines.length).toBe(2);

		// Line 1 must start with ERROR
		expect(lines[0]).toMatch(/^ERROR:/);

		// Line 2 must start with Tip
		expect(lines[1]).toMatch(/^Tip:/);

		// Should not contain technical jargon
		expect(result).not.toContain("HTTP " + statusCode); // No HTTP codes in new format
		expect(result).not.toContain("ves.io.schema"); // No internal paths
		expect(result).not.toContain("Object:"); // No technical terms
		expect(result).not.toContain("code:"); // No code fields
		expect(result).not.toContain("details:"); // No details fields
		expect(result).not.toContain("{"); // No JSON
		expect(result).not.toContain("["); // No arrays
	}

	describe("HTTP 401 - Authentication Errors", () => {
		it("formats 401 error with concise 2-line message", () => {
			const { statusCode, body, operation } = apiErrorResponses.unauthorized;
			const result = formatAPIError(statusCode, body, operation);

			validateErrorFormat(result, statusCode);
			expect(result).toContain("ERROR: Authentication failed");
			expect(result).toContain("Tip: Run 'login use profile");
		});
	});

	describe("HTTP 403 - Permission Errors", () => {
		it("formats 403 error with concise 2-line message", () => {
			const { statusCode, body, operation } = apiErrorResponses.forbidden;
			const result = formatAPIError(statusCode, body, operation);

			validateErrorFormat(result, statusCode);
			expect(result).toContain("ERROR: Permission denied");
			expect(result).toContain("Tip: Contact your administrator");
		});
	});

	describe("HTTP 404 - Not Found Errors", () => {
		it("extracts resource info from F5 XC error message", () => {
			const { statusCode, body, operation } = apiErrorResponses.notFound;
			const result = formatAPIError(statusCode, body, operation);

			validateErrorFormat(result, statusCode);
			// Should extract resource name and namespace
			expect(result).toContain("ERROR: Resource 'foobar' not found");
			expect(result).toContain("namespace 'r-mordasiewicz'");
			expect(result).toContain("Tip: Use 'list http_loadbalancer'");
		});

		it("handles simple 404 without resource extraction", () => {
			const { statusCode, body, operation } = apiErrorResponses.notFoundSimple;
			const result = formatAPIError(statusCode, body, operation);

			validateErrorFormat(result, statusCode);
			expect(result).toContain("ERROR: Resource not found");
			expect(result).toContain("Tip:");
		});
	});

	describe("HTTP 409 - Conflict Errors", () => {
		it("formats 409 'already exists' conflict", () => {
			const { statusCode, body, operation } = apiErrorResponses.conflict;
			const result = formatAPIError(statusCode, body, operation);

			validateErrorFormat(result, statusCode);
			expect(result).toContain("ERROR: Resource");
			expect(result).toContain("already exists");
			expect(result).toContain("Tip:");
		});

		it("formats 409 'in use' conflict with helpful tip", () => {
			const { statusCode, body, operation } = apiErrorResponses.conflictInUse;
			const result = formatAPIError(statusCode, body, operation);

			validateErrorFormat(result, statusCode);
			expect(result).toContain("ERROR: Resource is currently in use");
			expect(result).toContain("Tip: Use 'get' command to identify dependencies");
		});
	});

	describe("HTTP 429 - Rate Limit Errors", () => {
		it("formats 429 error with concise 2-line message", () => {
			const { statusCode, body, operation } = apiErrorResponses.rateLimit;
			const result = formatAPIError(statusCode, body, operation);

			validateErrorFormat(result, statusCode);
			expect(result).toContain("ERROR: Rate limit exceeded");
			expect(result).toContain("Tip: Wait a moment and try again");
		});
	});

	describe("HTTP 500/502/503 - Server Errors", () => {
		it("formats 500 error with concise 2-line message", () => {
			const { statusCode, body, operation } = apiErrorResponses.serverError;
			const result = formatAPIError(statusCode, body, operation);

			validateErrorFormat(result, statusCode);
			expect(result).toContain("ERROR: Server error");
			expect(result).toContain("temporarily unavailable");
			expect(result).toContain("Tip:");
		});

		it("handles 502 bad gateway", () => {
			const result = formatAPIError(502, { message: "Bad gateway" }, "test");

			validateErrorFormat(result, 502);
			expect(result).toContain("ERROR: Server error");
			expect(result).toContain("temporarily unavailable");
		});

		it("handles 503 service unavailable", () => {
			const result = formatAPIError(
				503,
				{ message: "Service unavailable" },
				"test",
			);

			validateErrorFormat(result, 503);
			expect(result).toContain("ERROR: Server error");
			expect(result).toContain("temporarily unavailable");
		});
	});

	describe("Error Message Quality", () => {
		it("never includes technical jargon in any error", () => {
			const testCases = [
				apiErrorResponses.unauthorized,
				apiErrorResponses.forbidden,
				apiErrorResponses.notFound,
				apiErrorResponses.conflict,
				apiErrorResponses.rateLimit,
				apiErrorResponses.serverError,
			];

			for (const { statusCode, body, operation } of testCases) {
				const result = formatAPIError(statusCode, body, operation);

				// No technical terms
				expect(result).not.toContain("ves.io.schema");
				expect(result).not.toContain("Object:");
				expect(result).not.toContain("Key ");
				expect(result).not.toContain("code:");
				expect(result).not.toContain("details:");
			}
		});

		it("always provides actionable tip", () => {
			const testCases = [
				apiErrorResponses.unauthorized,
				apiErrorResponses.forbidden,
				apiErrorResponses.notFound,
				apiErrorResponses.conflict,
				apiErrorResponses.rateLimit,
				apiErrorResponses.serverError,
			];

			for (const { statusCode, body, operation } of testCases) {
				const result = formatAPIError(statusCode, body, operation);
				const lines = result.split("\n");

				// Second line must be actionable tip
				expect(lines[1]).toMatch(/^Tip:/);
				expect(lines[1].length).toBeGreaterThan(10); // Not empty tip
			}
		});

		it("handles error without body gracefully", () => {
			const result = formatAPIError(500, null, "test operation");

			validateErrorFormat(result, 500);
			expect(result).toContain("ERROR:");
			expect(result).toContain("Tip:");
		});

		it("handles unknown status codes with generic format", () => {
			const result = formatAPIError(418, { message: "I'm a teapot" }, "test");

			const lines = result.split("\n");
			expect(lines.length).toBeGreaterThanOrEqual(1);
			expect(lines[0]).toContain("ERROR:");
		});
	});
});

describe("parseOutputFormat", () => {
	it("parses json format", () => {
		expect(parseOutputFormat("json")).toBe("json");
		expect(parseOutputFormat("JSON")).toBe("json");
	});

	it("parses yaml format", () => {
		expect(parseOutputFormat("yaml")).toBe("yaml");
		expect(parseOutputFormat("YAML")).toBe("yaml");
	});

	it("parses table format", () => {
		expect(parseOutputFormat("table")).toBe("table");
		expect(parseOutputFormat("text")).toBe("table");
		expect(parseOutputFormat("")).toBe("table");
	});

	it("parses tsv format", () => {
		expect(parseOutputFormat("tsv")).toBe("tsv");
		expect(parseOutputFormat("TSV")).toBe("tsv");
	});

	it("parses none format", () => {
		expect(parseOutputFormat("none")).toBe("none");
	});

	it("returns table for invalid format", () => {
		expect(parseOutputFormat("invalid")).toBe("table");
		expect(parseOutputFormat("xml")).toBe("table");
	});
});
