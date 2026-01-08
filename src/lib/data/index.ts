/**
 * Reference Data Barrel Export
 * Phase 2: Quick Reference Guides
 */

// Technologies
export {
  TECHS,
  getTechsByCategory,
  getTechById,
  TECH_CATEGORY_INFO,
  type TechData,
} from "./techs";

// Ship Parts
export {
  STARTING_PARTS,
  TECH_PARTS,
  ANCIENT_PARTS,
  ALL_PARTS,
  getPartsByType,
  getPartsBySource,
  getPartById,
  PART_TYPE_INFO,
  DAMAGE_COLOR_INFO,
  type PartSource,
  type DamageColor,
  type ShipPartData,
  type CannonPartData,
  type MissilePartData,
  type ComputerPartData,
  type ShieldPartData,
  type HullPartData,
  type DrivePartData,
  type SourcePartData,
  type AnyShipPartData,
} from "./ship-parts";

// Species
export {
  SPECIES,
  getSpeciesById,
  getAlienSpecies,
  getBuildingCost,
  getSpeciesComparisonData,
  type SpeciesData,
  type SpeciesComparisonRow,
} from "./species";

// Combat Rules
export {
  COMBAT_RULES,
  getCombatRuleById,
  getCombatRuleSections,
  type CombatRuleSection,
} from "./combat-rules";

// Edition Differences
export {
  DIFFERENCES,
  getDifferencesByCategory,
  getNotableDifferences,
  getDiscoveryDifferences,
  getMinorDifferences,
  DIFFERENCE_CATEGORY_INFO,
  type DifferenceCategory,
  type DifferenceItem,
} from "./differences";

// ============================================================================
// Notation Helpers
// ============================================================================

/**
 * Notation Legend for symbolic display
 * Used to render compact game aid notation
 */
export const NOTATION_LEGEND = {
  ".": {
    symbol: ".",
    meaning: "Energy Cost",
    description: "Consumes 1 energy",
  },
  z: { symbol: "z", meaning: "Energy Source", description: "Produces energy" },
  "^": {
    symbol: "^",
    meaning: "Initiative",
    description: "+1 Initiative bonus",
  },
  ">": { symbol: ">", meaning: "Drive", description: "+1 Movement" },
  "⍟": { symbol: "⍟", meaning: "Hull", description: "+1 Hull point" },
  "-": {
    symbol: "-",
    meaning: "Shield",
    description: "-1 to opponent hit rolls",
  },
  "+": { symbol: "+", meaning: "Computer", description: "+1 to hit rolls" },
  ø: { symbol: "ø", meaning: "Missile", description: "Missile damage die" },
  o: { symbol: "o", meaning: "Cannon", description: "Cannon damage die" },
} as const;

/**
 * Parse notation string into descriptive text
 * e.g., ".. oo" -> "Energy: 2, Yellow Cannon: 2 dice"
 */
export function parseNotationToDescription(notation: string): string {
  if (!notation) return "";

  const parts: string[] = [];

  // Count each symbol
  const energyCost = (notation.match(/\./g) || []).length;
  const energyProd = notation.match(/(\d+)z/)?.[1];
  const initiative = (notation.match(/\^/g) || []).length;
  const movement = (notation.match(/>/g) || []).length;
  const hull = (notation.match(/⍟/g) || []).length;
  const shield =
    notation.match(/-(\d+)/)?.[1] || (notation.match(/-/g) || []).length;
  const computer = notation.match(/\+(\d+)/)?.[1];
  const missiles = (notation.match(/ø/g) || []).length;
  const cannons = (notation.match(/o/g) || []).length;

  if (energyCost > 0) parts.push(`Energy: -${energyCost}`);
  if (energyProd) parts.push(`Energy: +${energyProd}`);
  if (initiative > 0) parts.push(`Initiative: +${initiative}`);
  if (movement > 0) parts.push(`Movement: ${movement}`);
  if (hull > 0) parts.push(`Hull: +${hull}`);
  if (shield) parts.push(`Shield: -${shield}`);
  if (computer) parts.push(`Computer: +${computer}`);
  if (missiles > 0) parts.push(`Missiles: ${missiles} dice`);
  if (cannons > 0) parts.push(`Cannon: ${cannons} dice`);

  return parts.join(", ");
}
