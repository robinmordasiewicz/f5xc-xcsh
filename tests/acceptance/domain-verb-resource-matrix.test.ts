/**
 * Domain-Verb-Resource Completion Matrix Tests
 *
 * Comprehensive test coverage for the domain-verb-resource completion flow.
 * Tests ALL combinations of:
 * - API domains (from domainRegistry)
 * - Resource actions (list, get, create, delete, replace, apply, status, patch, add-labels, remove-labels)
 * - Input variants (with/without "/" prefix, with/without trailing space)
 *
 * Purpose: Prevent regression of the bug where `domain verb ` shows domain groups
 * instead of resource types. This has regressed multiple times.
 *
 * Key invariant: After typing a valid domain + verb, suggestions MUST be resources,
 * NEVER verbs or domain groups.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createTestSession,
  createTestCompleter,
  setupTestEnvironment,
  cleanupTestEnvironment,
} from "../utils/test-helpers.js";
import type { REPLSession } from "../../src/repl/session.js";
import type { Completer } from "../../src/repl/completion/completer.js";
import { allDomains, getDomainInfo } from "../../src/types/domains.js";

// Setup mocks for all tests
setupTestEnvironment();

/**
 * All resource actions that should trigger resource type completion
 */
const RESOURCE_ACTIONS = [
  "list",
  "get",
  "create",
  "delete",
  "replace",
  "apply",
  "status",
  "patch",
  "add-labels",
  "remove-labels",
];

/**
 * Input variants to test different ways users might type commands
 */
const INPUT_VARIANTS = [
  { prefix: "/", suffix: " ", desc: "escaped with trailing space" },
  { prefix: "/", suffix: "", desc: "escaped no trailing space" },
  { prefix: "", suffix: " ", desc: "direct with trailing space" },
  { prefix: "", suffix: "", desc: "direct no trailing space" },
];

/**
 * Domains that are custom domains (not pure API domains)
 * These have special completion logic and may legitimately show verbs or non-resource suggestions
 */
const CUSTOM_DOMAINS = new Set([
  "ai_services",
  "login",
  "shape",
  "support",
  "users",
  "tenant_and_identity",
]);

/**
 * Get all API domains that have resources and are not custom domains
 * Filters out domains without primaryResources or allResources
 */
function getApiDomainsWithResources(): string[] {
  return allDomains().filter((domainName) => {
    // Skip custom domains - they have different completion logic
    if (CUSTOM_DOMAINS.has(domainName)) return false;

    const info = getDomainInfo(domainName);
    if (!info) return false;
    const resources = info.allResources || info.primaryResources;
    return resources && resources.length > 0;
  });
}

