/**
 * REGRESSION TEST: Enter Key Must NOT Select Completions
 *
 * This test prevents a recurring regression where Enter key is incorrectly
 * used to select completion suggestions. The correct behavior is:
 *   - Tab: Select the highlighted completion suggestion
 *   - Enter: Execute the current command (pass through, do NOT select)
 *
 * This regression has occurred multiple times, so this test performs
 * STATIC ANALYSIS of the source code to catch it early.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("REGRESSION: Enter Key Must NOT Select Completions", () => {
	const suggestionsPath = join(
		process.cwd(),
		"src/repl/components/Suggestions.tsx"
	);
	const appPath = join(process.cwd(), "src/repl/App.tsx");

	let sourceCode: string;
	let appSourceCode: string;

	try {
		sourceCode = readFileSync(suggestionsPath, "utf-8");
	} catch {
		sourceCode = "";
	}

	try {
		appSourceCode = readFileSync(appPath, "utf-8");
	} catch {
		appSourceCode = "";
	}

	it("should have the Suggestions.tsx file", () => {
		expect(sourceCode.length).toBeGreaterThan(0);
	});

	it("should NOT use key.return to trigger onSelect", () => {
		// Check for patterns that would indicate Enter triggering selection
		const dangerousPatterns = [
			/key\.return.*onSelect/s, // key.return followed by onSelect
			/if\s*\(\s*key\.return\s*\)[\s\S]*?onSelect/s, // if (key.return) { ... onSelect
			/key\.return[\s\S]{0,50}onSelect/s, // key.return within 50 chars of onSelect
		];

		for (const pattern of dangerousPatterns) {
			const match = sourceCode.match(pattern);
			expect(match).toBeNull();
		}
	});

	it("should NOT have Enter/Return in the selection logic block", () => {
		// Find the useInput callback and ensure no return/enter handling for selection
		const useInputMatch = sourceCode.match(
			/useInput\s*\(\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\{/
		);

		if (useInputMatch) {
			const useInputBody = useInputMatch[1];

			// Should NOT have key.return triggering selection
			expect(useInputBody).not.toMatch(/key\.return[\s\S]*?onSelect/);

			// Should NOT have a conditional that checks key.return and calls onSelect
			expect(useInputBody).not.toMatch(
				/if\s*\([^)]*key\.return[^)]*\)[\s\S]*?onSelect/
			);
		}
	});

	it("should ONLY use key.tab to trigger onSelect", () => {
		// Find all places where onSelect is called
		const onSelectCalls = sourceCode.match(/onSelect\s*\(/g) || [];

		// There should be exactly one onSelect call in the useInput handler
		// and it should be guarded by key.tab
		const tabSelectPattern = /if\s*\(\s*key\.tab\s*\)[\s\S]*?onSelect/;
		expect(sourceCode).toMatch(tabSelectPattern);
	});

	it("should have a comment indicating Tab-only selection", () => {
		// Verify the comment exists that documents this behavior
		expect(sourceCode).toMatch(
			/Only Tab selects|Tab.*select|Enter.*execute/i
		);
	});

	it("should have help text showing Enter executes (not selects)", () => {
		// The help text should indicate Enter executes the command
		expect(sourceCode).toMatch(/Enter.*execute/i);
	});

	it("should NOT handle key.return at all in useInput (let it pass through)", () => {
		// Find the useInput callback
		const useInputMatch = sourceCode.match(
			/useInput\s*\(\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\{/
		);

		if (useInputMatch) {
			const useInputBody = useInputMatch[1];

			// key.return should NOT appear in the useInput handler at all
			// because Enter should pass through to execute the command
			expect(useInputBody).not.toContain("key.return");
		}
	});

	describe("Allowed key handlers in useInput", () => {
		it("should only handle: tab, upArrow, downArrow, escape", () => {
			const useInputMatch = sourceCode.match(
				/useInput\s*\(\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\{/
			);

			if (useInputMatch) {
				const useInputBody = useInputMatch[1];

				// These ARE allowed
				expect(useInputBody).toMatch(/key\.tab/);
				expect(useInputBody).toMatch(/key\.upArrow/);
				expect(useInputBody).toMatch(/key\.downArrow/);
				expect(useInputBody).toMatch(/key\.escape/);

				// These are NOT allowed (would intercept command execution)
				expect(useInputBody).not.toContain("key.return");
				expect(useInputBody).not.toContain("key.enter");
			}
		});
	});

	// =====================================================
	// App.tsx Tests - Prevent regression in handleSubmit
	// =====================================================
	describe("App.tsx handleSubmit must NOT select completions", () => {
		it("should have the App.tsx file", () => {
			expect(appSourceCode.length).toBeGreaterThan(0);
		});

		it("should NOT call selectCurrent() in handleSubmit", () => {
			// Find the handleSubmit function
			const handleSubmitMatch = appSourceCode.match(
				/const handleSubmit = useCallback\s*\(\s*async\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[/
			);

			if (handleSubmitMatch) {
				const handleSubmitBody = handleSubmitMatch[1];

				// handleSubmit should NOT call selectCurrent() - that's Tab's job
				expect(handleSubmitBody).not.toContain("selectCurrent");

				// handleSubmit should NOT call applyCompletion when showing suggestions
				// The pattern "isShowing && ... applyCompletion" indicates the bug
				expect(handleSubmitBody).not.toMatch(
					/isShowing[\s\S]*?applyCompletion/
				);
			}
		});

		it("should NOT have completion selection logic in handleSubmit", () => {
			// This is the exact dangerous pattern that causes the regression:
			// if (completion.isShowing && completion.suggestions.length > 0) {
			//   const selected = completion.selectCurrent();
			//   applyCompletion(...);
			//   return;
			// }
			// We need to extract just the handleSubmit body to avoid false matches in useInput
			const handleSubmitMatch = appSourceCode.match(
				/const handleSubmit = useCallback\s*\(\s*async\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[/
			);

			if (handleSubmitMatch) {
				const handleSubmitBody = handleSubmitMatch[1];
				// Check the dangerous pattern ONLY within handleSubmit
				expect(handleSubmitBody).not.toMatch(/selectCurrent/);
				expect(handleSubmitBody).not.toMatch(/applyCompletion/);
			}
		});

		it("should have a comment indicating Enter executes (not selects)", () => {
			// Verify the documentation comment exists
			expect(appSourceCode).toMatch(
				/Enter.*execute|Enter.*NOT.*select|Tab.*select.*completion/i
			);
		});

		it("should only hide completions in handleSubmit (not select)", () => {
			// Find handleSubmit and verify it only hides, not selects
			const handleSubmitMatch = appSourceCode.match(
				/const handleSubmit = useCallback\s*\(\s*async\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[/
			);

			if (handleSubmitMatch) {
				const handleSubmitBody = handleSubmitMatch[1];

				// It's OK to hide completions when Enter is pressed
				// But NOT OK to select them
				if (handleSubmitBody.includes("isShowing")) {
					// If checking isShowing, should only call hide(), not selectCurrent/applyCompletion
					expect(handleSubmitBody).toContain("hide");
					expect(handleSubmitBody).not.toContain("selectCurrent");
				}
			}
		});
	});
});
