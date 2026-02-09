/**
 * Manual completion testing - simulates user TAB completion scenarios
 * This test verifies the completion behavior as a user would experience it
 */

import { describe, it, expect, beforeEach } from "vitest";
import { Completer } from "../../src/repl/completion/completer.js";

describe("Manual Completion Testing (User Experience)", () => {
  let completer: Completer;

  beforeEach(() => {
    completer = new Completer();
  });

  describe("Login domain action completion", () => {
    it("✓ /login <TAB> → Shows all action groups", async () => {
      const suggestions = await completer.complete("/login ");
      const texts = suggestions.map((s) => s.text);

      console.log("\n📝 Test: /login <TAB>");
      console.log(`   Input: "/login "`);
      console.log(`   Result: [${texts.join(", ")}]`);

      expect(texts).toContain("use");
      expect(texts).toContain("list");
      expect(texts).toContain("show");
      expect(texts).toContain("create");
      expect(texts).toContain("edit");
      expect(texts).toContain("delete");
      expect(texts).toContain("banner");
    });

    it("✓ /login u<TAB> → Shows filtered: use", async () => {
      const suggestions = await completer.complete("/login u");
      const texts = suggestions.map((s) => s.text);

      console.log("\n📝 Test: /login u<TAB>");
      console.log(`   Input: "/login u"`);
      console.log(`   Result: [${texts.join(", ")}]`);

      expect(texts).toContain("use");
      expect(texts).toHaveLength(1);
    });

    it("✓ /login use<TAB> (no space) → Shows: use (still typing)", async () => {
      const suggestions = await completer.complete("/login use");
      const texts = suggestions.map((s) => s.text);

      console.log("\n📝 Test: /login use<TAB> (no space)");
      console.log(`   Input: "/login use"`);
      console.log(`   Result: [${texts.join(", ")}]`);

      expect(texts).toContain("use");
    });

    it("✓ /login use <TAB> (WITH space) → Shows: profile, context", async () => {
      const suggestions = await completer.complete("/login use ");
      const texts = suggestions.map((s) => s.text);

      console.log("\n📝 Test: /login use <TAB> (WITH space)");
      console.log(`   Input: "/login use "`);
      console.log(`   Result: [${texts.join(", ")}]`);
      console.log(`   ✓ Expected: profile, context`);
      console.log(`   ✗ NOT expected: set, list, show`);

      // Should show resources
      expect(texts).toContain("profile");
      expect(texts).toContain("context");

      // Should NOT show cross-contaminated values
      expect(texts).not.toContain("set"); // "set" is context's command, not resource name
      expect(texts).not.toContain("list"); // No action-level suggestions
      expect(texts).not.toContain("show");
    });

    it("✓ /login use p<TAB> → Shows filtered: profile", async () => {
      const suggestions = await completer.complete("/login use p");
      const texts = suggestions.map((s) => s.text);

      console.log("\n📝 Test: /login use p<TAB>");
      console.log(`   Input: "/login use p"`);
      console.log(`   Result: [${texts.join(", ")}]`);

      expect(texts).toContain("profile");
      expect(texts).not.toContain("context");
    });

    it("✓ /login list <TAB> → Shows: profile, context", async () => {
      const suggestions = await completer.complete("/login list ");
      const texts = suggestions.map((s) => s.text);

      console.log("\n📝 Test: /login list <TAB>");
      console.log(`   Input: "/login list "`);
      console.log(`   Result: [${texts.join(", ")}]`);

      expect(texts).toContain("profile");
      expect(texts).toContain("context");
    });

    it("✓ /login show <TAB> → Shows: profile, context", async () => {
      const suggestions = await completer.complete("/login show ");
      const texts = suggestions.map((s) => s.text);

      console.log("\n📝 Test: /login show <TAB>");
      console.log(`   Input: "/login show "`);
      console.log(`   Result: [${texts.join(", ")}]`);

      expect(texts).toContain("profile");
      expect(texts).toContain("context");
    });

    it("✓ /login create <TAB> → Shows: profile", async () => {
      const suggestions = await completer.complete("/login create ");
      const texts = suggestions.map((s) => s.text);

      console.log("\n📝 Test: /login create <TAB>");
      console.log(`   Input: "/login create "`);
      console.log(`   Result: [${texts.join(", ")}]`);

      expect(texts).toContain("profile");
    });

    it("✓ /login edit <TAB> → Shows: profile", async () => {
      const suggestions = await completer.complete("/login edit ");
      const texts = suggestions.map((s) => s.text);

      console.log("\n📝 Test: /login edit <TAB>");
      console.log(`   Input: "/login edit "`);
      console.log(`   Result: [${texts.join(", ")}]`);

      expect(texts).toContain("profile");
    });

    it("✓ /login delete <TAB> → Shows: profile", async () => {
      const suggestions = await completer.complete("/login delete ");
      const texts = suggestions.map((s) => s.text);

      console.log("\n📝 Test: /login delete <TAB>");
      console.log(`   Input: "/login delete "`);
      console.log(`   Result: [${texts.join(", ")}]`);

      expect(texts).toContain("profile");
    });
  });
});
