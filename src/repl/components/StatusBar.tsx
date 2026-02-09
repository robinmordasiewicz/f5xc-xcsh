/**
 * StatusBar component - Displays connection status, git status and keyboard hints
 * Bottom bar with connection indicator, git branch info, and help text
 * Features pulsating status indicator with urgency-based animation rates
 */

import React, { useState, useEffect } from "react";
import { Box, Text, Spacer } from "ink";
import { execSync } from "child_process";
import { homedir } from "os";
import type { HealthStatus } from "../../api/client.js";
import { usePulseAnimation } from "../hooks/usePulseAnimation.js";
import { useStatusTransition } from "../hooks/useStatusTransition.js";
import { interpolateColors } from "../utils/colorInterpolation.js";

/**
 * Git repository status information
 */
export interface GitInfo {
  inRepo: boolean;
  repoName: string;
  branch: string;
  isDirty: boolean;
  ahead: number;
  behind: number;
}

/**
 * Connection status type for the status indicator
 */
export type ConnectionIndicatorStatus = HealthStatus | "unknown";

interface StatusBarProps {
  gitInfo?: GitInfo | undefined;
  width?: number;
  hint?: string;
  /** Connection status for the indicator */
  connectionStatus?: ConnectionIndicatorStatus;
  /** Whether a health check is in progress */
  isCheckingHealth?: boolean;
  /** Timestamp of last health check refresh (for anticipatory fade) */
  lastRefresh?: number;
  /** Poll interval in milliseconds (for anticipatory fade) */
  pollIntervalMs?: number;
}

/**
 * Get status icon based on git state
 */
function getStatusIcon(gitInfo: GitInfo): string {
  if (gitInfo.ahead > 0 && gitInfo.behind > 0) {
    return "\u21C5"; // up-down arrow
  }
  if (gitInfo.ahead > 0) {
    return "\u2191"; // up arrow
  }
  if (gitInfo.behind > 0) {
    return "\u2193"; // down arrow
  }
  if (gitInfo.isDirty) {
    return "*";
  }
  return "\u2713"; // checkmark
}

/**
 * Get color for status icon
 */
function getStatusColor(gitInfo: GitInfo): string {
  if (gitInfo.ahead > 0 || gitInfo.behind > 0) {
    return "#2196f3"; // Blue
  }
  if (gitInfo.isDirty) {
    return "#ffc107"; // Yellow
  }
  return "#00c853"; // Green
}

/**
 * Get formatted current working directory with ~ substitution for home
 */
function getFormattedCwd(): string {
  const cwd = process.cwd();
  const home = homedir();

  if (cwd === home) {
    return "~";
  }
  if (cwd.startsWith(home + "/")) {
    return "~" + cwd.slice(home.length);
  }
  return cwd;
}

/**
 * Pulse configuration for each connection status
 * Each status has different pulse rate to convey urgency:
 * - Green (connected): 30s organic cycle - natural breathing effect
 * - Yellow (auth_error): 10s organic cycle - noticeable but not alarming
 * - Red (offline): 2s organic cycle - urgent attention needed
 * - Gray (unknown): Static - no pulsation during checking state
 *
 * All colored statuses use organic multi-harmonic oscillation for natural
 * "breathing" effect rather than mechanical sine wave pulsation.
 */
interface PulseColorConfig {
  cycleDurationMs: number;
  baseColor: string;
  targetColor: string;
  /** Enable organic multi-harmonic oscillation for natural "breathing" effect */
  organic?: boolean;
}

const PULSE_CONFIGS: Record<ConnectionIndicatorStatus, PulseColorConfig> = {
  connected: {
    cycleDurationMs: 30000,
    baseColor: "#00c853",
    targetColor: "#007830",
    organic: true,
  },
  warning: {
    cycleDurationMs: 5000, // 5s cycle - faster than auth_error to indicate retrying
    baseColor: "#ffc107", // Same yellow as auth_error
    targetColor: "#ffcd38",
    organic: true,
  },
  auth_error: {
    cycleDurationMs: 10000,
    baseColor: "#ffc107",
    targetColor: "#ffcd38",
    organic: true,
  },
  offline: {
    cycleDurationMs: 2000,
    baseColor: "#ca260a",
    targetColor: "#8a1a07",
    organic: true,
  },
  unknown: {
    cycleDurationMs: 0, // Static - no pulsation
    baseColor: "#666666",
    targetColor: "#666666",
  },
};

/**
 * Get the connection indicator symbol
 */
function getConnectionIndicatorSymbol(isChecking: boolean): string {
  // While checking, show outline circle; otherwise filled circle
  return isChecking ? "○" : "●";
}

/**
 * StatusBar component
 * Displays connection indicator, git status, and keyboard hints
 * Features pulsating status indicator with urgency-based animation rates
 */
