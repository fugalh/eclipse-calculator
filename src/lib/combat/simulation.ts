/**
 * Combat Simulation Engine for Eclipse: Second Dawn for the Galaxy
 * Ported from the original battlestats.js to TypeScript
 */

import type {
  DiceColor,
  ShipConfig,
  Fleet,
  BattleResults,
  Dice,
  DicePool,
  Combatant,
  ShipGroup,
  InitiativeOrder,
  BattleStatus,
  SingleBattleResult,
} from "@/lib/types";

import { DAMAGE_VALUES, TARGET_PRIORITY } from "@/lib/types";

// NPC ship classes for targeting logic
const NPC_SHIP_CLASSES = new Set(["Ancient", "Guardian", "GC"]);

// NPC targeting priority: largest ships first (per Eclipse rules for AI opponents)
// Rules: "Dice are assigned to destroy your Ships from largest to smallest"
const NPC_TARGET_PRIORITY: readonly string[] = [
  "Deathmoon",
  "Dreadnought",
  "Cruiser",
  "Starbase",
  "Interceptor",
  "Orbital",
];

// Re-export types for backward compatibility
export type { DiceColor, ShipConfig, Fleet, BattleResults } from "@/lib/types";

// ============================================================================
// Dice Functions
// ============================================================================

function createDice(
  diceType: DiceColor,
  originShip: Combatant,
  isMissile: boolean,
): Dice {
  return {
    damageValue: DAMAGE_VALUES[diceType],
    type: diceType,
    origin: originShip,
    isMissile,
    value: Math.floor(6 * Math.random()) + 1,
  };
}

function checkHit(dice: Dice, target: Combatant): boolean {
  let shields = target.shields;
  if (dice.isMissile && target.missile_shield) {
    shields += 2;
  }
  // Natural 6 always hits, natural 1 always misses
  return (
    (dice.value + dice.origin.computers - shields >= 6 || dice.value === 6) &&
    dice.value !== 1
  );
}

function createDicePool(ships: Combatant[], missilePhase: boolean): DicePool {
  const dicePool: DicePool = { dice: [] };

  if (ships.length === 0) {
    return dicePool;
  }

  const shipCount = ships.length;
  const firstShip = ships[0];

  if (missilePhase) {
    // Missile phase - 1 die per missile
    for (let i = 0; i < firstShip.missiles_yellow * shipCount; i++) {
      dicePool.dice.push(createDice("yellow", firstShip, true));
    }
    for (let i = 0; i < firstShip.missiles_orange * shipCount; i++) {
      dicePool.dice.push(createDice("orange", firstShip, true));
    }
    for (let i = 0; i < firstShip.missiles_blue * shipCount; i++) {
      dicePool.dice.push(createDice("blue", firstShip, true));
    }
    for (let i = 0; i < firstShip.missiles_red * shipCount; i++) {
      dicePool.dice.push(createDice("red", firstShip, true));
    }
  } else {
    // Cannon phase
    for (let i = 0; i < firstShip.yellow * shipCount; i++) {
      dicePool.dice.push(createDice("yellow", firstShip, false));
    }
    for (let i = 0; i < firstShip.orange * shipCount; i++) {
      dicePool.dice.push(createDice("orange", firstShip, false));
    }
    for (let i = 0; i < firstShip.blue * shipCount; i++) {
      dicePool.dice.push(createDice("blue", firstShip, false));
    }
    for (let i = 0; i < firstShip.red * shipCount; i++) {
      dicePool.dice.push(createDice("red", firstShip, false));
    }

    // Antimatter Splitter converts red dice to 4 yellow dice with same value
    if (firstShip.splitter) {
      splitAntimatter(dicePool);
    }
  }

  return dicePool;
}

// TODO: Add UI toggle for Antimatter Splitter interpretation
// - "Generous" (default): 4 separate yellow dice, 4 hit checks
// - "Strict": 1 hit check, distribute 4 damage points
// The current implementation uses the "generous" interpretation.

/**
 * Default Antimatter Splitter implementation (generous interpretation).
 * Converts each red die to 4 yellow dice with the same roll value.
 * This creates 4 separate hit checks, which is more favorable to the attacker.
 */
