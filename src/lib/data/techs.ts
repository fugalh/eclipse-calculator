/**
 * Technology Reference Data for Eclipse: Second Dawn for the Galaxy
 * Extracted from ECLIPSE_RULES.md and Techs.html
 */

import type { TechCategory } from "@/lib/types";

export interface TechData {
  id: string;
  name: string;
  category: TechCategory;
  scienceCost: number;
  minCost: number;
  effect: string;
  /** Symbolic notation matching game aids (e.g., ".. oo" for 2 energy, 2 yellow damage) */
  notation: string;
  /** Related ship parts unlocked by this tech */
  unlocksPartIds?: string[];
  techType: "ship-part" | "instant" | "build" | "permanent";
}

/**
 * Notation Legend:
 * .  = Energy Cost
 * z  = Energy Source/Production
 * ^  = Initiative
 * >  = Drive/Movement
 * *  = Hull
 * -  = Shield
 * +  = Computer hit bonus
 * ø  = Missile damage die
 * o  = Cannon damage die
 *
 * Colors (for damage dice):
 * Yellow = 1 damage
 * Orange = 2 damage
 * Blue = 3 damage
 * Red = 4 damage
 */

export const TECHS: TechData[] = [
  // ============================================================================
  // Military Technologies (8)
  // ============================================================================
  {
    id: "neutron-bombs",
    name: "Neutron Bombs",
    category: "military",
    scienceCost: 2,
    minCost: 2,
    effect:
      "When Attacking Population, all Population Cubes in Sector destroyed automatically",
    notation: "",
    techType: "permanent",
  },
  {
    id: "starbase",
    name: "Starbase",
    category: "military",
    scienceCost: 4,
    minCost: 2,
    effect: "May Build Starbases (3 Materials)",
    notation: "",
    techType: "build",
  },
  {
    id: "plasma-cannon",
    name: "Plasma Cannon",
    category: "military",
    scienceCost: 6,
    minCost: 4,
    effect: "May Upgrade with Plasma Cannon Ship Parts",
    notation: ".. oo",
    unlocksPartIds: ["plasma-cannon"],
    techType: "ship-part",
  },
  {
    id: "phase-shield",
    name: "Phase Shield",
    category: "military",
    scienceCost: 8,
    minCost: 5,
    effect: "May Upgrade with Phase Shield Ship Parts",
    notation: ". -2",
    unlocksPartIds: ["phase-shield"],
    techType: "ship-part",
  },
  {
    id: "advanced-mining",
    name: "Advanced Mining",
    category: "military",
    scienceCost: 10,
    minCost: 6,
    effect:
      "May place Population Cubes in Advanced Materials Population Squares",
    notation: "",
    techType: "permanent",
  },
  {
    id: "tachyon-source",
    name: "Tachyon Source",
    category: "military",
    scienceCost: 12,
    minCost: 6,
    effect: "May Upgrade with Tachyon Source Ship Parts",
    notation: "9z",
    unlocksPartIds: ["tachyon-source"],
    techType: "ship-part",
  },
  {
    id: "gluon-computer",
    name: "Gluon Computer",
    category: "military",
    scienceCost: 14,
    minCost: 7,
    effect: "May Upgrade with Gluon Computer Ship Parts",
    notation: ".. +3",
    unlocksPartIds: ["gluon-computer"],
    techType: "ship-part",
  },
  {
    id: "plasma-missile",
    name: "Plasma Missile",
    category: "military",
    scienceCost: 16,
    minCost: 8,
    effect: "May Upgrade with Plasma Missile Ship Parts",
    notation: ". øø,øø",
    unlocksPartIds: ["plasma-missile"],
    techType: "ship-part",
  },

  // ============================================================================
  // Grid Technologies (8)
  // ============================================================================
  {
    id: "gauss-shield",
    name: "Gauss Shield",
    category: "grid",
    scienceCost: 2,
    minCost: 2,
    effect: "May Upgrade with Gauss Shield Ship Parts",
    notation: "-1",
    unlocksPartIds: ["gauss-shield"],
    techType: "ship-part",
  },
  {
    id: "fusion-source",
    name: "Fusion Source",
    category: "grid",
    scienceCost: 4,
    minCost: 3,
    effect: "May Upgrade with Fusion Source Ship Parts",
    notation: "6z",
    unlocksPartIds: ["fusion-source"],
    techType: "ship-part",
  },
  {
    id: "improved-hull",
    name: "Improved Hull",
    category: "grid",
    scienceCost: 6,
    minCost: 4,
    effect: "May Upgrade with Improved Hull Ship Parts",
    notation: "**",
    unlocksPartIds: ["improved-hull"],
    techType: "ship-part",
  },
  {
    id: "positron-computer",
    name: "Positron Computer",
    category: "grid",
    scienceCost: 8,
    minCost: 5,
    effect: "May Upgrade with Positron Computer Ship Parts",
    notation: ". +2",
    unlocksPartIds: ["positron-computer"],
    techType: "ship-part",
  },
  {
    id: "advanced-economy",
    name: "Advanced Economy",
    category: "grid",
    scienceCost: 10,
    minCost: 6,
    effect: "May place Population Cubes in Advanced Money Population Squares",
    notation: "",
    techType: "permanent",
  },
  {
    id: "tachyon-drive",
    name: "Tachyon Drive",
    category: "grid",
    scienceCost: 12,
    minCost: 6,
    effect: "May Upgrade with Tachyon Drive Ship Parts",
    notation: "...^^^>>>",
    unlocksPartIds: ["tachyon-drive"],
    techType: "ship-part",
  },
  {
    id: "antimatter-cannon",
    name: "Antimatter Cannon",
    category: "grid",
    scienceCost: 14,
    minCost: 7,
    effect: "May Upgrade with Antimatter Cannon Ship Parts",
    notation: ".... oooo",
    unlocksPartIds: ["antimatter-cannon"],
    techType: "ship-part",
  },
  {
    id: "quantum-grid",
    name: "Quantum Grid",
    category: "grid",
    scienceCost: 16,
    minCost: 8,
    effect: "Receive two additional Influence Discs immediately",
    notation: "",
    techType: "instant",
  },

  // ============================================================================
  // Nano Technologies (8)
  // ============================================================================
  {
    id: "nanorobots",
    name: "Nanorobots",
    category: "nano",
    scienceCost: 2,
    minCost: 2,
    effect: "One extra Activation when taking Build Action",
    notation: "",
    techType: "permanent",
  },
  {
    id: "fusion-drive",
    name: "Fusion Drive",
    category: "nano",
    scienceCost: 4,
    minCost: 3,
    effect: "May Upgrade with Fusion Drive Ship Parts",
    notation: "..^^>>",
    unlocksPartIds: ["fusion-drive"],
    techType: "ship-part",
  },
  {
    id: "orbital",
    name: "Orbital",
    category: "nano",
    scienceCost: 6,
    minCost: 4,
    effect: "May Build Orbitals (4 Materials)",
    notation: "",
    techType: "build",
  },
  {
    id: "advanced-robotics",
    name: "Advanced Robotics",
    category: "nano",
    scienceCost: 8,
    minCost: 5,
    effect: "Receive one additional Influence Disc immediately",
    notation: "",
    techType: "instant",
  },
  {
    id: "advanced-labs",
    name: "Advanced Labs",
    category: "nano",
    scienceCost: 10,
    minCost: 6,
    effect: "May place Population Cubes in Advanced Science Population Squares",
    notation: "",
    techType: "permanent",
  },
  {
    id: "monolith",
    name: "Monolith",
    category: "nano",
    scienceCost: 12,
    minCost: 6,
    effect: "May Build Monoliths (10 Materials, 3 VP)",
    notation: "",
    techType: "build",
  },
  {
    id: "wormhole-generator",
    name: "Wormhole Generator",
    category: "nano",
    scienceCost: 14,
    minCost: 7,
    effect:
      "May Explore, Move to, and Influence adjacent Sectors if edges contain at least one Wormhole",
    notation: "",
    techType: "permanent",
  },
  {
    id: "artifact-key",
    name: "Artifact Key",
    category: "nano",
    scienceCost: 16,
    minCost: 8,
    effect:
      "For each Artifact on Sectors you Control, immediately gain 5 Resources of a single type",
    notation: "",
    techType: "instant",
  },

  // ============================================================================
  // Rare Technologies (14)
  // ============================================================================
  {
    id: "antimatter-splitter",
    name: "Antimatter Splitter",
    category: "rare",
    scienceCost: 6,
    minCost: 5,
    effect: "Split damage from Antimatter Cannons freely over targets",
    notation: "",
    techType: "permanent",
  },
  {
    id: "conifold-field",
    name: "Conifold Field",
    category: "rare",
    scienceCost: 5,
    minCost: 5,
    effect: "May Upgrade with Conifold Field Ship Parts",
    notation: "..***",
    unlocksPartIds: ["conifold-field"],
    techType: "ship-part",
  },
  {
    id: "neutron-absorber",
    name: "Neutron Absorber",
    category: "rare",
    scienceCost: 4,
    minCost: 4,
    effect: "Enemy Neutron Bombs have no effect on you",
    notation: "",
    techType: "permanent",
  },
  {
    id: "absorption-shield",
    name: "Absorption Shield",
    category: "rare",
    scienceCost: 7,
    minCost: 6,
    effect: "May Upgrade with Absorption Shield Ship Parts",
    notation: "4z -1",
    unlocksPartIds: ["absorption-shield"],
    techType: "ship-part",
  },
  {
    id: "cloaking-device",
    name: "Cloaking Device",
    category: "rare",
    scienceCost: 8,
    minCost: 6,
    effect: "Two Ships required to Pin each of your Ships",
    notation: "",
    techType: "permanent",
  },
  {
    id: "improved-logistics",
    name: "Improved Logistics",
    category: "rare",
    scienceCost: 10,
    minCost: 8,
    effect: "Gain 1 additional Move Activation during each Move Action",
    notation: "",
    techType: "permanent",
  },
  {
    id: "sentient-hull",
    name: "Sentient Hull",
    category: "rare",
    scienceCost: 7,
    minCost: 6,
    effect: "May Upgrade with Sentient Hull Ship Parts",
    notation: ".* +1",
    unlocksPartIds: ["sentient-hull"],
    techType: "ship-part",
  },
  {
    id: "soliton-cannon",
    name: "Soliton Cannon",
    category: "rare",
    scienceCost: 9,
    minCost: 7,
    effect: "May Upgrade with Soliton Cannon Ship Parts",
    notation: "... ooo",
    unlocksPartIds: ["soliton-cannon"],
    techType: "ship-part",
  },
  {
    id: "transition-drive",
    name: "Transition Drive",
    category: "rare",
    scienceCost: 9,
    minCost: 7,
    effect: "May Upgrade with Transition Drive Ship Parts",
    notation: ">>>",
    unlocksPartIds: ["transition-drive"],
    techType: "ship-part",
  },
  {
    id: "warp-portal",
    name: "Warp Portal",
    category: "rare",
    scienceCost: 6,
    minCost: 5,
    effect:
      "Place Warp Portal Tile on Sector you Control; connects to all Warp Portal Sectors; worth 1 VP",
    notation: "",
    techType: "instant",
  },
  {
    id: "flux-missile",
    name: "Flux Missile",
    category: "rare",
    scienceCost: 11,
    minCost: 8,
    effect: "May Upgrade with Flux Missile Ship Parts",
    notation: "^ ø,ø",
    unlocksPartIds: ["flux-missile"],
    techType: "ship-part",
  },
  {
    id: "pico-modulator",
    name: "Pico Modulator",
    category: "rare",
    scienceCost: 10,
    minCost: 8,
    effect: "Gain 2 additional Upgrade Activations during each Upgrade Action",
    notation: "",
    techType: "permanent",
  },
  {
    id: "ancient-labs",
    name: "Ancient Labs",
    category: "rare",
    scienceCost: 8,
    minCost: 6,
    effect: "Immediately draw and resolve one Discovery Tile",
    notation: "",
    techType: "instant",
  },
  {
    id: "zero-point-source",
    name: "Zero-Point Source",
    category: "rare",
    scienceCost: 15,
    minCost: 10,
    effect: "May Upgrade with Zero-Point Source Ship Parts",
    notation: "12z",
    unlocksPartIds: ["zero-point-source"],
    techType: "ship-part",
  },
  {
    id: "metasynthesis",
    name: "Metasynthesis",
    category: "rare",
    scienceCost: 12,
    minCost: 9,
    effect: "May place Population Cubes in any Advanced Population Squares",
    notation: "",
    techType: "permanent",
  },
];

/** Get techs filtered by category */
export function getTechsByCategory(category: TechCategory): TechData[] {
  return TECHS.filter((tech) => tech.category === category);
}

/** Get tech by ID */
export function getTechById(id: string): TechData | undefined {
  return TECHS.find((tech) => tech.id === id);
}

/** Category display info for UI */
export const TECH_CATEGORY_INFO = {
  military: {
    label: "Military",
    symbol: "＊",
    color: "bg-orange-500",
    textColor: "text-orange-500",
  },
  grid: {
    label: "Grid",
    symbol: "#",
    color: "bg-green-500",
    textColor: "text-green-500",
  },
  nano: {
    label: "Nano",
    symbol: "⛭",
    color: "bg-zinc-400",
    textColor: "text-zinc-400",
  },
  rare: {
    label: "Rare",
    symbol: "○",
    color: "bg-purple-500",
    textColor: "text-purple-500",
  },
} as const;
