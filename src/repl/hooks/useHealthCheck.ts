/**
 * useHealthCheck hook - API health status management with polling and manual refresh
 * Provides dynamic connection status updates for the StatusBar
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type { REPLSession } from "../session.js";
import type { HealthStatus, HealthCheckResult } from "../../api/client.js";

/**
 * Configuration options for the useHealthCheck hook
 */
interface UseHealthCheckOptions {
	/** Poll interval in milliseconds (0 disables polling) */
	pollIntervalMs?: number;
	/** Whether the hook is active */
	enabled?: boolean;
	/** Session to use for health checks */
	session: REPLSession | null;
}

/**
 * Health state returned by the hook
 */
export interface HealthState {
	/** Current health status */
	status: HealthStatus | "unknown";
	/** Last measured latency in milliseconds (undefined if not available) */
	latencyMs: number | undefined;
	/** Whether a health check is currently in progress */
	isChecking: boolean;
}

/**
 * Return value from the useHealthCheck hook
 */
interface UseHealthCheckResult {
	/** Current health state */
	health: HealthState;
	/** Function to manually trigger a refresh */
	refresh: () => void;
	/** Timestamp of the last refresh */
	lastRefresh: number;
}

/** Default polling interval: 30 seconds */
const DEFAULT_POLL_INTERVAL_MS = 30000;

/** Minimum allowed polling interval: 10 seconds */
const MIN_POLL_INTERVAL_MS = 10000;

/**
 * Get the polling interval from environment variable or use default
 * XCSH_HEALTH_POLL_INTERVAL: interval in seconds (0 to disable)
 */
function getPollInterval(): number {
	const envValue = process.env.XCSH_HEALTH_POLL_INTERVAL;
	if (envValue === undefined) return DEFAULT_POLL_INTERVAL_MS;
	if (envValue === "0") return 0; // Disabled

	const seconds = parseInt(envValue, 10);
	if (isNaN(seconds) || seconds <= 0) return DEFAULT_POLL_INTERVAL_MS;

	return Math.max(seconds * 1000, MIN_POLL_INTERVAL_MS);
}

/**
 * Hook for managing API health status with automatic polling and manual refresh
 *
 * Features:
 * - Initial fetch on mount
 * - Configurable polling interval (default 30s)
 * - Manual refresh via returned function
 * - Debouncing to prevent concurrent checks
 * - Cleanup on unmount
 *
 * @example
 * ```typescript
 * const healthCheck = useHealthCheck({ session, enabled: isInitialized });
 *
 * // Use the health status
 * <StatusBar connectionStatus={healthCheck.health.status} />
 *
 * // Manual refresh
 * healthCheck.refresh();
 * ```
 */
export function useHealthCheck(
	options: UseHealthCheckOptions,
): UseHealthCheckResult {
	const { enabled = true, session } = options;
	const pollIntervalMs = options.pollIntervalMs ?? getPollInterval();

	const [health, setHealth] = useState<HealthState>({
		status: "unknown",
		latencyMs: undefined,
		isChecking: false,
	});
	const [lastRefresh, setLastRefresh] = useState<number>(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const isCheckingRef = useRef<boolean>(false);

	/**
	 * Perform health check using the session's API client
	 */
	const performHealthCheck = useCallback(async () => {
		// Debounce: prevent concurrent checks
		if (isCheckingRef.current) {
			return;
		}

		const client = session?.getAPIClient();
		if (!client) {
			setHealth({
				status: "unknown",
				latencyMs: undefined,
				isChecking: false,
			});
			return;
		}

		isCheckingRef.current = true;
		setHealth((prev) => ({ ...prev, isChecking: true }));

		try {
			const result: HealthCheckResult = await client.healthCheck();
			setHealth({
				status: result.status,
				latencyMs: result.latencyMs,
				isChecking: false,
			});
			setLastRefresh(Date.now());
		} catch {
			// On error, mark as offline
			setHealth({
				status: "offline",
				latencyMs: undefined,
				isChecking: false,
			});
			setLastRefresh(Date.now());
		} finally {
			isCheckingRef.current = false;
		}
	}, [session]);

	/**
	 * Manual refresh function
	 */
	const refresh = useCallback(() => {
		performHealthCheck();
	}, [performHealthCheck]);

	// Initial fetch when enabled
	useEffect(() => {
		if (enabled && session) {
			// Set initial status from session's connection status
			const connectionStatus = session.getConnectionStatus();
			let initialStatus: HealthStatus | "unknown" = "unknown";
			if (connectionStatus === "connected") {
				initialStatus = "connected";
			} else if (connectionStatus === "offline") {
				initialStatus = "offline";
			} else if (connectionStatus === "error") {
				initialStatus = "auth_error";
			}

			setHealth({
				status: initialStatus,
				latencyMs: undefined,
				isChecking: false,
			});

			// Perform first health check after a short delay
			const initialCheckTimeout = setTimeout(() => {
				performHealthCheck();
			}, 1000);

			return () => clearTimeout(initialCheckTimeout);
		}
		return undefined;
	}, [enabled, session, performHealthCheck]);

	// Polling timer
	useEffect(() => {
		if (!enabled || pollIntervalMs === 0 || !session) {
			return;
		}

		intervalRef.current = setInterval(performHealthCheck, pollIntervalMs);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [enabled, pollIntervalMs, session, performHealthCheck]);

	return { health, refresh, lastRefresh };
}

export default useHealthCheck;
