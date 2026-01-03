# Audit: Combat Implementation vs Eclipse Rules

## Summary

Audited `src/lib/combat/simulation.ts`, `src/lib/types/combat.ts`, `src/lib/types/presets.ts`, and `src/components/calculator/` against `rules/ECLIPSE_RULES.md`.

---

## ✅ Correct Implementations

### Dice System

- **Damage values**: yellow=1, orange=2, blue=3, red=4 ✅
- **Source**: `DAMAGE_VALUES` in `combat.ts:116-121`

### Hit Detection

- **Formula**: `roll + computers - shields >= 6` ✅
- **Natural 6 always hits** ✅
- **Natural 1 always misses** ✅
- **Source**: `checkHit()` in `simulation.ts:43-53`

### Initiative Order

- **Highest initiative fires first** ✅
- **Defender wins ties** (via +0.1 bonus) ✅
- **Source**: `createCombatant()` line 136, `createInitiativeOrder()` lines 214-219

### Missile Phase

- **Fires only first round** before engagement rounds ✅
- **Source**: `resolveBattle()` lines 367-368

### Hull/HP Calculation

- **HP = hull + 1** (base 1 HP + hull value) ✅
- **Matches rule**: "Ships receiving damage greater than their Hull Value are destroyed"
- **Source**: `createCombatant()` line 139

### Missile Shield (Distortion Field)

- **+2 shields vs missiles** ✅
- **Source**: `checkHit()` lines 44-47

### Default Ship Initiative Values

All match rules (base initiative + Nuclear Drive):
| Ship | Base | Drive | Total | Preset |
|------|------|-------|-------|--------|
| Interceptor | +2 | +1 | 3 | ✅ 3 |
| Cruiser | +1 | +1 | 2 | ✅ 2 |
| Dreadnought | 0 | +1 | 1 | ✅ 1 |
| Starbase | +4 | 0 | 4 | ✅ 4 |

---

## ⚠️ Discrepancies Found

### 1. Antimatter Splitter Mechanic (Debatable - Low Priority)

**Location**: `simulation.ts:103-114`

**Current**: Converts each red die to 4 yellow dice with the same roll value. This creates 4 separate hit checks.

**Rules say** (line 930): "Split damage from Antimatter Cannons freely over targets" - meaning 4 damage from ONE hit can be distributed to multiple ships.

**Interpretation debate**:

- **Current implementation**: 4 separate dice = 4 hit/miss checks (more generous to attacker)
- **Strict interpretation**: 1 hit check, then distribute 4 damage points

**Decision**: Keep current implementation as default. Implement alternative as optional. Mark TODO for future UI toggle.

**Example**: Ship A (2 HP) and Ship B (3 HP). Red die rolls 5 with +1 computer vs 0 shields.

- Current: Each yellow die hits (5+1-0=6). All 4 dice could target Ship A, dealing 4 damage (kills with 2 overkill wasted) OR distribute
- Rules: One hit for 4 damage, player chooses: 2 to Ship A (kills), 2 to Ship B (damages)

### 2. Ship Number Limits (Low Priority)

**Location**: `presets.ts:51` (`number: [1, 6]`)

**Current**: Max 6 ships of any class

**Rules** (lines 85-89):

- Interceptors: 8 per player
- Cruisers: 4 per player
- Dreadnoughts: 2 per player
- Starbases: 4 per player

**Recommendation**: Keep 6 as reasonable practical limit OR make class-specific

### 3. Missing Guardian Preset (Low Priority)

**Location**: `presets.ts` - only has "Ancient" NPC

**Rules** (lines 867-877): Guardians are distinct from Ancients

- Use different Blueprint Tile
- Worth 2 Reputation Tiles (vs 1 for Ancients)

**Recommendation**: Add Guardian preset (stats vary by blueprint tile selection)

### 4. NPC Targeting Logic (Low Priority)

**Location**: `simulation.ts:293-337` (`distributeHits`)

**Current**: Uses same `TARGET_PRIORITY` for all combatants

**Rules** (lines 679-686): When battling Ancients/Guardians/GCDS:

> "Dice are assigned to destroy your Ships from largest to smallest if possible. Otherwise, inflict maximum damage to largest Ships first"

