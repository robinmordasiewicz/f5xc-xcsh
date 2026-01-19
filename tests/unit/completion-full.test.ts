import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { Completer } from "../../src/repl/completion/completer.js";
import type { REPLSession } from "../../src/repl/session.js";
import { getConflictsForFlag } from "../../src/repl/completion/creation-flags.js";

describe("Completer with trailing spaces", () => {
	let completer: Completer;

	beforeEach(() => {
		completer = new Completer();
	});

	it("should return list action for '/login ' (trailing space)", async () => {
		const suggestions = await completer.complete("/login ");
		const texts = suggestions.map((s) => s.text);
		expect(texts).toContain("list");
		expect(texts).toContain("show");
		expect(texts).toContain("create");
		expect(texts).toContain("use");
		expect(texts).toContain("edit");
		expect(texts).toContain("delete");
	});

	it("should return list action for '/login l' (partial match)", async () => {
		const suggestions = await completer.complete("/login l");
		const texts = suggestions.map((s) => s.text);
		expect(texts).toContain("list");
		expect(texts).toHaveLength(1); // Only list matches 'l'
	});

	it("should return suggestions for '/login list ' (trailing space)", async () => {
		const suggestions = await completer.complete("/login list ");
		// Verify we get some suggestions for the list action resources
		expect(suggestions.length).toBeGreaterThan(0);
	});
});

describe("Completer with domain name prefix", () => {
	let completer: Completer;

	beforeEach(() => {
		completer = new Completer();
	});

	it("should show domain suggestions when typing '/ai' (still typing domain)", async () => {
		// When typing "/ai" without a trailing space, should show domains matching "ai"
		const suggestions = await completer.complete("/ai");
		const texts = suggestions.map((s) => s.text);
		// Should show ai_services as a suggestion (filtered by "ai" prefix)
		expect(texts).toContain("ai_services");
	});

	it("should show domain-specific completions for '/ai_services ' (with trailing space)", async () => {
		// When typing "/ai_services " WITH trailing space, should delegate to ai_services domain completions
		const suggestions = await completer.complete("/ai_services ");
		const texts = suggestions.map((s) => s.text);
		// Should show ai_services commands like query, chat, etc.
		expect(texts).toContain("query");
	});
});

describe("Login domain action group completion (bug fix)", () => {
	let completer: Completer;

	beforeEach(() => {
		completer = new Completer();
	});

	it("should show action groups for '/login ' (trailing space)", async () => {
		const suggestions = await completer.complete("/login ");
		const texts = suggestions.map((s) => s.text);
		expect(texts).toContain("use");
		expect(texts).toContain("list");
		expect(texts).toContain("show");
		expect(texts).toContain("create");
		expect(texts).toContain("edit");
		expect(texts).toContain("delete");
	});

	it("should show filtered action groups for '/login u' (partial match)", async () => {
		const suggestions = await completer.complete("/login u");
		const texts = suggestions.map((s) => s.text);
		expect(texts).toContain("use");
		// Should not show other actions that don't start with 'u'
		expect(texts).not.toContain("list");
		expect(texts).not.toContain("show");
	});

	it("should show resources under use action for '/login use ' (trailing space)", async () => {
		const suggestions = await completer.complete("/login use ");
		const texts = suggestions.map((s) => s.text);
		// Should show resources under the "use" action group
		expect(texts).toContain("profile");
		expect(texts).toContain("context");
		// Should NOT show command-level suggestions like "set"
		expect(texts).not.toContain("set");
		// Should NOT show action-level suggestions
		expect(texts).not.toContain("list");
		expect(texts).not.toContain("show");
	});

	it("should show filtered resources for '/login use p' (partial match)", async () => {
		const suggestions = await completer.complete("/login use p");
		const texts = suggestions.map((s) => s.text);
		expect(texts).toContain("profile");
		expect(texts).not.toContain("context");
	});

	it("should show resources under list action for '/login list ' (trailing space)", async () => {
		const suggestions = await completer.complete("/login list ");
		const texts = suggestions.map((s) => s.text);
		expect(texts).toContain("profile");
		expect(texts).toContain("context");
	});

	it("should show resources under show action for '/login show ' (trailing space)", async () => {
		const suggestions = await completer.complete("/login show ");
		const texts = suggestions.map((s) => s.text);
		expect(texts).toContain("profile");
		expect(texts).toContain("context");
	});

	it("should NOT cross-contaminate action contexts for '/login use' (no space)", async () => {
		// When user types "/login use" without trailing space, they're still typing
		// Should show "use" as a completion option, not drill into it yet
		const suggestions = await completer.complete("/login use");
		const texts = suggestions.map((s) => s.text);
		// Should show "use" as completion
		expect(texts).toContain("use");
	});
});

