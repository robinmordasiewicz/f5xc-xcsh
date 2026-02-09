/**
 * App Firewall Resource Builder
 *
 * Converts parsed CLI flags into F5 XC API request body for app_firewall resources.
 */

import {
  ParsedCreationFlags,
  getFlagValue,
  getFlagIntValue,
  isFlagSet,
} from "../flag-parser.js";

/**
 * F5 XC App Firewall API request body structure
 */
export interface AppFirewallRequestBody {
  metadata: {
    name: string;
    namespace: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
  };
  spec: {
    blocking_mode?: "MONITORING" | "BLOCKING";
    detection_mode?: "LOW" | "MEDIUM" | "HIGH" | "CUSTOM";
    enable_sql_injection?: boolean;
    enable_xss?: boolean;
    enable_command_injection?: boolean;
    allowed_response_codes?: number[];
    max_request_size?: number;
    enable_api_protection?: boolean;
    enable_bot_protection?: boolean;
    enable_threat_campaigns?: boolean;
  };
}

/**
 * Validation result from builder
 */
export interface BuilderValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Parse response codes from comma-separated string
 * Supports formats: "200", "200,201,202", "200-299"
 */
function parseResponseCodes(value: string): number[] {
  const codes: number[] = [];
  const parts = value.split(",");

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      // Range: "200-299"
      const [startStr, endStr] = trimmed.split("-");
      if (startStr && endStr) {
        const start = parseInt(startStr.trim(), 10);
        const end = parseInt(endStr.trim(), 10);
        for (let i = start; i <= end; i++) {
          codes.push(i);
        }
      }
    } else {
      // Single code: "200"
      const code = parseInt(trimmed, 10);
      if (!isNaN(code)) {
        codes.push(code);
      }
    }
  }

  return codes;
}

/**
 * Build app_firewall API request body from parsed flags
 *
 * @param flags - Parsed creation flags
 * @param namespace - Target namespace
 * @returns App Firewall request body ready for API POST
 */
export function buildAppFirewallRequest(
  flags: ParsedCreationFlags,
  namespace: string,
): AppFirewallRequestBody {
  const name = getFlagValue(flags, "--name");

  // Build base request
  const request: AppFirewallRequestBody = {
    metadata: {
      name: name || "",
      namespace: namespace,
    },
    spec: {},
  };

  // Blocking mode (optional, server default: MONITORING)
  const blockingMode = getFlagValue(flags, "--blocking-mode");
  if (blockingMode) {
    request.spec.blocking_mode = blockingMode as "MONITORING" | "BLOCKING";
  }

  // Detection mode (optional, server default: MEDIUM)
  const detectionMode = getFlagValue(flags, "--detection-mode");
  if (detectionMode) {
    request.spec.detection_mode = detectionMode as
      | "LOW"
      | "MEDIUM"
      | "HIGH"
      | "CUSTOM";
  }

  // Protection toggles (boolean flags)
  if (isFlagSet(flags, "--enable-sql-injection")) {
    request.spec.enable_sql_injection = true;
  }
  if (isFlagSet(flags, "--enable-xss")) {
    request.spec.enable_xss = true;
  }
  if (isFlagSet(flags, "--enable-command-injection")) {
    request.spec.enable_command_injection = true;
  }

  // Response validation
  const allowedResponseCodes = getFlagValue(flags, "--allowed-response-codes");
  if (allowedResponseCodes) {
    request.spec.allowed_response_codes =
      parseResponseCodes(allowedResponseCodes);
  }

  const maxRequestSize = getFlagIntValue(flags, "--max-request-size");
  if (maxRequestSize !== undefined) {
    request.spec.max_request_size = maxRequestSize;
  }

  // Advanced features
  if (isFlagSet(flags, "--enable-api-protection")) {
    request.spec.enable_api_protection = true;
  }
  if (isFlagSet(flags, "--enable-bot-protection")) {
    request.spec.enable_bot_protection = true;
  }
  if (isFlagSet(flags, "--enable-threat-campaigns")) {
    request.spec.enable_threat_campaigns = true;
  }

  return request;
}

/**
 * Validate app_firewall flags before building
 *
 * @param flags - Parsed creation flags
 * @returns Validation result with errors if any
 */
export function validateAppFirewallFlags(
  flags: ParsedCreationFlags,
): BuilderValidationResult {
  const errors: string[] = [];

  // Include any parsing errors from flag-parser
  if (flags.errors && flags.errors.length > 0) {
    errors.push(...flags.errors);
  }

  // Check required fields
  const name = getFlagValue(flags, "--name");
  if (!name) {
    errors.push("--name is required");
  } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(name) && name.length > 1) {
    errors.push(
      "--name must contain only lowercase alphanumeric characters and hyphens",
    );
  }

  // Validate blocking mode enum
  const blockingMode = getFlagValue(flags, "--blocking-mode");
  if (blockingMode) {
    const validModes = ["MONITORING", "BLOCKING"];
    if (!validModes.includes(blockingMode)) {
      errors.push(`--blocking-mode must be one of: ${validModes.join(", ")}`);
    }
  }

  // Validate detection mode enum
  const detectionMode = getFlagValue(flags, "--detection-mode");
  if (detectionMode) {
    const validModes = ["LOW", "MEDIUM", "HIGH", "CUSTOM"];
    if (!validModes.includes(detectionMode)) {
      errors.push(`--detection-mode must be one of: ${validModes.join(", ")}`);
    }
  }

  // Validate max-request-size range
  const maxRequestSize = getFlagIntValue(flags, "--max-request-size");
  if (maxRequestSize !== undefined) {
    if (maxRequestSize < 1 || maxRequestSize > 10485760) {
      errors.push(
        "--max-request-size must be between 1 and 10485760 bytes (10MB)",
      );
    }
  }

  // Validate allowed-response-codes format and range
  const allowedResponseCodes = getFlagValue(flags, "--allowed-response-codes");
  if (allowedResponseCodes) {
    const codes = parseResponseCodes(allowedResponseCodes);
    for (const code of codes) {
      if (code < 100 || code > 599) {
        errors.push(
          `Invalid response code ${code}: must be between 100 and 599`,
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
