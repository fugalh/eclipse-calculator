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
    id: "game-components",
    heading: "GAME COMPONENTS",
    level: 2,
    content: `**CIVILIZATION COMPONENTS**
Each civilization (blue, red, green, yellow, white, black) has:

- 18 Ships (8 Interceptors, 4 Cruisers, 2 Dreadnoughts, 4 Starbases)
- 33 Population Cubes
- 16 Influence Discs
- 3 Ambassador Tiles

**SECTOR HEXES**
43 Sectors:

- 10 Inner Sectors (101-110)
- 13 Middle Sectors (201-211, 214, 281)
- 20 Outer Sectors (301-318, 381-382)
- 1 Galactic Center Sector (001)
- 6 Starting Sectors (221-232)
- 4 Guardian Sectors (271-274)

**BOARDS & TRAYS**

- 6 Species Boards (two-sided)
- 6 Species Trays (Tray + Lid)
- 6 Control Board tops
- 6 Control Board bottoms
- 1 Tech Tray
- 1 Upgrade Tray
- 2 Table Trays
- 1 Base Tray

**TILES**

- 114 Tech Tiles (39 different)
- 282 Ship Part Tiles (24 different)
- 36 Discovery Tiles (24 different)
- 19 Colony Ship Tiles
- 6 Blueprint Tiles (2 Ancient, 2 Galactic Center Defense System, 2 Guardian)
- 33 Reputation Tiles
- 10 extra Orbital/Monolith Tiles
- 5 extra Colony Ship Tiles
- 1 Start Player Tile
- 6 Summary Tiles
- 1 Traitor Tile
- 4 Info Tiles

**MINIATURES**

- 1 Galactic Center Defense System (GCDS)
- 14 Ancients
- 4 Guardians
- 12 Orbitals
- 10 Monoliths

**MISCELLANEOUS**

- 24 custom 6-sided dice (8 yellow, 6 orange, 6 blue, 4 red)
- 18 Storage Markers (6 each in orange, pink, and brown)
- 12 purple Damage Cubes
- 1 Round Marker
- 1 black Reputation Tile Bag
- 1 white Tech Tile Bag`,
    categories: ["components", "setup"],
  },
  {
    id: "game-overview",
    heading: "GAME OVERVIEW",
    level: 2,
    content: `Eclipse places you in control of a vast interstellar civilization, competing for domination with its rivals.

Each Round expand your civilization by Exploring and colonizing new Sector hexes (Sectors), Researching Technologies (Techs), and Building Spaceships (Ships) to wage war.

After eight Rounds the game ends, and victory is awarded to the player with the most Victory Points (VP).

VP are gained from fighting battles, forming Diplomatic Relations, Controlling Sectors, Controlling Monoliths, making Discoveries, and Researching Techs.

There are many potential paths to victory, so plan your strategy according to your civilization's strengths and weaknesses while paying attention to other civilizations' endeavors!`,
    categories: ["game-concepts", "scoring"],
  },
  {
    id: "game-setup",
    heading: "GAME SETUP",
    level: 2,
    content: `1. **Tech Tiles:** Put the Tech Tiles in the white Tech Tile Bag and shuffle them. Draw Tech Tiles randomly from the Tech Tile Bag until the indicated number of regular Tech Tiles (Military, Grid, and Nano) for your player count has been drawn. Set drawn Tech Tiles in the slots of the Tech Tray with the matching Tech and cost icons. Tech Tile cost is indicated by the value in the large pink circle on each Tech Tile. Stack duplicate Tech Tiles in the same slot. Place any Rare Tech Tiles drawn in any of the seven slots on the bottom row of the Tech Tray, but do not count them against the number of regular Tech Tiles drawn for Game Setup.

- _2 Players: 12 Tiles_
- _3 Players: 14 Tiles_
- _4 Players: 16 Tiles_
- _5 Players: 18 Tiles_
- _6 Players: 20 Tiles_

2. **Reputation Tiles:** Put the Reputation Tiles in the black Reputation Tile Bag and shuffle them.
3. **Discovery Tiles:** Shuffle the Discovery Tiles and set them facedown near the Tech Tray and Upgrade Tray.
4. **Blueprints:** Choose one Blueprint Tile of each type (Ancient, Guardian, GCDS) to use for this game.

- _Note: Blueprint Tiles with two notches on their border are advanced and should only be used with experienced players._

5. **General Supply:** Set the chosen Blueprint Tiles, Damage Cubes, and the Traitor Tile beside the Tech and Upgrade Trays. Arrange the Ship Part Tiles by type in the Upgrade Tray.
6. **Galactic Center:** Set the Galactic Center Sector in the middle of the table. Place a facedown Discovery Tile on the Galactic Center Sector's Discovery Tile Symbol, then the Galactic Center Defense System (GCDS) miniature on top.
7. **Sectors:** Shuffle each of the Sector hexes by Ring: Inner (I), Middle (II), and Outer (III).

- _Note: if you do not want to play with the optional Warp Portals module, remove Sectors 281, 381-382 from the game before shuffling._
  Place the shuffled Sectors into facedown stacks. The Outer Sector stack should contain the number of Outer (III) Sectors indicated for your player count:
- _2 Players: 5 Sectors_
- _3 Players: 8 Sectors_
- _4 Players: 14 Sectors_
- _5 Players: 16 Sectors_
- _6 Players: 18 Sectors_

8. **Start Player:** Give the Start Player Tile to the player who has spent the least time on planet Terra, in the Sol system.
9. **Player Components:** Beginning with the player to the right of the Start Player and moving in counterclockwise order, choose a Species Board and take the Species Tray with a lid of the matching color.

- _Note: Since Species Boards are double-sided, each player selecting to play Terrans is effectively removing one Alien Species from play in that game._

10. **Starting Sectors:** Place your Starting Sector in the Starting Zone closest to you as shown in the Starting Layouts illustration (oriented so that the arrow faces the GCDS).
11. **Guardian Sectors:** Fill all empty Starting Zones with random Guardian Sectors oriented so that the arrow faces the GCDS (Guardian Sectors are not used in 6-player games). Place a facedown Discovery Tile on the Guardian Symbol of each Guardian Sector, then a Guardian miniature on top. Put the remaining Starting Sectors, Guardian Sectors, and Species Boards back in the box—they will not be used this game.
12. **Species Setup:** Take the following components from your Species Tray and set them next to your Species Board:

- The number of Colony Ships shown on your Species Board.
- The Summary Tile, with the Action Phase Overview faceup.

13. **Influence Discs:** Take the Influence Discs from your Species Tray and place them on the Influence Track of your Species Board (leave the three Influence Discs that don't fit on your Influence Track in your Species Tray).

- _Note: You have three extra Influence discs that are only used if you Research the ADVANCED ROBOTICS or QUANTUM GRID Tech._

14. **Control Board:** Place the following on your Control Board:

- One Population Cube on each square valued 3-28 of the three Population Tracks (Materials, Science, and Money).
- One Storage Marker of each color on your Storage Track with the single-pointed end of the Storage Marker facing the center of the Control Board, at the Starting Storage Resource values indicated on your Species Board.

15. **Starting Units:** Place the following on your Starting Sector:

- One Interceptor Ship miniature.
- One Population Cube in each Population Square without a star, taken from the "3" space of your corresponding Population Track.
- One Influence Disc, placed on the Influence Space, taken from the leftmost space of your Influence Track.

_Leave Ships and Ambassador Tiles in your Species Tray for easy access._`,
    categories: ["setup", "components"],
  },
  {
    id: "game-concepts",
    heading: "GAME CONCEPTS",
    level: 2,
    content: ``,
    categories: ["game-concepts"],
    children: [
      "actions-and-activations",
      "resources",
      "trade",
      "population-cubes",
      "colony-ships",
      "influence-discs",
      "control",
      "tech",
      "ships",
      "blueprints",
      "ship-parts",
      "structures",
      "zones-and-rings",
      "sectors",
      "wormholes",
      "discovery-tiles",
      "ambassador-tiles",
      "reputation-tiles",
      "limited-vs-unlimited-components",
      "warp-portals-optional-module",
    ],
  },
  {
    id: "actions-and-activations",
    heading: "Actions and Activations",
    level: 3,
    content: `During each game Round, players take turns selecting and resolving individual Actions until all players Pass. Actions are comprised of a number of **Activations** that correspond to your Species and the Techs that you have Researched. Each Activation allows you to perform an activity associated with the chosen Action. This means that each player may have a variable number of activities they can perform each time they select an Action.`,
    categories: ["game-concepts", "actions"],
    parentId: "game-concepts",
  },
  {
    id: "resources",
    heading: "Resources",
    level: 3,
    content: `Sectors Produce up to three kinds of Resources: Materials, Science, and Money.

- **Materials [Orange]:** Needed for Building new Ships and Structures.
- **Science [Pink]:** Needed for Researching new Techs.
- **Money [Yellow]:** Needed for Controlling Sectors and taking Actions.

The amount of each Resource you have is marked with a Storage Marker on your Storage Track. When you **Produce** or **Gain** Resources, move the appropriate Storage Marker(s) one space forward on the Storage Track per Resource gained. When you **Pay** Resources, move the appropriate Storage Marker backward one space on the Storage Track per Resource Paid.

The amount of Resources you can have is not limited by the values on the Storage Track. If you ever have more than 40 of one kind of Resource, turn the Storage Marker so that the four-pointed end faces the center of the Control Board, indicating you have 40 plus the Storage Track value of that kind of Resource.`,
    categories: ["game-concepts", "upkeep"],
    parentId: "game-concepts",
  },
  {
    id: "trade",
    heading: "Trade",
    level: 3,
    content: `At any time, as many times as you choose and are able, you may Pay the number of one Resource indicated by the **Trade Value** on your Species Board, to gain one Resource (Materials, Science, Money) of any other kind.`,
    categories: ["game-concepts"],
    parentId: "game-concepts",
  },
  {
    id: "population-cubes",
    heading: "Population Cubes",
    level: 3,
    content: `Your civilization's population is represented by the Population Cubes in your player color. Population Cubes placed on Sectors Produce Resources. The highest value empty square on each Population Track shows how many Resources of each kind you will Produce during the Upkeep Phase.`,
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
    content: `Your civilization's influence is represented by the Influence Discs in your player color. Influence Discs are used to mark the Sectors your civilization Controls. Also, each Action you take requires you to move an Influence Disc from your Influence Track to the corresponding Action Space.

- The **leftmost** Influence Disc is always used when Influence Discs are moved _from_ your Influence Track.
- When Influence Discs are moved _to_ your Influence Track, they are always placed on the **rightmost** available space.

The rightmost empty space on the Influence Track shows how much Money you have to Pay at the end of the Round to keep your civilization functioning. Thus, the more Sectors you Control and Actions you take, the more Money you need to maintain your civilization.`,
    categories: ["game-concepts", "actions", "upkeep"],
    parentId: "game-concepts",
  },
  {
    id: "control",
    heading: "Control",
    level: 3,
    content: `The player with an Influence Disc in a Sector **Controls** it. Controlling Sectors allows you to expand your empire by colonizing planets, Producing Resources, Building Ships and Structures, and Exploring, Moving or Influencing from a Sector. The player that Controls a Sector Controls its Structures and is always considered the Defender in battles there.`,
    categories: ["game-concepts", "combat"],
    parentId: "game-concepts",
  },
  {
    id: "tech",
    heading: "Tech",
    level: 3,
    content: `Researching Techs gives your civilization advantages. Some Techs are prerequisites for Upgrading your Ships with new Ship Part Tiles or Building Starbases and Structures, while others make your civilization more efficient (e.g. increasing your Production or giving you more Influence Discs). Techs are divided into three basic categories (**Military**, **Grid**, or **Nano**) plus **Rare Techs**. Each Tech you Research gives you a discount on further Techs Researched in the same category. Researched Tech Tiles are placed on the Tech Track of your Species Board.`,
    categories: ["game-concepts", "technologies"],
    parentId: "game-concepts",
  },
  {
    id: "ships",
    heading: "Ships",
    level: 3,
    content: `Ships are used for Exploring and fighting opponents (players, the non-player Ancients, Guardians, and the GCDS). There are four kinds of Ships:

- **Interceptors** (8 per player)
- **Cruisers** (4 per player)
- **Dreadnoughts** (2 per player)
- **Starbases** (4 per player)

Bigger Ships cost more to Build but have more space for Ship Parts. Starbases are immobile.`,
    categories: ["game-concepts", "ship-parts", "combat"],
    parentId: "game-concepts",
  },
  {
    id: "blueprints",
    heading: "Blueprints",
    level: 3,
    content: `All Ships have Blueprints depicting their abilities (e.g. weapons, Initiative, Shields, etc.). Non-player Ship Blueprints are represented by Blueprint Tiles which do not change during the game. Player Ship Blueprints are represented on their Species Board and can be customized during the game using the Upgrade Action.

- _Note: Some Ship Blueprints have extra Ship Parts outside the Ship Part grid. These work just like other Ship Parts except that they cannot be replaced._
- _Note: One Discovery Tile provides a Ship Part that is placed outside the Ship Part grid._`,
    categories: ["game-concepts", "ship-parts"],
    parentId: "game-concepts",
  },
  {
    id: "ship-parts",
    heading: "Ship Parts",
    level: 3,
    content: `Ship Parts on Blueprints indicate which abilities a Ship has. They can be preprinted on player Species Boards or gained with the Upgrade Action. Many Ship Parts can only be Upgraded once their corresponding Tech Tile has been Researched.`,
    categories: ["ship-parts", "combat"],
    parentId: "game-concepts",
  },
  {
    id: "structures",
    heading: "Structures",
    level: 3,
    content: `Structures are colossal objects Built in your Controlled Sectors.

- **Orbitals:** Provide an additional Population Square.
- **Monoliths:** Grant VP at the end of the game.
  Structures are permanent, remaining in the Sector they are Built until the end of the game.`,
    categories: ["structures", "scoring"],
    parentId: "game-concepts",
  },
  {
    id: "zones-and-rings",
    heading: "Zones and Rings",
    level: 3,
    content: `The game board is comprised of Zones, empty spaces where each Sector can be placed during the game with the Explore Action. Zones and Sectors are grouped into Rings: **Inner (I)**, **Middle (II)**, and **Outer (III)**. This corresponds to their distance from the Galactic Center Sector in the middle of the board. Rings are used to determine which type of Sector is revealed when Exploring a Zone.`,
    categories: ["game-concepts", "movement"],
    parentId: "game-concepts",
  },
  {
    id: "sectors",
    heading: "Sectors",
    level: 3,
    content: `The game board is built from hexagonal Sector tiles. Each Sector represents a star system and may contain Population Squares representing worlds Producing Resources.`,
    categories: ["game-concepts", "movement"],
    parentId: "game-concepts",
  },
  {
    id: "wormholes",
    heading: "Wormholes",
    level: 3,
    content: `Due to the immense distance between Sectors, Ships may only Move using the Wormhole network. The Wormhole network is represented by the individual Wormholes on the edge(s) of Sector tiles. Wormholes may normally only be used to Explore, Move to, and Influence adjacent Sectors if the edges connecting the Sector tiles each contain a Wormhole, creating a **Wormhole Connection**.`,
    categories: ["game-concepts", "movement"],
    parentId: "game-concepts",
  },
  {
    id: "discovery-tiles",
    heading: "Discovery Tiles",
    level: 3,
    content: `Some Sectors contain a Discovery Tile which is awarded when the Sector is first Explored (in the case of unoccupied Sectors) or the Sector's defender is destroyed (in the case of occupied Sectors). Each Discovery Tile is double-sided: the front showing one of various rewards (extra Resources, new Technologies, Ancient Ship Parts, etc.) and the back showing a 2 VP value. When awarded a Discovery Tile you must reveal it and decide which side to use before ending your Activation (or the Combat Phase if awarded during the Combat Phase).`,
    categories: ["discovery", "scoring", "actions"],
    parentId: "game-concepts",
  },
  {
    id: "ambassador-tiles",
    heading: "Ambassador Tiles",
    level: 3,
    content: `In games with four or more players, you can use your Ambassadors to form Diplomatic Relations with other players. Diplomatic Relations increase your Production and are worth VP at the end of the game.`,
    categories: ["diplomacy", "scoring"],
    parentId: "game-concepts",
  },
  {
    id: "reputation-tiles",
    heading: "Reputation Tiles",
    level: 3,
    content: `You receive Reputation Tiles for participating in combat. They are worth VP at the end of the game.`,
    categories: ["combat", "scoring"],
    parentId: "game-concepts",
  },
  {
    id: "limited-vs-unlimited-components",
    heading: "Limited vs Unlimited Components",
    level: 3,
    content: `Ships, Population Cubes, Influence Discs, Tech Tiles, Discovery Tiles, Reputation Tiles, Sectors, and Ambassador Tiles are all limited to the components included in the game. If they run out, they run out. All other game components are meant to be unlimited. If unlimited components run out, use the provided extra tiles or another substitute.`,
    categories: ["game-concepts", "components"],
    parentId: "game-concepts",
  },
  {
    id: "warp-portals-optional-module",
    heading: "Warp Portals (Optional Module)",
    level: 3,
    content: `The Warp Portals are an optional module that opens up the galaxy, making it often possible to Move, Influence, and form Diplomatic Relations across the game board. The Warp Portals consist of three Sectors [one Middle (II) and two Outer (III)], one Discovery Tile, one Rare Tech, and one Warp Portal Tile. To use the module, shuffle components with base game components. All Sectors with Warp Portals are considered to be adjacent to each other and have a full Wormhole Connection between them. You may Move, Influence, and form Diplomatic Relations through Warp Portals.`,
    categories: ["game-concepts", "movement"],
    parentId: "game-concepts",
  },
  {
    id: "game-round",
    heading: "GAME ROUND",
    level: 2,
    content: `Each game Round consists of four phases:

1. **ACTION PHASE:** Take Actions clockwise, one Action at a time until all players have Passed.
2. **COMBAT PHASE:** Resolve battles and conquer Sectors.
3. **UPKEEP PHASE:** Pay Civilization Upkeep Costs and Produce Resources.
4. **CLEANUP PHASE:** Return Influence Discs from Action Spaces to the Influence Track and draw new Tech Tiles.`,
    categories: ["game-concepts"],
  },
  {
    id: "action-phase",
    heading: "ACTION PHASE",
    level: 2,
    content: `Starting with the player holding the Start Player Tile, and moving clockwise, you may take one **Action** or **Pass**. This continues until all players' Summary Tiles are flipped with the Reaction Overview faceup, at which point the Action Phase immediately ends.

When taking an Action, move the leftmost Influence Disc from your Influence Track to the Action Space on your Action Track corresponding with the chosen Action. Stack subsequent Influence Discs on top of any already occupying an Action Space; the same Action may be taken multiple times.

**The possible Actions are:**

- **EXPLORE**
- **RESEARCH**
- **UPGRADE**
- **BUILD**
- **MOVE**
- **INFLUENCE**`,
    categories: ["actions"],
    children: [
      "passing",
      "colony-ships-action",
      "exp-explore",
      "res-research",
      "upg-upgrade",
      "bui-build",
      "mov-move",
      "inf-influence",
      "reactions",
    ],
  },
  {
    id: "passing",
    heading: "Passing",
    level: 3,
    content: `The first time you Pass in a Round, flip your Summary Tile with the Reactions Overview faceup. The first player to Pass receives 2 Money and the Start Player Tile for the next Round.
On subsequent Actions, players who have Passed may take one **Reaction** or Pass. Reactions are weaker versions of the Upgrade, Build, and Move Actions.`,
    categories: ["actions"],
    parentId: "action-phase",
  },
  {
    id: "colony-ships-action",
    heading: "Colony Ships",
    level: 3,
    content: `At any time during your Action or Reaction you may use one or more of your faceup Colony Ships by flipping them facedown. For each Colony Ship used this way, you may move one Population Cube from your Control Board to any empty Population Square in a Sector you Control. Each Population Cube you move must be taken from the Population Track that corresponds to the color of the Population Square it is being placed on. **Colony Ships are the only way to move Population Cubes to Sectors!**

- **Gray Population Squares:** May receive a Population Cube from any of the three Population Tracks.
- **Advanced Population Squares (Star symbol):** You may only place Population Cubes here if you have Researched the related Advanced Tech (Advanced Mining, Advanced Labs, Advanced Economy, or Metasynthesis).
- **Orbitals:** May only receive a Population Cube from the Science or Money Population Tracks.`,
    categories: ["actions", "upkeep"],
    parentId: "action-phase",
  },
  {
    id: "exp-explore",
    heading: "[EXP] EXPLORE",
    level: 3,
    content: `The Explore Action allows you to discover new Sectors to colonize. Each Explore Action grants you the number of Explore Activations indicated by the Explore Action Icon on your Species Board.

For each Explore Activation:

1. Choose one Unexplored Zone next to a Sector where you have Control or at least one Unpinned Ship.
2. Flip a Sector tile faceup from the stack corresponding to the chosen Zone's position (Ring I, II, or III).
3. Choose whether to place the flipped Sector or discard it.

- _Note: To place the Sector, the edge of a Sector you can Explore from must have a Wormhole adjacent to the Zone being Explored (unless you have the Wormhole Generator Tech)._

**Placing Explored Sectors:**
Placed Sectors must be oriented so that a Wormhole Connection is made with a Sector where you have Control or at least one Unpinned Ship.

- If the Sector contains a **Discovery Tile Symbol**, place a Discovery Tile on it facedown.
- If the Sector contains **Ancient Symbols**, place that many Ancients on top of the Discovery Tile.

**Discovery Tiles:** As part of your Explore Activation, take the Discovery Tile from any undefended (no Ancients) Sector Explored this Action. You must reveal it and decide whether to use the reward or keep it for VP (2 VP).

**Taking Control:** After placing an Explored Sector, you may take Control of it by placing an Influence Disc from your Influence Track on the Sector's Influence Space. You cannot take Control of a Sector containing Ancients until they are destroyed.

**Discarding:** If you do not want to place the Sector, discard it faceup to the appropriate discard pile. This ends your Activation.`,
    categories: ["actions", "discovery", "movement"],
    parentId: "action-phase",
  },
  {
    id: "res-research",
    heading: "[RES] RESEARCH",
    level: 3,
    content: `The Research Action allows you to Research new Techs. Each Research Action grants you the number of Research Activations indicated on your Species Board.

For each Research Activation, you may Research one available Tech Tile from the Tech Tray by Paying its Science cost.

1. Place the Tech Tile on the leftmost available space of the matching Tech Track (Military, Grid, or Nano) on your Species Board.
2. **Discounts:** Each Tech you have in a category gives a discount on further Techs in the same category (indicated by the lowest visible discount value on your board). However, all Techs have a minimum Science cost.

**Restrictions:**

- If a track is full, no more Techs of that type may be Researched.
- You cannot Research a Tech you already have.
- You cannot discard a Researched Tech.

**Tech Types:**

- **Ship Part:** Allows Upgrading to this part.
- **Build:** Allows Building this Ship/Structure.
- **Instant:** One-time effect.
- **Permanent:** Active until end of game.

**VP:** At game end, score VP shown on the leftmost uncovered VP symbol on each Tech Track.`,
    categories: ["actions", "technologies"],
    parentId: "action-phase",
  },
  {
    id: "upg-upgrade",
    heading: "[UPG] UPGRADE",
    level: 3,
    content: `The Upgrade Action allows you to modify your Ship Blueprints. When you Upgrade a Blueprint, **all** Ships of that type are instantly Upgraded.

Each Upgrade Action grants you the number of Upgrade Activations indicated on your Species Board. With each Upgrade Activation you may, in order:

1. **Return** any number of Ship Part Tiles from your Blueprints to the Upgrade Tray. (Exception: Ancient Ship Parts are removed from the game, not returned to the Tray.)
2. **Move** any one Ship Part Tile from the Upgrade Tray to any empty or preprinted Ship Part Space on a Ship Blueprint.

**Restrictions:**

- You must have Researched the requisite Tech for the part.
- Total Energy Consumption cannot exceed Total Energy Production.
- Drive parts cannot be put on Starbases.
- Interceptors, Cruisers, and Dreadnoughts must have at least one Drive.

**Ship Part Stats:**

- **Weapons:** Roll dice of corresponding color (Yellow=1 dmg, Orange=2 dmg, Blue=3 dmg, Red=4 dmg).
- **Computers:** Add value to Hit rolls.
- **Shields:** Subtract value from opponent Hit rolls.
- **Hull:** Absorbs damage.
- **Drives:** Determine Movement Value and Initiative.
- **Energy Sources:** Provide Energy.`,
    categories: ["actions", "ship-parts"],
    parentId: "action-phase",
  },
  {
    id: "bui-build",
    heading: "[BUI] BUILD",
    level: 3,
    content: `The Build Action allows you to Build Ships and Structures. Each Build Action grants you the number of Build Activations indicated on your Species Board.

For each Build Activation, you may Build one Ship or Structure in any Sector you Control by Paying the Materials cost.

- **Interceptor:** 3 Materials
- **Cruiser:** 5 Materials
- **Dreadnought:** 8 Materials
- **Starbase:** 3 Materials
- **Orbital:** 4 Materials
- **Monolith:** 10 Materials

**Restrictions:**

- Must have requisite Tech for Starbases/Structures.
- Max 1 Monolith and 1 Orbital per Sector.`,
    categories: ["actions", "structures"],
    parentId: "action-phase",
  },
  {
    id: "mov-move",
    heading: "[MOV] MOVE",
    level: 3,
    content: `The Move Action allows you to Move your Ships. Each Move Action grants the number of Move Activations indicated on your Species Board.

For each Move Activation, you may Move one Ship up to the number of Sectors determined by its **Movement Value** (total Drive value).

- Ships may only Move to Sectors with a Wormhole Connection (unless you have Wormhole Generator).
- Cannot move to Unexplored Zones.
- **Pinning:** Pinned Ships cannot Move from a Sector containing opponent Ships.
- To determine Pinning, total the number of opponent Ships. Each opponent Ship Pins one of your Ships (your choice).
- The GCDS Pins all Ships in the Galactic Center.`,
    categories: ["actions", "movement"],
    parentId: "action-phase",
  },
  {
    id: "inf-influence",
    heading: "[INF] INFLUENCE",
    level: 3,
    content: `The Influence Action allows you to modify Control. Each Influence Action grants the number of Activations indicated on your board **PLUS** allows you to flip up to two used Colony Ships faceup.

Each Influence Activation allows you to move an Influence Disc from your Track or a Controlled Sector to:

1. An Uncontrolled Sector where no opponent Ships are present AND a Wormhole Connection exists to a Sector you have a Ship or Control in.
2. An Uncontrolled Sector where only you have a Ship.
3. The rightmost empty space of your Influence Track.

**Removing Discs:** If you remove a Disc from a Sector, return all Population Cubes from that Sector to your Tracks.`,
    categories: ["actions"],
    parentId: "action-phase",
  },
  {
    id: "reactions",
    heading: "REACTIONS",
    level: 3,
    content: `After Passing, you can only take Reactions.

- **UPGRADE:** 1 Upgrade Activation.
- **BUILD:** 1 Build Activation.
- **MOVE:** 1 Move Activation.
  _(Techs granting extra Activations do not apply to Reactions)_`,
    categories: ["actions"],
    parentId: "action-phase",
  },
  {
    id: "diplomatic-relations-4-players",
    heading: "DIPLOMATIC RELATIONS (4+ Players)",
    level: 2,
    content: `In games with 4+ players, any two players may propose Diplomatic Relations during their Action.

**Requirements:**

- Wormhole Connection between Sectors they Control (Wormhole Generator does not count).
- Neither player has Ships in a Sector Controlled by/containing Ships of the other.
- Don't already have an Ambassador from that player.
- Neither holds the Traitor Tile.
- Both have space on Reputation Track.

**Effect:**
Exchange Ambassador Tiles. Place a Population Cube from any Track on the Ambassador Tile. It provides production and 1 VP.

**Breaking Relations:**
Only an **Act of Aggression** breaks relations (having Ships in a Sector where the other player has a Ship or Control at the end of your Action).

- Return Ambassadors/Cubes.
- Aggressor receives **Traitor Tile** (-2 VP, cannot form relations).`,
    categories: ["diplomacy", "scoring"],
  },
  {
    id: "combat-phase",
    heading: "COMBAT PHASE",
    level: 2,
    content: `Battles occur if a Sector is occupied by more than one opponent. Battles are resolved in descending Sector Number order.

**Battle Steps:**

1. **Determine Battles:** Identify Sectors.
2. **Resolve Battles:**

- Determine Attacker/Defender (Controller is always Defender; otherwise, first to enter is Defender).
- Determine Initiative (Highest Initiative acts first; Defender wins ties).
- **Missiles:** Fire once before engagement rounds, by Ship type in Initiative order.
- **Engagement Rounds:** Repeat until one side Retreats or is destroyed.
- Activate Ships in Initiative order.
- Roll dice for Weapons.
- **Hit:** 6+ (after Computer + and Shield - modifiers). Die results showing burst symbol (★) are always a Hit. Natural 1 is always a miss.
- **Damage:** Assign damage to Ships. If damage >= Hull, Ship is destroyed. Excess damage cannot spill over to other Ships.

3. **Draw Reputation Tiles:**

- 1 Tile for participating.
- 1 per Interceptor/Starbase/Ancient destroyed.
- 2 per Cruiser/Guardian destroyed.
- 3 per Dreadnought/GCDS destroyed.
- Draw max 5, keep 1.

4. **Attack Population:** Surviving Ships attack Population Cubes (Cube has 0 Shield). Each hit destroys a Cube. (Neutron Bombs destroy all automatically).
5. **Influence Sectors:** If you have a Ship in an Uncontrolled Sector with no Population, you may place an Influence Disc.
6. **Discovery Tiles:** Claim tiles in Sectors where you have a Ship.
7. **Repair Damage:** Remove all Damage Cubes.

**Retreating:** Ships may Retreat to a Controlled Sector with no enemies via a Wormhole Connection (or half-connection with Wormhole Generator). On their next Ship Activation, Retreating Ships complete Retreat by moving to the neighboring Sector. They can be Attacked until they leave.

**Retreat Penalty:** If ALL your remaining Ships attempt to Retreat, you do NOT draw a Reputation Tile for participating (but still draw for destroyed enemy Ships).

**Stalemate:** If neither side can destroy the other (e.g., all Ships unarmed or only have Missiles), the Attacker must Retreat or their Ships are destroyed.

**NPC Damage Assignment:** When battling Ancients/Guardians/GCDS, another player rolls their dice. Hits are assigned to destroy your Ships largest-to-smallest; if none can be destroyed, damage is assigned largest-to-smallest.

**Structures:** Orbitals and Monoliths cannot be destroyed and are never removed from Sectors. Orbital Population Cubes can still be Attacked.`,
    categories: ["combat"],
  },
  {
    id: "upkeep-phase",
    heading: "UPKEEP PHASE",
    level: 2,
    content: `1. **Colony Ships:** Activate remaining Colony Ships to colonize Sectors (only if no opponents present).
2. **Civilization Upkeep:** Compare Money Income (Population Track) vs Upkeep Cost (Influence Track).

- Adjust Money Storage by the difference.
- **Bankruptcy:** If you cannot pay, you must Trade resources for Money or Abandon Sectors (returning Discs/Cubes) until you can pay. If you still can't pay, you are Eliminated.

3. **Production:** Gain Materials and Science based on Population Tracks.`,
    categories: ["upkeep"],
  },
  {
    id: "cleanup-phase",
    heading: "CLEANUP PHASE",
    level: 2,
    content: `1. **Techs:** Draw new Tech Tiles until the indicated number for your player count is reached (2p:5, 3p:6, 4p:7, 5p:8, 6p:9). Rare Techs do not count toward this number.
2. **Reset:** Return Influence Discs from Action Spaces to Track. Return Population Cubes from Graveyards to their respective Population Tracks (if a track is full, place on another track). Flip Colony Ships/Summary Tile faceup.
3. **Round:** Advance Round Marker.`,
    categories: ["game-concepts", "technologies"],
  },
  {
    id: "game-end",
    heading: "GAME END",
    level: 2,
    content: `The game ends after the 8th Round.

**VICTORY POINTS (VP):**

- **Reputation Tiles:** 1-4 VP per tile.
- **Ambassador Tiles:** 1 VP per tile.
- **Controlled Sectors:** 1-4 VP per Sector.
- **Monoliths:** 3 VP per Monolith.
- **Discovery Tiles:** 2 VP if kept for points.
- **Traitor Tile:** -2 VP.
- **Tech Tracks:** 4 tiles=1 VP, 5=2 VP, 6=3 VP, 7=5 VP.
- **Species Bonuses:** Specific to species.

**Tiebreaker:** Highest total Resources (Materials + Science + Money).`,
    categories: ["scoring"],
  },
  {
    id: "alien-species",
    heading: "ALIEN SPECIES",
    level: 2,
    content: ``,
    categories: ["species"],
    children: [
      "eridani-empire",
      "hydran-progress",
      "planta",
      "descendants-of-draco",
      "mechanema",
      "orion-hegemony",
      "terran-factions-standard",
    ],
  },
  {
    id: "eridani-empire",
    heading: "ERIDANI EMPIRE",
    level: 3,
    content: `- **Start:** 4 Materials, 2 Science, 2 Money. 3 Colony Ships.
- **Trade:** 3:1
- **Sector:** 222
- **Techs:** Gauss Shield, Fusion Drive, Plasma Cannon.
- **Special:** Start with 2 fewer Influence Discs. Draw 2 Reputation Tiles before game starts. Ships have extra Energy.`,
    categories: ["species"],
    parentId: "alien-species",
  },
  {
    id: "hydran-progress",
    heading: "HYDRAN PROGRESS",
    level: 3,
    content: `- **Start:** 2 Materials, 6 Science, 2 Money. 3 Colony Ships.
- **Trade:** 3:1
- **Sector:** 224
- **Tech:** Advanced Labs.
- **Special:** 2 Research Activations per Research Action. Start with a Science Cube in Advanced Science square.`,
    categories: ["species"],
    parentId: "alien-species",
  },
  {
    id: "planta",
    heading: "PLANTA",
    level: 3,
    content: `- **Start:** 4 Materials, 3 Science, 2 Money. 4 Colony Ships.
- **Trade:** 4:1
- **Sector:** 226
- **Tech:** Starbase.
- **Special:** 2 Explore Activations per Explore Action. Population destroyed by enemy Ships at end of Combat (not by Ancients). +1 VP per Controlled Sector. Ships have weak Initiative but extra Power/Computer.`,
    categories: ["species"],
    parentId: "alien-species",
  },
  {
    id: "descendants-of-draco",
    heading: "DESCENDANTS OF DRACO",
    level: 3,
    content: `- **Start:** 3 Materials, 4 Science, 2 Money. 3 Colony Ships.
- **Trade:** 3:1
- **Sector:** 228
- **Tech:** Fusion Drive.
- **Special:** Explore: Flip 2 sectors, choose 1 or none to place (unplaced go to discard faceup). Peaceful with Ancients (can share sectors, don't fight). 1 VP per Ancient Sector you Control at game end.`,
    categories: ["species"],
    parentId: "alien-species",
  },
  {
    id: "mechanema",
    heading: "MECHANEMA",
    level: 3,
    content: `- **Start:** 4 Materials, 3 Science, 3 Money. 3 Colony Ships.
- **Trade:** 3:1
- **Sector:** 230
- **Tech:** Positron Computer.
- **Special:** 3 Upgrade/Build Activations per Upgrade/Build Action. Cheaper Building costs (Interceptor: 2, Cruiser: 4, Dreadnought: 7, Starbase: 2).`,
    categories: ["species"],
    parentId: "alien-species",
  },
  {
    id: "orion-hegemony",
    heading: "ORION HEGEMONY",
    level: 3,
    content: `- **Start:** 4 Materials, 3 Science, 3 Money. 3 Colony Ships.
- **Trade:** 4:1
- **Sector:** 232
- **Techs:** Neutron Bombs, Gauss Shield.
- **Special:** Start with Cruiser instead of Interceptor. +2 Initiative on all Ships. Ships have extra Energy.`,
    categories: ["species"],
    parentId: "alien-species",
  },
  {
    id: "terran-factions-standard",
    heading: "TERRAN FACTIONS (Standard)",
    level: 3,
    content: `- **Start:** 4 Materials, 3 Science, 3 Money. 3 Colony Ships.
- **Tech:** Starbase.
- **Trade:** 2:1 (Aliens are usually 3:1 or 4:1).
- **Sectors:** 221, 223, 225, 227, 229, 231.`,
    categories: ["species"],
    parentId: "alien-species",
  },
  {
    id: "technology-reference",
    heading: "TECHNOLOGY REFERENCE",
    level: 2,
    content: `Military Technologies

| Technology        | Cost | Type    | Effect                                                                                   |
| ----------------- | ---- | ------- | ---------------------------------------------------------------------------------------- |
| **Neutron Bombs** | 2    | Instant | When Attacking Population, all Population Cubes in a Sector are destroyed automatically. |

|
| **Starbase** | 3 | Build | You may Build Starbases.

|
| **Plasma Cannon** | 4 | Ship Part | You may Upgrade your Ship Blueprints with **Plasma Cannon** Ship Parts.

|
| **Phase Shield** | 6 | Ship Part | You may Upgrade your Ship Blueprints with **Phase Shield** Ship Parts.

|
| **Advanced Mining** | 10 | Permanent | You may place Population Cubes in **Advanced Materials** Population Squares with your Colony Ships.

|
| **Tachyon Source** | 12 | Ship Part | You may Upgrade your Ship Blueprints with **Tachyon Source** Ship Parts.

|
| **Gluon Computer** | 14 | Ship Part | You may Upgrade your Ship Blueprints with **Gluon Computer** Ship Parts.

|
| **Plasma Missile** | 16 | Ship Part | You may Upgrade your Ship Blueprints with **Plasma Missile** Ship Parts.

|

Grid Technologies

| Technology       | Cost | Type      | Effect                                                                 |
| ---------------- | ---- | --------- | ---------------------------------------------------------------------- |
| **Gauss Shield** | 2    | Ship Part | You may Upgrade your Ship Blueprints with **Gauss Shield** Ship Parts. |

|
| **Fusion Source** | 4 | Ship Part | You may Upgrade your Ship Blueprints with **Fusion Source** Ship Parts.

|
| **Improved Hull** | 6 | Ship Part | You may Upgrade your Ship Blueprints with **Improved Hull** Ship Parts.

|
| **Positron Computer** | 8 | Ship Part | You may Upgrade your Ship Blueprints with **Positron Computer** Ship Parts.

|
| **Advanced Economy** | 10 | Permanent | You may place Population Cubes in **Advanced Money** Population Squares with your Colony Ships.

|
| **Tachyon Drive** | 12 | Ship Part | You may Upgrade your Ship Blueprints with **Tachyon Drive** Ship Parts.

|
| **Antimatter Cannon** | 14 | Ship Part | You may Upgrade your Ship Blueprints with **Antimatter Cannon** Ship Parts.

|
| **Quantum Grid** | 16 | Instant | You receive two additional Influence Discs, placed immediately on your Influence Track.

|

Nano Technologies

| Technology     | Cost | Type      | Effect                                                          |
| -------------- | ---- | --------- | --------------------------------------------------------------- |
| **Nanorobots** | 2    | Permanent | You have one extra Activation when taking the **Build** Action. |

|
| **Fusion Drive** | 4 | Ship Part | You may Upgrade your Ship Blueprints with **Fusion Drive** Ship Parts.

|
| **Orbital** | 6 | Build | You may Build Orbitals.

|
| **Advanced Robotics** | 8 | Instant | You receive one additional Influence Disc, placed immediately on your Influence Track.

|
| **Advanced Labs** | 10 | Permanent | You may place Population Cubes in **Advanced Science** Population Squares with your Colony Ships.

|
| **Monolith** | 12 | Build | You may Build Monoliths.

|
| **Wormhole Generator** | 14 | Permanent | You may Explore, Move to, and Influence adjacent Sectors if the edges connecting the Sectors contain one Wormhole.

|
| **Artifact Key** | 16 | Instant | For each Artifact on Sectors you Control, immediately gain 5 Resources of a single type.

|

Rare Technologies

_Unlike regular Techs, only one of each Rare Tech is ever available per game._

| Technology              | Effect                                                                  |
| ----------------------- | ----------------------------------------------------------------------- |
| **Antimatter Splitter** | Allows you to split damage from Antimatter Cannons freely over targets. |

|
| **Conifold Field** | You may Upgrade your Ship Blueprints with **Conifold Field** Ship Parts.

|
| **Neutron Absorber** | Enemy **Neutron Bombs** have no effect on you. _Note: this does not affect Planta's Species weakness_.

|
| **Absorption Shield** | You may Upgrade your Ship Blueprints with **Absorption Shield** Ship Parts.

|
| **Cloaking Device** | Two Ships are required to Pin each of your Ships.

|
| **Improved Logistics** | Gain 1 additional Move Activation during each Move Action you take.

|
| **Sentient Hull** | You may Upgrade your Ship Blueprints with **Sentient Hull** Ship Parts.

|
| **Soliton Cannon** | You may Upgrade your Ship Blueprints with **Soliton Cannon** Ship Parts.

|
| **Transition Drive** | You may Upgrade your Ship Blueprints with **Transition Drive** Ship Parts.

|
| **Warp Portal** | Immediately place the Warp Portal Tile on any Sector you Control. The Warp Portal Tile connects this Sector to all other Warp Portal Sectors and is worth 1 VP if Controlled at the end of the game.

|
| **Flux Missile** | You may Upgrade your Ship Blueprints with **Flux Missile** Ship Parts.

|
| **Pico Modulator** | Gain 2 additional Upgrade Activations during each Upgrade Action you take.

|
| **Ancient Labs** | Immediately draw and resolve one Discovery Tile.

|
| **Zero-Point Source** | You may Upgrade your Ship Blueprints with **Zero-Point Source** Ship Parts.

|
| **Metasynthesis** | You may place Population Cubes in **any** Advanced Population Squares with your Colony Ships.

|`,
    categories: ["technologies", "ship-parts"],
  },
  {
    id: "ship-part-reference",
    heading: "SHIP PART REFERENCE",
    level: 2,
    content: `| Ship Part             | Type     | Stats / Effect                               | Energy Cost |
| --------------------- | -------- | -------------------------------------------- | ----------- |
| **Ion Cannon**        | Weapon   | 1 Yellow Die (1 Damage)                      | 1           |
| **Plasma Cannon**     | Weapon   | 1 Orange Die (2 Damage)                      | 2           |
| **Soliton Cannon**    | Weapon   | 1 Blue Die (3 Damage)                        | 3           |
| **Antimatter Cannon** | Weapon   | 1 Red Die (4 Damage)                         | 4           |
| **Ion Missile**       | Weapon   | 1 Yellow Die (1 Damage), Missile             | 0           |
| **Plasma Missile**    | Weapon   | 1 Orange Die (2 Damage), Missile             | 0           |
| **Flux Missile**      | Weapon   | 1 Red Die (4 Damage), Missile                | 0           |
| **Electron Computer** | Computer | +1 to Hit                                    | 0           |
| **Positron Computer** | Computer | +2 to Hit                                    | 1           |
| **Gluon Computer**    | Computer | +3 to Hit                                    | 2           |
| **Hull**              | Hull     | 1 Hull Point                                 | 0           |
| **Improved Hull**     | Hull     | 2 Hull Points                                | 0           |
| **Sentient Hull**     | Hull     | 1 Hull Point, 1 Computer (+1 Hit)            | 1           |
| **Gauss Shield**      | Shield   | -1 to Opponent Hit Rolls                     | 0           |
| **Phase Shield**      | Shield   | -2 to Opponent Hit Rolls                     | 1           |
| **Absorption Shield** | Shield   | -1 to Opponent Hit Rolls, Generates 1 Energy | 0           |
| **Conifold Field**    | Shield   | -3 to Opponent Hit Rolls                     | 2           |
| **Nuclear Drive**     | Drive    | Speed 1, Initiative +1                       | 1           |
| **Fusion Drive**      | Drive    | Speed 2, Initiative +2                       | 2           |
| **Tachyon Drive**     | Drive    | Speed 3, Initiative +3                       | 3           |
| **Transition Drive**  | Drive    | Speed 3, Generates 2 Energy                  | 0           |
| **Nuclear Source**    | Source   | Generates 3 Energy                           | -           |
| **Fusion Source**     | Source   | Generates 6 Energy                           | -           |
| **Tachyon Source**    | Source   | Generates 9 Energy                           | -           |
| **Zero-Point Source** | Source   | Generates 12 Energy                          | -           |`,
    categories: ["ship-parts", "combat"],
  },
  {
    id: "non-player-faction-lore",
    heading: "NON-PLAYER FACTION LORE",
    level: 2,
    content: `**ANCIENTS**
There are no reliable documents regarding the seclusion of the Ancients. Most theories are based on the relics found in the systems believed to have been colonized by them. Some of the discoveries possess qualities previously unknown in the Galactic Library, but there is no solid theory on who or what the Ancients were, nor where they disappeared to. Interestingly enough, folk tales of several different species allude to a similar, old, evil. Recent messages from various sectors report of multiple contacts with something described as "Ships unlike any known design, with an unsettling feeling of something hovering outside your field of vision."

**GUARDIANS**
While most of the galaxy still remains uncharted, many systems have already been visited by the Galactic Council Reconnaissance Fleet. The most promising ones have been reserved for Council purposes and declared neutral. Powerful autonomous entities, called the Guardians, have been deployed to maintain order and defend the systems from hostile visitors. However, if the defenses could be broken, the resource-rich planets would provide great opportunities for their new master...

**GALACTIC CENTER**
Established at the end of the Terran–Hegemony War (30.027–33.364), the awkwardly named Galactic Center has since become the contact hub of known spacefaring species. Evolved around the diplomatic Ships that negotiated the peace... the conglomerate of Ships and habitats is now the home for billions of entities, housing both the Galactic Council and the Library of the Galactic Center. The Galactic Center is protected by the Galactic Center Defense System: unmanned automated heavy defenses programmed to target any military presence.`,
    categories: ["discovery", "combat"],
  },
  {
    id: "frequently-asked-questions-faq",
    heading: "FREQUENTLY ASKED QUESTIONS (FAQ)",
    level: 2,
    content: `**Q: Where can I get more Resources?**
**A:** Place Influence Discs on Sectors, and use Colony Ships to move your Population Cubes to Population Squares. Research the Advanced Techs to move your Population Cubes to Advanced Population Squares. Build Orbitals to get more Population Squares. Collect Discovery Tiles.

**Q: What do I need Money for?**
**A:** You need Money to Pay your Civilization Upkeep Cost. The more Actions you take and Sectors you Control, the more you have to Pay each Round.

**Q: That's all?**

**A:** You can also Trade Money for other Resources, and vice versa.

**Q: I don't have enough Influence Discs to do everything I want to. What now?**
**A:** You can use the Influence Action to return up to two Influence Discs from your Sectors to your Influence Track. You can also Research the **Advanced Robotics** and **Quantum Grid** Techs, which give you more Influence Discs. Finally, you can deliberately use more Influence Discs than you can Pay for in the Upkeep Phase, and thus be required to return some of the Influence Discs from your Sectors to your Influence Track.

**Q: The best Techs are terribly expensive. How can I ever afford them?**
**A:** Having Techs of the same category increases the discount you get when buying more. If you buy the Techs in increasing price order, you get the maximum benefit of the discounts.

**Q: What is the benefit of being the Start Player?**

**A:** Besides receiving 2 Money, you also get the first pick of Techs for Research or Zones for Exploring.

**Q: What happens if the extra Influence Discs acquired through the Advanced Robotics and Quantum Grid Techs do not fit on my Influence Track?**
**A:** Stack the extra Influence Discs on top of the Influence Disc on the leftmost space of your Influence Track. You may use these extra Influence Discs normally.

**Q: Using the Influence Action, I can move an Influence Disc from one Sector to a neighboring Sector through a Wormhole Connection. May I move the Influence Disc from the Sector that provides the Wormhole Connection?**

**A:** No. As soon as you remove the Influence Disc from the Sector providing the Wormhole Connection you no longer meet the Influence Action requirements.

**Q: During the Upkeep Phase, when may I remove Influence Discs from my Sectors?**
**A:** Only when you do not have enough Money (Produced in this Upkeep Phase, plus your Storage) to Pay your Civilization Upkeep Cost. Then you may remove Influence Discs until your Civilization Upkeep Cost is low enough. Note that if you remove an Influence Disc from a Sector, the Population Cubes in that Sector are immediately returned to your Population Tracks, which may also reduce your Money Production.

**Q: Is it ever possible to voluntarily remove Population Cubes from the game board without Abandoning the Sector?**

**A:** No. It can be achieved with the Influence Action by first removing the Influence Disc and the Population Cubes from the Sector and then returning the Influence Disc back to the Sector in a separate Influence Action.

**Q: My precious Ships keep getting blown to pieces. How can I win more battles?**
**A:** You have an advantage if you get to shoot first, cannot be Hit, or can take some beating. Upgrade your Drives to increase your Initiative, and use Missiles to Attack before close-range combat. Upgrade Shields to render opponent's Computers useless. Upgrade Hull parts to withstand more Hits. Collect Discovery Tiles to get unique, powerful Ship Parts.

**Q: Aren't Interceptors too small to be of any use?**
**A:** Not really, but they do usually work best when specialized somehow. For example, try Upgrading them with a better Energy Source and they can pack quite a punch. Also, Interceptors are great for Pinning larger Ships, forcing opponents to spend more Actions to use them in important battles.

**Q: Are Shields of any use if my opponents don't have Computers?**
**A:** No. Then again, if they don't have Computers, they most likely won't Hit you anyway. Use that to your advantage.

**Q: If I have the Gluon Computer Tech, can I take Positron Computer Ship Parts?**

**A:** No. Each Ship Part (apart from the default ones, i.e. **Ion Cannon**, **Nuclear Drive**, **Nuclear Source**, **Hull** and **Electron Computer**) requires its own Tech.

**Q: If all of my Ships try to Retreat but are destroyed while doing so, do I get the Reputation Tile for participation in a battle?**

**A:** No. Your Ships incur the Retreat penalty as soon as they attempt to Retreat, regardless of whether they are able to finish Retreating.

**Q: If the Ancients are destroyed from a Descendants-Controlled Sector but the Descendants still Control the Sector, can they take the Discovery Tile?**

**A:** Yes, they take the Discovery Tile at the end of the Combat Phase.

**Q: If the Discovery Tile I get from Ancient Labs allows me to place something in a Sector (such as Ancient Cruiser or Ancient Orbital), where do I place it?**
**A:** You place it in your Starting Sector. If you do not Control your Starting Sector, you must take the tile as 2VP.

**Q: Do I have to use the Descendants' or Planta's Explore ability? If not, when may I choose whether to use it or not?**
**A:** You don't have to draw two Sectors with the Descendants, or Explore twice with Planta. You can decide after seeing the first Sector.

**Q: Can I Move through a Sector containing an opponent's Ships using Cloaking Device without causing an Act of Aggression?**

**A:** Yes.

**Q: In what order do players Influence Sectors at the end of the Combat Phase?**

**A:** For situations where the order of Influencing Sectors at the end of the Combat Phase is important, each Sector is resolved in descending Sector order.`,
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
