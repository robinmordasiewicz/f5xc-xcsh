/**
 * Error Message Generation Utilities
 *
 * Helper functions to generate consistent error messages from command usage specifications.
 * This ensures error messages always match the usage field (single source of truth).
 */

import { parseUsage } from "../utils/usage-parser.js";

/**
 * Generate standard error message from command usage specification
 *
 * This ensures error messages always match the usage field, eliminating drift
 * between multiple sources of usage information.
 *
 * @param commandPath - Full command path (e.g., "login profile create")
 * @param usageField - Usage specification from CommandDefinition.usage
 * @param additionalHelp - Optional sections for options and examples
 * @returns Formatted error message string
 *
 * @example
 * generateUsageError(
 *   "login profile create",
 *   "<name> --url <api-url> --token <api-token> [--namespace <ns>]",
 *   {
 *     options: [
 *       { flag: "--url", description: "F5 XC API URL" },
 *       { flag: "--token", description: "API token" },
 *       { flag: "--namespace", description: "Default namespace (optional)" }
 *     ],
 *     examples: [
 *       "login profile create myprofile --url https://... --token abc123"
 *     ]
 *   }
 * )
 */
export function generateUsageError(
  commandPath: string,
  usageField: string,
  additionalHelp?: {
    options?: Array<{ flag: string; description: string }>;
    examples?: string[];
  },
): string {
  const lines: string[] = [];

  // Usage line - directly from usage field (SINGLE SOURCE OF TRUTH)
  lines.push(`Usage: ${commandPath} ${usageField}`);
  lines.push("");

  // Options section (if provided)
  if (additionalHelp?.options && additionalHelp.options.length > 0) {
    lines.push("Options:");
    for (const opt of additionalHelp.options) {
      lines.push(`  ${opt.flag.padEnd(12)} ${opt.description}`);
    }
    lines.push("");
  }

  // Examples section (if provided)
  if (additionalHelp?.examples && additionalHelp.examples.length > 0) {
    lines.push("Example:");
    for (const example of additionalHelp.examples) {
      lines.push(`  ${example}`);
    }
  }

  return lines.join("\n");
}

/**
 * Validate that usage field includes all flags mentioned in options
 *
 * This helps catch inconsistencies during development where options
 * are documented but not included in the usage specification.
 *
 * @param usageField - Usage specification to validate
 * @param options - Options array with flag names and requirements
 * @returns Array of validation issues (empty if consistent)
 *
 * @example
 * validateUsageMatchesOptions(
 *   "<name> --url <value>",
 *   [
 *     { flag: "--url", required: true },
 *     { flag: "--namespace", required: false }
 *   ]
 * )
 * // Returns: ["Flag --namespace in options but missing from usage"]
 */
export function validateUsageMatchesOptions(
  usageField: string,
  options: Array<{ flag: string; required: boolean }>,
): string[] {
  const usage = parseUsage(usageField);
  const issues: string[] = [];

  for (const opt of options) {
    const flagInUsage = usage.flags.find((f) => f.name === opt.flag);
    if (!flagInUsage) {
      issues.push(`Flag ${opt.flag} in options but missing from usage`);
    } else if (flagInUsage.required !== opt.required) {
      issues.push(
        `Flag ${opt.flag} required mismatch: usage=${flagInUsage.required}, options=${opt.required}`,
      );
    }
  }

  return issues;
}

/**
 * Generate simple usage-only error (no options or examples)
 *
 * Use this for commands with complex error handling where additional
 * context is provided separately.
 *
 * @param commandPath - Full command path
 * @param usageField - Usage specification
 * @returns Simple usage error message
 *
 * @example
 * generateSimpleUsageError("login show profile", "<profile-name>")
 * // Returns: "Usage: login show profile <profile-name>"
 */
export function generateSimpleUsageError(
  commandPath: string,
  usageField: string,
): string {
  return `Usage: ${commandPath} ${usageField}`;
}
