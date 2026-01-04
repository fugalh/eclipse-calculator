/**
 * Edition Differences Reference Data
 * Second Dawn (2020) vs New Dawn (2011)
 * Extracted from Differences.html
 */

export type DifferenceCategory = "notable" | "discovery" | "minor";

export interface DifferenceItem {
  id: string;
  category: DifferenceCategory;
  title: string;
  description: string;
  /** Quantity change if applicable (e.g., "2", "8 more") */
  quantity?: string;
}

export const DIFFERENCES: DifferenceItem[] = [
  // ============================================================================
  // Notable Differences
  // ============================================================================
  {
    id: "guardian-sectors",
    category: "notable",
    title: "Guardian Sectors and Ships",
    description:
      "New Guardian sectors with Guardian ships that are stronger than Ancients but weaker than GCDS. Fill empty starting zones in games with fewer than 6 players.",
  },
  {
    id: "alternate-blueprints",
    category: "notable",
    title: "Alternate Ancient and GCDS Blueprints",
    description:
      "More difficult blueprint variants for Ancients and GCDS. Advanced tiles have two notches on their border for identification.",
  },
  {
    id: "rare-technologies",
    category: "notable",
    title: "Rare Technologies",
    description:
      "New category of technologies with unique effects. Placed in the bottom row of the Tech Tray and don't count toward regular tech tile draws.",
  },
  {
    id: "soliton-cannons",
    category: "notable",
    title: "Soliton Cannons",
    description:
      "New rare technology unlocking blue dice that deal 3 damage. Fills the gap between Orange (2) and Red (4) damage weapons.",
  },
  {
    id: "warp-portals",
    category: "notable",
    title: "Warp Portals (Optional)",
    description:
      "Optional module with sectors containing Warp Portals. All Warp Portal sectors are considered adjacent with full Wormhole Connection.",
  },
  {
    id: "advanced-grey-squares",
    category: "notable",
    title: "Advanced Grey Squares",
    description:
      "Grey population squares now have advanced variants that require Metasynthesis tech to colonize.",
  },
  {
    id: "discovery-timing",
    category: "notable",
    title: "Discovery Tile Timing",
    description:
      "Discovery tiles are now claimed before deciding whether to influence a sector, giving you information to make better decisions.",
  },
  {
    id: "first-pass-bonus",
    category: "notable",
    title: "First to Pass Gets 2 Money",
    description:
      "The first player to pass each round receives 2 Money immediately, incentivizing efficient play.",
  },
  {
    id: "eight-rounds",
    category: "notable",
    title: "8 Rounds Instead of 9",
    description:
      "Game length reduced from 9 rounds to 8, making games faster and tighter.",
  },

  // ============================================================================
  // Discovery Tile Differences
  // ============================================================================
  {
    id: "discovery-mixed-resources",
    category: "discovery",
    title: "Mixed Resources Tile",
    description: "+2 Materials, +2 Science, +3 Money discovery tile",
    quantity: "2",
  },
  {
    id: "discovery-ancient-parts",
    category: "discovery",
    title: "Ancient Ship Parts",
    description: "Discovery tiles granting unique ancient ship parts",
    quantity: "8 more",
  },
  {
    id: "discovery-orbitals",
    category: "discovery",
    title: "Ancient Orbitals",
    description: "Discovery tiles that place an Orbital and grant 2 Materials",
    quantity: "2",
  },
  {
    id: "discovery-muon-source",
    category: "discovery",
    title: "Muon Source",
    description:
      "Unique ship part that provides 2 Energy and +1 Initiative, placed outside the ship grid",
    quantity: "1",
  },
  {
    id: "discovery-warp-portal",
    category: "discovery",
    title: "Ancient Warp Portal",
    description:
      "Discovery tile that places a Warp Portal in the sector, connecting to all other Warp Portal sectors",
    quantity: "1",
  },

  // ============================================================================
  // Minor Differences
  // ============================================================================
  {
    id: "cosmetic-changes",
    category: "minor",
    title: "Cosmetic Improvements",
    description:
      "Various cosmetic differences, improved trays, and easier setup/teardown.",
  },
  {
    id: "colony-ships",
    category: "minor",
    title: "Extra Colony Ship Tiles",
    description: "2 more colony ship tiles included in the game",
    quantity: "2 more",
  },
  {
    id: "tech-tiles",
    category: "minor",
    title: "Additional Tech Tiles",
    description: "8 more technology tiles for greater variety",
    quantity: "8 more",
  },
  {
    id: "ship-part-tiles",
    category: "minor",
    title: "Ship Part Tiles",
    description:
      "128 more ship part tiles, but with an organized tray to hold them",
    quantity: "128 more",
  },
  {
    id: "discovery-tiles",
    category: "minor",
    title: "Discovery Tiles",
    description: "14 more discovery tiles for variety",
    quantity: "14 more",
  },
  {
    id: "reputation-tiles",
    category: "minor",
    title: "Reputation Tiles",
    description: "1 more reputation tile",
    quantity: "1 more",
  },
  {
    id: "sector-hexes",
    category: "minor",
    title: "Sector Hexes",
    description: "6 more sector hexes including Guardian sectors",
    quantity: "6 more",
  },
  {
    id: "three-player-sectors",
    category: "minor",
    title: "3-Player Outer Sectors",
    description: "8 outer sectors for 3 players instead of 10",
  },
  {
    id: "two-player-tech-draw",
    category: "minor",
    title: "2-Player Tech Draw",
    description:
      "For 2 players, 5 new tech tiles each round instead of 4, increasing options",
  },
  {
    id: "hydran-science",
    category: "minor",
    title: "Hydran Progress Science",
    description: "Hydran Progress gets 6 starting science (was 5)",
  },
  {
    id: "planta-resources",
    category: "minor",
    title: "Planta Resources",
    description:
      "Planta starts with 4 Materials, 3 Science, 2 Money (was 4, 4, 4)",
  },
  {
    id: "draco-tech",
    category: "minor",
    title: "Draco Starting Tech",
    description: "Descendants of Draco starts with Fusion Drive technology",
  },
  {
    id: "mechanema-materials",
    category: "minor",
    title: "Mechanema Materials",
    description: "Mechanema gets 4 starting materials (was 3)",
  },
  {
    id: "orion-materials",
    category: "minor",
    title: "Orion Materials",
    description: "Orion Hegemony gets 4 starting materials (was 5)",
  },
  {
    id: "blueprint-changes",
    category: "minor",
    title: "Blueprint Adjustments",
    description:
      "Blueprints for all species' ships may differ slightly from original edition",
  },
];

/** Get differences by category */
export function getDifferencesByCategory(
  category: DifferenceCategory,
): DifferenceItem[] {
  return DIFFERENCES.filter((diff) => diff.category === category);
}

/** Get notable differences (most important changes) */
export function getNotableDifferences(): DifferenceItem[] {
  return getDifferencesByCategory("notable");
}

/** Get discovery tile differences */
export function getDiscoveryDifferences(): DifferenceItem[] {
  return getDifferencesByCategory("discovery");
}

/** Get minor differences */
export function getMinorDifferences(): DifferenceItem[] {
  return getDifferencesByCategory("minor");
}

/** Category display info */
export const DIFFERENCE_CATEGORY_INFO = {
  notable: {
    label: "Notable Differences",
    description: "Significant gameplay changes between editions",
  },
  discovery: {
    label: "New Discovery Tiles",
    description: "New discovery tiles added in Second Dawn",
  },
  minor: {
    label: "Minor Differences",
    description: "Component counts, species tweaks, and quality of life",
  },
} as const;
