/**
 * Origin Pool CRUD End-to-End Tests
 *
 * Tests actual API operations with F5 Distributed Cloud:
 * - CREATE: Test various flag combinations create real resources
 * - READ: Verify created resources can be retrieved
 * - DELETE: Clean up test resources
 *
 * REQUIREMENTS:
 * - Valid F5 XC authentication (F5XC_API_TOKEN or logged in via xcsh login)
 * - Network access to F5 XC API
 * - Permissions to create/delete origin_pool resources
 *
 * SAFETY:
 * - Uses unique names with timestamps to avoid conflicts
 * - Automatically cleans up created resources
 * - Uses beforeEach/afterEach to ensure cleanup even on failures
 *
 * RUN WITH:
 * npm test tests/e2e/origin-pool-crud.test.ts
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
const TEST_PREFIX = "xcsh-test";
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

describe("Origin Pool CRUD End-to-End Tests", () => {
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
					`virtual delete origin_pool --name ${resourceName} --namespace ${TEST_NAMESPACE}`,
				);
				await waitForAPI(500);
			} catch (error) {
				console.warn(`Failed to delete resource ${resourceName}:`, error);
			}
		}
		createdResources = [];
	});

	// ============================================================================
	// AUTHENTICATION CHECK
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
	// CATEGORY 1: MINIMAL COMMAND (SMART DEFAULTS)
	// ============================================================================

	describe("CATEGORY 1: Minimal Command with Smart Defaults", () => {
		it("✓ CREATE: Minimal command succeeds with smart defaults", async () => {
			const name = generateResourceName("minimal");
			createdResources.push(name);

			// Create with minimal flags
			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			expect(createResult.stderr).not.toContain("error");
			expect(createResult.stderr).not.toContain("failed");

			await waitForAPI();
		}, 60000);

		it("✓ READ: Can retrieve created minimal resource", async () => {
			const name = generateResourceName("minimal-read");
			createdResources.push(name);

			// Create
			await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --namespace ${TEST_NAMESPACE}`,
			);
			await waitForAPI();

			// Read
			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			expect(readResult.exitCode).toBe(0);
			const resource = parseJSON(readResult.stdout);

			expect(resource).toBeTruthy();
			expect(resource.metadata?.name).toBe(name);
			expect(resource.spec?.port).toBe(80); // Smart default
			expect(resource.spec?.origin_servers).toHaveLength(1);
			expect(resource.spec?.origin_servers[0]?.public_ip?.ip).toBe("192.0.2.10");
		}, 60000);

		it("✓ DELETE: Can delete created resource", async () => {
			const name = generateResourceName("minimal-delete");

			// Create
			await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --namespace ${TEST_NAMESPACE}`,
			);
			await waitForAPI();

			// Delete
			const deleteResult = await xcsh(
				`virtual delete origin_pool --name ${name} --namespace ${TEST_NAMESPACE}`,
			);

			expect(deleteResult.exitCode).toBe(0);
			await waitForAPI();

			// Verify deleted
			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE}`,
			);

			// Verify that GET fails after DELETE (exit code should be non-zero)
			expect(readResult.exitCode).not.toBe(0);
		}, 60000);
	});

	// ============================================================================
	// CATEGORY 2: MULTIPLE ORIGINS (PRIMARY USE CASE)
	// ============================================================================

	describe("CATEGORY 2: Multiple Origins (PRIMARY USE CASE)", () => {
		it("✓ CREATE: Multiple public IPs creates correct resource", async () => {
			const name = generateResourceName("multi-ip");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --public-ip 192.0.2.11 --public-ip 192.0.2.12 --port 8080 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			// Verify created correctly
			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.origin_servers).toHaveLength(3);
			expect(resource.spec?.port).toBe(8080);
		}, 60000);

		it("✓ CREATE: Multiple public names creates correct resource", async () => {
			const name = generateResourceName("multi-dns");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-name backend1.example.com --public-name backend2.example.com --port 443 --use-tls --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.origin_servers).toHaveLength(2);
			expect(resource.spec?.port).toBe(443);
			expect(resource.spec?.use_tls).toBeDefined();
		}, 60000);

	it("✓ CREATE: --algorithm LEAST_REQUEST works", async () => {
		const name = generateResourceName("algo-least-req");
		createdResources.push(name);

		const createResult = await xcsh(
			`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --algorithm LEAST_REQUEST --namespace ${TEST_NAMESPACE}`,
		);

		expect(createResult.exitCode).toBe(0);
		await waitForAPI();

		const readResult = await xcsh(
			`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
		);

		const resource = parseJSON(readResult.stdout);
		expect(resource.spec?.loadbalancer_algorithm).toBe("LEAST_REQUEST");
	}, 60000);
	});

	// ============================================================================
	// CATEGORY 3: CIRCUIT BREAKER (CONSOLIDATED FLAGS)
	// ============================================================================

	describe("CATEGORY 3: Circuit Breaker Features", () => {
		it("✓ CREATE: --circuit-breaker default works", async () => {
			const name = generateResourceName("cb-default");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --circuit-breaker default --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.advanced_options?.default_circuit_breaker).toBeDefined();
		}, 60000);

		it("✓ CREATE: --circuit-breaker custom with children works", async () => {
			const name = generateResourceName("cb-custom");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --circuit-breaker custom --cb-connection-limit 1000 --cb-max-requests 500 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.advanced_options?.circuit_breaker).toBeDefined();
			expect(
				resource.spec?.advanced_options?.circuit_breaker?.connection_limit,
			).toBe(1000);
			expect(resource.spec?.advanced_options?.circuit_breaker?.max_requests).toBe(
				500,
			);
		}, 60000);

		it("✓ VALIDATION: Child flag without parent fails", async () => {
			const name = generateResourceName("cb-invalid");

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --cb-connection-limit 1000 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).not.toBe(0);
			expect(
				createResult.stdout.includes("requires --circuit-breaker=custom") ||
					createResult.stdout.includes("Validation errors"),
			).toBe(true);
		}, 30000);
	});

	// ============================================================================
	// CATEGORY 4: OUTLIER DETECTION (CONSOLIDATED FLAGS)
	// ============================================================================

	describe("CATEGORY 4: Outlier Detection Features", () => {
		it("✓ CREATE: --outlier-detection custom with children works", async () => {
			const name = generateResourceName("od-custom");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --outlier-detection custom --od-consecutive-5xx 5 --od-max-ejection-percent 50 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.advanced_options?.outlier_detection).toBeDefined();
			expect(
				resource.spec?.advanced_options?.outlier_detection?.consecutive_5xx,
			).toBe(5);
		}, 60000);
	});

	// ============================================================================
	// CATEGORY 5: HTTP PROTOCOL (CONDITIONAL CHILDREN)
	// ============================================================================

	describe("CATEGORY 5: HTTP Protocol Features", () => {
		it("✓ CREATE: --http-protocol http1 with header transform works", async () => {
			const name = generateResourceName("http1");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --http-protocol http1 --http1-header-transform proper_case_header_transformation --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.advanced_options?.http1_config).toBeDefined();
		}, 60000);

		it("✓ CREATE: --http-protocol http2 works", async () => {
			const name = generateResourceName("http2");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --http-protocol http2 --http2-enabled true --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.advanced_options?.http2_options).toBeDefined();
		}, 60000);
	});

	// ============================================================================
	// CATEGORY 6: SUBSET LOAD BALANCING
	// ============================================================================

	describe("CATEGORY 6: Subset Load Balancing", () => {
		it("✓ CREATE: --subset-lb enable with keys works", async () => {
			const name = generateResourceName("subset");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --subset-lb enable --subset-keys zone,version --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.advanced_options?.enable_subsets).toBeDefined();
		}, 60000);
	});

	// ============================================================================
	// CATEGORY 7: COMPLEX MULTI-FEATURE REQUESTS
	// ============================================================================

	describe("CATEGORY 7: Complex Multi-Feature Configurations", () => {
		it("✓ CREATE: Multiple advanced features combine correctly", async () => {
			const name = generateResourceName("complex");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --circuit-breaker custom --cb-connection-limit 1000 --outlier-detection custom --od-consecutive-5xx 5 --http-protocol auto --panic-threshold-mode percentage --panic-threshold 50 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);

			// Verify all features present
			expect(resource.spec?.advanced_options?.circuit_breaker).toBeDefined();
			expect(resource.spec?.advanced_options?.outlier_detection).toBeDefined();
			expect(resource.spec?.advanced_options?.auto_http_config).toBeDefined();
			expect(resource.spec?.advanced_options?.panic_threshold).toBe(50);
		}, 60000);

		it("✓ FULL CRUD: Production-grade configuration lifecycle", async () => {
			const name = generateResourceName("prod");
			createdResources.push(name);

			// CREATE
			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-name backend1.example.com --public-name backend2.example.com --port 443 --use-tls --algorithm ROUND_ROBIN --circuit-breaker default --connection-pool enable-reuse --endpoint-selection DISTRIBUTED --source-ip-persistence enable --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			// READ
			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			expect(readResult.exitCode).toBe(0);
			const resource = parseJSON(readResult.stdout);

			expect(resource.metadata?.name).toBe(name);
			expect(resource.spec?.origin_servers).toHaveLength(2);
			expect(resource.spec?.port).toBe(443);
			expect(resource.spec?.use_tls).toBeDefined();
			expect(resource.spec?.loadbalancer_algorithm).toBe("ROUND_ROBIN");
			expect(resource.spec?.endpoint_selection).toBe("DISTRIBUTED");
			expect(resource.spec?.advanced_options?.default_circuit_breaker).toBeDefined();
			expect(resource.spec?.advanced_options?.enable_conn_pool_reuse).toBeDefined();
			expect(
				resource.spec?.advanced_options?.enable_lb_source_ip_persistance,
			).toBeDefined();

			// DELETE
			const deleteResult = await xcsh(
				`virtual delete origin_pool --name ${name} --namespace ${TEST_NAMESPACE}`,
			);

			expect(deleteResult.exitCode).toBe(0);
			await waitForAPI();

			// Verify deletion
			const verifyResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE}`,
			);

			expect(verifyResult.exitCode).not.toBe(0);

			// Remove from cleanup list since we already deleted it
			createdResources = createdResources.filter((r) => r !== name);
		}, 90000);
	});

	// ============================================================================
	// CATEGORY 8: LIST OPERATIONS
	// ============================================================================

	describe("CATEGORY 8: List Operations", () => {
		it("✓ LIST: Can list origin pools and find created resources", async () => {
			const name1 = generateResourceName("list1");
			const name2 = generateResourceName("list2");
			createdResources.push(name1, name2);

			// Create two resources
			await xcsh(
				`virtual create origin_pool --name ${name1} --public-ip 192.0.2.10 --namespace ${TEST_NAMESPACE}`,
			);
			await xcsh(
				`virtual create origin_pool --name ${name2} --public-ip 192.0.2.11 --namespace ${TEST_NAMESPACE}`,
			);
			await waitForAPI();

			// List all
			const listResult = await xcsh(
				`virtual list origin_pool --namespace ${TEST_NAMESPACE} -o json`,
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
	// CATEGORY 9: ADDITIONAL ORIGIN SERVER TYPES
	// ============================================================================

	describe("CATEGORY 9: Additional Origin Server Types", () => {
		it("✓ CREATE: --private-ip with --site works", async () => {
			const name = generateResourceName("private-ip");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --private-ip 10.0.1.10 --site test-site --port 8080 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.origin_servers).toHaveLength(1);
			expect(resource.spec?.origin_servers[0]?.private_ip).toBeDefined();
			expect(resource.spec?.origin_servers[0]?.private_ip?.ip).toBe("10.0.1.10");
		}, 60000);

		it("✓ CREATE: --private-name with --site works", async () => {
			const name = generateResourceName("private-name");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --private-name backend.internal --site test-site --port 8080 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.origin_servers).toHaveLength(1);
			expect(resource.spec?.origin_servers[0]?.private_name).toBeDefined();
			expect(resource.spec?.origin_servers[0]?.private_name?.dns_name).toBe(
				"backend.internal",
			);
		}, 60000);

		it("✓ CREATE: --k8s-service with --site works", async () => {
			const name = generateResourceName("k8s-svc");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --k8s-service nginx-service --site test-site --port 80 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.origin_servers).toHaveLength(1);
			expect(resource.spec?.origin_servers[0]?.k8s_service).toBeDefined();
			expect(resource.spec?.origin_servers[0]?.k8s_service?.service_name).toBe(
				"nginx-service",
			);
		}, 60000);

		it("✓ CREATE: --vn-private-ip works", async () => {
			const name = generateResourceName("vn-ip");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --vn-private-ip 10.10.1.10 --port 8080 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.origin_servers).toHaveLength(1);
			expect(resource.spec?.origin_servers[0]?.vn_private_ip).toBeDefined();
			expect(resource.spec?.origin_servers[0]?.vn_private_ip?.ip).toBe(
				"10.10.1.10",
			);
		}, 60000);

		it("✓ CREATE: --vn-private-name works", async () => {
			const name = generateResourceName("vn-name");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --vn-private-name app.vn.local --port 8080 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.origin_servers).toHaveLength(1);
			expect(resource.spec?.origin_servers[0]?.vn_private_name).toBeDefined();
			expect(resource.spec?.origin_servers[0]?.vn_private_name?.dns_name).toBe(
				"app.vn.local",
			);
		}, 60000);

		it("✓ CREATE: Multiple origin server types can be mixed", async () => {
			const name = generateResourceName("mixed");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --public-name example.com --vn-private-ip 10.10.1.20 --port 8080 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			expect(resource.spec?.origin_servers).toHaveLength(3);
			expect(resource.spec?.origin_servers[0]?.public_ip).toBeDefined();
			expect(resource.spec?.origin_servers[1]?.public_name).toBeDefined();
			expect(resource.spec?.origin_servers[2]?.vn_private_ip).toBeDefined();
		}, 60000);
	});

	// ============================================================================
	// CATEGORY 10: SERVER DEFAULTS VERIFICATION
	// ============================================================================

	describe("CATEGORY 10: Server Defaults Verification", () => {
		it("✓ CREATE: Server defaults ROUND_ROBIN algorithm when not specified", async () => {
			const name = generateResourceName("default-algo");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			// Server should apply ROUND_ROBIN default
			expect(
				resource.spec?.loadbalancer_algorithm === "ROUND_ROBIN" ||
					resource.spec?.loadbalancer_algorithm === undefined,
			).toBe(true);
		}, 60000);

		it("✓ CREATE: Server defaults DISTRIBUTED endpoint selection when not specified", async () => {
			const name = generateResourceName("default-endpoint");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			// Server should apply DISTRIBUTED default
			expect(
				resource.spec?.endpoint_selection === "DISTRIBUTED" ||
					resource.spec?.endpoint_selection === undefined,
			).toBe(true);
		}, 60000);

		it("✓ CREATE: Smart default port 80 applied when no port specified", async () => {
			const name = generateResourceName("default-port");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			// Smart default applies port 80
			expect(resource.spec?.port).toBe(80);
		}, 60000);

		it("✓ CREATE: Smart default no_tls applied for non-443 ports", async () => {
			const name = generateResourceName("default-notls");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-ip 192.0.2.10 --port 8080 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			// Smart default applies no_tls for non-443 ports
			expect(resource.spec?.no_tls).toBeDefined();
			expect(resource.spec?.use_tls).toBeUndefined();
		}, 60000);

		it("✓ CREATE: Smart default use_tls applied for port 443", async () => {
			const name = generateResourceName("default-tls");
			createdResources.push(name);

			const createResult = await xcsh(
				`virtual create origin_pool --name ${name} --public-name example.com --port 443 --namespace ${TEST_NAMESPACE}`,
			);

			expect(createResult.exitCode).toBe(0);
			await waitForAPI();

			const readResult = await xcsh(
				`virtual get origin_pool --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
			);

			const resource = parseJSON(readResult.stdout);
			// Smart default applies use_tls for port 443
			expect(resource.spec?.use_tls).toBeDefined();
			expect(resource.spec?.no_tls).toBeUndefined();
		}, 60000);
	});
});
