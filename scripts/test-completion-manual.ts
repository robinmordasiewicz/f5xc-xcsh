#!/usr/bin/env tsx
/**
 * Manual Completion Testing Script
 *
 * This script programmatically tests the completion behavior
 * to validate the RESOURCE_ACTIONS fix.
 *
 * Tests the 8 manual test scenarios from the plan:
 * 1. /virtual create<TAB> → should show resources, not verbs
 * 2. /virtual replace<TAB> → should show resources
 * 3. /virtual patch<TAB> → should show resources
 * 4. /virtual apply<TAB> → should show resources
 * 5. /certificates create<TAB> → should show certificate resources
 * 6. /api create<TAB> → should show API resources
 * 7. /virtual<TAB> → should still show verbs initially
 * 8. Complete flow end-to-end
 */

import { Completer } from "../src/repl/completion/completer.js";
import { REPLSession } from "../src/repl/session.js";
import type { SessionConfig } from "../src/repl/session.js";

// ANSI color codes for output
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";

interface TestResult {
	name: string;
	passed: boolean;
	details: string;
	suggestions?: string[];
}

const results: TestResult[] = [];

function log(message: string, color = RESET) {
	console.log(`${color}${message}${RESET}`);
}

function logTest(testNumber: number, description: string) {
	log(`\n${BOLD}Test ${testNumber}: ${description}${RESET}`, BLUE);
}

function logPass(message: string) {
	log(`  ✓ ${message}`, GREEN);
}

function logFail(message: string) {
	log(`  ✗ ${message}`, RED);
}

function logInfo(message: string) {
	log(`    ${message}`, YELLOW);
}