function splitAntimatter(dicePool: DicePool): void {
  const redDice = dicePool.dice.filter((dice) => dice.type === "red");
  dicePool.dice = dicePool.dice.filter((dice) => dice.type !== "red");

  for (const redDie of redDice) {
    for (let i = 0; i < 4; i++) {
      const yellowDie = createDice("yellow", redDie.origin, false);
      yellowDie.value = redDie.value; // Same value as the red die
      dicePool.dice.push(yellowDie);
    }
  }
}

/**
 * Strict Antimatter Splitter implementation (rules-strict interpretation).
 * Keeps red dice but marks them for damage distribution.
 * Each red die that hits can distribute its 4 damage freely across valid targets.
 * This is currently unused but available for future UI toggle implementation.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function splitAntimatterStrict(dicePool: DicePool): void {
  // In strict mode, we keep the red dice as-is.
  // The distributeHits function would need to handle splitter damage specially:
  // - One hit check per red die
  // - If it hits, distribute 4 damage points optimally across targets
  // For now, this is a placeholder - the actual distribution logic would need
  // to be integrated into distributeHits() when the UI toggle is implemented.
  void dicePool; // Placeholder - no transformation needed in strict mode
}

// ============================================================================
// Combatant Functions
// ============================================================================

function createCombatant(config: ShipConfig, isDefender: boolean): Combatant {
  return {
    shipClass: config.shipClass || `Unknown ${Math.round(100 * Math.random())}`,
    name: config.name || config.shipClass,
    hull: config.hull || 0,
    yellow: config.yellow || 0,
    orange: config.orange || 0,
    blue: config.blue || 0,
    red: config.red || 0,
    missiles_yellow: config.missiles_yellow || 0,
    missiles_orange: config.missiles_orange || 0,
    missiles_blue: config.missiles_blue || 0,
    missiles_red: config.missiles_red || 0,
    shields: config.shields || 0,
    computers: config.computers || 0,
    // Defender gets +0.1 initiative bonus for tie-breaking
    initiative: (config.initiative || 0) + (isDefender ? 0.1 : 0),
    splitter: config.splitter || false,
    missile_shield: config.missile_shield || false,
    hp: (config.hull || 0) + 1,
    side: isDefender ? "D" : "A",
  };
}

function isAlive(combatant: Combatant): boolean {
  return combatant.hp > 0;
}

function applyDamage(ship: Combatant, damageAmount: number): void {
  ship.hp -= damageAmount;
  if (ship.hp < 0) {
    ship.hp = 0;
  }
}

function canBeKilled(target: Combatant, incomingDice: Dice[]): boolean {
  const hittingDice = incomingDice.filter((dice) => checkHit(dice, target));
  const totalDamage = hittingDice.reduce(
    (total, dice) => total + dice.damageValue,
    0,
  );
  return totalDamage >= target.hp;
}

// ============================================================================
// Ship Group Functions
// ============================================================================

function createShipGroup(
  shipConfig: ShipConfig,
  isDefender: boolean,
): ShipGroup {
  const ships: Combatant[] = [];
  const shipCount = shipConfig.number || 1;

  for (let i = 0; i < shipCount; i++) {
    ships.push(createCombatant(shipConfig, isDefender));
  }

  return { ships };
}

function getLivingShips(shipGroup: ShipGroup): Combatant[] {
  return shipGroup.ships.filter(isAlive);
}

function hasLivingShips(shipGroup: ShipGroup): boolean {
  return getLivingShips(shipGroup).length > 0;
}

function getFirstShip(shipGroup: ShipGroup): Combatant | undefined {
  return shipGroup.ships.length > 0 ? shipGroup.ships[0] : undefined;
}

// ============================================================================
// Initiative Order Functions
// ============================================================================

function createInitiativeOrder(
  defenderFleet: Fleet,
  attackerFleet: Fleet,
): InitiativeOrder {
  const combatants: ShipGroup[] = [];

  // Add defender ships
  for (const shipConfig of defenderFleet.ships) {
    combatants.push(createShipGroup(shipConfig, true));
  }

  // Add attacker ships
  for (const shipConfig of attackerFleet.ships) {
    combatants.push(createShipGroup(shipConfig, false));
  }

  // Sort by initiative (highest first)
  combatants.sort((a, b) => {
    const aInit = getFirstShip(a)?.initiative || 0;
    const bInit = getFirstShip(b)?.initiative || 0;
    return bInit - aInit;
  });

  return { combatants };
}

function getAllCombatants(initiativeOrder: InitiativeOrder): Combatant[] {
  const allShips: Combatant[] = [];
  for (const shipGroup of initiativeOrder.combatants) {
    allShips.push(...shipGroup.ships);
  }
  return allShips;
}

function getLivingCombatantsBySide(
  initiativeOrder: InitiativeOrder,
  side?: "A" | "D",
): Combatant[] {
  return getAllCombatants(initiativeOrder).filter(
    (ship) => isAlive(ship) && (side === undefined || ship.side === side),
  );
}

function getBattleStatus(initiativeOrder: InitiativeOrder): BattleStatus {
  const attackerAlive =
    getLivingCombatantsBySide(initiativeOrder, "A").length > 0;
  const defenderAlive =
    getLivingCombatantsBySide(initiativeOrder, "D").length > 0;
  const allLiving = getLivingCombatantsBySide(initiativeOrder);

  // Check if any living ship has weapons
  const hasWeapons = allLiving.some(
    (ship) =>
      ship.yellow > 0 || ship.orange > 0 || ship.blue > 0 || ship.red > 0,
  );

  const battleOver = !attackerAlive || !defenderAlive || !hasWeapons;
  const winner = battleOver ? (defenderAlive ? "D" : "A") : undefined;

  const shipSurvival: Record<string, number> = {};

  if (battleOver && winner) {
    // Count living ships by name for the winner
    const livingShips: Record<string, number> = {};
    const totalShips: Record<string, number> = {};

    for (const ship of getAllCombatants(initiativeOrder)) {
      if (ship.side === winner) {
        totalShips[ship.name] = (totalShips[ship.name] || 0) + 1;
        if (isAlive(ship)) {
          livingShips[ship.name] = (livingShips[ship.name] || 0) + 1;
        }
      }
    }

    for (const shipName of Object.keys(livingShips)) {
      const total = totalShips[shipName] || 1;
      shipSurvival[shipName] = livingShips[shipName] / total;
    }
  }

  return {
    attackerAlive,
    defenderAlive,
    totalAlive: allLiving.length,
    shipSurvival,
    battleOver,
    winner,
  };
}

// ============================================================================
// Combat Functions
// ============================================================================

function distributeHits(
  dicePool: DicePool,
  targets: Combatant[],
  isNpcAttacker: boolean = false,
): void {
  // Sort dice by value (highest first), then by damage (lowest first for tie-breaking)
  const sortedDice = [...dicePool.dice].sort(
    (a, b) => 100 * b.value - b.damageValue - (100 * a.value - a.damageValue),
  );

  // Use NPC priority (largest first) or player priority based on attacker type
  const priority = isNpcAttacker ? NPC_TARGET_PRIORITY : TARGET_PRIORITY;

  // Sort targets by priority (leftmost in priority list = highest priority)
  const prioritizedTargets = [...targets].sort((a, b) => {
    const aIndex = priority.indexOf(a.shipClass);
    const bIndex = priority.indexOf(b.shipClass);
    // If not in priority list, put at end
    return (
      (aIndex === -1 ? priority.length : aIndex) -
      (bIndex === -1 ? priority.length : bIndex)
    );
  });

  const hasHittingDice = (): boolean => {
    return sortedDice.some((dice) =>
      targets.some((target) => isAlive(target) && checkHit(dice, target)),
    );
  };

  while (hasHittingDice() && sortedDice.length > 0) {
    const currentDice = sortedDice.shift()!;

    // Find primary target (highest priority living target that this die can hit)
    let primaryTarget = prioritizedTargets.find(
      (target) => isAlive(target) && checkHit(currentDice, target),
    );

    // Check if we can kill any target with remaining dice + this one
    const killableTarget = prioritizedTargets.find(
      (target) =>
        isAlive(target) &&
        canBeKilled(target, [currentDice, ...sortedDice]) &&
        checkHit(currentDice, target),
    );

    // Prefer killable target over primary target
    if (killableTarget) {
      primaryTarget = killableTarget;
    }

    if (primaryTarget) {
      applyDamage(primaryTarget, currentDice.damageValue);
    }
  }
}

function combatRound(
  initiativeOrder: InitiativeOrder,
  missileOnly: boolean,
): void {
  const allShips = getAllCombatants(initiativeOrder);

  for (const shipGroup of initiativeOrder.combatants) {
    if (hasLivingShips(shipGroup)) {
      const firstShip = getFirstShip(shipGroup);
      const attackerSide = firstShip?.side;
      const livingShips = getLivingShips(shipGroup);
      const dicePool = createDicePool(livingShips, missileOnly);

      // Check if attacker is an NPC (Ancient, Guardian, GCDS)
      const isNpcAttacker = firstShip
        ? NPC_SHIP_CLASSES.has(firstShip.shipClass)
        : false;

      // Find enemy ships
      const enemyShips = allShips.filter(
        (ship) => ship.side !== attackerSide && isAlive(ship),
      );

      distributeHits(dicePool, enemyShips, isNpcAttacker);
    }
  }
}

function resolveBattle(
  defenseFleet: Fleet,
  attackFleet: Fleet,
): SingleBattleResult {
  const fireOrder = createInitiativeOrder(defenseFleet, attackFleet);

  // Missile phase (first round only)
  combatRound(fireOrder, true);

  // Combat rounds until battle is over
  let battleStatus = getBattleStatus(fireOrder);
  while (!battleStatus.battleOver) {
    combatRound(fireOrder, false);
    battleStatus = getBattleStatus(fireOrder);
  }

  return {
    winner: battleStatus.winner || "D",
    shipSurvival: battleStatus.shipSurvival,
  };
}

// ============================================================================
// Monte Carlo Simulation
// ============================================================================

function aggregateSurvivalStats(
  battleResults: SingleBattleResult[],
): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const result of battleResults) {
    for (const [shipName, survivalRate] of Object.entries(
      result.shipSurvival,
    )) {
      totals[shipName] = (totals[shipName] || 0) + survivalRate;
    }
  }

  const averages: Record<string, number> = {};
  for (const [shipName, total] of Object.entries(totals)) {
    averages[shipName] = total / battleResults.length;
  }

  return averages;
}

/**
 * Run Monte Carlo combat simulation
 * @param defenseFleet - The defending fleet configuration
 * @param attackFleet - The attacking fleet configuration
 * @param iterations - Number of simulation iterations (default: 1000)
 * @returns Battle results with win probabilities and survival rates
 */
