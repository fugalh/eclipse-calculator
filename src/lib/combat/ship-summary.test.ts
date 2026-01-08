/**
 * Ship Blueprint Summary Tests for Eclipse: Second Dawn for the Galaxy
 * Tests the compact summary string generation for collapsed ship views
 */

import { describe, expect, test } from "bun:test";
import { createDefaultShipConfig } from "./simulation";
import { generateShipSummary } from "./ship-summary";

describe("Ship Blueprint Summary", () => {
  describe("Acceptance Examples", () => {
    // From spec: thoughts/ship-summary.md
    test("antimatter missiles + computer + hull", () => {
      const ship = createDefaultShipConfig({
        initiative: 2,
        missiles_red: 3,
        computers: 1,
        hull: 2,
      });
      expect(generateShipSummary(ship)).toBe("^^ 3øøøø +1 ⍟⍟");
    });

    test("mixed cannons + full defense", () => {
      const ship = createDefaultShipConfig({
        initiative: 3,
        blue: 1,
        orange: 1,
        computers: 1,
        shields: 2,
        hull: 4,
      });
      expect(generateShipSummary(ship)).toBe("^^^ ooo oo +1 -2 ⍟⍟⍟⍟");
    });

    // Additional examples
    test("basic interceptor - ion cannon only", () => {
      const ship = createDefaultShipConfig({
        initiative: 3,
        yellow: 1,
      });
      expect(generateShipSummary(ship)).toBe("^^^ o");
    });

    test("defensive cruiser - shields and hull", () => {
      const ship = createDefaultShipConfig({
        initiative: 2,
        yellow: 1,
        computers: 1,
        shields: 2,
        hull: 2,
      });
      expect(generateShipSummary(ship)).toBe("^^ o +1 -2 ⍟⍟");
    });

    test("missile boat - mixed missiles", () => {
      const ship = createDefaultShipConfig({
        initiative: 1,
        missiles_orange: 2,
        missiles_blue: 1,
        hull: 1,
      });
      expect(generateShipSummary(ship)).toBe("^ øøø 2øø ⍟");
    });

    test("dreadnought loadout - heavy weapons", () => {
      const ship = createDefaultShipConfig({
        initiative: 2,
        red: 2,
        blue: 1,
        computers: 2,
        shields: 1,
        hull: 3,
      });
      expect(generateShipSummary(ship)).toBe("^^ 2oooo ooo +2 -1 ⍟⍟⍟");
    });

    test("ancient ship - high initiative glass cannon", () => {
      const ship = createDefaultShipConfig({
        initiative: 4,
        yellow: 2,
        computers: 1,
      });
      expect(generateShipSummary(ship)).toBe("^^^^ 2o +1");
    });

    test("empty ship returns empty string", () => {
      const ship = createDefaultShipConfig({});
      expect(generateShipSummary(ship)).toBe("");
    });
  });

  describe("Individual Components", () => {
    test("initiative shows as repeated ^", () => {
      const ship = createDefaultShipConfig({ initiative: 5 });
      expect(generateShipSummary(ship)).toBe("^^^^^");
    });

    test("computers show as +N", () => {
      const ship = createDefaultShipConfig({ computers: 3 });
      expect(generateShipSummary(ship)).toBe("+3");
    });

    test("shields show as -N", () => {
      const ship = createDefaultShipConfig({ shields: 2 });
      expect(generateShipSummary(ship)).toBe("-2");
    });

    test("hull shows as repeated ⍟", () => {
      const ship = createDefaultShipConfig({ hull: 4 });
      expect(generateShipSummary(ship)).toBe("⍟⍟⍟⍟");
    });

    test("single hull shows as ⍟", () => {
      const ship = createDefaultShipConfig({ hull: 1 });
      expect(generateShipSummary(ship)).toBe("⍟");
    });
  });

  describe("Cannon Symbols by Damage", () => {
    test("yellow cannon = o (1 symbol)", () => {
      const ship = createDefaultShipConfig({ yellow: 1 });
      expect(generateShipSummary(ship)).toBe("o");
    });

    test("orange cannon = oo (2 symbols)", () => {
      const ship = createDefaultShipConfig({ orange: 1 });
      expect(generateShipSummary(ship)).toBe("oo");
    });

    test("blue cannon = ooo (3 symbols)", () => {
      const ship = createDefaultShipConfig({ blue: 1 });
      expect(generateShipSummary(ship)).toBe("ooo");
    });

    test("red cannon = oooo (4 symbols)", () => {
      const ship = createDefaultShipConfig({ red: 1 });
      expect(generateShipSummary(ship)).toBe("oooo");
    });

    test("multiple cannons show count prefix", () => {
      const ship = createDefaultShipConfig({ red: 3 });
      expect(generateShipSummary(ship)).toBe("3oooo");
    });
  });

  describe("Missile Symbols by Damage", () => {
    test("yellow missile = ø (1 symbol)", () => {
      const ship = createDefaultShipConfig({ missiles_yellow: 1 });
      expect(generateShipSummary(ship)).toBe("ø");
    });

    test("orange missile = øø (2 symbols)", () => {
      const ship = createDefaultShipConfig({ missiles_orange: 1 });
      expect(generateShipSummary(ship)).toBe("øø");
    });

    test("blue missile = øøø (3 symbols)", () => {
      const ship = createDefaultShipConfig({ missiles_blue: 1 });
      expect(generateShipSummary(ship)).toBe("øøø");
    });

    test("red missile = øøøø (4 symbols)", () => {
      const ship = createDefaultShipConfig({ missiles_red: 1 });
      expect(generateShipSummary(ship)).toBe("øøøø");
    });

    test("multiple missiles show count prefix", () => {
      const ship = createDefaultShipConfig({ missiles_blue: 2 });
      expect(generateShipSummary(ship)).toBe("2øøø");
    });
  });

  describe("Ordering", () => {
    test("cannons ordered by damage descending: red > blue > orange > yellow", () => {
      const ship = createDefaultShipConfig({
        yellow: 1,
        orange: 1,
        blue: 1,
        red: 1,
      });
      expect(generateShipSummary(ship)).toBe("oooo ooo oo o");
    });

    test("missiles ordered by damage descending: red > blue > orange > yellow", () => {
      const ship = createDefaultShipConfig({
        missiles_yellow: 1,
        missiles_orange: 1,
        missiles_blue: 1,
        missiles_red: 1,
      });
      expect(generateShipSummary(ship)).toBe("øøøø øøø øø ø");
    });

    test("full ordering: initiative > missiles > cannons > computer > shields > hull", () => {
      const ship = createDefaultShipConfig({
        initiative: 1,
        missiles_yellow: 1,
        yellow: 1,
        computers: 1,
        shields: 1,
        hull: 1,
      });
      expect(generateShipSummary(ship)).toBe("^ ø o +1 -1 ⍟");
    });
  });

  describe("Zero Value Omission", () => {
    test("zero initiative is omitted", () => {
      const ship = createDefaultShipConfig({ initiative: 0, hull: 1 });
      expect(generateShipSummary(ship)).toBe("⍟");
    });

    test("zero computers are omitted", () => {
      const ship = createDefaultShipConfig({ computers: 0, hull: 1 });
      expect(generateShipSummary(ship)).toBe("⍟");
    });

    test("zero shields are omitted", () => {
      const ship = createDefaultShipConfig({ shields: 0, hull: 1 });
      expect(generateShipSummary(ship)).toBe("⍟");
    });

    test("zero hull is omitted", () => {
      const ship = createDefaultShipConfig({ hull: 0, initiative: 1 });
      expect(generateShipSummary(ship)).toBe("^");
    });
  });

  describe("Edge Cases", () => {
    test("maximum values", () => {
      const ship = createDefaultShipConfig({
        initiative: 8,
        missiles_red: 6,
        red: 6,
        computers: 8,
        shields: 8,
        hull: 8,
      });
      expect(generateShipSummary(ship)).toBe(
        "^^^^^^^^ 6øøøø 6oooo +8 -8 ⍟⍟⍟⍟⍟⍟⍟⍟",
      );
    });

    test("mixed missiles and cannons of same color", () => {
      const ship = createDefaultShipConfig({
        missiles_yellow: 2,
        yellow: 3,
      });
      expect(generateShipSummary(ship)).toBe("2ø 3o");
    });
  });
});
