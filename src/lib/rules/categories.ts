/**
 * Rule Category Definitions
 * Extensible category system for Eclipse rules
 */

import type { FilterOption } from "@/lib/types";

/**
 * Category metadata with display label and color
 */
export interface CategoryInfo {
  label: string;
  color: string; // Tailwind bg color class
  badgeColor: string; // For active filter badges
}

/**
 * All known category definitions
 * Add new categories here as needed
 */
export const CATEGORY_INFO: Record<string, CategoryInfo> = {
  "game-concepts": {
    label: "Game Concepts",
    color: "bg-slate-500",
    badgeColor: "bg-slate-100 text-slate-800",
  },
  actions: {
    label: "Actions",
    color: "bg-blue-500",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  combat: {
    label: "Combat",
    color: "bg-red-500",
    badgeColor: "bg-red-100 text-red-800",
  },
  technologies: {
    label: "Technologies",
    color: "bg-purple-500",
    badgeColor: "bg-purple-100 text-purple-800",
  },
  species: {
    label: "Species",
    color: "bg-green-500",
    badgeColor: "bg-green-100 text-green-800",
  },
  structures: {
    label: "Structures",
    color: "bg-amber-500",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  "ship-parts": {
    label: "Ship Parts",
    color: "bg-cyan-500",
    badgeColor: "bg-cyan-100 text-cyan-800",
  },
  upkeep: {
    label: "Upkeep",
    color: "bg-orange-500",
    badgeColor: "bg-orange-100 text-orange-800",
  },
  diplomacy: {
    label: "Diplomacy",
    color: "bg-pink-500",
    badgeColor: "bg-pink-100 text-pink-800",
  },
  scoring: {
    label: "Scoring",
    color: "bg-yellow-500",
    badgeColor: "bg-yellow-100 text-yellow-800",
  },
  discovery: {
    label: "Discovery",
    color: "bg-emerald-500",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  movement: {
    label: "Movement",
    color: "bg-indigo-500",
    badgeColor: "bg-indigo-100 text-indigo-800",
  },
  setup: {
    label: "Setup",
    color: "bg-gray-500",
    badgeColor: "bg-gray-100 text-gray-800",
  },
  faq: {
    label: "FAQ",
    color: "bg-teal-500",
    badgeColor: "bg-teal-100 text-teal-800",
  },
  components: {
    label: "Components",
    color: "bg-stone-500",
    badgeColor: "bg-stone-100 text-stone-800",
  },
};

/**
 * Get category label, with fallback to capitalized key
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_INFO[category]?.label ?? capitalize(category);
}

/**
 * Get category color class
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_INFO[category]?.color ?? "bg-gray-500";
}

/**
 * Get category badge color for active filters
 */
export function getCategoryBadgeColor(category: string): string {
  return CATEGORY_INFO[category]?.badgeColor ?? "bg-gray-100 text-gray-800";
}

/**
 * Build label lookup map for active filters
 */
export function getCategoryLabels(): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const [key, info] of Object.entries(CATEGORY_INFO)) {
    labels[key] = info.label;
  }
  return labels;
}

/**
 * Build badge color lookup map for active filters
 */
export function getCategoryBadgeColors(): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const [key, info] of Object.entries(CATEGORY_INFO)) {
    colors[key] = info.badgeColor;
  }
  return colors;
}

/**
 * Convert categories to FilterOption array for MultiToggleFilter
 */
export function categoriesToFilterOptions(
  categories: string[],
  counts?: Record<string, number>,
): FilterOption<string>[] {
  return categories.map((category) => ({
    value: category,
    label: getCategoryLabel(category),
    color: getCategoryColor(category),
    count: counts?.[category],
  }));
}

/**
 * Helper to capitalize a string
 */
