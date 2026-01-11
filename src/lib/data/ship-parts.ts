/**
 * Ship Parts Reference Data for Eclipse: Second Dawn for the Galaxy
 * Extracted from ECLIPSE_RULES.md and Techs.html
 */

import type { PartSlotType } from "@/lib/types";

export type PartSource = "starting" | "technology" | "ancient" | "discovery";
export type DamageColor = "yellow" | "orange" | "blue" | "red";

export interface ShipPartData {
  id: string;
  name: string;
  type: PartSlotType;
  /** Energy: negative = consumes, positive = produces */
  energy: number;
  /** Symbolic notation matching game aids */
  notation: string;
  /** How this part is obtained */
  source: PartSource;
  /** Tech ID required to use this part */
  requiredTechId?: string;
  /** Descriptive effect text */
  effect: string;
}

export interface CannonPartData extends ShipPartData {
  type: "cannon";
  diceColor: DamageColor;
  diceCount: number;
  initiativeBonus?: number;
}

export interface MissilePartData extends ShipPartData {
  type: "missile";
  diceColor: DamageColor;
  diceCount: number;
  initiativeBonus?: number;
}

export interface ComputerPartData extends ShipPartData {
  type: "computer";
  hitBonus: number;
  initiativeBonus?: number;
}

export interface ShieldPartData extends ShipPartData {
  type: "shield";
  shieldValue: number;
  initiativeBonus?: number;
}

export interface HullPartData extends ShipPartData {
  type: "hull";
  hullPoints: number;
  initiativeBonus?: number;
}

export interface DrivePartData extends ShipPartData {
  type: "drive";
  movement: number;
  initiative: number;
}

export interface SourcePartData extends ShipPartData {
  type: "source";
  energyProduction: number;
  initiativeBonus?: number;
}

export type AnyShipPartData =
  | CannonPartData
  | MissilePartData
  | ComputerPartData
  | ShieldPartData
  | HullPartData
  | DrivePartData
  | SourcePartData;

// ============================================================================
// Starting Ship Parts (available to all players)
// ============================================================================

export const STARTING_PARTS: AnyShipPartData[] = [
  {
    id: "ion-cannon",
    name: "Ion Cannon",
    type: "cannon",
    energy: -1,
    notation: ". o",
    source: "starting",
    effect: "Yellow die, 1 damage",
    diceColor: "yellow",
    diceCount: 1,
  },
  {
    id: "electron-computer",
    name: "Electron Computer",
    type: "computer",
    energy: 0,
    notation: "+1",
    source: "starting",
    effect: "+1 to hit",
    hitBonus: 1,
  },
  {
    id: "hull",
    name: "Hull",
    type: "hull",
    energy: 0,
    notation: "*",
    source: "starting",
    effect: "+1 damage absorption",
    hullPoints: 1,
  },
  {
    id: "nuclear-drive",
    name: "Nuclear Drive",
    type: "drive",
    energy: -1,
    notation: ".^>",
    source: "starting",
    effect: "1 Movement, +1 Initiative",
    movement: 1,
    initiative: 1,
  },
  {
    id: "nuclear-source",
    name: "Nuclear Source",
    type: "source",
    energy: 3,
    notation: "3z",
    source: "starting",
    effect: "+3 Energy",
    energyProduction: 3,
  },
];

// ============================================================================
// Technology Ship Parts
// ============================================================================

