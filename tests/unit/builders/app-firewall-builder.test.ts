/**
 * App Firewall Builder Unit Tests
 *
 * Tests for building API request bodies from parsed flags.
 * Follows the pattern established in creation-builders.test.ts for healthcheck and origin_pool.
 */

import { describe, it, expect } from "vitest";
import {
  buildAppFirewallRequest,
  validateAppFirewallFlags,
  type AppFirewallRequestBody,
} from "../../../src/repl/creation/builders/app-firewall-builder.js";
import { parseCreationFlags } from "../../../src/repl/creation/flag-parser.js";

describe("App Firewall Builder - buildAppFirewallRequest", () => {
  describe("Minimal Configuration", () => {
    it("builds with only required flags", () => {
      const args = ["--name", "test-waf", "--namespace", "default"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.metadata.name).toBe("test-waf");
      expect(request.metadata.namespace).toBe("default");
      expect(request.spec).toBeDefined();
    });

    it("applies smart defaults (empty spec)", () => {
      const args = ["--name", "test-waf"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      // Server will apply defaults for optional fields
      expect(request.spec).toEqual({});
    });

    it("uses provided namespace", () => {
      const args = ["--name", "test"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "custom-ns");

      expect(request.metadata.namespace).toBe("custom-ns");
    });
  });

  describe("Blocking Mode", () => {
    it("accepts MONITORING mode", () => {
      const args = ["--name", "test", "--blocking-mode", "MONITORING"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.blocking_mode).toBe("MONITORING");
    });

    it("accepts BLOCKING mode", () => {
      const args = ["--name", "test", "--blocking-mode", "BLOCKING"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.blocking_mode).toBe("BLOCKING");
    });

    it("omits blocking mode when not specified", () => {
      const args = ["--name", "test"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.blocking_mode).toBeUndefined();
    });
  });

  describe("Detection Mode", () => {
    const modes = ["LOW", "MEDIUM", "HIGH", "CUSTOM"];

    modes.forEach((mode) => {
      it(`accepts ${mode} detection mode`, () => {
        const args = ["--name", "test", "--detection-mode", mode];
        const parsed = parseCreationFlags(args, "app_firewall");
        const request = buildAppFirewallRequest(parsed, "default");

        expect(request.spec.detection_mode).toBe(mode);
      });
    });

    it("omits detection mode when not specified", () => {
      const args = ["--name", "test"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.detection_mode).toBeUndefined();
    });
  });

  describe("Protection Flags", () => {
    it("enables SQL injection protection", () => {
      const args = ["--name", "test", "--enable-sql-injection"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.enable_sql_injection).toBe(true);
    });

    it("enables XSS protection", () => {
      const args = ["--name", "test", "--enable-xss"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.enable_xss).toBe(true);
    });

    it("enables command injection protection", () => {
      const args = ["--name", "test", "--enable-command-injection"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.enable_command_injection).toBe(true);
    });

    it("enables API protection", () => {
      const args = ["--name", "test", "--enable-api-protection"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.enable_api_protection).toBe(true);
    });

    it("enables bot protection", () => {
      const args = ["--name", "test", "--enable-bot-protection"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.enable_bot_protection).toBe(true);
    });

    it("enables threat campaigns", () => {
      const args = ["--name", "test", "--enable-threat-campaigns"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.enable_threat_campaigns).toBe(true);
    });

    it("combines multiple protections", () => {
      const args = [
        "--name",
        "test",
        "--enable-sql-injection",
        "--enable-xss",
        "--enable-command-injection",
        "--enable-api-protection",
        "--enable-bot-protection",
      ];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.enable_sql_injection).toBe(true);
      expect(request.spec.enable_xss).toBe(true);
      expect(request.spec.enable_command_injection).toBe(true);
      expect(request.spec.enable_api_protection).toBe(true);
      expect(request.spec.enable_bot_protection).toBe(true);
    });

    it("omits protection flags when not specified", () => {
      const args = ["--name", "test"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.enable_sql_injection).toBeUndefined();
      expect(request.spec.enable_xss).toBeUndefined();
      expect(request.spec.enable_command_injection).toBeUndefined();
    });
  });

  describe("Response Codes", () => {
    it("parses single response code", () => {
      const args = ["--name", "test", "--allowed-response-codes", "200"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.allowed_response_codes).toEqual([200]);
    });

    it("parses comma-separated response codes", () => {
      const args = [
        "--name",
        "test",
        "--allowed-response-codes",
        "200,201,204",
      ];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.allowed_response_codes).toContain(200);
      expect(request.spec.allowed_response_codes).toContain(201);
      expect(request.spec.allowed_response_codes).toContain(204);
      expect(request.spec.allowed_response_codes?.length).toBe(3);
    });

    it("parses response code range", () => {
      const args = ["--name", "test", "--allowed-response-codes", "200-204"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.allowed_response_codes).toEqual([
        200, 201, 202, 203, 204,
      ]);
    });

    it("parses mixed format response codes", () => {
      const args = [
        "--name",
        "test",
        "--allowed-response-codes",
        "200,201-203,400",
      ];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.allowed_response_codes).toContain(200);
      expect(request.spec.allowed_response_codes).toContain(201);
      expect(request.spec.allowed_response_codes).toContain(202);
      expect(request.spec.allowed_response_codes).toContain(203);
      expect(request.spec.allowed_response_codes).toContain(400);
    });

    it("handles whitespace in response codes", () => {
      const args = [
        "--name",
        "test",
        "--allowed-response-codes",
        " 200 , 201 , 202 ",
      ];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.allowed_response_codes).toEqual([200, 201, 202]);
    });
  });

  describe("Request Size", () => {
    it("sets max request size", () => {
      const args = ["--name", "test", "--max-request-size", "1048576"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.max_request_size).toBe(1048576);
    });

    it("accepts minimum valid size (1 byte)", () => {
      const args = ["--name", "test", "--max-request-size", "1"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.max_request_size).toBe(1);
    });

    it("accepts maximum valid size (10 MB)", () => {
      const args = ["--name", "test", "--max-request-size", "10485760"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.max_request_size).toBe(10485760);
    });

    it("omits request size when not specified", () => {
      const args = ["--name", "test"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.spec.max_request_size).toBeUndefined();
    });
  });

  describe("Full Configuration", () => {
    it("builds comprehensive app firewall", () => {
      const args = [
        "--name",
        "comprehensive-waf",
        "--namespace",
        "default",
        "--blocking-mode",
        "BLOCKING",
        "--detection-mode",
        "HIGH",
        "--enable-sql-injection",
        "--enable-xss",
        "--enable-command-injection",
        "--enable-api-protection",
        "--enable-bot-protection",
        "--enable-threat-campaigns",
        "--allowed-response-codes",
        "200-299,301-303",
        "--max-request-size",
        "5242880",
      ];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request).toMatchObject({
        metadata: {
          name: "comprehensive-waf",
          namespace: "default",
        },
        spec: {
          blocking_mode: "BLOCKING",
          detection_mode: "HIGH",
          enable_sql_injection: true,
          enable_xss: true,
          enable_command_injection: true,
          enable_api_protection: true,
          enable_bot_protection: true,
          enable_threat_campaigns: true,
          max_request_size: 5242880,
        },
      });

      // Check response codes separately
      expect(request.spec.allowed_response_codes).toBeDefined();
      expect(request.spec.allowed_response_codes!.length).toBeGreaterThan(100); // 200-299, 301-303
    });
  });

  describe("Edge Cases", () => {
    it("handles empty name gracefully", () => {
      const args: string[] = [];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      expect(request.metadata.name).toBe("");
    });

    it("handles namespace override", () => {
      const args = ["--name", "test", "--namespace", "original"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "override");

      expect(request.metadata.namespace).toBe("override");
    });

    it("produces valid request structure", () => {
      const args = ["--name", "test"];
      const parsed = parseCreationFlags(args, "app_firewall");
      const request = buildAppFirewallRequest(parsed, "default");

      // Validate structure
      expect(request).toHaveProperty("metadata");
      expect(request).toHaveProperty("spec");
      expect(request.metadata).toHaveProperty("name");
      expect(request.metadata).toHaveProperty("namespace");
    });
  });
});
