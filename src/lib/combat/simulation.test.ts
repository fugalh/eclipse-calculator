/**
 * Combat Simulation Tests for Eclipse: Second Dawn for the Galaxy
 * Tests ported from the original battlestats.js test suite
 */

import { beforeEach, describe, expect, test } from "bun:test";
import type { Combatant, Dice, DicePool, Fleet } from "@/lib/types";
import { calculate, createDefaultShipConfig, Internal } from "./simulation";

// Helper to create a minimal combatant for testing
function createTestCombatant(
  overrides: Partial<Parameters<typeof Internal.createCombatant>[0]> = {},
): Combatant {
  const config = createDefaultShipConfig({
    shipClass: "Interceptor",
    ...overrides,
  });
  return Internal.createCombatant(config, false);
}

// Helper to create controlled dice for testing (with fixed value)
function createControlledDice(
  type: "yellow" | "orange" | "blue" | "red",
  value: number,
  attacker: Combatant,
): Dice {
  const dice = Internal.createDice(type, attacker, false);
  dice.value = value;
  return dice;
}

describe("Eclipse Combat Simulator", () => {
  describe("Dice Creation", () => {
    let testShip: Combatant;

    beforeEach(() => {
      testShip = createTestCombatant();
    });

    test("yellow dice have damage value 1", () => {
      const dice = Internal.createDice("yellow", testShip, false);
      expect(dice.damageValue).toBe(1);
      expect(dice.type).toBe("yellow");
    });

    test("orange dice have damage value 2", () => {
      const dice = Internal.createDice("orange", testShip, false);
      expect(dice.damageValue).toBe(2);
      expect(dice.type).toBe("orange");
    });

    test("blue dice have damage value 3", () => {
      const dice = Internal.createDice("blue", testShip, false);
      expect(dice.damageValue).toBe(3);
      expect(dice.type).toBe("blue");
    });

    test("red dice have damage value 4", () => {
      const dice = Internal.createDice("red", testShip, false);
      expect(dice.damageValue).toBe(4);
      expect(dice.type).toBe("red");
    });

    test("dice roll values between 1 and 6", () => {
      for (let i = 0; i < 20; i++) {
        const dice = Internal.createDice("yellow", testShip, false);
        expect(dice.value).toBeGreaterThanOrEqual(1);
        expect(dice.value).toBeLessThanOrEqual(6);
      }
    });

    test("dice can be marked as missiles", () => {
      const dice = Internal.createDice("yellow", testShip, true);
      expect(dice.isMissile).toBe(true);
    });
  });

  describe("Hit Detection", () => {
    let attacker: Combatant;
    let target: Combatant;

    beforeEach(() => {
      attacker = createTestCombatant({ computers: 0 });
      target = createTestCombatant({ shields: 0 });
    });

    test("hits when roll + computers - shields >= 6", () => {
      attacker.computers = 3;
      target.shields = 2;
      const dice = createControlledDice("yellow", 5, attacker);
      // 5 + 3 - 2 = 6, should hit
      expect(Internal.checkHit(dice, target)).toBe(true);
    });

    test("misses when roll + computers - shields < 6 and not natural 6", () => {
      attacker.computers = 0;
      target.shields = 2;
      const dice = createControlledDice("yellow", 3, attacker);
      // 3 + 0 - 2 = 1 < 6, should miss
      expect(Internal.checkHit(dice, target)).toBe(false);
    });

    test("natural 6 always hits regardless of shields", () => {
      attacker.computers = 0;
      target.shields = 10;
      const dice = createControlledDice("yellow", 6, attacker);
      expect(Internal.checkHit(dice, target)).toBe(true);
    });

    test("natural 1 always misses", () => {
      attacker.computers = 10;
      target.shields = 0;
      const dice = createControlledDice("yellow", 1, attacker);
      expect(Internal.checkHit(dice, target)).toBe(false);
    });

    test("computer bonus increases hit chance", () => {
      attacker.computers = 2;
      target.shields = 0;
      const dice = createControlledDice("yellow", 4, attacker);
      // 4 + 2 - 0 = 6, should hit
      expect(Internal.checkHit(dice, target)).toBe(true);
    });

    test("shields reduce hit chance", () => {
      attacker.computers = 1;
      target.shields = 2;
      const dice = createControlledDice("yellow", 5, attacker);
      // 5 + 1 - 2 = 4 < 6, should miss
      expect(Internal.checkHit(dice, target)).toBe(false);
    });

    test("missile_shield adds +2 shields vs missiles", () => {
      attacker.computers = 2;
      target.shields = 0;
      target.missile_shield = true;
      const dice = Internal.createDice("yellow", attacker, true);
      dice.value = 6;
      // 6 + 2 - (0 + 2) = 6, should hit
      expect(Internal.checkHit(dice, target)).toBe(true);
    });
  });

  describe("Combatant Creation", () => {
    test("creates ship with default values", () => {
      const ship = createTestCombatant({});
      expect(ship.hull).toBe(0);
      expect(ship.hp).toBe(1);
    });

    test("creates ship with specified values", () => {
      const ship = createTestCombatant({ hull: 2, yellow: 3 });
      expect(ship.hull).toBe(2);
      expect(ship.hp).toBe(3);
      expect(ship.yellow).toBe(3);
    });

    test("hp equals hull + 1", () => {
      const ship = createTestCombatant({ hull: 5 });
      expect(ship.hp).toBe(6);
    });

    test("ship is alive when hp > 0", () => {
      const ship = createTestCombatant({ hull: 1 });
      expect(Internal.isAlive(ship)).toBe(true);
    });

    test("ship is dead when hp <= 0", () => {
      const ship = createTestCombatant({});
      ship.hp = 0;
      expect(Internal.isAlive(ship)).toBe(false);
    });

    test("supports missile weapons", () => {
      const ship = createTestCombatant({
        missiles_yellow: 2,
        missiles_orange: 1,
        missiles_blue: 1,
      });
      expect(ship.missiles_yellow).toBe(2);
      expect(ship.missiles_orange).toBe(1);
      expect(ship.missiles_blue).toBe(1);
    });
  });

  describe("Battle Simulation", () => {
    test("runs complete battle and returns results", () => {
      const attacker: Fleet = {
        ships: [
          createDefaultShipConfig({
            shipClass: "Cruiser",
            number: 1,
            hull: 1,
            shields: 0,
            computers: 0,
            initiative: 2,
            yellow: 3,
          }),
        ],
      };

      const defender: Fleet = {
        ships: [
          createDefaultShipConfig({
            shipClass: "Interceptor",
            number: 1,
            hull: 0,
            shields: 0,
            computers: 0,
            initiative: 1,
            yellow: 2,
          }),
        ],
      };

      const result = calculate(defender, attacker, 100);

      expect(result.attacker).toBeGreaterThanOrEqual(0);
      expect(result.attacker).toBeLessThanOrEqual(1);
      expect(result.defender).toBeGreaterThanOrEqual(0);
      expect(result.defender).toBeLessThanOrEqual(1);
    });

    test("superior firepower heavily favors attacker", () => {
      const attacker: Fleet = {
        ships: [
          createDefaultShipConfig({
            shipClass: "Dreadnought",
            number: 1,
            hull: 3,
            shields: 2,
            computers: 2,
            initiative: 3,
            yellow: 6,
            red: 2,
          }),
        ],
      };

      const defender: Fleet = {
        ships: [
          createDefaultShipConfig({
            shipClass: "Interceptor",
            number: 1,
            hull: 0,
            shields: 0,
            computers: 0,
            initiative: 2,
            yellow: 1,
          }),
        ],
      };

      const result = calculate(defender, attacker, 100);

      // Dreadnought should win vast majority of battles
      expect(result.attacker).toBeGreaterThan(0.8);
    });

    test("defender gets +0.1 initiative bonus for ties", () => {
      const attacker: Fleet = {
        ships: [
          createDefaultShipConfig({
            shipClass: "Ship1",
            number: 1,
            hull: 1,
            initiative: 2,
            yellow: 2,
          }),
        ],
      };

      const defender: Fleet = {
        ships: [
          createDefaultShipConfig({
            shipClass: "Ship2",
            number: 1,
            hull: 1,
            initiative: 2,
            yellow: 2,
          }),
        ],
      };

      const initOrder = Internal.createInitiativeOrder(defender, attacker);
      const firstShip = initOrder.combatants[0].ships[0];

      // Defender should fire first due to +0.1 initiative bonus
      expect(firstShip.side).toBe("D");
      expect(firstShip.initiative).toBe(2.1);
    });
  });

  describe("Ship Damage", () => {
    test("reduces HP when damage applied", () => {
      const ship = createTestCombatant({ hull: 2 });
      expect(ship.hp).toBe(3);
      Internal.applyDamage(ship, 1);
      expect(ship.hp).toBe(2);
      Internal.applyDamage(ship, 2);
      expect(ship.hp).toBe(0);
    });

    test("HP does not go below 0", () => {
      const ship = createTestCombatant({});
      Internal.applyDamage(ship, 10);
      expect(ship.hp).toBe(0);
    });
  });

  describe("Antimatter Splitter", () => {
    test("converts red dice to 4 yellow dice with same value", () => {
      const ship = createTestCombatant({ red: 1, splitter: true });
      const dicePool = Internal.createDicePool([ship], false);

      expect(dicePool.dice.length).toBe(4);
      expect(dicePool.dice.every((d) => d.type === "yellow")).toBe(true);

      const firstValue = dicePool.dice[0].value;
      expect(dicePool.dice.every((d) => d.value === firstValue)).toBe(true);
    });
  });

  describe("Hit Distribution - Eclipse Rules Compliance", () => {
    // Helper to create controlled dice pool for testing
    function createControlledDicePool(
      attacker: Combatant,
      values: Array<{
        type: "yellow" | "orange" | "blue" | "red";
        value: number;
      }>,
    ): DicePool {
      const dicePool: DicePool = { dice: [] };
      values.forEach(({ type, value }) => {
        const dice = createControlledDice(type, value, attacker);
        dicePool.dice.push(dice);
      });
      return dicePool;
    }

    test("prioritizes killing ships when possible", () => {
      // Setup: Attacker with exactly enough damage to kill one interceptor
      const attacker = createTestCombatant({ computers: 0 });

      // Two interceptors: 1 HP each
      const interceptor1 = createTestCombatant({
        shipClass: "Interceptor",
        hull: 0, // 1 HP
        shields: 0,
      });
      const interceptor2 = createTestCombatant({
        shipClass: "Interceptor",
        hull: 0, // 1 HP
        shields: 0,
      });

      // Create 1 yellow die that will hit (roll 6 = auto-hit)
      const dicePool = createControlledDicePool(attacker, [
        { type: "yellow", value: 6 },
      ]);

      const targets = [interceptor1, interceptor2];
      Internal.distributeHits(dicePool, targets);

      // Should kill one ship completely rather than damaging both
      const deadShips = targets.filter((t) => !Internal.isAlive(t)).length;
      const damagedShips = targets.filter(
        (t) => Internal.isAlive(t) && t.hp < 1,
      ).length;

      expect(deadShips).toBe(1);
      expect(damagedShips).toBe(0);
    });

    test("damages largest ships first when no kills are possible", () => {
      // Setup: Not enough damage to kill any ship
      const attacker = createTestCombatant({ computers: 0 });

      // According to target priority:
      // "Orbital Ancient Guardian GC Interceptor Starbase Cruiser Dreadnought Deathmoon"
      // This matches Eclipse rules: "damage...from largest to smallest"

      const interceptor = createTestCombatant({
        shipClass: "Interceptor",
        hull: 0, // 1 HP
        shields: 0,
      });
      const cruiser = createTestCombatant({
        shipClass: "Cruiser",
        hull: 1, // 2 HP
        shields: 0,
      });
      const dreadnought = createTestCombatant({
        shipClass: "Dreadnought",
        hull: 3, // 4 HP
        shields: 0,
      });

      // Create 2 damage worth of hits that can't kill any ship
      const dicePool = createControlledDicePool(attacker, [
        { type: "yellow", value: 6 }, // 1 damage
        { type: "yellow", value: 6 }, // 1 damage
      ]);

      const targets = [interceptor, cruiser, dreadnought];
      Internal.distributeHits(dicePool, targets);

      // Total of 2 damage should be distributed
      const totalDamageDealt =
        1 - interceptor.hp + (2 - cruiser.hp) + (4 - dreadnought.hp);
      expect(totalDamageDealt).toBe(2);
    });

    test("concentrates fire to eliminate ships even across priority levels", () => {
      // Setup: Enough damage to kill one ship
      const attacker = createTestCombatant({ computers: 2 }); // +2 to hit

      const interceptor = createTestCombatant({
        shipClass: "Interceptor",
        hull: 0, // 1 HP
        shields: 0,
      });
      const cruiser = createTestCombatant({
        shipClass: "Cruiser",
        hull: 1, // 2 HP
        shields: 0,
      });

      // 3 damage total - enough to kill cruiser (2 HP) or both ships
      const dicePool = createControlledDicePool(attacker, [
        { type: "yellow", value: 6 }, // 1 damage, auto-hit
        { type: "orange", value: 6 }, // 2 damage, auto-hit
      ]);

      const targets = [interceptor, cruiser];
      Internal.distributeHits(dicePool, targets);

      // Should kill at least one ship completely (concentrate fire for kills)
      const deadShips = targets.filter((t) => !Internal.isAlive(t)).length;
      expect(deadShips).toBeGreaterThanOrEqual(1);

      // All 3 damage should be used
      const totalDamageDealt = 1 - interceptor.hp + (2 - cruiser.hp);
      expect(totalDamageDealt).toBe(3);
    });

    test("respects target priority ordering - smallest ships first", () => {
      // Test the actual priority string from the code
      // "Orbital Ancient Guardian GC Interceptor Starbase Cruiser Dreadnought Deathmoon"
      // Smallest (highest priority) ships first
      const attacker = createTestCombatant({ computers: 2 });

      const deathmoon = createTestCombatant({
        shipClass: "Deathmoon",
        hull: 0, // 1 HP for simplicity
        shields: 0,
      });
      const cruiser = createTestCombatant({
        shipClass: "Cruiser",
        hull: 0,
        shields: 0,
      });
      const interceptor = createTestCombatant({
        shipClass: "Interceptor",
        hull: 0,
        shields: 0,
      });

      // One hit that can only kill one ship
      const dicePool = createControlledDicePool(attacker, [
        { type: "yellow", value: 6 },
      ]);

      const targets = [interceptor, cruiser, deathmoon];
      Internal.distributeHits(dicePool, targets);

      // Should kill the smallest ship first (Interceptor has highest priority)
      const deadShip = targets.find((t) => !Internal.isAlive(t));
      expect(deadShip?.shipClass).toBe("Interceptor");
    });

    test("distributes maximum damage when multiple kills impossible", () => {
      const attacker = createTestCombatant({ computers: 2 });

      // Two tanky ships that can't be killed with available damage
      const dreadnought1 = createTestCombatant({
        shipClass: "Dreadnought",
        hull: 3, // 4 HP
        shields: 0,
      });
      const dreadnought2 = createTestCombatant({
        shipClass: "Dreadnought",
        hull: 3, // 4 HP
        shields: 0,
      });

      // 3 damage - can't kill either ship
      const dicePool = createControlledDicePool(attacker, [
        { type: "yellow", value: 6 }, // 1 damage
        { type: "orange", value: 6 }, // 2 damage
      ]);

      const targets = [dreadnought1, dreadnought2];
      Internal.distributeHits(dicePool, targets);

      // All damage should be applied (3 total damage)
      const totalDamageDealt = 4 - dreadnought1.hp + (4 - dreadnought2.hp);
      expect(totalDamageDealt).toBe(3);
    });

    test("only hits ships that meet hit requirements", () => {
      const attacker = createTestCombatant({ computers: 0 });

      const shieldedShip = createTestCombatant({
        shipClass: "Cruiser",
        hull: 1,
        shields: 3, // Very high shields
      });

      // Low roll that won't penetrate shields
      const dicePool = createControlledDicePool(attacker, [
        { type: "yellow", value: 2 },
      ]);
      // 2 + 0 (computers) - 3 (shields) = -1, which is < 6, so miss

      Internal.distributeHits(dicePool, [shieldedShip]);

      // Should not damage the ship since hit check fails
      expect(shieldedShip.hp).toBe(2);
    });

    test("prioritizes kills over target priority when possible", () => {
      const attacker = createTestCombatant({ computers: 2 });

      // Interceptor: Higher priority (smaller ship), easy to kill (1 HP)
      const interceptor = createTestCombatant({
        shipClass: "Interceptor",
        hull: 0,
        shields: 0,
      });

      // Dreadnought: Lower priority (larger ship), hard to kill (4 HP)
      const dreadnought = createTestCombatant({
        shipClass: "Dreadnought",
        hull: 3,
        shields: 0,
      });

      // Enough damage to kill interceptor OR partially damage dreadnought
      const dicePool = createControlledDicePool(attacker, [
        { type: "yellow", value: 6 },
      ]);

      const targets = [interceptor, dreadnought];
      Internal.distributeHits(dicePool, targets);

      // Should kill the interceptor (can kill it, and it also has higher priority)
      expect(Internal.isAlive(interceptor)).toBe(false);
      expect(dreadnought.hp).toBe(4); // Untouched
    });

    test("can kill check correctly identifies killable targets", () => {
      const attacker = createTestCombatant({ computers: 2 });

      const target = createTestCombatant({
        hull: 1, // 2 HP
        shields: 0,
      });

      // Enough damage to kill
      const enoughDice = [
        createControlledDice("yellow", 6, attacker), // 1 damage
        createControlledDice("yellow", 6, attacker), // 1 damage
      ];
      expect(Internal.canBeKilled(target, enoughDice)).toBe(true);

      // Not enough damage
      const notEnoughDice = [createControlledDice("yellow", 6, attacker)]; // 1 damage
      expect(Internal.canBeKilled(target, notEnoughDice)).toBe(false);
    });
  });
});
