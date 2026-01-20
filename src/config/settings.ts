/**
 * Application settings from config.yaml file.
 * Handles loading, parsing, and validation of user configuration.
 *
 * Location: ~/.config/xcsh/config.yaml (XDG Base Directory compliant)
 */

import { promises as fs } from "fs";
import YAML from "yaml";
import { paths } from "./paths.js";

/**
 * Logo display mode definition with descriptions.
 * Single source of truth for mode names and their descriptions.
 * Used for both validation and help text generation.
 */
export interface LogoModeDefinition {
	/** Mode identifier */
	mode: string;
	/** Human-readable description */
	description: string;
}

/**
 * All supported logo display modes with descriptions.
 * This is the canonical definition - used for validation and help generation.
 */
export const LOGO_MODES: readonly LogoModeDefinition[] = [
	{
		mode: "image",
		description: "Image if terminal supports, else ASCII (default)",
	},
	{ mode: "ascii", description: "ASCII art only" },
	{ mode: "none", description: "No logo" },
] as const;

/**
 * Logo display mode type - derived from LOGO_MODES for type safety.
 */
export type LogoDisplayMode = (typeof LOGO_MODES)[number]["mode"];

/**
 * Helper string for help text generation
 * Automatically derived from LOGO_MODES constant
 */
export const LOGO_MODE_HELP = LOGO_MODES.map((m) => m.mode).join(", ");

/**
 * Completion mode definition with descriptions.
 * Single source of truth for completion resource display modes.
 */
export interface CompletionModeDefinition {
	/** Mode identifier */
	mode: string;
	/** Human-readable description */
	description: string;
}

/**
 * All supported completion resource display modes with descriptions.
 * This is the canonical definition - used for validation and help generation.
 */
export const COMPLETION_MODES: readonly CompletionModeDefinition[] = [
	{
		mode: "standard",
		description:
			"Show primary and CRUD resources with valid descriptions (default)",
	},
	{
		mode: "all",
		description: "Show all discovered resources",
	},
	{
		mode: "primary",
		description: "Show only primary resources",
	},
] as const;

/**
 * Completion mode type - derived from COMPLETION_MODES for type safety.
 */
export type CompletionMode = (typeof COMPLETION_MODES)[number]["mode"];

/**
 * Helper string for help text generation
 * Automatically derived from COMPLETION_MODES constant
 */
export const COMPLETION_MODE_HELP = COMPLETION_MODES.map((m) => m.mode).join(
	", ",
);

/**
 * Safety warning mode definition with descriptions.
 * Single source of truth for safety warning display modes.
 */
export interface SafetyWarningModeDefinition {
	/** Mode identifier */
	mode: string;
	/** Human-readable description */
	description: string;
}

/**
 * All supported safety warning display modes with descriptions.
 * This is the canonical definition - used for validation and help generation.
 */
export const SAFETY_WARNING_MODES: readonly SafetyWarningModeDefinition[] = [
	{
		mode: "enabled",
		description: "Show all warnings (default)",
	},
	{
		mode: "high-only",
		description: "Show only HIGH DANGER warnings",
	},
	{
		mode: "disabled",
		description: "Show no warnings",
	},
] as const;

/**
 * Safety warning mode type - derived from SAFETY_WARNING_MODES for type safety.
 */
export type SafetyWarningMode = (typeof SAFETY_WARNING_MODES)[number]["mode"];

/**
 * Helper string for help text generation
 * Automatically derived from SAFETY_WARNING_MODES constant
 */
export const SAFETY_WARNING_MODE_HELP = SAFETY_WARNING_MODES.map(
	(m) => m.mode,
).join(", ");

/**
 * Application settings from .xcshconfig file.
 */
export interface AppSettings {
	/** Logo display mode */
	logo: LogoDisplayMode;
	/** Completion resource display mode */
	completionMode: CompletionMode;
	/** Safety warning display mode */
	safetyWarnings: SafetyWarningMode;
}

