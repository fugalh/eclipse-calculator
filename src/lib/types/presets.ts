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
    number: [0, 6], // Default, see SHIP_COUNT_LIMITS for class-specific limits
  };

// Class-specific ship count limits based on Eclipse rules
// Rules: 8 Interceptors, 4 Cruisers, 2 Dreadnoughts, 4 Starbases per player
// Minimum of 0 allows "disabling" a ship type while keeping its configuration
export const SHIP_COUNT_LIMITS: Record<string, [number, number]> = {
  Interceptor: [0, 8],
  Cruiser: [0, 4],
  Dreadnought: [0, 2],
  Starbase: [0, 4],
  Orbital: [0, 1], // One per sector
  Ancient: [0, 6],
  Guardian: [0, 2],
  GC: [0, 1],
  Deathmoon: [0, 1],
  default: [0, 6],
};