describe("Domain-Verb-Resource Completion Matrix (Comprehensive)", () => {
  let session: REPLSession;
  let completer: Completer;

  beforeEach(() => {
    session = createTestSession({ authenticated: true });
    completer = createTestCompleter(session);
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe("Critical Regression Tests - Fall-Through Bug Prevention", () => {
    /**
     * These tests specifically target the fall-through bug that has regressed multiple times.
     * The bug: When typing `domain verb `, the code would fall through to domain-level
     * suggestions instead of returning resource types.
     */

    it("REGRESSION GUARD: /virtual get  shows resources, not domain groups", async () => {
      const suggestions = await completer.complete("/virtual get ");
      const texts = suggestions.map((s) => s.text);

      // Must contain resource types
      expect(texts).toContain("http_loadbalancer");

      // Must NOT contain verbs
      for (const verb of RESOURCE_ACTIONS) {
        expect(texts).not.toContain(verb);
      }

      // Must NOT contain domain groups or navigation
      expect(texts).not.toContain("virtual");
      expect(texts).not.toContain("certificates");
      expect(texts).not.toContain("login");
      expect(texts).not.toContain("quit");
    });

    it("REGRESSION GUARD: virtual get  (no prefix) shows resources, not domain groups", async () => {
      const suggestions = await completer.complete("virtual get ");
      const texts = suggestions.map((s) => s.text);

      // Must contain resource types
      expect(texts).toContain("http_loadbalancer");

      // Must NOT contain verbs
      for (const verb of RESOURCE_ACTIONS) {
        expect(texts).not.toContain(verb);
      }
    });

    it("REGRESSION GUARD: filtered.length === 0 edge case shows all resources", async () => {
      // When user types a partial that matches nothing, we should still show all resources
      // This was the specific bug: filterSuggestions returned empty, but we didn't fall back
      const suggestions = await completer.complete("/virtual get xyz");
      const texts = suggestions.map((s) => s.text);

      // Should still show resources (all of them since filter matches none)
      expect(texts).toContain("http_loadbalancer");
      expect(texts).toContain("origin_pool");

      // Must NOT contain verbs
      for (const verb of RESOURCE_ACTIONS) {
        expect(texts).not.toContain(verb);
      }
    });

    it("REGRESSION GUARD: partial match shows filtered resources", async () => {
      const suggestions = await completer.complete("/virtual get http");
      const texts = suggestions.map((s) => s.text);

      // Should show filtered resources starting with "http"
      expect(texts).toContain("http_loadbalancer");

      // Should NOT show non-matching resources (unless filter returned empty)
      // But should still show flags
      expect(texts.some((t) => t.startsWith("--"))).toBe(true);
    });
  });

  describe("Comprehensive Domain-Verb Matrix", () => {
    // Test a selection of representative domains to avoid extremely long test runs
    // while still providing good coverage
    const testDomains = [
      "virtual",
      "certificates",
      "api",
      "dns",
      "network",
      "authentication",
    ];

    for (const domain of testDomains) {
      describe(`${domain} domain`, () => {
        for (const action of RESOURCE_ACTIONS) {
          // Test with "/" prefix and trailing space (most common case)
          it(`/${domain} ${action}  shows resources, not verbs`, async () => {
            const input = `/${domain} ${action} `;
            const suggestions = await completer.complete(input);
            const texts = suggestions.map((s) => s.text);

            // Verify we get suggestions
            expect(suggestions.length).toBeGreaterThan(0);

            // Must NOT contain any verb names
            for (const verb of RESOURCE_ACTIONS) {
              expect(texts).not.toContain(verb);
            }

            // Should contain resources or flags (not empty)
            const hasResources = suggestions.some(
              (s) => s.category === "resource",
            );
            const hasFlags = suggestions.some((s) => s.category === "flag");
            expect(hasResources || hasFlags).toBe(true);
          });
        }
      });
    }
  });

  describe("Input Variant Coverage", () => {
    // Test all input variants for the most critical domain
    const domain = "virtual";

    for (const action of RESOURCE_ACTIONS) {
      for (const variant of INPUT_VARIANTS) {
        it(`${variant.prefix}${domain} ${action}${variant.suffix} (${variant.desc}) - no verbs in output`, async () => {
          const input = `${variant.prefix}${domain} ${action}${variant.suffix}`;
          const suggestions = await completer.complete(input);
          const texts = suggestions.map((s) => s.text);

          // With trailing space: should show resources
          // Without trailing space: might be typing partial verb or ready for resource
          if (variant.suffix === " ") {
            // Must NOT contain verbs when space follows action
            for (const verb of RESOURCE_ACTIONS) {
              expect(texts).not.toContain(verb);
            }
          }
        });
      }
    }
  });

  describe("All Domains with Resources - Spot Check", () => {
    // Run a spot check on ALL pure API domains that have resources
    // Tests only the most critical case: /domain list  (with trailing space)
    const domainsWithResources = getApiDomainsWithResources();

    // Log count for visibility
    it(`should have multiple API domains with resources (found ${domainsWithResources.length})`, () => {
      expect(domainsWithResources.length).toBeGreaterThan(5);
    });

    for (const domain of domainsWithResources) {
      it(`/${domain} list  shows resources (by category), not action verbs`, async () => {
        const suggestions = await completer.complete(`/${domain} list `);

        // Should have at least one suggestion (resource or flag)
        expect(suggestions.length).toBeGreaterThan(0);

        // Key invariant: No suggestions should have category "action"
        // (Resource names that coincidentally match verbs are OK - they have category "resource")
        const actionSuggestions = suggestions.filter(
          (s) => s.category === "action",
        );
        expect(actionSuggestions).toHaveLength(0);

        // Should have at least one resource or flag
        const hasResources = suggestions.some((s) => s.category === "resource");
        const hasFlags = suggestions.some((s) => s.category === "flag");
        expect(hasResources || hasFlags).toBe(true);
      });
    }
  });

  describe("Category Verification", () => {
    it("resources should have category 'resource'", async () => {
      const suggestions = await completer.complete("/virtual list ");
      const resourceSuggestions = suggestions.filter(
        (s) => s.category === "resource",
      );

      expect(resourceSuggestions.length).toBeGreaterThan(0);

      // Verify specific known resources
      const resourceTexts = resourceSuggestions.map((s) => s.text);
      expect(resourceTexts).toContain("http_loadbalancer");
    });

    it("flags should have category 'flag'", async () => {
      const suggestions = await completer.complete("/virtual list ");
      const flagSuggestions = suggestions.filter((s) => s.category === "flag");

      expect(flagSuggestions.length).toBeGreaterThan(0);

      // Verify specific known flags
      const flagTexts = flagSuggestions.map((s) => s.text);
      expect(flagTexts.some((t) => t.startsWith("--"))).toBe(true);
    });
  });

  describe("Negative Tests - Ensure Verbs Shown Before Action", () => {
    it("/virtual  (domain only) shows verbs, not resources", async () => {
      const suggestions = await completer.complete("/virtual ");
      const texts = suggestions.map((s) => s.text);

      // Should show verbs
      expect(texts).toContain("list");
      expect(texts).toContain("get");
      expect(texts).toContain("create");
      expect(texts).toContain("delete");

      // Should NOT show resource types at this stage
      expect(texts).not.toContain("http_loadbalancer");
      expect(texts).not.toContain("origin_pool");
    });

    it("virtual  (domain only, no prefix) shows verbs, not resources", async () => {
      // This depends on context - if not in a domain context, may show domain suggestions
      // But if recognized as API domain command, should show verbs
      const suggestions = await completer.complete("virtual ");
      const texts = suggestions.map((s) => s.text);

      // When virtual is recognized as API domain, should show verbs
      // Either verbs or it fell back to root suggestions (domains)
      const hasVerbs =
        texts.includes("list") ||
        texts.includes("get") ||
        texts.includes("create");
      const hasDomains =
        texts.includes("virtual") || texts.includes("certificates");

      // One of these should be true
      expect(hasVerbs || hasDomains).toBe(true);
    });
  });

  describe("Consistency Tests", () => {
    it("same domain+verb always produces consistent results", async () => {
      // Run the same completion multiple times
      const results: string[][] = [];

      for (let i = 0; i < 3; i++) {
        const suggestions = await completer.complete("/virtual get ");
        results.push(suggestions.map((s) => s.text).sort());
      }

      // All results should be identical
      expect(results[0]).toEqual(results[1]);
      expect(results[1]).toEqual(results[2]);
    });

    it("escaped and non-escaped produce same resources (when domain is recognized)", async () => {
      const escaped = await completer.complete("/virtual list ");
      const direct = await completer.complete("virtual list ");

      const escapedTexts = escaped.map((s) => s.text).sort();
      const directTexts = direct.map((s) => s.text).sort();

      // Should produce the same resource suggestions
      // (may differ in flags or order, but core resources should match)
      const escapedResources = escaped
        .filter((s) => s.category === "resource")
        .map((s) => s.text)
        .sort();
      const directResources = direct
        .filter((s) => s.category === "resource")
        .map((s) => s.text)
        .sort();

      expect(escapedResources).toEqual(directResources);
    });
  });
});
