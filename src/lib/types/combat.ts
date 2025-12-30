/**
 * Combat Simulation Types for Eclipse Calculator
 * Types for the combat simulation engine
 */

// ============================================================================
// Dice Types
// ============================================================================

export type DiceColor = "yellow" | "orange" | "blue" | "red";

export type BattleSide = "A" | "D";

// ============================================================================
// Ship Configuration Types
// ============================================================================

export interface ShipConfig {
  id: string;
  name: string;
  shipClass: string;
  number: number;
  hull: number;
  yellow: number;
  orange: number;
  blue: number;
  red: number;
  missiles_yellow: number;
  missiles_orange: number;
  missiles_blue: number;
  missiles_red: number;
  computers: number;
  shields: number;
  initiative: number;
  splitter: boolean;
  missile_shield: boolean;
}

export interface Fleet {
  ships: ShipConfig[];
}

// ============================================================================
// Battle Results Types
// ============================================================================

export interface BattleResults {
  attacker: number; // Win probability 0-1
  defender: number;
  shipsAttacker: Record<string, number>; // Survival rates
  shipsDefender: Record<string, number>;
}

// ============================================================================
// Internal Simulation Types (used by simulation.ts)
// ============================================================================

export interface Dice {
  damageValue: number;
  type: DiceColor;
  origin: Combatant;
  isMissile: boolean;
  value: number;
}

export interface DicePool {
  dice: Dice[];
}

export interface Combatant {
  shipClass: string;
  name: string;
  hull: number;
  yellow: number;
  orange: number;
  blue: number;
  red: number;
  missiles_yellow: number;
  missiles_orange: number;
  missiles_blue: number;
  missiles_red: number;
  shields: number;
  computers: number;
  initiative: number;
  splitter: boolean;
  missile_shield: boolean;
  hp: number;
  side: BattleSide;
}

export interface ShipGroup {
  ships: Combatant[];
}

export interface InitiativeOrder {
  combatants: ShipGroup[];
}

export interface BattleStatus {
  attackerAlive: boolean;
  defenderAlive: boolean;
  totalAlive: number;
  shipSurvival: Record<string, number>;
  battleOver: boolean;
  winner?: BattleSide;
}

export interface SingleBattleResult {
  winner: BattleSide;
  shipSurvival: Record<string, number>;
}

// ============================================================================
// Constants
// ============================================================================

export const DAMAGE_VALUES: Record<DiceColor, number> = {
  red: 4,
  blue: 3,
  orange: 2,
  yellow: 1,
};

// TODO: Discuss expansion support (Rise of the Ancients)
// Deathmoon logic retained in TARGET_PRIORITY for future use
export const TARGET_PRIORITY: readonly string[] = [
  "Orbital",
  "Ancient",
  "Guardian",
  "GC",
  "Interceptor",
  "Starbase",
  "Cruiser",
  "Dreadnought",
  "Deathmoon",
];
