#!/usr/bin/env npx tsx
/**
 * Debug script to measure actual visual widths of completion box elements
 */

import stringWidth from "string-width";

// Test strings from actual usage
// Primary resources are distinguished by brighter font, not a star character
const testCases = [
  { label: "healthcheck", desc: "Endpoint health monitoring configuration" },
  {
    label: "http_loadbalancer",
    desc: "HTTP/HTTPS load balancer with origin pools and routing rules",
  },
  {
    label: "calls_by_response_code",
    desc: "API call statistics grouped by response code",
  },
];

console.log("=== WIDTH MEASUREMENT DEBUG ===\n");

// 1. Measure terminal width
const terminalWidth = process.stdout.columns || 100;
console.log(`Terminal width: ${terminalWidth} chars\n`);

// 2. Measure indicator width
const selectedIndicator = "▶ ";
const unselectedIndicator = "   ";
console.log("Indicator widths:");
console.log(`  Selected "▶ ": ${stringWidth(selectedIndicator)} visual chars`);
console.log(
  `  Unselected "   ": ${stringWidth(unselectedIndicator)} visual chars`,
);
console.log("");

// 3. Measure box decorations
const boxLeft = "│ "; // border + paddingX
const boxRight = " │"; // paddingX + border
console.log("Box decorations:");
console.log(`  Left border+padding "│ ": ${stringWidth(boxLeft)} chars`);
console.log(`  Right padding+border " │": ${stringWidth(boxRight)} chars`);
console.log("");

// 4. Measure separator
const separator = " - ";
console.log(`Separator " - ": ${stringWidth(separator)} chars\n`);

// 5. Calculate max label width
const maxLabelWidth = Math.max(...testCases.map((t) => t.label.length));
console.log(`Max label width: ${maxLabelWidth} chars\n`);

// 6. Calculate total decorations (everything except description)
const totalDecorations =
  stringWidth(boxLeft) +
  stringWidth(selectedIndicator) +
  maxLabelWidth +
  stringWidth(separator) +
  stringWidth(boxRight);

console.log("Total decoration width calculation:");
console.log(
  `  ${stringWidth(boxLeft)} (left) + ${stringWidth(selectedIndicator)} (indicator) + ${maxLabelWidth} (label) + ${stringWidth(separator)} (sep) + ${stringWidth(boxRight)} (right)`,
);
console.log(`  = ${totalDecorations} chars\n`);

// 7. Available width for description
const availableForDesc = terminalWidth - totalDecorations;
console.log(
  `Available for description: ${terminalWidth} - ${totalDecorations} = ${availableForDesc} chars\n`,
);

// 8. Test each case
console.log("=== INDIVIDUAL LINE TESTS ===\n");

testCases.forEach((tc, i) => {
  const descWidth = stringWidth(tc.desc);
  const paddedLabel = tc.label.padEnd(maxLabelWidth);

  // Simulate full line
  const fullLine =
    boxLeft + selectedIndicator + paddedLabel + separator + tc.desc + boxRight;
  const fullLineWidth = stringWidth(fullLine);

  console.log(`${i + 1}. ${tc.label}`);
  console.log(
    `   Description: "${tc.desc.substring(0, 50)}${tc.desc.length > 50 ? "..." : ""}"`,
  );
  console.log(`   Description width: ${descWidth} chars`);
  console.log(`   Full line: "${fullLine.substring(0, 80)}..."`);
  console.log(`   Full line width: ${fullLineWidth} chars`);
  console.log(
    `   Fits in terminal (${terminalWidth})? ${fullLineWidth <= terminalWidth ? "✅ YES" : `❌ NO - overflow by ${fullLineWidth - terminalWidth}`}`,
  );
  console.log("");
});

// 9. Suggest correct maxDescriptionWidth
const safetyMargin = 2;
const suggestedMaxDesc = availableForDesc - safetyMargin;
console.log("=== RECOMMENDATION ===\n");
console.log(`Suggested maxDescriptionWidth: ${suggestedMaxDesc} chars`);
console.log(
  `This gives total line width: ${totalDecorations + suggestedMaxDesc} chars (${terminalWidth - totalDecorations - suggestedMaxDesc} char margin)`,
);
