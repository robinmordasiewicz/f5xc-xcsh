/**
 * Headless Mode Module
 *
 * Provides JSON-based stdin/stdout protocol for AI agent interaction.
 */

export { HeadlessController } from "./controller.js";
export {
	// Types
	type HeadlessInput,
	type HeadlessInputType,
	type HeadlessOutput,
	type HeadlessOutputType,
	type HeadlessOutputFormat,
	type HeadlessSessionState,
	type CompletionSuggestion,
	// Functions
	parseInput,
	formatOutput,
	createOutputMessage,
	createPromptMessage,
	createCompletionResponse,
	createErrorMessage,
	createEventMessage,
	createExitMessage,
} from "./protocol.js";
