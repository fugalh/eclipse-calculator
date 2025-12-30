/**
 * Core Game Types for Eclipse: Second Dawn for the Galaxy
 * Types representing game entities from the rulebook
 */

// ============================================================================
// Basic Game Enums
// ============================================================================

export type TechCategory = "military" | "grid" | "nano" | "rare";

export type ResourceType = "materials" | "science" | "money";

export type ActionType =
  | "explore"
  | "research"
  | "upgrade"
  | "build"
  | "move"
  | "influence";

export type ShipType =
  | "interceptor"
  | "cruiser"
  | "dreadnought"
  | "starbase"
  | "orbital"
  | "ancient"
  | "guardian"
  | "gcds"
  | "deathmoon";

export type PartSlotType =
  | "cannon"
  | "missile"
  | "computer"
  | "shield"
  | "hull"
  | "drive"
  | "source";

// Re-export DiceColor from combat for convenience
export type { DiceColor } from "./combat";

// ============================================================================
// Ship Parts
// ============================================================================

export interface ShipPart {
  id: string;
  name: string;
  type: PartSlotType;
  energy: number; // negative = consumes, positive = produces
  isAncient?: boolean;
  isRare?: boolean;
}

export interface CannonPart extends ShipPart {
  type: "cannon";
  diceColor: "yellow" | "orange" | "blue" | "red";
  diceCount: number;
  initiativeBonus?: number;
}

export interface MissilePart extends ShipPart {
  type: "missile";
  diceColor: "yellow" | "orange" | "blue" | "red";
  diceCount: number;
  initiativeBonus?: number;
}

export interface ComputerPart extends ShipPart {
  type: "computer";
  hitBonus: number;
  initiativeBonus?: number;
}

export interface ShieldPart extends ShipPart {
  type: "shield";
  shieldValue: number; // negative = reduces hit chance
  initiativeBonus?: number;
}

export interface HullPart extends ShipPart {
  type: "hull";
  hullPoints: number;
  initiativeBonus?: number;
}

export interface DrivePart extends ShipPart {
  type: "drive";
  movement: number;
  initiative: number;
}

export interface SourcePart extends ShipPart {
  type: "source";
  energyProduction: number;
  initiativeBonus?: number;
}

export type AnyShipPart =
  | CannonPart
  | MissilePart
  | ComputerPart
  | ShieldPart
  | HullPart
  | DrivePart
  | SourcePart;

// ============================================================================
// Technologies
// ============================================================================

export interface Technology {
  id: string;
  name: string;
  category: TechCategory;
  scienceCost: number;
  minCost: number;
  discountValue: number;
  description: string;
  unlocksPartId?: string;
  instantEffect?: string;
  buildUnlock?: string;
  permanentAbility?: string;
}

// ============================================================================
// Species
// ============================================================================

export type SpeciesId =
  | "terran"
  | "eridani"
  | "hydran"
  | "planta"
  | "draco"
  | "mechanema"
  | "orion";

export interface ActionActivations {
  explore: number;
  research: number;
  upgrade: number;
  build: number;
  move: number;
  influence: number;
}

export interface StartingResources {
  materials: number;
  science: number;
  money: number;
}

export interface Species {
  id: SpeciesId;
  name: string;
  startingResources: StartingResources;
  startingTechs: string[]; // Tech IDs
  tradeRatio: number;
  activations: ActionActivations;
  specialAbilities: string[];
  influenceDiscs: number;
}

// ============================================================================
// Ship Blueprints
// ============================================================================

export interface ShipSlot {
  type: PartSlotType;
  partId?: string; // undefined = empty slot
}

export interface ShipBlueprint {
  shipType: ShipType;
  speciesId?: SpeciesId; // undefined = default/ancient
  slots: ShipSlot[];
  baseInitiative: number;
  buildCost: number;
  maxCount: number;
}

// ============================================================================
// Game Constants
// ============================================================================

export const DICE_DAMAGE = {
  yellow: 1,
  orange: 2,
  blue: 3,
  red: 4,
} as const;

export const GAME_ROUNDS = 8; // Second Dawn has 8 rounds

export const BUILDING_COSTS = {
  interceptor: 3,
  cruiser: 5,
  dreadnought: 8,
  starbase: 3,
  orbital: 4,
  monolith: 10,
} as const;

export const MECHANEMA_BUILDING_COSTS = {
  interceptor: 2,
  cruiser: 4,
  dreadnought: 7,
  starbase: 2,
  orbital: 3,
  monolith: 8,
} as const;
