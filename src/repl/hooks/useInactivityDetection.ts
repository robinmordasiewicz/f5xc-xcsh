/**
 * useInactivityDetection hook - Tracks user activity and determines sleep state
 * Pauses health checks when no keystrokes detected for configurable timeout
 */

import { useState, useCallback, useEffect, useRef } from "react";

/**
 * Configuration options for the useInactivityDetection hook
 */
interface UseInactivityDetectionOptions {
  /** Inactivity timeout in milliseconds (0 to disable) */
  timeoutMs?: number;
  /** Whether the hook is active */
  enabled?: boolean;
}

/**
 * Return value from the useInactivityDetection hook
 */
export interface UseInactivityDetectionResult {
  /** Whether the system is in sleep mode due to inactivity */
  isSleeping: boolean;
  /** Function to record user activity (resets inactivity timer) */
  recordActivity: () => void;
  /** Timestamp of last activity in milliseconds */
  lastActivityMs: number;
}

/** Default inactivity timeout: 5 minutes (300 seconds) */
const DEFAULT_INACTIVITY_TIMEOUT_MS = 300000;

/** Minimum allowed inactivity timeout: 1 minute (60 seconds) */
const MIN_INACTIVITY_TIMEOUT_MS = 60000;

/** Check interval: 10 seconds */
const CHECK_INTERVAL_MS = 10000;

/**
 * Get the inactivity timeout from environment variable or use default
 * XCSH_INACTIVITY_TIMEOUT: timeout in seconds (0 to disable)
 */
function getInactivityTimeout(): number {
  const envValue = process.env.XCSH_INACTIVITY_TIMEOUT;
  if (envValue === undefined) return DEFAULT_INACTIVITY_TIMEOUT_MS;
  if (envValue === "0") return 0; // Disabled

  const seconds = parseInt(envValue, 10);
  if (isNaN(seconds) || seconds <= 0) return DEFAULT_INACTIVITY_TIMEOUT_MS;

  return Math.max(seconds * 1000, MIN_INACTIVITY_TIMEOUT_MS);
}

/**
 * Hook for detecting user inactivity and managing sleep state
 *
 * Features:
 * - Tracks last keystroke timestamp
 * - Configurable inactivity timeout (default 5 minutes)
 * - Automatic sleep mode when inactive
 * - Immediate wake on activity
 * - Environment variable configuration (XCSH_INACTIVITY_TIMEOUT)
 *
 * @example
 * ```typescript
 * const inactivity = useInactivityDetection({ enabled: isInitialized });
 *
 * // Track activity in input handlers
 * inactivity.recordActivity();
 *
 * // Use sleep state to pause health checks
 * const healthCheck = useHealthCheck({
 *   enabled: isInitialized && !inactivity.isSleeping,
 *   session,
 * });
 * ```
 */
export function useInactivityDetection(
  options: UseInactivityDetectionOptions = {},
): UseInactivityDetectionResult {
  const { enabled = true } = options;
  const timeoutMs = options.timeoutMs ?? getInactivityTimeout();

  // Use ref for last activity to avoid re-renders on every keystroke
  const lastActivityRef = useRef<number>(Date.now());
  const [isSleeping, setIsSleeping] = useState(false);
  const [lastActivityMs, setLastActivityMs] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Record user activity - resets inactivity timer and wakes from sleep
   */
  const recordActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    setLastActivityMs(now);

    // Wake from sleep immediately on activity
    if (isSleeping) {
      setIsSleeping(false);
    }
  }, [isSleeping]);

  // Inactivity check interval
  useEffect(() => {
    // Disabled if not enabled or timeout is 0
    if (!enabled || timeoutMs === 0) {
      // Ensure not sleeping when disabled
      if (isSleeping) {
        setIsSleeping(false);
      }
      return;
    }

    // Initialize last activity on mount
    lastActivityRef.current = Date.now();
    setLastActivityMs(Date.now());

    // Check for inactivity periodically
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;

      if (elapsed >= timeoutMs && !isSleeping) {
        setIsSleeping(true);
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, timeoutMs, isSleeping]);

  return { isSleeping, recordActivity, lastActivityMs };
}

export default useInactivityDetection;
