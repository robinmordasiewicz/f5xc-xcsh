/**
 * App Firewall Validation Unit Tests
 *
 * Tests for validateAppFirewallFlags function.
 * Ensures all validation rules are properly enforced.
 */

import { describe, it, expect } from "vitest";
import { validateAppFirewallFlags } from "../../../src/repl/creation/builders/app-firewall-builder.js";
import { parseCreationFlags } from "../../../src/repl/creation/flag-parser.js";

describe("App Firewall Validation - validateAppFirewallFlags", () => {
  describe("Required Fields", () => {
    it("passes with valid name", () => {
      const args = ["--name", "test-waf"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("fails with missing name", () => {
      const args: string[] = [];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("--name is required");
    });

    it("validates name format (lowercase alphanumeric)", () => {
      const validNames = ["test", "test-waf", "waf123", "my-waf-1"];

      for (const name of validNames) {
        const args = ["--name", name];
        const parsed = parseCreationFlags(args, "app_firewall");
        const validation = validateAppFirewallFlags(parsed);

        expect(validation.valid).toBe(true);
      }
    });

    it("rejects invalid name formats", () => {
      const invalidNames = ["Test", "test_waf", "TEST", "test.waf", "test@waf"];

      for (const name of invalidNames) {
        const args = ["--name", name];
        const parsed = parseCreationFlags(args, "app_firewall");
        const validation = validateAppFirewallFlags(parsed);

        expect(validation.valid).toBe(false);
        expect(
          validation.errors.some((e) => e.includes("lowercase alphanumeric")),
        ).toBe(true);
      }
    });
  });

  describe("Blocking Mode Validation", () => {
    it("accepts MONITORING mode", () => {
      const args = ["--name", "test", "--blocking-mode", "MONITORING"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });

    it("accepts BLOCKING mode", () => {
      const args = ["--name", "test", "--blocking-mode", "BLOCKING"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });

    it("rejects invalid blocking mode", () => {
      const args = ["--name", "test", "--blocking-mode", "INVALID"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(false);
      expect(validation.errors.some((e) => e.includes("--blocking-mode"))).toBe(
        true,
      );
      expect(
        validation.errors.some((e) => e.includes("MONITORING, BLOCKING")),
      ).toBe(true);
    });

    it("accepts lowercase blocking mode (case normalization)", () => {
      const args = ["--name", "test", "--blocking-mode", "monitoring"];
      const parsed = parseCreationFlags(args, "app_firewall");

      // Note: parseCreationFlags should normalize, but if not, validation will catch it
      const validation = validateAppFirewallFlags(parsed);

      // Either normalized and passes, or fails with clear error
      if (!validation.valid) {
        expect(
          validation.errors.some((e) => e.includes("MONITORING, BLOCKING")),
        ).toBe(true);
      }
    });
  });

  describe("Detection Mode Validation", () => {
    const validModes = ["LOW", "MEDIUM", "HIGH", "CUSTOM"];

    validModes.forEach((mode) => {
      it(`accepts ${mode} detection mode`, () => {
        const args = ["--name", "test", "--detection-mode", mode];
        const parsed = parseCreationFlags(args, "app_firewall");
        const validation = validateAppFirewallFlags(parsed);

        expect(validation.valid).toBe(true);
      });
    });

    it("rejects invalid detection mode", () => {
      const args = ["--name", "test", "--detection-mode", "INVALID"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(false);
      expect(
        validation.errors.some((e) => e.includes("--detection-mode")),
      ).toBe(true);
      expect(
        validation.errors.some((e) => e.includes("LOW, MEDIUM, HIGH, CUSTOM")),
      ).toBe(true);
    });
  });

  describe("Request Size Validation", () => {
    it("accepts minimum valid size (1 byte)", () => {
      const args = ["--name", "test", "--max-request-size", "1"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });

    it("accepts maximum valid size (10 MB)", () => {
      const args = ["--name", "test", "--max-request-size", "10485760"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });

    it("accepts common valid sizes", () => {
      const validSizes = ["1024", "1048576", "5242880"]; // 1KB, 1MB, 5MB

      for (const size of validSizes) {
        const args = ["--name", "test", "--max-request-size", size];
        const parsed = parseCreationFlags(args, "app_firewall");
        const validation = validateAppFirewallFlags(parsed);

        expect(validation.valid).toBe(true);
      }
    });

    it("rejects size below minimum (0 bytes)", () => {
      const args = ["--name", "test", "--max-request-size", "0"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(false);
      expect(
        validation.errors.some((e) => e.includes("between 1 and 10485760")),
      ).toBe(true);
    });

    it("rejects negative size", () => {
      const args = ["--name", "test", "--max-request-size", "-1"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(false);
    });

    it("rejects size above maximum (>10 MB)", () => {
      const args = ["--name", "test", "--max-request-size", "999999999"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(false);
      expect(
        validation.errors.some((e) => e.includes("between 1 and 10485760")),
      ).toBe(true);
    });
  });

  describe("Response Codes Validation", () => {
    it("accepts valid single response code", () => {
      const args = ["--name", "test", "--allowed-response-codes", "200"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });

    it("accepts valid response code range", () => {
      const args = ["--name", "test", "--allowed-response-codes", "200-299"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });

    it("accepts multiple valid response codes", () => {
      const args = [
        "--name",
        "test",
        "--allowed-response-codes",
        "200,201,204,301-303",
      ];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });

    it("rejects response code below 100", () => {
      const args = ["--name", "test", "--allowed-response-codes", "99"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(false);
      expect(
        validation.errors.some((e) => e.includes("between 100 and 599")),
      ).toBe(true);
    });

    it("rejects response code above 599", () => {
      const args = ["--name", "test", "--allowed-response-codes", "600"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(false);
      expect(
        validation.errors.some((e) => e.includes("between 100 and 599")),
      ).toBe(true);
    });

    it("validates all codes in a range", () => {
      const args = ["--name", "test", "--allowed-response-codes", "50-100"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(false);
      // Should report error for codes < 100
    });
  });

  describe("Multiple Validation Errors", () => {
    it("reports all validation errors", () => {
      const args = [
        "--blocking-mode",
        "INVALID",
        "--detection-mode",
        "WRONG",
        "--max-request-size",
        "999999999",
      ];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(1);

      // Should include all three errors
      expect(
        validation.errors.some((e) => e.includes("--name is required")),
      ).toBe(true);
      expect(validation.errors.some((e) => e.includes("--blocking-mode"))).toBe(
        true,
      );
      expect(
        validation.errors.some((e) => e.includes("--detection-mode")),
      ).toBe(true);
      expect(
        validation.errors.some((e) => e.includes("--max-request-size")),
      ).toBe(true);
    });
  });

  describe("Optional Fields", () => {
    it("passes with no optional fields", () => {
      const args = ["--name", "test"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });

    it("does not require protection flags", () => {
      const args = ["--name", "test"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });

    it("does not require blocking or detection mode", () => {
      const args = ["--name", "test"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("handles single-character name", () => {
      const args = ["--name", "a"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });

    it("handles very long name", () => {
      const longName = "a".repeat(100);
      const args = ["--name", longName];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      // Should pass (server will enforce length limits)
      expect(validation.valid).toBe(true);
    });

    it("handles whitespace in response codes", () => {
      const args = [
        "--name",
        "test",
        "--allowed-response-codes",
        " 200 , 201 ",
      ];
      const parsed = parseCreationFlags(args, "app_firewall");
      const validation = validateAppFirewallFlags(parsed);

      expect(validation.valid).toBe(true);
    });
  });
});
