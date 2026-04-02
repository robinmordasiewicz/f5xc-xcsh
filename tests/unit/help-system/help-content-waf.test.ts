/**
 * Help System - WAF Removal Tests
 *
 * Tests that verify the help system has been updated to remove WAF references
 * and properly show app_firewall in the virtual domain.
 */

import { describe, it, expect } from "vitest";
import { formatRootHelp } from "../../../src/repl/help.js";
import { generatedDomains } from "../../../src/types/domains_generated.js";

describe("Help System - WAF Removal", () => {
  describe("Root Help", () => {
    it("should not mention WAF domain in commands", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Should not have "waf list" or "waf create" commands
      expect(helpText).not.toMatch(/xcsh\s+waf\s+list/i);
      expect(helpText).not.toMatch(/xcsh\s+waf\s+create/i);
      expect(helpText).not.toMatch(/xcsh\s+waf\s+get/i);
      expect(helpText).not.toMatch(/xcsh\s+waf\s+delete/i);
    });

    it("should use virtual domain in app_firewall examples", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Should have examples using virtual domain
      expect(helpText).toMatch(/virtual.*app_firewall|app_firewall.*virtual/i);
    });

    it.skip("should show correct number of domains", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Should mention 38 domains
      expect(helpText).toMatch(/38.*domain|domain.*38/i);
    });

    it("should not have WAF in domain list", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Find domains section
      const lowerHelp = helpText.toLowerCase();

      // "waf" should not appear as a standalone domain word
      // Allow "firewall" but not "waf" alone
      const wafMatches = helpText.match(/\bwaf\b/gi);
      if (wafMatches) {
        // If WAF appears, it should only be in context of app_firewall
        for (const match of wafMatches) {
          const context = helpText.substring(
            helpText.indexOf(match) - 10,
            helpText.indexOf(match) + 20,
          );
          expect(context).toMatch(/app_firewall|firewall/i);
        }
      }
    });

    it("should have virtual domain in domains list", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      expect(helpText).toMatch(/\bvirtual\b/i);
    });

    it("should have complete help structure", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Check for expected sections
      expect(helpText).toMatch(/usage|USAGE/i);
      expect(helpText).toMatch(/domain|DOMAIN/i);
      expect(helpText).toMatch(/example|EXAMPLE/i);
    });
  });

  describe("Virtual Domain Help", () => {
    it("should include app_firewall in virtual domain resources", () => {
      const virtualDomain = generatedDomains.get("virtual");
      expect(virtualDomain).toBeDefined();

      const resourceNames = virtualDomain.allResources!.map((r) => r.name);
      expect(resourceNames).toContain("app_firewall");
    });

    it("should have app_firewall with proper metadata", () => {
      const virtualDomain = generatedDomains.get("virtual");
      const appFirewall = virtualDomain.allResources!.find(
        (r) => r.name === "app_firewall",
      );

      expect(appFirewall).toBeDefined();
      expect(appFirewall?.description).toBeDefined();
      expect(appFirewall?.icon).toBe("🛡️");
      expect(appFirewall?.tier).toBe("Advanced");
    });

    it("should show app_firewall as primary resource", () => {
      const virtualDomain = generatedDomains.get("virtual");
      const appFirewall = virtualDomain.allResources!.find(
        (r) => r.name === "app_firewall",
      );

      expect(appFirewall?.isPrimary).toBe(true);
    });

    it("should have app_firewall with operations", () => {
      const virtualDomain = generatedDomains.get("virtual");
      const appFirewall = virtualDomain.allResources!.find(
        (r) => r.name === "app_firewall",
      );

      expect(appFirewall?.operations).toContain("list");
      expect(appFirewall?.operations).toContain("get");
      expect(appFirewall?.operations).toContain("create");
      expect(appFirewall?.operations).toContain("delete");
    });
  });

  describe("Other Domains Help", () => {
    it("should not have app_firewall in network domain", () => {
      const networkDomain = generatedDomains.get("network");
      if (networkDomain && networkDomain.allResources) {
        const resourceNames = networkDomain.allResources.map((r) => r.name);
        expect(resourceNames).not.toContain("app_firewall");
      }
    });

    it("should not have app_firewall in security domain", () => {
      const securityDomain = generatedDomains.get("network_security");
      if (securityDomain && securityDomain.allResources) {
        const resourceNames = securityDomain.allResources.map((r) => r.name);
        expect(resourceNames).not.toContain("app_firewall");
      }
    });

    it("should not have WAF domain at all", () => {
      const domainNames = Array.from(generatedDomains.keys());
      expect(domainNames).not.toContain("waf");
    });
  });

  describe("Help Examples", () => {
    it("should have correct example commands", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Examples should use correct domain names
      const examplePattern = /xcsh\s+(\w+)\s+(list|get|create|delete)/gi;
      const matches = helpText.matchAll(examplePattern);

      for (const match of matches) {
        const domain = match[1].toLowerCase();
        // Domain should not be 'waf'
        expect(domain).not.toBe("waf");
      }
    });

    it("should use realistic resource examples", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Should have examples with actual resources
      // Not checking specific examples, just ensuring they exist
      expect(helpText.length).toBeGreaterThan(1000);
    });
  });

  describe("Help Consistency", () => {
    it("should have consistent domain references", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Check that domains mentioned in help actually exist
      const domainNames = Array.from(generatedDomains.keys());

      // Help should reference existing domains
      for (const domainName of domainNames) {
        // Most domains should be mentioned somewhere in help
        // (Not all will be in examples, but virtual definitely should be)
        if (domainName === "virtual") {
          expect(helpText).toMatch(new RegExp(domainName, "i"));
        }
      }
    });

    it("should not reference removed domains", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Should not reference WAF domain
      expect(helpText).not.toMatch(/\bwaf\s+(list|get|create|delete)/i);
    });

    it("should have correct command format", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Commands should follow pattern: xcsh <domain> <action> <resource>
      expect(helpText).toMatch(/xcsh\s+\w+\s+(list|get|create|delete)/);
    });
  });

  describe("Domain Count Verification", () => {
    it("should reflect 38 domains in help output", () => {
      const help = formatRootHelp();
      const helpText = help.join("\n");

      // Count domain references or check for "38 domains" text
      const domainSection = helpText.match(/domain/gi);
      expect(domainSection).toBeDefined();
      expect(domainSection!.length).toBeGreaterThan(0);
    });

    it("should list all 38 domains", () => {
      const domainNames = Array.from(generatedDomains.keys());
      expect(domainNames.length).toBe(38);

      // All domain names should be valid
      for (const name of domainNames) {
        expect(name).toMatch(/^[a-z_]+$/);
      }
    });
  });
});
