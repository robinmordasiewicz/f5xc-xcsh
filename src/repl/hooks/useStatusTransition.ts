/**
 * useStatusTransition hook - Manages smooth transitions between status indicator states
 * Provides anticipatory fade before health checks and peak pulse reset after completion
 */

import { useState, useEffect, useRef } from "react";

/**
 * Configuration for status transition
 */
export interface StatusTransitionConfig {
	/** Timestamp of last health check refresh */
	lastRefresh: number;
	/** Poll interval in milliseconds */
	pollIntervalMs: number;
	/** Whether a health check is currently in progress */
	isChecking: boolean;
	/** Duration of anticipatory fade in milliseconds (default: 5000) */
	transitionDurationMs?: number;
}

/**
 * Result from the status transition hook
 */
export interface StatusTransitionResult {
	/** Transition progress from 0 (normal pulse) to 1 (fully gray) */
	transitionProgress: number;
	/** Whether currently in transition phase */
	isTransitioning: boolean;
	/** True when health check just completed - signals pulse should reset to peak */
	shouldResetPulse: boolean;
}

/** Default anticipatory fade duration: 5 seconds */
const DEFAULT_TRANSITION_DURATION_MS = 5000;

/** Quick fade duration when health check starts (for manual triggers) */
const QUICK_FADE_DURATION_MS = 300;

/**
 * Hook for managing smooth status indicator transitions
 *
 * Features:
 * - Anticipatory fade: Starts fading to gray 5 seconds before next health check
 * - Smooth transition: Blends from current pulse color to checking gray
 * - Peak reset: Signals when pulse should restart at maximum brightness
 *
 * @param config - Transition configuration with timing information
 * @returns Transition state including progress and reset signals
 *
 * @example
 * ```typescript
 * const transition = useStatusTransition({
 *   lastRefresh: healthCheck.lastRefresh,
 *   pollIntervalMs: healthCheck.pollIntervalMs,
 *   isChecking: healthCheck.health.isChecking,
 * });
 *
 * // Use transitionProgress to blend colors
 * const color = interpolateColors(pulseColor, grayColor, transition.transitionProgress);
 *
 * // Reset pulse to peak brightness when shouldResetPulse is true
 * if (transition.shouldResetPulse) {
 *   setPulseKey(k => k + 1);
 * }
 * ```
 */
export function useStatusTransition(
	config: StatusTransitionConfig,
): StatusTransitionResult {
	const {
		lastRefresh,
		pollIntervalMs,
		isChecking,
		transitionDurationMs = DEFAULT_TRANSITION_DURATION_MS,
	} = config;

	// Track transition progress (0 = normal, 1 = fully gray)
	const [transitionProgress, setTransitionProgress] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [shouldResetPulse, setShouldResetPulse] = useState(false);

	// Track previous checking state to detect completion
	const wasCheckingRef = useRef(false);

	// Track when checking started for quick-fade timing
	const checkingStartTimeRef = useRef<number | null>(null);
	// Track progress at the moment checking started (for smooth continuation)
	const progressAtCheckStartRef = useRef(0);
	// Ref to track current progress (avoids stale closure in effect)
	const currentProgressRef = useRef(transitionProgress);
	currentProgressRef.current = transitionProgress;

	// Detect health check completion (isChecking: true → false)
	useEffect(() => {
		if (wasCheckingRef.current && !isChecking) {
			// Health check just completed - signal pulse reset
			setShouldResetPulse(true);
		}
		wasCheckingRef.current = isChecking;
	}, [isChecking]);

	// Clear shouldResetPulse after one tick so it only triggers once
	useEffect(() => {
		if (shouldResetPulse) {
			const timer = setTimeout(() => setShouldResetPulse(false), 0);
			return () => clearTimeout(timer);
		}
		return undefined;
	}, [shouldResetPulse]);

	// Update transition progress based on timing
	useEffect(() => {
		// If no polling or lastRefresh not set, no transition
		if (pollIntervalMs === 0 || lastRefresh === 0) {
			setTransitionProgress(0);
			setIsTransitioning(false);
			checkingStartTimeRef.current = null;
			return;
		}

		// Update at ~16 FPS (60ms interval) for smooth transitions
		const updateInterval = 60;

		// If currently checking, smoothly fade to gray
		if (isChecking) {
			// Record when checking started (for quick fade timing)
			if (checkingStartTimeRef.current === null) {
				checkingStartTimeRef.current = Date.now();
				progressAtCheckStartRef.current = currentProgressRef.current;
			}

			const updateCheckingProgress = () => {
				const elapsed =
					Date.now() - (checkingStartTimeRef.current ?? Date.now());
				// Quick fade: animate remaining progress over QUICK_FADE_DURATION_MS
				// This smoothly continues from wherever the anticipatory fade left off
				const startProgress = progressAtCheckStartRef.current;
				const remainingProgress = 1 - startProgress;
				const fadeFraction = Math.min(
					elapsed / QUICK_FADE_DURATION_MS,
					1,
				);
				const newProgress =
					startProgress + remainingProgress * fadeFraction;
				setTransitionProgress(Math.min(newProgress, 1));
				setIsTransitioning(true);
			};

			// Initial update
			updateCheckingProgress();

			// Set up interval for continuous updates during checking
			const intervalId = setInterval(
				updateCheckingProgress,
				updateInterval,
			);
			return () => clearInterval(intervalId);
		}

		// Not checking - reset tracking refs
		checkingStartTimeRef.current = null;

		// Calculate time until next check
		const nextCheckAt = lastRefresh + pollIntervalMs;

		const updateProgress = () => {
			const now = Date.now();
			const timeUntilCheck = nextCheckAt - now;

			// Within transition window (5 seconds before check)
			if (timeUntilCheck <= transitionDurationMs && timeUntilCheck > 0) {
				// Progress from 0 to 1 as we approach the check
				const progress = 1 - timeUntilCheck / transitionDurationMs;
				setTransitionProgress(progress);
				setIsTransitioning(true);
			} else if (timeUntilCheck <= 0) {
				// Check time passed but not yet checking - stay at full transition
				setTransitionProgress(1);
				setIsTransitioning(true);
			} else {
				// Not yet in transition window
				setTransitionProgress(0);
				setIsTransitioning(false);
			}
		};

		// Initial update
		updateProgress();

		// Set up interval for continuous updates
		const intervalId = setInterval(updateProgress, updateInterval);

		return () => clearInterval(intervalId);
	}, [lastRefresh, pollIntervalMs, isChecking, transitionDurationMs]);

	return {
		transitionProgress,
		isTransitioning,
		shouldResetPulse,
	};
}
