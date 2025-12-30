# Combat Calculator Enhancements: Features 5, 6, 7

## Overview

Three enhancements to the Eclipse combat calculator from `thoughts/tickets.md`:

1. **Feature 5 - Survival Discretization**: Show probability distributions instead of averages
2. **Feature 6 - Debounced Auto-Calculate**: Live stats update ~500ms after editing
3. **Feature 7 - Priority Target Toggle**: Per-ship high/low priority targeting

---

## Feature 5: Survival Discretization

**Current**: Shows "Cruisers: 72%" (simple average)
**New**: Shows count distributions based on fleet size

- **Small fleets (1-4 ships)**: Exact distribution
  `"0: 5%, 1: 25%, 2: 70%"`
- **Large fleets (5+ ships)**: Bucketed
  `"All: 30%, Most: 45%, Some: 20%, None: 5%"`

### Implementation

#### 1. Add types (`src/lib/types/combat.ts`)

```typescript
export interface SurvivalDistribution {
  totalCount: number;
  distribution: Record<number, number>; // count -> probability
  buckets?: { all: number; most: number; some: number; none: number };
  averageRate: number; // backward compat
}

export interface BattleResultsExtended extends BattleResults {
  survivalDistributions?: {
    attacker: Record<string, SurvivalDistribution>;
    defender: Record<string, SurvivalDistribution>;
  };
}
```

#### 2. Track exact counts in simulation (`src/lib/combat/simulation.ts`)

- Modify `SingleBattleResult` to add `survivingCounts: Record<string, number>`
- Update `getBattleStatus()` to return exact counts per ship name
- Add `aggregateSurvivalDistributions()` function to compute distributions
- Update `calculate()` to return `BattleResultsExtended`

#### 3. Update UI (`src/components/calculator/battle-results.tsx`)

- Add `SurvivalDistributionDisplay` component
- Conditionally render distribution (small) or buckets (large)
- Show average rate as secondary info

---

## Feature 6: Debounced Auto-Calculate

**Current**: Manual "Calculate" button click required
**New**: Stats auto-update 500ms after user stops editing

### Implementation

#### 1. Create custom hook (`src/lib/hooks/use-debounced-calculation.ts`)

```typescript
export function useDebouncedCalculation(
  defenderFleet: ShipConfig[],
  attackerFleet: ShipConfig[],
  options?: { debounceMs?: number; enabled?: boolean },
): {
  results: BattleResultsExtended | null;
  isCalculating: boolean;
  triggerCalculation: () => void;
};
```

- Use `useEffect` with debounced timeout
- Track fleet changes via JSON.stringify comparison
- Use `requestIdleCallback` or `setTimeout` to yield to main thread
- Support abort for in-progress calculations

#### 2. Add setting (`src/lib/types/settings.ts`, `src/lib/settings.ts`)

```typescript
autoCalculate: boolean; // default: true
```

#### 3. Update calculator page (`src/app/page.tsx`)

- Import and use `useDebouncedCalculation` hook
- Add auto-calculate toggle to settings dropdown
- Conditionally show/hide Calculate button based on setting
- Show subtle loading indicator during calculation

---

## Feature 7: Per-Ship Priority Target Toggle

**Current**: Fixed priority order (Orbital > Ancient > ... > Deathmoon)
**New**: Mark individual ships as high/low priority targets

### Implementation

#### 1. Extend types (`src/lib/types/combat.ts`)

```typescript
// Add to ShipConfig:
priorityTarget?: "high" | "low" | "normal";

// Add to Combatant:
priorityTarget: "high" | "low" | "normal";
```

#### 2. Update simulation (`src/lib/combat/simulation.ts`)

- Update `createCombatant()` to copy `priorityTarget`
- Modify `distributeHits()` sorting:
  ```typescript
  // Sort by: 1) priority setting, 2) ship class
  const priorityOrder = { high: 0, normal: 1, low: 2 };
  targets.sort((a, b) => {
    const pDiff =
      priorityOrder[a.priorityTarget] - priorityOrder[b.priorityTarget];
    if (pDiff !== 0) return pDiff;
    // Fall back to ship class priority
    return classIndex(a) - classIndex(b);
  });
  ```
