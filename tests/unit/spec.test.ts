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
		it("returns enhanced spec for healthcheck create", () => {
			const spec = getCommandSpec("healthcheck create");

			expect(spec).toBeDefined();
			expect(spec?.command).toBe("healthcheck create");
			expect(spec?.resourceSpec).toBeDefined();
			expect(spec?.resourceSpec?.resourceType).toBe("healthcheck");
		});

		it("includes flags in healthcheck create spec", () => {
			const spec = getCommandSpec("healthcheck create");

			expect(spec?.flags).toBeDefined();
			expect(spec?.flags.length).toBeGreaterThan(0);

			// Check for expected flags
			const nameFlag = spec?.flags.find((f) => f.name === "--name");
			const typeFlag = spec?.flags.find((f) => f.name === "--type");

			expect(nameFlag).toBeDefined();
			expect(nameFlag?.required).toBe(true);

			expect(typeFlag).toBeDefined();
			expect(typeFlag?.choices).toContain("http");
			expect(typeFlag?.choices).toContain("tcp");
			expect(typeFlag?.choices).toContain("udp-icmp");
		});

		it("includes examples in healthcheck create spec", () => {
			const spec = getCommandSpec("healthcheck create");

			expect(spec?.examples).toBeDefined();
			expect(spec?.examples.length).toBeGreaterThan(0);

			// Check for HTTP health check example
			const httpExample = spec?.examples.find((e) =>
				e.command.includes("--type http"),
			);
			expect(httpExample).toBeDefined();
		});

		it("handles case-insensitive command path", () => {
			const spec1 = getCommandSpec("healthcheck create");
			const spec2 = getCommandSpec("HEALTHCHECK CREATE");
			const spec3 = getCommandSpec("HealthCheck Create");

			expect(spec1).toBeDefined();
			expect(spec2).toBeDefined();
			expect(spec3).toBeDefined();

			expect(spec1?.command).toBe(spec2?.command);
			expect(spec2?.command).toBe(spec3?.command);
		});

		it("returns undefined for unknown commands", () => {
			const spec = getCommandSpec("nonexistent command");
			expect(spec).toBeUndefined();
		});

		it("returns spec with all required properties", () => {
			const spec = getCommandSpec("healthcheck create");

			expect(spec).toBeDefined();
			expect(spec?.command).toBeDefined();
			expect(spec?.description).toBeDefined();
			expect(spec?.usage).toBeDefined();
			expect(spec?.flags).toBeDefined();
			expect(spec?.examples).toBeDefined();
			expect(spec?.outputFormats).toBeDefined();
			expect(spec?.category).toBeDefined();
		});
	});

	describe("resourceSpec structure validation", () => {
		it("has properly structured oneOf groups", () => {
			const spec = getCommandSpec("healthcheck create");
			const resourceSpec = spec?.resourceSpec;

			expect(resourceSpec?.oneOfGroups).toBeDefined();

			for (const group of resourceSpec?.oneOfGroups || []) {
				expect(group.groupName).toBeDefined();
				expect(group.variants).toBeInstanceOf(Array);
				expect(group.variants.length).toBeGreaterThan(0);
				expect(group.description).toBeDefined();
			}
		});

		it("has properly structured field specs", () => {
			const spec = getCommandSpec("healthcheck create");
			const resourceSpec = spec?.resourceSpec;

			expect(resourceSpec?.fields).toBeDefined();

			for (const field of resourceSpec?.fields || []) {
				expect(field.name).toBeDefined();
				expect(field.description).toBeDefined();
				expect(field.constraints).toBeDefined();
				expect(field.constraints.type).toBeDefined();
				expect(field.extensions).toBeDefined();
				expect(typeof field.required).toBe("boolean");
			}
		});

		it("has consistent oneOf group references", () => {
			const spec = getCommandSpec("healthcheck create");
			const resourceSpec = spec?.resourceSpec;

			const groupNames = new Set(
				resourceSpec?.oneOfGroups.map((g) => g.groupName) || [],
			);

			// Find all fields that reference a oneOf group
			const fieldsWithGroups = resourceSpec?.fields.filter(
				(f) => f.oneOfGroup,
			);

			// All referenced groups should exist
			for (const field of fieldsWithGroups || []) {
				expect(groupNames.has(field.oneOfGroup as string)).toBe(true);
			}
		});

		it("has valid minimum configuration", () => {
			const spec = getCommandSpec("healthcheck create");
			const minConfig = spec?.resourceSpec?.minimumConfiguration;

			expect(minConfig).toBeDefined();
			expect(minConfig?.description).toBeDefined();
			expect(minConfig?.requiredFields).toBeInstanceOf(Array);
			expect(minConfig?.mutuallyExclusiveGroups).toBeInstanceOf(Array);

			// Validate mutually exclusive groups structure
			for (const group of minConfig?.mutuallyExclusiveGroups || []) {
				expect(group.fields).toBeInstanceOf(Array);
				expect(group.fields.length).toBeGreaterThan(0);
				expect(group.reason).toBeDefined();
			}
		});
	});
});
