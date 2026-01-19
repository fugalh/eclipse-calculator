/**
 * Species Reference Data for Eclipse: Second Dawn for the Galaxy
 * Extracted from ECLIPSE_RULES.md
 */

import type { SpeciesId } from "@/lib/types";

export interface SpeciesData {
  id: SpeciesId;
  name: string;
  fullName: string;
  startingResources: {
    materials: number;
    science: number;
    money: number;
  };
  colonyShips: number;
  startingTechs: string[];
  tradeRatio: number;
  activations: {
    explore: number;
    research: number;
    upgrade: number;
    build: number;
    move: number;
    influence: number;
  };
  startingSector: number;
  specialAbilities: {
    name: string;
    description: string;
    isPositive: boolean;
  }[];
  /** Additional notes about blueprints or other unique characteristics */
  blueprintNotes?: string;
}

export const SPECIES: SpeciesData[] = [
  // ============================================================================
  // Terran Factions (6 variants with same stats)
  // ============================================================================
  {
    id: "terran",
    name: "Terran",
    fullName: "Terran Factions",
    startingResources: {
      materials: 4,
      science: 3,
      money: 3,
    },
    colonyShips: 3,
    startingTechs: ["starbase"],
    tradeRatio: 2,
    activations: {
      explore: 1,
      research: 1,
      upgrade: 2,
      build: 2,
      move: 3,
      influence: 2,
    },
    startingSector: 221, // 221, 223, 225, 227, 229, or 231 based on faction
    specialAbilities: [
      {
        name: "Standard Humans",
        description: "No special abilities - balanced starting position",
        isPositive: true,
      },
    ],
    blueprintNotes:
      "Terran factions: Directorate (221), Federation (223), Union (225), Republic (227), Conglomerate (229), Alliance (231)",
  },

  // ============================================================================
  // Eridani Empire
  // ============================================================================
  {
    id: "eridani",
    name: "Eridani",
    fullName: "Eridani Empire",
    startingResources: {
      materials: 4,
      science: 2,
      money: 2,
    },
    colonyShips: 3,
    startingTechs: ["gauss-shield", "fusion-drive", "plasma-cannon"],
    tradeRatio: 3,
    activations: {
      explore: 1,
      research: 1,
      upgrade: 2,
      build: 2,
      move: 2,
      influence: 2,
    },
    startingSector: 222,
    specialAbilities: [
      {
        name: "Ancient Technology",
        description: "Start with 3 technologies already researched",
        isPositive: true,
      },
      {
        name: "Reputation Head Start",
        description: "Draw two random Reputation Tiles before game starts",
        isPositive: true,
      },
      {
        name: "Limited Influence",
        description: "Start with two fewer Influence Discs",
        isPositive: false,
      },
    ],
    blueprintNotes:
      "Ship Blueprints have additional Energy Production built-in",
  },

  // ============================================================================
  // Hydran Progress
  // ============================================================================
  {
    id: "hydran",
    name: "Hydran",
    fullName: "Hydran Progress",
    startingResources: {
      materials: 2,
      science: 6,
      money: 2,
    },
    colonyShips: 3,
    startingTechs: ["advanced-labs"],
    tradeRatio: 3,
    activations: {
      explore: 1,
      research: 2,
      upgrade: 2,
      build: 2,
      move: 2,
      influence: 2,
    },
    startingSector: 224,
    specialAbilities: [
      {
        name: "Scientific Focus",
        description: "Extra Research Activation (2 total per action)",
        isPositive: true,
      },
      {
        name: "Advanced Labs",
        description:
          "Start with Advanced Labs tech and a cube on Advanced Science square",
        isPositive: true,
      },
    ],
    blueprintNotes:
      "During setup, place a Population Cube in Advanced Science Population Square on Starting Sector",
  },

  // ============================================================================
  // Planta
  // ============================================================================
  {
    id: "planta",
    name: "Planta",
    fullName: "Planta",
    startingResources: {
      materials: 4,
      science: 3,
      money: 2,
    },
    colonyShips: 4,
    startingTechs: ["starbase"],
    tradeRatio: 4,
    activations: {
      explore: 2,
      research: 1,
      upgrade: 2,
      build: 2,
      move: 2,
      influence: 2,
    },
    startingSector: 226,
    specialAbilities: [
      {
        name: "Rapid Expansion",
        description: "Extra Explore Activation (2 total per action)",
        isPositive: true,
      },
      {
        name: "Extra Colony Ship",
        description: "Start with 4 Colony Ships instead of 3",
        isPositive: true,
      },
      {
        name: "Starbase Tech",
        description: "Start with Starbase technology",
        isPositive: true,
      },
      {
        name: "Sector Bonus VP",
        description: "+1 VP for each Controlled Sector at end of game",
        isPositive: true,
      },
      {
        name: "Vulnerable Population",
        description:
          "Population Cubes automatically destroyed by opponent Ships at end of Combat Phase",
        isPositive: false,
      },
      {
        name: "Slow Ships",
        description: "Ship Blueprints have reduced Initiative Bonuses",
        isPositive: false,
      },
    ],
    blueprintNotes:
      "Ship Blueprints have additional Computers and Energy but one less Ship Part Space",
  },

  // ============================================================================
  // Descendants of Draco
  // ============================================================================
  {
    id: "draco",
    name: "Draco",
    fullName: "Descendants of Draco",
    startingResources: {
      materials: 3,
      science: 4,
      money: 2,
    },
    colonyShips: 3,
    startingTechs: ["fusion-drive"],
    tradeRatio: 3,
    activations: {
      explore: 1,
      research: 1,
      upgrade: 2,
      build: 2,
      move: 2,
      influence: 2,
    },
    startingSector: 228,
    specialAbilities: [
      {
        name: "Double Exploration",
        description:
          "When Exploring, may flip two Sectors and choose one (or none) to place",
        isPositive: true,
      },
      {
        name: "Ancient Affinity",
        description: "+1 VP per Ancient Sector you Control at end of game",
        isPositive: true,
      },
      {
        name: "Coexist with Ancients",
        description: "May have Ships in Sectors containing Ancients",
        isPositive: true,
      },
      {
        name: "Influence Ancient Sectors",
        description: "May place Influence Discs in Sectors with Ancients",
        isPositive: true,
      },
      {
        name: "Cannot Battle Ancients",
        description: "Cannot engage Ancients in combat",
        isPositive: false,
      },
      {
        name: "No Discovery from Ancients",
        description:
          "Cannot collect Discovery Tiles from Sectors containing Ancients",
        isPositive: false,
      },
    ],
    blueprintNotes: "Standard ship blueprints with Fusion Drive technology",
  },

  // ============================================================================
  // Mechanema
  // ============================================================================
  {
    id: "mechanema",
    name: "Mechanema",
    fullName: "Mechanema",
    startingResources: {
      materials: 4,
      science: 3,
      money: 3,
    },
    colonyShips: 3,
    startingTechs: ["positron-computer"],
    tradeRatio: 3,
    activations: {
      explore: 1,
      research: 1,
      upgrade: 3,
      build: 3,
      move: 2,
      influence: 2,
    },
    startingSector: 230,
    specialAbilities: [
      {
        name: "Efficient Industry",
        description: "Extra Upgrade and Build Activations (3 each per action)",
        isPositive: true,
      },
      {
        name: "Positron Computer",
        description: "Start with Positron Computer technology",
        isPositive: true,
      },
      {
        name: "Cheaper Building",
        description:
          "Reduced building costs: Interceptor 2, Cruiser 4, Dreadnought 7, Starbase 2, Orbital 3, Monolith 8",
        isPositive: true,
      },
    ],
    blueprintNotes: "Standard ship blueprints with enhanced computer systems",
  },

  // ============================================================================
  // Orion Hegemony
  // ============================================================================
  {
    id: "orion",
    name: "Orion",
    fullName: "Orion Hegemony",
    startingResources: {
      materials: 4,
      science: 3,
      money: 3,
    },
    colonyShips: 3,
    startingTechs: ["neutron-bombs", "gauss-shield"],
    tradeRatio: 4,
    activations: {
      explore: 1,
      research: 1,
      upgrade: 2,
      build: 2,
      move: 2,
      influence: 2,
    },
    startingSector: 232,
    specialAbilities: [
      {
        name: "Military Technology",
        description: "Start with Neutron Bombs and Gauss Shield technologies",
        isPositive: true,
      },
      {
        name: "Starting Cruiser",
        description:
          "Start with a Cruiser in Starting Sector instead of Interceptor",
        isPositive: true,
      },
      {
        name: "Fast Ships",
        description: "All Ship Blueprints have increased Initiative Bonuses",
        isPositive: true,
      },
      {
        name: "Inefficient Trade",
        description: "Trade ratio is 4:1 instead of standard 2:1 or 3:1",
        isPositive: false,
      },
    ],
    blueprintNotes:
      "Ship Blueprints have additional Energy Production and Initiative",
  },
];