async function runTests() {
	log(`\n${BOLD}=== Manual Completion Testing ===${RESET}`, BLUE);
	log("Testing RESOURCE_ACTIONS fix programmatically\n");

	// Create test session config (minimal setup for testing)
	const config: SessionConfig = {
		namespace: "test-namespace",
	};

	const session = new REPLSession(config);
	const completer = new Completer();
	completer.setSession(session);

	try {
		// Test 1: /virtual create<TAB> → should show resources, not verbs
		logTest(1, "/virtual create<TAB> → should show resources, not verbs (PRIMARY FIX)");
		{
			const suggestions = await completer.complete("/virtual create ");
			const texts = suggestions.map((s) => s.text);
			const hasResources =
				texts.includes("http_loadbalancer") ||
				texts.includes("tcp_loadbalancer") ||
				texts.includes("origin_pool");
			const hasVerbs =
				texts.includes("list") ||
				texts.includes("get") ||
				texts.includes("create") ||
				texts.includes("delete");

			if (hasResources && !hasVerbs) {
				logPass("✓ Shows resources: " + texts.slice(0, 5).join(", "));
				logPass("✓ Does NOT show verbs");
				results.push({
					name: "Test 1: /virtual create<TAB>",
					passed: true,
					details: "Shows resources, not verbs",
					suggestions: texts,
				});
			} else {
				logFail(
					`Expected resources without verbs, got: ${texts.slice(0, 5).join(", ")}`,
				);
				results.push({
					name: "Test 1: /virtual create<TAB>",
					passed: false,
					details: `Has resources: ${hasResources}, Has verbs: ${hasVerbs}`,
					suggestions: texts,
				});
			}
		}

		// Test 2: /virtual replace<TAB> → should show resources
		logTest(2, "/virtual replace<TAB> → should show resources");
		{
			const suggestions = await completer.complete("/virtual replace ");
			const texts = suggestions.map((s) => s.text);
			const hasResources = texts.includes("http_loadbalancer");
			const hasVerbs = texts.includes("replace") || texts.includes("list");

			if (hasResources && !hasVerbs) {
				logPass("✓ Shows resources: " + texts.slice(0, 5).join(", "));
				results.push({
					name: "Test 2: /virtual replace<TAB>",
					passed: true,
					details: "Shows resources",
					suggestions: texts,
				});
			} else {
				logFail("Expected resources without verbs");
				results.push({
					name: "Test 2: /virtual replace<TAB>",
					passed: false,
					details: `Has resources: ${hasResources}, Has verbs: ${hasVerbs}`,
					suggestions: texts,
				});
			}
		}

		// Test 3: /virtual patch<TAB> → should show resources
		logTest(3, "/virtual patch<TAB> → should show resources");
		{
			const suggestions = await completer.complete("/virtual patch ");
			const texts = suggestions.map((s) => s.text);
			const hasResources = texts.includes("http_loadbalancer");
			const hasVerbs = texts.includes("patch") || texts.includes("delete");

			if (hasResources && !hasVerbs) {
				logPass("✓ Shows resources: " + texts.slice(0, 5).join(", "));
				results.push({
					name: "Test 3: /virtual patch<TAB>",
					passed: true,
					details: "Shows resources",
					suggestions: texts,
				});
			} else {
				logFail("Expected resources without verbs");
				results.push({
					name: "Test 3: /virtual patch<TAB>",
					passed: false,
					details: `Has resources: ${hasResources}, Has verbs: ${hasVerbs}`,
					suggestions: texts,
				});
			}
		}

		// Test 4: /virtual apply<TAB> → should show resources
		logTest(4, "/virtual apply<TAB> → should show resources");
		{
			const suggestions = await completer.complete("/virtual apply ");
			const texts = suggestions.map((s) => s.text);
			const hasResources = texts.includes("http_loadbalancer");
			const hasVerbs = texts.includes("apply") || texts.includes("status");

			if (hasResources && !hasVerbs) {
				logPass("✓ Shows resources: " + texts.slice(0, 5).join(", "));
				results.push({
					name: "Test 4: /virtual apply<TAB>",
					passed: true,
					details: "Shows resources",
					suggestions: texts,
				});
			} else {
				logFail("Expected resources without verbs");
				results.push({
					name: "Test 4: /virtual apply<TAB>",
					passed: false,
					details: `Has resources: ${hasResources}, Has verbs: ${hasVerbs}`,
					suggestions: texts,
				});
			}
		}

		// Test 5: /certificates create<TAB> → should show certificate resources
		logTest(5, "/certificates create<TAB> → should show certificate resources");
		{
			const suggestions = await completer.complete("/certificates create ");
			const texts = suggestions.map((s) => s.text);
			const hasResources = texts.includes("certificate") || texts.length > 0;
			const hasVerbs = texts.includes("create") || texts.includes("list");

			if (hasResources && !hasVerbs) {
				logPass("✓ Shows certificate resources: " + texts.slice(0, 5).join(", "));
				results.push({
					name: "Test 5: /certificates create<TAB>",
					passed: true,
					details: "Shows certificate resources",
					suggestions: texts,
				});
			} else {
				logFail("Expected certificate resources without verbs");
				results.push({
					name: "Test 5: /certificates create<TAB>",
					passed: false,
					details: `Has resources: ${hasResources}, Has verbs: ${hasVerbs}`,
					suggestions: texts,
				});
			}
		}

		// Test 6: /api create<TAB> → should show API resources
		logTest(6, "/api create<TAB> → should show API resources");
		{
			const suggestions = await completer.complete("/api create ");
			const texts = suggestions.map((s) => s.text);
			const hasResources = texts.length > 0;
			const hasVerbs =
				texts.includes("create") ||
				texts.includes("list") ||
				texts.includes("delete");

			if (hasResources && !hasVerbs) {
				logPass("✓ Shows API resources: " + texts.slice(0, 5).join(", "));
				results.push({
					name: "Test 6: /api create<TAB>",
					passed: true,
					details: "Shows API resources",
					suggestions: texts,
				});
			} else {
				logFail("Expected API resources without verbs");
				results.push({
					name: "Test 6: /api create<TAB>",
					passed: false,
					details: `Has resources: ${hasResources}, Has verbs: ${hasVerbs}`,
					suggestions: texts,
				});
			}
		}

		// Test 7: /virtual<TAB> → should still show verbs initially
		logTest(7, "/virtual<TAB> → should still show verbs initially (REGRESSION TEST)");
		{
			const suggestions = await completer.complete("/virtual ");
			const texts = suggestions.map((s) => s.text);
			const hasVerbs =
				texts.includes("list") &&
				texts.includes("get") &&
				texts.includes("create") &&
				texts.includes("delete");
			const hasResources =
				texts.includes("http_loadbalancer") || texts.includes("origin_pool");

			if (hasVerbs && !hasResources) {
				logPass("✓ Shows verbs: " + texts.slice(0, 8).join(", "));
				logPass("✓ Does NOT show resources");
				results.push({
					name: "Test 7: /virtual<TAB>",
					passed: true,
					details: "Shows verbs, not resources",
					suggestions: texts,
				});
			} else {
				logFail("Expected verbs without resources");
				results.push({
					name: "Test 7: /virtual<TAB>",
					passed: false,
					details: `Has verbs: ${hasVerbs}, Has resources: ${hasResources}`,
					suggestions: texts,
				});
			}
		}

		// Test 8: Complete flow end-to-end
		logTest(8, "Complete flow: domain → verb → resource");
		{
			let testPassed = true;
			let details = "";

			// Step 1: /virtual<TAB> → verbs
			const step1Suggestions = await completer.complete("/virtual ");
			const step1 = step1Suggestions.map((s) => s.text);
			const step1HasVerbs = step1.includes("create") && step1.includes("list");
			const step1HasResources = step1.includes("http_loadbalancer");

			if (step1HasVerbs && !step1HasResources) {
				logPass("✓ Step 1: Shows verbs");
				logInfo("Verbs: " + step1.slice(0, 6).join(", "));
			} else {
				logFail("Step 1: Expected verbs only");
				testPassed = false;
				details += "Step 1 failed; ";
			}

			// Step 2: /virtual create<TAB> → resources
			const step2Suggestions = await completer.complete("/virtual create ");
			const step2 = step2Suggestions.map((s) => s.text);
			const step2HasResources = step2.includes("http_loadbalancer");
			const step2HasVerbs = step2.includes("create") || step2.includes("list");

			if (step2HasResources && !step2HasVerbs) {
				logPass("✓ Step 2: Shows resources");
				logInfo("Resources: " + step2.slice(0, 5).join(", "));
			} else {
				logFail("Step 2: Expected resources only");
				testPassed = false;
				details += "Step 2 failed; ";
			}

			// Step 3: /virtual create http<TAB> → filtered resources
			const step3Suggestions = await completer.complete("/virtual create http");
			const step3 = step3Suggestions.map((s) => s.text);
			const step3HasHttp = step3.includes("http_loadbalancer");
			const step3HasTcp = step3.includes("tcp_loadbalancer");

			if (step3HasHttp && !step3HasTcp) {
				logPass("✓ Step 3: Shows filtered resources (http only)");
				logInfo("Filtered: " + step3.join(", "));
			} else {
				logFail("Step 3: Expected only http resources");
				testPassed = false;
				details += "Step 3 failed";
			}

			results.push({
				name: "Test 8: Complete flow",
				passed: testPassed,
				details: testPassed ? "All 3 steps passed" : details,
			});
		}

		// Print summary
		log(`\n${BOLD}=== Test Summary ===${RESET}`, BLUE);
		const passedCount = results.filter((r) => r.passed).length;
		const failedCount = results.filter((r) => !r.passed).length;

		log(`\nTotal Tests: ${results.length}`);
		log(`Passed: ${passedCount}`, passedCount === results.length ? GREEN : RESET);
		if (failedCount > 0) {
			log(`Failed: ${failedCount}`, RED);
			log("\nFailed Tests:", RED);
			results
				.filter((r) => !r.passed)
				.forEach((r) => {
					log(`  - ${r.name}: ${r.details}`, RED);
				});
		}

		if (passedCount === results.length) {
			log(
				`\n${BOLD}${GREEN}✓✓✓ All manual tests passed! ✓✓✓${RESET}`,
				GREEN,
			);
			log(`${GREEN}The RESOURCE_ACTIONS fix is working correctly.${RESET}`, GREEN);
			log(`${GREEN}No verbs are shown after verb selection - only resources.${RESET}\n`, GREEN);
			process.exit(0);
		} else {
			log(
				`\n${BOLD}${RED}✗ Some tests failed${RESET}`,
				RED,
			);
			log("Please review the failure details above.\n");
			process.exit(1);
		}
	} catch (error) {
		log(`\n${BOLD}${RED}Error during testing:${RESET}`, RED);
		console.error(error);
		process.exit(1);
	}
}

// Run tests
runTests();
