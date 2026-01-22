/**
 * Output Types
 * Unified type definitions for output formatting
 */

/**
 * All valid output formats (runtime array for validation/help)
 * This is the single source of truth - type is derived from this constant
 */
export const ALL_OUTPUT_FORMATS = [
	"json",
	"yaml",
	"table",
	"text",
	"tsv",
	"none",
	"spec",
] as const;

/**
 * Helper string for help text generation
 * Automatically derived from ALL_OUTPUT_FORMATS
 */
export const OUTPUT_FORMAT_HELP = ALL_OUTPUT_FORMATS.join(", ");

/**
 * Supported output format types
 * Derived from ALL_OUTPUT_FORMATS constant for type safety
 */
export type OutputFormat = (typeof ALL_OUTPUT_FORMATS)[number];

/**
 * Table styling configuration
 */
export interface TableStyle {
	/** Use Unicode box-drawing characters (╭╮) vs ASCII (+|-) */
	unicode: boolean;
	/** Apply F5 brand red color to borders */
	coloredBorders: boolean;
	/** Border color ANSI code (defaults to F5 red) */
	borderColor?: string;
	/** Header styling */
	headerStyle?: "bold" | "normal" | "dim";
}

/**
 * Column definition for tables
 */
export interface ColumnDefinition {
	/** Column header name */
	header: string;
	/** Data accessor key or function */
	accessor: string | ((row: Record<string, unknown>) => string);
	/** Fixed column width */
	width?: number;
	/** Minimum column width */
	minWidth?: number;
	/** Maximum column width */
	maxWidth?: number;
	/** Column alignment */
	align?: "left" | "center" | "right";
	/** Priority for column display (lower = higher priority) */
	priority?: number;
}

/**
 * Table configuration
 */
export interface TableConfig {
	/** Column definitions */
	columns: ColumnDefinition[];
	/** Table style options */
	style?: TableStyle;
	/** Maximum total table width */
	maxWidth?: number;
	/** Enable text wrapping in cells */
	wrapText?: boolean;
	/** Show row separators between data rows */
	rowSeparators?: boolean;
	/** Title to display in the table header */
	title?: string;
}

/**
 * Output context for format resolution
 */
export interface OutputContext {
	/** Explicit format from CLI flag (--output) */
	cliFormat?: OutputFormat;
	/** Format from environment variable (F5XC_OUTPUT_FORMAT) */
	envFormat?: OutputFormat;
	/** Format from config file */
	configFormat?: OutputFormat;
	/** Is this an interactive session (REPL) */
	isInteractive: boolean;
	/** Is output to a terminal (TTY) */
	isTTY: boolean;
	/** No color flag (--no-color) */
	noColor?: boolean;
}

/**
 * Flag specification for command documentation
 */
export interface FlagSpec {
	/** Flag name (long form, e.g., "--output") */
	name: string;
	/** Short alias (e.g., "-o") */
	alias?: string;
	/** Flag description */
	description: string;
	/** Expected value type */
	type?: "string" | "boolean" | "number";
	/** Default value */
	default?: string;
	/** Is this flag required */
	required?: boolean;
	/** Allowed values for string type */
	choices?: string[];
}

/**
 * Example specification for command documentation
 */
export interface ExampleSpec {
	/** Command example */
	command: string;
	/** Description of what it does */
	description: string;
}

/**
 * Command specification for AI assistants
 * JSON schema output format for --spec flag
 */
export interface CommandSpec {
	/** Command name (e.g., "cloudstatus status") */
	command: string;
	/** Command description */
	description: string;
	/** Usage pattern */
	usage: string;
	/** Available flags/options */
	flags: FlagSpec[];
	/** Example invocations */
	examples: ExampleSpec[];
	/** Supported output formats */
	outputFormats: string[];
	/** Related commands */
	related?: string[];
	/** Command category/domain */
	category?: string;
	/** Resource-specific information for creation commands */
	resourceSpec?: ResourceSpec;
	/** AI assistant guide for progressive disclosure (NEW) */
	aiAssistantGuide?: AIAssistantGuide;
	/** Resource information for discovery commands */
	resources?: {
		total: number;
		primary: number;
		discovered: number;
		categories: unknown;
		list: Array<{
			name: string;
			description: string;
			operations: string[];
			category: string;
		}>;
	};
}

