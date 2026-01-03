// ============================================================================
// Game Icon Path Constants
// ============================================================================

/**
 * Centralized icon paths for Eclipse game assets.
 * All paths are relative to the public directory.
 */
export const GAME_ICONS = {
  dice: {
    yellow: "/icons/game/dice/yellow.png",
    orange: "/icons/game/dice/orange.png",
    blue: "/icons/game/dice/blue.png",
    red: "/icons/game/dice/red.png",
  },
  missiles: {
    yellow: "/icons/game/missiles/yellow.png",
    orange: "/icons/game/missiles/orange.png",
    blue: "/icons/game/missiles/blue.png",
    red: "/icons/game/missiles/red.png",
  },
  stats: {
    hull: "/icons/game/stats/hull.png",
    initiative: "/icons/game/stats/initiative.png",
    number: "/icons/game/stats/number.png",
    // These icons don't exist in original assets - use null for text fallback
    computers: null,
    shields: null,
  },
  ships: {
    Cruiser: "/icons/game/ships/cruiser.png",
    Interceptor: "/icons/game/ships/interceptor.png",
    Dreadnought: "/icons/game/ships/dreadnought.png",
    Starbase: "/icons/game/ships/starbase.png",
    Orbital: "/icons/game/ships/orbital.png",
    Ancient: "/icons/game/ships/ancient.png",
    GC: "/icons/game/ships/gc.png",
    Guardian: "/icons/game/ships/gc.png", // Reuse GC icon
    Deathmoon: "/icons/game/ships/deathmoon.png",
    // Generic fallback
    Generic: "/icons/game/ships/cruiser.png",
  },
  roles: {
    attacker: "/icons/game/roles/attacker.png",
    defender: "/icons/game/roles/defender.png",
  },
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type DiceIconKey = keyof typeof GAME_ICONS.dice;
export type MissileIconKey = keyof typeof GAME_ICONS.missiles;
export type StatIconKey = keyof typeof GAME_ICONS.stats;
export type ShipIconKey = keyof typeof GAME_ICONS.ships;
export type RoleIconKey = keyof typeof GAME_ICONS.roles;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get ship icon path by ship class name (case-insensitive lookup)
 */
export function getShipIcon(shipClass: string): string | null {
  // Try exact match first
  if (shipClass in GAME_ICONS.ships) {
    return GAME_ICONS.ships[shipClass as ShipIconKey];
  }

  // Try case-insensitive match
  const normalizedClass = shipClass.toLowerCase();
  const entry = Object.entries(GAME_ICONS.ships).find(
    ([key]) => key.toLowerCase() === normalizedClass,
  );

  return entry ? entry[1] : null;
}
