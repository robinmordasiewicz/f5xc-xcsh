/**
 * GenAI Chat Command
 *
 * Interactive multi-turn conversation with the AI assistant.
 * This command returns a signal to enter chat mode, which is handled
 * by the Ink-based ChatMode component in the REPL.
 */

import type { CommandDefinition, DomainCommandResult } from "../registry.js";
import { successResult, errorResult } from "../registry.js";
import type { REPLSession } from "../../repl/session.js";
import { getCommandSpec, formatSpec } from "../../output/index.js";
import { parseDomainOutputFlags } from "../../output/domain-formatter.js";

/**
 * Parse chat args for namespace, spec flag, and output format
 *
 * Note: Chat is inherently interactive, so output formats have limited
 * applicability. Only 'none' (suppress) and 'spec' are meaningful.
 */
function parseChatArgs(
	args: string[],
	session: REPLSession,
): {
	spec: boolean;
	namespace: string;
	suppressOutput: boolean;
} {
	const { options, remainingArgs } = parseDomainOutputFlags(
		args,
		session.getOutputFormat(),
	);

	let spec = false;
	let namespace = session.getNamespace();

	let i = 0;
	while (i < remainingArgs.length) {
		const arg = remainingArgs[i];
		if (arg === "--spec") {
			spec = true;
		} else if (arg === "--namespace" || arg === "-ns") {
			if (i + 1 < remainingArgs.length) {
				namespace = remainingArgs[i + 1] ?? namespace;
				i++;
			}
		}
		i++;
	}

	return {
		spec,
		namespace,
		suppressOutput: options.format === "none",
	};
}

/**
 * Chat command - Interactive conversation with AI assistant
 *
 * This command signals the REPL to enter chat mode by returning
 * enterChatMode: true. The actual chat UI is handled by the
 * Ink-based ChatMode component in App.tsx.
 */
export const chatCommand: CommandDefinition = {
	name: "chat",
	description:
		"Start an interactive conversation with the F5 XC AI assistant. Enter a multi-turn dialog where you can ask questions, receive responses with follow-up suggestions, and navigate through topics naturally. Use numbered responses to quickly select suggested follow-up questions. Supports in-chat feedback submission. Type /exit to return to the main CLI.",
	descriptionShort: "Interactive AI chat mode",
	descriptionMedium:
		"Start an interactive multi-turn conversation with the AI assistant. Supports follow-up suggestions and in-chat commands.",
	usage: "[--namespace <ns>]",

	async execute(args, session): Promise<DomainCommandResult> {
		const { spec, namespace, suppressOutput } = parseChatArgs(
			args,
			session,
		);

		// Handle --spec flag
		if (spec) {
			const cmdSpec = getCommandSpec("ai_services chat");
			if (cmdSpec) {
				return successResult([formatSpec(cmdSpec)]);
			}
		}

		// Handle --output none
		if (suppressOutput) {
			return successResult([]);
		}

		// Check if running in a TTY
		if (!process.stdin.isTTY) {
			return errorResult(
				"Chat mode requires an interactive terminal. Use 'ai_services query' for non-interactive queries.",
			);
		}

		// Check API connection
		const apiClient = session.getAPIClient();
		if (!apiClient) {
			return errorResult(
				"Not connected to API. Please configure connection first.",
			);
		}

		if (!session.isTokenValidated()) {
			return errorResult(
				"Not authenticated. Please check your API token.",
			);
		}

		// Signal to enter chat mode - the REPL will switch to ChatMode component
		return {
			output: [],
			shouldExit: false,
			shouldClear: false,
			contextChanged: false,
			enterChatMode: true,
			chatConfig: {
				namespace,
			},
		};
	},
};
