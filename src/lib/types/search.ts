/**
 * Search System Types for Eclipse Calculator
 * Types for the rule search functionality (Phase 3)
 */

// ============================================================================
// Search Categories
// ============================================================================

export type SearchCategory =
  | "game-concepts"
  | "actions"
  | "combat"
  | "technologies"
  | "species"
  | "structures"
  | "ship-parts";

// ============================================================================
// Search Query Types
// ============================================================================

export interface SearchQuery {
  query: string;
  categories?: SearchCategory[];
  limit?: number;
}

export interface SearchFilter {
  categories?: SearchCategory[];
  minRelevance?: number;
}

// ============================================================================
// Search Result Types
// ============================================================================

export interface SearchHighlight {
  start: number;
  end: number;
}

export interface SearchResult {
  id: string;
  heading: string;
  matchedText: string;
  highlights: SearchHighlight[];
  category: SearchCategory;
  referenceLink: string;
  relevanceScore: number;
}

// ============================================================================
// Indexing Types
// ============================================================================

export interface RuleSection {
  id: string;
  heading: string;
  content: string;
  category: SearchCategory;
  parentSection?: string;
  subsections?: string[];
}

export interface IndexedRule {
  section: RuleSection;
  searchableText: string; // normalized for search
  keywords: string[];
}

// ============================================================================
// Search Response Types
// ============================================================================

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  query: string;
  categories: SearchCategory[];
}
