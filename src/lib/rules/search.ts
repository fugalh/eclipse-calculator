/**
 * Rules Search Logic
 * Full-text search with highlighting and relevance scoring
 */

import type { ParsedSection, SearchResult, SearchHighlight } from "@/lib/types";

/**
 * Calculate category match score (how many selected categories match)
 */
export function calculateCategoryMatchScore(
  section: ParsedSection,
  selectedCategories: string[],
): number {
  return selectedCategories.filter((cat) => section.categories.includes(cat))
    .length;
}

/**
 * Sort results by composite score:
 * - Primary: category match count (when multiple categories selected)
 * - Secondary: text relevance score
 */
export function sortByCompositeScore(
  results: SearchResult[],
  selectedCategories: string[],
): SearchResult[] {
  return results.sort((a, b) => {
    if (selectedCategories.length > 1) {
      const aMatches = a.categories.filter((c) =>
        selectedCategories.includes(c),
      ).length;
      const bMatches = b.categories.filter((c) =>
        selectedCategories.includes(c),
      ).length;
      if (aMatches !== bMatches) {
        return bMatches - aMatches;
      }
    }
    return b.relevanceScore - a.relevanceScore;
  });
}

export interface SearchOptions {
  query: string;
  categories?: string[];
  limit?: number;
}

/**
 * Search rules sections by query and optional category filter
 * Returns results sorted by relevance score
 */
export function searchRules(
  sections: ParsedSection[],
  options: SearchOptions,
): SearchResult[] {
  const { query, categories, limit = 50 } = options;

  if (!query.trim()) {
    // No query - return all sections (optionally filtered by category)
    let filtered = sections;
    if (categories && categories.length > 0) {
      filtered = sections.filter((s) => matchesCategories(s, categories));
    }
    const results = filtered.slice(0, limit).map((section) => ({
      id: section.id,
      heading: section.heading,
      matchedText: truncateContent(section.content, 200),
      fullContent: section.content,
      highlights: [],
      categories: section.categories,
      referenceLink: mapSectionToReferenceLink(section),
      relevanceScore: 0,
    }));
    return sortByCompositeScore(results, categories ?? []);
  }

  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter(Boolean);

  // Score and filter sections
  const scored: Array<{ section: ParsedSection; score: number }> = [];

  for (const section of sections) {
    // Skip if doesn't match category filter
    if (categories && categories.length > 0) {
      if (!matchesCategories(section, categories)) {
        continue;
      }
    }

    const score = calculateRelevance(
      section,
      queryLower,
      queryTerms,
      categories,
    );
    if (score > 0) {
      scored.push({ section, score });
    }
  }

  // Sort by relevance (highest first)
  scored.sort((a, b) => b.score - a.score);

  // Convert to SearchResult with highlights
  const results = scored.slice(0, limit).map(({ section, score }) => {
    const { text, highlights } = highlightMatches(section.content, queryTerms);

    return {
      id: section.id,
      heading: section.heading,
      matchedText: text,
      fullContent: section.content,
      highlights,
      categories: section.categories,
      referenceLink: mapSectionToReferenceLink(section),
      relevanceScore: score,
    };
  });

  return sortByCompositeScore(results, categories ?? []);
}

/**
 * Check if section has any of the selected categories (OR logic)
 */
function matchesCategories(
  section: ParsedSection,
  selected: string[],
): boolean {
  if (selected.length === 0) return true;
  return section.categories.some((cat) => selected.includes(cat));
}

/**
 * Calculate relevance score for a section
 */
function calculateRelevance(
  section: ParsedSection,
  queryLower: string,
  queryTerms: string[],
  selectedCategories?: string[],
): number {
  let score = 0;
  const headingLower = section.heading.toLowerCase();
  const contentLower = section.content.toLowerCase();

  // Exact phrase match in heading: 20 points
  if (headingLower.includes(queryLower)) {
    score += 20;
  }

  // Exact phrase match in content: 10 points
  if (contentLower.includes(queryLower)) {
    score += 10;
  }

  // Individual term matches
  for (const term of queryTerms) {
    // Term in heading: 5 points
    if (headingLower.includes(term)) {
      score += 5;
    }

    // Term in content: 2 points per occurrence (capped at 10)
    const contentMatches = countOccurrences(contentLower, term);
    score += Math.min(contentMatches * 2, 10);
  }

  // Category match boost: +2 per matching category
  if (selectedCategories && selectedCategories.length > 0) {
    const matchingCategories = section.categories.filter((cat) =>
      selectedCategories.includes(cat),
    ).length;
    score += matchingCategories * 2;
  }

  return score;
}

/**
 * Count occurrences of a term in text
 */
function countOccurrences(text: string, term: string): number {
  let count = 0;
  let pos = 0;
  while ((pos = text.indexOf(term, pos)) !== -1) {
    count++;
    pos += term.length;
  }
  return count;
}

/**
 * Extract matched text with highlights
 * Returns truncated content around first match with highlight positions
 */
export function highlightMatches(
  content: string,
  queryTerms: string[],
): { text: string; highlights: SearchHighlight[] } {
  const contentLower = content.toLowerCase();

  // Find first match position
  let firstMatchPos = content.length;
  for (const term of queryTerms) {
    const pos = contentLower.indexOf(term);
    if (pos !== -1 && pos < firstMatchPos) {
      firstMatchPos = pos;
    }
  }

  // Extract context around first match
  const contextStart = Math.max(0, firstMatchPos - 50);
  const contextEnd = Math.min(content.length, firstMatchPos + 200);
  let text = content.slice(contextStart, contextEnd);

  // Add ellipsis if truncated
  if (contextStart > 0) {
    text = "..." + text;
  }
  if (contextEnd < content.length) {
    text = text + "...";
  }

  // Find highlight positions in extracted text
  const textLower = text.toLowerCase();
  const highlights: SearchHighlight[] = [];

  for (const term of queryTerms) {
    let pos = 0;
    while ((pos = textLower.indexOf(term, pos)) !== -1) {
      highlights.push({
        start: pos,
        end: pos + term.length,
      });
      pos += term.length;
    }
  }

  // Sort and merge overlapping highlights
  highlights.sort((a, b) => a.start - b.start);

  return { text, highlights };
}

/**
 * Map a section to its corresponding reference page link
 * Returns null if no matching reference page exists
 */
export function mapSectionToReferenceLink(
  section: ParsedSection,
): string | null {
  const categories = section.categories;

  // Map categories to reference pages
  if (categories.includes("technologies")) {
    return "/reference/techs";
  }
  if (categories.includes("ship-parts")) {
    return "/reference/ship-parts";
  }
  if (categories.includes("species")) {
    return "/reference/species";
  }
  if (categories.includes("combat")) {
    return "/reference/combat";
  }

  return null;
}

/**
 * Truncate content to max length, respecting word boundaries
 */
function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }

  // Find last space before maxLength
  const truncated = content.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + "...";
  }

  return truncated + "...";
}