/** Get species by ID */
export function getSpeciesById(id: SpeciesId): SpeciesData | undefined {
  return SPECIES.find((species) => species.id === id);
}

/** Get all non-Terran species */
export function getAlienSpecies(): SpeciesData[] {
  return SPECIES.filter((species) => species.id !== "terran");
}

/** Calculate effective building cost for a species */
export function getBuildingCost(
  speciesId: SpeciesId,
  buildingType:
    | "interceptor"
    | "cruiser"
    | "dreadnought"
    | "starbase"
    | "orbital"
    | "monolith",
): number {
  const standardCosts = {
    interceptor: 3,
    cruiser: 5,
    dreadnought: 8,
    starbase: 3,
    orbital: 4,
    monolith: 10,
  };

  const mechanemaCosts = {
    interceptor: 2,
    cruiser: 4,
    dreadnought: 7,
    starbase: 2,
    orbital: 3,
    monolith: 8,
  };

  return speciesId === "mechanema"
    ? mechanemaCosts[buildingType]
    : standardCosts[buildingType];
}

/** Species comparison data for side-by-side view */
export interface SpeciesComparisonRow {
  label: string;
  values: Record<SpeciesId, string | number>;
}

export function getSpeciesComparisonData(): SpeciesComparisonRow[] {
  return [
    {
      label: "Starting Materials",
      values: Object.fromEntries(
        SPECIES.map((s) => [s.id, s.startingResources.materials]),
      ) as Record<SpeciesId, number>,
    },
    {
      label: "Starting Science",
      values: Object.fromEntries(
        SPECIES.map((s) => [s.id, s.startingResources.science]),
      ) as Record<SpeciesId, number>,
    },
    {
      label: "Starting Money",
      values: Object.fromEntries(
        SPECIES.map((s) => [s.id, s.startingResources.money]),
      ) as Record<SpeciesId, number>,
    },
    {
      label: "Colony Ships",
      values: Object.fromEntries(
        SPECIES.map((s) => [s.id, s.colonyShips]),
      ) as Record<SpeciesId, number>,
    },
    {
      label: "Trade Ratio",
      values: Object.fromEntries(
        SPECIES.map((s) => [s.id, `${s.tradeRatio}:1`]),
      ) as Record<SpeciesId, string>,
    },
    {
      label: "Starting Techs",
      values: Object.fromEntries(
        SPECIES.map((s) => [s.id, s.startingTechs.length || "None"]),
      ) as Record<SpeciesId, string | number>,
    },
  ];
}
