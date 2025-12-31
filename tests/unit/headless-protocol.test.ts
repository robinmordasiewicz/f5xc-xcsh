/**
 * Unit tests for headless protocol module
 */

import { describe, it, expect } from "vitest";
import {
	parseInput,
	formatOutput,
	createOutputMessage,
	createPromptMessage,
	createCompletionResponse,
	createErrorMessage,
	createEventMessage,
	createExitMessage,
} from "../../src/headless/protocol.js";

describe("Headless Protocol", () => {
	describe("parseInput", () => {
		it("should parse valid command input", () => {
			const result = parseInput('{"type":"command","value":"help"}');
			expect(result).not.toBeNull();
			expect(result?.type).toBe("command");
			expect(result?.value).toBe("help");
		});

		it("should parse completion request", () => {
			const result = parseInput(
				'{"type":"completion_request","partial":"log"}',
			);
			expect(result).not.toBeNull();
			expect(result?.type).toBe("completion_request");
			expect(result?.partial).toBe("log");
		});

		it("should parse exit input", () => {
			const result = parseInput('{"type":"exit"}');
			expect(result).not.toBeNull();
			expect(result?.type).toBe("exit");
		});

		it("should parse interrupt input", () => {
			const result = parseInput('{"type":"interrupt"}');
			expect(result).not.toBeNull();
			expect(result?.type).toBe("interrupt");
		});

		it("should return null for invalid JSON", () => {
			const result = parseInput("not json");
			expect(result).toBeNull();
		});

		it("should return null for missing type", () => {
			const result = parseInput('{"value":"test"}');
			expect(result).toBeNull();
		});

		it("should return null for invalid type", () => {
			const result = parseInput('{"type":"invalid"}');
			expect(result).toBeNull();
		});

		it("should return null for non-object JSON", () => {
			const result = parseInput('"string"');
			expect(result).toBeNull();
		});

		it("should return null for null JSON", () => {
			const result = parseInput("null");
			expect(result).toBeNull();
		});
	});

	describe("formatOutput", () => {
		it("should format output message as JSON string", () => {
			const output = createOutputMessage("test content", "text");
			const formatted = formatOutput(output);
			const parsed = JSON.parse(formatted);

			expect(parsed.type).toBe("output");
			expect(parsed.content).toBe("test content");
			expect(parsed.format).toBe("text");
			expect(parsed.timestamp).toBeDefined();
		});
	});

	describe("createOutputMessage", () => {
		it("should create output message with default format", () => {
			const result = createOutputMessage("content");
			expect(result.type).toBe("output");
			expect(result.content).toBe("content");
			expect(result.format).toBe("text");
			expect(result.timestamp).toBeDefined();
		});

		it("should create output message with specified format", () => {
			const result = createOutputMessage("{}json{}", "json");
			expect(result.format).toBe("json");
		});
	});

	describe("createPromptMessage", () => {
		it("should create prompt message", () => {
			const result = createPromptMessage("xcsh> ");
			expect(result.type).toBe("prompt");
			expect(result.prompt).toBe("xcsh> ");
			expect(result.timestamp).toBeDefined();
		});
	});

	describe("createCompletionResponse", () => {
		it("should create completion response", () => {
			const suggestions = [
				{ text: "login", description: "Login command" },
				{ text: "logout", description: "Logout command" },
			];
			const result = createCompletionResponse(suggestions);
			expect(result.type).toBe("completion_response");
			expect(result.suggestions).toHaveLength(2);
			expect(result.suggestions?.[0].text).toBe("login");
			expect(result.timestamp).toBeDefined();
		});

		it("should handle empty suggestions", () => {
			const result = createCompletionResponse([]);
			expect(result.suggestions).toHaveLength(0);
		});
	});

	describe("createErrorMessage", () => {
		it("should create error message with default code", () => {
			const result = createErrorMessage("Something went wrong");
			expect(result.type).toBe("error");
			expect(result.message).toBe("Something went wrong");
			expect(result.code).toBe(1);
			expect(result.timestamp).toBeDefined();
		});

		it("should create error message with custom code", () => {
			const result = createErrorMessage("Not found", 404);
			expect(result.code).toBe(404);
		});
	});

	describe("createEventMessage", () => {
		it("should create event message", () => {
			const result = createEventMessage("session_initialized", {
				authenticated: true,
			});
			expect(result.type).toBe("event");
			expect(result.event).toBe("session_initialized");
			expect(result.data?.authenticated).toBe(true);
			expect(result.timestamp).toBeDefined();
		});

		it("should create event message with empty data", () => {
			const result = createEventMessage("test_event");
			expect(result.data).toEqual({});
		});
	});

	describe("createExitMessage", () => {
		it("should create exit message with default code", () => {
			const result = createExitMessage();
			expect(result.type).toBe("exit");
			expect(result.code).toBe(0);
			expect(result.timestamp).toBeDefined();
		});

		it("should create exit message with custom code", () => {
			const result = createExitMessage(1);
			expect(result.code).toBe(1);
		});
	});
});