- Update `createDefaultShipConfig()` to include `priorityTarget: "normal"`

#### 3. Add UI (`src/components/calculator/ship-configurator.tsx`)

- Add 3-button toggle group: High | Normal | Low
- Style: amber for high, slate for low, muted for normal
- Add info tooltip explaining it affects opponent's targeting

---

## File Changes Summary

| File                                              | Changes                                                                     |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| `src/lib/types/combat.ts`                         | Add `SurvivalDistribution`, `BattleResultsExtended`, `priorityTarget` field |
| `src/lib/types/settings.ts`                       | Add `autoCalculate` setting                                                 |
| `src/lib/settings.ts`                             | Add default for `autoCalculate`                                             |
| `src/lib/combat/simulation.ts`                    | Track counts, priority sorting, return extended results                     |
| `src/lib/hooks/use-debounced-calculation.ts`      | **New file** - debounced calculation hook                                   |
| `src/components/calculator/battle-results.tsx`    | Add `SurvivalDistributionDisplay` component                                 |
| `src/components/calculator/ship-configurator.tsx` | Add priority target toggle                                                  |
| `src/app/page.tsx`                                | Use debounced hook, add auto-calculate setting                              |

---

## Implementation Order

### Phase 1: Types (all features)

1. Update `src/lib/types/combat.ts` with new types
2. Update `src/lib/types/settings.ts` with new settings
3. Run `bun check`

### Phase 2: Feature 5 - Survival Discretization

1. Modify simulation engine to track exact counts
2. Add aggregation function for distributions
3. Update `calculate()` return type
4. Create `SurvivalDistributionDisplay` component
5. Update `SurvivalList` to use new component

### Phase 3: Feature 6 - Auto-Calculate

1. Create `use-debounced-calculation.ts` hook
2. Update settings with `autoCalculate`
3. Integrate hook into calculator page
4. Add settings toggle UI

### Phase 4: Feature 7 - Priority Targeting

1. Add `priorityTarget` to `Combatant` and sorting logic
2. Update `createDefaultShipConfig()`
3. Add priority toggle UI to ship configurator
4. Add tooltip explaining the feature

### Phase 5: Verification

1. Run `bun check` and fix any type errors
2. Run `bun format`
3. Manual testing per `thoughts/testing.md` checklist

---

## Completion Summary

**Completed**: 2025-12-30

All three features successfully implemented and verified:

### Feature 5: Survival Discretization

- Added `SurvivalDistribution` and `BattleResultsExtended` types
- Simulation now tracks exact surviving counts per iteration
- UI displays count distributions for small fleets (1-4 ships) and bucketed distributions for larger fleets (5+)
- Average survival rate shown as secondary info

### Feature 6: Debounced Auto-Calculate

- Created `useDebouncedCalculation` hook with 500ms debounce
- Added `autoCalculate` user setting (default: true)
- Settings dropdown includes "Calculation" section with toggle
- Calculate button hidden when auto-calculate enabled
- Uses `requestIdleCallback` for non-blocking calculation

### Feature 7: Per-Ship Priority Target Toggle

- Added `TargetPriority` type and `priorityTarget` field to `ShipConfig`/`Combatant`
- Updated `distributeHits()` to sort targets by user priority first, then ship class
- Ship configurator shows 3-button toggle: High (amber) | Normal | Low (slate)
- Tooltip explains the feature affects opponent's targeting

### Files Modified

- `src/lib/types/combat.ts` - New types and extended interfaces
- `src/lib/types/settings.ts` - Added `autoCalculate` setting
- `src/lib/types/components.ts` - Updated props for extended types
- `src/lib/combat/simulation.ts` - Survival tracking, priority sorting, extended results
- `src/lib/hooks/use-debounced-calculation.ts` - **New file**
- `src/components/calculator/battle-results.tsx` - Survival distribution display
- `src/components/calculator/ship-configurator.tsx` - Priority target selector
- `src/components/calculator/calculator-content.tsx` - Auto-calculate integration

### Verification

- `bun check` passes with no errors
- `bun format` applied
