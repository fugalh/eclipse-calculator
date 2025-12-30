/**
 * Rules Index
 * Pre-parsed sections from ECLIPSE_RULES.md for search
 */

import type { ParsedSection } from "@/lib/types";

/**
 * Static rules index parsed from ECLIPSE_RULES.md
 * Each section has multiple categories for cross-referencing
 */
export const RULES_INDEX: ParsedSection[] = [
  {
    id: "game-overview",
    heading: "Game Overview",
    level: 2,
    content: `Eclipse places you in control of a vast interstellar civilization, competing for domination with its rivals. Each Round you expand your civilization by Exploring and colonizing new Sectors, Researching Technologies, and Building Ships to wage war. After eight Rounds the game ends, and victory is awarded to the player with the most Victory Points (VP).

VP are gained from:
- Fighting battles (Reputation Tiles)
- Forming Diplomatic Relations (Ambassador Tiles)
- Controlling Sectors
- Controlling Monoliths
- Making Discoveries
- Researching Technologies`,
    categories: ["game-concepts", "scoring"],
  },
  {
    id: "actions-and-activations",
    heading: "Actions and Activations",
    level: 3,
    content: `During each game Round, players take turns selecting and resolving individual Actions until all players Pass. Actions are comprised of a number of Activations that correspond to your Species and the Techs you have Researched. Each Activation allows you to perform an activity associated with the chosen Action.`,
    categories: ["game-concepts", "actions"],
    parentId: "game-concepts",
  },
  {
    id: "resources",
    heading: "Resources",
    level: 3,
    content: `Sectors produce up to three kinds of Resources:

| Resource | Symbol | Used For |
|----------|--------|----------|
| Materials | Orange | Building new Ships and Structures |
| Science | Pink | Researching new Technologies |
| Money | Brown | Controlling Sectors and taking Actions |

The amount of each Resource you have is marked with a Storage Marker on your Storage Track. When you Produce or gain Resources, move the appropriate Storage Marker forward. When you Pay Resources, move it backward.

Storage Overflow: If you ever have more than 40 of one kind of Resource, turn the Storage Marker so that the four-pointed end faces the center of the Control Board, indicating you have 40 plus the Storage Track value.`,
    categories: ["game-concepts", "upkeep"],
    parentId: "game-concepts",
  },
  {
    id: "trade",
    heading: "Trade",
    level: 3,
    content: `At any time, as many times as you choose and are able, you may Pay the number of one Resource indicated by the Trade Value on your Species Board to gain one Resource of any other kind.`,
    categories: ["game-concepts"],
    parentId: "game-concepts",
  },
  {
    id: "population-cubes",
    heading: "Population Cubes",
    level: 3,
    content: `Population Cubes placed on Sectors Produce Resources. The highest value empty square on each Population Track shows how many Resources of each kind you will Produce during the Upkeep Phase.`,
    categories: ["game-concepts", "upkeep"],
    parentId: "game-concepts",
  },
  {
    id: "colony-ships",
    heading: "Colony Ships",
    level: 3,
    content: `Colony Ships are used to place Population Cubes on Population Squares in Sectors you Control. Colony Ships are the only way to move Population Cubes to Sectors.`,
    categories: ["game-concepts", "actions"],
    parentId: "game-concepts",
  },
  {
    id: "influence-discs",
    heading: "Influence Discs",
    level: 3,
    content: `Influence Discs mark the Sectors your civilization Controls. Each Action you take requires you to move an Influence Disc from your Influence Track to the corresponding Action Space.

- The leftmost Influence Disc is always used when moving from your Influence Track
- When returned to the Influence Track, discs are placed on the rightmost available space
- The rightmost empty space shows how much Money you must Pay at the end of the Round`,
    categories: ["game-concepts", "actions", "upkeep"],
    parentId: "game-concepts",
  },
  {
    id: "control",
    heading: "Control",
    level: 3,
    content: `The player with an Influence Disc in a Sector Controls it. Controlling Sectors allows you to:

- Colonize planets
- Produce Resources
- Build Ships and Structures
- Explore, Move, or Influence from that Sector

The player that Controls a Sector Controls its Structures and is always considered the Defender in battles there.`,
    categories: ["game-concepts", "combat"],
    parentId: "game-concepts",
  },
  {
    id: "technologies",
    heading: "Technologies",
    level: 3,
    content: `Researching Techs gives your civilization advantages. Techs are divided into categories:

- Military (Crosshair symbol)
- Grid (Grid symbol)
- Nano (Gear symbol)
- Rare (Circle symbol)

Each Tech you Research gives you a discount on further Techs Researched in the same category.`,
    categories: ["game-concepts", "technologies"],
    parentId: "game-concepts",
  },
  {
    id: "ships",
    heading: "Ships",
    level: 3,
    content: `Ships are used for Exploring and fighting opponents. There are four kinds:

| Ship Type | Count | Notes |
|-----------|-------|-------|
| Interceptors | 8 per player | Smallest, fastest |
| Cruisers | 4 per player | Medium |
| Dreadnoughts | 2 per player | Largest |
| Starbases | 4 per player | Immobile defense |`,
    categories: ["game-concepts", "ship-parts", "combat"],
    parentId: "game-concepts",
  },
  {
    id: "blueprints",
    heading: "Blueprints",
    level: 3,
    content: `All Ships have Blueprints depicting their abilities (weapons, Initiative, Shields, etc.). Player Ship Blueprints are on their Species Board and can be customized using the Upgrade Action.

Some Ship Blueprints have extra Ship Parts outside the Ship Part grid. These work just like other Ship Parts except they cannot be replaced.`,
    categories: ["game-concepts", "ship-parts"],
    parentId: "game-concepts",
  },
  {
    id: "ship-parts",
    heading: "Ship Parts",
    level: 3,
    content: `| Part Type | Effect |
|-----------|--------|
| Weapons | For each Die Symbol, roll one die of the corresponding color |
| Computers | Added to die rolls to Hit |
| Shields | Subtracted from opponent die rolls to Hit |
| Hull | Determines how much damage Ship can absorb |
| Drives | Determines Ship's Movement Value |
| Energy Sources | Determines total Energy Production |`,
    categories: ["ship-parts", "combat"],
    parentId: "game-concepts",
  },
  {
    id: "structures",
    heading: "Structures",
    level: 3,
    content: `| Structure | Effect |
|-----------|--------|
| Orbitals | Provide an additional Population Square |
| Monoliths | Grant 3 VP at end of game |

Structures are permanent and remain in the Sector until the end of the game.`,
    categories: ["structures", "scoring"],
    parentId: "game-concepts",
  },
  {
    id: "zones-and-rings",
    heading: "Zones and Rings",
    level: 3,
    content: `The game board is comprised of Zones where Sectors can be placed. Zones and Sectors are grouped into Rings:

- Ring I (Inner) - Closest to Galactic Center
- Ring II (Middle) - Middle distance
- Ring III (Outer) - Furthest from center`,
    categories: ["game-concepts", "movement"],
    parentId: "game-concepts",
  },
  {
    id: "wormholes",
    heading: "Wormholes",
    level: 3,
    content: `Ships may only Move using the Wormhole network. Wormholes may normally only be used to Explore, Move to, and Influence adjacent Sectors if the edges connecting the Sector tiles each contain a Wormhole, creating a Wormhole Connection.`,
    categories: ["game-concepts", "movement"],
    parentId: "game-concepts",
  },
  {
    id: "discovery-tiles",
    heading: "Discovery Tiles",
    level: 3,
    content: `Some Sectors contain a Discovery Tile awarded when:

- The Sector is first Explored (if unoccupied)
- The Sector's defender is destroyed (if occupied)

Each Discovery Tile is double-sided:
- Front: Various rewards (Resources, Technologies, Ship Parts, etc.)
- Back: 2 VP value

When awarded a Discovery Tile, you must reveal it and decide which side to use before ending your Activation.`,
    categories: ["discovery", "scoring", "actions"],
    parentId: "game-concepts",
  },
  {
    id: "ambassador-tiles",
    heading: "Ambassador Tiles (4+ Players)",
    level: 3,
    content: `In games with four or more players, you can use Ambassadors to form Diplomatic Relations with other players. Diplomatic Relations increase your Production and are worth VP at the end of the game.`,
    categories: ["diplomacy", "scoring"],
    parentId: "game-concepts",
  },
  {
    id: "reputation-tiles",
    heading: "Reputation Tiles",
    level: 3,
    content: `You receive Reputation Tiles for participating in combat. They are worth 1-4 VP at the end of the game.`,
    categories: ["combat", "scoring"],
    parentId: "game-concepts",
  },
  {
    id: "game-setup",
    heading: "Game Setup",
    level: 2,
    content: `Tech Tray Setup:
| Players | Tech Tiles to Draw |
|---------|-------------------|
| 2 | 12 |
| 3 | 14 |
| 4 | 16 |
| 5 | 18 |
| 6 | 20 |

Draw Tech Tiles randomly until the indicated number of regular Tech Tiles (Military, Grid, and Nano) has been drawn. Place drawn Tech Tiles in the slots of the Tech Tray with matching Tech and cost icons.

Rare Tech Tiles drawn go in any of the seven slots on the bottom row of the Tech Tray but do not count toward the regular Tech Tile count.

Outer Sector Stack Size:
| Players | Outer Sectors |
|---------|---------------|
| 2 | 5 |
| 3 | 8 |
| 4 | 14 |
| 5 | 16 |
| 6 | 18 |`,
    categories: ["setup"],
  },
  {
    id: "game-round-structure",
    heading: "Game Round Structure",
    level: 2,
    content: `Each game Round consists of four phases:

1. Action Phase - Take Actions clockwise, one Action at a time until all players have Passed.
2. Combat Phase - Resolve battles and conquer Sectors.
3. Upkeep Phase - Pay Civilization Upkeep Costs and Produce Resources.
4. Cleanup Phase - Return Influence Discs from Action Spaces to Influence Track and draw new Tech Tiles.`,
    categories: ["game-concepts"],
  },
  {
    id: "action-phase",
    heading: "Action Phase",
    level: 2,
    content: `Starting with the player holding the Start Player Tile, and moving clockwise, you may take one Action or Pass. This continues until all players' Summary Tiles are flipped with the Reaction Overview faceup.

When taking an Action, move the leftmost Influence Disc from your Influence Track to the Action Space on your Action Track corresponding with the chosen Action. Stack subsequent Influence Discs on top; the same Action may be taken multiple times.

Available Actions:
| Action | Description |
|--------|-------------|
| Explore | Discover new Sectors |
| Research | Develop new Technologies |
| Upgrade | Modify Ship Blueprints |
| Build | Build Ships and Structures |
| Move | Move Ships |
| Influence | Gain/withdraw Control of Sectors |`,
    categories: ["actions"],
  },
  {
    id: "passing",
    heading: "Passing",
    level: 3,
    content: `The first time you Pass in a Round:

1. Flip your Summary Tile to Reactions Overview side
2. First player to Pass receives 2 Money and the Start Player Tile for next Round
3. On subsequent turns, players who have Passed may take one Reaction or Pass again`,
    categories: ["actions"],
    parentId: "action-phase",
  },
  {
    id: "reactions",
    heading: "Reactions",
    level: 3,
    content: `After Passing, you may only take Reactions (weaker versions of Upgrade, Build, and Move):

| Reaction | Effect |
|----------|--------|
| Upgrade | Execute one Upgrade Activation |
| Build | Execute one Build Activation |
| Move | Execute one Move Activation |

Important: Techs granting extra Activations do NOT apply to Reactions!`,
    categories: ["actions"],
    parentId: "action-phase",
  },
  {
    id: "explore-action",
    heading: "Explore Action",
    level: 2,
    content: `The Explore Action allows you to discover new Sectors to colonize.

Procedure:
1. Choose one Unexplored Zone next to a Sector where you have Control or at least one Unpinned Ship
2. Flip a Sector tile faceup from the stack corresponding to the Zone's Ring (I, II, or III)
3. Choose whether to place the Sector or discard it

Note: The edge of a Sector you can Explore from must have a Wormhole adjacent to the Zone being Explored (except with Wormhole Generator Tech).

Placing Explored Sectors:
- Must be oriented so a Wormhole Connection is made with a Sector where you have Control or an Unpinned Ship
- If the Sector contains a Discovery Tile Symbol, place a facedown Discovery Tile on it
- If the Sector contains Ancient Symbols, place that many Ancients on top of the Discovery Tile`,
    categories: ["actions", "discovery", "movement"],
  },
  {
    id: "discovery-tile-types",
    heading: "Discovery Tile Types",
    level: 3,
    content: `| Tile | Effect |
|------|--------|
| +6 Materials / +5 Science / +8 Money | Gain indicated Resources |
| +2 Materials +2 Science +3 Money | Gain indicated Resources |
| Ancient Tech | Take the regular Tech Tile with lowest printed cost you don't have from Tech Tray for free |
| Ancient Cruiser | Place one of your Unbuilt Cruisers in the Sector |
| Ancient Orbital | Place an Orbital in the Sector and gain 2 Materials |
| Ancient Monolith | Place a Monolith in the Sector |
| Ancient Ship Parts | Place on any Ship Blueprint or keep for later Upgrade Action |
| Muon Source | Ship Part placed outside Blueprint grid |
| Ancient Warp Portal | Place in Sector; connects to all other Warp Portal Sectors; worth 2 VP |`,
    categories: ["discovery", "ship-parts", "structures"],
    parentId: "explore-action",
  },
  {
    id: "research-action",
    heading: "Research Action",
    level: 2,
    content: `The Research Action allows you to Research new Technologies.

Procedure:
1. Choose one available Tech Tile from the Tech Tray
2. Pay its Science cost
3. Place the Tech Tile on the leftmost available space of the Tech Track of its category

Discounts:
Each Tech you have in a category gives you a discount on further Techs Researched in the same category. The discount is shown by the lowest visible value in that category on your Species Board.

All Techs have a minimum Science cost regardless of discounts.

Restrictions:
- You cannot Research a Tech already on your Species Board
- You cannot discard a Researched Tech Tile
- If a Tech Track is full, no more Techs of that type may be Researched`,
    categories: ["actions", "technologies"],
  },
  {
    id: "upgrade-action",
    heading: "Upgrade Action",
    level: 2,
    content: `The Upgrade Action allows you to modify your Ship Blueprints. When you Upgrade a Ship's Blueprint, all Ships of that type are instantly Upgraded regardless of location.

Procedure:
For each Upgrade Activation, you may (in order):
1. Return any number of Ship Part Tiles from your Ship Blueprints to the Upgrade Tray
   - Exception: Ancient Ship Parts are removed from the game when removed from Blueprints
2. Move any one Ship Part Tile from the Upgrade Tray to any empty or preprinted Ship Part Space

Restrictions:
- Must have Researched the requisite Tech for the Ship Part
- Must not cause total Energy Consumption to exceed total Energy Production
- Drive Ship Parts cannot be moved to Starbase Blueprints
- At least one Drive Ship Part must be present on Interceptor, Cruiser, and Dreadnought Blueprints

Taking and returning Ship Parts costs nothing. All values from Ship Parts are cumulative.`,
    categories: ["actions", "ship-parts"],
  },
  {
    id: "ship-part-reference",
    heading: "Ship Part Reference",
    level: 3,
    content: `| Part | Effect |
|------|--------|
| Ion Cannon | Yellow die, 1 damage |
| Plasma Cannon | Orange die, 2 damage |
| Soliton Cannon | Blue die, 3 damage |
| Antimatter Cannon | Red die, 4 damage |
| Ion Missile | Yellow die, 1 damage (missiles) |
| Plasma Missile | Orange die, 2 damage (missiles) |
| Soliton Missile | Blue die, 3 damage (missiles) |
| Flux Missile | Red die, 4 damage (missiles) |
| Electron Computer | +1 to hit |
| Positron Computer | +2 to hit |
| Gluon Computer | +3 to hit |
| Hull | +1 damage absorption |
| Improved Hull | +2 damage absorption |
| Sentient Hull | +1 damage absorption, +1 Initiative |
| Gauss Shield | -1 to opponent's hit rolls |
| Phase Shield | -2 to opponent's hit rolls |
| Absorption Shield | -1 to opponent's hit rolls, +1 Energy |
| Conifold Field | -3 to opponent's hit rolls |
| Nuclear Drive | 1 Movement, +1 Initiative |
| Fusion Drive | 2 Movement, +2 Initiative |
| Tachyon Drive | 3 Movement, +3 Initiative |
| Transition Drive | 3 Movement, +3 Initiative |
| Nuclear Source | +3 Energy |
| Fusion Source | +6 Energy |
| Tachyon Source | +9 Energy |
| Zero-Point Source | +12 Energy |`,
    categories: ["ship-parts", "combat"],
    parentId: "upgrade-action",
  },
  {
    id: "build-action",
    heading: "Build Action",
    level: 2,
    content: `The Build Action allows you to Build Ships and Structures.

Procedure:
For each Build Activation:
1. Choose a Sector you Control
2. Pay the Materials cost
3. Place the Ship or Structure

Basic Building Costs:
| Item | Cost |
|------|------|
| Interceptor | 3 Materials |
| Cruiser | 5 Materials |
| Dreadnought | 8 Materials |
| Starbase | 3 Materials |
| Orbital | 4 Materials |
| Monolith | 10 Materials |

Restrictions:
- Must have Researched the requisite Tech for Starbases and Structures
- Each Sector may have at most one Monolith and one Orbital`,
    categories: ["actions", "structures"],
  },
  {
    id: "move-action",
    heading: "Move Action",
    level: 2,
    content: `The Move Action allows you to Move your Ships.

Procedure:
For each Move Activation:
- Move one Ship up to the number of Sectors determined by its Movement Value (total Drive value)

Restrictions:
- Ships may only Move to Sectors with a Wormhole or Warp Portal Connection
- Ships cannot Move to Unexplored Zones
- Pinned Ships cannot Move from a Sector containing opponent Ships`,
    categories: ["actions", "movement"],
  },
  {
    id: "pinning",
    heading: "Pinning",
    level: 3,
    content: `To determine if Ships are Pinned:

1. Total the number of opponent Ships in that Sector
2. Each opponent Ship Pins one of your Ships (of your choosing)
3. Pinning is determined for each Move Activation

Special Cases:
- The GCDS Pins all Ships in the Galactic Center Sector
- With Cloaking Device Tech, two Ships are required to Pin each of your Ships`,
    categories: ["movement", "combat"],
    parentId: "move-action",
  },
  {
    id: "influence-action",
    heading: "Influence Action",
    level: 2,
    content: `The Influence Action allows you to modify Control by moving Influence Discs to or from Sectors.

Each Influence Action also allows you to flip up to two of your used Colony Ships faceup.

For each Influence Activation, move an Influence Disc from your Influence Track or a Sector you Control to:
1. An Uncontrolled Sector where no opponent Ships are present AND a Wormhole/Warp Portal Connection exists with a Sector where you have a Ship or Control
2. OR an Uncontrolled Sector where only you have a Ship
3. OR the rightmost empty space of your Influence Track

You cannot use more than one Influence Activation in the same Sector per Influence Action.

Removing a Disc from a Sector:
When you remove an Influence Disc from a Sector:
- Return all Population Cubes from the Sector to their respective Population Tracks
- Population Cubes from gray squares may return to any Population Track
- Population Cubes from Orbitals may return to Science or Money Track`,
    categories: ["actions"],
  },
  {
    id: "diplomatic-relations",
    heading: "Diplomatic Relations (4+ Players)",
    level: 2,
    content: `In games with four or more players, any two players may propose Diplomatic Relations at any time during their Action.

Requirements:
- Players must have a Wormhole Connection joining Sectors they Control
- Cannot use Wormhole Generator for this connection
- Neither player's Ships may be present in a Sector Controlled by or containing a Ship from the other player
- Neither player may already have an Ambassador Tile from the other player
- Neither player may hold the Traitor Tile
- Both players must have an empty space on their Reputation Track

Forming Diplomatic Relations:
If both players agree:
1. Each player gives the other one Ambassador Tile containing a Population Cube from any Population Track
2. Ambassador Tiles are placed on empty Ambassador Tile spaces on each player's Reputation Track

Breaking Diplomatic Relations:
Diplomatic Relations are broken by an Act of Aggression: having any number of your Ships in a Sector where the other player has a Ship or Control at the end of your Action.

Note: Moving through an opponent's Sectors is NOT an Act of Aggression if your Ships remain Unpinned!

When broken:
- Each player returns the other's Ambassador Tile and Population Cube
- The player initiating the Act of Aggression receives the Traitor Tile

The player holding the Traitor Tile:
- Cannot form Diplomatic Relations
- Receives -2 VP penalty at end of game`,
    categories: ["diplomacy", "scoring"],
  },
  {
    id: "combat-phase",
    heading: "Combat Phase",
    level: 2,
    content: `The Combat Phase consists of six steps:

1. Determine Battles - Identify all Sectors containing opposing Ships.
2. Resolve Battles - Resolve battles by Sector Number in descending numerical order.
3. Attack Population - Ships attack opponent Population Cubes in their Sector.
4. Influence Sectors - Players may take Control of Uncontrolled Sectors where they have Ships.
5. Discovery Tiles - Undefended Discovery Tiles are claimed.
6. Repair Damage - All Ship damage is reset by returning Damage Cubes to supply.`,
    categories: ["combat"],
  },
  {
    id: "resolve-battles",
    heading: "Resolve Battles",
    level: 2,
    content: `Battle Order:
- Battles are resolved in descending Sector Number order
- Battles with multiple opponents are resolved between two players at a time in reverse order of entry into the Sector
- Non-player Ships (Ancients, Guardians, GCDS) battle the last surviving player

Attacker vs Defender:
- The player who first entered the Sector is the Defender
- The player who entered last is the Attacker
- A player who Controls the Sector is always the Defender, regardless of entry order
- Ancients, Guardians, and GCDS are always considered Defenders`,
    categories: ["combat"],
  },
  {
    id: "initiative",
    heading: "Initiative",
    level: 3,
    content: `Initiative determines the order of Attack in an Engagement Round:

- Total the Initiative Symbols on the Blueprint of each Ship type
- Initiative ties between opponents are resolved in favor of the Defender
- You choose the order for your own Ships that are tied`,
    categories: ["combat", "ship-parts"],
    parentId: "resolve-battles",
  },
  {
    id: "steps-of-battle",
    heading: "Steps of Battle",
    level: 3,
    content: `Steps of Battle (Per Sector):
1. Determine order of player battle resolution
2. Determine Attacker and Defender
3. Determine Initiative
4. Fire Missiles (first round only)
5. Repeated Engagement Rounds

For battles with more than two opponents, repeat steps 1-5 until a single opponent's Ships remain.`,
    categories: ["combat"],
    parentId: "resolve-battles",
  },
  {
    id: "firing-missiles",
    heading: "Firing Missiles",
    level: 3,
    content: `All Ship types with Missiles fire their Missiles in Initiative order. Roll dice of the corresponding color equal to the number of Die Symbols on Missile Ship Parts.

Missiles fire only once per battle (before the first Engagement Round).`,
    categories: ["combat", "ship-parts"],
    parentId: "resolve-battles",
  },
  {
    id: "engagement-rounds",
    heading: "Engagement Rounds",
    level: 3,
    content: `Each Engagement Round, Ship types are Activated in Initiative order. When Activated, the owning player decides whether to Attack or Retreat.

Engagement Rounds repeat until all of one player's Ships have Retreated or are destroyed.`,
    categories: ["combat"],
    parentId: "resolve-battles",
  },
  {
    id: "attacking",
    heading: "Attacking",
    level: 3,
    content: `In Initiative order, each Ship type may Attack by rolling one die of the corresponding color for every Die Symbol on their Ship Blueprint.

All dice of all colors for each Ship type are rolled simultaneously.

After rolling, each die is assigned to a single opponent Ship to determine if it's a Hit.`,
    categories: ["combat", "ship-parts"],
    parentId: "resolve-battles",
  },
  {
    id: "hitting",
    heading: "Hitting",
    level: 3,
    content: `| Die Result | Outcome |
|------------|---------|
| One or more bursts (★) | Always a Hit |
| Blank face | Always a Miss |
| Number | Calculate Hit Value |

Hit Value Calculation:
Hit Value = Die Roll + Your Computers - Target's Shields

If Hit Value ≥ 6, it's a Hit.`,
    categories: ["combat", "ship-parts"],
    parentId: "resolve-battles",
  },
  {
    id: "damage",
    heading: "Damage",
    level: 3,
    content: `- Hits inflict damage equal to the number of bursts (★) on their weapon's Die Symbol
- Ships receiving damage greater than their Hull Value are destroyed
- Damage exceeding a Ship's Hull Value cannot be assigned to another Ship
- Mark damage on surviving Ships with Damage Cubes`,
    categories: ["combat", "ship-parts"],
    parentId: "resolve-battles",
  },
  {
    id: "retreat",
    heading: "Retreat",
    level: 3,
    content: `To attempt Retreat during a Ship Activation:

1. Move all your Ships of that type to the edge of a neighboring Sector with a Wormhole Connection
2. You may only Retreat to a Sector you Control where no opponent Ships are present
3. On next Ship Activation, Retreating Ships may complete Retreat by moving to the neighboring Sector

Retreating Ships:
- Cannot Attack or be Attacked during current battle
- Are eligible to be Attacked until moved to neighboring Sector`,
    categories: ["combat", "movement"],
    parentId: "resolve-battles",
  },
  {
    id: "stalemate",
    heading: "Stalemate",
    level: 3,
    content: `If neither player can destroy the other's Ships (all Ships unarmed or only have Missiles):

- The Attacker must Retreat
- If Attacker cannot Retreat, their Ships are destroyed`,
    categories: ["combat"],
    parentId: "resolve-battles",
  },
  {
    id: "reputation-tiles-combat",
    heading: "Reputation Tiles (Combat)",
    level: 3,
    content: `After all battles in a Sector, each participating player draws Reputation Tiles:

| Source | Tiles Drawn |
|--------|-------------|
| Participating in battle | 1 |
| Each Interceptor destroyed | 1 |
| Each Starbase destroyed | 1 |
| Each Ancient destroyed | 1 |
| Each Cruiser destroyed | 2 |
| Each Guardian destroyed | 2 |
| Each Dreadnought destroyed | 3 |
| Destroying GCDS | 3 |

Maximum 5 tiles per battle.

Drawing is done in order of player entry:
1. Draw Reputation Tiles
2. Select up to one to place facedown on Reputation Track
3. Return others to bag

Retreat Penalty: If all your remaining Ships attempt to Retreat, you do NOT draw a tile for participating (but still draw for destroyed opponent Ships).`,
    categories: ["combat", "scoring"],
    parentId: "resolve-battles",
  },
  {
    id: "attack-population",
    heading: "Attack Population",
    level: 3,
    content: `At end of Combat Phase, remaining Ships attack opponent Population Cubes in their Sector:

- Each Ship may attack once with non-Missile weapons
- Use normal rules to Hit (Population Cubes have 0 Shield Value)
- Each damage destroys one Population Cube of attacker's choosing

Neutron Bombs Tech: All Population Cubes in the Sector may be destroyed automatically.

Destroyed Population Cubes are returned to the defeated player's Graveyards on their Control Board.`,
    categories: ["combat"],
    parentId: "combat-phase",
  },
  {
    id: "upkeep-phase",
    heading: "Upkeep Phase",
    level: 2,
    content: `Colony Ships:
All players may activate any remaining Colony Ships to move Population Cubes to Sectors.
Important: Unlike the Action Phase, Colony Ships cannot be used during Upkeep Phase to move Population Cubes to Sectors containing opponent Ships.

Civilization Upkeep:
Compare your Money Income (highest exposed number on Money Population Track) with your Civilization Upkeep Cost (highest exposed number on Influence Track).

Adjust your Money Storage Marker by the net difference:
- Positive difference = Gain Money
- Negative difference = Pay Money`,
    categories: ["upkeep"],
  },
  {
    id: "bankruptcy",
    heading: "Bankruptcy",
    level: 3,
    content: `At no time may your Money Storage Marker move below zero. If you can't pay:

1. Trade Materials and/or Science for Money
2. Abandon Control of Sectors until Upkeep Cost is affordable

When Abandoning a Sector:
- Influence Disc returns to Influence Track
- All Population Cubes return to respective Population Tracks

Warning: Abandoning may reduce Income as Population Cubes return to Money Track.`,
    categories: ["upkeep"],
    parentId: "upkeep-phase",
  },
  {
    id: "player-elimination",
    heading: "Player Elimination",
    level: 3,
    content: `Players are eliminated if:

- Unable to Pay Civilization Upkeep Cost after Trading and Abandoning
- Having neither Ships nor Controlled Sectors at end of Combat Phase

Eliminated players count their score and return components to the game box.`,
    categories: ["upkeep", "scoring"],
    parentId: "upkeep-phase",
  },
  {
    id: "cleanup-phase",
    heading: "Cleanup Phase",
    level: 2,
    content: `New Tech Tiles:
| Players | Tiles to Draw |
|---------|---------------|
| 2 | 5 |
| 3 | 6 |
| 4 | 7 |
| 5 | 8 |
| 6 | 9 |

Draw Tech Tiles from the Tech Tile Bag until the indicated number of regular Tech Tiles has been drawn. Rare Tech Tiles do not count toward this number.

End of Round:
1. Move all Influence Discs from Action Track back to Influence Track
2. Move Population Cubes from Graveyards to respective Population Tracks
3. Flip all Colony Ships faceup
4. Flip Summary Tiles to Action Phase Overview side
5. Move Round Marker one step forward`,
    categories: ["game-concepts", "technologies"],
  },
  {
    id: "game-end",
    heading: "Game End",
    level: 2,
    content: `The game ends after the 8th Round.

Victory Points:
| Source | VP |
|--------|-----|
| Reputation Tiles | 1-4 per tile |
| Ambassador Tiles | 1 per tile |
| Controlled Sectors | 1-4 per Sector |
| Monoliths on Controlled Sectors | 3 per Monolith |
| Discovery Tiles kept VP side up | 2 per tile |
| Traitor Tile | -2 |
| Progress on each Tech Track | See below |
| Species bonuses | Varies |

Tech Track VP:
| Tiles on Track | VP |
|----------------|-----|
| 4 | 1 |
| 5 | 2 |
| 6 | 3 |
| 7 | 5 |

Species Bonuses:
| Species | Bonus |
|---------|-------|
| Descendants of Draco | 1 VP per Ancient on game board at end |
| Planta | 1 extra VP for each Controlled Sector |

Tiebreaker:
In case of tie, the tied player with the highest total amount of Resources in Storage (Materials + Science + Money) is the winner.`,
    categories: ["scoring"],
  },
  {
    id: "non-player-opponents",
    heading: "Non-Player Opponents",
    level: 2,
    content: `Ancients:
- Found in Explored Sectors with Ancient symbols
- Use Ancient Blueprint Tile chosen during setup

Guardians:
- Guard special Guardian Sectors
- Use Guardian Blueprint Tile chosen during setup
- Worth 2 Reputation Tiles when destroyed

Galactic Center Defense System (GCDS):
- Guards the Galactic Center Sector
- Pins all Ships in Galactic Center Sector
- Use GCDS Blueprint Tile chosen during setup
- Worth 3 Reputation Tiles when destroyed

Advanced Blueprint Tiles:
Blueprint Tiles with two notches on their border are advanced and should only be used with experienced players.`,
    categories: ["combat", "discovery"],
  },
  {
    id: "technology-reference",
    heading: "Technology Reference",
    level: 2,
    content: `Military Technologies:
| Tech | Effect |
|------|--------|
| Neutron Bombs | When Attacking Population, all Population Cubes in Sector destroyed automatically |
| Starbase | May Build Starbases |
| Plasma Cannon | May Upgrade with Plasma Cannon Ship Parts |
| Phase Shield | May Upgrade with Phase Shield Ship Parts |
| Advanced Mining | May place Population Cubes in Advanced Materials Population Squares |
| Tachyon Source | May Upgrade with Tachyon Source Ship Parts |
| Gluon Computer | May Upgrade with Gluon Computer Ship Parts |
| Plasma Missile | May Upgrade with Plasma Missile Ship Parts |

Grid Technologies:
| Tech | Effect |
|------|--------|
| Gauss Shield | May Upgrade with Gauss Shield Ship Parts |
| Fusion Source | May Upgrade with Fusion Source Ship Parts |
| Improved Hull | May Upgrade with Improved Hull Ship Parts |
| Positron Computer | May Upgrade with Positron Computer Ship Parts |
| Advanced Economy | May place Population Cubes in Advanced Money Population Squares |
| Tachyon Drive | May Upgrade with Tachyon Drive Ship Parts |
| Antimatter Cannon | May Upgrade with Antimatter Cannon Ship Parts |
| Quantum Grid | Receive two additional Influence Discs immediately |

Nano Technologies:
| Tech | Effect |
|------|--------|
| Nanorobots | One extra Activation when taking Build Action |
| Fusion Drive | May Upgrade with Fusion Drive Ship Parts |
| Orbital | May Build Orbitals |
| Advanced Robotics | Receive one additional Influence Disc immediately |
| Advanced Labs | May place Population Cubes in Advanced Science Population Squares |
| Monolith | May Build Monoliths |
| Wormhole Generator | May Explore, Move to, and Influence adjacent Sectors if edges contain one Wormhole |
| Artifact Key | For each Artifact on Sectors you Control, immediately gain 5 Resources of a single type |

Rare Technologies:
| Tech | Effect |
|------|--------|
| Antimatter Splitter | Split damage from Antimatter Cannons freely over targets |
| Conifold Field | May Upgrade with Conifold Field Ship Parts |
| Neutron Absorber | Enemy Neutron Bombs have no effect on you |
| Absorption Shield | May Upgrade with Absorption Shield Ship Parts |
| Cloaking Device | Two Ships required to Pin each of your Ships |
| Improved Logistics | Gain 1 additional Move Activation during each Move Action |
| Sentient Hull | May Upgrade with Sentient Hull Ship Parts |
| Soliton Cannon | May Upgrade with Soliton Cannon Ship Parts |
| Transition Drive | May Upgrade with Transition Drive Ship Parts |
| Warp Portal | Place Warp Portal Tile on Sector you Control; connects to all Warp Portal Sectors; worth 1 VP |
| Flux Missile | May Upgrade with Flux Missile Ship Parts |
| Pico Modulator | Gain 2 additional Upgrade Activations during each Upgrade Action |
| Ancient Labs | Immediately draw and resolve one Discovery Tile |
| Zero-Point Source | May Upgrade with Zero-Point Source Ship Parts |
| Metasynthesis | May place Population Cubes in any Advanced Population Squares |`,
    categories: ["technologies", "ship-parts"],
  },
  {
    id: "species-reference",
    heading: "Species Reference",
    level: 2,
    content: `Terran Factions (all use same stats):
- Starting Resources: 4 Materials, 3 Science, 3 Money
- Colony Ships: 3
- Trade Value: 2:1
- Activations: EXP 1, RES 1, UPG 2, BUI 2, MOV 3, INF 2

Eridani Empire:
- Starting Resources: 4 Materials, 2 Science, 26 Money
- Colony Ships: 3
- Starting Techs: Gauss Shield, Fusion Drive, Plasma Cannon
- Trade Value: 3:1
- Special: Draw two random Reputation Tiles before game, start with two fewer Influence Discs

Hydran Progress:
- Starting Resources: 2 Materials, 6 Science, 2 Money
- Starting Tech: Advanced Labs
- Trade Value: 3:1
- Activations: EXP 1, RES 2, UPG 2, BUI 2, MOV 2, INF 2

Planta:
- Starting Resources: 4 Materials, 3 Science, 2 Money
- Colony Ships: 4
- Starting Tech: Starbase
- Special: Population Cubes auto-destroyed by opponent Ships, 1 extra VP per Controlled Sector

Descendants of Draco:
- Starting Resources: 3 Materials, 4 Science, 2 Money
- Starting Tech: Fusion Drive
- Special: May flip two Sectors when Exploring, 1 VP per Ancient at game end, may coexist with Ancients

Mechanema:
- Starting Resources: 4 Materials, 3 Science, 3 Money
- Starting Tech: Positron Computer
- Activations: EXP 1, RES 1, UPG 3, BUI 3, MOV 2, INF 2
- Special: Cheaper building costs (Interceptor 2, Cruiser 4, Dreadnought 7, etc.)

Orion Hegemony:
- Starting Resources: 4 Materials, 3 Science, 3 Money
- Starting Techs: Neutron Bombs, Gauss Shield
- Trade Value: 4:1
- Special: Start with Cruiser instead of Interceptor, increased Initiative bonuses`,
    categories: ["species"],
  },
  {
    id: "quick-reference",
    heading: "Quick Reference",
    level: 2,
    content: `Sector Numbers:
- Galactic Center: 001
- Inner Sectors: 101-110
- Middle Sectors: 201-211, 214, 281
- Starting Sectors: 221-232
- Guardian Sectors: 271-274
- Outer Sectors: 301-318, 381-382

Dice Colors and Damage:
| Color | Damage |
|-------|--------|
| Yellow | 1 |
| Orange | 2 |
| Blue | 3 |
| Red | 4 |

Ship Initiative Bonuses:
| Ship Type | Base Initiative |
|-----------|-----------------|
| Interceptor | +2 |
| Cruiser | +1 |
| Dreadnought | 0 |
| Starbase | +4 |

Round Structure Summary:
1. Action Phase: Take Actions clockwise until all Pass
2. Combat Phase: Resolve battles, attack population, influence sectors, claim discoveries, repair
3. Upkeep Phase: Colony Ships, pay upkeep, produce resources
4. Cleanup Phase: Return discs, draw tech tiles, reset colony ships, advance round`,
    categories: ["game-concepts", "combat", "ship-parts"],
  },
  {
    id: "frequently-asked-questions",
    heading: "Frequently Asked Questions",
    level: 2,
    content: `Resources:
Q: Where can I get more Resources?
A: Place Influence Discs on Sectors, use Colony Ships to move Population Cubes to Population Squares, Research Advanced Techs for Advanced Population Squares, Build Orbitals, collect Discovery Tiles.

Q: What do I need Money for?
A: Pay your Civilization Upkeep Cost. The more Actions you take and Sectors you Control, the more you pay each Round.

Influence Discs:
Q: I don't have enough Influence Discs. What now?
A: Use Influence Action to return up to two discs from Sectors. Research Advanced Robotics and Quantum Grid for more discs.

Technologies:
Q: The best Techs are expensive. How can I afford them?
A: Buy Techs in increasing price order within a category to maximize discounts.

Combat:
Q: My Ships keep getting destroyed. How can I win more battles?
A: Upgrade Drives for Initiative (shoot first), use Missiles, upgrade Shields (can't be Hit), upgrade Hull (survive more Hits).

Q: Are Interceptors useful?
A: Yes, when specialized. Great for Pinning larger Ships.

Retreat:
Q: If all my Ships try to Retreat but are destroyed, do I get the participation Reputation Tile?
A: No. The Retreat penalty applies as soon as you attempt to Retreat.`,
    categories: ["faq"],
  },
];

/**
 * Get all unique categories present in the rules index
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  for (const section of RULES_INDEX) {
    for (const category of section.categories) {
      categories.add(category);
    }
  }
  return Array.from(categories).sort();
}

/**
 * Get category counts from the index
 */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const section of RULES_INDEX) {
    for (const category of section.categories) {
      counts[category] = (counts[category] ?? 0) + 1;
    }
  }
  return counts;
}
