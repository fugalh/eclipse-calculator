/**
 * Search System Types for Eclipse Calculator
 * Types for the rule search functionality (Phase 3)
 */

// ============================================================================
// Rule Categories (Extensible)
// ============================================================================

/**
 * Rule category type - extensible string type for flexibility
 * Common categories: game-concepts, actions, combat, technologies, species, etc.
 */
export type RuleCategory = string;

/**
 * Known/predefined categories for type safety when needed
 */
export type KnownCategory =
  | "game-concepts"
  | "actions"
  | "combat"
  | "technologies"
  | "species"
  | "structures"
  | "ship-parts"
  | "upkeep"
  | "diplomacy"
  | "scoring"
  | "discovery"
  | "movement";

// ============================================================================
// Search Query Types
// ============================================================================

export interface SearchQuery {
  query: string;
  categories?: RuleCategory[];
  limit?: number;
}

export interface SearchFilter {
  categories?: RuleCategory[];
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
  fullContent: string; // Full section content for expansion
  highlights: SearchHighlight[];
  categories: RuleCategory[]; // Multiple categories per result
  referenceLink: string | null;
  relevanceScore: number;
}

// ============================================================================
// Parsed Section Types
// ============================================================================

/**
 * A parsed section from ECLIPSE_RULES.md
 */
export interface ParsedSection {
  id: string;
  heading: string;
  level: number; // h2=2, h3=3, etc.
  content: string;
  categories: RuleCategory[]; // Multiple categories per section
  parentId?: string;
  children?: string[];
}

/**
 * Legacy single-category section (for backwards compatibility)
 * @deprecated Use ParsedSection with categories array instead
 */
export interface RuleSection {
  id: string;
  heading: string;
  content: string;
  category: RuleCategory;
  parentSection?: string;
  subsections?: string[];
}

export interface IndexedRule {
  section: ParsedSection;
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
  categories: RuleCategory[];
}
