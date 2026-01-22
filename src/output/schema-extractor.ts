/**
 * Schema Extraction Utilities
 * Extract field specifications, constraints, and F5 XC extensions from OpenAPI schema
 */

import openApiSpec from "../../.specs/openapi.json" with { type: "json" };
import type {
	FieldSpec,
	OneOfGroup,
	FieldConstraints,
	F5XCExtensions,
} from "./types.js";
import { PROPERTY_CONFLICTS } from "../types/conflicts_generated.js";

interface OpenApiSchemaProperty {
	description?: string;
	default?: unknown;
	type?: string;
	required?: boolean | string[];
	"x-f5xc"?: F5XCExtensions;
	"x-f5xc-server-default"?: boolean;
	"x-f5xc-recommended-value"?: unknown;
	"x-f5xc-conflicts-with"?: string[];
	"x-f5xc-description-short"?: string;
	"x-f5xc-description-medium"?: string;
	"x-f5xc-required-for"?: {
		minimum_config?: boolean;
		create?: boolean;
		update?: boolean;
		read?: boolean;
	};
	"x-f5xc-example"?: string;
	"x-ves-example"?: string;
	"x-f5xc-recommended-oneof-variant"?: Record<string, string>;
	"x-ves-oneof-field-*"?: string;
	[key: string]: unknown;
	enum?: unknown[];
	format?: string;
	minimum?: number;
	maximum?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	items?: OpenApiSchemaProperty;
	oneOf?: Array<{ properties?: Record<string, OpenApiSchemaProperty> }>;
	properties?: Record<string, OpenApiSchemaProperty>;
}

interface OpenApiComponentSchemas {
	[key: string]: OpenApiSchemaProperty;
}

interface OpenApiComponents {
	schemas?: OpenApiComponentSchemas;
}

export interface OpenApiSpec {
	components?: OpenApiComponents;
	[key: string]: unknown;
}

/**
 * Load OpenAPI specification (embedded at build time)
 */
export function loadOpenApiSpec(): OpenApiSpec {
	return openApiSpec as OpenApiSpec;
}

/**
 * Extract field specifications from OpenAPI schema
 * @param schemaName - OpenAPI schema name (e.g., "healthcheckCreateSpecType")
 * @param openApiSpec - Full OpenAPI specification object
 * @returns Array of FieldSpec objects
 */
export function extractFieldSpecs(
	schemaName: string,
	openApiSpec: OpenApiSpec,
): FieldSpec[] {
	const schema = openApiSpec.components?.schemas?.[schemaName];
	if (!schema || !schema.properties) {
		return [];
	}

	const fields: FieldSpec[] = [];
	const required = new Set(
		Array.isArray(schema.required) ? schema.required : [],
	);

	for (const [fieldName, property] of Object.entries(
		schema.properties as Record<string, OpenApiSchemaProperty>,
	)) {
		const fieldSpec: FieldSpec = {
			name: fieldName,
			description: property.description || "",
			constraints: extractConstraints(property),
			required: required.has(fieldName),
			default: property.default,
			extensions: extractF5XCExtensions(property),
		};

		// Check if field is part of a oneOf group
		const oneOfField = findOneOfGroup(fieldName, schema);
		if (oneOfField) {
			fieldSpec.oneOfGroup = oneOfField;
		}

		fields.push(fieldSpec);
	}

	return fields;
}

/**
 * Extract oneOf groups from OpenAPI schema
 * @param schemaName - OpenAPI schema name
 * @param openApiSpec - Full OpenAPI specification object
 * @returns Array of OneOfGroup objects
 */
export function extractOneOfGroups(
	schemaName: string,
	openApiSpec: OpenApiSpec,
): OneOfGroup[] {
	const schema = openApiSpec.components?.schemas?.[schemaName];
	if (!schema) {
		return [];
	}

	const groups: OneOfGroup[] = [];

	// Find all x-ves-oneof-field-* extensions
	for (const [key, value] of Object.entries(schema)) {
		if (key.startsWith("x-ves-oneof-field-")) {
			const groupName = key.replace("x-ves-oneof-field-", "");
			const variants = JSON.parse(value as string);

			// Look for recommended variant
			const recommendedVariant =
				schema["x-f5xc-recommended-oneof-variant"]?.[groupName];

			groups.push({
				groupName,
				variants,
				...(recommendedVariant && { recommendedVariant }),
				description: `Choose exactly one of: ${variants.join(", ")}`,
			});
		}
	}

	return groups;
}

