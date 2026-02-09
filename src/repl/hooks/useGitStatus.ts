/**
 * useGitStatus hook - Git status management with polling and manual refresh
 * Provides dynamic git repository status updates for the StatusBar
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { getGitInfo, type GitInfo } from "../components/StatusBar.js";

/**
 * Configuration options for the useGitStatus hook
 */
interface UseGitStatusOptions {
  /** Poll interval in milliseconds (0 disables polling) */
  pollIntervalMs?: number;
  /** Whether the hook is active */
  enabled?: boolean;
}

/**
 * Return value from the useGitStatus hook
 */
interface UseGitStatusResult {
  /** Current git repository info */
  gitInfo: GitInfo | undefined;
  /** Function to manually trigger a refresh */
  refresh: () => void;
  /** Timestamp of the last refresh */
  lastRefresh: number;
}

/** Default polling interval: 30 seconds */
const DEFAULT_POLL_INTERVAL_MS = 30000;

/** Minimum allowed polling interval: 5 seconds */
const MIN_POLL_INTERVAL_MS = 5000;

/**
 * Get the polling interval from environment variable or use default
 * XCSH_GIT_POLL_INTERVAL: interval in seconds (0 to disable)
 */
function getPollInterval(): number {
  const envValue = process.env.XCSH_GIT_POLL_INTERVAL;
  if (envValue === undefined) return DEFAULT_POLL_INTERVAL_MS;
  if (envValue === "0") return 0; // Disabled

  const seconds = parseInt(envValue, 10);
  if (isNaN(seconds) || seconds <= 0) return DEFAULT_POLL_INTERVAL_MS;

  return Math.max(seconds * 1000, MIN_POLL_INTERVAL_MS);
}

/**
 * Hook for managing git status with automatic polling and manual refresh
 *
 * Features:
 * - Initial fetch on mount
 * - Configurable polling interval (default 30s)
 * - Manual refresh via returned function
 * - Cleanup on unmount
 *
 * @example
 * ```typescript
 * const gitStatus = useGitStatus({ enabled: isInitialized });
 *
 * // Use the git info
 * <StatusBar gitInfo={gitStatus.gitInfo} />
 *
 * // Manual refresh
 * gitStatus.refresh();
 * ```
 */
export function useGitStatus(
  options: UseGitStatusOptions = {},
): UseGitStatusResult {
  const { enabled = true } = options;
  const pollIntervalMs = options.pollIntervalMs ?? getPollInterval();

  const [gitInfo, setGitInfo] = useState<GitInfo | undefined>(undefined);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Refresh git status by calling getGitInfo
   */
  const refresh = useCallback(() => {
    const info = getGitInfo();
    setGitInfo(info);
    setLastRefresh(Date.now());
  }, []);

  // Initial fetch when enabled
  useEffect(() => {
    if (enabled) {
      refresh();
    }
  }, [enabled, refresh]);

  // Polling timer
  useEffect(() => {
    if (!enabled || pollIntervalMs === 0) {
      return;
    }

    intervalRef.current = setInterval(refresh, pollIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, pollIntervalMs, refresh]);

  return { gitInfo, refresh, lastRefresh };
}

export default useGitStatus;
