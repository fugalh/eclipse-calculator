#!/usr/bin/env bun
/**
 * Generate rules-index.ts from ECLIPSE_RULES.md
 * Run with: bun run scripts/generate-rules-index.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { parseRulesMarkdown } from "../src/lib/rules/parser";
import type { ParsedSection } from "../src/lib/types";

const RULES_PATH = join(process.cwd(), "rules", "ECLIPSE_RULES.md");
const OUTPUT_PATH = join(process.cwd(), "src", "lib", "data", "rules-index.ts");

console.log("Reading ECLIPSE_RULES.md...");
const markdown = readFileSync(RULES_PATH, "utf-8");

console.log("Parsing sections...");
const sections = parseRulesMarkdown(markdown);

console.log(`Found ${sections.length} sections`);

// Generate TypeScript file content
const fileContent = generateTypeScriptFile(sections);

console.log(`Writing to ${OUTPUT_PATH}...`);
writeFileSync(OUTPUT_PATH, fileContent, "utf-8");

console.log("✓ Rules index regenerated successfully!");
console.log("\nCategory breakdown:");
const categoryCounts = getCategoryCounts(sections);
for (const [category, count] of Object.entries(categoryCounts).sort(
  ([, a], [, b]) => b - a,
)) {
  console.log(`  ${category}: ${count}`);
}

console.log("\nSample sections:");
console.log(`  First: ${sections[0].heading} (${sections[0].id})`);
console.log(
  `  Last: ${sections[sections.length - 1].heading} (${sections[sections.length - 1].id})`,
);

/**
 * Generate TypeScript file content
 */
function generateTypeScriptFile(sections: ParsedSection[]): string {
  const header = `/**
 * Rules Index
 * Pre-parsed sections from ECLIPSE_RULES.md for search
 */

import type { ParsedSection } from "@/lib/types";

/**
 * Static rules index parsed from ECLIPSE_RULES.md
 * Each section has multiple categories for cross-referencing
 */
export const RULES_INDEX: ParsedSection[] = `;

  const sectionsJson = JSON.stringify(sections, null, 2);

  const footer = `
/**
 * Get all unique categories present in the rules index
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  for (const section of RULES_INDEX) {
    for (const category of section.categories) {
      categories.add(category);
    }
  }
  return Array.from(categories).sort();
}

/**
 * Get category counts from the index
 */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const section of RULES_INDEX) {
    for (const category of section.categories) {
      counts[category] = (counts[category] ?? 0) + 1;
    }
  }
  return counts;
}
`;

  return header + sectionsJson + ";" + footer;
}

/**
 * Get category counts from sections
 */
function getCategoryCounts(sections: ParsedSection[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const section of sections) {
    for (const category of section.categories) {
      counts[category] = (counts[category] ?? 0) + 1;
    }
  }
  return counts;
}
