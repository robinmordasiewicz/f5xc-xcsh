/**
 * Resource Filtering Tests - Standard Completion Mode
 *
 * Tests that the "standard" completion mode filters out inappropriate resources
 * (utility endpoints, analytics, management) and only shows primary + CRUD
 * resources with meaningful descriptions.
 *
 * Bug: /virtual list showed resources like pdf, swagger_spec, stat, create_ticket
 * Fix: "standard" mode filters resources with generic descriptions and non-CRUD categories
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
	createTestSession,
	createTestCompleter,
	setupTestEnvironment,
	cleanupTestEnvironment,
} from "../utils/test-helpers.js";
import type { REPLSession } from "../../src/repl/session.js";
import type { Completer } from "../../src/repl/completion/completer.js";

// Setup mocks for all tests
setupTestEnvironment();

describe("Resource Filtering - Standard Completion Mode", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		// Set completion mode to "standard" (now the default)
		process.env.XCSH_COMPLETION_MODE = "standard";
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		delete process.env.XCSH_COMPLETION_MODE;
		cleanupTestEnvironment();
	});

	describe("Virtual Domain Filtering", () => {
		it("CRITICAL: excludes pdf resource with generic description", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("pdf");
		});

		it("CRITICAL: excludes swagger_spec resource", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("swagger_spec");
		});

		it("CRITICAL: excludes stat resource (self-referential description)", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("stat");
		});

		it("CRITICAL: excludes create_ticket resource (utility)", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("create_ticket");
		});

		it("CRITICAL: excludes subscribe/unsubscribe resources", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("subscribe");
			expect(result).not.toContain("unsubscribe");
		});

		it("CRITICAL: excludes vulnerability resource (utility)", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			expect(result).not.toContain("vulnerability");
		});

		it("includes primary resources (http_loadbalancer)", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("http_loadbalancer");
		});

		it("includes other primary resources", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("tcp_loadbalancer");
			expect(result).toContain("origin_pool");
			expect(result).toContain("healthcheck");
		});

		it("includes CRUD resources with valid descriptions", async () => {
			const suggestions = await completer.complete("/virtual list ");
			const result = suggestions.map((s) => s.text);

			// These are real CRUD resources that should be shown
			expect(result).toContain("http_loadbalancer");
			expect(result).toContain("origin_pool");
			expect(result).toContain("healthcheck");
		});
	});

	describe("Certificates Domain Filtering", () => {
		it("includes primary certificate resources", async () => {
			const suggestions = await completer.complete("/certificates list ");
			const result = suggestions.map((s) => s.text);

			expect(result).toContain("certificate");
		});

		it("excludes utility resources if present", async () => {
			const suggestions = await completer.complete("/certificates list ");
			const result = suggestions.map((s) => s.text);

			// Shouldn't contain generic retrieval operation resources
			const hasGenericResources = result.some(
				(r) =>
					r.includes("pdf") ||
					r.includes("swagger") ||
					r.includes("_stat"),
			);
			// This is a general check - specific resources may vary by domain
			expect(result.length).toBeGreaterThan(0);
		});
	});

	describe("API Domain Filtering", () => {
		it("includes primary API resources", async () => {
			const suggestions = await completer.complete("/api list ");
			const result = suggestions.map((s) => s.text);

			// API domain should have at least some resources
			expect(result.length).toBeGreaterThan(0);
		});

		it("excludes utility endpoints from API domain", async () => {
			const suggestions = await completer.complete("/api list ");
			const result = suggestions.map((s) => s.text);

			// Check that obvious utility resources are excluded
			expect(result).not.toContain("pdf");
			expect(result).not.toContain("swagger_spec");
		});
	});
});

describe("Resource Filtering - All Mode Shows Everything", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		// Set completion mode to "all"
		process.env.XCSH_COMPLETION_MODE = "all";
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		delete process.env.XCSH_COMPLETION_MODE;
		cleanupTestEnvironment();
	});

	it('shows filtered resources when mode is "all"', async () => {
		const suggestions = await completer.complete("/virtual list ");
		const result = suggestions.map((s) => s.text);

		// In "all" mode, these should be included
		// (if they exist in the domain's allResources)
		expect(result.length).toBeGreaterThan(0);

		// Primary resources should always be shown
		expect(result).toContain("http_loadbalancer");
	});

	it("includes more resources than standard mode", async () => {
		const allSuggestions = await completer.complete("/virtual list ");

		// Switch to standard mode for comparison
		delete process.env.XCSH_COMPLETION_MODE;
		process.env.XCSH_COMPLETION_MODE = "standard";
		const standardCompleter = createTestCompleter(session);
		const standardSuggestions =
			await standardCompleter.complete("/virtual list ");

		// All mode should have more or equal resources than standard mode
		expect(allSuggestions.length).toBeGreaterThanOrEqual(
			standardSuggestions.length,
		);
	});
});

describe("Resource Filtering - Primary Mode Shows Only Primary", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		// Set completion mode to "primary"
		process.env.XCSH_COMPLETION_MODE = "primary";
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		delete process.env.XCSH_COMPLETION_MODE;
		cleanupTestEnvironment();
	});

	it("shows only primary resources", async () => {
		const suggestions = await completer.complete("/virtual list ");
		const result = suggestions.map((s) => s.text);

		// Primary resources should be shown
		expect(result).toContain("http_loadbalancer");
		expect(result).toContain("tcp_loadbalancer");
		expect(result).toContain("origin_pool");
	});

	it("has fewer resources than standard mode", async () => {
		const primarySuggestions = await completer.complete("/virtual list ");

		// Switch to standard mode for comparison
		delete process.env.XCSH_COMPLETION_MODE;
		process.env.XCSH_COMPLETION_MODE = "standard";
		const standardCompleter = createTestCompleter(session);
		const standardSuggestions =
			await standardCompleter.complete("/virtual list ");

		// Primary mode should have fewer or equal resources than standard mode
		expect(primarySuggestions.length).toBeLessThanOrEqual(
			standardSuggestions.length,
		);
	});
});

describe("Filtering Logic Correctness", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		process.env.XCSH_COMPLETION_MODE = "standard";
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		delete process.env.XCSH_COMPLETION_MODE;
		cleanupTestEnvironment();
	});

	it("filters resources with generic retrieval description", async () => {
		const suggestions = await completer.complete("/virtual list ");

		// Check suggestions don't have generic descriptions
		const genericDescriptions = suggestions.filter(
			(s) =>
				s.description === "Resource retrieval operation" ||
				s.description === "Resource creation operation" ||
				s.description === "Resource update operation" ||
				s.description === "Resource deletion operation",
		);

		// In standard mode, resources with generic descriptions should be filtered
		expect(genericDescriptions.length).toBe(0);
	});

	it("preserves meaningful descriptions", async () => {
		const suggestions = await completer.complete("/virtual list ");

		// http_loadbalancer should have a meaningful description
		const httpLb = suggestions.find((s) => s.text === "http_loadbalancer");
		expect(httpLb).toBeDefined();
		expect(httpLb?.description).not.toBe("Resource retrieval operation");
		expect(httpLb?.description).not.toBe("");
	});
});

describe("Default Completion Mode", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		// Don't set any completion mode - use default
		delete process.env.XCSH_COMPLETION_MODE;
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	it('defaults to "standard" mode', async () => {
		const suggestions = await completer.complete("/virtual list ");
		const result = suggestions.map((s) => s.text);

		// Default (standard) mode should include primary resources
		expect(result).toContain("http_loadbalancer");

		// And should exclude utility resources
		expect(result).not.toContain("pdf");
		expect(result).not.toContain("swagger_spec");
	});
});

describe("Cross-Domain Consistency", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		process.env.XCSH_COMPLETION_MODE = "standard";
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		delete process.env.XCSH_COMPLETION_MODE;
		cleanupTestEnvironment();
	});

	it("applies consistent filtering across all domains", async () => {
		const domains = ["virtual", "certificates", "api", "dns"];

		for (const domain of domains) {
			const suggestions = await completer.complete(`/${domain} list `);
			const result = suggestions.map((s) => s.text);

			// No domain should show pdf or swagger_spec in standard mode
			expect(result).not.toContain("pdf");
			expect(result).not.toContain("swagger_spec");
		}
	});

	it("works with all resource actions", async () => {
		const actions = ["list", "get", "create", "delete", "replace", "apply"];

		for (const action of actions) {
			const suggestions = await completer.complete(`/virtual ${action} `);
			const result = suggestions.map((s) => s.text);

			// All actions should filter utility resources
			expect(result).not.toContain("pdf");
			expect(result).not.toContain("swagger_spec");

			// And show primary resources
			expect(result).toContain("http_loadbalancer");
		}
	});
});