/**
 * Default settings used when config file doesn't exist or values are missing.
 */
export const DEFAULT_SETTINGS: AppSettings = {
	logo: "image",
	completionMode: "standard",
	safetyWarnings: "enabled",
};

/**
 * Validate if a string is a valid logo display mode.
 * Uses LOGO_MODES as single source of truth.
 */
export function isValidLogoMode(mode: string): mode is LogoDisplayMode {
	return LOGO_MODES.some((m) => m.mode === mode);
}

/**
 * Get logo mode description for help text.
 */
export function getLogoModeDescription(mode: string): string | undefined {
	return LOGO_MODES.find((m) => m.mode === mode)?.description;
}

/**
 * Validate if a string is a valid completion mode.
 * Uses COMPLETION_MODES as single source of truth.
 */
export function isValidCompletionMode(mode: string): mode is CompletionMode {
	return COMPLETION_MODES.some((m) => m.mode === mode);
}

/**
 * Get completion mode description for help text.
 */
export function getCompletionModeDescription(mode: string): string | undefined {
	return COMPLETION_MODES.find((m) => m.mode === mode)?.description;
}

/**
 * Validate if a string is a valid safety warning mode.
 * Uses SAFETY_WARNING_MODES as single source of truth.
 */
export function isValidSafetyWarningMode(
	mode: string,
): mode is SafetyWarningMode {
	return SAFETY_WARNING_MODES.some((m) => m.mode === mode);
}

/**
 * Get safety warning mode description for help text.
 */
export function getSafetyWarningModeDescription(
	mode: string,
): string | undefined {
	return SAFETY_WARNING_MODES.find((m) => m.mode === mode)?.description;
}

/**
 * Validate and sanitize settings from config file.
 * Invalid values are ignored and defaults are used.
 */
function validateSettings(
	settings: Partial<AppSettings>,
): Partial<AppSettings> {
	const validated: Partial<AppSettings> = {};

	if (settings.logo && isValidLogoMode(settings.logo)) {
		validated.logo = settings.logo;
	}

	if (
		settings.completionMode &&
		isValidCompletionMode(settings.completionMode)
	) {
		validated.completionMode = settings.completionMode;
	}

	if (
		settings.safetyWarnings &&
		isValidSafetyWarningMode(settings.safetyWarnings)
	) {
		validated.safetyWarnings = settings.safetyWarnings;
	}

	return validated;
}

/**
 * Load settings from config.yaml file.
 *
 * File format: YAML
 * Location: ~/.config/xcsh/config.yaml (XDG Base Directory compliant)
 *
 * Example:
 * ```yaml
 * # F5 Distributed Cloud Shell Configuration
 * logo: image  # image | ascii | none
 * ```
 *
 * @returns Merged settings with defaults for missing values
 */
export async function loadSettings(): Promise<AppSettings> {
	const configPath = paths.settings;

	try {
		const content = await fs.readFile(configPath, "utf-8");
		const parsed = YAML.parse(content) as Partial<AppSettings>;

		return {
			...DEFAULT_SETTINGS,
			...validateSettings(parsed),
		};
	} catch {
		// File doesn't exist or is invalid - use defaults
		return DEFAULT_SETTINGS;
	}
}

/**
 * Load settings synchronously (for non-async contexts).
 * Uses defaults if file doesn't exist or can't be read.
 */
export function loadSettingsSync(): AppSettings {
	const configPath = paths.settings;

	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const content = require("fs").readFileSync(
			configPath,
			"utf-8",
		) as string;
		const parsed = YAML.parse(content) as Partial<AppSettings>;

		return {
			...DEFAULT_SETTINGS,
			...validateSettings(parsed),
		};
	} catch {
		return DEFAULT_SETTINGS;
	}
}

/**
 * Get the path to the config file.
 */
export function getConfigPath(): string {
	return paths.settings;
}
