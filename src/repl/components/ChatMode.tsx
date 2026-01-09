/**
 * ChatMode component - Interactive AI chat within the Ink REPL
 * Replaces readline-based chat with Ink-native input handling
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";

import type { REPLSession } from "../session.js";
import { getGenAIClient } from "../../domains/ai_services/client.js";
import { renderResponse } from "../../domains/ai_services/response-renderer.js";
import {
	updateLastQueryState,
	clearLastQueryState,
	getLastQueryState,
} from "../../domains/ai_services/query.js";
import { FEEDBACK_TYPE_MAP } from "../../domains/ai_services/types.js";

/**
 * Props for ChatMode component
 */
export interface ChatModeProps {
	/** REPL session for API access */
	session: REPLSession;
	/** Namespace for AI queries */
	namespace: string;
	/** Terminal width for layout */
	width: number;
	/** Callback when chat mode exits */
	onExit: (messages: string[]) => void;
}

/**
 * Chat message for display
 */
interface ChatMessage {
	id: number;
	role: "user" | "ai" | "system";
	content: string;
}

/**
 * Horizontal rule in F5 red
 */
function HorizontalRule({ width }: { width: number }): React.ReactElement {
	const rule = "\u2500".repeat(Math.max(width, 1));
	return <Text color="#CA260A">{rule}</Text>;
}

/**
 * ChatMode - Interactive AI chat component
 */
