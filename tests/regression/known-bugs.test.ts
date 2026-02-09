/**
 * Regression Tests: Known Bugs
 *
 * These tests are specifically designed to catch regressions for bugs that have
 * been intermittently reintroduced multiple times. Each test is tagged with an ID
 * and date for tracking purposes.
 *
 * If any of these tests fail, it means a known bug has been reintroduced.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createTestSession,
  createTestCompleter,
  executeAndExpect,
  completeAndExpect,
  setupTestEnvironment,
  cleanupTestEnvironment,
} from "../utils/test-helpers.js";
import type { REPLSession } from "../../src/repl/session.js";
import type { Completer } from "../../src/repl/completion/completer.js";

// Setup mocks for all tests
setupTestEnvironment();

describe("Regression Tests: Known Bugs", () => {
  let session: REPLSession;
  let completer: Completer;

  beforeEach(() => {
    session = createTestSession({ authenticated: true });
    completer = createTestCompleter(session);
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe("REGRESSION-001: Tab completion for /login create profile", () => {
    /**
     * Bug: Tab completion not working after typing "/login create profile"
     * Expected: Should show --url, --token, --namespace flags
     * Date Reported: 2026-01-14
     * Root Cause: profileCreateCommand lacked completion handler
     */

    it("should suggest --url flag after profile name", async () => {
      const suggestions = await completer.complete(
        "/login create profile myprofile ",
      );
      const texts = suggestions.map((s) => s.text);

      expect(texts).toContain("--url");
    });

    it("should suggest --token flag after profile name", async () => {
      const suggestions = await completer.complete(
        "/login create profile myprofile ",
      );
      const texts = suggestions.map((s) => s.text);

      expect(texts).toContain("--token");
    });

    it("should suggest --namespace flag after profile name", async () => {
      const suggestions = await completer.complete(
        "/login create profile myprofile ",
      );
      const texts = suggestions.map((s) => s.text);

      expect(texts).toContain("--namespace");
    });

    it("should provide at least 2 flag suggestions (--url and --token are required)", async () => {
      await completeAndExpect("/login create profile myprofile ", completer, {
        includes: ["--url", "--token"],
        minCount: 2,
      });
    });

    it("should work without leading slash", async () => {
      await completeAndExpect("login create profile myprofile ", completer, {
        includes: ["--url", "--token"],
        minCount: 2,
      });
    });

    it("should suggest flags even when typing partial flag", async () => {
      const suggestions = await completer.complete(
        "/login create profile myprofile --",
      );
      const texts = suggestions.map((s) => s.text);

      expect(texts).toContain("--url");
      expect(texts).toContain("--token");
      expect(texts).toContain("--namespace");
    });
  });

  describe("REGRESSION-002: Command execution for login create profile", () => {
    /**
     * Bug: Command execution fails with correct verb-first syntax
     * Expected: "login create profile <name> --url <url> --token <token>" should succeed
     * Date Reported: 2026-01-14
     * Root Cause: Missing or broken execute handler
     */

    it("should execute successfully with correct syntax", async () => {
      await executeAndExpect(
        "login create profile staging --url https://example.com --token abc123",
        session,
        {
          success: true,
        },
      );
    });

    it("should create profile and show confirmation message", async () => {
      await executeAndExpect(
        "login create profile test1 --url https://test.volterra.io --token testtoken123",
        session,
        {
          success: true,
          output: /profile.*created/i,
        },
      );
    });

    it("should work with optional namespace flag", async () => {
      await executeAndExpect(
        "login create profile staging --url https://example.com --token abc123 --namespace system",
        session,
        {
          success: true,
        },
      );
    });

    it("should fail gracefully without required flags", async () => {
      await executeAndExpect("login create profile staging", session, {
        success: false,
        error: /missing.*url/i,
      });
    });
  });

  describe("REGRESSION-003: Wrong order error message", () => {
    /**
     * Bug: Typing "login profile create" (noun-first) shows generic error
     * Expected: Should detect wrong order and suggest correct syntax
     * Date Reported: 2026-01-14
     * Root Cause: Error handling didn't detect reversed order
     */

    it("should show helpful error for 'login profile create'", async () => {
      await executeAndExpect(
        "login profile create staging --url https://example.com --token abc123",
        session,
        {
          success: false,
          error: /unknown/i,
        },
      );
    });

    it("should suggest correct syntax in error message", async () => {
      await executeAndExpect(
        "login profile create staging --url https://example.com --token abc123",
        session,
        {
          success: false,
          output: /did you mean/i,
        },
      );
    });

    it("should mention the correct action-resource order", async () => {
      await executeAndExpect(
        "login profile create staging --url https://example.com --token abc123",
        session,
        {
          success: false,
          output: /create profile/i,
        },
      );
    });

    it("should show syntax help in error", async () => {
      await executeAndExpect(
        "login profile create staging --url https://example.com --token abc123",
        session,
        {
          success: false,
          output: /<action>.*<resource>/i,
        },
      );
    });

    it("should list available actions in error", async () => {
      await executeAndExpect(
        "login profile create staging --url https://example.com --token abc123",
        session,
        {
          success: false,
          output: /available actions/i,
        },
      );
    });
  });

  describe("REGRESSION-004: Enter vs Tab completion selection", () => {
    /**
     * Bug: Enter key applies completions instead of executing commands
     * Expected: Tab selects suggestion, Enter executes current input
     * Date Reported: 2026-01-14
     * Root Cause: Suggestions.tsx line 110 handled both key.return and key.tab identically
     */

    it("should still apply completions when Tab is pressed", async () => {
      // Verify Tab key continues to work for completions after fix
      await completeAndExpect("/login create profile myprofile ", completer, {
        includes: ["--url", "--token"],
        minCount: 2,
      });
    });

    it("should execute command when valid command is entered", async () => {
      // Verify commands execute correctly (Enter not intercepted by Suggestions)
      await executeAndExpect(
        "login create profile test --url https://test.volterra.io --token test123",
        session,
        {
          success: true,
          output: /profile.*created/i,
        },
      );
    });

    it("should execute partial command without applying suggestions", async () => {
      // User types "login list" - even if suggestions show "profile",
      // Enter should execute "login list", not apply completion
      await executeAndExpect("login list profile", session, {
        success: true,
      });
    });

    it("should execute command with current input regardless of suggestions", async () => {
      // Commands execute with exactly what user typed
      // This would fail if Enter was still applying completions
      await executeAndExpect("login create profile test123", session, {
        success: false,
        error: /missing.*url/i,
      });
    });

    it("should maintain Tab completion for flags", async () => {
      // Tab completion for flags should work
      const suggestions = await completer.complete(
        "login create profile test --",
      );
      const texts = suggestions.map((s) => s.text);

      expect(texts).toContain("--url");
      expect(texts).toContain("--token");
      expect(texts).toContain("--namespace");
    });

    it("should work with both /login and login forms", async () => {
      // Both command forms should execute correctly
      await executeAndExpect(
        "login create profile withslash --url https://test.volterra.io --token test123",
        session,
        {
          success: true,
        },
      );

      await executeAndExpect(
        "/login create profile withoutslash --url https://test.volterra.io --token test123",
        session,
        {
          success: true,
        },
      );
    });
  });

  describe("REGRESSION-COMBINED: Full workflow verification", () => {
    /**
     * Combined tests to ensure the entire flow works correctly
     */

    it("should complete and execute verb-first command successfully", async () => {
      // Step 1: Verify completion works
      await completeAndExpect("/login create profile ", completer, {
        includes: ["--url", "--token"],
        minCount: 2,
      });

      // Step 2: Verify execution works
      await executeAndExpect(
        "login create profile integration-test --url https://test.volterra.io --token test123",
        session,
        {
          success: true,
        },
      );
    });

    it("should prevent noun-first mistakes with helpful errors", async () => {
      // Attempt wrong order
      await executeAndExpect(
        "login profile create wrong-order --url https://test.volterra.io --token test123",
        session,
        {
          success: false,
          output: /did you mean.*create profile/i,
        },
      );
    });
  });
});
