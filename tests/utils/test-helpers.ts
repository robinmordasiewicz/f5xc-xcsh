/**
 * Test utilities for creating mock sessions, completers, and assertion helpers
 */

import { describe as it, expect, vi } from "vitest";
import { Completer } from "../../src/repl/completion/completer.js";
import { REPLSession } from "../../src/repl/session.js";

/**
 * Create a test session with optional configuration
 */
export function createTestSession(config?: {
	authenticated?: boolean;
	namespace?: string;
	profileName?: string;
	url?: string;
	token?: string;
}): REPLSession {
	// Set up environment variables for the session
	if (config?.url) {
		vi.stubEnv("F5XC_API_URL", config.url);
	}
	if (config?.token) {
		vi.stubEnv("F5XC_API_TOKEN", config.token);
	}
	if (config?.namespace) {
		vi.stubEnv("F5XC_NAMESPACE", config.namespace);
	}

	const session = new REPLSession();

	// Mock authentication if requested
	if (config?.authenticated) {
		// Session will automatically be authenticated if URL and token are set
		if (!config?.url) {
			vi.stubEnv("F5XC_API_URL", "https://test.volterra.io");
		}
		if (!config?.token) {
			vi.stubEnv("F5XC_API_TOKEN", "test-token-123");
		}
	}

	return session;
}

/**
 * Create a test completer with optional session
 */
export function createTestCompleter(session?: REPLSession): Completer {
	const completer = new Completer();
	if (session) {
		completer.setSession(session);
	}
	return completer;
}

/**
 * Interface for command result
 */
interface CommandResult {
	success?: boolean;
	output?: string;
	message?: string;
	error?: string;
}

/**
 * Execute a command and assert expectations
 */
export async function executeAndExpect(
	command: string,
	session: REPLSession,
	expectations: {
		success?: boolean;
		error?: string | RegExp;
		output?: string | RegExp;
	},
): Promise<CommandResult> {
	// Import executeCommand dynamically to avoid circular dependencies
	const { executeCommand } = await import("../../src/repl/executor.js");
	const result = await executeCommand(command, session);

	// ExecutionResult doesn't have a 'success' field
	// Success = no error present, Failure = error present
	if (expectations.success !== undefined) {
		const actualSuccess = !result.error;
		expect(actualSuccess).toBe(expectations.success);
	}

	if (expectations.error) {
		if (typeof expectations.error === "string") {
			expect(result.error).toContain(expectations.error);
		} else {
			expect(result.error).toMatch(expectations.error);
		}
	}

	if (expectations.output) {
		// output is an array of strings, join them for easier matching
		const output = Array.isArray(result.output)
			? result.output.join("\n")
			: String(result.output || "");
		if (typeof expectations.output === "string") {
			expect(output).toContain(expectations.output);
		} else {
			expect(output).toMatch(expectations.output);
		}
	}

	return result;
}

/**
 * Interface for completion expectations
 */
interface CompletionExpectations {
	includes?: string[];
	excludes?: string[];
	minCount?: number;
	maxCount?: number;
	categories?: string[];
}

/**
 * Interface for completion suggestion
 */
interface CompletionSuggestion {
	text: string;
	description?: string;
	category?: string;
}

/**
 * Complete input and assert expectations
 */
export async function completeAndExpect(
	input: string,
	completer: Completer,
	expectations: CompletionExpectations,
): Promise<CompletionSuggestion[]> {
	const suggestions = await completer.complete(input);
	const texts = suggestions.map((s) => s.text);

	if (expectations.includes) {
		for (const expected of expectations.includes) {
			expect(texts).toContain(expected);
		}
	}

	if (expectations.excludes) {
		for (const excluded of expectations.excludes) {
			expect(texts).not.toContain(excluded);
		}
	}

	if (expectations.minCount !== undefined) {
		expect(suggestions.length).toBeGreaterThanOrEqual(expectations.minCount);
	}

	if (expectations.maxCount !== undefined) {
		expect(suggestions.length).toBeLessThanOrEqual(expectations.maxCount);
	}

	if (expectations.categories) {
		const categories = suggestions.map((s) => s.category).filter(Boolean);
		for (const category of expectations.categories) {
			expect(categories).toContain(category);
		}
	}

	return suggestions;
}

// In-memory storage for profiles - shared across all mocks
const mockProfiles = new Map<string, any>();
let mockActiveProfile: string | null = null;

/**
 * Mock the profile manager to avoid file system operations
 * Maintains in-memory state for testing
 */
export function mockProfileManager() {
	return vi.mock("../../src/profile/index.js", () => ({
		getProfileManager: () => ({
			getActive: vi.fn().mockImplementation(async () => mockActiveProfile),
			list: vi.fn().mockImplementation(async () => Array.from(mockProfiles.values())),
			get: vi.fn().mockImplementation(async (name: string) => mockProfiles.get(name) || null),
			save: vi.fn().mockImplementation(async (profile: any) => {
				mockProfiles.set(profile.name, profile);
				return { success: true };
			}),
			delete: vi.fn().mockImplementation(async (name: string) => {
				mockProfiles.delete(name);
				return { success: true };
			}),
			setActive: vi.fn().mockImplementation(async (name: string) => {
				mockActiveProfile = name;
				return { success: true };
			}),
			maskProfile: vi.fn().mockImplementation((profile: any) => ({
				...profile,
				apiToken: profile.apiToken ? "***masked***" : undefined,
			})),
		}),
	}));
}

/**
 * Mock the history manager to avoid file system operations
 */
export function mockHistoryManager() {
	return vi.mock("../../src/repl/history.js", () => ({
		HistoryManager: {
			create: vi.fn().mockResolvedValue({
				add: vi.fn(),
				getHistory: vi.fn().mockReturnValue([]),
				save: vi.fn().mockResolvedValue(undefined),
			}),
		},
		getHistoryFilePath: vi.fn().mockReturnValue("/tmp/test-history"),
	}));
}

/**
 * Setup test environment with common mocks
 */
export function setupTestEnvironment() {
	mockProfileManager();
	mockHistoryManager();
}

/**
 * Cleanup test environment
 */
export function cleanupTestEnvironment() {
	// Clear mock profile storage
	mockProfiles.clear();
	mockActiveProfile = null;

	vi.unstubAllEnvs();
	vi.restoreAllMocks();
}
