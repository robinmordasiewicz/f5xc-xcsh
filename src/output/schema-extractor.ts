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

/**
 * Load OpenAPI specification (embedded at build time)
 */
export function loadOpenApiSpec(): any {
	return openApiSpec;
}

/**
 * Extract field specifications from OpenAPI schema
 * @param schemaName - OpenAPI schema name (e.g., "healthcheckCreateSpecType")
 * @param openApiSpec - Full OpenAPI specification object
 * @returns Array of FieldSpec objects
 */
export function extractFieldSpecs(
	schemaName: string,
	openApiSpec: any,
): FieldSpec[] {
	const schema = openApiSpec.components?.schemas?.[schemaName];
	if (!schema || !schema.properties) {
		return [];
	}

	const fields: FieldSpec[] = [];
	const required = new Set(schema.required || []);

	for (const [fieldName, property] of Object.entries(
		schema.properties as Record<string, any>,
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
	openApiSpec: any,
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
				recommendedVariant,
				description: `Choose exactly one of: ${variants.join(", ")}`,
			});
		}
	}

	return groups;
}

/**
 * Extract constraints from property definition
 */
export function extractConstraints(property: any): FieldConstraints {
	const constraints: FieldConstraints = {
		type: property.type || "unknown",
	};

	// String constraints
	if (property.minLength !== undefined)
		constraints.minLength = property.minLength;
	if (property.maxLength !== undefined)
		constraints.maxLength = property.maxLength;
	if (property.pattern !== undefined) constraints.pattern = property.pattern;
	if (property.format !== undefined) constraints.format = property.format;

	// Number constraints
	if (property.minimum !== undefined) constraints.minimum = property.minimum;
	if (property.maximum !== undefined) constraints.maximum = property.maximum;

	// Array constraints
	if (property.maxItems !== undefined)
		constraints.maxItems = property.maxItems;
	if (property.uniqueItems !== undefined)
		constraints.uniqueItems = property.uniqueItems;

	// Enum values
	if (property.enum !== undefined) constraints.enum = property.enum;

	return constraints;
}

/**
 * Extract F5 XC extensions from property definition
 */
export function extractF5XCExtensions(property: any): F5XCExtensions {
	const extensions: F5XCExtensions = {};

	if (property["x-f5xc-server-default"] !== undefined) {
		extensions.serverDefault = property["x-f5xc-server-default"];
	}

	if (property["x-f5xc-recommended-value"] !== undefined) {
		extensions.recommendedValue = property["x-f5xc-recommended-value"];
	}

	if (property["x-f5xc-conflicts-with"] !== undefined) {
		extensions.conflictsWith = property["x-f5xc-conflicts-with"];
	}

	if (property["x-f5xc-description-short"] !== undefined) {
		extensions.descriptionShort = property["x-f5xc-description-short"];
	}

	if (property["x-f5xc-description-medium"] !== undefined) {
		extensions.descriptionMedium = property["x-f5xc-description-medium"];
	}

	if (property["x-f5xc-required-for"] !== undefined) {
		extensions.requiredFor = property["x-f5xc-required-for"];
	}

	if (
		property["x-f5xc-example"] !== undefined ||
		property["x-ves-example"] !== undefined
	) {
		extensions.example =
			property["x-f5xc-example"] || property["x-ves-example"];
	}

	return extensions;
}

/**
 * Find oneOf group that contains the given field
 */
function findOneOfGroup(fieldName: string, schema: any): string | undefined {
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
