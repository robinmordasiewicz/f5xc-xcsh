/**
 * App Firewall CRUD End-to-End Tests
 *
 * Tests actual API operations with F5 Distributed Cloud:
 * - CREATE: Test various flag combinations create real WAF policies
 * - READ: Verify created policies can be retrieved
 * - LIST: Verify policies appear in list operations
 * - DELETE: Clean up test resources
 *
 * REQUIREMENTS:
 * - Valid F5 XC authentication (F5XC_API_TOKEN or logged in via xcsh login)
 * - Network access to F5 XC API
 * - Permissions to create/delete app_firewall resources
 *
 * SAFETY:
 * - Uses unique names with timestamps to avoid conflicts
 * - Automatically cleans up created resources
 * - Uses beforeEach/afterEach to ensure cleanup even on failures
 *
 * RUN WITH:
 * npm test tests/e2e/app-firewall-crud.test.ts
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
const TEST_PREFIX = "xcsh-waf-test";
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

describe("App Firewall CRUD End-to-End Tests", () => {
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
          `virtual delete app_firewall --name ${resourceName} --namespace ${TEST_NAMESPACE}`,
        );
        await waitForAPI(500);
      } catch (error) {
        console.warn(`Failed to delete resource ${resourceName}:`, error);
      }
    }
    createdResources = [];
  });

  // ============================================================================
  // PREREQUISITE: AUTHENTICATION CHECK
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
  // CATEGORY 1: BASIC APP FIREWALL CRUD
  // ============================================================================

  describe("CATEGORY 1: Basic App Firewall CRUD", () => {
    it("✓ CREATE: Minimal app firewall with defaults", async () => {
      const name = generateResourceName("minimal");
      createdResources.push(name);

      // Create with minimal flags
      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --namespace ${TEST_NAMESPACE}`,
      );

      expect(createResult.exitCode).toBe(0);
      expect(createResult.stderr).not.toContain("error");
      expect(createResult.stderr).not.toContain("failed");

      await waitForAPI();

      // Verify created
      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource).toBeTruthy();
      expect(resource.metadata?.name).toBe(name);
      expect(resource.metadata?.namespace).toBe(TEST_NAMESPACE);
    }, 60000);

    it("✓ READ: Get created app firewall", async () => {
      const name = generateResourceName("read-test");
      createdResources.push(name);

      // Create
      await xcsh(
        `virtual create app_firewall --name ${name} --namespace ${TEST_NAMESPACE}`,
      );
      await waitForAPI();

      // Read
      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(readResult.exitCode).toBe(0);
      const resource = parseJSON(readResult.stdout);
      expect(resource).toBeTruthy();
      expect(resource.metadata?.name).toBe(name);
    }, 60000);

    it("✓ LIST: List app firewalls in namespace", async () => {
      const listResult = await xcsh(
        `virtual list app_firewall --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(listResult.exitCode).toBe(0);
      const result = parseJSON(listResult.stdout);
      expect(result).toBeTruthy();
      expect(Array.isArray(result.items)).toBe(true);
    }, 60000);

    it("✓ DELETE: Delete app firewall", async () => {
      const name = generateResourceName("delete-test");

      // Create
      await xcsh(
        `virtual create app_firewall --name ${name} --namespace ${TEST_NAMESPACE}`,
      );
      await waitForAPI();

      // Delete
      const deleteResult = await xcsh(
        `virtual delete app_firewall --name ${name} --namespace ${TEST_NAMESPACE}`,
      );

      expect(deleteResult.exitCode).toBe(0);
      await waitForAPI();

      // Verify deleted
      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE}`,
      );

      expect(readResult.exitCode).not.toBe(0);
    }, 60000);
  });

  // ============================================================================
  // CATEGORY 2: BLOCKING MODE TESTS
  // ============================================================================

  describe("CATEGORY 2: Blocking Mode Tests", () => {
    it("✓ CREATE: App firewall with MONITORING mode", async () => {
      const name = generateResourceName("monitoring");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --blocking-mode MONITORING --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.blocking_mode).toBe("MONITORING");
    }, 60000);

    it("✓ CREATE: App firewall with BLOCKING mode", async () => {
      const name = generateResourceName("blocking");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --blocking-mode BLOCKING --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.blocking_mode).toBe("BLOCKING");
    }, 60000);
  });

  // ============================================================================
  // CATEGORY 3: DETECTION MODE TESTS
  // ============================================================================

  describe("CATEGORY 3: Detection Mode Tests", () => {
    it("✓ CREATE: App firewall with LOW detection mode", async () => {
      const name = generateResourceName("detection-low");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --detection-mode LOW --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.detection_mode).toBe("LOW");
    }, 60000);

    it("✓ CREATE: App firewall with HIGH detection mode", async () => {
      const name = generateResourceName("detection-high");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --detection-mode HIGH --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.detection_mode).toBe("HIGH");
    }, 60000);
  });

  // ============================================================================
  // CATEGORY 4: PROTECTION FEATURES TESTS
  // ============================================================================

  describe("CATEGORY 4: Protection Features Tests", () => {
    it("✓ CREATE: App firewall with SQL injection protection", async () => {
      const name = generateResourceName("sqli");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --enable-sql-injection --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.enable_sql_injection).toBe(true);
    }, 60000);

    it("✓ CREATE: App firewall with XSS protection", async () => {
      const name = generateResourceName("xss");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --enable-xss --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.enable_xss).toBe(true);
    }, 60000);

    it("✓ CREATE: App firewall with command injection protection", async () => {
      const name = generateResourceName("cmdi");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --enable-command-injection --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.enable_command_injection).toBe(true);
    }, 60000);

    it("✓ CREATE: App firewall with multiple protections", async () => {
      const name = generateResourceName("multi");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --enable-sql-injection --enable-xss --enable-command-injection --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.enable_sql_injection).toBe(true);
      expect(resource.spec?.enable_xss).toBe(true);
      expect(resource.spec?.enable_command_injection).toBe(true);
    }, 60000);
  });

  // ============================================================================
  // CATEGORY 5: ADVANCED FEATURES TESTS
  // ============================================================================

  describe("CATEGORY 5: Advanced Features Tests", () => {
    it("✓ CREATE: App firewall with API protection", async () => {
      const name = generateResourceName("api");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --enable-api-protection --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.enable_api_protection).toBe(true);
    }, 60000);

    it("✓ CREATE: App firewall with bot protection", async () => {
      const name = generateResourceName("bot");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --enable-bot-protection --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.enable_bot_protection).toBe(true);
    }, 60000);

    it("✓ CREATE: App firewall with threat campaigns", async () => {
      const name = generateResourceName("threat");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --enable-threat-campaigns --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.enable_threat_campaigns).toBe(true);
    }, 60000);

    it("✓ CREATE: App firewall with all advanced features", async () => {
      const name = generateResourceName("advanced-all");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --enable-api-protection --enable-bot-protection --enable-threat-campaigns --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.enable_api_protection).toBe(true);
      expect(resource.spec?.enable_bot_protection).toBe(true);
      expect(resource.spec?.enable_threat_campaigns).toBe(true);
    }, 60000);
  });

  // ============================================================================
  // CATEGORY 6: RESPONSE VALIDATION TESTS
  // ============================================================================

  describe("CATEGORY 6: Response Validation Tests", () => {
    it("✓ CREATE: App firewall with allowed response codes", async () => {
      const name = generateResourceName("codes");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --allowed-response-codes "200,201,204" --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.allowed_response_codes).toContain(200);
      expect(resource.spec?.allowed_response_codes).toContain(201);
      expect(resource.spec?.allowed_response_codes).toContain(204);
    }, 60000);

    it("✓ CREATE: App firewall with max request size", async () => {
      const name = generateResourceName("size");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --max-request-size 5242880 --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.spec?.max_request_size).toBe(5242880);
    }, 60000);
  });

  // ============================================================================
  // CATEGORY 7: COMPREHENSIVE CONFIGURATION TEST
  // ============================================================================

  describe("CATEGORY 7: Comprehensive Configuration Test", () => {
    it("✓ CREATE: App firewall with full configuration", async () => {
      const name = generateResourceName("full");
      createdResources.push(name);

      const createResult = await xcsh(
        `virtual create app_firewall --name ${name} --blocking-mode BLOCKING --detection-mode HIGH --enable-sql-injection --enable-xss --enable-command-injection --enable-api-protection --enable-bot-protection --enable-threat-campaigns --allowed-response-codes "200,201,204,301,302" --max-request-size 5242880 --namespace ${TEST_NAMESPACE} -o json`,
      );

      expect(createResult.exitCode).toBe(0);
      await waitForAPI();

      const readResult = await xcsh(
        `virtual get app_firewall --name ${name} --namespace ${TEST_NAMESPACE} -o json`,
      );

      const resource = parseJSON(readResult.stdout);
      expect(resource.metadata?.name).toBe(name);
      expect(resource.spec?.blocking_mode).toBe("BLOCKING");
      expect(resource.spec?.detection_mode).toBe("HIGH");
      expect(resource.spec?.enable_sql_injection).toBe(true);
      expect(resource.spec?.enable_xss).toBe(true);
      expect(resource.spec?.enable_command_injection).toBe(true);
      expect(resource.spec?.enable_api_protection).toBe(true);
      expect(resource.spec?.enable_bot_protection).toBe(true);
      expect(resource.spec?.enable_threat_campaigns).toBe(true);
      expect(resource.spec?.max_request_size).toBe(5242880);
      expect(resource.spec?.allowed_response_codes).toBeTruthy();
    }, 60000);
  });
});
