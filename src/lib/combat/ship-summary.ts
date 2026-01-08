/**
 * Ship Blueprint Summary Utility
 * Generates a compact text representation of a ship's configuration
 * for display in collapsed ship cards.
 */

import type { DiceColor, ShipConfig } from "@/lib/types";

/** Damage values by dice color */
const DAMAGE_BY_COLOR: Record<DiceColor, number> = {
  yellow: 1,
  orange: 2,
  blue: 3,
  red: 4,
};

/** Colors ordered by damage descending (red first) */
const COLORS_DESC: DiceColor[] = ["red", "blue", "orange", "yellow"];

/**
 * Format a weapon count with the appropriate symbol
 * Symbol is repeated by damage value (yellow=1, red=4)
 * Count prefix omitted if count is 1
 */
function formatWeapon(count: number, color: DiceColor, symbol: string): string {
  if (count === 0) return "";
  const damageSymbol = symbol.repeat(DAMAGE_BY_COLOR[color]);
  return count === 1 ? damageSymbol : `${count}${damageSymbol}`;
}

/**
 * Generate a compact summary string for a ship configuration
 *
 * Order: Initiative > Missiles > Cannons > Computer > Shields > Hull
 * Weapons ordered by damage descending (red > blue > orange > yellow)
 *
 * @example
 * generateShipSummary({ initiative: 2, missiles_red: 3, computers: 1, hull: 2, ... })
 * // Returns "^^ 3øøøø +1 **"
 */
export function generateShipSummary(ship: ShipConfig): string {
  const parts: string[] = [];

  // 1. Initiative (repeated ^)
  if (ship.initiative > 0) {
    parts.push("^".repeat(ship.initiative));
  }

  // 2. Missiles (ø) - descending damage order
  for (const color of COLORS_DESC) {
    const key = `missiles_${color}` as keyof ShipConfig;
    const count = ship[key] as number;
    const formatted = formatWeapon(count, color, "ø");
    if (formatted) parts.push(formatted);
  }

  // 3. Cannons (o) - descending damage order
  for (const color of COLORS_DESC) {
    const count = ship[color] as number;
    const formatted = formatWeapon(count, color, "o");
    if (formatted) parts.push(formatted);
  }

  // 4. Computer (+N)
  if (ship.computers > 0) {
    parts.push(`+${ship.computers}`);
  }

  // 5. Shields (-N)
  if (ship.shields > 0) {
    parts.push(`-${ship.shields}`);
  }

  // 6. Hull (repeated *)
  if (ship.hull > 0) {
    parts.push("*".repeat(ship.hull));
  }

  return parts.join(" ");
}
