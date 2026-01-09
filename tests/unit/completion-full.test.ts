import { describe, it, expect, beforeEach } from "vitest";
import { Completer } from "../../src/repl/completion/completer.js";

describe("Completer with trailing spaces", () => {
	let completer: Completer;

	beforeEach(() => {
		completer = new Completer();
	});

	it("should return profile subcommand for '/login ' (trailing space)", async () => {
		const suggestions = await completer.complete("/login ");
		const texts = suggestions.map((s) => s.text);
		expect(texts).toContain("profile");
	});

	it("should return profile subcommand for '/login p' (partial match)", async () => {
		const suggestions = await completer.complete("/login p");
		const texts = suggestions.map((s) => s.text);
		expect(texts).toContain("profile");
		expect(texts).toHaveLength(1); // Only profile matches 'p'
	});

	it("should return profile commands for '/login profile ' (trailing space)", async () => {
		const suggestions = await completer.complete("/login profile ");
		const texts = suggestions.map((s) => s.text);
		expect(texts).toContain("list");
		expect(texts).toContain("show");
		expect(texts).toContain("create");
		expect(texts).toContain("use");
		expect(texts).toContain("delete");
	});
});

describe("Completer with domain alias prefix", () => {
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

	it("should show domain-specific completions for '/ai ' (with trailing space)", async () => {
		// When typing "/ai " WITH trailing space, should delegate to ai_services domain completions
		const suggestions = await completer.complete("/ai ");
		const texts = suggestions.map((s) => s.text);
		// Should show ai_services commands like query, chat, etc.
		expect(texts).toContain("query");
	});
});
