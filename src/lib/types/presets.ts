/**
 * Preset Types for Eclipse Calculator
 * Types for ship presets and attribute limits
 */

import type { ShipConfig } from "./combat";

// ============================================================================
// Preset Types
// ============================================================================

export type PresetType = "generic" | "npc" | "player" | "custom";

export interface Preset extends ShipConfig {
  type: PresetType;
}

// ============================================================================
// Attribute Limits
// ============================================================================

export type NumericAttributeName =
  | "yellow"
  | "orange"
  | "blue"
  | "red"
  | "missiles_yellow"
  | "missiles_orange"
  | "missiles_blue"
  | "missiles_red"
  | "computers"
  | "shields"
  | "hull"
  | "initiative"
  | "number";

export const ATTRIBUTE_LIMITS: Record<NumericAttributeName, [number, number]> =
  {
    yellow: [0, 6],
    orange: [0, 6],
    blue: [0, 6],
    red: [0, 6],
    missiles_yellow: [0, 6],
    missiles_orange: [0, 6],
    missiles_blue: [0, 6],
    missiles_red: [0, 6],
    computers: [0, 8],
    shields: [0, 8],
    hull: [0, 8],
    initiative: [0, 8],
    number: [1, 6], // Default, see SHIP_COUNT_LIMITS for class-specific limits
  };

// Class-specific ship count limits based on Eclipse rules
// Rules: 8 Interceptors, 4 Cruisers, 2 Dreadnoughts, 4 Starbases per player
export const SHIP_COUNT_LIMITS: Record<string, [number, number]> = {
  Interceptor: [1, 8],
  Cruiser: [1, 4],
  Dreadnought: [1, 2],
  Starbase: [1, 4],
  Orbital: [1, 1], // One per sector
  Ancient: [1, 6],
  Guardian: [1, 2],
  GC: [1, 1],
  Deathmoon: [1, 1],
  default: [1, 6],
};