**Difference**: NPCs should target largest ships first (Dreadnought > Cruiser > Interceptor), not the current priority order.

### 5. Ancient Preset Stats (Low Priority)

**Location**: `presets.ts:37-46`

**Current**: Fixed stats (2 yellow, +1 computer, 1 hull, 2 initiative)

**Rules** (line 866): "Use Ancient Blueprint Tile chosen during setup"

**Reality**: Ancient stats vary. Current preset appears to match the basic Ancient blueprint but this isn't the only option.

### 6. GCDS Preset Incomplete (Low Priority)

**Location**: `presets.ts:27-35`

**Current**: 4 yellow, +1 computer, 7 hull, no initiative

**Notes**:

- Rules say GCDS "Pins all Ships in Galactic Center Sector"
- GCDS stats also vary by Blueprint Tile choice
- Missing explicit initiative value (defaults to 0)

### 7. "Deathmoon" Not in Base Rules

**Location**: `presets.ts:99-108`, `combat.ts:131`

**Note**: Deathmoon appears to be from the "Rise of the Ancients" expansion, not the base "Second Dawn" rules.

**Decision**: Keep combat logic (TARGET_PRIORITY), remove from UI presets, add TODO to discuss expansion support.

---

## 🔍 Missing Features (Intentional Limitations)

These are not bugs but notable omissions from the simulation:

1. **Retreat Mechanic** - Rules allow retreat during ship activation
2. **Stalemate Detection** - If neither player can destroy other's ships, attacker must retreat or be destroyed
3. **Multi-Opponent Battles** - Rules support battles with 3+ factions
4. **Reputation Tile Tracking** - No VP calculation

---

## Recommendations

### Medium Priority

1. **Ship limits**: Class-specific limits matching component counts
2. **Guardian preset**: Add with configurable blueprint stats
3. **NPC targeting**: Implement "largest first" targeting for AI-controlled ships

### Low Priority

4. **Antimatter Splitter**: Add alternative strict implementation with TODO for UI toggle
5. **Deathmoon**: Remove from presets, keep in combat logic, add TODO for expansion support

---

## Files Audited

| File                                              | Purpose          | Status   |
| ------------------------------------------------- | ---------------- | -------- |
| `src/lib/combat/simulation.ts`                    | Combat engine    | 1 issue  |
| `src/lib/types/combat.ts`                         | Type definitions | OK       |
| `src/lib/types/presets.ts`                        | Attribute limits | 1 issue  |
| `src/lib/presets.ts`                              | Ship presets     | 2 issues |
| `src/components/calculator/ship-configurator.tsx` | Ship UI          | OK       |
| `src/components/calculator/fleet-builder.tsx`     | Fleet UI         | OK       |

---

## Implementation Plan

### Step 1: Antimatter Splitter - Add Alternative Implementation

**File**: `src/lib/combat/simulation.ts`

Keep current `splitAntimatter()` as default. Add alternative strict implementation:

1. Keep existing `splitAntimatter()` function (current behavior)
2. Add new `splitAntimatterStrict()` function for rules-strict interpretation
3. Add TODO comment for future UI toggle between modes

**Implementation**:

```typescript
// TODO: Add UI toggle for Antimatter Splitter interpretation
// - "Generous" (default): 4 separate yellow dice, 4 hit checks
// - "Strict": 1 hit check, distribute 4 damage points

function splitAntimatterStrict(dicePool: DicePool): void {
  // Alternative implementation: keep red dice but mark for damage distribution
  // Red dice that hit distribute their 4 damage freely across valid targets
}
```

Current implementation remains active by default.

### Step 2: Fix Ship Number Limits

**File**: `src/lib/types/presets.ts`

Change from single `number` limit to class-specific limits:

```typescript
export const SHIP_COUNT_LIMITS: Record<string, [number, number]> = {
  Interceptor: [1, 8],
  Cruiser: [1, 4],
  Dreadnought: [1, 2],
  Starbase: [1, 4],
  Orbital: [1, 1], // One per sector
  Ancient: [1, 6],
  Guardian: [1, 2],
  GC: [1, 1],
  Deathmoon: [1, 1],
  default: [1, 6],
};
```

**File**: `src/lib/presets.ts`

Update `cycleAttribute()` to use class-specific limits when cycling `number`:

```typescript
export function cycleAttribute(
  currentValue: number,
  attributeName: NumericAttributeName,
  shipClass?: string, // New parameter
): number {
  if (attributeName === "number" && shipClass) {
    const [min, max] =
      SHIP_COUNT_LIMITS[shipClass] ?? SHIP_COUNT_LIMITS.default;
    const nextValue = currentValue + 1;
    return nextValue > max ? min : nextValue;
  }
  // ... existing logic
}
```

**File**: `src/components/calculator/ship-configurator.tsx`

Pass `shipClass` to `cycleAttribute()` for the number field.

### Step 3: Add Guardian Preset

**File**: `src/lib/presets.ts`

Add Guardian preset after Ancient:

```typescript
{
  ...createDefaultShipConfig({
    name: "Guardian",
    shipClass: "Guardian",
    yellow: 3,
    computers: 2,
    hull: 3,
    initiative: 3,
  }),
  type: "npc",
},
```

**File**: `src/lib/types/combat.ts`

Add "Guardian" to `TARGET_PRIORITY` array (between Ancient and GC).

### Step 4: Implement NPC Targeting Logic

**File**: `src/lib/combat/simulation.ts`

Modify `distributeHits()` to check if the attacking side is NPC:

```typescript
// NPC priority: Dreadnought > Cruiser > Starbase > Interceptor (largest first)
const NPC_TARGET_PRIORITY: readonly string[] = [
  "Deathmoon",
  "Dreadnought",
  "Cruiser",
  "Starbase",
  "Interceptor",
  "Orbital",
];

function distributeHits(
  dicePool: DicePool,
  targets: Combatant[],
  isNpcAttacker: boolean,
): void {
  const priority = isNpcAttacker ? NPC_TARGET_PRIORITY : TARGET_PRIORITY;
  // ... rest of logic using this priority
}
```

Update `combatRound()` to pass NPC flag based on ship class.

### Step 5: Remove Deathmoon from UI Presets

**File**: `src/lib/presets.ts`

1. Remove Deathmoon from `DEFAULT_PRESETS` array
2. Add TODO comment for expansion support discussion

```typescript
// TODO: Discuss expansion support (Rise of the Ancients)
// Deathmoon logic retained in TARGET_PRIORITY for future use
```

**File**: `src/lib/types/combat.ts`

Keep "Deathmoon" in `TARGET_PRIORITY` but add TODO comment.

---

## Files to Modify

| File                                              | Changes                                                   |
| ------------------------------------------------- | --------------------------------------------------------- |
| `src/lib/combat/simulation.ts`                    | Add alternative splitter (TODO), NPC targeting            |
| `src/lib/types/combat.ts`                         | Add Guardian to TARGET_PRIORITY, TODO for Deathmoon       |
| `src/lib/types/presets.ts`                        | Class-specific ship limits                                |
| `src/lib/presets.ts`                              | Guardian preset, remove Deathmoon, updated cycleAttribute |
| `src/components/calculator/ship-configurator.tsx` | Pass shipClass to cycleAttribute                          |

---

## Completion Summary

**Completed**: 2025-12-29

All 5 implementation steps completed successfully:

1. ✅ **Antimatter Splitter** - Added alternative `splitAntimatterStrict()` function with TODO for future UI toggle. Current "generous" implementation remains default.

2. ✅ **Ship Number Limits** - Added `SHIP_COUNT_LIMITS` constant with class-specific limits (8 Interceptors, 4 Cruisers, 2 Dreadnoughts, etc.). Updated `cycleAttribute()` to accept optional `shipClass` parameter.

3. ✅ **Guardian Preset** - Added Guardian preset (3 yellow, +2 computer, 3 hull, 3 initiative) and added "Guardian" to `TARGET_PRIORITY`.

4. ✅ **NPC Targeting** - Added `NPC_SHIP_CLASSES` set and `NPC_TARGET_PRIORITY` (largest ships first). Modified `distributeHits()` and `combatRound()` to use NPC targeting logic when attacker is Ancient/Guardian/GCDS.

5. ✅ **Deathmoon Cleanup** - Removed Deathmoon from `DEFAULT_PRESETS`, kept in `TARGET_PRIORITY` with TODO comment for expansion support.

**Verification**: `bun check` and `bun format` pass with no errors.