export function StatusBar({
  gitInfo,
  width = 80,
  hint = "Ctrl+C: quit",
  connectionStatus = "unknown",
  isCheckingHealth = false,
  lastRefresh = 0,
  pollIntervalMs = 0,
}: StatusBarProps): React.ReactElement {
  // Get pulse configuration for current status
  const pulseConfig = PULSE_CONFIGS[connectionStatus];

  // Status transition hook for anticipatory fade
  const statusTransition = useStatusTransition({
    lastRefresh,
    pollIntervalMs,
    isChecking: isCheckingHealth,
  });

  // Track pulse reset trigger for peak start after health check completes
  const [pulseResetTrigger, setPulseResetTrigger] = useState(0);
  useEffect(() => {
    if (statusTransition.shouldResetPulse) {
      setPulseResetTrigger((k) => k + 1);
    }
  }, [statusTransition.shouldResetPulse]);

  // Use pulse animation hook - keep running during transition for smooth blend
  // initialPhase 0.75 = peak brightness (oscillation=0 = baseColor = bright green)
  // Phase 0.75: sin(3π/2) = -1 → oscillation = (−1+1)/2 = 0 → baseColor (bright)
  // resetTrigger forces animation restart on each health check completion
  const oscillation = usePulseAnimation({
    cycleDurationMs: pulseConfig.cycleDurationMs,
    enabled: pulseConfig.cycleDurationMs > 0,
    organic: pulseConfig.organic ?? false,
    initialPhase: 0.75, // Always start at peak brightness (oscillation=0)
    resetTrigger: pulseResetTrigger,
  });

  // Calculate pulsing color with smooth transition blend
  // Uses amplitude dampening + color range blending for seamless fade to gray
  const getPulsingColor = (): string => {
    const t = statusTransition.transitionProgress;
    const gray = PULSE_CONFIGS.unknown.baseColor;

    if (t > 0) {
      // Dampen oscillation amplitude: full range at t=0, no range at t=1
      // This ensures the pulse naturally settles rather than jumping
      const amplitude = 1 - t;
      const dampenedOscillation = oscillation * amplitude;

      // Blend base/target colors toward gray as transition progresses
      const effectiveBase = interpolateColors(pulseConfig.baseColor, gray, t);
      const effectiveTarget = interpolateColors(
        pulseConfig.targetColor,
        gray,
        t,
      );

      // Apply dampened oscillation to blended color range
      // At t=1: amplitude=0, effectiveBase=gray → result is gray
      return interpolateColors(
        effectiveBase,
        effectiveTarget,
        dampenedOscillation,
      );
    }

    // Normal pulsing (no transition)
    return interpolateColors(
      pulseConfig.baseColor,
      pulseConfig.targetColor,
      oscillation,
    );
  };

  // Connection indicator with pulsating color
  const renderConnectionIndicator = (): React.ReactElement => {
    const symbol = getConnectionIndicatorSymbol(isCheckingHealth);
    const color = getPulsingColor();
    return <Text color={color}>{symbol}</Text>;
  };

  // Left side: connection indicator + repo/branch or current working directory
  const renderLeft = (): React.ReactElement => {
    if (gitInfo?.inRepo) {
      const icon = getStatusIcon(gitInfo);
      const color = getStatusColor(gitInfo);

      return (
        <Text>
          {renderConnectionIndicator()}
          <Text> </Text>
          <Text color="#ffffff">{gitInfo.repoName}</Text>
          <Text color="#666666">/</Text>
          <Text color={color}>{gitInfo.branch}</Text>
          <Text> </Text>
          <Text color={color}>{icon}</Text>
        </Text>
      );
    }

    // Show current working directory when not in a git repo
    return (
      <Text>
        {renderConnectionIndicator()}
        <Text> </Text>
        <Text color="#666666">{getFormattedCwd()}</Text>
      </Text>
    );
  };

  // Right side: keyboard hints
  const renderRight = (): React.ReactElement => {
    return <Text color="#666666">{hint}</Text>;
  };

  return (
    <Box width={width} paddingX={1} justifyContent="space-between">
      {renderLeft()}
      <Spacer />
      {renderRight()}
    </Box>
  );
}

/**
 * Get git repository info by executing git commands
 */
export function getGitInfo(): GitInfo {
  const defaultInfo: GitInfo = {
    inRepo: false,
    repoName: "",
    branch: "",
    isDirty: false,
    ahead: 0,
    behind: 0,
  };

  try {
    // Check if we're in a git repo
    try {
      execSync("git rev-parse --is-inside-work-tree", {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch {
      return defaultInfo;
    }

    // Get repository name from top-level directory
    let repoName = "";
    try {
      const topLevel = execSync("git rev-parse --show-toplevel", {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim();
      repoName = topLevel.split("/").pop() ?? "";
    } catch {
      repoName = "repo";
    }

    // Get current branch
    let branch = "";
    try {
      branch = execSync("git rev-parse --abbrev-ref HEAD", {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim();
    } catch {
      branch = "unknown";
    }

    // Check for uncommitted changes
    let isDirty = false;
    try {
      const status = execSync("git status --porcelain", {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      isDirty = status.trim().length > 0;
    } catch {
      // Ignore errors
    }

    // Get ahead/behind counts
    let ahead = 0;
    let behind = 0;
    try {
      const counts = execSync(
        "git rev-list --left-right --count HEAD...@{upstream}",
        {
          encoding: "utf-8",
          stdio: ["pipe", "pipe", "pipe"],
        },
      ).trim();
      const [aheadStr, behindStr] = counts.split(/\s+/);
      ahead = parseInt(aheadStr ?? "0", 10) || 0;
      behind = parseInt(behindStr ?? "0", 10) || 0;
    } catch {
      // No upstream or error - that's fine
    }

    return {
      inRepo: true,
      repoName,
      branch,
      isDirty,
      ahead,
      behind,
    };
  } catch {
    // If anything fails, return default
    return defaultInfo;
  }
}

export default StatusBar;
