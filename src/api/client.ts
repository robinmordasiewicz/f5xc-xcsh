/**
 * F5 XC API Client
 * HTTP client for F5 Distributed Cloud API with authentication support
 */

import type {
	APIClientConfig,
	APIRequestOptions,
	APIResponse,
	APIErrorResponse,
	HTTPMethod,
} from "./types.js";
import { APIError } from "./types.js";

/**
 * API Client for F5 Distributed Cloud
 */
export class APIClient {
	private readonly serverUrl: string;
	private readonly apiToken: string;
	private readonly timeout: number;
	private readonly debug: boolean;

	constructor(config: APIClientConfig) {
		// Normalize server URL (remove trailing slash)
		this.serverUrl = config.serverUrl.replace(/\/+$/, "");
		this.apiToken = config.apiToken ?? "";
		this.timeout = config.timeout ?? 30000;
		this.debug = config.debug ?? false;
	}

	/**
	 * Check if client has authentication configured
	 */
	isAuthenticated(): boolean {
		return this.apiToken !== "";
	}

	/**
	 * Get the server URL
	 */
	getServerUrl(): string {
		return this.serverUrl;
	}

	/**
	 * Build full URL from path and query parameters
	 */
	private buildUrl(path: string, query?: Record<string, string>): string {
		let baseUrl = this.serverUrl;

		// Handle case where base URL ends with /api and path starts with /api
		if (baseUrl.endsWith("/api") && path.startsWith("/api")) {
			baseUrl = baseUrl.slice(0, -4);
		}

		// Ensure path starts with /
		const normalizedPath = path.startsWith("/") ? path : `/${path}`;
		let url = `${baseUrl}${normalizedPath}`;

		// Add query parameters
		if (query && Object.keys(query).length > 0) {
			const params = new URLSearchParams(query);
			url = `${url}?${params.toString()}`;
		}

		return url;
	}

	/**
	 * Execute an HTTP request
	 */
	async request<T = unknown>(
		options: APIRequestOptions,
	): Promise<APIResponse<T>> {
		const url = this.buildUrl(options.path, options.query);

		// Prepare headers
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			Accept: "application/json",
			...options.headers,
		};

		// Add API token authorization
		if (this.apiToken) {
			headers["Authorization"] = `APIToken ${this.apiToken}`;
		}

		// Prepare body
		const body: string | null = options.body
			? JSON.stringify(options.body)
			: null;

		// Debug logging
		if (this.debug) {
			console.error(`DEBUG: ${options.method} ${url}`);
			if (body) {
				console.error(`DEBUG: Request body: ${body}`);
			}
		}

		// Execute request with timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(url, {
				method: options.method,
				headers,
				body,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			// Read response body
			const responseText = await response.text();
			let data: T;

			try {
				data = responseText ? JSON.parse(responseText) : ({} as T);
			} catch {
				// If not valid JSON, wrap as string
				data = responseText as unknown as T;
			}

			// Debug response
			if (this.debug) {
				console.error(`DEBUG: Response status: ${response.status}`);
			}

			// Convert headers to record
			const responseHeaders: Record<string, string> = {};
			response.headers.forEach((value, key) => {
				responseHeaders[key] = value;
			});

			const result: APIResponse<T> = {
				statusCode: response.status,
				data,
				headers: responseHeaders,
				ok: response.ok,
			};

			// Throw error for non-2xx responses
			if (!response.ok) {
				const errorResponse = data as unknown as APIErrorResponse;
				throw new APIError(
					errorResponse.message ?? `HTTP ${response.status}`,
					response.status,
					errorResponse,
					`${options.method} ${options.path}`,
				);
			}

			return result;
		} catch (error) {
			clearTimeout(timeoutId);

			// Re-throw APIError as-is
			if (error instanceof APIError) {
				throw error;
			}

			// Handle abort/timeout
			if (error instanceof Error && error.name === "AbortError") {
				throw new APIError(
					`Request timed out after ${this.timeout}ms`,
					0,
					undefined,
					`${options.method} ${options.path}`,
				);
			}

			// Handle network errors
			if (error instanceof Error) {
				throw new APIError(
					`Network error: ${error.message}`,
					0,
					undefined,
					`${options.method} ${options.path}`,
				);
			}

			throw error;
		}
	}

	/**
	 * GET request
	 */
	async get<T = unknown>(
		path: string,
		query?: Record<string, string>,
	): Promise<APIResponse<T>> {
		const options: APIRequestOptions = {
			method: "GET",
			path,
		};
		if (query) {
			options.query = query;
		}
		return this.request<T>(options);
	}

	/**
	 * POST request
	 */
	async post<T = unknown>(
		path: string,
		body?: Record<string, unknown>,
	): Promise<APIResponse<T>> {
		const options: APIRequestOptions = {
			method: "POST",
			path,
		};
		if (body) {
			options.body = body;
		}
		return this.request<T>(options);
	}

	/**
	 * PUT request
	 */
	async put<T = unknown>(
		path: string,
		body?: Record<string, unknown>,
	): Promise<APIResponse<T>> {
		const options: APIRequestOptions = {
			method: "PUT",
			path,
		};
		if (body) {
			options.body = body;
		}
		return this.request<T>(options);
	}

	/**
	 * DELETE request
	 */
	async delete<T = unknown>(path: string): Promise<APIResponse<T>> {
		return this.request<T>({
			method: "DELETE",
			path,
		});
	}

	/**
	 * PATCH request
	 */
	async patch<T = unknown>(
		path: string,
		body?: Record<string, unknown>,
	): Promise<APIResponse<T>> {
		const options: APIRequestOptions = {
			method: "PATCH",
			path,
		};
		if (body) {
			options.body = body;
		}
		return this.request<T>(options);
	}
}

/**
 * Create an API client from environment variables
 */
export function createClientFromEnv(
	envPrefix: string = "F5XC",
): APIClient | null {
	const serverUrl = process.env[`${envPrefix}_API_URL`];
	const apiToken = process.env[`${envPrefix}_API_TOKEN`] ?? "";

	if (!serverUrl) {
		return null;
	}

	const config: APIClientConfig = {
		serverUrl,
		debug: process.env[`${envPrefix}_DEBUG`] === "true",
	};

	if (apiToken) {
		config.apiToken = apiToken;
	}

	return new APIClient(config);
}

/**
 * Build API path for a domain resource
 */
export function buildResourcePath(
	domain: string,
	resource: string,
	action: string,
	namespace?: string,
	name?: string,
): string {
	// Standard F5 XC API path pattern:
	// /api/web/namespaces/{namespace}/{resource}
	// /api/web/namespaces/{namespace}/{resource}/{name}
	// /api/config/namespaces/{namespace}/{resource}
	// etc.

	let path = `/api/${domain}`;

	if (namespace) {
		path += `/namespaces/${namespace}`;
	}

	path += `/${resource}`;

	if (name) {
		path += `/${name}`;
	}

	// Handle specific actions that modify the path
	if (action && action !== "list" && action !== "get") {
		// Some actions like "create" are POST to base path
		// Others like "delete" or specific actions may need different handling
	}

	return path;
}

// Re-export types
export type { APIClientConfig, APIRequestOptions, APIResponse, HTTPMethod };
export { APIError };
