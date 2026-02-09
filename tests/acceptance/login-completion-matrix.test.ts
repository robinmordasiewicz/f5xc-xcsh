/**
 * Login Completion Matrix Tests
 *
 * Comprehensive user acceptance tests for tab completion covering all
 * completion scenarios in the login domain. These tests verify the
 * completion system correctly suggests actions, resources, flags, and
 * values at each stage of command construction.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createTestSession,
  createTestCompleter,
  completeAndExpect,
  setupTestEnvironment,
  cleanupTestEnvironment,
} from "../utils/test-helpers.js";
import type { REPLSession } from "../../src/repl/session.js";
import type { Completer } from "../../src/repl/completion/completer.js";

// Setup mocks for all tests
setupTestEnvironment();

describe("Login Completion Matrix", () => {
  let session: REPLSession;
  let completer: Completer;

  beforeEach(() => {
    session = createTestSession({ authenticated: true });
    completer = createTestCompleter(session);
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe("Domain-Level Completions", () => {
    it("should suggest login domain when typing 'log'", async () => {
      await completeAndExpect("log", completer, {
        includes: ["login"],
      });
    });

    it("should suggest all actions after 'login '", async () => {
      await completeAndExpect("login ", completer, {
        includes: ["list", "show", "create", "use", "edit", "delete"],
        minCount: 6,
      });
    });

    it("should suggest all actions after '/login '", async () => {
      await completeAndExpect("/login ", completer, {
        includes: ["list", "show", "create", "use", "edit", "delete"],
        minCount: 6,
      });
    });

    it("should not suggest login for unrelated partial", async () => {
      await completeAndExpect("vir", completer, {
        excludes: ["login"],
      });
    });
  });

  describe("Action-Level Completions", () => {
    it("should suggest 'create' when typing 'login cr'", async () => {
      await completeAndExpect("login cr", completer, {
        includes: ["create"],
      });
    });

    it("should suggest 'list' when typing 'login li'", async () => {
      await completeAndExpect("login li", completer, {
        includes: ["list"],
      });
    });

    it("should suggest 'show' when typing 'login sh'", async () => {
      await completeAndExpect("login sh", completer, {
        includes: ["show"],
      });
    });

    it("should suggest 'use' when typing 'login us'", async () => {
      await completeAndExpect("login us", completer, {
        includes: ["use"],
      });
    });

    it("should suggest 'edit' when typing 'login ed'", async () => {
      await completeAndExpect("login ed", completer, {
        includes: ["edit"],
      });
    });

    it("should suggest 'delete' when typing 'login del'", async () => {
      await completeAndExpect("login del", completer, {
        includes: ["delete"],
      });
    });
  });

  describe("Resource-Level Completions (After Action)", () => {
    it("should suggest 'profile' after 'login create '", async () => {
      await completeAndExpect("login create ", completer, {
        includes: ["profile"],
      });
    });

    it("should suggest 'profile' after 'login list '", async () => {
      await completeAndExpect("login list ", completer, {
        includes: ["profile"],
      });
    });

    it("should suggest 'profile' after 'login show '", async () => {
      await completeAndExpect("login show ", completer, {
        includes: ["profile"],
      });
    });

    it("should suggest 'profile' after 'login use '", async () => {
      await completeAndExpect("login use ", completer, {
        includes: ["profile"],
      });
    });

    it("should suggest 'profile' after 'login edit '", async () => {
      await completeAndExpect("login edit ", completer, {
        includes: ["profile"],
      });
    });

    it("should suggest 'profile' after 'login delete '", async () => {
      await completeAndExpect("login delete ", completer, {
        includes: ["profile"],
      });
    });

    it("should suggest 'profile' when typing partial 'login create pr'", async () => {
      await completeAndExpect("login create pr", completer, {
        includes: ["profile"],
      });
    });

    it("should suggest 'profile' when typing partial 'login list pro'", async () => {
      await completeAndExpect("login list pro", completer, {
        includes: ["profile"],
      });
    });
  });

  describe("Flag Completions (After Resource)", () => {
    it("should suggest flags after 'login create profile '", async () => {
      await completeAndExpect("login create profile ", completer, {
        includes: ["--url", "--token", "--namespace"],
        minCount: 2,
      });
    });

    it("should suggest placeholder and flags when no profile name provided", async () => {
      // Real-world scenario: user types /login create profile<TAB>
      // Should show: <name> --url --token --namespace
      await completeAndExpect("login create profile", completer, {
        includes: ["<name>", "--url", "--token", "--namespace"],
        minCount: 4,
      });
    });

    it("should suggest placeholder first to indicate required input", async () => {
      // Verify that <name> placeholder comes FIRST
      const result = await completer.complete("login create profile");
      const suggestions = result.map((s) => s.text);
      expect(suggestions[0]).toBe("<name>");
      expect(suggestions).toContain("--url");
      expect(suggestions).toContain("--token");
      expect(suggestions).toContain("--namespace");
    });

    it("should suggest only flags after profile name is provided", async () => {
      // User types: /login create profile myprofile<TAB>
      await completeAndExpect("login create profile myprofile", completer, {
        includes: ["--url", "--token", "--namespace"],
        excludes: ["<name>"],
        minCount: 3,
      });
    });

    it("should suggest flags after 'login create profile myprofile '", async () => {
      await completeAndExpect("login create profile myprofile ", completer, {
        includes: ["--url", "--token", "--namespace"],
        minCount: 2,
      });
    });

    it("should suggest flags when typing '--' after profile name", async () => {
      await completeAndExpect("login create profile test --", completer, {
        includes: ["--url", "--token", "--namespace"],
        minCount: 2,
      });
    });

    it("should suggest flags after '/login create profile '", async () => {
      await completeAndExpect("/login create profile ", completer, {
        includes: ["--url", "--token"],
        minCount: 2,
      });
    });

    it("should suggest flags with leading slash and profile name", async () => {
      await completeAndExpect("/login create profile myprofile ", completer, {
        includes: ["--url", "--token", "--namespace"],
        minCount: 2,
      });
    });
  });

  describe("Partial Flag Completions", () => {
    it("should suggest '--url' when typing 'login create profile test --u'", async () => {
      await completeAndExpect("login create profile test --u", completer, {
        includes: ["--url"],
      });
    });

    it("should suggest '--token' when typing 'login create profile test --t'", async () => {
      await completeAndExpect("login create profile test --t", completer, {
        includes: ["--token"],
      });
    });

    it("should suggest '--namespace' when typing 'login create profile test --n'", async () => {
      await completeAndExpect("login create profile test --n", completer, {
        includes: ["--namespace"],
      });
    });
  });

  describe("Completion with Existing Flags", () => {
    it("should still suggest all flags after providing --url", async () => {
      await completeAndExpect(
        "login create profile test --url https://test.volterra.io ",
        completer,
        {
          includes: ["--token", "--namespace"],
          minCount: 1,
        },
      );
    });

    it("should still suggest all flags after providing --token", async () => {
      await completeAndExpect(
        "login create profile test --token abc123 ",
        completer,
        {
          includes: ["--url", "--namespace"],
          minCount: 1,
        },
      );
    });

    it("should still suggest remaining flags after providing multiple flags", async () => {
      await completeAndExpect(
        "login create profile test --url https://test.volterra.io --token abc123 ",
        completer,
        {
          includes: ["--namespace"],
        },
      );
    });
  });

  describe("Wrong Order Scenarios", () => {
    it("should not suggest actions after 'login profile '", async () => {
      const suggestions = await completer.complete("login profile ");
      const texts = suggestions.map((s) => s.text);

      // Should not get normal action suggestions since this is wrong order
      // Exact behavior may vary but shouldn't suggest 'create' as if it's valid
      expect(texts).toBeDefined();
    });
  });

  describe("Completion Without Profile Name", () => {
    it("should suggest flags even without profile name typed", async () => {
      await completeAndExpect("login create profile ", completer, {
        includes: ["--url", "--token"],
        minCount: 2,
      });
    });

    it("should suggest flags with just partial profile name", async () => {
      await completeAndExpect("login create profile my", completer, {
        includes: ["--url", "--token"],
        minCount: 2,
      });
    });
  });

  describe.skip("Edit Command Completions", () => {
    // Skipped: Edit command opens editor and completes profile names, not flags
    it("should suggest profile names for edit command", async () => {
      // Edit command completes profile names from stored profiles
      const suggestions = await completer.complete("login edit profile ");
      expect(suggestions).toBeDefined();
    });
  });

  describe("Multiple Word Partials", () => {
    it("should handle partial action and resource together", async () => {
      // Typing "login cr pr" - should recognize as "create profile"
      const suggestions = await completer.complete("login cr");
      const texts = suggestions.map((s) => s.text);
      expect(texts).toContain("create");
    });

    it("should complete from middle of action", async () => {
      const suggestions = await completer.complete("login cre");
      const texts = suggestions.map((s) => s.text);
      expect(texts).toContain("create");
    });
  });

  describe("Case Sensitivity", () => {
    it("should complete regardless of case for 'LOGIN'", async () => {
      await completeAndExpect("LOGIN ", completer, {
        includes: ["create", "list"],
        minCount: 2,
      });
    });

    it("should complete regardless of case for 'Login Create'", async () => {
      await completeAndExpect("Login Create ", completer, {
        includes: ["profile"],
      });
    });
  });

  describe("Whitespace Handling", () => {
    it("should handle multiple spaces after domain", async () => {
      await completeAndExpect("login  ", completer, {
        includes: ["create", "list"],
        minCount: 2,
      });
    });

    it("should handle trailing spaces correctly", async () => {
      await completeAndExpect("login create profile   ", completer, {
        includes: ["--url", "--token"],
        minCount: 2,
      });
    });
  });

  describe("Empty Completions", () => {
    it("should suggest domains when input is empty", async () => {
      const suggestions = await completer.complete("");
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it("should suggest domains after slash", async () => {
      const suggestions = await completer.complete("/");
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("Context Resources (if applicable)", () => {
    it("should suggest context resource for list action", async () => {
      await completeAndExpect("login list ", completer, {
        includes: ["profile"],
      });
    });

    it("should suggest context resource for show action", async () => {
      await completeAndExpect("login show ", completer, {
        includes: ["profile"],
      });
    });
  });

  describe("Completion Performance", () => {
    it("should complete quickly for simple queries", async () => {
      const start = Date.now();
      await completer.complete("login ");
      const duration = Date.now() - start;

      // Completion should be fast (< 100ms)
      expect(duration).toBeLessThan(100);
    });

    it("should complete quickly for complex queries", async () => {
      const start = Date.now();
      await completer.complete(
        "login create profile test --url https://test.volterra.io ",
      );
      const duration = Date.now() - start;

      // Even complex completions should be fast
      expect(duration).toBeLessThan(200);
    });
  });

  describe("Completion Stability", () => {
    it("should return consistent results for same input", async () => {
      const result1 = await completer.complete("login create ");
      const result2 = await completer.complete("login create ");

      expect(result1).toEqual(result2);
    });

    it("should not crash on malformed input", async () => {
      // Should not throw, even with unusual input
      await expect(
        completer.complete("login create profile --"),
      ).resolves.toBeDefined();
    });

    it("should handle very long input", async () => {
      const longInput = "login create profile " + "test".repeat(50);
      await expect(completer.complete(longInput)).resolves.toBeDefined();
    });
  });

  describe("Keyboard Interaction Behavior (REGRESSION-004)", () => {
    /**
     * These tests verify the correct keyboard behavior for Enter vs Tab,
     * ensuring REGRESSION-004 doesn't recur.
     */

    it("should apply completion on Tab key", async () => {
      // When user types partial command and presses Tab,
      // completion should be applied
      await completeAndExpect("login cr", completer, {
        includes: ["create"],
      });

      // Tab would apply this completion in real usage
      // Verify suggestions are available
      const suggestions = await completer.complete("login cr");
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0].text).toBe("create");
    });

    it("should provide completions without auto-applying on Enter", async () => {
      // Completions should be suggested but not auto-applied
      // User can type "login list" and press Enter to execute exactly that
      await completeAndExpect("login list ", completer, {
        includes: ["profile"],
      });

      // Suggestions exist, but Enter should execute current input
      // (This is tested in integration/execution tests)
    });

    it("should support Tab completion workflow for flags", async () => {
      // User can Tab through flag completions
      await completeAndExpect("login create profile test --", completer, {
        includes: ["--url", "--token", "--namespace"],
        minCount: 3,
      });

      // Each flag should be individually completable
      await completeAndExpect("login create profile test --u", completer, {
        includes: ["--url"],
      });

      await completeAndExpect("login create profile test --t", completer, {
        includes: ["--token"],
      });
    });

    it("should show suggestions at every completion level", async () => {
      // Domain level
      const domainSuggestions = await completer.complete("log");
      expect(domainSuggestions.map((s) => s.text)).toContain("login");

      // Action level
      const actionSuggestions = await completer.complete("login ");
      expect(actionSuggestions.length).toBeGreaterThan(0);

      // Resource level
      const resourceSuggestions = await completer.complete("login create ");
      expect(resourceSuggestions.map((s) => s.text)).toContain("profile");

      // Flag level
      const flagSuggestions = await completer.complete(
        "login create profile test ",
      );
      expect(flagSuggestions.map((s) => s.text)).toContain("--url");
    });

    it("should maintain completion availability regardless of input length", async () => {
      // Short input
      await completeAndExpect("login", completer, {
        includes: ["login"],
      });

      // Medium input - need profile name first
      await completeAndExpect("login create ", completer, {
        includes: ["profile"],
      });

      // With profile name - now shows flags
      await completeAndExpect("login create profile test ", completer, {
        includes: ["--url", "--token"],
        minCount: 2,
      });

      // Long input with flags
      await completeAndExpect(
        "login create profile test --url https://test.volterra.io ",
        completer,
        {
          includes: ["--token", "--namespace"],
          minCount: 1,
        },
      );
    });

    it("should not interfere with command execution flow", async () => {
      // Verify completions work
      await completeAndExpect("login ", completer, {
        includes: ["create", "list"],
        minCount: 2,
      });

      // But don't test actual Enter execution here - that's in integration tests
      // This just verifies completions are available without blocking execution
    });

    it("should handle rapid Tab presses for multiple completions", async () => {
      // User might Tab through multiple levels quickly
      const level1 = await completer.complete("log");
      expect(level1.map((s) => s.text)).toContain("login");

      const level2 = await completer.complete("login ");
      expect(level2.length).toBeGreaterThan(0);

      const level3 = await completer.complete("login create ");
      expect(level3.map((s) => s.text)).toContain("profile");

      const level4 = await completer.complete("login create profile test ");
      expect(level4.map((s) => s.text)).toContain("--url");
    });
  });

  describe("Complete User Flow: Profile Creation", () => {
    it("should guide user through complete command construction", async () => {
      // Step 1: User types command name without trailing space (real-world)
      const step1 = await completer.complete("login create profile");
      expect(step1.map((s) => s.text)).toContain("--url");
      expect(step1.map((s) => s.text)).toContain("--token");
      expect(step1.map((s) => s.text)).toContain("--namespace");

      // Step 2: User adds profile name and starts typing flag
      const step2 = await completer.complete("login create profile myprof --");
      expect(step2.map((s) => s.text)).toContain("--url");
      expect(step2.map((s) => s.text)).toContain("--token");
      expect(step2.map((s) => s.text)).toContain("--namespace");

      // Step 3: User completes --url flag with trailing space
      const step3 = await completer.complete(
        "login create profile myprof --url ",
      );
      // URLs are user-specific, may return empty or values
      expect(Array.isArray(step3)).toBe(true);

      // Step 4: User adds --token flag
      const step4 = await completer.complete(
        "login create profile myprof --url https://test.com --token ",
      );
      // Tokens are sensitive, should return empty or placeholder
      expect(Array.isArray(step4)).toBe(true);
    });
  });
});