function capitalize(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Heading patterns for primary category detection
 */
export const HEADING_CATEGORY_MAP: Array<{
  patterns: RegExp[];
  category: string;
}> = [
  {
    patterns: [/game\s*concepts?/i, /game\s*overview/i, /resources?/i],
    category: "game-concepts",
  },
  {
    patterns: [/game\s*setup/i, /setup/i],
    category: "setup",
  },
  {
    patterns: [
      /explore\s*action/i,
      /research\s*action/i,
      /upgrade\s*action/i,
      /build\s*action/i,
      /move\s*action/i,
      /influence\s*action/i,
      /action\s*phase/i,
      /actions?$/i,
    ],
    category: "actions",
  },
  {
    patterns: [
      /combat\s*phase/i,
      /battle/i,
      /hitting/i,
      /damage/i,
      /retreat/i,
      /engagement/i,
      /initiative/i,
      /missiles?/i,
      /reputation/i,
    ],
    category: "combat",
  },
  {
    patterns: [
      /technolog/i,
      /tech\s*tree/i,
      /military\s*tech/i,
      /grid\s*tech/i,
      /nano\s*tech/i,
      /rare\s*tech/i,
    ],
    category: "technologies",
  },
  {
    patterns: [
      /species/i,
      /terran/i,
      /eridani/i,
      /hydran/i,
      /planta/i,
      /draco/i,
      /mechanema/i,
      /orion/i,
      /descendants/i,
      /enlightened/i,
      /magellan/i,
      /exiles/i,
    ],
    category: "species",
  },
  {
    patterns: [/structure/i, /orbital/i, /monolith/i, /starbase/i],
    category: "structures",
  },
  {
    patterns: [
      /ship\s*part/i,
      /cannon/i,
      /shield/i,
      /hull/i,
      /drive/i,
      /computer/i,
      /source/i,
      /blueprint/i,
    ],
    category: "ship-parts",
  },
  {
    patterns: [/upkeep/i, /production/i, /population/i, /colony/i],
    category: "upkeep",
  },
  {
    patterns: [/diplom/i, /ambassador/i, /alliance/i, /treaty/i],
    category: "diplomacy",
  },
  {
    patterns: [/scoring/i, /victory\s*point/i, /VP/, /game\s*end/i, /winning/i],
    category: "scoring",
  },
  {
    patterns: [/discover/i, /ancient/i, /guardian/i, /GCDS/i],
    category: "discovery",
  },
  {
    patterns: [/move/i, /warp/i, /portal/i, /hex/i, /adjacent/i],
    category: "movement",
  },
  {
    patterns: [/FAQ/i, /question/i, /clarification/i],
    category: "faq",
  },
  {
    patterns: [/game\s*components?/i, /components?\s*list/i],
    category: "components",
  },
];

/**
 * Content patterns for secondary category detection
 */
export const CONTENT_CATEGORY_PATTERNS: Array<{
  pattern: RegExp;
  category: string;
}> = [
  {
    pattern: /\b(initiative|cannon|missile|hull|shield|computer|drive)\b/i,
    category: "ship-parts",
  },
  {
    pattern: /\b(victory\s*point|VP|reputation\s*tile|scoring)\b/i,
    category: "scoring",
  },
  { pattern: /\b(move|warp|hex|adjacent|sector)\b/i, category: "movement" },
  {
    pattern: /\b(explore|research|upgrade|build|influence)\s*action\b/i,
    category: "actions",
  },
  { pattern: /\b(orbital|monolith|starbase)\b/i, category: "structures" },
  {
    pattern: /\b(technolog|tech\s*tile|tech\s*track)\b/i,
    category: "technologies",
  },
  { pattern: /\b(combat|battle|attack|defend|retreat)\b/i, category: "combat" },
  {
    pattern: /\b(ambassador|diplomatic\s*relation|treaty)\b/i,
    category: "diplomacy",
  },
  {
    pattern: /\b(discovery\s*tile|ancient|guardian|GCDS)\b/i,
    category: "discovery",
  },
  {
    pattern: /\b(upkeep|production|population|colony\s*ship)\b/i,
    category: "upkeep",
  },
  {
    pattern:
      /\b(miniature|dice|sector\s*hex|control\s*board|species\s*board|tech\s*tray|upgrade\s*tray|reputation\s*tile\s*bag|storage\s*marker|damage\s*cube)\b/i,
    category: "components",
  },
];
