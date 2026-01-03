/**
 * Preset Storage Utilities for Eclipse Calculator
 * Handles default presets and localStorage persistence for custom presets
 */

import { createDefaultShipConfig } from "./combat/simulation";
import type { ShipConfig, Preset, NumericAttributeName } from "@/lib/types";
import { ATTRIBUTE_LIMITS, SHIP_COUNT_LIMITS } from "@/lib/types";

// Re-export types for backward compatibility
export type { PresetType, Preset, NumericAttributeName } from "@/lib/types";
export { ATTRIBUTE_LIMITS, SHIP_COUNT_LIMITS } from "@/lib/types";

// ============================================================================
// Default Presets
// ============================================================================

export const DEFAULT_PRESETS: Preset[] = [
  {
    ...createDefaultShipConfig({
      name: "Generic ship",
      shipClass: "Cruiser",
    }),
    type: "generic",
  },
  {
    ...createDefaultShipConfig({
      name: "Galactic Center",
      shipClass: "GC",
      yellow: 4,
      computers: 1,
      hull: 7,
    }),
    type: "npc",
  },
  {
    ...createDefaultShipConfig({
      name: "Ancient",
      shipClass: "Ancient",
      yellow: 2,
      computers: 1,
      hull: 1,
      initiative: 2,
    }),
    type: "npc",
  },
  {
    ...createDefaultShipConfig({
      name: "Guardian",
      shipClass: "Guardian",
      yellow: 3,
      computers: 2,
      hull: 3,
      initiative: 3,
    }),
    type: "npc",
  },
  {
    ...createDefaultShipConfig({
      name: "Interceptor",
      shipClass: "Interceptor",
      yellow: 1,
      initiative: 3,
    }),
    type: "player",
  },
  {
    ...createDefaultShipConfig({
      name: "Cruiser",
      shipClass: "Cruiser",
      yellow: 1,
      computers: 1,
      hull: 1,
      initiative: 2,
    }),
    type: "player",
  },
  {
    ...createDefaultShipConfig({
      name: "Dreadnought",
      shipClass: "Dreadnought",
      yellow: 2,
      computers: 1,
      hull: 2,
      initiative: 1,
    }),
    type: "player",
  },
  {
    ...createDefaultShipConfig({
      name: "Starbase",
      shipClass: "Starbase",
      yellow: 1,
      computers: 1,
      hull: 2,
      initiative: 4,
    }),
    type: "player",
  },
  {
    ...createDefaultShipConfig({
      name: "Exile Orbital",
      shipClass: "Orbital",
      yellow: 2,
      hull: 3,
    }),
    type: "player",
  },
  // TODO: Discuss expansion support (Rise of the Ancients)
  // Deathmoon preset removed from UI but combat logic retained in TARGET_PRIORITY
];

// ============================================================================
// Storage Constants
// ============================================================================

const STORAGE_KEY = "eclipse-calculator-presets";

// ============================================================================
// Storage Functions
// ============================================================================

/**
 * Get custom presets from localStorage
 */
export function getCustomPresets(): Preset[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as Preset[];
    // Filter out any invalid presets
    return parsed.filter((preset) => preset.name);
  } catch {
    return [];
  }
}

/**
 * Save custom presets to localStorage
 */
function saveCustomPresets(presets: Preset[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Save a new custom preset
 */
export function saveCustomPreset(shipConfig: ShipConfig): void {
  const customPresets = getCustomPresets();

  // Remove existing preset with same name (case-insensitive)
  const filtered = customPresets.filter(
    (p) => p.name.toLowerCase() !== shipConfig.name.toLowerCase(),
  );

  const preset: Preset = {
    ...shipConfig,
    type: "custom",
  };

  filtered.push(preset);
  saveCustomPresets(filtered);
}

/**
 * Delete a custom preset by name
 */
export function deleteCustomPreset(name: string): void {
  const customPresets = getCustomPresets();
  const filtered = customPresets.filter(
    (p) => p.name.toLowerCase() !== name.toLowerCase(),
  );
  saveCustomPresets(filtered);
}

/**
 * Get all presets (default + custom)
 */
export function getAllPresets(): Preset[] {
  return [...DEFAULT_PRESETS, ...getCustomPresets()];
}

/**
 * Find a preset by name (searches custom first, then defaults)
 */
export function findPresetByName(name: string): Preset | undefined {
  const lowerName = name.toLowerCase();

  // Check custom presets first
  const customPreset = getCustomPresets().find(
    (p) => p.name.toLowerCase() === lowerName,
  );
  if (customPreset) {
    return customPreset;
  }

  // Then check default presets
  return DEFAULT_PRESETS.find((p) => p.name.toLowerCase() === lowerName);
}

/**
 * Cycle an attribute value to the next valid value
 * For the 'number' attribute, uses class-specific limits if shipClass is provided
 */
export function cycleAttribute(
  currentValue: number,
  attributeName: NumericAttributeName,
  shipClass?: string,
): number {
  // Use class-specific limits for the 'number' attribute
  if (attributeName === "number" && shipClass) {
    const limits = SHIP_COUNT_LIMITS[shipClass] ?? SHIP_COUNT_LIMITS.default;
    const [min, max] = limits;
    const nextValue = currentValue + 1;
    return nextValue > max ? min : nextValue;
  }

  const [min, max] = ATTRIBUTE_LIMITS[attributeName];
  const nextValue = currentValue + 1;
  return nextValue > max ? min : nextValue;
}
