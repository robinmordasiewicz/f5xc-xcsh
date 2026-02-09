#!/usr/bin/env npx tsx
/**
 * Test script to verify completion spacing for primary resources
 */

import { createCompleter } from "../src/repl/completion/completer.js";
import { getDomainInfo } from "../src/types/domains.js";

// Create completer with "all" mode to show star indicators
process.env.XCSH_COMPLETION_MODE = "all";
const completer = createCompleter();

// Get virtual domain resources
const virtualDomain = getDomainInfo("virtual");

console.log("Testing completion spacing for virtual domain resources\n");
// Primary resources are now distinguished by brighter font (isPrimary flag), not a star character
console.log(
  "Primary Resources (should have clean descriptions with no double spaces):\n",
);

if (virtualDomain?.primaryResources) {
  for (const resource of virtualDomain.primaryResources.slice(0, 4)) {
    const description = resource.descriptionShort || resource.description || "";

    // Check for double spaces
    const hasDoubleSpace = description.includes("  ");
    const status = hasDoubleSpace ? "❌ FAIL" : "✅ PASS";

    console.log(
      `${status} ${resource.name.padEnd(20)} - "${description}" [isPrimary: true]`,
    );

    if (hasDoubleSpace) {
      console.log(`     ERROR: Found double space in description`);
    }
  }
}

console.log("\nDiscovered Resources (non-primary):\n");

if (virtualDomain?.allResources) {
  const discovered = virtualDomain.allResources
    .filter((r) => !r.isPrimary)
    .slice(0, 4);

  for (const resource of discovered) {
    const description = resource.descriptionShort || resource.description || "";
    const hasDoubleSpace = description.includes("  ");
    const status = hasDoubleSpace ? "❌ FAIL" : "✅ PASS";

    console.log(
      `${status} ${resource.name.padEnd(20)} - "${description}" [isPrimary: false]`,
    );

    if (hasDoubleSpace) {
      console.log(`     ERROR: Found double space in description`);
    }
  }
}

console.log("\n✨ Verification complete!");
