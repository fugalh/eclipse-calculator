#!/usr/bin/env bun
/**
 * Verify the regenerated rules index
 */

import {
  RULES_INDEX,
  getAllCategories,
  getCategoryCounts,
} from "../src/lib/data/rules-index";

console.log("=== Rules Index Verification ===\n");
console.log("Total sections:", RULES_INDEX.length);

console.log("\nCategories:", getAllCategories().join(", "));

console.log("\nCategory counts:");
const counts = getCategoryCounts();
Object.entries(counts)
  .sort(([, a], [, b]) => b - a)
  .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

console.log("\nSample sections:");
console.log(
  "- First section:",
  RULES_INDEX[0].heading,
  `(${RULES_INDEX[0].id})`,
);
console.log(
  "- Last section:",
  RULES_INDEX[RULES_INDEX.length - 1].heading,
  `(${RULES_INDEX[RULES_INDEX.length - 1].id})`,
);

console.log("\nSections with 'components' category:");
RULES_INDEX.filter((s) => s.categories.includes("components")).forEach((s) =>
  console.log(`  - ${s.heading} (${s.id})`),
);

console.log("\n✓ Verification complete!");
