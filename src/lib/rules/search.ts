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
  // Build category match count map once if needed
  let categoryMatchCounts: Map<string, number> | null = null;
  if (selectedCategories.length > 1) {
    categoryMatchCounts = new Map(
      results.map((r) => [
        r.id,
        r.categories.filter((c) => selectedCategories.includes(c)).length,
      ]),
    );
  }

  return results.sort((a, b) => {
    if (categoryMatchCounts) {
      const aMatches = categoryMatchCounts.get(a.id) ?? 0;
      const bMatches = categoryMatchCounts.get(b.id) ?? 0;
      if (aMatches !== bMatches) {
        return bMatches - aMatches;
      }
    }
    return b.relevanceScore - a.relevanceScore;
  });
}

export interface SearchOptions {
  /** Search query text (empty string returns all sections) */
  query?: string;
  /** Filter by categories (OR logic) */
  categories?: string[];
  /** Maximum number of results to return */
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
  const { query = "", categories, limit = 50 } = options;
  const trimmedQuery = query.trim();

  // Filter sections by category first (if specified)
  const categoryFiltered =
    categories && categories.length > 0
      ? sections.filter((s) => matchesCategories(s, categories))
      : sections;

  if (!trimmedQuery) {
    // No query - return all filtered sections
    const results = categoryFiltered.slice(0, limit).map((section) => ({
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

  const queryLower = trimmedQuery.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter(Boolean);

  // Score filtered sections
  const scored: Array<{ section: ParsedSection; score: number }> = [];

  for (const section of categoryFiltered) {
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
 * Combines exact phrase matching and individual term frequency
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

  // Individual term matches - count occurrences in single pass
  for (const term of queryTerms) {
    // Term in heading: 5 points
    if (headingLower.includes(term)) {
      score += 5;
    }

    // Term in content: 2 points per occurrence (capped at 10)
    let contentMatches = 0;
    let pos = 0;
    while ((pos = contentLower.indexOf(term, pos)) !== -1) {
      contentMatches++;
      pos += term.length;
    }
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

  // Sort and merge overlapping/adjacent highlights
  highlights.sort((a, b) => a.start - b.start);

  const merged: SearchHighlight[] = [];
  for (const highlight of highlights) {
    if (merged.length === 0) {
      merged.push(highlight);
    } else {
      const last = merged[merged.length - 1];
      // Merge if overlapping or adjacent
      if (highlight.start <= last.end) {
        last.end = Math.max(last.end, highlight.end);
      } else {
        merged.push(highlight);
      }
    }
  }

  return { text, highlights: merged };
}

// Category to reference link mapping for O(1) lookup
const CATEGORY_TO_LINK = new Map<string, string>([
  ["technologies", "/reference/techs"],
  ["ship-parts", "/reference/ship-parts"],
  ["species", "/reference/species"],
  ["combat", "/reference/combat"],
]);

/**
 * Map a section to its corresponding reference page link
 * Returns null if no matching reference page exists
 */
export function mapSectionToReferenceLink(
  section: ParsedSection,
): string | null {
  // Return first matching category link
  for (const category of section.categories) {
    const link = CATEGORY_TO_LINK.get(category);
    if (link) return link;
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
