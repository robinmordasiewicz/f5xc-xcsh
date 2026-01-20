/**
 * WAF Domain Removal Unit Tests
 *
 * Tests that verify the WAF domain has been completely removed from the codebase
 * and that all WAF-related commands properly fail with helpful error messages.
 *
 * Critical test suite for regression protection.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DOMAIN_COUNT } from '../../../src/types/domains_generated.js';
import { generatedDomains } from '../../../src/types/domains_generated.js';
import { executeCommand } from '../../../src/repl/executor.js';
import { createTestSession } from '../../utils/test-helpers.js';
import type { REPLSession } from '../../../src/repl/session.js';

describe('WAF Domain Removal', () => {
	let session: REPLSession;

	beforeEach(() => {
		session = createTestSession({
			authenticated: true,
			namespace: 'default',
		});
	});

	describe('Domain Registry', () => {
		it('should have exactly 37 domains (not 38)', () => {
			expect(DOMAIN_COUNT).toBe(37);
		});

		it('should not include "waf" domain', () => {
			expect(generatedDomains.has('waf')).toBe(false);
		});

		it('should include "virtual" domain', () => {
			expect(generatedDomains.has('virtual')).toBe(true);
		});

		it('should have valid domain structure', () => {
			expect(generatedDomains).toBeDefined();
			expect(generatedDomains.size).toBe(37);
		});
	});

	describe('Command Validation', () => {
		it('should reject "waf" commands with clear error', async () => {
			const result = await executeCommand('waf list', session);

			expect(result.error).toBeDefined();
			expect(result.error).toContain("Unknown domain: waf");
			expect(result.error).toContain("Run 'domains' to see available domains");
		});

		it('should reject all WAF command variations', async () => {
			const commands = [
				'waf --help',
				'waf list',
				'waf create app_firewall',
				'waf get app_firewall test',
				'waf delete app_firewall test',
			];

			for (const cmd of commands) {
				const result = await executeCommand(cmd, session);
				expect(result.error).toBeDefined();
				expect(result.error).toContain("Unknown domain: waf");
			}
		});

		it('should reject WAF even with valid resource names', async () => {
			const result = await executeCommand('waf list app_firewall --namespace default', session);

			expect(result.error).toBeDefined();
			expect(result.error).toContain("Unknown domain: waf");
		});

		it.skip('should provide helpful error for WAF users', async () => {
			const result = await executeCommand('waf list', session);

			// Error should guide user to discover correct domain
			expect(result.error).toMatch(/domains|available/i);
		});
	});

	describe('Domain List Command', () => {
		it.skip('domains command should list 37 domains', async () => {
			const result = await executeCommand('domains', session);

			expect(result.error).toBeUndefined();
			expect(result.output).toBeDefined();

			// Count domain entries (excluding header and empty lines)
			const domainLines = result.output.filter((line: string) => {
				const trimmed = line.trim();
				return trimmed.length > 0 && !trimmed.startsWith('─') && !trimmed.includes('DOMAIN');
			});

			expect(domainLines.length).toBe(37);
		});

		it('domains list should not contain "waf"', async () => {
			const result = await executeCommand('domains', session);

			const fullOutput = result.output.join('\n');

			// Should not have "waf" as a standalone word (avoid false positives like "firewall")
			expect(fullOutput).not.toMatch(/\bwaf\b/i);
		});

		it('domains list should contain "virtual"', async () => {
			const result = await executeCommand('domains', session);

			const fullOutput = result.output.join('\n');
			expect(fullOutput).toMatch(/\bvirtual\b/i);
		});
	});

	describe('Case Sensitivity', () => {
		it('should reject "WAF" (uppercase)', async () => {
			const result = await executeCommand('WAF list', session);

			expect(result.error).toBeDefined();
			expect(result.error).toMatch(/unknown domain/i);
		});

		it('should reject "Waf" (mixed case)', async () => {
			const result = await executeCommand('Waf list', session);

			expect(result.error).toBeDefined();
			expect(result.error).toMatch(/unknown domain/i);
		});
	});

	describe('Non-existent Domain Handling', () => {
		it('should handle invalid domain consistently with WAF', async () => {
			const result1 = await executeCommand('waf list', session);
			const result2 = await executeCommand('nonexistent list', session);

			// Both should fail with similar error structure
			expect(result1.error).toContain("Unknown domain");
			expect(result2.error).toContain("Unknown domain");
		});

		it.skip('should provide same helpful tip for all invalid domains', async () => {
			const result1 = await executeCommand('waf list', session);
			const result2 = await executeCommand('invalid list', session);

			// Both should suggest running 'domains' command
			expect(result1.error).toMatch(/domains/i);
			expect(result2.error).toMatch(/domains/i);
		});
	});
});
