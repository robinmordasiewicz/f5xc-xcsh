/**
 * Integration tests for CLI execution
 *
 * These tests verify that the CLI commands work correctly when
 * executed from the command line.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { execSync, spawn } from "child_process";
import { existsSync } from "fs";
import { resolve } from "path";

// Helper to check if CLI is built
function isCLIBuilt(): boolean {
	const cliPath = resolve(process.cwd(), "dist/cli.js");
	return existsSync(cliPath);
}

// Helper to run CLI command
function runCLI(args: string[]): { stdout: string; stderr: string; exitCode: number } {
	const cliPath = resolve(process.cwd(), "dist/cli.js");
	try {
		const result = execSync(`node ${cliPath} ${args.join(" ")}`, {
			encoding: "utf-8",
			timeout: 30000,
			env: { ...process.env, FORCE_COLOR: "0" },
		});
		return { stdout: result, stderr: "", exitCode: 0 };
	} catch (error: unknown) {
		const execError = error as { stdout?: string; stderr?: string; status?: number };
		return {
			stdout: execError.stdout ?? "",
			stderr: execError.stderr ?? "",
			exitCode: execError.status ?? 1,
		};
	}
}

// Helper to check if integration environment is configured
function getIntegrationConfig():
	| { apiUrl: string; apiToken: string }
	| undefined {
	const apiUrl = process.env.F5XC_API_URL;
	const apiToken = process.env.F5XC_API_TOKEN;

	if (!apiUrl || !apiToken) {
		return undefined;
	}

	return { apiUrl, apiToken };
}

// Skip CLI tests if not built
const cliBuilt = isCLIBuilt();
const describeIf = cliBuilt ? describe : describe.skip;
const config = getIntegrationConfig();

describeIf("CLI Integration Tests", () => {
	describe("Version Command", () => {
		it("should display version information", () => {
			const result = runCLI(["--version"]);

			// Version should be in either stdout or output
			expect(result.stdout + result.stderr).toMatch(/\d+\.\d+\.\d+/);
		});
	});

	describe("Help Command", () => {
		it("should display help information", () => {
			const result = runCLI(["--help"]);

			expect(result.exitCode).toBe(0);
			expect(result.stdout).toContain("xcsh");
		});
	});

	describe("Invalid Command Handling", () => {
		it("should return error for unknown command", () => {
			const result = runCLI(["nonexistent-command-12345"]);

			// Should have non-zero exit code or error message
			expect(result.exitCode !== 0 || result.stderr !== "").toBe(true);
		});
	});
});

// API-dependent tests - only run if environment is configured
const describeApi = config && cliBuilt ? describe : describe.skip;

describeApi("CLI API Integration Tests", () => {
	describe("Login Command", () => {
		it("should show login options", () => {
			const result = runCLI(["login", "--help"]);

			// Just verify the command exists and can show help
			expect(result.stdout + result.stderr).toBeTruthy();
		});
	});

	describe("Profile Commands", () => {
		it("should show profile help", () => {
			const result = runCLI(["profile", "--help"]);

			expect(result.stdout + result.stderr).toBeTruthy();
		});
	});
});
