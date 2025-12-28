/**
 * Error handling module
 *
 * Provides standardized error codes, exit codes, and error formatting
 * for consistent error handling across xcsh.
 */

export {
	ExitCode,
	ErrorCode,
	httpStatusToExitCode,
	httpStatusToErrorCode,
	exitCodeDescription,
	exitCodeHint,
	createStructuredError,
	formatError,
	type ExitCodeValue,
	type ErrorCodeValue,
	type StructuredError,
} from "./codes.js";
