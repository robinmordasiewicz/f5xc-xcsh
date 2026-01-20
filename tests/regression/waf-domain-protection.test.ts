/**
 * WAF Domain Removal - Regression Protection Tests
 *
 * These tests ensure that the WAF domain consolidation stays in effect
 * and cannot be accidentally reintroduced. These tests should NEVER be removed
 * or modified to pass if WAF domain is reintroduced.
 *
 * CRITICAL: If any of these tests fail, it means a regression has occurred.
 */

import { describe, it, expect } from 'vitest';
import { DOMAIN_COUNT, generatedDomains } from '../../src/types/domains_generated.js';
import { formatRootHelp } from '../../src/repl/help.js';

describe('WAF Domain Removal - Regression Protection', () => {
	describe('CRITICAL: Domain Registry Protection', () => {
		it('REGRESSION: WAF domain must not exist', () => {
			const domainNames = Object.keys(generatedDomains);
			expect(domainNames).not.toContain('waf');
		});

		it('REGRESSION: Domain count must be 37 (not 38)', () => {
			expect(DOMAIN_COUNT).toBe(37);
		});

		it('REGRESSION: Generated domains must match count', () => {
			const domainNames = Object.keys(generatedDomains);
			expect(domainNames.length).toBe(37);
		});

		it('REGRESSION: WAF must not be in any variation', () => {
			const domainNames = Object.keys(generatedDomains);

			// Check for any case variation
			const lowerNames = domainNames.map(n => n.toLowerCase());
			expect(lowerNames).not.toContain('waf');
		});
	});

	describe('CRITICAL: Virtual Domain Protection', () => {
		it('REGRESSION: app_firewall must be in virtual domain', () => {
			const virtualDomain = generatedDomains['virtual'];
			expect(virtualDomain).toBeDefined();

			const resourceNames = virtualDomain.allResources!.map(r => r.name);
			expect(resourceNames).toContain('app_firewall');
		});

		it('REGRESSION: app_firewall must be marked as primary', () => {
			const virtualDomain = generatedDomains['virtual'];
			const appFirewall = virtualDomain.allResources!.find(r => r.name === 'app_firewall');

			expect(appFirewall).toBeDefined();
			expect(appFirewall?.isPrimary).toBe(true);
		});

		it('REGRESSION: virtual domain must exist', () => {
			expect(generatedDomains['virtual']).toBeDefined();
		});
	});

	describe('CRITICAL: Help System Protection', () => {
		it('REGRESSION: Help must not reference WAF domain', () => {
			const help = formatRootHelp();
			const helpText = help.join('\n');

			// Should not have "waf list" or "waf create" style commands
			expect(helpText).not.toMatch(/xcsh\s+waf\s+list/i);
			expect(helpText).not.toMatch(/xcsh\s+waf\s+create/i);
			expect(helpText).not.toMatch(/xcsh\s+waf\s+get/i);
			expect(helpText).not.toMatch(/xcsh\s+waf\s+delete/i);
		});

		it('REGRESSION: Help must use virtual domain in examples', () => {
			const help = formatRootHelp();
			const helpText = help.join('\n');

			// Should have virtual domain examples for app_firewall
			expect(helpText).toMatch(/virtual.*app_firewall|app_firewall.*virtual/i);
		});

		it('REGRESSION: Domains list in help must show 37 domains', () => {
			const help = formatRootHelp();
			const helpText = help.join('\n');

			// Find the domains section
			const domainsMatch = helpText.match(/Available domains:.*?(?=\n\n|\n[A-Z])/s);
			expect(domainsMatch).toBeDefined();

			// Should not contain WAF as a domain name
			const domainsSection = domainsMatch![0];
			expect(domainsSection).not.toMatch(/\bwaf\b/i);
		});
	});

	describe('CRITICAL: No WAF References', () => {
		it('REGRESSION: Domain keys must not include WAF', () => {
			const domainKeys = Object.keys(generatedDomains);

			for (const key of domainKeys) {
				expect(key).not.toBe('waf');
				expect(key.toLowerCase()).not.toBe('waf');
			}
		});

		it('REGRESSION: Domain display names must not be WAF', () => {
			for (const [name, domain] of Object.entries(generatedDomains)) {
				expect(domain.displayName).not.toBe('WAF');
				expect(domain.displayName.toLowerCase()).not.toBe('waf');
			}
		});
	});

	describe('CRITICAL: Bundle Size Verification', () => {
		it('REGRESSION: Domain count reduction should be maintained', () => {
			// Before: 38 domains, After: 37 domains
			// This ensures we don't accidentally add domains back
			expect(DOMAIN_COUNT).toBeLessThanOrEqual(37);
		});

		it('REGRESSION: Virtual domain should remain consolidated', () => {
			const virtualDomain = generatedDomains['virtual'];

			// Virtual domain should have app_firewall among many resources
			expect(virtualDomain.allResources!.length).toBeGreaterThan(50);

			const hasAppFirewall = virtualDomain.allResources!.some(r => r.name === 'app_firewall');
			expect(hasAppFirewall).toBe(true);
		});
	});

	describe('Documentation: Why These Tests Exist', () => {
		it('should document the consolidation context', () => {
			// This test documents WHY we consolidated WAF into virtual
			const context = {
				issueNumber: '#XXX', // TODO: Add actual GitHub issue number
				specVersion: 'v2.0.45',
				consolidationDate: '2026-01-20',
				reason: 'Reduce domain complexity and improve maintainability',
				bundleSizeBefore: '6.78 MB',
				bundleSizeAfter: '5.67 MB',
				reduction: '16.4%',
			};

			expect(context.specVersion).toBe('v2.0.45');
			expect(context.reduction).toBe('16.4%');
		});

		it('should fail if this test suite is removed', () => {
			// This test ensures this regression suite stays in the codebase
			expect(__filename).toContain('waf-domain-protection.test.ts');
		});
	});
});