export const TECH_PARTS: AnyShipPartData[] = [
  // Cannons
  {
    id: "plasma-cannon",
    name: "Plasma Cannon",
    type: "cannon",
    energy: -2,
    notation: ".. oo",
    source: "technology",
    requiredTechId: "plasma-cannon",
    effect: "Orange die, 2 damage",
    diceColor: "orange",
    diceCount: 1,
  },
  {
    id: "soliton-cannon",
    name: "Soliton Cannon",
    type: "cannon",
    energy: -3,
    notation: "... ooo",
    source: "technology",
    requiredTechId: "soliton-cannon",
    effect: "Blue die, 3 damage",
    diceColor: "blue",
    diceCount: 1,
  },
  {
    id: "antimatter-cannon",
    name: "Antimatter Cannon",
    type: "cannon",
    energy: -4,
    notation: ".... oooo",
    source: "technology",
    requiredTechId: "antimatter-cannon",
    effect: "Red die, 4 damage",
    diceColor: "red",
    diceCount: 1,
  },

  // Missiles
  {
    id: "ion-missile",
    name: "Ion Missile",
    type: "missile",
    energy: 0,
    notation: "ø",
    source: "technology",
    requiredTechId: "ion-missile",
    effect: "Yellow die, 1 damage (first round only)",
    diceColor: "yellow",
    diceCount: 1,
  },
  {
    id: "plasma-missile",
    name: "Plasma Missile",
    type: "missile",
    energy: 0,
    notation: "øø",
    source: "technology",
    requiredTechId: "plasma-missile",
    effect: "Orange die, 2 damage (first round only)",
    diceColor: "orange",
    diceCount: 1,
  },
  {
    id: "flux-missile",
    name: "Flux Missile",
    type: "missile",
    energy: 0,
    notation: "øøøø",
    source: "technology",
    requiredTechId: "flux-missile",
    effect: "Red die, 4 damage (first round only)",
    diceColor: "red",
    diceCount: 1,
  },

  // Computers
  {
    id: "positron-computer",
    name: "Positron Computer",
    type: "computer",
    energy: -1,
    notation: ". +2",
    source: "technology",
    requiredTechId: "positron-computer",
    effect: "+2 to hit",
    hitBonus: 2,
  },
  {
    id: "gluon-computer",
    name: "Gluon Computer",
    type: "computer",
    energy: -2,
    notation: ".. +3",
    source: "technology",
    requiredTechId: "gluon-computer",
    effect: "+3 to hit",
    hitBonus: 3,
  },

  // Shields
  {
    id: "gauss-shield",
    name: "Gauss Shield",
    type: "shield",
    energy: 0,
    notation: "-1",
    source: "technology",
    requiredTechId: "gauss-shield",
    effect: "-1 to opponent's hit rolls",
    shieldValue: 1,
  },
  {
    id: "phase-shield",
    name: "Phase Shield",
    type: "shield",
    energy: -1,
    notation: ". -2",
    source: "technology",
    requiredTechId: "phase-shield",
    effect: "-2 to opponent's hit rolls",
    shieldValue: 2,
  },
  {
    id: "absorption-shield",
    name: "Absorption Shield",
    type: "shield",
    energy: 1,
    notation: "z -1",
    source: "technology",
    requiredTechId: "absorption-shield",
    effect: "-1 to opponent's hit rolls, +1 Energy production",
    shieldValue: 1,
  },
  {
    id: "conifold-field",
    name: "Conifold Field",
    type: "shield",
    energy: -2,
    notation: "..***",
    source: "technology",
    requiredTechId: "conifold-field",
    effect: "-3 to opponent's hit rolls",
    shieldValue: 3,
  },

  // Hulls
  {
    id: "improved-hull",
    name: "Improved Hull",
    type: "hull",
    energy: 0,
    notation: "**",
    source: "technology",
    requiredTechId: "improved-hull",
    effect: "+2 damage absorption",
    hullPoints: 2,
  },
  {
    id: "sentient-hull",
    name: "Sentient Hull",
    type: "hull",
    energy: -1,
    notation: ".* +1",
    source: "technology",
    requiredTechId: "sentient-hull",
    effect: "+1 damage absorption, +1 Initiative",
    hullPoints: 1,
    initiativeBonus: 1,
  },

  // Drives
  {
    id: "fusion-drive",
    name: "Fusion Drive",
    type: "drive",
    energy: -2,
    notation: "..^^>>",
    source: "technology",
    requiredTechId: "fusion-drive",
    effect: "2 Movement, +2 Initiative",
    movement: 2,
    initiative: 2,
  },
  {
    id: "tachyon-drive",
    name: "Tachyon Drive",
    type: "drive",
    energy: -3,
    notation: "...^^^>>>",
    source: "technology",
    requiredTechId: "tachyon-drive",
    effect: "3 Movement, +3 Initiative",
    movement: 3,
    initiative: 3,
  },
  {
    id: "transition-drive",
    name: "Transition Drive",
    type: "drive",
    energy: 2,
    notation: "2z >>>",
    source: "technology",
    requiredTechId: "transition-drive",
    effect: "3 Movement, +2 Energy production",
    movement: 3,
    initiative: 0,
  },

  // Energy Sources
  {
    id: "fusion-source",
    name: "Fusion Source",
    type: "source",
    energy: 6,
    notation: "6z",
    source: "technology",
    requiredTechId: "fusion-source",
    effect: "+6 Energy",
    energyProduction: 6,
  },
  {
    id: "tachyon-source",
    name: "Tachyon Source",
    type: "source",
    energy: 9,
    notation: "9z",
    source: "technology",
    requiredTechId: "tachyon-source",
    effect: "+9 Energy",
    energyProduction: 9,
  },
  {
    id: "zero-point-source",
    name: "Zero-Point Source",
    type: "source",
    energy: 12,
    notation: "12z",
    source: "technology",
    requiredTechId: "zero-point-source",
    effect: "+12 Energy",
    energyProduction: 12,
  },
];

// ============================================================================
// Ancient Ship Parts (from Discovery Tiles)
// ============================================================================

