/**
 * E2E tests for healthcheck spec output
 * Tests the complete workflow of generating and outputting spec via CLI
 */

import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to run CLI command
function runCLI(args: string): string {
	const projectRoot = path.resolve(__dirname, "../..");
	const distPath = path.join(projectRoot, "dist/index.js");

	try {
		return execSync(`node ${distPath} ${args}`, {
			encoding: "utf-8",
			cwd: projectRoot,
			env: {
				...process.env,
				NO_COLOR: "1", // Disable colors for consistent output
			},
		});
	} catch (error: any) {
		// If the command fails, return the output anyway for testing
		return error.stdout || error.stderr || "";
	}
}

describe("healthcheck spec E2E", () => {
	describe("--spec flag output", () => {
		it("outputs valid JSON with --spec flag", () => {
			const output = runCLI("healthcheck create --spec");

			// Should be valid JSON
			expect(() => JSON.parse(output)).not.toThrow();

			const spec = JSON.parse(output);
			expect(spec).toBeDefined();
		});

		it("includes command metadata", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			expect(spec.command).toBe("healthcheck create");
			expect(spec.description).toBeDefined();
			expect(spec.usage).toBeDefined();
			expect(spec.category).toBe("healthcheck");
		});

		it("includes resourceSpec object", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			expect(spec.resourceSpec).toBeDefined();
			expect(spec.resourceSpec.resourceType).toBe("healthcheck");
		});
	});

	describe("resourceSpec structure", () => {
		it("includes all required metadata for AI assistants", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			// Verify structure
			expect(spec).toHaveProperty("resourceSpec");
			expect(spec.resourceSpec).toHaveProperty("resourceType");
			expect(spec.resourceSpec).toHaveProperty("fields");
			expect(spec.resourceSpec).toHaveProperty("oneOfGroups");

			// Verify resourceType
			expect(spec.resourceSpec.resourceType).toBe("healthcheck");

			// Verify fields array
			expect(Array.isArray(spec.resourceSpec.fields)).toBe(true);
			expect(spec.resourceSpec.fields.length).toBeGreaterThan(0);

			// Verify oneOfGroups array
			expect(Array.isArray(spec.resourceSpec.oneOfGroups)).toBe(true);
			expect(spec.resourceSpec.oneOfGroups.length).toBeGreaterThan(0);
		});

		it("includes complete field specifications", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			const timeoutField = spec.resourceSpec.fields.find(
				(f: any) => f.name === "timeout",
			);

			expect(timeoutField).toBeDefined();
			expect(timeoutField).toHaveProperty("name");
			expect(timeoutField).toHaveProperty("description");
			expect(timeoutField).toHaveProperty("constraints");
			expect(timeoutField).toHaveProperty("extensions");
			expect(timeoutField).toHaveProperty("required");

			// Verify constraints structure
			expect(timeoutField.constraints).toHaveProperty("type");
			expect(timeoutField.constraints).toHaveProperty("minimum");
			expect(timeoutField.constraints).toHaveProperty("maximum");

			// Verify extensions structure
			expect(timeoutField.extensions).toHaveProperty("recommendedValue");
			expect(timeoutField.extensions.recommendedValue).toBe(3);
		});

		it("includes oneOf groups with variants", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			const healthCheckGroup = spec.resourceSpec.oneOfGroups.find(
				(g: any) => g.groupName === "health_check",
			);

			expect(healthCheckGroup).toBeDefined();
			expect(healthCheckGroup).toHaveProperty("groupName");
			expect(healthCheckGroup).toHaveProperty("variants");
			expect(healthCheckGroup).toHaveProperty("description");

			expect(Array.isArray(healthCheckGroup.variants)).toBe(true);
			expect(healthCheckGroup.variants).toContain("http_health_check");
			expect(healthCheckGroup.variants).toContain("tcp_health_check");
			expect(healthCheckGroup.variants).toContain(
				"udp_icmp_health_check",
			);
		});

		it("includes minimum configuration", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			expect(spec.resourceSpec.minimumConfiguration).toBeDefined();

			const minConfig = spec.resourceSpec.minimumConfiguration;
			expect(minConfig).toHaveProperty("description");
			expect(minConfig).toHaveProperty("requiredFields");
			expect(minConfig).toHaveProperty("mutuallyExclusiveGroups");

			expect(Array.isArray(minConfig.requiredFields)).toBe(true);
			expect(minConfig.requiredFields.length).toBeGreaterThan(0);

			expect(Array.isArray(minConfig.mutuallyExclusiveGroups)).toBe(true);
			expect(minConfig.mutuallyExclusiveGroups.length).toBeGreaterThan(0);
		});

		it("includes valid example JSON in minimum configuration", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			const exampleJson =
				spec.resourceSpec.minimumConfiguration.exampleJson;
			expect(exampleJson).toBeDefined();

			// Verify it's valid JSON
			const example = JSON.parse(exampleJson);
			expect(example).toHaveProperty("metadata");
			expect(example).toHaveProperty("spec");
			expect(example.metadata).toHaveProperty("name");
			expect(example.metadata).toHaveProperty("namespace");
		});
	});

	describe("field constraints validation", () => {
		it("includes numeric constraints for timeout field", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			const timeoutField = spec.resourceSpec.fields.find(
				(f: any) => f.name === "timeout",
			);

			expect(timeoutField.constraints.type).toBe("integer");
			expect(timeoutField.constraints.minimum).toBeDefined();
			expect(timeoutField.constraints.maximum).toBeDefined();
			expect(typeof timeoutField.constraints.minimum).toBe("number");
			expect(typeof timeoutField.constraints.maximum).toBe("number");
		});

		it("includes recommended values for fields", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			const timeoutField = spec.resourceSpec.fields.find(
				(f: any) => f.name === "timeout",
			);
			const intervalField = spec.resourceSpec.fields.find(
				(f: any) => f.name === "interval",
			);
			const jitterField = spec.resourceSpec.fields.find(
				(f: any) => f.name === "jitter_percent",
			);

			expect(timeoutField.extensions.recommendedValue).toBe(3);
			expect(intervalField.extensions.recommendedValue).toBe(15);
			expect(jitterField.extensions.recommendedValue).toBe(30);
		});

		it("marks server default fields correctly", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			const jitterField = spec.resourceSpec.fields.find(
				(f: any) => f.name === "jitter_percent",
			);

			expect(jitterField.extensions.serverDefault).toBe(true);
			expect(jitterField.default).toBe(0);
		});
	});

	describe("mutually exclusive groups", () => {
		it("identifies mutually exclusive health check types", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			const healthCheckGroup = spec.resourceSpec.oneOfGroups.find(
				(g: any) => g.groupName === "health_check",
			);

			expect(healthCheckGroup).toBeDefined();
			expect(healthCheckGroup.variants.length).toBe(3);
			expect(healthCheckGroup.description).toContain(
				"Choose exactly one",
			);
		});

		it("marks oneOf group membership on fields", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			const httpHealthCheckField = spec.resourceSpec.fields.find(
				(f: any) => f.name === "http_health_check",
			);
			const tcpHealthCheckField = spec.resourceSpec.fields.find(
				(f: any) => f.name === "tcp_health_check",
			);
			const udpIcmpHealthCheckField = spec.resourceSpec.fields.find(
				(f: any) => f.name === "udp_icmp_health_check",
			);

			expect(httpHealthCheckField.oneOfGroup).toBe("health_check");
			expect(tcpHealthCheckField.oneOfGroup).toBe("health_check");
			expect(udpIcmpHealthCheckField.oneOfGroup).toBe("health_check");
		});

		it("lists mutually exclusive groups in minimum configuration", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			const mutuallyExclusiveGroups =
				spec.resourceSpec.minimumConfiguration.mutuallyExclusiveGroups;

			expect(mutuallyExclusiveGroups).toBeDefined();
			expect(mutuallyExclusiveGroups.length).toBeGreaterThan(0);

			const healthCheckGroup = mutuallyExclusiveGroups[0];
			expect(healthCheckGroup.fields).toContain(
				"spec.http_health_check",
			);
			expect(healthCheckGroup.fields).toContain("spec.tcp_health_check");
			expect(healthCheckGroup.fields).toContain(
				"spec.udp_icmp_health_check",
			);
			expect(healthCheckGroup.reason).toBeDefined();
		});
	});

	describe("AI assistant usability", () => {
		it("provides all information needed to generate valid config", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			// AI needs to know:
			// 1. What fields are available
			expect(spec.resourceSpec.fields.length).toBeGreaterThan(0);

			// 2. Which fields are required
			const requiredFields = spec.resourceSpec.fields.filter(
				(f: any) => f.extensions.requiredFor?.create,
			);
			expect(requiredFields.length).toBeGreaterThan(0);

			// 3. What are the recommended values
			const fieldsWithRecommendations = spec.resourceSpec.fields.filter(
				(f: any) => f.extensions.recommendedValue !== undefined,
			);
			expect(fieldsWithRecommendations.length).toBeGreaterThan(0);

			// 4. What are the mutually exclusive choices
			expect(spec.resourceSpec.oneOfGroups.length).toBeGreaterThan(0);

			// 5. What constraints apply
			const fieldsWithConstraints = spec.resourceSpec.fields.filter(
				(f: any) =>
					f.constraints.minimum !== undefined ||
					f.constraints.maximum !== undefined ||
					f.constraints.maxLength !== undefined,
			);
			expect(fieldsWithConstraints.length).toBeGreaterThan(0);
		});

		it("includes working example configuration", () => {
			const output = runCLI("healthcheck create --spec");
			const spec = JSON.parse(output);

			const exampleJson =
				spec.resourceSpec.minimumConfiguration.exampleJson;
			const example = JSON.parse(exampleJson);

			// Verify the example follows the constraints
			expect(example.spec.timeout).toBeDefined();
			expect(example.spec.interval).toBeDefined();
			expect(example.spec.healthy_threshold).toBeDefined();
			expect(example.spec.unhealthy_threshold).toBeDefined();

			// Verify it uses recommended values
			expect(example.spec.timeout).toBe(3);
			expect(example.spec.interval).toBe(15);
			expect(example.spec.jitter_percent).toBe(30);

			// Verify it has exactly one health check type
			const healthCheckTypes = [
				example.spec.http_health_check,
				example.spec.tcp_health_check,
				example.spec.udp_icmp_health_check,
			].filter((x) => x !== undefined);
			expect(healthCheckTypes.length).toBe(1);
		});
	});
});