/**
 * Field constraint information extracted from OpenAPI schema
 */
export interface FieldConstraints {
	/** Type: string, integer, boolean, array, object */
	type: string;

	/** For strings: minimum length */
	minLength?: number;

	/** For strings: maximum length */
	maxLength?: number;

	/** For numbers: minimum value */
	minimum?: number;

	/** For numbers: maximum value */
	maximum?: number;

	/** For arrays: maximum items */
	maxItems?: number;

	/** For arrays: unique items required */
	uniqueItems?: boolean;

	/** Regular expression pattern for validation */
	pattern?: string;

	/** Format hint (e.g., "int64", "date-time") */
	format?: string;

	/** Allowed enum values */
	enum?: unknown[];
}

/**
 * OneOf group representing mutually exclusive field choices
 */
export interface OneOfGroup {
	/** Name of the oneOf choice field (e.g., "health_check", "host_header_choice") */
	groupName: string;

	/** Field names that are part of this oneOf group */
	variants: string[];

	/** Recommended variant to use (from x-f5xc-recommended-oneof-variant) */
	recommendedVariant?: string;

	/** Human-readable description of the choice */
	description?: string;
}

/**
 * F5 XC-specific extensions from OpenAPI schema
 */
export interface F5XCExtensions {
	/** Server applies default if omitted (x-f5xc-server-default) */
	serverDefault?: boolean;

	/** Recommended value for console pre-population (x-f5xc-recommended-value) */
	recommendedValue?: unknown;

	/** Fields that conflict with this field (x-f5xc-conflicts-with) */
	conflictsWith?: string[];

	/** Short description for tooltips */
	descriptionShort?: string;

	/** Medium description for documentation */
	descriptionMedium?: string;

	/** Required for specific operations */
	requiredFor?: {
		minimum_config?: boolean;
		create?: boolean;
		update?: boolean;
		read?: boolean;
	};

	/** Example value */
	example?: string;
}

/**
 * Complete field specification for resource properties
 */
export interface FieldSpec {
	/** Field name (e.g., "timeout", "path", "use_origin_server_name") */
	name: string;

	/** Field description */
	description: string;

	/** Type information and constraints */
	constraints: FieldConstraints;

	/** Is this field required */
	required: boolean;

	/** Default value if not specified */
	default?: unknown;

	/** F5 XC-specific extensions */
	extensions: F5XCExtensions;

	/** If this field is part of a oneOf group, which group */
	oneOfGroup?: string;
}

/**
 * Resource specification for AI assistants
 * Enhanced version of CommandSpec for resource creation
 */
export interface ResourceSpec {
	/** Resource type (e.g., "healthcheck", "origin_pool") */
	resourceType: string;

	/** All fields available for this resource */
	fields: FieldSpec[];

	/** OneOf groups representing mutually exclusive choices */
	oneOfGroups: OneOfGroup[];

	/** AI assistant guide for this resource */
	aiAssistantGuide?: string | AIAssistantGuide;

	/** Minimum configuration required */
	minimumConfiguration?: {
		description: string;
		requiredFields: string[];
		mutuallyExclusiveGroups: Array<{
			fields: string[];
			reason: string;
		}>;
		exampleYaml?: string;
		exampleJson?: string;
	};
}

/**
 * Field information for AI assistant guide
 * Simplified field info with AI-specific hints
 */
export interface FieldInfo {
	/** Field path (e.g., "spec.timeout") */
	path: string;

	/** Field name (e.g., "timeout") */
	name: string;

