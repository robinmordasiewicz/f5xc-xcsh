/**
 * Mock Utilities for Completion Testing
 * Provides mock implementations of API client, session, and completer for isolated testing
 */

import { Completer } from "../../src/repl/completion/completer.js";
import type { REPLSession } from "../../src/repl/session.js";
import { ContextPath } from "../../src/repl/context.js";
import { resourceFetcher } from "../../src/repl/completion/resource-fetcher.js";

/**
 * Mock API Client for testing
 * Simulates authentication state and API responses
 */
export class MockAPIClient {
	private authenticated: boolean = true;
	private responses: Map<string, any> = new Map();
	private errors: Map<string, Error> = new Map();
	private callLog: string[] = [];

	constructor(authenticated: boolean = true) {
		this.authenticated = authenticated;
	}

	/**
	 * Get the log of all API calls made
	 */
	getCallLog(): string[] {
		return [...this.callLog];
	}

	/**
	 * Clear the call log
	 */
	clearCallLog(): void {
		this.callLog = [];
	}

	/**
	 * Check if client is authenticated
	 */
	isAuthenticated(): boolean {
		return this.authenticated;
	}

	/**
	 * Set authentication state
	 */
	setAuthenticated(auth: boolean): void {
		this.authenticated = auth;
	}

	/**
	 * Set a mock response for a specific endpoint
	 */
	setResponse(endpoint: string, response: any): void {
		this.responses.set(endpoint, response);
	}

	/**
	 * Set an error to be thrown for a specific endpoint
	 */
	setError(endpoint: string, error: Error): void {
		this.errors.set(endpoint, error);
	}

	/**
	 * Mock GET request
	 * Returns response in the format: { ok: boolean, data: any }
	 */
	async get(endpoint: string): Promise<any> {
		this.callLog.push(endpoint);
		if (this.errors.has(endpoint)) {
			throw this.errors.get(endpoint);
		}
		const data = this.responses.get(endpoint) || { items: [] };
		return {
			ok: true,
			data,
		};
	}

	/**
	 * Clear all mock data
	 */
	clear(): void {
		this.responses.clear();
		this.errors.clear();
	}
}

/**
 * Mock REPL Session for testing
 * Provides minimal session interface for completion testing
 */
export class MockREPLSession {
	private namespace: string = "default";
	private apiClient: MockAPIClient;
	private tenant: string = "test-tenant";
	private contextPath: ContextPath = new ContextPath();

	constructor(client?: MockAPIClient) {
		this.apiClient = client || new MockAPIClient();
	}

	/**
	 * Get current namespace
	 */
	getNamespace(): string {
		return this.namespace;
	}

	/**
	 * Set current namespace
	 */
	setNamespace(ns: string): void {
		this.namespace = ns;
	}

	/**
	 * Get API client
	 */
	getAPIClient(): MockAPIClient {
		return this.apiClient;
	}

	/**
	 * Get tenant
	 */
	getTenant(): string {
		return this.tenant;
	}

	/**
	 * Set tenant
	 */
	setTenant(tenant: string): void {
		this.tenant = tenant;
	}

	/**
	 * Get context path
	 */
	getContextPath(): ContextPath {
		return this.contextPath;
	}

	/**
	 * Set context path
	 */
	setContextPath(ctx: ContextPath): void {
		this.contextPath = ctx;
	}
}

/**
 * Factory function to create a test completer with a mock session
 */
export function createTestCompleter(
	session?: MockREPLSession | REPLSession,
): Completer {
	const testSession = (session || new MockREPLSession()) as REPLSession;
	const completer = new Completer();
	completer.setSession(testSession);
	return completer;
}

/**
 * Helper to create mock API response for resources
 */
export function createMockResourceResponse(
	names: string[],
): { items: Array<{ name: string }> } {
	return {
		items: names.map((name) => ({ name })),
	};
}

/**
 * Helper to create mock error
 */
export function createMockError(message: string, code?: string): Error {
	const error = new Error(message);
	if (code) {
		(error as any).code = code;
	}
	return error;
}

/**
 * Clear the resource fetcher cache
 * IMPORTANT: Call this in beforeEach() to ensure test isolation
 * The resourceFetcher is a singleton, so cache persists across tests
 */
export function clearResourceFetcherCache(): void {
	resourceFetcher.clearAll();
}
