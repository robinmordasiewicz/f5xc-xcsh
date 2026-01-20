/**
 * Virtual Domain Resources Unit Tests
 *
 * Tests that verify app_firewall is properly located in the virtual domain
 * and that other virtual domain resources remain functional.
 *
 * Critical test suite for verifying resource migration.
 */

import { describe, it, expect } from 'vitest';
import { generatedDomains } from '../../../src/types/domains_generated.js';
import type { DomainInfo } from '../../../src/types/domains.js';

describe('Virtual Domain Resources', () => {
	let virtualDomain: DomainInfo;

	// Load virtual domain before tests
	beforeAll(() => {
		virtualDomain = generatedDomains.get('virtual');
	});

	describe('Domain Structure', () => {
		it('should have virtual domain defined', () => {
			expect(virtualDomain).toBeDefined();
			expect(virtualDomain.name).toBe('virtual');
		});

		it('should have resources defined', () => {
			expect(virtualDomain.allResources).toBeDefined();
			expect(Array.isArray(virtualDomain.allResources)).toBe(true);
			expect(virtualDomain.allResources!.length).toBeGreaterThan(0);
		});
	});

	describe('app_firewall Resource', () => {
		it('should include app_firewall in virtual domain', () => {
			const resourceNames = virtualDomain.allResources!.map(r => r.name);
			expect(resourceNames).toContain('app_firewall');
		});

		it('should have app_firewall metadata', () => {
			const appFirewall = virtualDomain.allResources!.find(r => r.name === 'app_firewall');

			expect(appFirewall).toBeDefined();
			expect(appFirewall!.name).toBe('app_firewall');
			expect(appFirewall!.description).toBeDefined();
			expect(appFirewall!.tier).toBeDefined();
		});

		it('should mark app_firewall as primary resource', () => {
			const appFirewall = virtualDomain.allResources!.find(r => r.name === 'app_firewall');

			expect(appFirewall?.isPrimary).toBe(true);
		});

		it('should have correct app_firewall tier', () => {
			const appFirewall = virtualDomain.allResources!.find(r => r.name === 'app_firewall');

			// app_firewall should be in Advanced tier
			expect(appFirewall?.tier).toBe('Advanced');
		});

		it('should have app_firewall icon', () => {
			const appFirewall = virtualDomain.allResources!.find(r => r.name === 'app_firewall');

			// Should have shield icon
			expect(appFirewall?.icon).toBeDefined();
			expect(appFirewall?.icon).toBe('🛡️');
		});

		it('should have descriptive text for app_firewall', () => {
			const appFirewall = virtualDomain.allResources!.find(r => r.name === 'app_firewall');

			expect(appFirewall?.description).toMatch(/firewall|protection|threat|security/i);
		});
	});

	describe('Other Virtual Resources', () => {
		it('should still have http_loadbalancer', () => {
			const resourceNames = virtualDomain.allResources!.map(r => r.name);
			expect(resourceNames).toContain('http_loadbalancer');
		});

		it('should still have origin_pool', () => {
			const resourceNames = virtualDomain.allResources!.map(r => r.name);
			expect(resourceNames).toContain('origin_pool');
		});

		it('should still have healthcheck', () => {
			const resourceNames = virtualDomain.allResources!.map(r => r.name);
			expect(resourceNames).toContain('healthcheck');
		});

		it('should maintain resource count', () => {
			// Virtual domain should have many resources (50+)
			expect(virtualDomain.allResources!.length).toBeGreaterThan(50);
		});

		it('should have correct primary resources count', () => {
			const primaryResources = virtualDomain.allResources!.filter(r => r.isPrimary);

			// Virtual domain should have ~6 primary resources
			expect(primaryResources.length).toBeGreaterThanOrEqual(6);
		});
	});

	describe('Virtual Domain Metadata', () => {
		it('should have correct display name', () => {
			expect(virtualDomain.displayName).toBe('Virtual');
		});

		it('should have description', () => {
			expect(virtualDomain.description).toBeDefined();
			expect(virtualDomain.description.length).toBeGreaterThan(0);
		});

		it('should have complexity level', () => {
			expect(virtualDomain.complexity).toBe('advanced');
		});

		it('should have category', () => {
			expect(virtualDomain.category).toBe('Networking');
		});

		it('should have icon', () => {
			expect(virtualDomain.icon).toBeDefined();
		});
	});

	describe('Resource Consistency', () => {
		it('should have all resources with valid names', () => {
			const resources = virtualDomain.allResources!;

			for (const resource of resources) {
				expect(resource.name).toBeDefined();
				expect(resource.name.length).toBeGreaterThan(0);
				expect(resource.name).toMatch(/^[a-z0-9_-]+$/); // snake_case, kebab-case, with digits
			}
		});

		it('should have all resources with tiers', () => {
			const resources = virtualDomain.allResources!;

			for (const resource of resources) {
				expect(resource.tier).toBeDefined();
				expect(['Free', 'Standard', 'Advanced', 'Enterprise', 'WAAP']).toContain(resource.tier);
			}
		});

		it('should have all resources with descriptions', () => {
			const resources = virtualDomain.allResources!;

			for (const resource of resources) {
				expect(resource.description).toBeDefined();
				expect(resource.description.length).toBeGreaterThan(0);
			}
		});
	});

	describe('app_firewall Operations', () => {
		it('should support CRUD operations', () => {
			const appFirewall = virtualDomain.allResources!.find(r => r.name === 'app_firewall');

			expect(appFirewall?.operations).toBeDefined();
			expect(appFirewall?.operations).toContain('list');
			expect(appFirewall?.operations).toContain('get');
			expect(appFirewall?.operations).toContain('create');
			expect(appFirewall?.operations).toContain('delete');
		});

		it('should be categorized as CRUD resource', () => {
			const appFirewall = virtualDomain.allResources!.find(r => r.name === 'app_firewall');

			expect(appFirewall?.resourceCategory).toBe('crud');
		});
	});
});
