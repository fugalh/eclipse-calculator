/**
 * Reference Page Types for Eclipse Calculator
 * Types for the quick reference pages (Phase 2)
 */

import type { TechCategory, SpeciesId, ShipType } from "./game";

// ============================================================================
// Reference Categories
// ============================================================================

export type ReferenceCategory =
  | "technologies"
  | "ship-parts"
  | "species"
  | "combat"
  | "differences";

// ============================================================================
// Tech Reference Types
// ============================================================================

export interface TechReference {
  id: string;
  name: string;
  category: TechCategory;
  scienceCost: number;
  minCost: number;
  description: string;
  effects: string[];
  relatedParts?: string[];
  relatedTechs?: string[];
}

// ============================================================================
// Ship Part Reference Types
// ============================================================================

export interface ShipPartReference {
  id: string;
  name: string;
  category: "weapon" | "defense" | "propulsion" | "power";
  stats: Record<string, string | number>;
  description: string;
  source: "starting" | "technology" | "ancient" | "discovery";
  relatedTechs?: string[];
}

// ============================================================================
// Species Reference Types
// ============================================================================

export interface SpeciesReference {
  id: SpeciesId;
  name: string;
  description: string;
  startingResources: {
    materials: number;
    science: number;
    money: number;
  };
  startingTechs: string[];
  specialAbilities: {
    name: string;
    description: string;
  }[];
  tradeRatio: string;
  shipBlueprints: {
    shipType: ShipType;
    slots: string[];
  }[];
}

// ============================================================================
// Combat Rule Reference Types
// ============================================================================

export interface CombatRuleReference {
  id: string;
  heading: string;
  content: string;
  examples?: string[];
  relatedRules?: string[];
}

// ============================================================================
// Cross-Linking Types
// ============================================================================

export interface ReferenceLink {
  type: ReferenceCategory;
  id: string;
  label: string;
  href: string;
}

export interface ReferenceSection {
  id: string;
  title: string;
  description?: string;
  items: ReferenceLink[];
}