describe("--name flag completion for create vs get/delete actions", () => {
	let completer: Completer;
	let mockSession: Partial<REPLSession>;

	beforeEach(() => {
		completer = new Completer();

		// Create a mock session with the necessary methods
		mockSession = {
			getNamespace: vi.fn().mockReturnValue("default"),
			getContextPath: vi.fn().mockReturnValue({ domain: null, action: null }),
			getAPIClient: vi.fn().mockReturnValue(null),
		};

		completer.setSession(mockSession as REPLSession);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("shows context prompt when creating resource with existing resources", async () => {
		// Mock completeResourceName to return existing resource names
		const existingNames = [
			{ text: "hc-prod", description: "Healthcheck", category: "resource-name" as const },
			{ text: "hc-staging", description: "Healthcheck", category: "resource-name" as const },
		];
		vi.spyOn(completer, "completeResourceName").mockResolvedValue(existingNames);

		const suggestions = await completer.complete("/virtual create healthcheck --name ");

		// Should return header + each existing name as separate context items
		expect(suggestions).toHaveLength(3); // header + 2 names
		expect(suggestions.every((s) => s.category === "context")).toBe(true);
		expect(suggestions.every((s) => s.text === "")).toBe(true);
		expect(suggestions[0].description).toContain("Enter a unique name");
		expect(suggestions[1].description).toContain("hc-prod");
		expect(suggestions[2].description).toContain("hc-staging");
	});

	it("shows simple prompt when creating resource with no existing resources", async () => {
		// Mock completeResourceName to return empty array (no existing resources)
		vi.spyOn(completer, "completeResourceName").mockResolvedValue([]);

		const suggestions = await completer.complete("/virtual create healthcheck --name ");

		// Should return a simple context prompt
		expect(suggestions).toHaveLength(1);
		expect(suggestions[0].category).toBe("context");
		expect(suggestions[0].text).toBe("");
		expect(suggestions[0].description).toBe("Enter a name for the new resource");
	});

	it("shows selectable names for get action with --name flag", async () => {
		// Mock completeResourceName to return existing resource names
		const existingNames = [
			{ text: "hc-prod", description: "Healthcheck", category: "resource-name" as const },
			{ text: "hc-staging", description: "Healthcheck", category: "resource-name" as const },
		];
		vi.spyOn(completer, "completeResourceName").mockResolvedValue(existingNames);

		const suggestions = await completer.complete("/virtual get healthcheck --name ");

		// Should return selectable names, not context
		expect(suggestions).toHaveLength(2);
		expect(suggestions.map((s) => s.text)).toContain("hc-prod");
		expect(suggestions.map((s) => s.text)).toContain("hc-staging");
		expect(suggestions[0].category).toBe("resource-name");
	});

	it("shows selectable names for delete action with --name flag", async () => {
		// Mock completeResourceName to return existing resource names
		const existingNames = [
			{ text: "hc-prod", description: "Healthcheck", category: "resource-name" as const },
		];
		vi.spyOn(completer, "completeResourceName").mockResolvedValue(existingNames);

		const suggestions = await completer.complete("/virtual delete healthcheck --name ");

		// Should return selectable names for delete
		expect(suggestions).toHaveLength(1);
		expect(suggestions[0].text).toBe("hc-prod");
		expect(suggestions[0].category).toBe("resource-name");
	});

	it("shows all taken names as individual list items", async () => {
		// Mock completeResourceName to return many existing resource names
		const existingNames = [
			{ text: "healthcheck-very-long-name-1", description: "Healthcheck", category: "resource-name" as const },
			{ text: "healthcheck-very-long-name-2", description: "Healthcheck", category: "resource-name" as const },
			{ text: "healthcheck-very-long-name-3", description: "Healthcheck", category: "resource-name" as const },
		];
		vi.spyOn(completer, "completeResourceName").mockResolvedValue(existingNames);

		const suggestions = await completer.complete("/virtual create healthcheck --name ");

		// Should show header + each name on its own line
		expect(suggestions).toHaveLength(4); // header + 3 names
		expect(suggestions.every((s) => s.category === "context")).toBe(true);
		expect(suggestions[0].description).toContain("Enter a unique name");
		expect(suggestions[1].description).toContain("healthcheck-very-long-name-1");
		expect(suggestions[2].description).toContain("healthcheck-very-long-name-2");
		expect(suggestions[3].description).toContain("healthcheck-very-long-name-3");
	});

	it("treats apply action same as create action", async () => {
		// Mock completeResourceName to return existing resource names
		const existingNames = [
			{ text: "hc-prod", description: "Healthcheck", category: "resource-name" as const },
		];
		vi.spyOn(completer, "completeResourceName").mockResolvedValue(existingNames);

		const suggestions = await completer.complete("/virtual apply healthcheck --name ");

		// Apply should behave like create - show context, not selectable names
		expect(suggestions).toHaveLength(2); // header + 1 name
		expect(suggestions.every((s) => s.category === "context")).toBe(true);
		expect(suggestions[0].description).toContain("Enter a unique name");
		expect(suggestions[1].description).toContain("hc-prod");
	});
});

describe("Conflict filtering in completion suggestions (spec-driven)", () => {
	let completer: Completer;
	let mockSession: Partial<REPLSession>;

	beforeEach(() => {
		completer = new Completer();

		// Create a mock session with the necessary methods
		mockSession = {
			getNamespace: vi.fn().mockReturnValue("default"),
			getContextPath: vi.fn().mockReturnValue({ domain: null, action: null }),
			getAPIClient: vi.fn().mockReturnValue(null),
		};

		completer.setSession(mockSession as REPLSession);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("getConflictsForFlag helper", () => {
		it("should return conflicts from generated data for --host-header", () => {
			const conflicts = getConflictsForFlag("--host-header", "healthcheck");
			expect(conflicts).toContain("--use-origin-server-name");
		});

		it("should return conflicts from generated data for --use-origin-server-name", () => {
			const conflicts = getConflictsForFlag("--use-origin-server-name", "healthcheck");
			expect(conflicts).toContain("--host-header");
		});

		it("should return static conflicts from flag definitions", () => {
			// The static conflictsWith in healthcheck flags should be included
			const conflicts = getConflictsForFlag("--host-header", "healthcheck");
			// Both static (from flag definition) and generated (from spec) should be merged
			expect(conflicts).toContain("--use-origin-server-name");
		});

		it("should return empty array for flag with no conflicts", () => {
			// Use a non-existent flag that won't have conflicts in the spec
			const conflicts = getConflictsForFlag("--nonexistent-flag-12345", "healthcheck");
			expect(conflicts).toEqual([]);
		});
	});

	describe("completion filtering with conflicts", () => {
		it("should hide --host-header when --use-origin-server-name is used", () => {
			const suggestions = completer.getCreationFlagSuggestions(
				"healthcheck",
				["create", "healthcheck", "--type", "http", "--use-origin-server-name"],
			);
			const flagNames = suggestions.map((s) => s.text);

			// --host-header should NOT be in suggestions (conflicts)
			expect(flagNames).not.toContain("--host-header");
			// Other HTTP flags should still be available
			expect(flagNames).toContain("--path");
		});

		it("should hide --use-origin-server-name when --host-header is used", () => {
			const suggestions = completer.getCreationFlagSuggestions(
				"healthcheck",
				["create", "healthcheck", "--type", "http", "--host-header", "example.com"],
			);
			const flagNames = suggestions.map((s) => s.text);

			// --use-origin-server-name should NOT be in suggestions (conflicts)
			expect(flagNames).not.toContain("--use-origin-server-name");
			// Other HTTP flags should still be available
			expect(flagNames).toContain("--path");
		});

		it("should show both --host-header and --use-origin-server-name when neither is used", () => {
			const suggestions = completer.getCreationFlagSuggestions(
				"healthcheck",
				["create", "healthcheck", "--type", "http"],
			);
			const flagNames = suggestions.map((s) => s.text);

			// Both should be available when neither is used
			expect(flagNames).toContain("--host-header");
			expect(flagNames).toContain("--use-origin-server-name");
		});

		it("should handle multiple conflicts correctly", () => {
			// When --host-header is used, only its conflicts should be hidden
			const suggestions = completer.getCreationFlagSuggestions(
				"healthcheck",
				["create", "healthcheck", "--type", "http", "--host-header", "test.com"],
			);
			const flagNames = suggestions.map((s) => s.text);

			// Only the conflicting flag should be hidden
			expect(flagNames).not.toContain("--use-origin-server-name");
			// Non-conflicting flags should remain
			expect(flagNames).toContain("--use-http2");
			expect(flagNames).toContain("--expected-status-codes");
		});

		it("should not filter flags without conflicts", () => {
			const suggestions = completer.getCreationFlagSuggestions(
				"healthcheck",
				["create", "healthcheck", "--type", "http", "--path", "/health"],
			);
			const flagNames = suggestions.map((s) => s.text);

			// Flags without conflicts should still be available
			expect(flagNames).toContain("--host-header");
			expect(flagNames).toContain("--use-origin-server-name");
			expect(flagNames).toContain("--use-http2");
		});
	});
});