	/** Field type (e.g., "integer", "string") */
	type: string;

	/** Human-readable description */
	description: string;

	/** AI-specific guidance for this field */
	aiHint: string;

	/** Recommended value for this field */
	recommendedValue?: unknown;

	/** Example value */
	example?: unknown;

	/** Field constraints (min, max, enum, etc.) */
	constraints?: {
		min?: number;
		max?: number;
		enum?: unknown[];
		pattern?: string;
	};
}

/**
 * Quick start guide for immediate productivity
 */
export interface QuickStart {
	/** Description of the quickest path to success */
	description: string;

	/** Minimum required fields to create a working resource */
	minimumRequiredFields: string[];

	/** Recommended default values for optional fields */
	recommendedDefaults: Record<string, unknown>;

	/** Simple working example */
	simpleExample: {
		description: string;
		yaml?: string;
		json?: string;
	};
}

/**
 * Common pattern for specific use cases
 */
export interface CommonPattern {
	/** Pattern name (e.g., "simple-http-check") */
	name: string;

	/** What this pattern does */
	description: string;

	/** When to use this pattern */
	useCase: string;

	/** Complete working example */
	example: {
		yaml?: string;
		json?: string;
	};
}

/**
 * Field guide organized by importance
 */
export interface FieldGuide {
	/** Required fields that must be provided */
	required: FieldInfo[];

	/** Recommended fields with good defaults */
	recommended: FieldInfo[];

	/** Optional fields for advanced use cases */
	optional: FieldInfo[];
}

/**
 * Validation rules and constraints
 */
export interface ValidationRules {
	/** Mutually exclusive field groups (oneOf) */
	mutuallyExclusive: Array<{
		fields: string[];
		reason: string;
		recommendation: string;
	}>;

	/** Field dependencies (requires other fields) */
	dependencies: Array<{
		field: string;
		requires: string[];
		reason: string;
	}>;
}

/**
 * Troubleshooting common issues
 */
export interface Troubleshooting {
	/** Description of the issue */
	issue: string;

	/** How to resolve it */
	solution: string;

	/** Related fields involved */
	relatedFields: string[];
}

/**
 * AI Assistant Guide for progressive disclosure
 * Provides AI-friendly structured information beyond raw schema
 */
export interface AIAssistantGuide {
	/** Purpose and overview of this resource type */
	purpose: string;

	/** Quick start for immediate productivity */
	quickStart: QuickStart;

	/** Common patterns for specific use cases */
	commonPatterns: CommonPattern[];

	/** Field guide organized by importance */
	fieldGuide: FieldGuide;

	/** Validation steps and constraints */
	validationSteps: ValidationRules;

	/** Best practices for using this resource */
	bestPractices: string[];

	/** Troubleshooting common issues */
	troubleshooting: Troubleshooting[];
}

/**
 * Box drawing character sets
 */
export interface BoxCharacters {
	topLeft: string;
	topRight: string;
	bottomLeft: string;
	bottomRight: string;
	horizontal: string;
	vertical: string;
	leftT: string;
	rightT: string;
	topT: string;
	bottomT: string;
	cross: string;
}

/**
 * Default table style using Unicode characters with F5 red borders
 */
export const DEFAULT_TABLE_STYLE: TableStyle = {
	unicode: true,
	coloredBorders: true,
	headerStyle: "bold",
};

/**
 * Plain ASCII table style (no colors, ASCII characters)
 */
export const PLAIN_TABLE_STYLE: TableStyle = {
	unicode: false,
	coloredBorders: false,
	headerStyle: "normal",
};

/**
 * Check if a string is a valid output format
 * Uses ALL_OUTPUT_FORMATS as single source of truth
 */
export function isValidOutputFormat(format: string): format is OutputFormat {
	return (ALL_OUTPUT_FORMATS as readonly string[]).includes(
		format.toLowerCase(),
	);
}
