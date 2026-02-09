/**
 * usePulseAnimation hook - Provides smooth pulsating animation phase
 * Uses sine wave for natural, organic pulsation effect
 */

import { useState, useEffect, useRef } from "react";

/**
 * Configuration for pulse animation
 */
export interface PulseConfig {
  /** Duration of one complete pulse cycle in milliseconds */
  cycleDurationMs: number;
  /** Whether the animation is enabled (default: true) */
  enabled?: boolean;
  /** Enable multi-harmonic organic oscillation for natural "breathing" effect */
  organic?: boolean;
  /** Initial phase (0-1) to start animation at. 0.25 = peak brightness */
  initialPhase?: number | undefined;
  /** Increment to force animation reset (triggers restart when changed) */
  resetTrigger?: number;
}

/**
 * Organic oscillation using multiple harmonics for natural "breathing" effect
 *
 * Combines multiple sine waves at different frequencies to create a natural,
 * asymmetric pulsation that appears organic and alive rather than mechanical.
 *
 * @param phase - Current phase (0 to 1)
 * @returns Oscillation value from 0 to 1
 */
function organicOscillation(phase: number): number {
  // Primary wave (full cycle)
  const primary = Math.sin(phase * 2 * Math.PI);
  // Secondary wave (1.7x frequency - creates irregularity)
  const secondary = Math.sin(phase * 2 * Math.PI * 1.7) * 0.3;
  // Tertiary wave (2.3x frequency - adds subtle texture)
  const tertiary = Math.sin(phase * 2 * Math.PI * 2.3) * 0.15;

  // Combine and normalize to 0-1 range
  const combined = primary + secondary + tertiary;
  // Max possible: 1 + 0.3 + 0.15 = 1.45, Min: -1.45
  return (combined / 1.45 + 1) / 2;
}

/**
 * Hook for creating smooth pulsating animations
 *
 * Returns an oscillation value (0 to 1) that smoothly cycles using a sine wave.
 * The oscillation starts at 0.5, peaks at 1.0, returns to 0.5, drops to 0, and back.
 *
 * @param config - Pulse configuration with cycle duration and enabled flag
 * @returns Oscillation value from 0 to 1 for smooth color interpolation
 *
 * @example
 * ```typescript
 * const oscillation = usePulseAnimation({ cycleDurationMs: 2000, enabled: true });
 * const color = interpolateColors(baseColor, targetColor, oscillation);
 * ```
 */
export function usePulseAnimation(config: PulseConfig): number {
  const {
    cycleDurationMs,
    enabled = true,
    organic = false,
    initialPhase,
    resetTrigger,
  } = config;

  // Phase tracks progress through the cycle (0 to 1)
  const [phase, setPhase] = useState(initialPhase ?? 0);

  // Track start time for accurate timing
  const startTimeRef = useRef<number>(Date.now());

  // Track reset state to force oscillation=0 on first frame after reset
  const justResetRef = useRef(false);
  const prevResetTriggerRef = useRef(resetTrigger);

  useEffect(() => {
    // If disabled or no cycle duration, return static value
    if (!enabled || cycleDurationMs <= 0) {
      setPhase(0);
      return;
    }

    // Detect if resetTrigger changed (new reset)
    if (resetTrigger !== prevResetTriggerRef.current) {
      justResetRef.current = true;
      prevResetTriggerRef.current = resetTrigger;
    }

    // Always reset timing when effect runs (including when resetTrigger changes)
    // Offset start time to achieve initial phase if specified
    const phaseOffset = initialPhase ?? 0;
    startTimeRef.current = Date.now() - phaseOffset * cycleDurationMs;

    // Update at ~16 FPS (60ms interval) - efficient for terminal rendering
    const updateInterval = 60;

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      // Calculate phase as fraction of cycle (0 to 1, wrapping)
      const newPhase = (elapsed % cycleDurationMs) / cycleDurationMs;
      setPhase(newPhase);

      // Clear the "just reset" flag after first interval tick
      if (justResetRef.current) {
        justResetRef.current = false;
      }
    }, updateInterval);

    // Cleanup on unmount or config change
    return () => {
      clearInterval(intervalId);
    };
  }, [cycleDurationMs, enabled, initialPhase, resetTrigger]);

  // If we just reset, return 0 (brightest) immediately
  // This guarantees bright color on first frame regardless of animation mode
  if (justResetRef.current) {
    return 0;
  }

  // Convert linear phase to oscillation value
  // Use organic multi-harmonic wave or standard sine wave
  const oscillation = organic
    ? organicOscillation(phase)
    : (Math.sin(phase * 2 * Math.PI) + 1) / 2;

  return oscillation;
}
