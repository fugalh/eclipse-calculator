---
date: 2026-01-07T12:00:00-08:00
researcher: Claude
commit: c66808b
branch: main
repository: eclipse-calc
topic: "Ship Count Zero Support - Current Implementation"
tags: [research, codebase, combat-calculator, ship-count, UI]
status: complete
last_updated: 2026-01-07
last_updated_by: Claude
---

# Research: Ship Count Zero Support

**Date**: 2026-01-07
**Researcher**: Claude
**Commit**: c66808b
**Branch**: main
**Repository**: eclipse-calc

## Research Question

How to allow ship count to be 0 (with visual fading) to make considering battles with various ship types faster.

## Summary

The combat calculator currently enforces a **minimum count of 1** for all ship types via `SHIP_COUNT_LIMITS`. The simulation engine already handles 0-count ships gracefully (creates empty ship groups, returns empty dice pools). The changes required are:

1. Update `SHIP_COUNT_LIMITS` to allow minimum of 0
2. Add visual fading for ships with count 0
3. Update cycling logic to include 0 in the cycle

## Detailed Findings

### 1. Ship Count Constraints (Current Implementation)

**File**: `src/lib/types/presets.ts:54-67`

All ship classes have minimum count of 1:

```typescript
export const SHIP_COUNT_LIMITS: Record<string, [number, number]> = {
  Interceptor: [1, 8], // [min, max]
  Cruiser: [1, 4],
  Dreadnought: [1, 2],
  Starbase: [1, 4],
  Orbital: [1, 1],
  Ancient: [1, 6],
  Guardian: [1, 2],
  GC: [1, 1],
  Deathmoon: [1, 1],
  default: [1, 6],
};
```

### 2. Cycling Logic

**File**: `src/lib/presets.ts:220-236`

The `cycleAttribute()` function cycles ship counts within the defined limits:

```typescript
if (attributeName === "number" && shipClass) {
  const limits = SHIP_COUNT_LIMITS[shipClass] ?? SHIP_COUNT_LIMITS.default;
  const [min, max] = limits;
  const nextValue = currentValue + 1;
  return nextValue > max ? min : nextValue; // Wraps to min when exceeding max
}
```

**Cycle behavior**: 1 → 2 → ... → max → 1 (wrap around)

### 3. Reset Logic

**File**: `src/components/calculator/ship-configurator.tsx:273-287`

Long-press resets to the class-specific minimum:

```typescript
if (attr === "number" && ship.shipClass) {
  const limits = SHIP_COUNT_LIMITS[ship.shipClass] ?? SHIP_COUNT_LIMITS.default;
  resetValue = limits[0]; // Min value (currently always 1)
}
```

### 4. Ship Count Button Display

**File**: `src/components/calculator/ship-configurator.tsx:248`

Displays with multiplication symbol:

```typescript
{
  name === "number" ? `×${value}` : value;
}
```

**File**: `src/components/calculator/ship-configurator.tsx:385-390`

The button component:

```typescript
<AttributeButton
  name="number"
  value={ship.number}
  onClick={() => handleAttributeClick("number")}
  onLongPress={() => handleAttributeReset("number")}
  variant="stat"
/>
```

### 5. Simulation Handling of Zero Count

**File**: `src/lib/combat/simulation.ts:216-228`

The simulation already handles 0 gracefully:

```typescript
function createShipGroup(
  shipConfig: ShipConfig,
  isDefender: boolean,
): ShipGroup {
  const ships: Combatant[] = [];
  const shipCount = shipConfig.number || 1; // Falls back to 1 if falsy

  for (let i = 0; i < shipCount; i++) {
    ships.push(createCombatant(shipConfig, isDefender));
  }
  return { ships }; // Empty array if shipCount is 0
}
```

**File**: `src/lib/combat/simulation.ts:75-80`

Empty ships array handled in dice pool creation:

```typescript
if (ships.length === 0) {
  return dicePool; // Returns empty dice pool
}
```

### 6. Ship Card Visual Structure

**File**: `src/components/calculator/ship-configurator.tsx:342-445`

The ship card renders as an AccordionItem with:

- **Header** (line 345-368): Ship name, delete button, summary with count
- **Content** (line 370-444): Grid of attribute buttons including number button
- **Summary line** (line 365): `×{ship.number} {generateShipSummary(ship)}`

The header and content are both visible areas where opacity could be applied.

## Code References

| File                                              | Lines   | Description                    |
| ------------------------------------------------- | ------- | ------------------------------ |
| `src/lib/types/presets.ts`                        | 54-67   | `SHIP_COUNT_LIMITS` definition |
| `src/lib/presets.ts`                              | 220-236 | `cycleAttribute()` function    |
| `src/components/calculator/ship-configurator.tsx` | 273-287 | `handleAttributeReset()`       |
| `src/components/calculator/ship-configurator.tsx` | 248     | Count display format           |
| `src/components/calculator/ship-configurator.tsx` | 385-390 | Number button render           |
| `src/components/calculator/ship-configurator.tsx` | 342-445 | Full ship card structure       |
| `src/lib/combat/simulation.ts`                    | 216-228 | `createShipGroup()`            |
| `src/lib/combat/simulation.ts`                    | 75-80   | Empty array handling           |

## Architecture Documentation

The ship count flows through:

1. **UI**: User taps number button → `handleAttributeClick()` → `cycleAttribute()`
2. **State**: Returns new value → `onChange({ ...ship, number: newValue })`
3. **Parent**: `FleetBuilder.handleShipChange()` → updates fleet state
4. **Simulation**: `createShipGroup()` expands count into individual combatants

The system is already architected to handle 0-count ships at the simulation level. The constraint is purely in the UI limits.

## Open Questions

1. Should ships with count 0 be excluded from simulation entirely (filter them out before passing to simulator)?
2. What opacity level provides good visual feedback while remaining readable?
3. Should the faded state apply to the whole card or just the content area?
