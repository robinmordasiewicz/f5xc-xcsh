/**
 * Quota Pre-Check Service
 *
 * Pre-check logic for validating quota availability before create operations
 */

import type { SubscriptionClient } from "../domains/subscription/client.js";
import type { QuotaCheckResult, QuotaCheckOptions } from "./types.js";
import { getQuotaMapping } from "./mapping.js";
import { getQuotaCache } from "./cache.js";

/**
 * Warning threshold - show warning when usage is at or above this percentage
 */
const WARNING_THRESHOLD = 90;

/**
 * Error threshold - block operation when usage is at or above this percentage
 */
const ERROR_THRESHOLD = 100;

/**
 * Check quota availability before a create operation
 *
 * @param client - Subscription client for API calls
 * @param options - Check options including resource type and namespace
 * @returns Quota check result with proceed flag and optional warning/error
 */
export async function checkQuotaBeforeCreate(
  client: SubscriptionClient,
  options: QuotaCheckOptions,
): Promise<QuotaCheckResult> {
  const { resourceType, namespace, force = false } = options;

  // Get quota mapping for this resource type
  const mapping = getQuotaMapping(resourceType);
  if (!mapping) {
    // No known mapping - allow operation to proceed
    return { proceed: true, level: "none" };
  }

  try {
    // Fetch quota usage (uses cache if available)
    const cache = getQuotaCache();
    const quotaUsage = await cache.findQuotaUsage(
      client,
      namespace,
      mapping.quotaName,
    );

    if (!quotaUsage) {
      // Quota not found in API response - allow operation
      return { proceed: true, level: "none" };
    }

    // Calculate percentage if not provided
    const percentage =
      quotaUsage.percentage ??
      (quotaUsage.limit > 0
        ? Math.round((quotaUsage.current / quotaUsage.limit) * 100)
        : 0);

    const quotaInfo = {
      name: quotaUsage.name,
      displayName: mapping.displayName,
      current: quotaUsage.current,
      limit: quotaUsage.limit,
      percentage,
    };

    // At or over limit - error (unless forced)
    if (percentage >= ERROR_THRESHOLD) {
      return {
        proceed: force,
        level: "error",
        message: force
          ? `Quota limit reached for ${mapping.displayName}, proceeding due to --force`
          : `Quota limit reached for ${mapping.displayName}`,
        quota: quotaInfo,
      };
    }

    // Near limit - warning
    if (percentage >= WARNING_THRESHOLD) {
      return {
        proceed: true,
        level: "warning",
        message: `Approaching quota limit for ${mapping.displayName}`,
        quota: quotaInfo,
      };
    }

    // Under threshold - no message
    return { proceed: true, level: "none" };
  } catch (error) {
    // Fail open - if we can't check quota, allow the operation
    // The API will reject if actually at limit
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      proceed: true,
      level: "none",
      message: `Could not check quota: ${message}`,
    };
  }
}

/**
 * Format quota check result for display
 *
 * @param result - Quota check result
 * @returns Array of formatted output lines
 */
export function formatQuotaWarning(result: QuotaCheckResult): string[] {
  if (result.level === "none" || !result.quota) {
    return [];
  }

  const { quota, level } = result;
  const lines: string[] = [];

  // Header with icon
  const icon = level === "error" ? "❌" : "⚠️";
  const title = level === "error" ? "Quota Exceeded" : "Quota Warning";
  lines.push(`${icon}  ${title}: ${quota.displayName}`);

  // Usage details
  lines.push(
    `    Usage: ${quota.current}/${quota.limit} (${quota.percentage}%)`,
  );

  // Progress bar (20 chars wide)
  const barWidth = 20;
  const filledWidth = Math.round((quota.percentage / 100) * barWidth);
  const emptyWidth = barWidth - filledWidth;
  const filledChar = "█";
  const emptyChar = "░";
  const progressBar =
    filledChar.repeat(filledWidth) + emptyChar.repeat(emptyWidth);
  lines.push(`    ${progressBar}`);

  // Contextual message
  lines.push("");
  if (level === "error") {
    lines.push("    Cannot create - quota limit reached.");
    lines.push(
      "    Use --force to attempt anyway, or delete existing resources.",
    );
  } else {
    lines.push("    Creating this resource will approach your quota limit.");
  }

  return lines;
}

/**
 * Format a simple quota status line for inline display
 *
 * @param result - Quota check result
 * @returns Single-line status string or empty string if no warning
 */
export function formatQuotaStatusLine(result: QuotaCheckResult): string {
  if (result.level === "none" || !result.quota) {
    return "";
  }

  const { quota, level } = result;
  const icon = level === "error" ? "❌" : "⚠️";
  return `${icon} ${quota.displayName}: ${quota.current}/${quota.limit} (${quota.percentage}%)`;
}
