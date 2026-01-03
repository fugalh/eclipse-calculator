/**
 * Share utilities for Eclipse Combat Calculator
 * Handles URL encoding/decoding for battle configs and text export
 */

import type { ShipConfig, BattleResults } from "@/lib/types";

// ============================================================================
// Compressed Ship Config (minimal keys for URL encoding)
// ============================================================================

interface CompressedShip {
  n: string; // name
  c: string; // shipClass
  x: number; // number (count)
  h: number; // hull
  y: number; // yellow
  o: number; // orange
  b: number; // blue
  r: number; // red
  my: number; // missiles_yellow
  mo: number; // missiles_orange
  mb: number; // missiles_blue
  mr: number; // missiles_red
  cp: number; // computers
  sh: number; // shields
  in: number; // initiative
  sp: boolean; // splitter
  ms: boolean; // missile_shield
}

interface CompressedBattle {
  d: CompressedShip[]; // defenders
  a: CompressedShip[]; // attackers
}

// ============================================================================
// Compression/Decompression
// ============================================================================

function compressShip(ship: ShipConfig): CompressedShip {
  return {
    n: ship.name,
    c: ship.shipClass,
    x: ship.number,
    h: ship.hull,
    y: ship.yellow,
    o: ship.orange,
    b: ship.blue,
    r: ship.red,
    my: ship.missiles_yellow,
    mo: ship.missiles_orange,
    mb: ship.missiles_blue,
    mr: ship.missiles_red,
    cp: ship.computers,
    sh: ship.shields,
    in: ship.initiative,
    sp: ship.splitter,
    ms: ship.missile_shield,
  };
}

function decompressShip(compressed: CompressedShip, id: string): ShipConfig {
  return {
    id,
    name: compressed.n,
    shipClass: compressed.c,
    number: compressed.x,
    hull: compressed.h,
    yellow: compressed.y,
    orange: compressed.o,
    blue: compressed.b,
    red: compressed.r,
    missiles_yellow: compressed.my,
    missiles_orange: compressed.mo,
    missiles_blue: compressed.mb,
    missiles_red: compressed.mr,
    computers: compressed.cp,
    shields: compressed.sh,
    initiative: compressed.in,
    splitter: compressed.sp,
    missile_shield: compressed.ms,
  };
}

// ============================================================================
// URL Encoding/Decoding
// ============================================================================

/**
 * Encode battle configuration to a URL-safe string
 */
export function encodeBattleConfig(
  defenders: ShipConfig[],
  attackers: ShipConfig[],
): string {
  const compressed: CompressedBattle = {
    d: defenders.map(compressShip),
    a: attackers.map(compressShip),
  };

  const json = JSON.stringify(compressed);
  // Use base64url encoding (URL-safe base64)
  const base64 = btoa(json)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return base64;
}

/**
 * Decode battle configuration from URL parameter
 * Returns null if decoding fails
 */
export function decodeBattleConfig(encoded: string): {
  defenders: ShipConfig[];
  attackers: ShipConfig[];
} | null {
  try {
    // Restore base64 padding and characters
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const json = atob(base64);
    const compressed: CompressedBattle = JSON.parse(json);

    // Generate unique IDs for each ship
    const defenders = compressed.d.map((ship, i) =>
      decompressShip(ship, `shared-d-${i}-${Date.now()}`),
    );
    const attackers = compressed.a.map((ship, i) =>
      decompressShip(ship, `shared-a-${i}-${Date.now()}`),
    );

    return { defenders, attackers };
  } catch {
    return null;
  }
}

/**
 * Generate a shareable URL for the current battle configuration
 */
export function generateShareUrl(
  defenders: ShipConfig[],
  attackers: ShipConfig[],
): string {
  const encoded = encodeBattleConfig(defenders, attackers);
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://example.com";
  return `${baseUrl}/?battle=${encoded}`;
}

// ============================================================================
// Text Export
// ============================================================================

/**
 * Format fleet as readable text
 */
function formatFleet(ships: ShipConfig[]): string {
  const counts: Record<string, number> = {};
  for (const ship of ships) {
    const key = ship.name;
    counts[key] = (counts[key] || 0) + ship.number;
  }

  return Object.entries(counts)
    .map(([name, count]) => (count > 1 ? `${count}x ${name}` : name))
    .join(", ");
}

/**
 * Format battle results as shareable text
 */
export function formatResultsAsText(
  results: BattleResults,
  defenders: ShipConfig[],
  attackers: ShipConfig[],
): string {
  const attackerWins = results.attacker > results.defender;
  const tie = Math.abs(results.attacker - results.defender) < 0.001;

  const winner = tie
    ? "Tie"
    : attackerWins
      ? `Attacker (${Math.round(results.attacker * 100)}%)`
      : `Defender (${Math.round(results.defender * 100)}%)`;

  let text = `Eclipse Combat Results
─────────────────────
Defender: ${formatFleet(defenders)}
Attacker: ${formatFleet(attackers)}

Winner: ${winner}
`;

  // Defender survival
  const defenderEntries = Object.entries(results.shipsDefender);
  if (defenderEntries.length > 0) {
    text += `\nDefender Survivors (when winning):\n`;
    for (const [name, rate] of defenderEntries) {
      text += `• ${name}: ${Math.round(rate * 100)}%\n`;
    }
  }

  // Attacker survival
  const attackerEntries = Object.entries(results.shipsAttacker);
  if (attackerEntries.length > 0) {
    text += `\nAttacker Survivors (when winning):\n`;
    for (const [name, rate] of attackerEntries) {
      text += `• ${name}: ${Math.round(rate * 100)}%\n`;
    }
  }

  return text.trim();
}

// ============================================================================
// Web Share API
// ============================================================================

/**
 * Check if Web Share API is available
 */
export function canUseWebShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

/**
 * Share using Web Share API
 * Returns true if share was successful, false otherwise
 */
export async function shareViaWebShare(
  title: string,
  text: string,
  url: string,
): Promise<boolean> {
  if (!canUseWebShare()) {
    return false;
  }

  try {
    await navigator.share({ title, text, url });
    return true;
  } catch (error) {
    // User cancelled or share failed
    if (error instanceof Error && error.name === "AbortError") {
      return false;
    }
    console.error("Share failed:", error);
    return false;
  }
}

/**
 * Copy text to clipboard
 * Returns true if copy was successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
