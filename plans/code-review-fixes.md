# Code Review Fixes

Address 3 issues from the code review of staged changes.

## Issue 1: Remove `.eslintcache` from staging

**Problem**: Cache file should not be version controlled.

**Fix**:

1. Add `.eslintcache` to `.gitignore`
2. Unstage the file with `git reset HEAD .eslintcache`

## Issue 2: Add stable IDs to ships

**Problem**: Using array index as React key in `fleet-builder.tsx:80` causes issues when reordering/removing ships.

**Fix**:

1. Add `id` field to `ShipConfig` type in `src/lib/types/combat.ts`
2. Update `createDefaultShipConfig()` in `src/lib/combat/simulation.ts` to generate unique IDs
3. Update `page.tsx` initial state to include IDs
4. Update `fleet-builder.tsx` to use `ship.id` as key
5. Update `handleAddShip` to generate ID for new ships

**Files to modify**:

- `.gitignore`
- `src/lib/types/combat.ts`
- `src/lib/combat/simulation.ts`
- `src/app/page.tsx`
- `src/components/calculator/fleet-builder.tsx`

---

## Completion Summary

**Completed**: 2025-12-29

All three issues have been addressed:

### 1. `.eslintcache` removed from staging

- Added to `.gitignore`
- Unstaged from commit

### 2. Stable IDs added to ships

- Added `id: string` field to `ShipConfig` type (`src/lib/types/combat.ts:19`)
- Added `generateShipId()` function (`src/lib/combat/simulation.ts:499`)
- Updated `createDefaultShipConfig()` to auto-generate IDs
- Updated `fleet-builder.tsx` to use `ship.id` as React key
- Updated `page.tsx` to generate IDs for initial ships and preserve IDs on preset selection

**Verification**: `bun check` passes (ESLint + TypeScript)
