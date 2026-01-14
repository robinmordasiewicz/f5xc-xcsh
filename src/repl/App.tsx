/**
 * App - Main Ink application for the REPL
 * Orchestrates all UI components and handles keyboard input
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Box, Text, useApp, useInput, useStdout, Static } from "ink";

import {
	InputBox,
	StatusBar,
	Suggestions,
	ChatMode,
	ProfileDeleteWizard,
} from "./components/index.js";
import type { ChatModeConfig } from "./executor.js";
import type { Suggestion } from "./components/Suggestions.js";
import { REPLSession } from "./session.js";
import { buildPlainPrompt } from "./prompt.js";
import { colorBlue, colorBoldWhite } from "../branding/index.js";
import { useDoubleCtrlC } from "./hooks/useDoubleCtrlC.js";
import { useHistory } from "./hooks/useHistory.js";
import { useCompletion } from "./hooks/useCompletion.js";
import { useGitStatus } from "./hooks/useGitStatus.js";
import { executeCommand } from "./executor.js";
import { isCustomDomain } from "../domains/index.js";
import { domainRegistry } from "../types/domains.js";
import { extensionRegistry } from "../extensions/index.js";
import { setTerminalWidth } from "../output/terminal.js";
import {
	debugOutput,
	debugRender,
	debugTerminal,
	debugBuffer,
	debugSeparator,
} from "../debug/logger.js";

/**
 * Props for the App component
 */
export interface AppProps {
	/** Pre-initialized session (optional - will create new if not provided) */
	initialSession?: REPLSession;
}

/**
 * Check if a word is a valid domain (custom, API, or extension)
 */
function isValidDomain(word: string): boolean {
	const lowerWord = word.toLowerCase();
	// Check custom domains
	if (isCustomDomain(lowerWord)) return true;
	// Check API domains
	if (domainRegistry.has(lowerWord)) return true;
	// Check extension-only domains
	if (extensionRegistry.getExtension(lowerWord)) return true;
	return false;
}

/**
 * Convert completion suggestions to UI suggestions
 */
function toUISuggestions(
	suggestions: Array<{
		text: string;
		description: string;
		category?: string;
	}>,
): Suggestion[] {
	return suggestions.map((s) => ({
		label: s.text,
		value: s.text,
		description: s.description,
		category: s.category ?? "builtin", // Provide default to avoid undefined
	}));
}

/**
 * Main REPL Application
 */
