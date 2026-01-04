/**
 * Comprehensive tests for parseCommandArgs function
 *
 * Test matrix covering:
 * - Positional argument ordering (before/after flags)
 * - Flag parsing (--namespace, -ns, --name, --output, --spec, --no-color)
 * - Resource type recognition with domainResourceTypes
 * - Edge cases and error handling
 */

import { describe, it, expect } from "vitest";
import { parseCommandArgs, type ParsedArgs } from "../../src/repl/executor.js";

/**
 * Test matrix entry type
 */
interface TestCase {
	description: string;
	args: string[];
	domainResourceTypes?: Set<string>;
	expected: Partial<ParsedArgs>;
}

describe("parseCommandArgs", () => {
	/**
	 * Core test matrix for argument parsing
	 */
	const coreTestMatrix: TestCase[] = [
		// ==========================================
		// POSITIONAL ARGUMENT ORDERING (BUG FIX)
		// ==========================================
		{
			description: "name AFTER flags: get http_loadbalancer --namespace ns resource-name",
			args: ["http_loadbalancer", "--namespace", "r-mordasiewicz", "canadian-http-lb"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "canadian-http-lb",
				namespace: "r-mordasiewicz",
			},
		},
		{
			description: "name BEFORE flags: get http_loadbalancer resource-name --namespace ns",
			args: ["http_loadbalancer", "canadian-http-lb", "--namespace", "r-mordasiewicz"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "canadian-http-lb",
				namespace: "r-mordasiewicz",
			},
		},
		{
			description: "name via --name flag: get http_loadbalancer --namespace ns --name resource-name",
			args: ["http_loadbalancer", "--namespace", "r-mordasiewicz", "--name", "canadian-http-lb"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "canadian-http-lb",
				namespace: "r-mordasiewicz",
			},
		},
		{
			description: "short flags: get http_loadbalancer -ns ns resource-name",
			args: ["http_loadbalancer", "-ns", "r-mordasiewicz", "canadian-http-lb"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "canadian-http-lb",
				namespace: "r-mordasiewicz",
			},
		},

		// ==========================================
		// NAMESPACE FLAG VARIATIONS
		// ==========================================
		{
			description: "--namespace flag (long form)",
			args: ["http_loadbalancer", "--namespace", "test-ns"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				namespace: "test-ns",
			},
		},
		{
			description: "--ns flag (long alias)",
			args: ["http_loadbalancer", "--ns", "test-ns"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				namespace: "test-ns",
			},
		},
		{
			description: "-n flag (short form)",
			args: ["http_loadbalancer", "-n", "test-ns"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				namespace: "test-ns",
			},
		},
		{
			description: "-ns flag (short alias)",
			args: ["http_loadbalancer", "-ns", "test-ns"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				namespace: "test-ns",
			},
		},

		// ==========================================
		// OUTPUT FORMAT FLAG VARIATIONS
		// ==========================================
		{
			description: "--output json flag",
			args: ["http_loadbalancer", "--output", "json"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				outputFormat: "json",
			},
		},
		{
			description: "--output yaml flag",
			args: ["http_loadbalancer", "--output", "yaml"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				outputFormat: "yaml",
			},
		},
		{
			description: "--output table flag",
			args: ["http_loadbalancer", "--output", "table"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				outputFormat: "table",
			},
		},
		{
			description: "-o short form for output",
			args: ["http_loadbalancer", "-o", "json"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				outputFormat: "json",
			},
		},

		// ==========================================
		// SPEC AND NO-COLOR FLAGS
		// ==========================================
		{
			description: "--spec flag",
			args: ["http_loadbalancer", "--spec"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				spec: true,
			},
		},
		{
			description: "--no-color flag",
			args: ["http_loadbalancer", "--no-color"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				noColor: true,
			},
		},
		{
			description: "combined --spec and --no-color",
			args: ["http_loadbalancer", "--spec", "--no-color"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				spec: true,
				noColor: true,
			},
		},

		// ==========================================
		// RESOURCE TYPE RECOGNITION
		// ==========================================
		{
			description: "recognizes valid resource type from domainResourceTypes",
			args: ["origin_pool"],
			domainResourceTypes: new Set(["http_loadbalancer", "origin_pool", "waf_policy"]),
			expected: {
				resourceType: "origin_pool",
				name: undefined,
			},
		},
		{
			description: "treats unknown type as resource name when no domainResourceTypes",
			args: ["unknown_resource"],
			domainResourceTypes: undefined,
			expected: {
				resourceType: undefined,
				name: "unknown_resource",
			},
		},
		{
			description: "treats unknown type as resource name when not in domainResourceTypes",
			args: ["unknown_resource"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: undefined,
				name: "unknown_resource",
			},
		},
		{
			description: "case insensitive resource type matching",
			args: ["HTTP_LOADBALANCER"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
			},
		},

		// ==========================================
		// COMPLEX COMBINATIONS
		// ==========================================
		{
			description: "all flags combined with positional name after",
			args: [
				"http_loadbalancer",
				"--namespace",
				"prod",
				"--output",
				"json",
				"--spec",
				"--no-color",
				"my-lb",
			],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "my-lb",
				namespace: "prod",
				outputFormat: "json",
				spec: true,
				noColor: true,
			},
		},
		{
			description: "all flags combined with positional name before",
			args: [
				"http_loadbalancer",
				"my-lb",
				"--namespace",
				"prod",
				"--output",
				"yaml",
				"--no-color",
			],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "my-lb",
				namespace: "prod",
				outputFormat: "yaml",
				noColor: true,
			},
		},
		{
			description: "mixed short and long flags",
			args: ["http_loadbalancer", "-ns", "test", "-o", "json", "--name", "my-resource"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "my-resource",
				namespace: "test",
				outputFormat: "json",
			},
		},

		// ==========================================
		// EDGE CASES
		// ==========================================
		{
			description: "empty args array",
			args: [],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: undefined,
				name: undefined,
				namespace: undefined,
				spec: false,
				noColor: false,
			},
		},
		{
			description: "only namespace flag",
			args: ["--namespace", "test"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: undefined,
				name: undefined,
				namespace: "test",
			},
		},
		{
			description: "resource name with special characters",
			args: ["http_loadbalancer", "my-lb-v1.2.3_test"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "my-lb-v1.2.3_test",
			},
		},
		{
			description: "multiple resource types - uses first one",
			args: ["http_loadbalancer", "origin_pool"],
			domainResourceTypes: new Set(["http_loadbalancer", "origin_pool"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "origin_pool",
			},
		},
		{
			description: "unknown flags are skipped with their values",
			args: ["http_loadbalancer", "--unknown-flag", "value", "my-resource"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "my-resource",
			},
		},
		{
			description: "flag at end without value",
			args: ["http_loadbalancer", "my-lb", "--namespace"],
			domainResourceTypes: new Set(["http_loadbalancer"]),
			expected: {
				resourceType: "http_loadbalancer",
				name: "my-lb",
				namespace: undefined, // --namespace without value
			},
		},
	];

	describe("core test matrix", () => {
		for (const testCase of coreTestMatrix) {
			it(testCase.description, () => {
				const result = parseCommandArgs(testCase.args, testCase.domainResourceTypes);

				// Check each expected property
				for (const [key, expectedValue] of Object.entries(testCase.expected)) {
					expect(result[key as keyof ParsedArgs]).toBe(expectedValue);
				}
			});
		}
	});

	/**
	 * Test matrix for the specific bug fix:
	 * Positional resource name appearing after flags
	 */
	describe("bug fix: positional name after flags", () => {
		const bugFixMatrix: TestCase[] = [
			{
				description: "simple case: resourceType --namespace value name",
				args: ["http_loadbalancer", "--namespace", "ns", "resource-name"],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					resourceType: "http_loadbalancer",
					name: "resource-name",
					namespace: "ns",
				},
			},
			{
				description: "multiple flags before name",
				args: ["waf_policy", "--namespace", "prod", "--output", "json", "my-waf"],
				domainResourceTypes: new Set(["waf_policy"]),
				expected: {
					resourceType: "waf_policy",
					name: "my-waf",
					namespace: "prod",
					outputFormat: "json",
				},
			},
			{
				description: "short flags before name",
				args: ["origin_pool", "-ns", "staging", "-o", "yaml", "backend-pool"],
				domainResourceTypes: new Set(["origin_pool"]),
				expected: {
					resourceType: "origin_pool",
					name: "backend-pool",
					namespace: "staging",
					outputFormat: "yaml",
				},
			},
			{
				description: "boolean flag followed by positional name",
				args: ["http_loadbalancer", "--spec", "my-lb"],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					resourceType: "http_loadbalancer",
					name: "my-lb",
					spec: true,
				},
			},
			{
				description: "no-color flag followed by positional name",
				args: ["http_loadbalancer", "--no-color", "my-lb"],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					resourceType: "http_loadbalancer",
					name: "my-lb",
					noColor: true,
				},
			},
		];

		for (const testCase of bugFixMatrix) {
			it(testCase.description, () => {
				const result = parseCommandArgs(testCase.args, testCase.domainResourceTypes);

				for (const [key, expectedValue] of Object.entries(testCase.expected)) {
					expect(result[key as keyof ParsedArgs]).toBe(expectedValue);
				}
			});
		}
	});

	/**
	 * Test matrix for completions, spec, help, examples, usage scenarios
	 */
	describe("completions, spec, help, examples, usage scenarios", () => {
		const scenarioMatrix: TestCase[] = [
			// Completion scenarios - what gets typed during tab completion
			{
				description: "completion: partial command with namespace",
				args: ["http_loadbalancer", "--namespace", "r-mordasiewicz"],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					resourceType: "http_loadbalancer",
					namespace: "r-mordasiewicz",
					name: undefined, // Waiting for name
				},
			},
			{
				description: "completion: just resource type",
				args: ["http_loadbalancer"],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					resourceType: "http_loadbalancer",
					name: undefined,
				},
			},

			// Spec flag scenarios
			{
				description: "spec: show command specification",
				args: ["http_loadbalancer", "--spec"],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					resourceType: "http_loadbalancer",
					spec: true,
				},
			},
			{
				description: "spec: with namespace context",
				args: ["--spec", "--namespace", "default"],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					spec: true,
					namespace: "default",
				},
			},

			// Help scenarios (typically just command names)
			{
				description: "help: resource type only for listing help",
				args: ["origin_pool"],
				domainResourceTypes: new Set(["origin_pool"]),
				expected: {
					resourceType: "origin_pool",
				},
			},

			// Example usage patterns from documentation
			{
				description: "example: get http_loadbalancer --namespace ns name",
				args: ["http_loadbalancer", "--namespace", "shared", "example-lb"],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					resourceType: "http_loadbalancer",
					name: "example-lb",
					namespace: "shared",
				},
			},
			{
				description: "example: list http_loadbalancer --namespace ns",
				args: ["http_loadbalancer", "--namespace", "production"],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					resourceType: "http_loadbalancer",
					namespace: "production",
				},
			},
			{
				description: "example: get with json output",
				args: ["waf_policy", "my-waf", "--output", "json"],
				domainResourceTypes: new Set(["waf_policy"]),
				expected: {
					resourceType: "waf_policy",
					name: "my-waf",
					outputFormat: "json",
				},
			},

			// Usage patterns
			{
				description: "usage: minimal get command",
				args: ["http_loadbalancer", "my-lb"],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					resourceType: "http_loadbalancer",
					name: "my-lb",
				},
			},
			{
				description: "usage: full get command with all options",
				args: [
					"http_loadbalancer",
					"--namespace",
					"ns",
					"--output",
					"yaml",
					"--no-color",
					"my-lb",
				],
				domainResourceTypes: new Set(["http_loadbalancer"]),
				expected: {
					resourceType: "http_loadbalancer",
					name: "my-lb",
					namespace: "ns",
					outputFormat: "yaml",
					noColor: true,
				},
			},
		];

		for (const testCase of scenarioMatrix) {
			it(testCase.description, () => {
				const result = parseCommandArgs(testCase.args, testCase.domainResourceTypes);

				for (const [key, expectedValue] of Object.entries(testCase.expected)) {
					expect(result[key as keyof ParsedArgs]).toBe(expectedValue);
				}
			});
		}
	});

	/**
	 * Validate all output format options
	 */
	describe("output format validation", () => {
		const outputFormats = ["json", "yaml", "table", "tsv", "none", "text"];

		for (const format of outputFormats) {
			it(`recognizes --output ${format}`, () => {
				const result = parseCommandArgs(
					["http_loadbalancer", "--output", format],
					new Set(["http_loadbalancer"]),
				);
				// Note: parseOutputFormat may normalize or validate the format
				expect(result.outputFormat).toBeDefined();
			});
		}
	});

	/**
	 * Validate namespace flag variations are consistent
	 */
	describe("namespace flag consistency", () => {
		const namespaceVariations = [
			{ flag: "--namespace", value: "test-ns" },
			{ flag: "--ns", value: "test-ns" },
			{ flag: "-n", value: "test-ns" },
			{ flag: "-ns", value: "test-ns" },
		];

		for (const { flag, value } of namespaceVariations) {
			it(`${flag} sets namespace correctly`, () => {
				const result = parseCommandArgs(
					["http_loadbalancer", flag, value],
					new Set(["http_loadbalancer"]),
				);
				expect(result.namespace).toBe(value);
			});
		}
	});

	/**
	 * Regression tests to prevent future breakage
	 */
	describe("regression tests", () => {
		it("does not break existing positional-before-flags syntax", () => {
			const result = parseCommandArgs(
				["http_loadbalancer", "my-lb", "--namespace", "ns"],
				new Set(["http_loadbalancer"]),
			);
			expect(result.resourceType).toBe("http_loadbalancer");
			expect(result.name).toBe("my-lb");
			expect(result.namespace).toBe("ns");
		});

		it("does not break existing --name flag syntax", () => {
			const result = parseCommandArgs(
				["http_loadbalancer", "--name", "my-lb", "--namespace", "ns"],
				new Set(["http_loadbalancer"]),
			);
			expect(result.resourceType).toBe("http_loadbalancer");
			expect(result.name).toBe("my-lb");
			expect(result.namespace).toBe("ns");
		});

		it("does not break list command (no name expected)", () => {
			const result = parseCommandArgs(
				["http_loadbalancer", "--namespace", "ns"],
				new Set(["http_loadbalancer"]),
			);
			expect(result.resourceType).toBe("http_loadbalancer");
			expect(result.namespace).toBe("ns");
			expect(result.name).toBeUndefined();
		});

		it("handles resource type without domainResourceTypes gracefully", () => {
			const result = parseCommandArgs(["some_resource", "resource-name"], undefined);
			// When no domainResourceTypes, first arg becomes name
			expect(result.name).toBe("some_resource");
		});
	});
});