export const ANCIENT_PARTS: AnyShipPartData[] = [
  {
    id: "shard-hull",
    name: "Shard Hull",
    type: "hull",
    energy: 0,
    notation: "***",
    source: "ancient",
    effect: "+3 damage absorption",
    hullPoints: 3,
  },
  {
    id: "muon-source",
    name: "Muon Source",
    type: "source",
    energy: 2,
    notation: "2z ^",
    source: "ancient",
    effect: "+2 Energy, +1 Initiative (placed outside ship grid)",
    energyProduction: 2,
    initiativeBonus: 1,
  },
  {
    id: "hypergrid-source",
    name: "Hypergrid Source",
    type: "source",
    energy: 11,
    notation: "11z",
    source: "ancient",
    effect: "+11 Energy",
    energyProduction: 11,
  },
  {
    id: "conformal-drive",
    name: "Conformal Drive",
    type: "drive",
    energy: -2,
    notation: "..>>>>^^",
    source: "ancient",
    effect: "4 Movement, +2 Initiative",
    movement: 4,
    initiative: 2,
  },
  {
    id: "nonlinear-drive",
    name: "Nonlinear Drive",
    type: "drive",
    energy: 2,
    notation: "2z >>",
    source: "ancient",
    effect: "2 Movement, +2 Energy",
    movement: 2,
    initiative: 0,
  },
  {
    id: "axon-computer",
    name: "Axon Computer",
    type: "computer",
    energy: 0,
    notation: "^ +2",
    source: "ancient",
    effect: "+2 to hit, +1 Initiative",
    hitBonus: 2,
    initiativeBonus: 1,
  },
  {
    id: "inversion-shield",
    name: "Inversion Shield",
    type: "shield",
    energy: 2,
    notation: "2z -2",
    source: "ancient",
    effect: "-2 to opponent's hit rolls, +2 Energy",
    shieldValue: 2,
  },
  {
    id: "flux-shield",
    name: "Flux Shield",
    type: "shield",
    energy: -2,
    notation: "..^ -3",
    source: "ancient",
    effect: "-3 to opponent's hit rolls, +1 Initiative",
    shieldValue: 3,
    initiativeBonus: 1,
  },
  {
    id: "ion-disruptor",
    name: "Ion Disruptor",
    type: "cannon",
    energy: 0,
    notation: "^^^ o",
    source: "ancient",
    effect: "Yellow die, 1 damage, +3 Initiative",
    diceColor: "yellow",
    diceCount: 1,
    initiativeBonus: 3,
  },
  {
    id: "ion-turret",
    name: "Ion Turret",
    type: "cannon",
    energy: 0,
    notation: "o,o",
    source: "ancient",
    effect: "2 Yellow dice, 1 damage each",
    diceColor: "yellow",
    diceCount: 2,
  },
  {
    id: "ion-missile",
    name: "Ion Missile",
    type: "missile",
    energy: 0,
    notation: "ø,ø,ø",
    source: "ancient",
    effect: "3 Yellow dice, 1 damage each (first round only)",
    diceColor: "yellow",
    diceCount: 3,
  },
  {
    id: "plasma-turret",
    name: "Plasma Turret",
    type: "missile",
    energy: -3,
    notation: "... øø,øø",
    source: "ancient",
    effect: "2 Orange dice, 2 damage each (first round only)",
    diceColor: "orange",
    diceCount: 2,
  },
  {
    id: "soliton-charger",
    name: "Soliton Charger",
    type: "cannon",
    energy: -1,
    notation: ". ooo",
    source: "ancient",
    effect: "Blue die, 3 damage, reduced energy cost",
    diceColor: "blue",
    diceCount: 1,
  },
  {
    id: "soliton-missile",
    name: "Soliton Missile",
    type: "missile",
    energy: 0,
    notation: "^ øøø",
    source: "ancient",
    effect: "Blue die, 3 damage, +1 Initiative (first round only)",
    diceColor: "blue",
    diceCount: 1,
    initiativeBonus: 1,
  },
  {
    id: "antimatter-missile",
    name: "Antimatter Missile",
    type: "missile",
    energy: 0,
    notation: "øøøø",
    source: "ancient",
    effect: "Red die, 4 damage (first round only)",
    diceColor: "red",
    diceCount: 1,
  },
];

// ============================================================================
// All Parts Combined
// ============================================================================

export const ALL_PARTS: AnyShipPartData[] = [
  ...STARTING_PARTS,
  ...TECH_PARTS,
  ...ANCIENT_PARTS,
];

/** Get parts by type */
export function getPartsByType(type: PartSlotType): AnyShipPartData[] {
  return ALL_PARTS.filter((part) => part.type === type);
}

/** Get parts by source */
export function getPartsBySource(source: PartSource): AnyShipPartData[] {
  return ALL_PARTS.filter((part) => part.source === source);
}

/** Get part by ID */
export function getPartById(id: string): AnyShipPartData | undefined {
  return ALL_PARTS.find((part) => part.id === id);
}

/** Part type display info for UI */
export const PART_TYPE_INFO = {
  cannon: { label: "Cannon", icon: "target" },
  missile: { label: "Missile", icon: "rocket" },
  computer: { label: "Computer", icon: "cpu" },
  shield: { label: "Shield", icon: "shield" },
  hull: { label: "Hull", icon: "box" },
  drive: { label: "Drive", icon: "zap" },
  source: { label: "Energy Source", icon: "battery-charging" },
} as const;

/** Damage color info */
export const DAMAGE_COLOR_INFO = {
  yellow: { label: "Yellow", damage: 1, color: "bg-yellow-400" },
  orange: { label: "Orange", damage: 2, color: "bg-orange-500" },
  blue: { label: "Blue", damage: 3, color: "bg-blue-500" },
  red: { label: "Red", damage: 4, color: "bg-red-500" },
} as const;
