/**
 * Healthcheck CRUD End-to-End Tests
 *
 * Tests actual API operations with F5 Distributed Cloud:
 * - CREATE: Test various flag combinations create real resources
 * - READ: Verify created resources can be retrieved
 * - DELETE: Clean up test resources
 *
 * REQUIREMENTS:
 * - Valid F5 XC authentication (F5XC_API_TOKEN or logged in via xcsh login)
 * - Network access to F5 XC API
 * - Permissions to create/delete healthcheck resources
 *
 * SAFETY:
 * - Uses unique names with timestamps to avoid conflicts
 * - Automatically cleans up created resources
 * - Uses beforeEach/afterEach to ensure cleanup even on failures
 *
 * RUN WITH:
 * npm test tests/e2e/healthcheck-crud.test.ts
 *
 * NOTE: These tests make REAL API calls and create REAL resources.
 * Use with caution and ensure you have appropriate permissions.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Test configuration
const TEST_NAMESPACE = "default";
const TEST_PREFIX = "xcsh-hc-test";
const CLEANUP_DELAY = 1000; // Wait 1s between operations for API consistency

// Helper to generate unique resource names
function generateResourceName(base: string): string {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 1000);
	return `${TEST_PREFIX}-${base}-${timestamp}-${random}`;
}

// Helper to execute xcsh commands using local development build
async function xcsh(command: string): Promise<{
	stdout: string;
	stderr: string;
	exitCode: number;
}> {
	try {
		// Use local development build instead of installed xcsh
		const xcshPath = "node dist/index.js";
		const { stdout, stderr } = await execAsync(`${xcshPath} ${command}`, {
			timeout: 30000, // 30 second timeout
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

// Helper to wait for API consistency
async function waitForAPI(ms: number = CLEANUP_DELAY): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper to parse JSON output
function parseJSON(output: string): any {
	try {
		return JSON.parse(output);
	} catch {
		return null;
	}
}

describe("Healthcheck CRUD End-to-End Tests", () => {
	// Track created resources for cleanup
	let createdResources: string[] = [];

	beforeEach(() => {
		createdResources = [];
	});

	afterEach(async () => {
		// Clean up all resources created during the test
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
	// CATEGORY 0: AUTHENTICATION CHECK
	// ============================================================================

	describe("PREREQUISITE: Authentication", () => {
		it("✓ Verifies authentication is configured", async () => {
			const result = await xcsh("login show context -o json");

			expect(result.exitCode).toBe(0);
			expect(result.stdout).toBeTruthy();

			const context = parseJSON(result.stdout);
			expect(context).toBeTruthy();
			expect(context.namespace).toBeTruthy();
		}, 30000);
	});

	// ============================================================================
	// CATEGORY 1: HTTP HEALTHCHECK CRUD
	// ============================================================================

	describe("CATEGORY 1: HTTP Healthcheck CRUD", () => {
		it("✓ CREATE: Minimal HTTP healthcheck (default type)", async () => {
			const name = generateResourceName("http-minimal");
			createdResources.push(name);

			// Create with minimal flags - should default to HTTP type
			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			expect(createResult.stderr).not.toContain("error");
			expect(createResult.stderr).not.toContain("failed");

			await waitForAPI();

			// Verify created with HTTP type
			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource).toBeTruthy();
			expect(resource.spec?.http_health_check).toBeDefined();
		}, 60000);

		it("✓ CREATE: Full HTTP healthcheck with all options", async () => {
			const name = generateResourceName("http-full");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --path /health --interval 20 --timeout 5 --healthy-threshold 2 --unhealthy-threshold 3 --jitter-percent 25 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.http_health_check?.path).toBe("/health");
			expect(resource.spec?.timeout).toBe(5);
			expect(resource.spec?.interval).toBe(20);
			expect(resource.spec?.healthy_threshold).toBe(2);
			expect(resource.spec?.unhealthy_threshold).toBe(3);
		}, 60000);

		it("✓ CREATE: HTTP healthcheck with use-http2 flag", async () => {
			const name = generateResourceName("http2");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --use-http2 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.http_health_check?.use_http2).toBe(true);
		}, 60000);

		it("✓ CREATE: HTTP healthcheck with expected status codes", async () => {
			const name = generateResourceName("http-status");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --expected-status-codes 200 --expected-status-codes 201 --expected-status-codes 200-299 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.http_health_check?.expected_status_codes).toBeDefined();
			expect(resource.spec?.http_health_check?.expected_status_codes).toContain("200");
		}, 60000);

		it("✓ READ: Can retrieve created HTTP healthcheck", async () => {
			const name = generateResourceName("http-read");
			createdResources.push(name);

			await xcsh(
				`virtual create healthcheck --name ${name} --type http --path /api/health --namespace ${TEST_NAMESPACE}`,
			);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			expect(readResult.exitCode).toBe(0);
			const resource = parseJSON(readResult.stdout);

			expect(resource.metadata?.name).toBe(name);
			expect(resource.spec?.http_health_check?.path).toBe("/api/health");
		}, 60000);

		it("✓ DELETE: Can delete HTTP healthcheck", async () => {
			const name = generateResourceName("http-delete");

			await xcsh(
				`virtual create healthcheck --name ${name} --type http --namespace ${TEST_NAMESPACE}`,
			);
			await waitForAPI();

			const deleteResult = await xcsh(
				`virtual delete healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);

			expect(deleteResult.exitCode).toBe(0);
			await waitForAPI();

			// Verify deleted
			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);
			expect(readResult.exitCode).not.toBe(0);
		}, 60000);
	});

	// ============================================================================
	// CATEGORY 2: TCP HEALTHCHECK CRUD
	// ============================================================================

	describe("CATEGORY 2: TCP Healthcheck CRUD", () => {
		it("✓ CREATE: Basic TCP healthcheck (connect-only)", async () => {
			const name = generateResourceName("tcp-basic");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type tcp --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.tcp_health_check).toBeDefined();
		}, 60000);

		it("✓ CREATE: TCP healthcheck with send payload", async () => {
			const name = generateResourceName("tcp-payload");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type tcp --send-payload PING --expected-response PONG --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.tcp_health_check?.send_payload).toBeDefined();
			expect(resource.spec?.tcp_health_check?.expected_response).toBeDefined();
		}, 60000);

		it("✓ CREATE: TCP healthcheck with hex payload", async () => {
			const name = generateResourceName("tcp-hex");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type tcp --send-payload 0x50494E47 --expected-response 0x504F4E47 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.tcp_health_check).toBeDefined();
		}, 60000);

		it("✓ READ: Can retrieve TCP healthcheck", async () => {
			const name = generateResourceName("tcp-read");
			createdResources.push(name);

			await xcsh(
				`virtual create healthcheck --name ${name} --type tcp --interval 30 --namespace ${TEST_NAMESPACE}`,
			);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			expect(readResult.exitCode).toBe(0);
			const resource = parseJSON(readResult.stdout);
			expect(resource.metadata?.name).toBe(name);
			expect(resource.spec?.tcp_health_check).toBeDefined();
		}, 60000);

		it("✓ DELETE: Can delete TCP healthcheck", async () => {
			const name = generateResourceName("tcp-delete");

			await xcsh(
				`virtual create healthcheck --name ${name} --type tcp --namespace ${TEST_NAMESPACE}`,
			);
			await waitForAPI();

			const deleteResult = await xcsh(
				`virtual delete healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);

			expect(deleteResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);
			expect(readResult.exitCode).not.toBe(0);
		}, 60000);

		it("✓ FULL CRUD: TCP healthcheck lifecycle", async () => {
			const name = generateResourceName("tcp-crud");
			createdResources.push(name);

			// CREATE
			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type tcp --send-payload HELLO --interval 15 --timeout 5 --namespace ${TEST_NAMESPACE}`,
			);
			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			// READ
			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);
			expect(readResult.exitCode).toBe(0);
			const resource = parseJSON(readResult.stdout);
			expect(resource.metadata?.name).toBe(name);
			expect(resource.spec?.tcp_health_check).toBeDefined();

			// DELETE
			const deleteResult = await xcsh(
				`virtual delete healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);
			expect(deleteResult.exitCode).toBe(0);
			await waitForAPI();

			// VERIFY DELETION
			const verifyResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
			);
			expect(verifyResult.exitCode).not.toBe(0);

			// Remove from cleanup since already deleted
			createdResources = createdResources.filter((r) => r !== name);
		}, 90000);
	});

	// ============================================================================
	// CATEGORY 3: UDP-ICMP HEALTHCHECK CRUD
	// ============================================================================

	describe("CATEGORY 3: UDP-ICMP Healthcheck CRUD", () => {
		it("✓ CREATE: Basic UDP-ICMP healthcheck (ICMP ping)", async () => {
			const name = generateResourceName("icmp-basic");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type udp-icmp --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.udp_icmp_health_check).toBeDefined();
		}, 60000);

		it("✓ CREATE: UDP-ICMP with custom intervals", async () => {
			const name = generateResourceName("icmp-custom");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type udp-icmp --interval 20 --timeout 5 --healthy-threshold 2 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.udp_icmp_health_check).toBeDefined();
			expect(resource.spec?.interval).toBe(20);
		}, 60000);
	});

	// ============================================================================
	// CATEGORY 4: VALIDATION EDGE CASES
	// ============================================================================

	describe("CATEGORY 4: Validation Edge Cases", () => {
		it("✓ VALIDATION: Invalid interval range fails", async () => {
			const name = generateResourceName("invalid-interval");

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --interval 1000 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).not.toBe(0);
			expect(
				createResult.stdout.includes("interval") ||
				createResult.stderr.includes("interval"),
			).toBe(true);
		}, 30000);

		it("✓ VALIDATION: Invalid timeout range fails", async () => {
			const name = generateResourceName("invalid-timeout");

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --timeout 1000 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).not.toBe(0);
		}, 30000);

		it("✓ VALIDATION: Invalid path (no leading slash) fails", async () => {
			const name = generateResourceName("invalid-path");

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --path health --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).not.toBe(0);
			expect(
				createResult.stdout.includes("path") ||
				createResult.stderr.includes("path"),
			).toBe(true);
		}, 30000);

		it("✓ VALIDATION: Invalid jitter percent fails", async () => {
			const name = generateResourceName("invalid-jitter");

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --jitter-percent 5 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).not.toBe(0);
		}, 30000);

		it("✓ VALIDATION: Invalid healthcheck type fails", async () => {
			const name = generateResourceName("invalid-type");

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type invalid --namespace ${TEST_NAMESPACE}`,
			);

			// Should fail with validation error for invalid type
			expect(createResult.exitCode).not.toBe(0);
			// Flag parser validates enum values and returns a specific error message
			expect(
				createResult.stdout.includes("Invalid value 'invalid' for --type") ||
				createResult.stdout.includes("Allowed: http, tcp, udp-icmp") ||
				createResult.stderr.includes("Invalid value 'invalid' for --type"),
			).toBe(true);
		}, 30000);
	});

	// ============================================================================
	// CATEGORY 4.5: HOST HEADER CHOICE ONEOF
	// ============================================================================

	describe("CATEGORY 4.5: Host Header Choice OneOf", () => {
		it("✓ CREATE: HTTP healthcheck with --use-origin-server-name", async () => {
			const name = generateResourceName("hc-origin-name");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --use-origin-server-name --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			// Verify in GET response
			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.http_health_check?.use_origin_server_name).toBeDefined();
			expect(resource.spec?.http_health_check?.host_header).toBeUndefined();
		}, 60000);

		it("✓ CREATE: HTTP healthcheck with --host-header", async () => {
			const name = generateResourceName("hc-host-header");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --host-header api.example.com --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			// Verify host_header field in GET response
			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.http_health_check?.host_header).toBe("api.example.com");
			expect(resource.spec?.http_health_check?.use_origin_server_name).toBeUndefined();
		}, 60000);

		it("✓ CREATE: HTTP healthcheck with --host-header and custom headers", async () => {
			const name = generateResourceName("hc-host-custom");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --host-header api.example.com --headers "X-Custom:value" --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			// host_header is a separate field
			expect(resource.spec?.http_health_check?.host_header).toBe("api.example.com");
			// Custom headers are in headers map, Host is NOT there
			expect(resource.spec?.http_health_check?.headers?.["X-Custom"]).toBe("value");
			expect(resource.spec?.http_health_check?.headers?.Host).toBeUndefined();
		}, 60000);

		it("✓ VALIDATION: Mutually exclusive host header flags fail", async () => {
			const name = generateResourceName("hc-mutual-excl");

			const createResult = await xcsh(
				`virtual create healthcheck --name ${name} --type http --use-origin-server-name --host-header api.example.com --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).not.toBe(0);
			expect(
				createResult.stdout.includes("mutually exclusive") ||
					createResult.stderr.includes("mutually exclusive"),
			).toBe(true);
		}, 30000);
	});

	// ============================================================================
	// CATEGORY 5: LIST OPERATIONS
	// ============================================================================

	describe("CATEGORY 5: List Operations", () => {
		it("✓ LIST: Can list healthchecks and find created resources", async () => {
			const name1 = generateResourceName("list1");
			const name2 = generateResourceName("list2");
			createdResources.push(name1, name2);

			// Create two healthchecks
			await xcsh(
				`virtual create healthcheck --name ${name1} --type http --namespace ${TEST_NAMESPACE}`,
			);
			await xcsh(
				`virtual create healthcheck --name ${name2} --type tcp --namespace ${TEST_NAMESPACE}`,
			);
			await waitForAPI();

			// List all
			const listResult = await xcsh(
				`virtual list healthcheck --namespace ${TEST_NAMESPACE} -o json`,
			);

			expect(listResult.exitCode).toBe(0);
			const list = parseJSON(listResult.stdout);

			expect(list).toBeTruthy();
			expect(Array.isArray(list.items)).toBe(true);

			// Find our created resources
			const names = list.items.map((item: any) => item.name);
			expect(names).toContain(name1);
			expect(names).toContain(name2);
		}, 60000);
	});

	// ============================================================================
	// CATEGORY 6: FULL CRUD WORKFLOW
	// ============================================================================

	describe("CATEGORY 6: Full CRUD Workflow", () => {
		it("✓ FULL CRUD: All healthcheck types lifecycle", async () => {
			// Test all three healthcheck types in one workflow
			const httpName = generateResourceName("crud-http");
			const tcpName = generateResourceName("crud-tcp");
			const icmpName = generateResourceName("crud-icmp");
			createdResources.push(httpName, tcpName, icmpName);

			// CREATE all types
			const httpCreate = await xcsh(
				`virtual create healthcheck --name ${httpName} --type http --path /health --namespace ${TEST_NAMESPACE}`,
			);
			expect(httpCreate.exitCode).toBe(0);

			const tcpCreate = await xcsh(
				`virtual create healthcheck --name ${tcpName} --type tcp --send-payload PING --namespace ${TEST_NAMESPACE}`,
			);
			expect(tcpCreate.exitCode).toBe(0);

			const icmpCreate = await xcsh(
				`virtual create healthcheck --name ${icmpName} --type udp-icmp --namespace ${TEST_NAMESPACE}`,
			);
			expect(icmpCreate.exitCode).toBe(0);

			await waitForAPI();

			// READ all types and verify correct type was created
			const httpRead = await xcsh(
				`virtual get healthcheck --name ${httpName} --namespace ${TEST_NAMESPACE} -o json`,
			);
			expect(parseJSON(httpRead.stdout).spec?.http_health_check).toBeDefined();

			const tcpRead = await xcsh(
				`virtual get healthcheck --name ${tcpName} --namespace ${TEST_NAMESPACE} -o json`,
			);
			expect(parseJSON(tcpRead.stdout).spec?.tcp_health_check).toBeDefined();

			const icmpRead = await xcsh(
				`virtual get healthcheck --name ${icmpName} --namespace ${TEST_NAMESPACE} -o json`,
			);
			expect(parseJSON(icmpRead.stdout).spec?.udp_icmp_health_check).toBeDefined();

			// DELETE all types
			for (const name of [httpName, tcpName, icmpName]) {
				const deleteResult = await xcsh(
					`virtual delete healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
				);
				expect(deleteResult.exitCode).toBe(0);
			}
			await waitForAPI();

			// VERIFY all deleted
			for (const name of [httpName, tcpName, icmpName]) {
				const verifyResult = await xcsh(
					`virtual get healthcheck --name ${name} --namespace ${TEST_NAMESPACE}`,
				);
				expect(verifyResult.exitCode).not.toBe(0);
			}

			// Remove from cleanup since we deleted them
			createdResources = [];
		}, 120000);
	});
});
