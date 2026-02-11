/**
 * Reference Page Filter Option Builders
 * Converts domain data to FilterOption arrays for shared filter components
 *
 * All labels and colors are sourced from centralized *_INFO objects in the data layer
 * to maintain a single source of truth.
 */

import type { FilterOption } from "@/lib/types";
import type { TechCategory, PartSlotType } from "@/lib/types";
import type { PartSource } from "@/lib/data";
import {
  TECH_CATEGORY_INFO,
  PART_TYPE_INFO,
  PART_SOURCE_INFO,
} from "@/lib/data";

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
    label: PART_SOURCE_INFO[source].label,
    color: PART_SOURCE_INFO[source].color,
    count: counts?.[source],
  }));
}
