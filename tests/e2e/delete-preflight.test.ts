/**
 * Delete Pre-flight End-to-End Tests
 *
 * Tests delete operation pre-flight checks with actual CLI execution:
 * - Delete non-existent resource (without flag) -> exit code 5
 * - Delete non-existent resource (with --if-exists) -> exit code 0
 * - Delete with --dry-run -> shows plan, no API call
 * - Similar name suggestions on 404
 *
 * REQUIREMENTS:
 * - Valid F5 XC authentication (F5XC_API_TOKEN or logged in via xcsh login)
 * - Network access to F5 XC API
 * - Permissions to create/delete healthcheck resources
 *
 * RUN WITH:
 * npm test tests/e2e/delete-preflight.test.ts
 *
 * NOTE: These tests make REAL API calls.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Test configuration
const TEST_NAMESPACE = "default";
const TEST_PREFIX = "xcsh-preflight-test";
const CLEANUP_DELAY = 1000;

// Generate unique resource names
function generateResourceName(base: string): string {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 1000);
	return `${TEST_PREFIX}-${base}-${timestamp}-${random}`;
}

// Execute xcsh commands using local development build
async function xcsh(command: string): Promise<{
	stdout: string;
	stderr: string;
	exitCode: number;
}> {
	try {
		const xcshPath = "node dist/index.js";
		const { stdout, stderr } = await execAsync(`${xcshPath} ${command}`, {
			timeout: 30000,
		});
		return { stdout, stderr, exitCode: 0 };
	} catch (error: any) {
		return {
			stdout: error.stdout || "",
			stderr: error.stderr || "",
			exitCode: error.code || 1,
		};
	}
}

// Wait for API consistency
async function waitForAPI(ms: number = CLEANUP_DELAY): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Delete Pre-flight End-to-End Tests", () => {
	// Track created resources for cleanup
	let createdResources: string[] = [];

	beforeEach(() => {
		createdResources = [];
	});

	afterEach(async () => {
		// Clean up all resources created during the test
		// Delete is idempotent by default - succeeds even if resource doesn't exist
		for (const resourceName of createdResources) {
			try {
				await xcsh(
					`virtual delete healthcheck --name ${resourceName} --namespace ${TEST_NAMESPACE}`,
				);
				await waitForAPI(500);
			} catch (error) {
				console.warn(`Failed to delete resource ${resourceName}:`, error);
			}
		}
		createdResources = [];
	});

	// ============================================================================
	// PREREQUISITE: Authentication Check
	// ============================================================================

	describe("PREREQUISITE: Authentication", () => {
		it("✓ Verifies authentication is configured", async () => {
			const result = await xcsh("login show context -o json");

			// Skip E2E tests if not authenticated
			if (result.exitCode !== 0) {
				console.log("Skipping E2E tests: Not authenticated");
				return;
			}

			expect(result.exitCode).toBe(0);
			expect(result.stdout).toBeTruthy();
		}, 30000);
	});

	// ============================================================================
	// CATEGORY 1: Delete Non-Existent Resource (Idempotent by Default)
	// ============================================================================

	describe("CATEGORY 1: Delete Non-Existent Resource (Idempotent)", () => {
		it("✓ DELETE non-existent resource succeeds with informational message (exit code 0)", async () => {
			// Use a very unlikely resource name
			const nonExistentName = `${TEST_PREFIX}-does-not-exist-${Date.now()}-xyz`;

			const result = await xcsh(
				`virtual delete healthcheck --name ${nonExistentName} --namespace ${TEST_NAMESPACE}`,
			);

			// Idempotent delete: should succeed with exit code 0
			expect(result.exitCode).toBe(0);

			// Should have informational message with resource type, name, and namespace
			const combined = result.stdout + result.stderr;
			expect(combined).toContain("does not exist");
			expect(combined).toContain("healthcheck");
			expect(combined).toContain(nonExistentName);
			expect(combined).toContain(TEST_NAMESPACE);
		}, 30000);

		it("✓ DELETE non-existent resource twice succeeds both times (idempotent)", async () => {
			const nonExistentName = `${TEST_PREFIX}-does-not-exist-${Date.now()}-abc`;

			// First delete attempt
			const result1 = await xcsh(
				`virtual delete healthcheck --name ${nonExistentName} --namespace ${TEST_NAMESPACE}`,
			);
			expect(result1.exitCode).toBe(0);

			// Second delete attempt (should also succeed)
			const result2 = await xcsh(
				`virtual delete healthcheck --name ${nonExistentName} --namespace ${TEST_NAMESPACE}`,
			);
			expect(result2.exitCode).toBe(0);
		}, 30000);
	});

	// ============================================================================
	// CATEGORY 2: Dry-Run Mode
	// ============================================================================

	describe("CATEGORY 2: Dry-Run Mode", () => {
		it("✓ DELETE with --dry-run shows plan for existing resource", async () => {
			// First create a resource
			const name = generateResourceName("dryrun-test");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);
			expect(createResult.exitCode).toBe(0);

			await waitForAPI();

			// Try dry-run delete
			const dryRunResult = await xcsh(
				`virtual delete healthcheck --name ${name} --namespace ${TEST_NAMESPACE} --dry-run`,
			);

			expect(dryRunResult.exitCode).toBe(0);
			const combined = dryRunResult.stdout + dryRunResult.stderr;
			expect(combined.toLowerCase().includes("would delete")).toBe(true);

			// Verify resource still exists (wasn't actually deleted)
			const getResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);
			expect(getResult.exitCode).toBe(0);
		}, 60000);

		it("✓ DELETE with --dry-run shows not found for non-existent resource", async () => {
			const nonExistentName = `${TEST_PREFIX}-dryrun-missing-${Date.now()}`;

			const result = await xcsh(
				`virtual delete healthcheck --name ${nonExistentName} --namespace ${TEST_NAMESPACE} --dry-run`,
			);

			// Dry-run with non-existent resource still shows not found info
			// Exit code 5 for dry-run when resource doesn't exist (informational)
			expect(result.exitCode).toBe(5);
		}, 30000);
	});

	// ============================================================================
	// CATEGORY 3: Idempotent Delete Behavior
	// ============================================================================

	describe("CATEGORY 3: Idempotent Delete Behavior", () => {
		it("✓ DELETE with typo succeeds with informational message (idempotent)", async () => {
			// First create a resource with a known name
			const actualName = generateResourceName("suggestion-test");
			createdResources.push(actualName);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${actualName} --namespace ${TEST_NAMESPACE}`,
			);
			expect(createResult.exitCode).toBe(0);

			await waitForAPI();

			// Try to delete with a typo (missing last character)
			const typoName = actualName.slice(0, -1);

			const result = await xcsh(
				`virtual delete healthcheck --name ${typoName} --namespace ${TEST_NAMESPACE}`,
			);

			// Idempotent: should succeed with exit code 0
			expect(result.exitCode).toBe(0);

			// Should have informational message with resource type, name, and namespace
			const combined = result.stdout + result.stderr;
			expect(combined).toContain("does not exist");
			expect(combined).toContain("healthcheck");
			expect(combined).toContain(typoName);
			expect(combined).toContain(TEST_NAMESPACE);
		}, 60000);
	});

	// ============================================================================
	// CATEGORY 4: Successful Delete with Pre-flight
	// ============================================================================

	describe("CATEGORY 4: Successful Delete with Pre-flight", () => {
		it("✓ DELETE existing resource after pre-flight check succeeds", async () => {
			// Create a resource
			const name = generateResourceName("delete-success");
			// Don't add to createdResources - we're intentionally deleting it

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);
			expect(createResult.exitCode).toBe(0);

			await waitForAPI();

			// Delete it
			const deleteResult = await xcsh(
				`virtual delete healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);

			expect(deleteResult.exitCode).toBe(0);
			const combined = deleteResult.stdout + deleteResult.stderr;
			expect(combined.toLowerCase().includes("deleted")).toBe(true);

			await waitForAPI();

			// Verify it's gone
			const getResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);
			// Should fail to find it
			expect(getResult.exitCode).not.toBe(0);
		}, 60000);
	});
});
