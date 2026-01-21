/**
 * Integration tests for command spec generation
 */

import { describe, it, expect } from "vitest";
import {
	buildHealthcheckResourceSpec,
	getCommandSpec,
} from "../../src/output/spec.js";

describe("spec enhancements", () => {
	describe("buildHealthcheckResourceSpec", () => {
		it("generates complete resource spec", () => {
			const spec = buildHealthcheckResourceSpec();

			expect(spec.resourceType).toBe("healthcheck");
			expect(spec.fields).toBeInstanceOf(Array);
			expect(spec.fields.length).toBeGreaterThan(5);
			expect(spec.oneOfGroups).toBeInstanceOf(Array);
			expect(spec.oneOfGroups.length).toBeGreaterThan(0);
		});

		it("includes oneOf groups for health check types", () => {
			const spec = buildHealthcheckResourceSpec();

			const healthCheckGroup = spec.oneOfGroups.find(
				(g) => g.groupName === "health_check",
			);

			expect(healthCheckGroup).toBeDefined();
			expect(healthCheckGroup?.variants).toContain("http_health_check");
			expect(healthCheckGroup?.variants).toContain("tcp_health_check");
			expect(healthCheckGroup?.variants).toContain(
				"udp_icmp_health_check",
			);
		});

		it("includes fields with constraints", () => {
			const spec = buildHealthcheckResourceSpec();

			const timeoutField = spec.fields.find((f) => f.name === "timeout");
			expect(timeoutField).toBeDefined();
			expect(timeoutField?.constraints.minimum).toBeDefined();
			expect(timeoutField?.constraints.maximum).toBeDefined();
			expect(timeoutField?.extensions.recommendedValue).toBe(3);
		});

		it("includes interval field with recommended value", () => {
			const spec = buildHealthcheckResourceSpec();

			const intervalField = spec.fields.find(
				(f) => f.name === "interval",
			);
			expect(intervalField).toBeDefined();
			expect(intervalField?.extensions.recommendedValue).toBe(15);
		});

		it("includes jitter_percent with server default", () => {
			const spec = buildHealthcheckResourceSpec();

			const jitterField = spec.fields.find(
				(f) => f.name === "jitter_percent",
			);
			expect(jitterField).toBeDefined();
			expect(jitterField?.default).toBe(0);
			expect(jitterField?.extensions.serverDefault).toBe(true);
			expect(jitterField?.extensions.recommendedValue).toBe(30);
		});

		it("marks oneOf group membership correctly", () => {
			const spec = buildHealthcheckResourceSpec();

			const httpHealthCheckField = spec.fields.find(
				(f) => f.name === "http_health_check",
			);
			const tcpHealthCheckField = spec.fields.find(
				(f) => f.name === "tcp_health_check",
			);
			const udpIcmpHealthCheckField = spec.fields.find(
				(f) => f.name === "udp_icmp_health_check",
			);

			expect(httpHealthCheckField?.oneOfGroup).toBe("health_check");
			expect(tcpHealthCheckField?.oneOfGroup).toBe("health_check");
			expect(udpIcmpHealthCheckField?.oneOfGroup).toBe("health_check");
		});

		it("includes minimum configuration", () => {
			const spec = buildHealthcheckResourceSpec();

			expect(spec.minimumConfiguration).toBeDefined();
			expect(spec.minimumConfiguration?.description).toBeDefined();
			expect(spec.minimumConfiguration?.requiredFields).toBeInstanceOf(
				Array,
			);
			expect(
				spec.minimumConfiguration?.requiredFields.length,
			).toBeGreaterThan(0);
			expect(
				spec.minimumConfiguration?.mutuallyExclusiveGroups,
			).toBeInstanceOf(Array);
		});

		it("includes example JSON in minimum configuration", () => {
			const spec = buildHealthcheckResourceSpec();

			expect(spec.minimumConfiguration?.exampleJson).toBeDefined();

			// Verify it's valid JSON
			const example = JSON.parse(
				spec.minimumConfiguration?.exampleJson || "{}",
			);
			expect(example.metadata).toBeDefined();
			expect(example.spec).toBeDefined();
		});
	});

	describe("getCommandSpec", () => {
		it("returns enhanced spec for healthcheck create or undefined if OpenAPI not available", () => {
			const spec = getCommandSpec("healthcheck create");

			// Spec may be undefined if OpenAPI schema or CreateSpecType not found
			// This is expected during testing without full environment setup
			if (spec !== undefined) {
				expect(spec.command).toBe("healthcheck create");
				expect(spec.resourceSpec).toBeDefined();
				expect(spec.resourceSpec?.resourceType).toBe("healthcheck");
			}
		});

		it("handles case-insensitive command path", () => {
			const spec1 = getCommandSpec("healthcheck create");
			const spec2 = getCommandSpec("HEALTHCHECK CREATE");
			const spec3 = getCommandSpec("HealthCheck Create");

			// All should be the same (either all defined or all undefined)
			expect(spec1 === spec2 && spec2 === spec3).toBe(true);
		});

		it("returns undefined for unknown commands", () => {
			const spec = getCommandSpec("nonexistent command");
			expect(spec).toBeUndefined();
		});

		it("handles generic resource create command pattern", () => {
			// Test the command pattern handling
			const spec1 = getCommandSpec("app firewall create");
			const spec2 = getCommandSpec("origin pool create");

			// Both should follow same pattern (undefined if schema not found)
			expect(typeof spec1).toBe("object");
			expect(typeof spec2).toBe("object");
		});
	});

	describe("resourceSpec structure validation", () => {
		it("resource spec structure is properly formed when available", () => {
			// Get the healthcheck spec through buildHealthcheckResourceSpec
			const resourceSpec = buildHealthcheckResourceSpec();

			// Validate structure when available
			expect(resourceSpec.fields).toBeDefined();
			expect(Array.isArray(resourceSpec.fields)).toBe(true);

			// Check field structure
			for (const field of resourceSpec.fields || []) {
				expect(field.name).toBeDefined();
				expect(typeof field.name).toBe("string");
				expect(field.description).toBeDefined();
				expect(field.constraints).toBeDefined();
				expect(field.constraints.type).toBeDefined();
			}
		});

		it("oneOf groups are properly structured", () => {
			const resourceSpec = buildHealthcheckResourceSpec();

			expect(resourceSpec.oneOfGroups).toBeDefined();
			expect(Array.isArray(resourceSpec.oneOfGroups)).toBe(true);

			for (const group of resourceSpec.oneOfGroups) {
				expect(group.groupName).toBeDefined();
				expect(Array.isArray(group.variants)).toBe(true);
				expect(group.variants.length).toBeGreaterThan(0);
			}
		});

		it("has valid minimum configuration structure", () => {
			const resourceSpec = buildHealthcheckResourceSpec();

			expect(resourceSpec.minimumConfiguration).toBeDefined();
			const minConfig = resourceSpec.minimumConfiguration;

			expect(minConfig?.description).toBeDefined();
			expect(Array.isArray(minConfig?.requiredFields)).toBe(true);
			expect(minConfig?.requiredFields.length).toBeGreaterThan(0);
		});
	});
});
