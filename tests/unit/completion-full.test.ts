import { describe, it, expect, beforeEach } from "vitest";
import { Completer } from "../../src/repl/completion/completer.js";

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
