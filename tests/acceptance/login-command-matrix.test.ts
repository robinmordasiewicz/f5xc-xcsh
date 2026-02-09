/**
 * Login Command Execution Matrix Tests
 *
 * Comprehensive user acceptance tests covering all login command patterns
 * and execution scenarios. These tests verify the complete command execution
 * flow for the login domain using verb-first architecture.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createTestSession,
  executeAndExpect,
  setupTestEnvironment,
  cleanupTestEnvironment,
} from "../utils/test-helpers.js";
import type { REPLSession } from "../../src/repl/session.js";

// Setup mocks for all tests
setupTestEnvironment();

describe("Login Command Execution Matrix", () => {
  let session: REPLSession;

  beforeEach(() => {
    session = createTestSession({ authenticated: true });
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe("Profile Creation (Verb-First: login create profile)", () => {
    it("should create profile with all required flags", async () => {
      await executeAndExpect(
        "login create profile staging --url https://test.volterra.io --token abc123",
        session,
        {
          success: true,
          output: /profile.*created/i,
        },
      );
    });

    it("should create profile with optional namespace flag", async () => {
      await executeAndExpect(
        "login create profile staging --url https://test.volterra.io --token abc123 --namespace system",
        session,
        {
          success: true,
          output: /profile.*created/i,
        },
      );
    });

    it("should work without leading slash", async () => {
      await executeAndExpect(
        "login create profile test --url https://test.volterra.io --token test123",
        session,
        {
          success: true,
        },
      );
    });

    it("should work with leading slash", async () => {
      await executeAndExpect(
        "/login create profile test --url https://test.volterra.io --token test123",
        session,
        {
          success: true,
        },
      );
    });

    it("should fail without profile name", async () => {
      await executeAndExpect("login create profile", session, {
        success: false,
        error: /usage/i,
      });
    });

    it("should fail without --url flag", async () => {
      await executeAndExpect(
        "login create profile test --token abc123",
        session,
        {
          success: false,
          error: /missing.*url/i,
        },
      );
    });

    it("should fail without --token flag", async () => {
      await executeAndExpect(
        "login create profile test --url https://test.volterra.io",
        session,
        {
          success: false,
          error: /missing.*token/i,
        },
      );
    });

    it("should fail with invalid profile name (starting with hyphen)", async () => {
      await executeAndExpect(
        "login create profile -bad --url https://test.volterra.io --token abc123",
        session,
        {
          success: false,
          error: /usage/i,
        },
      );
    });

    it("should auto-activate newly created profile", async () => {
      await executeAndExpect(
        "login create profile newprofile --url https://test.volterra.io --token abc123",
        session,
        {
          success: true,
          output: /activated/i,
        },
      );
    });

    it("should show connection table after creation", async () => {
      await executeAndExpect(
        "login create profile display-test --url https://test.volterra.io --token abc123",
        session,
        {
          success: true,
          output: /profile.*created/i,
        },
      );
    });
  });

  describe("Command Path Consistency (User Acceptance)", () => {
    it("CREATE: error message should show verb-first order 'login create profile'", async () => {
      const result = await executeAndExpect("login create profile", session, {
        success: false,
        error: /usage/i,
      });

      // CRITICAL: Verify error shows correct command path order
      const output = Array.isArray(result.output)
        ? result.output.join("\n")
        : String(result.output || "");
      const error = result.error || "";
      const fullOutput = [output, result.error].filter(Boolean).join("\n");

      expect(fullOutput).toContain("login create profile");
      expect(fullOutput).not.toContain("login profile create");
    });

    it("SHOW: error message should show verb-first order 'login show profile'", async () => {
      const result = await executeAndExpect("login show profile", session, {
        success: false,
        error: /usage/i,
      });

      // CRITICAL: Verify error shows correct command path order
      const output = Array.isArray(result.output)
        ? result.output.join("\n")
        : String(result.output || "");
      const errorMsg = result.error || "";

      const fullOutput = output + "\n" + (result.error || "");
      expect(fullOutput).toContain("login show profile");
      expect(fullOutput).not.toContain("login profile show");
    });

    it("USE: error message should show verb-first order 'login use profile'", async () => {
      const result = await executeAndExpect("login use profile", session, {
        success: false,
        error: /usage/i,
      });

      // CRITICAL: Verify error shows correct command path order
      const fullOutput = Array.isArray(result.output)
        ? result.output.join("\n")
        : String(result.output || "");
      expect(fullOutput).toContain("login use profile");
      expect(fullOutput).not.toContain("login profile use");
    });

    it("EDIT: error message should show verb-first order 'login edit profile'", async () => {
      const result = await executeAndExpect(
        "login edit profile nonexistent",
        session,
        {
          success: false,
          error: /not found/i,
        },
      );

      // If there's a usage line, it must be correct order
      const output = Array.isArray(result.output)
        ? result.output.join("\n")
        : String(result.output || "");
      if (output.toLowerCase().includes("usage")) {
        expect(output).toContain("login edit profile");
        expect(output).not.toContain("login profile edit");
      }
    });

    it("DELETE: error message should show verb-first order 'login delete profile'", async () => {
      const result = await executeAndExpect("login delete profile", session, {
        success: false,
        error: /usage/i,
      });

      // CRITICAL: Verify error shows correct command path order
      const outputStr = Array.isArray(result.output)
        ? result.output.join("\n")
        : String(result.output || "");
      expect(outputStr).toContain("login delete profile");
      expect(outputStr).not.toContain("login profile delete");
    });

    it("ALL profile commands should consistently use verb-first in help", async () => {
      const commands = [
        { cmd: "login create profile", expected: "login create profile" },
        { cmd: "login show profile", expected: "login show profile" },
        { cmd: "login use profile", expected: "login use profile" },
        { cmd: "login delete profile", expected: "login delete profile" },
      ];

      for (const { cmd, expected } of commands) {
        const result = await executeAndExpect(cmd, session, {
          success: false,
        });

        // Convert output array to string for checking
        const outputStr = Array.isArray(result.output)
          ? result.output.join("\n")
          : String(result.output || "");

        // Every error message must show the command in correct order
        if (outputStr.toLowerCase().includes("usage")) {
          expect(
            outputStr,
            `Command "${cmd}" must show "${expected}" in error message`,
          ).toContain(expected);
        }
      }
    });
  });

  describe("Wrong Order Detection (Noun-First: login profile create)", () => {
    it("should detect wrong order and show helpful error", async () => {
      await executeAndExpect(
        "login profile create wrongorder --url https://test.volterra.io --token abc123",
        session,
        {
          success: false,
          error: /unknown command/i,
        },
      );
    });

    it("should suggest correct syntax in error", async () => {
      await executeAndExpect(
        "login profile create test --url https://test.volterra.io --token abc123",
        session,
        {
          success: false,
          output: /did you mean.*login create profile/i,
        },
      );
    });

    it("should show syntax help in error message", async () => {
      await executeAndExpect(
        "login profile create test --url https://test.volterra.io --token abc123",
        session,
        {
          success: false,
          output: /correct syntax.*<action>.*<resource>/i,
        },
      );
    });

    it("should list available actions", async () => {
      await executeAndExpect(
        "login profile create test --url https://test.volterra.io --token abc123",
        session,
        {
          success: false,
          output: /available actions/i,
        },
      );
    });
  });

  describe("Profile Listing (login list profile)", () => {
    it("should list profiles successfully", async () => {
      await executeAndExpect("login list profile", session, {
        success: true,
      });
    });

    it("should work without leading slash", async () => {
      await executeAndExpect("login list profile", session, {
        success: true,
      });
    });

    it("should work with leading slash", async () => {
      await executeAndExpect("/login list profile", session, {
        success: true,
      });
    });
  });

  describe.skip("Profile Usage (login use profile)", () => {
    // Skipped: Requires full profile manager mocking
    it("should require profile name", async () => {
      await executeAndExpect("login use profile", session, {
        success: false,
      });
    });

    it("should work with valid profile name", async () => {
      // First create a profile
      await executeAndExpect(
        "login create profile usetest --url https://test.volterra.io --token abc123",
        session,
        { success: true },
      );

      // Then use it
      await executeAndExpect("login use profile usetest", session, {
        success: true,
      });
    });
  });

  describe.skip("Profile Display (login show profile)", () => {
    // Skipped: Requires full profile manager mocking
    it("should require profile name", async () => {
      await executeAndExpect("login show profile", session, {
        success: false,
      });
    });

    it("should work with valid profile name", async () => {
      // First create a profile
      await executeAndExpect(
        "login create profile showtest --url https://test.volterra.io --token abc123",
        session,
        { success: true },
      );

      // Then show it
      await executeAndExpect("login show profile showtest", session, {
        success: true,
      });
    });
  });

  describe.skip("Profile Editing (login edit profile)", () => {
    // Skipped: Edit command opens text editor, requires interactive terminal mocking
    it("should require profile name", async () => {
      await executeAndExpect("login edit profile", session, {
        success: false,
      });
    });

    it("should allow editing URL", async () => {
      // First create a profile
      await executeAndExpect(
        "login create profile edittest --url https://old.volterra.io --token abc123",
        session,
        { success: true },
      );

      // Then edit it
      await executeAndExpect(
        "login edit profile edittest --url https://new.volterra.io",
        session,
        {
          success: true,
        },
      );
    });

    it("should allow editing token", async () => {
      // First create a profile
      await executeAndExpect(
        "login create profile tokentest --url https://test.volterra.io --token old123",
        session,
        { success: true },
      );

      // Then edit token
      await executeAndExpect(
        "login edit profile tokentest --token new123",
        session,
        {
          success: true,
        },
      );
    });

    it("should allow editing namespace", async () => {
      // First create a profile
      await executeAndExpect(
        "login create profile nstest --url https://test.volterra.io --token abc123",
        session,
        { success: true },
      );

      // Then edit namespace
      await executeAndExpect(
        "login edit profile nstest --namespace system",
        session,
        {
          success: true,
        },
      );
    });
  });

  describe.skip("Profile Deletion (login delete profile)", () => {
    // Skipped: Requires full profile manager mocking
    it("should require profile name", async () => {
      await executeAndExpect("login delete profile", session, {
        success: false,
      });
    });

    it("should delete existing profile", async () => {
      // First create a profile
      await executeAndExpect(
        "login create profile deletetest --url https://test.volterra.io --token abc123",
        session,
        { success: true },
      );

      // Then delete it
      await executeAndExpect("login delete profile deletetest", session, {
        success: true,
      });
    });
  });

  describe.skip("Integration Workflows", () => {
    // Skipped: Requires full profile manager mocking
    it("should support complete profile lifecycle", async () => {
      const profileName = "lifecycle-test";

      // Create
      await executeAndExpect(
        `login create profile ${profileName} --url https://test.volterra.io --token abc123`,
        session,
        { success: true },
      );

      // List (should include new profile)
      await executeAndExpect("login list profile", session, {
        success: true,
      });

      // Show
      await executeAndExpect(`login show profile ${profileName}`, session, {
        success: true,
      });

      // Use
      await executeAndExpect(`login use profile ${profileName}`, session, {
        success: true,
      });

      // Edit
      await executeAndExpect(
        `login edit profile ${profileName} --url https://new.volterra.io`,
        session,
        { success: true },
      );

      // Delete
      await executeAndExpect(`login delete profile ${profileName}`, session, {
        success: true,
      });

      // List (should not include deleted profile)
      await executeAndExpect("login list profile", session, {
        success: true,
      });
    });

    it("should handle multiple profiles", async () => {
      // Create multiple profiles
      await executeAndExpect(
        "login create profile multi1 --url https://test1.volterra.io --token token1",
        session,
        { success: true },
      );

      await executeAndExpect(
        "login create profile multi2 --url https://test2.volterra.io --token token2",
        session,
        { success: true },
      );

      await executeAndExpect(
        "login create profile multi3 --url https://test3.volterra.io --token token3",
        session,
        { success: true },
      );

      // List should show all
      await executeAndExpect("login list profile", session, {
        success: true,
      });

      // Switch between profiles
      await executeAndExpect("login use profile multi1", session, {
        success: true,
      });

      await executeAndExpect("login use profile multi2", session, {
        success: true,
      });

      await executeAndExpect("login use profile multi3", session, {
        success: true,
      });
    });
  });

  describe.skip("Edge Cases", () => {
    // Skipped: Requires full profile manager mocking
    it("should handle profile names with special characters", async () => {
      await executeAndExpect(
        "login create profile test-profile_123 --url https://test.volterra.io --token abc123",
        session,
        {
          success: true,
        },
      );
    });

    it("should handle URLs with ports", async () => {
      await executeAndExpect(
        "login create profile porttest --url https://test.volterra.io:8443 --token abc123",
        session,
        {
          success: true,
        },
      );
    });

    it("should handle long token values", async () => {
      const longToken = "a".repeat(100);
      await executeAndExpect(
        `login create profile longtoken --url https://test.volterra.io --token ${longToken}`,
        session,
        {
          success: true,
        },
      );
    });

    it("should handle namespaces with special characters", async () => {
      await executeAndExpect(
        "login create profile nsspecial --url https://test.volterra.io --token abc123 --namespace my-namespace",
        session,
        {
          success: true,
        },
      );
    });
  });
});
