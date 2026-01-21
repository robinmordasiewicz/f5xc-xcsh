/**
 * Unit tests for schema extraction utilities
 */

import { describe, it, expect } from "vitest";
import {
	loadOpenApiSpec,
	extractFieldSpecs,
	extractOneOfGroups,
	extractConstraints,
	extractF5XCExtensions,
} from "../../src/output/schema-extractor.js";

describe("schema-extractor", () => {
	const openApiSpec = loadOpenApiSpec();

	describe("loadOpenApiSpec", () => {
		it("loads the OpenAPI specification successfully", () => {
			expect(openApiSpec).toBeDefined();
			expect(openApiSpec.openapi).toBe("3.0.3");
			expect(openApiSpec.components).toBeDefined();
			expect(openApiSpec.components.schemas).toBeDefined();
		});

		it("contains healthcheck schema", () => {
			expect(
				openApiSpec.components.schemas.healthcheckCreateSpecType,
			).toBeDefined();
		});
	});

	describe("extractFieldSpecs", () => {
		it("extracts fields from healthcheck schema", () => {
			const fields = extractFieldSpecs(
				"healthcheckCreateSpecType",
				openApiSpec,
			);

			expect(fields.length).toBeGreaterThan(0);

			const timeoutField = fields.find((f) => f.name === "timeout");
			expect(timeoutField).toBeDefined();
			expect(timeoutField?.constraints.type).toBe("integer");
			expect(timeoutField?.constraints.minimum).toBeDefined();
			expect(timeoutField?.constraints.maximum).toBeDefined();
			expect(timeoutField?.extensions.recommendedValue).toBe(3);
		});

		it("marks required fields correctly", () => {
			const fields = extractFieldSpecs(
				"healthcheckCreateSpecType",
				openApiSpec,
			);

			// Based on OpenAPI spec, these fields are required
			const timeoutField = fields.find((f) => f.name === "timeout");
			const intervalField = fields.find((f) => f.name === "interval");
			const jitterField = fields.find((f) => f.name === "jitter_percent");

			// timeout and interval should be required (they have x-ves-required: true)
			// Note: The actual schema might not have required array, so we check extensions instead
			expect(timeoutField?.extensions.requiredFor?.create).toBe(true);
			expect(intervalField?.extensions.requiredFor?.create).toBe(true);
			expect(jitterField?.extensions.requiredFor?.create).toBe(false);
		});

		it("extracts all healthcheck fields", () => {
			const fields = extractFieldSpecs(
				"healthcheckCreateSpecType",
				openApiSpec,
			);

			const fieldNames = fields.map((f) => f.name);

			// Check for expected healthcheck fields
			expect(fieldNames).toContain("timeout");
			expect(fieldNames).toContain("interval");
			expect(fieldNames).toContain("healthy_threshold");
			expect(fieldNames).toContain("unhealthy_threshold");
			expect(fieldNames).toContain("jitter_percent");
		});

		it("returns empty array for non-existent schema", () => {
			const fields = extractFieldSpecs("nonExistentSchema", openApiSpec);
			expect(fields).toEqual([]);
		});
	});

	describe("extractOneOfGroups", () => {
		it("extracts health_check oneOf group", () => {
			const groups = extractOneOfGroups(
				"healthcheckCreateSpecType",
				openApiSpec,
			);

			const healthCheckGroup = groups.find(
				(g) => g.groupName === "health_check",
			);
			expect(healthCheckGroup).toBeDefined();
			expect(healthCheckGroup?.variants).toContain("http_health_check");
			expect(healthCheckGroup?.variants).toContain("tcp_health_check");
			expect(healthCheckGroup?.variants).toContain(
				"udp_icmp_health_check",
			);
		});

		it("includes description for oneOf groups", () => {
			const groups = extractOneOfGroups(
				"healthcheckCreateSpecType",
				openApiSpec,
			);

			const healthCheckGroup = groups.find(
				(g) => g.groupName === "health_check",
			);
			expect(healthCheckGroup?.description).toBeDefined();
			expect(healthCheckGroup?.description).toContain("Choose exactly one");
		});

		it("returns empty array for non-existent schema", () => {
			const groups = extractOneOfGroups("nonExistentSchema", openApiSpec);
			expect(groups).toEqual([]);
		});
	});

	describe("extractConstraints", () => {
		it("parses string constraints with maxLength", () => {
			const property = {
				type: "string",
				maxLength: 2048,
			};
			const constraints = extractConstraints(property);

			expect(constraints.type).toBe("string");
			expect(constraints.maxLength).toBe(2048);
		});

		it("parses integer constraints with min/max", () => {
			const property = {
				type: "integer",
				minimum: 1,
				maximum: 600,
				format: "int64",
			};
			const constraints = extractConstraints(property);

			expect(constraints.type).toBe("integer");
			expect(constraints.minimum).toBe(1);
			expect(constraints.maximum).toBe(600);
			expect(constraints.format).toBe("int64");
		});

		it("parses array constraints", () => {
			const property = {
				type: "array",
				maxItems: 16,
				uniqueItems: true,
			};
			const constraints = extractConstraints(property);

			expect(constraints.type).toBe("array");
			expect(constraints.maxItems).toBe(16);
			expect(constraints.uniqueItems).toBe(true);
		});

		it("parses string pattern constraints", () => {
			const property = {
				type: "string",
				pattern: "^[a-z0-9-]+$",
			};
			const constraints = extractConstraints(property);

			expect(constraints.type).toBe("string");
			expect(constraints.pattern).toBe("^[a-z0-9-]+$");
		});

		it("parses enum constraints", () => {
			const property = {
				type: "string",
				enum: ["GET", "POST", "PUT", "DELETE"],
			};
			const constraints = extractConstraints(property);

			expect(constraints.type).toBe("string");
			expect(constraints.enum).toEqual(["GET", "POST", "PUT", "DELETE"]);
		});

		it("handles properties with no constraints", () => {
			const property = {
				type: "object",
			};
			const constraints = extractConstraints(property);

			expect(constraints.type).toBe("object");
			expect(constraints.minimum).toBeUndefined();
			expect(constraints.maximum).toBeUndefined();
			expect(constraints.maxLength).toBeUndefined();
		});
	});

	describe("extractF5XCExtensions", () => {
		it("extracts server-default and recommended-value", () => {
			const property = {
				"x-f5xc-server-default": true,
				"x-f5xc-recommended-value": 30,
			};
			const extensions = extractF5XCExtensions(property);

			expect(extensions.serverDefault).toBe(true);
			expect(extensions.recommendedValue).toBe(30);
		});

		it("extracts conflicts-with array", () => {
			const property = {
				"x-f5xc-conflicts-with": ["host_header"],
			};
			const extensions = extractF5XCExtensions(property);

			expect(extensions.conflictsWith).toEqual(["host_header"]);
		});

		it("extracts required-for object", () => {
			const property = {
				"x-f5xc-required-for": {
					minimum_config: true,
					create: true,
					update: false,
				},
			};
			const extensions = extractF5XCExtensions(property);

			expect(extensions.requiredFor).toBeDefined();
			expect(extensions.requiredFor?.minimum_config).toBe(true);
			expect(extensions.requiredFor?.create).toBe(true);
			expect(extensions.requiredFor?.update).toBe(false);
		});

		it("extracts description fields", () => {
			const property = {
				"x-f5xc-description-short": "Short description",
				"x-f5xc-description-medium": "Medium description",
			};
			const extensions = extractF5XCExtensions(property);

			expect(extensions.descriptionShort).toBe("Short description");
			expect(extensions.descriptionMedium).toBe("Medium description");
		});

		it("extracts example from x-f5xc-example", () => {
			const property = {
				"x-f5xc-example": "example-value",
			};
			const extensions = extractF5XCExtensions(property);

			expect(extensions.example).toBe("example-value");
		});

		it("falls back to x-ves-example if x-f5xc-example not present", () => {
			const property = {
				"x-ves-example": "ves-example-value",
			};
			const extensions = extractF5XCExtensions(property);

			expect(extensions.example).toBe("ves-example-value");
		});

		it("returns empty object for property with no extensions", () => {
			const property = {
				type: "string",
			};
			const extensions = extractF5XCExtensions(property);

			expect(extensions).toEqual({});
		});
	});

	describe("integration tests with real healthcheck schema", () => {
		it("extracts timeout field with all metadata", () => {
			const fields = extractFieldSpecs(
				"healthcheckCreateSpecType",
				openApiSpec,
			);
			const timeoutField = fields.find((f) => f.name === "timeout");

			expect(timeoutField).toBeDefined();
			expect(timeoutField?.name).toBe("timeout");
			expect(timeoutField?.description).toContain("Timeout in seconds");
			expect(timeoutField?.constraints.type).toBe("integer");
			expect(timeoutField?.constraints.format).toBe("int64");
			expect(timeoutField?.extensions.recommendedValue).toBe(3);
			expect(timeoutField?.extensions.requiredFor?.create).toBe(true);
		});

		it("extracts interval field with constraints", () => {
			const fields = extractFieldSpecs(
				"healthcheckCreateSpecType",
				openApiSpec,
			);
			const intervalField = fields.find((f) => f.name === "interval");

			expect(intervalField).toBeDefined();
			expect(intervalField?.constraints.minimum).toBeDefined();
			expect(intervalField?.constraints.maximum).toBeDefined();
			expect(intervalField?.extensions.recommendedValue).toBe(15);
		});

		it("extracts jitter_percent with server default", () => {
			const fields = extractFieldSpecs(
				"healthcheckCreateSpecType",
				openApiSpec,
			);
			const jitterField = fields.find((f) => f.name === "jitter_percent");

			expect(jitterField).toBeDefined();
			expect(jitterField?.default).toBe(0);
			expect(jitterField?.extensions.serverDefault).toBe(true);
			expect(jitterField?.extensions.recommendedValue).toBe(30);
		});

		it("identifies oneOf group membership for http_health_check", () => {
			const fields = extractFieldSpecs(
				"healthcheckCreateSpecType",
				openApiSpec,
			);
			const httpHealthCheckField = fields.find(
				(f) => f.name === "http_health_check",
			);

			expect(httpHealthCheckField).toBeDefined();
			expect(httpHealthCheckField?.oneOfGroup).toBe("health_check");
		});

		it("identifies conflicts for http_health_check", () => {
			const fields = extractFieldSpecs(
				"healthcheckCreateSpecType",
				openApiSpec,
			);
			const httpHealthCheckField = fields.find(
				(f) => f.name === "http_health_check",
			);

			expect(httpHealthCheckField).toBeDefined();
			expect(httpHealthCheckField?.extensions.conflictsWith).toContain(
				"tcp_health_check",
			);
			expect(httpHealthCheckField?.extensions.conflictsWith).toContain(
				"udp_icmp_health_check",
			);
		});
	});
});
