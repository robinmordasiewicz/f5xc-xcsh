/**
 * AI Services Domain - AI Assistant for F5 Distributed Cloud
 *
 * Query the AI assistant for help with platform operations, configurations,
 * and troubleshooting. Supports single queries, interactive chat, and feedback.
 */

import type {
	DomainDefinition,
	CommandDefinition,
	DomainCommandResult,
} from "../registry.js";
import { queryCommand } from "./query.js";
import { chatCommand } from "./chat.js";
import { feedbackCommand } from "./feedback.js";
import { evalSubcommands } from "./eval.js";
import { formatDomainOverview } from "../domain-overview.js";

/**
 * Entry command - shows domain overview and enters context
 *
 * When entering the ai_services domain without arguments, this displays
 * available commands and examples, then enters the domain sub-shell.
 * If arguments are provided, delegates to the query command.
 */
const entryCommand: CommandDefinition = {
	name: "ai_services",
	description: "AI-powered query and chat services for F5 Distributed Cloud",
	descriptionShort: "AI assistant queries and feedback",
	descriptionMedium:
		"Query the AI assistant for help with F5 XC platform operations, configurations, and troubleshooting.",

	async execute(args, session): Promise<DomainCommandResult> {
		// If args provided (not starting with --), delegate to query command
		const hasQuestion = args.length > 0 && !args[0]?.startsWith("--");
		if (hasQuestion) {
			return queryCommand.execute(args, session);
		}

		// Show domain overview
		const overview = formatDomainOverview({
			name: "AI Services",
			description: "Query and chat with the F5 XC AI assistant",
			commands: [
				{
					name: "query <question>",
					description: "Ask a single question",
				},
				{
					name: "chat",
					description: "Start interactive chat session",
				},
				{
					name: "feedback",
					description: "Provide feedback on AI responses",
				},
			],
			examples: [
				"query 'How do I create an HTTP load balancer?'",
				"query 'What is my WAF policy configuration?' --namespace prod",
				"chat",
				"feedback positive",
			],
			supportsOutputFormats: true,
			notes: ["Use 'eval' subcommand for AI evaluation testing."],
		});

		return {
			output: overview,
			contextChanged: true,
			shouldExit: false,
			shouldClear: false,
		};
	},
};

/**
 * AI Services domain definition
 */
export const aiServicesDomain: DomainDefinition = {
	name: "ai_services",
	description:
		"Interact with the F5 Distributed Cloud AI assistant for natural language queries about platform operations. Ask questions about load balancers, WAF configurations, site status, security events, or any platform topic. Supports single queries with follow-up suggestions, interactive multi-turn chat sessions, and feedback submission to improve AI responses.",
	descriptionShort: "AI assistant queries and feedback",
	descriptionMedium:
		"Query the AI assistant for help with F5 XC platform operations, configurations, security analysis, and troubleshooting.",
	defaultCommand: entryCommand,
	commands: new Map([
		["query", queryCommand],
		["chat", chatCommand],
		["feedback", feedbackCommand],
	]),
	subcommands: new Map([["eval", evalSubcommands]]),
};

/**
 * Domain aliases
 */
export const aiServicesAliases = ["ai", "genai", "assistant"];

// Re-export types and utilities for external use
export type {
	GenAIQueryRequest,
	GenAIQueryResponse,
	GenAIFeedbackRequest,
	GenAIChatSession,
	NegativeFeedbackType,
} from "./types.js";

export { getResponseType, FEEDBACK_TYPE_MAP } from "./types.js";
export { GenAIClient, getGenAIClient } from "./client.js";
export { renderResponse } from "./response-renderer.js";
