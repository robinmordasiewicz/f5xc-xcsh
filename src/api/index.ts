/**
 * API Module
 * Exports for F5 XC API client
 */

export { APIClient, createClientFromEnv, buildResourcePath } from "./client.js";
export type {
	APIClientConfig,
	APIRequestOptions,
	APIResponse,
	HTTPMethod,
} from "./client.js";
export { APIError } from "./types.js";
export type {
	APIErrorResponse,
	ListResponse,
	ResourceMetadata,
	Resource,
} from "./types.js";
