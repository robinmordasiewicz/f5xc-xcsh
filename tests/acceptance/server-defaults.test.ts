/**
 * Server Default Value Display Tests
 *
 * Tests that server defaults from the OpenAPI spec are properly displayed
 * in completion hints for creation flags.
 *
 * Background: The upstream f5xc-api-enriched spec provides server defaults
 * via the `default` field and `x-f5xc-server-default: true` marker.
 *
 * These tests verify that:
 * 1. Optional flags with server defaults show "(server default: value)" in descriptions
 * 2. Required flags don't show defaults (since users must provide values anyway)
 * 3. The jitter-percent flag correctly shows its server default of 0
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

describe("Server Default Value Display", () => {
	let session: REPLSession;
	let completer: Completer;

	beforeEach(() => {
		session = createTestSession({ authenticated: true });
		completer = createTestCompleter(session);
	});

	afterEach(() => {
		cleanupTestEnvironment();
	});

	describe("Healthcheck Server Defaults", () => {
		it("shows client default for jitter-percent flag", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			const jitterFlag = suggestions.find(
				(s) => s.text === "--jitter-percent",
			);
			expect(jitterFlag).toBeDefined();
			expect(jitterFlag?.description).toContain("default: 30");
		});

		it("jitter-percent flag is optional, not required", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			const jitterFlag = suggestions.find(
				(s) => s.text === "--jitter-percent",
			);
			expect(jitterFlag).toBeDefined();
			// Should NOT contain "required" since it has a server default
			expect(jitterFlag?.description).not.toContain("required");
		});

		it("required flags do not show server defaults", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			// These flags are required per spec (x-f5xc-required-for.create: true)
			const requiredFlags = ["--name", "--type"];

			for (const flagName of requiredFlags) {
				const flag = suggestions.find((s) => s.text === flagName);
				expect(flag).toBeDefined();
				expect(flag?.description).toContain("required");
				// Required flags should NOT show defaults since users must provide them
				expect(flag?.description).not.toContain("server default");
				expect(flag?.description).not.toContain("default:");
			}

			// These flags now have client-side defaults
			const defaultFlags = {
				"--interval": "default: 15",
				"--timeout": "default: 3",
				"--jitter-percent": "default: 30",
			};

			for (const [flagName, expectedDefault] of Object.entries(defaultFlags)) {
				const flag = suggestions.find((s) => s.text === flagName);
				expect(flag).toBeDefined();
				expect(flag?.description).toContain(expectedDefault);
				expect(flag?.description).not.toContain("required");
			}
		});

		it("jitter-percent appears in alphabetical order with other optional flags", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			const result = suggestions.map((s) => s.text);
			const jitterIndex = result.indexOf("--jitter-percent");

			// Should be present
			expect(jitterIndex).toBeGreaterThan(-1);

			// Should appear after required flags (which are sorted first)
			const nameIndex = result.indexOf("--name");
			expect(jitterIndex).toBeGreaterThan(nameIndex);
		});
	});

	describe("Flag Description Format", () => {
		it("formats client default values correctly in descriptions", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			const jitterFlag = suggestions.find(
				(s) => s.text === "--jitter-percent",
			);
			expect(jitterFlag).toBeDefined();

			// Should include the flag's description and the default value
			expect(jitterFlag?.description).toMatch(
				/.*\(default: 30\)$/,
			);
		});

		it("preserves original description when showing defaults", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck ",
			);

			const jitterFlag = suggestions.find(
				(s) => s.text === "--jitter-percent",
			);
			expect(jitterFlag).toBeDefined();

			// Should still contain the original description text
			expect(jitterFlag?.description).toContain("jitter");
			// And the default value
			expect(jitterFlag?.description).toContain("default: 30");
		});
	});

	describe("Flags Without Defaults", () => {
		it("optional flags without defaults don't show default hint", async () => {
			const suggestions = await completer.complete(
				"/virtual create healthcheck --type http ",
			);

			// HTTP-specific optional flags that don't have server defaults
			const optionalFlags = ["--path", "--host-header"];

			for (const flagName of optionalFlags) {
				const flag = suggestions.find((s) => s.text === flagName);
				expect(flag).toBeDefined();
				// Should NOT be marked as required
				expect(flag?.description).not.toContain("required");
				// Should NOT show default values
				expect(flag?.description).not.toContain("server default");
				expect(flag?.description).not.toContain("default:");
			}
		});
	});

	describe("Apply Action Client Defaults", () => {
		it("shows client defaults for apply action as well", async () => {
			const suggestions = await completer.complete(
				"/virtual apply healthcheck ",
			);

			const jitterFlag = suggestions.find(
				(s) => s.text === "--jitter-percent",
			);
			expect(jitterFlag).toBeDefined();
			expect(jitterFlag?.description).toContain("default: 30");
		});
	});
});