export function App({ initialSession }: AppProps = {}): React.ReactElement {
	const { exit } = useApp();
	const { stdout } = useStdout();

	// Session state - use provided session or create new one
	const [session] = useState(() => initialSession ?? new REPLSession());
	// If session was pre-initialized, start as initialized
	const [isInitialized, setIsInitialized] = useState(!!initialSession);

	// UI state
	const [input, setInputState] = useState("");
	const inputRef = useRef(""); // Ref to track current input for async callbacks

	// Custom setInput that also updates the ref synchronously
	const setInput = useCallback(
		(value: string | ((prev: string) => string)) => {
			setInputState((prev) => {
				const newValue =
					typeof value === "function" ? value(prev) : value;
				inputRef.current = newValue; // Update ref synchronously
				return newValue;
			});
		},
		[],
	);

	// Output items with unique IDs for Static component (goes to scrollback)
	// Each item tracks which command it belongs to for intelligent truncation
	const [outputItems, setOutputItems] = useState<
		Array<{ id: number; content: string; commandId: number }>
	>([]);
	const outputIdRef = useRef(0);
	const commandIdRef = useRef(0);
	const [prompt, setPrompt] = useState("> ");
	const [width, setWidth] = useState(stdout?.columns ?? 80);
	const [statusHint, setStatusHint] = useState("Ctrl+C twice to exit");
	const [historyArray, setHistoryArray] = useState<string[]>([]);
	const [inputKey, setInputKey] = useState(0); // Key to reset cursor position
	// Raw stdout handling - hide status bar while writing direct stdout content
	const [hideStatusBar, setHideStatusBar] = useState(false);
	const [pendingRawStdout, setPendingRawStdout] = useState<string | null>(
		null,
	);

	// Mode state (repl, chat, profile-delete)
	const [mode, setMode] = useState<"repl" | "chat" | "profile-delete">(
		"repl",
	);
	const [chatConfig, setChatConfig] = useState<ChatModeConfig | null>(null);
	const [profileDeleteConfig, setProfileDeleteConfig] = useState<{
		profileName: string;
		isActive: boolean;
	} | null>(null);

	// Effect to handle raw stdout writing when status bar is hidden
	// This ensures the status bar is removed from render BEFORE we write content
	// that may cause terminal scrolling, preventing it from being captured in scrollback
	// CRITICAL: Do not modify without testing - prevents status bar in scrollback
	useEffect(() => {
		if (hideStatusBar && pendingRawStdout) {
			// Status bar is now hidden from Ink's render, safe to write raw stdout
			process.stdout.write(pendingRawStdout);
			// CRITICAL: Newlines to prevent Ink from truncating banner bottom border
			// - 3 newlines is minimum needed to prevent truncation
			// - DO NOT REDUCE below 3 - will truncate bottom of banner frame
			// - DO NOT INCREASE above 3 - causes excessive deadspace below banner
			process.stdout.write("\n\n\n");
			// Restore state - status bar will reappear in next render
			setPendingRawStdout(null);
			setHideStatusBar(false);
		}
	}, [hideStatusBar, pendingRawStdout]);

	// Git status hook - auto-refresh on timer and manual refresh via Ctrl+G or command
	const gitStatus = useGitStatus({ enabled: isInitialized });

	// Completion state
	const completion = useCompletion({
		session: isInitialized ? session : null,
	});

	// History state
	const history = useHistory({
		history: historyArray,
		onSelect: (cmd) => {
			setInput(cmd);
			// Force TextInput remount to reflect new value
			setInputKey((k) => k + 1);
		},
	});

	// Double Ctrl+C detection
	const ctrlC = useDoubleCtrlC({
		windowMs: 500,
		onFirstPress: () => {
			addOutput("\nPress Ctrl+C again to exit, or continue typing");
			setStatusHint("Press Ctrl+C again to exit");
		},
		onDoublePress: () => {
			// Save history before exiting
			session.saveHistory().finally(() => exit());
		},
	});

	// Initialize session (or set up UI state from pre-initialized session)
	useEffect(() => {
		const init = async () => {
			// Only initialize if not pre-initialized
			if (!isInitialized) {
				await session.initialize();
				setIsInitialized(true);
			}

			// Always set up prompt and history (git info handled by hook)
			setPrompt(buildPlainPrompt(session));

			// Get initial history array
			const histMgr = session.getHistory();
			if (histMgr) {
				setHistoryArray(histMgr.getHistory());
			}
		};
		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	// Handle terminal resize - sync to both local state and global context
	useEffect(() => {
		const handleResize = () => {
			if (stdout) {
				const newWidth = stdout.columns ?? 80;
				const newHeight = stdout.rows ?? 24;
				debugTerminal("Terminal resized", {
					width: newWidth,
					height: newHeight,
					previousWidth: width,
				});
				setWidth(newWidth);
				setTerminalWidth(newWidth);
			}
		};

		// Initialize terminal width context on mount
		if (stdout) {
			const initialWidth = stdout.columns ?? 80;
			const initialHeight = stdout.rows ?? 24;
			debugTerminal("Terminal initialized", {
				width: initialWidth,
				height: initialHeight,
			});
			setTerminalWidth(initialWidth);
		}

		stdout?.on("resize", handleResize);
		return () => {
			stdout?.off("resize", handleResize);
		};
	}, [stdout, width]);

	// Add output line(s) - each line gets unique ID and commandId for Static component
	const addOutput = useCallback((line: string) => {
		const lines = line.split("\n");
		const currentCommandId = commandIdRef.current;
		const newItems = lines.map((content) => ({
			id: outputIdRef.current++,
			content,
			commandId: currentCommandId,
		}));

		debugOutput("Adding output lines", {
			inputLineCount: 1,
			splitLineCount: lines.length,
			newItemsCount: newItems.length,
			commandId: currentCommandId,
			firstLineLength: lines[0]?.length,
			firstLinePreview: lines[0]?.slice(0, 80),
		});

		setOutputItems((prev) => {
			const combined = [...prev, ...newItems];

			// Count unique commands in buffer
			const uniqueCommands = new Set(
				combined.map((item) => item.commandId),
			);
			const commandCount = uniqueCommands.size;

			debugBuffer("Buffer state before truncation", {
				previousItemCount: prev.length,
				newItemsCount: newItems.length,
				combinedItemCount: combined.length,
				commandCount: commandCount,
				willTruncate: commandCount > 3,
			});

			// Keep only last 3 commands worth of output
			// This prevents memory bloat while preserving complete command outputs
			if (commandCount > 3) {
				// Find the 3 most recent command IDs
				const recentCommandIds = Array.from(uniqueCommands)
					.sort((a, b) => b - a)
					.slice(0, 3);

				const truncated = combined.filter((item) =>
					recentCommandIds.includes(item.commandId),
				);

				debugBuffer("Buffer truncated by command boundary", {
					beforeCount: combined.length,
					afterCount: truncated.length,
					itemsRemoved: combined.length - truncated.length,
					commandsRemoved: commandCount - 3,
					keptCommandIds: recentCommandIds,
				});

				return truncated;
			}

			debugBuffer("Buffer updated without truncation", {
				finalItemCount: combined.length,
				commandCount: commandCount,
			});

			return combined;
		});
	}, []);

	// Apply completion to input - uses inputRef for current value
	const applyCompletion = useCallback(
		(suggestion: Suggestion) => {
			// Use ref to get current input (avoids stale closure)
			const currentInput = inputRef.current;
			let newValue: string;
			const words = currentInput.split(/\s+/);

			if (words.length === 0 || currentInput === "") {
				newValue = suggestion.value + " ";
			} else {
				const lastWord = words[words.length - 1] ?? "";

				// Handle "/" escape prefix - strip it for matching but preserve in output
				const hasEscapePrefix =
					words.length === 1 && lastWord.startsWith("/");
				const matchWord = hasEscapePrefix
					? lastWord.slice(1)
					: lastWord;

				if (
					matchWord === "" ||
					suggestion.value
						.toLowerCase()
						.startsWith(matchWord.toLowerCase())
				) {
					// Replace the partial word with the full suggestion
					const prefix = currentInput.slice(
						0,
						currentInput.length - lastWord.length,
					);
					// Preserve the "/" prefix if it was there
					const completedValue = hasEscapePrefix
						? "/" + suggestion.value
						: suggestion.value;
					newValue = prefix + completedValue + " ";
				} else {
					// No match - just append with space (shouldn't normally happen)
					newValue = currentInput + " " + suggestion.value + " ";
				}
			}

			setInput(newValue);
			// Increment key to force TextInput remount, moving cursor to end
			setInputKey((k) => k + 1);
		},
		[], // No dependencies needed since we use inputRef
	);

	// Refresh history array from session
	const refreshHistory = useCallback(() => {
		const histMgr = session.getHistory();
		if (histMgr) {
			setHistoryArray(histMgr.getHistory());
		}
	}, [session]);

	// Execute command using executor module
	const runCommand = useCallback(
		async (cmd: string) => {
			const trimmed = cmd.trim();
			if (!trimmed) return;

			debugSeparator();
			debugOutput("Command execution started", {
				command: trimmed,
				timestamp: new Date().toISOString(),
				currentBufferSize: outputItems.length,
			});

			// Show command in scrollback with blue indicator and bright white command
			// Format: ⏺ xcsh> command (blue ⏺, bright white command text)
			// Increment command ID for new command - marks boundary for truncation
			commandIdRef.current++;

			const scrollbackCommand = `${colorBlue("⏺")} ${colorBoldWhite(prompt + trimmed)}`;
			addOutput(scrollbackCommand);

			// Execute via executor module
			const result = await executeCommand(trimmed, session);

			debugOutput("Command execution completed", {
				command: trimmed,
				outputLineCount: result.output.length,
				shouldExit: result.shouldExit,
				shouldClear: result.shouldClear,
				hasRawStdout: !!result.rawStdout,
				enterChatMode: result.enterChatMode,
				enterProfileDeleteMode: result.enterProfileDeleteMode,
			});

			// Handle entering chat mode
			if (result.enterChatMode && result.chatConfig) {
				setMode("chat");
				setChatConfig(result.chatConfig);
				return;
			}

			// Handle entering profile delete mode
			if (result.enterProfileDeleteMode && result.profileDeleteConfig) {
				setMode("profile-delete");
				setProfileDeleteConfig(result.profileDeleteConfig);
				return;
			}

			// Handle raw stdout content (e.g., image banner with cursor positioning)
			// This bypasses Ink's rendering to avoid status bar in scrollback
			if (result.rawStdout) {
				// Hide status bar before writing raw content
				// The useEffect will handle the actual writing after render
				setHideStatusBar(true);
				setPendingRawStdout(result.rawStdout);
				// Don't process normal output - rawStdout is the complete output
			} else if (result.shouldClear) {
				// Handle clear
				debugOutput("Clearing output buffer");
				setOutputItems([]);
			} else {
				// Add output lines
				debugOutput("Processing output lines", {
					totalLines: result.output.length,
					firstLine: result.output[0]?.slice(0, 100),
					lastLine: result.output[result.output.length - 1]?.slice(
						0,
						100,
					),
				});
				result.output.forEach((line) => addOutput(line));
			}

			// Handle exit
			if (result.shouldExit) {
				await session.saveHistory();
				exit();
				return;
			}

			// Update prompt if context changed
			if (result.contextChanged) {
				setPrompt(buildPlainPrompt(session));
			}

			// Refresh git status after command execution (or if explicitly requested)
			if (result.refreshGit) {
				gitStatus.refresh();
			} else {
				// Always refresh git status after any command
				gitStatus.refresh();
			}

			// Refresh history
			refreshHistory();
		},
		[session, prompt, addOutput, exit, refreshHistory, gitStatus],
	);

	// Handle input change
	const handleInputChange = useCallback(
		(newValue: string) => {
			const oldValue = input;
			setInput(newValue);

			// Live filtering when suggestions are showing
			if (completion.isShowing) {
				completion.filterSuggestions(newValue);
				return;
			}

			// Check if "/" was typed - trigger completion
			if (newValue !== oldValue && newValue.endsWith("/")) {
				const beforeSlash = newValue.slice(0, -1);
				if (beforeSlash === "" || beforeSlash.endsWith(" ")) {
					completion.triggerCompletion(newValue);
					return;
				}
			}

			// Check if space was typed after a known domain - trigger contextual completion
			// This works at any depth: "login ", "login profile ", "login profile use ", etc.
			if (
				newValue !== oldValue &&
				newValue.endsWith(" ") &&
				!oldValue.endsWith(" ")
			) {
				const trimmed = newValue.trimEnd();
				const words = trimmed.split(/\s+/);
				if (words.length > 0 && words[0]) {
					const firstWord = words[0].startsWith("/")
						? words[0].slice(1)
						: words[0];
					if (isValidDomain(firstWord)) {
						completion.triggerCompletion(newValue);
					}
				}
			}
		},
		[input, completion],
	);

	// Handle input submission
	const handleSubmit = useCallback(
		async (value: string) => {
			// If showing suggestions, apply selected
			if (completion.isShowing && completion.suggestions.length > 0) {
				const selected = completion.selectCurrent();
				if (selected) {
					applyCompletion({
						label: selected.text,
						value: selected.text,
						description: selected.description,
						category: selected.category ?? "builtin",
					});
				}
				return;
			}

			// Clear input immediately to prevent duplicate display in scrollback
			// (InputBox would show command while addOutput also adds it to Static)
			setInput("");
			history.reset();

			// Execute command
			await runCommand(value);
		},
		[completion, applyCompletion, runCommand, history],
	);

	// Keyboard input handling
	useInput((char, key) => {
		// Ctrl+C - double press to exit
		if (key.ctrl && char === "c") {
			ctrlC.handleCtrlC();
			return;
		}

		// Ctrl+D - immediate exit
		if (key.ctrl && char === "d") {
			session.saveHistory().finally(() => exit());
			return;
		}

		// Ctrl+G - refresh git status
		if (key.ctrl && char === "g") {
			gitStatus.refresh();
			setStatusHint("Git status refreshed");
			setTimeout(() => setStatusHint("Ctrl+C twice to exit"), 2000);
			return;
		}

		// Tab - trigger completion or select current suggestion
		if (key.tab) {
			// Use ref to get current input value (avoids stale closure)
			const currentInput = inputRef.current;
			if (completion.isShowing) {
				// Tab selects the current suggestion (same as Enter)
				const selected = completion.suggestions.at(
					completion.selectedIndex,
				);
				if (selected) {
					applyCompletion({
						label: selected.text,
						value: selected.text,
						description: selected.description,
						category: selected.category ?? "builtin",
					});
					completion.hide();
				}
			} else {
				// triggerCompletion is async - returns suggestion for single match
				completion
					.triggerCompletion(currentInput)
					.then((suggestion) => {
						if (suggestion) {
							// Single match - auto-complete
							applyCompletion({
								label: suggestion.text,
								value: suggestion.text,
								description: suggestion.description,
								category: suggestion.category ?? "builtin",
							});
						}
						// Multiple matches - suggestions are shown by the hook
					})
					.catch(() => {
						// Ignore completion errors
					});
			}
			return;
		}

		// Up/Down arrows
		if (key.upArrow) {
			if (completion.isShowing) {
				completion.navigateUp();
			} else {
				history.navigateUp();
			}
			return;
		}

		if (key.downArrow) {
			if (completion.isShowing) {
				completion.navigateDown();
			} else {
				history.navigateDown();
			}
			return;
		}

		// Escape - cancel suggestions
		if (key.escape) {
			completion.hide();
			return;
		}

		// Right arrow - apply suggestion
		if (
			key.rightArrow &&
			completion.isShowing &&
			completion.suggestions.length > 0
		) {
			const selected = completion.selectCurrent();
			if (selected) {
				applyCompletion({
					label: selected.text,
					value: selected.text,
					description: selected.description,
					category: selected.category ?? "builtin",
				});
			}
			return;
		}
	});

	// Suggestion navigation handlers
	const handleSuggestionNavigate = useCallback(
		(direction: "up" | "down") => {
			if (direction === "up") {
				completion.navigateUp();
			} else {
				completion.navigateDown();
			}
		},
		[completion],
	);

	const handleSuggestionSelect = useCallback(
		(suggestion: Suggestion) => {
			applyCompletion(suggestion);
			completion.hide();
		},
		[applyCompletion, completion],
	);

	// Handle chat mode exit
	const handleChatExit = useCallback(
		(chatMessages: string[]) => {
			// Add chat messages to scrollback
			chatMessages.forEach((msg) => addOutput(msg));
			// Return to REPL mode
			setMode("repl");
			setChatConfig(null);
		},
		[addOutput],
	);

	const handleProfileDeleteExit = useCallback(
		(success: boolean, messages: string[]) => {
			// Add output messages to scrollback
			messages.forEach((msg) => addOutput(msg));

			// If active profile was deleted, refresh prompt
			if (success && profileDeleteConfig?.isActive) {
				setPrompt(buildPlainPrompt(session));
			}

			// Return to REPL mode
			setMode("repl");
			setProfileDeleteConfig(null);

			// Reset input
			setInput("");
			setInputKey((prev) => prev + 1);
		},
		[addOutput, session, profileDeleteConfig, setInput],
	);

	// Track Static component rendering
	useEffect(() => {
		const uniqueCommands = new Set(
			outputItems.map((item) => item.commandId),
		);
		debugRender("Static component render triggered", {
			itemCount: outputItems.length,
			commandCount: uniqueCommands.size,
			terminalWidth: width,
			terminalHeight: stdout?.rows ?? "unknown",
			firstItemId: outputItems[0]?.id,
			firstCommandId: outputItems[0]?.commandId,
			lastItemId: outputItems[outputItems.length - 1]?.id,
			lastCommandId: outputItems[outputItems.length - 1]?.commandId,
			lastItemContent: outputItems[outputItems.length - 1]?.content.slice(
				0,
				100,
			),
		});
	}, [outputItems, width, stdout]);

	// Always mount Static from start to prevent tree restructure issues
	// This keeps the component tree stable and prevents Ink's screen clearing
	return (
		<Box flexDirection="column" width={width}>
			{/* Static content - goes to scrollback, never re-rendered */}
			<Static items={outputItems}>
				{(item) => <Text key={item.id}>{item.content}</Text>}
			</Static>

			{/* Conditionally render active UI or loading state */}
			{/* Hide entire active UI when writing raw stdout to prevent it appearing in scrollback */}
			{isInitialized && !hideStatusBar ? (
				mode === "chat" && chatConfig ? (
					<ChatMode
						session={session}
						namespace={chatConfig.namespace}
						width={width}
						onExit={handleChatExit}
					/>
				) : mode === "profile-delete" && profileDeleteConfig ? (
					<ProfileDeleteWizard
						profileToDelete={profileDeleteConfig.profileName}
						isActive={profileDeleteConfig.isActive}
						session={session}
						width={width}
						onExit={handleProfileDeleteExit}
					/>
				) : (
					<>
						{/* Input box */}
						<InputBox
							prompt={prompt}
							value={input}
							onChange={handleInputChange}
							onSubmit={handleSubmit}
							width={width}
							isActive={true}
							inputKey={inputKey}
						/>

						{/* Suggestions popup OR Status bar - mutually exclusive to conserve space */}
						{completion.isShowing &&
						completion.suggestions.length > 0 ? (
							<Suggestions
								suggestions={toUISuggestions(
									completion.suggestions,
								)}
								selectedIndex={completion.selectedIndex}
								onSelect={handleSuggestionSelect}
								onNavigate={handleSuggestionNavigate}
								onCancel={completion.hide}
								maxVisible={20}
								isActive={false} // Let App handle keyboard
							/>
						) : (
							<StatusBar
								gitInfo={gitStatus.gitInfo}
								width={width}
								hint={statusHint}
							/>
						)}
					</>
				)
			) : !isInitialized ? (
				<Text>Initializing...</Text>
			) : null}
		</Box>
	);
}

export default App;
