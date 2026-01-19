import type { CreationFlagDefinition } from "../completion/creation-flags.js";
import { colorDim } from "../../branding/index.js";

export function formatFlagEntry(flag: CreationFlagDefinition): string[] {
	const lines: string[] = [];

	// Build signature: -n, --name <value>
	const signature = buildFlagSignature(flag);
	lines.push(`    ${signature}`);

	// Description (indented)
	lines.push(`        ${flag.description}`);

	// Metadata annotations
	const annotations = buildFlagAnnotations(flag);
	for (const annotation of annotations) {
		lines.push(`        ${colorDim(annotation)}`);
	}

	lines.push(""); // Blank line
	return lines;
}

function buildFlagSignature(flag: CreationFlagDefinition): string {
	const names = flag.name;

	if (!flag.hasValue) {
		return names; // Boolean flag
	}

	const valueType = flag.valueType || "value";
	const valueName =
		valueType === "enum"
			? flag.enumValues?.join("|") || valueType
			: valueType;

	return `${names} <${valueName}>`;
}

function buildFlagAnnotations(flag: CreationFlagDefinition): string[] {
	const annotations: string[] = [];

	if (flag.required) {
		annotations.push("Required");
	}

	if (flag.isRepeatable) {
		const max = flag.maxOccurrences ? ` (max ${flag.maxOccurrences})` : "";
		annotations.push(`Repeatable${max}`);
	}

	if (flag.defaultValue !== undefined) {
		annotations.push(`Default: ${JSON.stringify(flag.defaultValue)}`);
	}

	if (flag.hasServerDefault) {
		annotations.push("Server default applied");
	}

	if (flag.recommendedValue !== undefined) {
		annotations.push(
			`Recommended: ${JSON.stringify(flag.recommendedValue)}`,
		);
	}

	if (flag.enumValues && flag.valueType === "enum") {
		annotations.push(`Values: ${flag.enumValues.join(", ")}`);
	}

	return annotations;
}