/**
 * Extract constraints from property definition
 */
export function extractConstraints(
	property: OpenApiSchemaProperty,
): FieldConstraints {
	const constraints: FieldConstraints = {
		type: (property.type as string) || "unknown",
	};

	// String constraints
	if (property.minLength !== undefined && property.minLength !== null)
		constraints.minLength = property.minLength as number;
	if (property.maxLength !== undefined && property.maxLength !== null)
		constraints.maxLength = property.maxLength as number;
	if (property.pattern !== undefined && property.pattern !== null)
		constraints.pattern = property.pattern as string;
	if (property.format !== undefined && property.format !== null)
		constraints.format = property.format as string;

	// Number constraints
	if (property.minimum !== undefined && property.minimum !== null)
		constraints.minimum = property.minimum as number;
	if (property.maximum !== undefined && property.maximum !== null)
		constraints.maximum = property.maximum as number;

	// Array constraints
	if (property.maxItems !== undefined && property.maxItems !== null)
		constraints.maxItems = property.maxItems as number;
	if (property.uniqueItems !== undefined && property.uniqueItems !== null)
		constraints.uniqueItems = property.uniqueItems as boolean;

	// Enum values
	if (property.enum !== undefined && property.enum !== null)
		constraints.enum = property.enum as unknown[];

	return constraints;
}

/**
 * Extract F5 XC extensions from property definition
 */
export function extractF5XCExtensions(
	property: OpenApiSchemaProperty,
): F5XCExtensions {
	const extensions: F5XCExtensions = {};

	if (property["x-f5xc-server-default"] !== undefined) {
		extensions.serverDefault = property["x-f5xc-server-default"] as boolean;
	}

	if (property["x-f5xc-recommended-value"] !== undefined) {
		extensions.recommendedValue = property["x-f5xc-recommended-value"];
	}

	if (property["x-f5xc-conflicts-with"] !== undefined) {
		extensions.conflictsWith = property[
			"x-f5xc-conflicts-with"
		] as string[];
	}

	if (property["x-f5xc-description-short"] !== undefined) {
		extensions.descriptionShort = property[
			"x-f5xc-description-short"
		] as string;
	}

	if (property["x-f5xc-description-medium"] !== undefined) {
		extensions.descriptionMedium = property[
			"x-f5xc-description-medium"
		] as string;
	}

	if (property["x-f5xc-required-for"] !== undefined) {
		const requiredFor = property["x-f5xc-required-for"];
		if (requiredFor) {
			extensions.requiredFor = requiredFor as Exclude<
				typeof requiredFor,
				undefined
			>;
		}
	}

	if (
		property["x-f5xc-example"] !== undefined ||
		property["x-ves-example"] !== undefined
	) {
		extensions.example =
			(property["x-f5xc-example"] as string) ||
			(property["x-ves-example"] as string);
	}

	return extensions;
}

/**
 * Find oneOf group that contains the given field
 */
function findOneOfGroup(
	fieldName: string,
	schema: OpenApiSchemaProperty,
): string | undefined {
	for (const [key, value] of Object.entries(schema)) {
		if (key.startsWith("x-ves-oneof-field-")) {
			const groupName = key.replace("x-ves-oneof-field-", "");
			const variants = JSON.parse(value as string);
			if (variants.includes(fieldName)) {
				return groupName;
			}
		}
	}
	return undefined;
}

/**
 * Resolve conflicts using PROPERTY_CONFLICTS map
 */
export function resolveConflicts(fieldName: string): string[] {
	const conflicts = PROPERTY_CONFLICTS.get(fieldName);
	return conflicts ? Array.from(conflicts) : [];
}
