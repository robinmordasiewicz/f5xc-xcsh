/**
 * Flag Deduplication Tests
 *
 * Tests for filtering already-used flags from completion suggestions.
 * When a flag is already present in the command, it should not appear
 * in the completion suggestions again.
 *
 * Bug: `login create profile nferreira --url https://... <tab>` was showing --url
 * Fix: --url should be excluded since it's already in the command
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
	createTestSession,
	createTestCompleter,
	setupTestEnvironment,
	cleanupTestEnvironment,
} from "../utils/test-helpers.js";
import type { REPLSession } from "../../src/repl/session.js";
import type { Completer } from "../../src/repl/completion/completer.js";
import {
	extractUsedFlags,
	filterUsedFlags,
	filterUsedFlagsFromStrings,
} from "../../src/repl/completion/flag-utils.js";
import { generateSmartCompletions } from "../../src/utils/usage-parser.js";

// Setup mocks for all tests
setupTestEnvironment();

describe("Flag Deduplication - Utility Functions", () => {
	describe("extractUsedFlags", () => {
		it("extracts single flag", () => {
			const used = extractUsedFlags(["--url", "https://example.com"]);
			expect(used.has("--url")).toBe(true);
		});

		it("extracts single flag and its aliases", () => {
			const used = extractUsedFlags(["--url", "https://example.com"]);
			expect(used.has("--url")).toBe(true);
			expect(used.has("-u")).toBe(true);
		});

		it("extracts short flag and its long-form alias", () => {
			const used = extractUsedFlags(["-ns", "default"]);
			expect(used.has("-ns")).toBe(true);
			expect(used.has("--namespace")).toBe(true);
		});

		it("handles --flag=value syntax", () => {
			const used = extractUsedFlags(["--output=json"]);
			expect(used.has("--output")).toBe(true);
			expect(used.has("-o")).toBe(true);
		});

		it("extracts multiple flags", () => {
			const used = extractUsedFlags([
				"--url",
				"https://...",
				"--token",
				"abc123",
			]);
			expect(used.has("--url")).toBe(true);
			expect(used.has("-u")).toBe(true);
			expect(used.has("--token")).toBe(true);
			// Note: --token no longer has -t as alias (now used by --type for healthcheck creation)
		});

		it("ignores non-flag arguments", () => {
			const used = extractUsedFlags([
				"myprofile",
				"--url",
				"https://...",
			]);
			expect(used.has("myprofile")).toBe(false);
			expect(used.has("--url")).toBe(true);
		});

		it("handles empty args array", () => {
			const used = extractUsedFlags([]);
			expect(used.size).toBe(0);
		});

		it("handles flags without aliases", () => {
			const used = extractUsedFlags(["--limit", "10"]);
			expect(used.has("--limit")).toBe(true);
		});
	});

	describe("filterUsedFlags", () => {
		it("removes used flags from suggestions", () => {
			const suggestions = [
				{ text: "--url", description: "URL" },
				{ text: "--token", description: "Token" },
				{ text: "--namespace", description: "Namespace" },
			];
			const used = new Set(["--url", "-u"]);
			const filtered = filterUsedFlags(suggestions, used);

			expect(filtered.map((s) => s.text)).not.toContain("--url");
			expect(filtered.map((s) => s.text)).toContain("--token");
			expect(filtered.map((s) => s.text)).toContain("--namespace");
		});

		it("removes all alias forms", () => {
			const suggestions = [
				{ text: "--namespace", description: "Namespace" },
				{ text: "-ns", description: "Namespace (short)" },
				{ text: "--output", description: "Output" },
			];
			const used = new Set(["--namespace", "-ns"]);
			const filtered = filterUsedFlags(suggestions, used);

			expect(filtered.map((s) => s.text)).not.toContain("--namespace");
			expect(filtered.map((s) => s.text)).not.toContain("-ns");
			expect(filtered.map((s) => s.text)).toContain("--output");
		});

		it("preserves all suggestions when nothing is used", () => {
			const suggestions = [
				{ text: "--url", description: "URL" },
				{ text: "--token", description: "Token" },
			];
			const used = new Set<string>();
			const filtered = filterUsedFlags(suggestions, used);

			expect(filtered.length).toBe(2);
		});
	});

	describe("filterUsedFlagsFromStrings", () => {
		it("filters string array of flags", () => {
			const flags = ["--url", "--token", "--namespace"];
			const args = ["--url", "https://example.com"];
			const filtered = filterUsedFlagsFromStrings(flags, args);

			expect(filtered).not.toContain("--url");
			expect(filtered).toContain("--token");
			expect(filtered).toContain("--namespace");
		});

		it("handles alias expansion", () => {
			const flags = ["--namespace", "-ns", "--output", "-o"];
			const args = ["-ns", "default"];
			const filtered = filterUsedFlagsFromStrings(flags, args);

			expect(filtered).not.toContain("--namespace");
			expect(filtered).not.toContain("-ns");
			expect(filtered).toContain("--output");
			expect(filtered).toContain("-o");
		});
	});
});

describe("Flag Deduplication - generateSmartCompletions", () => {
	const usage = "<name> --url <api-url> --token <api-token> [--namespace <ns>]";

	it("filters used flags when positional args are satisfied", () => {
		const result = generateSmartCompletions(
			usage,
			["myprofile", "--url", "https://example.com"],
			["--url", "--token", "--namespace"],
		);

		expect(result).not.toContain("--url");
		expect(result).toContain("--token");
		expect(result).toContain("--namespace");
	});

	it("filters used flags when providing flags before positional args", () => {
		// Note: When flags are provided before positional args, the flag value
		// (e.g., "https://example.com") gets counted as a positional argument
		// in the current implementation. This test verifies the flag filtering
		// still works correctly in this case.
		const result = generateSmartCompletions(
			usage,
			["--url", "https://example.com"],
			["--url", "--token", "--namespace"],
		);

		// --url should be filtered out (already used)
		expect(result).not.toContain("--url");
		// Other flags should be present
		expect(result).toContain("--token");
		expect(result).toContain("--namespace");
	});

	it("filters multiple used flags", () => {
		const result = generateSmartCompletions(
			usage,
			["myprofile", "--url", "https://...", "--token", "abc123"],
			["--url", "--token", "--namespace"],
		);

		expect(result).not.toContain("--url");
		expect(result).not.toContain("--token");
		expect(result).toContain("--namespace");
	});

	it("handles --flag=value syntax", () => {
		const result = generateSmartCompletions(
			usage,
			["myprofile", "--url=https://example.com"],
			["--url", "--token", "--namespace"],
		);

		expect(result).not.toContain("--url");
		expect(result).toContain("--token");
	});

	it("returns empty flags when all are used", () => {
		const result = generateSmartCompletions(
			usage,
			["myprofile", "--url", "a", "--token", "b", "--namespace", "c"],
			["--url", "--token", "--namespace"],
		);

		// All flags used, only thing left might be nothing
		expect(result).not.toContain("--url");
		expect(result).not.toContain("--token");
		expect(result).not.toContain("--namespace");
	});
});

describe("Flag Deduplication - Completer Integration", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("API Domain Flags", () => {
		it("CRITICAL: excludes --namespace after it is used", async () => {
			const suggestions = await completer.complete(
				"/virtual list --namespace default ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("--namespace");
			expect(result).not.toContain("-ns");
			// Other flags should still be present
			expect(result).toContain("--output");
		});

		it("CRITICAL: excludes -ns when --namespace used (alias bidirection)", async () => {
			const suggestions = await completer.complete(
				"/virtual list --namespace default ",
			);
			const result = suggestions.map((s) => s.text);

			// Both long and short forms should be excluded
			expect(result).not.toContain("--namespace");
			expect(result).not.toContain("-ns");
		});

		it("excludes --output when -o is used", async () => {
			const suggestions = await completer.complete(
				"/virtual list -o json ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("--output");
			expect(result).not.toContain("-o");
			expect(result).toContain("--namespace");
		});

		it("excludes multiple used flags", async () => {
			const suggestions = await completer.complete(
				"/virtual list --namespace default --output json ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("--namespace");
			expect(result).not.toContain("-ns");
			expect(result).not.toContain("--output");
			expect(result).not.toContain("-o");
		});

		it("handles --flag=value syntax", async () => {
			const suggestions = await completer.complete(
				"/virtual list --output=json ",
			);
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("--output");
			expect(result).not.toContain("-o");
			expect(result).toContain("--namespace");
		});
	});

	describe("Flag Completion While Typing", () => {
		it("excludes used flags when completing flag prefix", async () => {
			const suggestions = await completer.complete(
				"/virtual list --namespace default --o",
			);
			const result = suggestions.map((s) => s.text);

			// Should suggest --output since it matches --o prefix
			expect(result).toContain("--output");
			// But --namespace should be excluded (already used)
			expect(result).not.toContain("--namespace");
		});

		it("excludes used flags even when typing new flag", async () => {
			const suggestions = await completer.complete(
				"/virtual list --output json --n",
			);
			const result = suggestions.map((s) => s.text);

			// Should suggest --namespace and --name since they match --n
			expect(result).toContain("--namespace");
			expect(result).toContain("--name");
			// But --output should be excluded
			expect(result).not.toContain("--output");
		});
	});

	describe("Resource Context with Flags", () => {
		it("excludes used flags when showing resource types + flags", async () => {
			const suggestions = await completer.complete(
				"/virtual list --namespace default ",
			);
			const result = suggestions.map((s) => s.text);

			// Should have resource types
			expect(result).toContain("http_loadbalancer");
			// --namespace should be excluded
			expect(result).not.toContain("--namespace");
			// Other flags should be present
			expect(result).toContain("--output");
		});
	});

	describe("Edge Cases", () => {
		it("handles empty command correctly", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			// All flags should be available
			expect(result).toContain("--namespace");
			expect(result).toContain("--output");
			expect(result).toContain("--name");
		});

		it("preserves resource types even when flags are filtered", async () => {
			const suggestions = await completer.complete(
				"/virtual list --namespace default --output json ",
			);
			const result = suggestions.map((s) => s.text);

			// Resource types should still be present
			expect(result).toContain("http_loadbalancer");
			// Used flags should be excluded
			expect(result).not.toContain("--namespace");
			expect(result).not.toContain("--output");
		});

		it("handles action-specific flags correctly", async () => {
			const suggestions = await completer.complete(
				"/virtual list --limit 10 ",
			);
			const result = suggestions.map((s) => s.text);

			// --limit is action-specific for list, should be excluded
			expect(result).not.toContain("--limit");
			// Other flags should be available
			expect(result).toContain("--namespace");
		});
	});
});

describe("Flag Deduplication - Regression Prevention", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	it("REGRESSION: flag completion must not show already-used flags", async () => {
		// This is the core bug: typing --n after --namespace is used should not show --namespace
		const suggestions = await completer.complete(
			"/virtual list --namespace default --",
		);
		const result = suggestions.map((s) => s.text);

		expect(result).not.toContain("--namespace");
		expect(result).not.toContain("-ns");
	});

	it("REGRESSION: alias bidirectionality must work", async () => {
		// Using short form should exclude long form
		const suggestions1 = await completer.complete(
			"/virtual list -ns default --",
		);
		const result1 = suggestions1.map((s) => s.text);
		expect(result1).not.toContain("--namespace");
		expect(result1).not.toContain("-ns");

		// Using long form should exclude short form
		const suggestions2 = await completer.complete(
			"/virtual list --namespace default --",
		);
		const result2 = suggestions2.map((s) => s.text);
		expect(result2).not.toContain("--namespace");
		expect(result2).not.toContain("-ns");
	});

	it("REGRESSION: --flag=value syntax must be handled", async () => {
		const suggestions = await completer.complete(
			"/virtual list --namespace=default --",
		);
		const result = suggestions.map((s) => s.text);

		expect(result).not.toContain("--namespace");
		expect(result).not.toContain("-ns");
	});

	it("REGRESSION: multiple flags must all be excluded", async () => {
		const suggestions = await completer.complete(
			"/virtual list --namespace default --output json --limit 10 --",
		);
		const result = suggestions.map((s) => s.text);

		expect(result).not.toContain("--namespace");
		expect(result).not.toContain("--output");
		expect(result).not.toContain("--limit");
	});
});
