/**
 * Combat Rules Reference Data for Eclipse: Second Dawn for the Galaxy
 * Extracted from ECLIPSE_RULES.md
 */

export interface CombatRuleSection {
  id: string;
  title: string;
  content: string;
  subsections?: CombatRuleSection[];
  examples?: string[];
  tips?: string[];
}

export const COMBAT_RULES: CombatRuleSection[] = [
  // ============================================================================
  // Combat Phase Overview
  // ============================================================================
  {
    id: "overview",
    title: "Combat Phase Overview",
    content:
      "The Combat Phase consists of six steps executed in order. All battles in a sector are resolved before moving to the next sector.",
    subsections: [
      {
        id: "step-1",
        title: "1. Determine Battles",
        content: "Identify all Sectors containing opposing Ships.",
      },
      {
        id: "step-2",
        title: "2. Resolve Battles",
        content:
          "Resolve battles by Sector Number in descending numerical order.",
      },
      {
        id: "step-3",
        title: "3. Attack Population",
        content: "Ships attack opponent Population Cubes in their Sector.",
      },
      {
        id: "step-4",
        title: "4. Influence Sectors",
        content:
          "Players may take Control of Uncontrolled Sectors where they have Ships.",
      },
      {
        id: "step-5",
        title: "5. Discovery Tiles",
        content: "Undefended Discovery Tiles are claimed.",
      },
      {
        id: "step-6",
        title: "6. Repair Damage",
        content:
          "All Ship damage is reset by returning Damage Cubes to supply.",
      },
    ],
  },

  // ============================================================================
  // Battle Order
  // ============================================================================
  {
    id: "battle-order",
    title: "Battle Order",
    content:
      "Battles are resolved in descending Sector Number order. Higher numbered sectors fight first.",
    examples: [
      "Sector 301 battles before Sector 225",
      "Galactic Center (001) is always last",
    ],
    subsections: [
      {
        id: "multi-opponent",
        title: "Multiple Opponents",
        content:
          "When multiple players have Ships in the same Sector, battles are resolved between two players at a time in reverse order of entry into the Sector. Non-player Ships (Ancients, Guardians, GCDS) battle the last surviving player.",
      },
    ],
  },

  // ============================================================================
  // Attacker vs Defender
  // ============================================================================
  {
    id: "attacker-defender",
    title: "Attacker vs Defender",
    content:
      "Determining who is the Attacker and Defender affects Initiative tie-breakers and Retreat options.",
    subsections: [
      {
        id: "defender-rules",
        title: "Who is the Defender",
        content:
          "The player who first entered the Sector is the Defender. A player who Controls the Sector is ALWAYS the Defender regardless of entry order. Ancients, Guardians, and GCDS are always Defenders.",
      },
      {
        id: "attacker-rules",
        title: "Who is the Attacker",
        content: "The player who entered the Sector last is the Attacker.",
      },
    ],
    tips: [
      "Defenders win Initiative ties",
      "Attackers must Retreat in stalemate situations",
    ],
  },

  // ============================================================================
  // Initiative
  // ============================================================================
  {
    id: "initiative",
    title: "Initiative",
    content:
      "Initiative determines the order of Attack in an Engagement Round. Ships with higher Initiative fire first, potentially destroying enemy ships before they can return fire.",
    subsections: [
      {
        id: "calculate-initiative",
        title: "Calculating Initiative",
        content:
          "Total the Initiative Symbols on the Blueprint of each Ship type. This includes base ship Initiative bonuses plus any from Drive parts, Computers, or other components.",
      },
      {
        id: "initiative-ties",
        title: "Resolving Ties",
        content:
          "Initiative ties between opponents are resolved in favor of the Defender. You choose the order for your own Ships that are tied.",
      },
    ],
    tips: [
      "Interceptors have +2 base Initiative",
      "Cruisers have +1 base Initiative",
      "Starbases have +4 base Initiative (but cannot move)",
      "Drive parts add Initiative equal to their movement value",
    ],
  },

  // ============================================================================
  // Missiles
  // ============================================================================
  {
    id: "missiles",
    title: "Firing Missiles",
    content:
      "Missiles fire only once per battle, before the first Engagement Round. All Ship types with Missiles fire in Initiative order.",
    subsections: [
      {
        id: "missile-procedure",
        title: "Missile Procedure",
        content:
          "Roll dice of the corresponding color equal to the number of Die Symbols on Missile Ship Parts. Resolve hits using normal rules.",
      },
    ],
    tips: [
      "Missiles only fire in the first round",
      "Missile Shield (+2 shields vs missiles) only applies here",
      "Consider Missiles for alpha-strike builds",
    ],
  },

  // ============================================================================
  // Engagement Rounds
  // ============================================================================
  {
    id: "engagement",
    title: "Engagement Rounds",
    content:
      "Each Engagement Round, Ship types are Activated in Initiative order. When Activated, the owning player decides whether to Attack or Retreat. Engagement Rounds repeat until all of one player's Ships have Retreated or are destroyed.",
    subsections: [
      {
        id: "attacking",
        title: "Attacking",
        content:
          "In Initiative order, each Ship type may Attack by rolling one die of the corresponding color for every Die Symbol on their Ship Blueprint. All dice of all colors for each Ship type are rolled simultaneously. After rolling, each die is assigned to a single opponent Ship.",
      },
      {
        id: "retreating",
        title: "Retreating",
        content:
          "To attempt Retreat during a Ship Activation, move all your Ships of that type to the edge of a neighboring Sector with a Wormhole Connection. You may only Retreat to a Sector you Control where no opponent Ships are present. On next Ship Activation, Retreating Ships may complete Retreat by moving to the neighboring Sector.",
      },
    ],
    tips: [
      "Retreating Ships cannot Attack but can still be Attacked",
      "If all Ships attempt Retreat, you don't get participation Reputation",
    ],
  },

  // ============================================================================
  // Hitting
  // ============================================================================
  {
    id: "hitting",
    title: "Hitting",
    content:
      "After rolling dice, determine if each die scores a Hit on its assigned target.",
    subsections: [
      {
        id: "hit-results",
        title: "Die Results",
        content:
          "Bursts (★): Always a Hit. Blank face: Always a Miss. Number: Calculate Hit Value.",
      },
      {
        id: "hit-calculation",
        title: "Hit Value Calculation",
        content:
          "Hit Value = Die Roll + Your Computers - Target's Shields. If Hit Value ≥ 6, it's a Hit.",
        examples: [
          "Roll 4 + Computer 2 - Shield 1 = 5 → Miss",
          "Roll 5 + Computer 2 - Shield 1 = 6 → Hit",
          "Roll 1 → Always Miss (natural 1)",
        ],
      },
    ],
    tips: [
      "Burst symbol (★) always hits regardless of modifiers",
      "Natural 1 always misses regardless of computers",
      "High shields can make ships nearly immune to low-computer attacks",
    ],
  },

  // ============================================================================
  // Damage
  // ============================================================================
  {
    id: "damage",
    title: "Damage",
    content:
      "Hits inflict damage equal to the damage value of the weapon (Yellow=1, Orange=2, Blue=3, Red=4).",
    subsections: [
      {
        id: "ship-destruction",
        title: "Ship Destruction",
        content:
          "Ships receiving damage greater than their Hull Value are destroyed. Damage exceeding a Ship's Hull Value cannot be assigned to another Ship.",
      },
      {
        id: "damage-tracking",
        title: "Tracking Damage",
        content:
          "Mark damage on surviving Ships with Damage Cubes. At the end of Combat Phase, all damage is repaired.",
      },
    ],
    tips: [
      "Overkill damage is wasted - target appropriately",
      "Antimatter Splitter tech lets you split Red die damage",
    ],
  },

  // ============================================================================
  // Reputation Tiles
  // ============================================================================
  {
    id: "reputation",
    title: "Reputation Tiles",
    content:
      "After all battles in a Sector, each participating player draws Reputation Tiles based on their contributions.",
    subsections: [
      {
        id: "reputation-sources",
        title: "Reputation Sources",
        content:
          "Participating in battle: 1 tile. Each Interceptor/Starbase/Ancient destroyed: 1 tile. Each Cruiser/Guardian destroyed: 2 tiles. Each Dreadnought destroyed: 3 tiles. Destroying GCDS: 3 tiles. Maximum 5 tiles per battle.",
      },
      {
        id: "reputation-selection",
        title: "Selecting Tiles",
        content:
          "Drawing is done in order of player entry. Draw Reputation Tiles, select up to one to place facedown on Reputation Track, return others to bag.",
      },
    ],
    tips: [
      "Retreat Penalty: If all your remaining Ships attempt Retreat, you don't draw for participating",
      "You still draw tiles for ships you destroyed even if retreating",
      "Reputation Tiles are worth 1-4 VP each at game end",
    ],
  },

  // ============================================================================
  // Special Rules
  // ============================================================================
  {
    id: "special-rules",
    title: "Special Combat Rules",
    content: "Additional rules that apply in specific situations.",
    subsections: [
      {
        id: "stalemate",
        title: "Stalemate",
        content:
          "If neither player can destroy the other's Ships (all Ships unarmed or only have Missiles after first round), the Attacker must Retreat. If Attacker cannot Retreat, their Ships are destroyed.",
      },
      {
        id: "npc-combat",
        title: "Non-Player Opponents",
        content:
          "When battling Ancients, Guardians, or GCDS: Any other player rolls their dice. Dice are assigned to destroy your Ships from largest to smallest if possible. Otherwise, inflict maximum damage to largest Ships first.",
      },
      {
        id: "attack-population",
        title: "Attack Population",
        content:
          "At end of Combat Phase, remaining Ships attack opponent Population Cubes in their Sector. Each Ship may attack once with non-Missile weapons. Use normal rules to Hit (Population Cubes have 0 Shield Value). Each damage destroys one Population Cube.",
      },
    ],
  },

  // ============================================================================
  // Quick Reference
  // ============================================================================
  {
    id: "quick-reference",
    title: "Quick Reference",
    content: "Key values and formulas for combat.",
    subsections: [
      {
        id: "dice-damage",
        title: "Dice Damage Values",
        content: "Yellow: 1, Orange: 2, Blue: 3, Red: 4",
      },
      {
        id: "hit-formula",
        title: "Hit Formula",
        content: "Die Roll + Computers - Shields ≥ 6 = Hit",
      },
      {
        id: "base-initiative",
        title: "Base Ship Initiative",
        content: "Interceptor: +2, Cruiser: +1, Dreadnought: 0, Starbase: +4",
      },
    ],
  },
];

/** Get combat rule section by ID */
export function getCombatRuleById(id: string): CombatRuleSection | undefined {
  // Search top level
  const topLevel = COMBAT_RULES.find((rule) => rule.id === id);
  if (topLevel) return topLevel;

  // Search subsections
  for (const rule of COMBAT_RULES) {
    if (rule.subsections) {
      const subsection = rule.subsections.find((sub) => sub.id === id);
      if (subsection) return subsection;
    }
  }
  return undefined;
}

/** Get all top-level combat rule sections */
export function getCombatRuleSections(): CombatRuleSection[] {
  return COMBAT_RULES;
}
