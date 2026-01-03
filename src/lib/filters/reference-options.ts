/**
 * Reference Page Filter Option Builders
 * Converts domain data to FilterOption arrays for shared filter components
 */

import type { FilterOption } from "@/lib/types";
import type { TechCategory, PartSlotType } from "@/lib/types";
import type { PartSource } from "@/lib/data";
import { TECH_CATEGORY_INFO, PART_TYPE_INFO } from "@/lib/data";

// ============================================================================
// Tech Category Options
// ============================================================================

export function getTechCategoryOptions(
  counts?: Record<TechCategory, number>,
): FilterOption<TechCategory>[] {
  const categories: TechCategory[] = ["military", "grid", "nano", "rare"];

  return categories.map((cat) => ({
    value: cat,
    label: TECH_CATEGORY_INFO[cat].label,
    color: TECH_CATEGORY_INFO[cat].color,
    count: counts?.[cat],
  }));
}

export const TECH_CATEGORY_LABELS: Record<TechCategory, string> = {
  military: "Military",
  grid: "Grid",
  nano: "Nano",
  rare: "Rare",
};

export const TECH_CATEGORY_BADGE_COLORS: Record<TechCategory, string> = {
  military: "bg-orange-100 text-orange-800",
  grid: "bg-green-100 text-green-800",
  nano: "bg-zinc-100 text-zinc-800",
  rare: "bg-purple-100 text-purple-800",
};

// ============================================================================
// Part Type Options
// ============================================================================

export function getPartTypeOptions(
  counts?: Record<PartSlotType, number>,
): FilterOption<PartSlotType>[] {
  const types: PartSlotType[] = [
    "cannon",
    "missile",
    "computer",
    "shield",
    "hull",
    "drive",
    "source",
  ];

  return types.map((type) => ({
    value: type,
    label: PART_TYPE_INFO[type].label,
    count: counts?.[type],
  }));
}

export const PART_TYPE_LABELS: Record<PartSlotType, string> = {
  cannon: "Cannon",
  missile: "Missile",
  computer: "Computer",
  shield: "Shield",
  hull: "Hull",
  drive: "Drive",
  source: "Energy Source",
};

// ============================================================================
// Part Source Options
// ============================================================================

export function getPartSourceOptions(
  counts?: Record<PartSource, number>,
): FilterOption<PartSource>[] {
  const sources: PartSource[] = [
    "starting",
    "technology",
    "ancient",
    "discovery",
  ];

  return sources.map((source) => ({
    value: source,
    label: PART_SOURCE_LABELS[source],
    count: counts?.[source],
  }));
}

export const PART_SOURCE_LABELS: Record<PartSource, string> = {
  starting: "Starting",
  technology: "Tech",
  ancient: "Ancient",
  discovery: "Discovery",
};

export const PART_SOURCE_BADGE_COLORS: Record<PartSource, string> = {
  starting: "bg-zinc-100 text-zinc-800",
  technology: "bg-blue-100 text-blue-800",
  ancient: "bg-amber-100 text-amber-800",
  discovery: "bg-purple-100 text-purple-800",
};