export function calculate(
  defenseFleet: Fleet,
  attackFleet: Fleet,
  iterations: number = 1000,
): BattleResults {
  const results: SingleBattleResult[] = [];

  for (let i = 0; i < iterations; i++) {
    const battle = resolveBattle(defenseFleet, attackFleet);
    results.push(battle);
  }

  const defenderWins = results.filter((result) => result.winner === "D");
  const attackerWins = results.filter((result) => result.winner === "A");

  return {
    attacker: attackerWins.length / results.length,
    defender: defenderWins.length / results.length,
    shipsAttacker: aggregateSurvivalStats(attackerWins),
    shipsDefender: aggregateSurvivalStats(defenderWins),
  };
}

/**
 * Generate a unique ID for a ship
 */
export function generateShipId(): string {
  return `ship-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Create a default ship configuration with all values set to zero/defaults
 */
export function createDefaultShipConfig(
  overrides: Partial<ShipConfig> = {},
): ShipConfig {
  return {
    id: overrides.id || generateShipId(),
    name: overrides.name || "Ship",
    shipClass: overrides.shipClass || "Cruiser",
    number: 1,
    hull: 0,
    yellow: 0,
    orange: 0,
    blue: 0,
    red: 0,
    missiles_yellow: 0,
    missiles_orange: 0,
    missiles_blue: 0,
    missiles_red: 0,
    computers: 0,
    shields: 0,
    initiative: 0,
    splitter: false,
    missile_shield: false,
    ...overrides,
  };
}
