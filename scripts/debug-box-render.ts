#!/usr/bin/env npx tsx
/**
 * Debug script that simulates Ink Box rendering
 * Descriptions are shown in full without truncation
 */

// Test data matching actual suggestions
// Primary resources are distinguished by brighter font (isPrimary flag)
const testData = [
  {
    label: "healthcheck",
    desc: "Endpoint health monitoring configuration",
    selected: true,
    isPrimary: true,
  },
  {
    label: "http_loadbalancer",
    desc: "HTTP/HTTPS load balancer with origin pools and routing rules",
    selected: false,
    isPrimary: true,
  },
  {
    label: "origin_pool",
    desc: "Backend server pool for load balancing and failover",
    selected: false,
    isPrimary: true,
  },
  {
    label: "tcp_loadbalancer",
    desc: "Layer 4 TCP load balancer for non-HTTP traffic",
    selected: false,
    isPrimary: true,
  },
  {
    label: "cluster",
    desc: "Backend cluster for distributed service deployment",
    selected: false,
    isPrimary: false,
  },
  {
    label: "proxy",
    desc: "Traffic proxy for request forwarding and transformation",
    selected: false,
    isPrimary: false,
  },
  {
    label: "calls_by_response_code",
    desc: "API call statistics grouped by response code",
    selected: false,
    isPrimary: false,
  },
];

// Calculate maxLabelWidth
const maxLabelWidth = Math.max(...testData.map((d) => d.label.length));

// Find the longest line to size the box
const longestLine = Math.max(
  ...testData.map((d) => {
    const indicator = d.selected ? "▶ " : "   ";
    return (
      indicator.length +
      d.label.padEnd(maxLabelWidth).length +
      " - ".length +
      d.desc.length
    );
  }),
);

const boxWidth = longestLine + 4; // +4 for "│ " and " │"

console.log("=== COMPONENT SIMULATION (No Truncation) ===\n");
console.log(`Max label width: ${maxLabelWidth}`);
console.log(`Box auto-sizes to fit longest description`);
console.log("");

// Render each line
console.log("=== RENDERED LINES ===\n");

console.log("╭" + "─".repeat(boxWidth - 2) + "╮");

testData.forEach((item) => {
  const indicator = item.selected ? "▶ " : "   ";
  const paddedLabel = item.label.padEnd(maxLabelWidth);
  const primaryMarker = item.isPrimary ? " [PRIMARY - bright font]" : "";

  console.log(`│ ${indicator}${paddedLabel} - ${item.desc}${primaryMarker}`);
});

console.log("╰" + "─".repeat(boxWidth - 2) + "╯");

console.log("\n=== DESCRIPTION LENGTHS ===\n");

testData.forEach((item) => {
  const status = item.isPrimary ? "★" : " ";
  console.log(
    `${status} ${item.label.padEnd(24)} desc length: ${item.desc.length} chars`,
  );
});
