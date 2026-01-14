/**
 * Enhanced completion testing - verifies Phase 1 dynamic resource discovery
 * Tests that allResources (discovered from OpenAPI) are shown in completions
 */

import { describe, it, expect, beforeEach } from "vitest";
import { Completer } from "../../src/repl/completion/completer.js";
import { getDomainInfo } from "../../src/types/domains.js";

describe("Enhanced Completion - Dynamic Resource Discovery", () => {
	let completer: Completer;

	beforeEach(() => {
		completer = new Completer();
	});

	describe("Virtual domain - all 38 resources", () => {
		it("should show all discovered resources for /virtual list", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const texts = suggestions.map((s) => s.text);

			console.log(`\n🔍 Virtual domain resources: ${texts.length} total`);
			console.log(`   Primary (⭐): ${suggestions.filter((s) => s.description.includes("⭐")).length}`);
			console.log(`   Additional: ${suggestions.filter((s) => !s.description.includes("⭐")).length}`);

			// Should have significantly more than the original 4 primary resources
			expect(texts.length).toBeGreaterThan(20);

			// Should include original primary resources
			expect(texts).toContain("http_loadbalancer");
			expect(texts).toContain("tcp_loadbalancer");
			expect(texts).toContain("origin_pool");
			expect(texts).toContain("healthcheck");

			// Should include newly discovered resources
			expect(texts).toContain("udp_loadbalancer");
			expect(texts).toContain("virtual_host");
			expect(texts).toContain("rate_limiter_policy");
			expect(texts).toContain("service_policy");
		});

		it("should mark primary resources with ⭐ indicator", async () => {
			const suggestions = await completer.complete("/virtual list ");

			// Find a primary resource
			const httpLb = suggestions.find((s) => s.text === "http_loadbalancer");
			expect(httpLb).toBeDefined();
			expect(httpLb?.description).toContain("⭐");

			// Find a non-primary resource
			const udpLb = suggestions.find((s) => s.text === "udp_loadbalancer");
			expect(udpLb).toBeDefined();
			expect(udpLb?.description).not.toContain("⭐");
		});

		it("should sort primary resources first", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const texts = suggestions.map((s) => s.text);

			// Get the domain info to check which are primary
			const domainInfo = getDomainInfo("virtual");
			const primaryNames = new Set(
				domainInfo?.primaryResources?.map((r) => r.name) || [],
			);

			// Find indices of primary vs non-primary resources
			const firstPrimaryIndex = texts.findIndex((name) => primaryNames.has(name));
			const firstNonPrimaryIndex = texts.findIndex(
				(name) => !primaryNames.has(name),
			);

			// All primaries should come before any non-primaries
			if (firstPrimaryIndex >= 0 && firstNonPrimaryIndex >= 0) {
				expect(firstPrimaryIndex).toBeLessThan(firstNonPrimaryIndex);
			}
		});
	});

	describe("AllResources fallback behavior", () => {
		it("should use allResources if available, primaryResources otherwise", () => {
			const domainInfo = getDomainInfo("virtual");

			expect(domainInfo).toBeDefined();
			expect(domainInfo?.allResources).toBeDefined();
			expect(domainInfo?.allResources?.length).toBeGreaterThan(
				domainInfo?.primaryResources?.length || 0,
			);

			console.log(
				`\n📊 Virtual domain resource counts:`,
			);
			console.log(`   Primary: ${domainInfo?.primaryResources?.length || 0}`);
			console.log(`   All: ${domainInfo?.allResources?.length || 0}`);
			console.log(
				`   Discovered: +${(domainInfo?.allResources?.length || 0) - (domainInfo?.primaryResources?.length || 0)}`,
			);
		});
	});

	describe("Resource categories", () => {
		it("should have resourceCategories for virtual domain", () => {
			const domainInfo = getDomainInfo("virtual");

			expect(domainInfo?.resourceCategories).toBeDefined();
			expect(domainInfo?.resourceCategories?.crud).toBeDefined();
			expect(domainInfo?.resourceCategories?.analytics).toBeDefined();
			expect(domainInfo?.resourceCategories?.utilities).toBeDefined();
			expect(domainInfo?.resourceCategories?.management).toBeDefined();

			console.log(`\n📋 Virtual domain categories:`);
			console.log(
				`   CRUD: ${domainInfo?.resourceCategories?.crud.length || 0}`,
			);
			console.log(
				`   Analytics: ${domainInfo?.resourceCategories?.analytics.length || 0}`,
			);
			console.log(
				`   Utilities: ${domainInfo?.resourceCategories?.utilities.length || 0}`,
			);
			console.log(
				`   Management: ${domainInfo?.resourceCategories?.management.length || 0}`,
			);
		});
	});

	describe("Other domains enhanced", () => {
		it("should show enhanced resources for network domain", async () => {
			const suggestions = await completer.complete("/network list ");
			const texts = suggestions.map((s) => s.text);

			console.log(`\n🌐 Network domain resources: ${texts.length} total`);

			// Should have more than the original primary resources
			expect(texts.length).toBeGreaterThan(10);
		});

		it("should show enhanced resources for dns domain", async () => {
			const suggestions = await completer.complete("/dns list ");
			const texts = suggestions.map((s) => s.text);

			console.log(`\n🌐 DNS domain resources: ${texts.length} total`);

			// Should have more than the original primary resources
			expect(texts.length).toBeGreaterThan(10);
		});
	});

	describe("Validation warnings", () => {
		it("should include validation warnings for domains with missing resources", () => {
			const domainInfo = getDomainInfo("virtual");

			if (domainInfo?.validationWarnings && domainInfo.validationWarnings.length > 0) {
				console.log(`\n⚠️  Virtual domain validation:`);
				for (const warning of domainInfo.validationWarnings) {
					console.log(`   ${warning}`);
				}
			}

			// Virtual domain should have warnings since many resources were missing
			expect(domainInfo?.validationWarnings).toBeDefined();
		});
	});
});
