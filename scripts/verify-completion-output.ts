#!/usr/bin/env npx tsx
/**
 * Verify actual completion output matches expected format
 */

import { Completer } from '../src/repl/completion/completer.js';
import { loadSettingsSync } from '../src/config/settings.js';

// Force "all" mode
process.env.XCSH_COMPLETION_MODE = 'all';

const completer = new Completer();

// Simulate typing "/virtual list " to get resource completions
console.log('Simulating: /virtual list\n');
console.log('Expected format:');
// Primary resources are distinguished by isPrimary flag (renders with brighter font)
console.log('  Primary: isPrimary=true (brighter font in UI)');
console.log('  Others:  isPrimary=false (normal font in UI)\n');
console.log('═'.repeat(80));

// Get resource type suggestions for virtual domain
const suggestions = completer.getResourceTypeSuggestions('virtual');

// Check first 10 resources
const resourcesToCheck = suggestions.slice(0, 10);
let allPassed = true;

for (const suggestion of resourcesToCheck) {
  const text = suggestion.text.padEnd(25);
  const desc = suggestion.description;
  const isPrimary = suggestion.isPrimary;

  // Check for issues
  const hasDoubleSpace = desc.includes('  ');

  let status = '✅';
  let issues: string[] = [];

  if (hasDoubleSpace) {
    status = '❌';
    issues.push('DOUBLE SPACE DETECTED');
    allPassed = false;
  }

  const primaryMarker = isPrimary ? '[PRIMARY]' : '';
  console.log(`${status} ${text} - ${desc} ${primaryMarker}`);

  if (issues.length > 0) {
    console.log(`   └─ Issues: ${issues.join(', ')}`);
  }
}

console.log('═'.repeat(80));

if (allPassed) {
  console.log('\n✅ All checks passed! Spacing is correct.');
} else {
  console.log('\n❌ Some checks failed. Review output above.');
  process.exit(1);
}
