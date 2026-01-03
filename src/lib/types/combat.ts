/**
 * Combat Simulation Types for Eclipse Calculator
 * Types for the combat simulation engine
 */

// ============================================================================
// Dice Types
// ============================================================================

export type DiceColor = "yellow" | "orange" | "blue" | "red";

export type BattleSide = "A" | "D";

export type TargetPriority = "high" | "normal" | "low";

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
  /** Priority target setting - affects how opponent targets this ship */
  priorityTarget?: TargetPriority;
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
  /** Priority target setting - affects how opponent targets this ship */
  priorityTarget: TargetPriority;
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
  /** Exact count of surviving ships per name (for discretized stats) */
  survivingCounts: Record<string, number>;
  battleOver: boolean;
  winner?: BattleSide;
}

export interface SingleBattleResult {
  winner: BattleSide;
  shipSurvival: Record<string, number>;
  /** Exact count of surviving ships per name (for discretized stats) */
  survivingCounts: Record<string, number>;
}

// ============================================================================
// Survival Distribution Types (Feature 5)
// ============================================================================

/** Discretized survival statistics for a single ship type */
export interface SurvivalDistribution {
  /** Total ships of this type in the fleet */
  totalCount: number;
  /** Map of surviving count -> probability (0-1) */
  distribution: Record<number, number>;
  /** Bucketed view for large fleets (5+ ships) */
  buckets?: {
    all: number; // 100% survived
    most: number; // >50% survived (but not all)
    some: number; // 1-50% survived
    none: number; // 0% survived
  };
  /** Average survival rate for backward compatibility */
  averageRate: number;
}

/** Extended battle results with discretized survival distributions */
export interface BattleResultsExtended extends BattleResults {
  survivalDistributions?: {
    attacker: Record<string, SurvivalDistribution>;
    defender: Record<string, SurvivalDistribution>;
  };
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
