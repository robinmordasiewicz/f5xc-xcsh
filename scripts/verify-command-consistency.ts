#!/usr/bin/env tsx
/**
 * Build-Time Verification Script: Command Consistency
 *
 * Verifies that all commands have consistent completion/usage specifications.
 * Runs during build to catch drift before deployment.
 *
 * Exit codes:
 * - 0: All checks passed
 * - 1: Critical issues found (fail build)
 * - 2: Script execution error
 */

import {
  generateReport,
  displayReport,
} from "./analyze-command-consistency.js";

/**
 * Main verification function
 */
async function verify(): Promise<void> {
  console.log("🔐 BUILD-TIME VERIFICATION: Command Consistency\n");

  try {
    // Generate analysis report
    const report = await generateReport();

    // Always display the full report
    displayReport(report);

    // Determine exit status based on findings
    if (report.critical.length > 0) {
      console.error("\n❌ BUILD FAILED: Critical inconsistencies detected");
      console.error(
        `   ${report.critical.length} critical issue(s) must be fixed before deployment\n`,
      );
      process.exit(1);
    }

    if (report.warnings.length > 0) {
      console.log(
        `\n⚠️  BUILD PASSED WITH WARNINGS: ${report.warnings.length} warning(s) detected`,
      );
      console.log("   Consider addressing warnings to improve quality\n");
      process.exit(0); // Warnings don't fail the build
    }

    console.log("\n✅ BUILD PASSED: All commands are consistent\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ VERIFICATION FAILED:");
    console.error(error);
    process.exit(2);
  }
}

// Run verification
verify();
