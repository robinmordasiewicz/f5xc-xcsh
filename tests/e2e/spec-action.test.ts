/**
 * E2E tests for the "spec" action verb
 * Tests the new command pattern: xcsh virtual spec <resource-type>
 */

import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to run CLI command
function runCLI(args: string): { stdout: string; stderr: string; success: boolean } {
	const projectRoot = path.resolve(__dirname, "../..");
	const distPath = path.join(projectRoot, "dist/index.js");

	try {
		const stdout = execSync(`node ${distPath} ${args}`, {
			encoding: "utf-8",
			cwd: projectRoot,
			env: {
				...process.env,
				NO_COLOR: "1", // Disable colors for consistent output
			},
		});
		return { stdout, stderr: "", success: true };
	} catch (error: any) {
		// If the command fails, return both stdout and stderr
		return {
			stdout: error.stdout || "",
			stderr: error.stderr || "",
			success: false,
		};
	}
}

describe("spec action E2E", () => {
	describe("basic functionality", () => {
		it("should return spec with 'virtual spec healthcheck'", () => {
			const { stdout, success } = runCLI("virtual spec healthcheck");

			expect(success).toBe(true);

			// Should be valid JSON
			expect(() => JSON.parse(stdout)).not.toThrow();

			const spec = JSON.parse(stdout);
			expect(spec).toHaveProperty("command");
			expect(spec).toHaveProperty("resourceSpec");
			expect(spec).toHaveProperty("aiAssistantGuide");
		});

		it("should work with direct navigation '/virtual spec healthcheck'", () => {
			const { stdout, success } = runCLI("/virtual spec healthcheck");

			expect(success).toBe(true);

			const spec = JSON.parse(stdout);
			expect(spec.resourceSpec.resourceType).toBe("healthcheck");
		});

		it("should work for app_firewall", () => {
			const { stdout, success } = runCLI("virtual spec app_firewall");

			expect(success).toBe(true);

			const spec = JSON.parse(stdout);
			expect(spec.resourceSpec.resourceType).toBe("app_firewall");
			expect(spec.aiAssistantGuide).toBeDefined();
			expect(spec.aiAssistantGuide.commonPatterns).toBeDefined();
			expect(Array.isArray(spec.aiAssistantGuide.commonPatterns)).toBe(true);
		});
	});

	describe("error handling", () => {
		it("should return error for missing resource type", () => {
			const { stdout, stderr, success } = runCLI("virtual spec");

			expect(success).toBe(false);
			const output = stdout || stderr;
			expect(output).toContain("Resource type required");
			expect(output).toContain("Usage: virtual spec <resource-type>");
			expect(output).toContain("Available resources:");
		});

		it("should handle invalid resource type gracefully", () => {
			const { stdout, stderr } = runCLI("virtual spec nonexistent_resource");

			const output = stdout || stderr;
			// Should either show error or fallback message
			// The exact behavior depends on whether the resource type is recognized
			expect(output.length).toBeGreaterThan(0);
		});
	});

	describe("backward compatibility", () => {
		it("should maintain backward compatibility with --spec flag", () => {
			const { stdout: oldPattern } = runCLI("virtual create healthcheck --spec");
			const { stdout: newPattern } = runCLI("virtual spec healthcheck");

			const oldSpec = JSON.parse(oldPattern);
			const newSpec = JSON.parse(newPattern);

			// Should return equivalent specs
			expect(oldSpec.resourceSpec).toEqual(newSpec.resourceSpec);
			expect(oldSpec.aiAssistantGuide).toEqual(newSpec.aiAssistantGuide);
		});

		it("should work with different resources using both patterns", () => {
			// Test with app_firewall
			const { stdout: oldAppFirewall } = runCLI("virtual create app_firewall --spec");
			const { stdout: newAppFirewall } = runCLI("virtual spec app_firewall");

			const oldSpec = JSON.parse(oldAppFirewall);
			const newSpec = JSON.parse(newAppFirewall);

			expect(oldSpec.resourceSpec.resourceType).toBe(newSpec.resourceSpec.resourceType);
			expect(oldSpec.resourceSpec.resourceType).toBe("app_firewall");
		});
	});

	describe("spec content validation", () => {
		it("should include complete resourceSpec structure", () => {
			const { stdout } = runCLI("virtual spec healthcheck");
			const spec = JSON.parse(stdout);

			expect(spec.resourceSpec).toHaveProperty("resourceType");
			expect(spec.resourceSpec).toHaveProperty("fields");
			expect(spec.resourceSpec).toHaveProperty("oneOfGroups");
			expect(spec.resourceSpec).toHaveProperty("minimumConfiguration");

			expect(Array.isArray(spec.resourceSpec.fields)).toBe(true);
			expect(spec.resourceSpec.fields.length).toBeGreaterThan(0);
		});

		it("should include aiAssistantGuide", () => {
			const { stdout } = runCLI("virtual spec healthcheck");
			const spec = JSON.parse(stdout);

			expect(spec.aiAssistantGuide).toBeDefined();
			expect(spec.aiAssistantGuide).toHaveProperty("purpose");
			expect(spec.aiAssistantGuide).toHaveProperty("commonPatterns");
			expect(spec.aiAssistantGuide).toHaveProperty("validationSteps");
			expect(spec.aiAssistantGuide).toHaveProperty("bestPractices");
		});

		it("should include command metadata", () => {
			const { stdout } = runCLI("virtual spec healthcheck");
			const spec = JSON.parse(stdout);

			expect(spec.command).toBe("healthcheck create");
			expect(spec.description).toBeDefined();
			expect(spec.usage).toBeDefined();
			expect(spec.category).toBe("healthcheck");
		});
	});

	describe("output format", () => {
		it("should output valid JSON by default", () => {
			const { stdout } = runCLI("virtual spec healthcheck");

			// Should parse as valid JSON without errors
			expect(() => JSON.parse(stdout)).not.toThrow();
		});

		it("should be consistent across invocations", () => {
			const { stdout: first } = runCLI("virtual spec healthcheck");
			const { stdout: second } = runCLI("virtual spec healthcheck");

			const firstSpec = JSON.parse(first);
			const secondSpec = JSON.parse(second);

			// Should return the same spec structure
			expect(firstSpec.resourceSpec).toEqual(secondSpec.resourceSpec);
		});
	});

	describe("multiple resource types", () => {
		it("should work with healthcheck", () => {
			const { stdout, success } = runCLI("virtual spec healthcheck");
			expect(success).toBe(true);

			const spec = JSON.parse(stdout);
			expect(spec.resourceSpec.resourceType).toBe("healthcheck");
		});

		it("should work with app_firewall", () => {
			const { stdout, success } = runCLI("virtual spec app_firewall");
			expect(success).toBe(true);

			const spec = JSON.parse(stdout);
			expect(spec.resourceSpec.resourceType).toBe("app_firewall");
		});

		it("should work with origin_pool", () => {
			const { stdout, success } = runCLI("virtual spec origin_pool");
			expect(success).toBe(true);

			const spec = JSON.parse(stdout);
			expect(spec.resourceSpec.resourceType).toBe("origin_pool");
		});
	});
});
