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
  getAllParts,
  getPartsByType,
  getPartsBySource,
  getPartById,
  PART_TYPE_INFO,
  PART_SOURCE_INFO,
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

// Hoisted RegExp patterns for parseNotationToDescription
const ENERGY_COST_REGEX = /\./g;
const ENERGY_PROD_REGEX = /(\d+)z/;
const INITIATIVE_REGEX = /\^/g;
const MOVEMENT_REGEX = />/g;
const HULL_REGEX = /⍟/g;
const SHIELD_NUMBER_REGEX = /-(\d+)/;
const SHIELD_REGEX = /-/g;
const COMPUTER_REGEX = /\+(\d+)/;
const MISSILE_REGEX = /ø/g;
const CANNON_REGEX = /o/g;

/**
 * Parse notation string into descriptive text
 * e.g., ".. oo" -> "Energy: 2, Yellow Cannon: 2 dice"
 */
export function parseNotationToDescription(notation: string): string {
  if (!notation) return "";

  const parts: string[] = [];

  // Count each symbol
  const energyCost = (notation.match(ENERGY_COST_REGEX) || []).length;
  const energyProd = notation.match(ENERGY_PROD_REGEX)?.[1];
  const initiative = (notation.match(INITIATIVE_REGEX) || []).length;
  const movement = (notation.match(MOVEMENT_REGEX) || []).length;
  const hull = (notation.match(HULL_REGEX) || []).length;
  const shield =
    notation.match(SHIELD_NUMBER_REGEX)?.[1] ||
    (notation.match(SHIELD_REGEX) || []).length;
  const computer = notation.match(COMPUTER_REGEX)?.[1];
  const missiles = (notation.match(MISSILE_REGEX) || []).length;
  const cannons = (notation.match(CANNON_REGEX) || []).length;

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
