/**
 * Rules Markdown Parser
 * Parse ECLIPSE_RULES.md into searchable sections with multi-category assignment
 */

import type { ParsedSection } from "@/lib/types";
import { HEADING_CATEGORY_MAP, CONTENT_CATEGORY_PATTERNS } from "./categories";

/**
 * Parse markdown content into structured sections
 */
export function parseRulesMarkdown(markdown: string): ParsedSection[] {
  const lines = markdown.split("\n");
  const sections: ParsedSection[] = [];
  let currentSection: Partial<ParsedSection> | null = null;
  let contentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);

    if (headingMatch) {
      // Save previous section
      if (currentSection && currentSection.heading) {
        const content = contentLines.join("\n").trim();
        const categories = categorizeSection(currentSection.heading, content);
        sections.push({
          id: slugify(currentSection.heading),
          heading: currentSection.heading,
          level: currentSection.level ?? 2,
          content,
          categories,
        } as ParsedSection);
      }

      // Start new section
      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();
      currentSection = { heading, level };
      contentLines = [];
    } else if (currentSection) {
      contentLines.push(line);
    }
  }

  // Don't forget the last section
  if (currentSection && currentSection.heading) {
    const content = contentLines.join("\n").trim();
    const categories = categorizeSection(currentSection.heading, content);
    sections.push({
      id: slugify(currentSection.heading),
      heading: currentSection.heading,
      level: currentSection.level ?? 2,
      content,
      categories,
    } as ParsedSection);
  }

  // Build parent-child relationships
  return buildHierarchy(sections);
}

/**
 * Assign categories to a section based on heading and content
 * Returns array of categories (primary + secondary from content)
 */
export function categorizeSection(heading: string, content: string): string[] {
  const categories = new Set<string>();

  // 1. Primary category from heading
  for (const { patterns, category } of HEADING_CATEGORY_MAP) {
    for (const pattern of patterns) {
      if (pattern.test(heading)) {
        categories.add(category);
        break;
      }
    }
  }

  // 2. Secondary categories from content keywords
  for (const { pattern, category } of CONTENT_CATEGORY_PATTERNS) {
    if (pattern.test(content)) {
      categories.add(category);
    }
  }

  // 3. Default to game-concepts if no category matched
  if (categories.size === 0) {
    categories.add("game-concepts");
  }

  return Array.from(categories);
}

/**
 * Build parent-child relationships between sections based on heading levels
 */
function buildHierarchy(sections: ParsedSection[]): ParsedSection[] {
  const result: ParsedSection[] = [];
  const stack: ParsedSection[] = [];

  for (const section of sections) {
    // Pop stack until we find a parent (lower level number)
    while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
      stack.pop();
    }

    // Set parent relationship
    if (stack.length > 0) {
      const parent = stack[stack.length - 1];
      section.parentId = parent.id;

      // Add to parent's children
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(section.id);
    }

    result.push(section);
    stack.push(section);
  }

  return result;
}

/**
 * Convert heading to URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Extract all unique categories from parsed sections
 */
export function extractAllCategories(sections: ParsedSection[]): string[] {
  const categories = new Set<string>();
  for (const section of sections) {
    for (const category of section.categories) {
      categories.add(category);
    }
  }
  return Array.from(categories).sort();
}

/**
 * Count sections per category
 */
export function countByCategory(
  sections: ParsedSection[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const section of sections) {
    for (const category of section.categories) {
      counts[category] = (counts[category] ?? 0) + 1;
    }
  }
  return counts;
}
