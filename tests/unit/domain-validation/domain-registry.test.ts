/**
 * Domain Registry Unit Tests
 *
 * Tests that verify the domain registry structure and consistency
 * after WAF domain removal.
 */

import { describe, it, expect } from 'vitest';
import { DOMAIN_COUNT, SPEC_VERSION, generatedDomains } from '../../../src/types/domains_generated.js';

describe('Domain Registry', () => {
	describe('Registry Structure', () => {
		it('should have correct domain count', () => {
			expect(DOMAIN_COUNT).toBe(37);
		});

		it('should match generated domains count', () => {
			expect(generatedDomains.size).toBe(DOMAIN_COUNT);
			expect(generatedDomains.size).toBe(37);
		});

		it('should have spec version defined', () => {
			expect(SPEC_VERSION).toBeDefined();
			expect(SPEC_VERSION).toMatch(/^v?\d+\.\d+\.\d+/);
		});

		it('should have current spec version', () => {
			// Should be v2.0.45 or later
			expect(SPEC_VERSION).toMatch(/v?2\.0\.(4[5-9]|[5-9]\d)/);
		});
	});

	describe('Domain Names', () => {
		it('should not contain "waf"', () => {
			expect(generatedDomains.has('waf')).toBe(false);
		});

		it('should contain expected core domains', () => {
			const coreDomains = ['virtual', 'network', 'dns', 'certificates', 'network_security'];

			for (const domain of coreDomains) {
				expect(generatedDomains.has(domain)).toBe(true);
			}
		});

		it('should have all domain names in snake_case', () => {
			for (const name of generatedDomains.keys()) {
				expect(name).toMatch(/^[a-z_]+$/);
			}
		});
	});

	describe('Domain Metadata', () => {
		it('should have all domains with display names', () => {
			for (const [name, domain] of generatedDomains.entries()) {
				expect(domain.displayName).toBeDefined();
				expect(domain.displayName.length).toBeGreaterThan(0);
			}
		});

		it('should have all domains with descriptions', () => {
			for (const [name, domain] of generatedDomains.entries()) {
				expect(domain.description).toBeDefined();
				expect(domain.description.length).toBeGreaterThan(0);
			}
		});

		it('should have all domains with short descriptions', () => {
			for (const [name, domain] of generatedDomains.entries()) {
				expect(domain.descriptionShort).toBeDefined();
				expect(domain.descriptionShort.length).toBeGreaterThan(0);
				expect(domain.descriptionShort.length).toBeLessThan(100);
			}
		});

		it('should have all domains with complexity levels', () => {
			const validComplexity = ['simple', 'moderate', 'advanced'];

			for (const [name, domain] of generatedDomains.entries()) {
				if (domain.complexity) {
					expect(validComplexity).toContain(domain.complexity);
				}
			}
		});

		it('should have all domains with icons', () => {
			for (const [name, domain] of generatedDomains.entries()) {
				expect(domain.icon).toBeDefined();
				// Icons should be emoji characters (typically 1-2 characters)
				expect(domain.icon!.length).toBeGreaterThan(0);
				expect(domain.icon!.length).toBeLessThan(5);
			}
		});
	});

	describe('Domain Resources', () => {
		it('should have all domains with resources', () => {
			for (const [name, domain] of generatedDomains.entries()) {
				expect(domain.allResources).toBeDefined();
				expect(Array.isArray(domain.allResources)).toBe(true);
			}
		});

		it('should have no domain with zero resources', () => {
			for (const [name, domain] of generatedDomains.entries()) {
				expect(domain.allResources!.length).toBeGreaterThan(0);
			}
		});

		it('should have resources with valid structures', () => {
			for (const [domainName, domain] of generatedDomains.entries()) {
				for (const resource of domain.allResources || []) {
					expect(resource.name).toBeDefined();
					expect(resource.tier).toBeDefined();
					expect(resource.description).toBeDefined();
				}
			}
		});
	});

	describe('Virtual Domain Special Cases', () => {
		it('should have virtual domain defined', () => {
			expect(generatedDomains.get('virtual')).toBeDefined();
		});

		it('should have app_firewall in virtual domain', () => {
			const virtualDomain = generatedDomains.get('virtual');
			const resourceNames = virtualDomain.allResources!.map(r => r.name);

			expect(resourceNames).toContain('app_firewall');
		});

		it('should have large resource count in virtual', () => {
			const virtualDomain = generatedDomains.get('virtual');

			// Virtual domain is large with 50+ resources
			expect(virtualDomain.allResources!.length).toBeGreaterThan(50);
		});
	});

	describe('Domain Consistency', () => {
		it('should have unique domain names', () => {
			const domainNames = Array.from(generatedDomains.keys());
			const uniqueNames = new Set(domainNames);

			expect(uniqueNames.size).toBe(domainNames.length);
		});

		it('should have consistent naming between key and name', () => {
			for (const [key, domain] of generatedDomains.entries()) {
				expect(domain.name).toBe(key);
			}
		});

		it('should have all domains with valid categories', () => {
			const validCategories = [
				'Networking',
				'Security',
				'Cloud Services',
				'Infrastructure',
				'Management',
				'Configuration',
				'Monitoring',
				'Storage',
			];

			for (const [name, domain] of generatedDomains.entries()) {
				if (domain.category) {
					// Category should be one of the known categories or undefined
					expect([...validCategories, undefined]).toContain(domain.category);
				}
			}
		});
	});

	describe('Regression Protection', () => {
		it('REGRESSION: should never have 38 domains', () => {
			expect(DOMAIN_COUNT).not.toBe(38);
		});

		it('REGRESSION: WAF domain must stay removed', () => {
			const domainNames = Array.from(generatedDomains.keys());
			expect(domainNames).not.toContain('waf');
		});

		it('REGRESSION: app_firewall must stay in virtual', () => {
			const virtualDomain = generatedDomains.get('virtual');
			const resourceNames = virtualDomain.allResources!.map(r => r.name);

			expect(resourceNames).toContain('app_firewall');
		});
	});
});
