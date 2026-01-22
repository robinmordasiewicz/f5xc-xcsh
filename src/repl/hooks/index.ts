/**
 * REPL hooks exports
 */

export { useDoubleCtrlC } from "./useDoubleCtrlC.js";
export { useHistory } from "./useHistory.js";
export { useCompletion } from "./useCompletion.js";
export { useGitStatus } from "./useGitStatus.js";
export { useHealthCheck } from "./useHealthCheck.js";
export type { HealthState } from "./useHealthCheck.js";
export { usePulseAnimation } from "./usePulseAnimation.js";
export type { PulseConfig } from "./usePulseAnimation.js";
export { useStatusTransition } from "./useStatusTransition.js";
export type {
	StatusTransitionConfig,
	StatusTransitionResult,
} from "./useStatusTransition.js";
export { useInactivityDetection } from "./useInactivityDetection.js";
export type { UseInactivityDetectionResult } from "./useInactivityDetection.js";