export function ChatMode({
	session,
	namespace,
	width,
	onExit,
}: ChatModeProps): React.ReactElement {
	// Input state
	const [input, setInput] = useState("");
	const [inputKey, setInputKey] = useState(0);

	// Chat state
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const messageIdRef = useRef(0);
	const [isLoading, setIsLoading] = useState(false);
	const [followUps, setFollowUps] = useState<string[]>([]);

	// Add a message to chat history
	const addMessage = useCallback(
		(role: ChatMessage["role"], content: string) => {
			const id = messageIdRef.current++;
			setMessages((prev) => [...prev, { id, role, content }]);
		},
		[],
	);

	// Initialize with welcome message
	useEffect(() => {
		addMessage("system", "=== F5 XC AI Assistant Chat ===");
		addMessage("system", `Namespace: ${namespace}`);
		addMessage("system", "Type /help for commands, /exit to quit.");
		addMessage("system", "");
	}, [namespace, addMessage]);

	// Show help
	const showHelp = useCallback(() => {
		addMessage("system", "");
		addMessage("system", "=== AI Chat Commands ===");
		addMessage("system", "");
		addMessage("system", "  /exit, /quit, /q    - Exit chat mode");
		addMessage("system", "  /help, /h           - Show this help");
		addMessage(
			"system",
			"  /clear, /c          - Clear conversation context",
		);
		addMessage(
			"system",
			"  /feedback <type>    - Submit feedback (positive/negative)",
		);
		addMessage(
			"system",
			"  1, 2, 3...          - Select a follow-up question",
		);
		addMessage("system", "");
		addMessage(
			"system",
			"Just type your question to query the AI assistant.",
		);
		addMessage("system", "");
	}, [addMessage]);

	// Handle feedback submission
	const handleFeedback = useCallback(
		async (feedbackInput: string) => {
			const state = getLastQueryState();
			if (!state.lastQueryId || !state.lastQuery) {
				addMessage(
					"system",
					"No previous query to provide feedback for.",
				);
				return;
			}

			const parts = feedbackInput.split(/\s+/);
			const feedbackType = parts[1]?.toLowerCase();

			if (!feedbackType) {
				addMessage("system", "Usage: /feedback <positive|negative>");
				return;
			}

			const apiClient = session.getAPIClient();
			if (!apiClient) {
				addMessage("system", "Not connected to API.");
				return;
			}

			try {
				const client = getGenAIClient(apiClient);

				if (feedbackType === "positive" || feedbackType === "+") {
					await client.feedback({
						query: state.lastQuery,
						query_id: state.lastQueryId,
						namespace: state.namespace,
						positive_feedback: {},
					});
					addMessage(
						"system",
						"Positive feedback submitted. Thank you!",
					);
				} else if (
					feedbackType === "negative" ||
					feedbackType === "-"
				) {
					const negType = parts[2]?.toLowerCase();
					const mappedType = negType
						? FEEDBACK_TYPE_MAP[negType]
						: undefined;
					const comment = parts.slice(3).join(" ") || undefined;

					await client.feedback({
						query: state.lastQuery,
						query_id: state.lastQueryId,
						namespace: state.namespace,
						negative_feedback: {
							remarks: mappedType ? [mappedType] : ["OTHER"],
						},
						comment,
					});
					addMessage(
						"system",
						"Negative feedback submitted. Thank you for helping improve the AI.",
					);
				} else {
					addMessage(
						"system",
						`Unknown feedback type: ${feedbackType}. Use 'positive' or 'negative'.`,
					);
				}
			} catch (error) {
				const message =
					error instanceof Error ? error.message : String(error);
				addMessage("system", `Feedback failed: ${message}`);
			}
		},
		[session, addMessage],
	);

	// Handle follow-up selection
	const handleFollowUp = useCallback(
		async (num: number) => {
			const state = getLastQueryState();
			if (num < 1 || num > state.followUpQueries.length) {
				addMessage(
					"system",
					`Invalid selection. Choose 1-${state.followUpQueries.length} from suggested follow-ups.`,
				);
				return;
			}

			const followUp = state.followUpQueries[num - 1];
			if (!followUp) return;

			addMessage("user", followUp);
			setFollowUps([]);
			setIsLoading(true);

			const apiClient = session.getAPIClient();
			if (!apiClient) {
				addMessage("system", "Not connected to API.");
				setIsLoading(false);
				return;
			}

			try {
				const client = getGenAIClient(apiClient);
				const response = await client.query(namespace, followUp);

				updateLastQueryState({
					namespace,
					lastQueryId: response.query_id,
					lastQuery: followUp,
					followUpQueries: response.follow_up_queries ?? [],
				});

				const lines = renderResponse(response);
				for (const line of lines) {
					addMessage("ai", line);
				}

				// Update follow-ups
				setFollowUps(response.follow_up_queries ?? []);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : String(error);
				addMessage("system", `Query failed: ${message}`);
			} finally {
				setIsLoading(false);
			}
		},
		[session, namespace, addMessage],
	);

	// Send query to AI
	const sendQuery = useCallback(
		async (query: string) => {
			addMessage("user", query);
			setFollowUps([]);
			setIsLoading(true);

			const apiClient = session.getAPIClient();
			if (!apiClient) {
				addMessage("system", "Not connected to API.");
				setIsLoading(false);
				return;
			}

			try {
				const client = getGenAIClient(apiClient);
				const response = await client.query(namespace, query);

				updateLastQueryState({
					namespace,
					lastQueryId: response.query_id,
					lastQuery: query,
					followUpQueries: response.follow_up_queries ?? [],
				});

				addMessage("ai", "");
				const lines = renderResponse(response);
				for (const line of lines) {
					addMessage("ai", line);
				}

				// Update follow-ups
				setFollowUps(response.follow_up_queries ?? []);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : String(error);
				addMessage("system", `Query failed: ${message}`);
			} finally {
				setIsLoading(false);
			}
		},
		[session, namespace, addMessage],
	);

	// Handle input submission
	const handleSubmit = useCallback(
		async (value: string) => {
			const trimmed = value.trim();
			if (!trimmed) return;

			setInput("");
			setInputKey((k) => k + 1);

			// Exit commands
			if (
				trimmed === "/exit" ||
				trimmed === "/quit" ||
				trimmed === "/q"
			) {
				addMessage("system", "Exiting chat mode.");
				// Collect all messages for scrollback
				const allMessages = messages.map((m) => {
					if (m.role === "user") return `You: ${m.content}`;
					if (m.role === "ai") return `AI: ${m.content}`;
					return m.content;
				});
				allMessages.push("Chat session ended.");
				onExit(allMessages);
				return;
			}

			// Help command
			if (trimmed === "/help" || trimmed === "/h") {
				showHelp();
				return;
			}

			// Clear command
			if (trimmed === "/clear" || trimmed === "/c") {
				clearLastQueryState();
				setFollowUps([]);
				addMessage("system", "Conversation context cleared.");
				return;
			}

			// Feedback command
			if (trimmed.startsWith("/feedback")) {
				await handleFeedback(trimmed);
				return;
			}

			// Follow-up selection by number
			if (/^\d+$/.test(trimmed)) {
				const num = parseInt(trimmed, 10);
				const state = getLastQueryState();
				if (state.followUpQueries.length > 0) {
					await handleFollowUp(num);
					return;
				}
			}

			// Unknown command
			if (trimmed.startsWith("/")) {
				addMessage(
					"system",
					`Unknown command: ${trimmed}. Type /help for commands.`,
				);
				return;
			}

			// Regular query
			await sendQuery(trimmed);
		},
		[
			messages,
			onExit,
			showHelp,
			handleFeedback,
			handleFollowUp,
			sendQuery,
			addMessage,
		],
	);

	// Handle keyboard shortcuts
	useInput((char, key) => {
		// Ctrl+C - exit chat
		if (key.ctrl && char === "c") {
			addMessage("system", "Exiting chat mode.");
			const allMessages = messages.map((m) => {
				if (m.role === "user") return `You: ${m.content}`;
				if (m.role === "ai") return `AI: ${m.content}`;
				return m.content;
			});
			allMessages.push("Chat session ended.");
			onExit(allMessages);
			return;
		}
	});

	return (
		<Box flexDirection="column" width={width}>
			{/* Chat messages */}
			<Box flexDirection="column" marginBottom={1}>
				{messages.map((msg) => (
					<Text
						key={msg.id}
						color={
							msg.role === "user"
								? "#00BFFF"
								: msg.role === "ai"
									? "#FFFFFF"
									: "#888888"
						}
					>
						{msg.role === "user"
							? `You: ${msg.content}`
							: msg.content}
					</Text>
				))}
			</Box>

			{/* Follow-up suggestions */}
			{followUps.length > 0 && (
				<Box flexDirection="column" marginBottom={1}>
					<Text color="#888888">Follow-up suggestions:</Text>
					{followUps.map((fu, i) => (
						<Text key={i} color="#AAAAAA">
							{"  "}[{i + 1}] {fu}
						</Text>
					))}
				</Box>
			)}

			{/* Loading indicator */}
			{isLoading && (
				<Box marginBottom={1}>
					<Text color="#00BFFF">
						<Spinner type="dots" /> Thinking...
					</Text>
				</Box>
			)}

			{/* Input area */}
			<HorizontalRule width={width} />
			<Box>
				<Text bold color="#00BFFF">
					ai{">"}{" "}
				</Text>
				<TextInput
					key={inputKey}
					value={input}
					onChange={setInput}
					onSubmit={handleSubmit}
					focus={!isLoading}
				/>
			</Box>
			<HorizontalRule width={width} />

			{/* Status bar */}
			<Box paddingX={1} justifyContent="space-between">
				<Text color="#666666">
					/exit: quit | /help: commands | /clear: clear chat
				</Text>
				<Text color="#666666">Ctrl+C to exit</Text>
			</Box>
		</Box>
	);
}

export default ChatMode;
