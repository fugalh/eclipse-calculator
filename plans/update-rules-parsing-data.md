# Plan: Update Rules Parsing & Static Data

## Overview

Update `src/lib/rules/` (parsing logic) and `src/lib/data/` (static data) to reflect the updated `rules/ECLIPSE_RULES.md`.

The new ECLIPSE_RULES.md has:

- Uppercase section headers (e.g., "GAME SETUP" vs "Game Setup")
- New "GAME COMPONENTS" section
- More formal/comprehensive content matching the official rulebook
- FAQ section at the end

---

## Parallel Workstreams

### Agent 1: Parsing Logic (`src/lib/rules/`)

**Files to update:**

- `src/lib/rules/categories.ts` - Add "components" category, update heading patterns for uppercase headers
- `src/lib/rules/parser.ts` - Verify parsing still works with new structure (likely no changes)
- `src/lib/rules/search.ts` - Add reference link mapping for new categories if needed

**Key changes:**

1. Add `components` category to `CATEGORY_INFO`
2. Update `HEADING_CATEGORY_MAP` patterns to handle uppercase headers and new sections
3. Add pattern for "GAME COMPONENTS" section
4. Verify case-insensitive regex patterns work with new format

---

### Agent 2: Rules Index (`src/lib/data/rules-index.ts`)

**Task:** Re-generate the pre-parsed rules sections from the new ECLIPSE_RULES.md

This file contains ~100 pre-indexed sections that power the search. It needs to be regenerated to match the new markdown structure.

**Approach:**

1. Use the parser from `src/lib/rules/parser.ts` to parse new ECLIPSE_RULES.md
2. Update the exported `RULES_SECTIONS` array with new parsed content
3. Verify categories are assigned correctly

---

### Agent 3: Technologies Data (`src/lib/data/techs.ts`)

**Task:** Compare existing tech data against ECLIPSE_RULES.md tech tables

Review the Technology Reference tables in ECLIPSE_RULES.md (lines 611-751) and verify:

- All 46 techs are present with correct costs/effects
- Rare techs are complete (15 listed in rules)
- Notation strings match game aids

---

### Agent 4: Ship Parts Data (`src/lib/data/ship-parts.ts`)

**Task:** Compare existing ship part data against ECLIPSE_RULES.md ship part table

Review the Ship Part Reference table in ECLIPSE_RULES.md (lines 754-783) and verify:

- All 40 parts have correct stats (damage, energy, initiative, etc.)
- Ancient parts are complete
- Discovery parts are included

---

### Agent 5: Species Data (`src/lib/data/species.ts`)

**Task:** Compare existing species data against ECLIPSE_RULES.md species section

Review the Alien Species section in ECLIPSE_RULES.md (lines 554-609) and verify:

- All 7 species have correct starting resources
- Special abilities match rulebook
- Trade ratios are accurate
- Starting techs are correct

---

### Agent 6: Combat Rules Data (`src/lib/data/combat-rules.ts`)

**Task:** Compare combat rules data against ECLIPSE_RULES.md combat section

Review the Combat Phase section in ECLIPSE_RULES.md (lines 470-512) and verify:

- All combat mechanics are documented
- Examples and tips are accurate
- Quick reference data matches

---

## Execution Order

1. **First wave (parallel):** Agents 1, 3, 4, 5, 6
2. **Second wave:** Agent 2 (depends on Agent 1 completing category updates)

---

## Files Modified

| File                           | Agent | Changes                                  |
| ------------------------------ | ----- | ---------------------------------------- |
| `src/lib/rules/categories.ts`  | 1     | Add components category, update patterns |
| `src/lib/rules/parser.ts`      | 1     | Verify (likely no changes)               |
| `src/lib/rules/search.ts`      | 1     | Add reference link if needed             |
| `src/lib/data/rules-index.ts`  | 2     | Regenerate parsed sections               |
| `src/lib/data/techs.ts`        | 3     | Verify/update tech data                  |
| `src/lib/data/ship-parts.ts`   | 4     | Verify/update part data                  |
| `src/lib/data/species.ts`      | 5     | Verify/update species data               |
| `src/lib/data/combat-rules.ts` | 6     | Verify/update combat data                |

---

## Validation

After all agents complete:

1. Run `bun check` to verify TypeScript/ESLint
2. Run `bun format` to apply Prettier
3. Run `bun run build` to verify production build
4. Test search functionality on `/search` page

---

## Completion Summary

**Status:** ✅ Complete

**Date:** 2026-01-05

### Changes Made

#### Agent 1: Parsing Logic

- Added "components" category to `CATEGORY_INFO` in `categories.ts`
- Added heading pattern for "GAME COMPONENTS" section
- Added content pattern for component-related terms
- No changes needed to `parser.ts` (case-insensitive patterns work)
- No changes needed to `search.ts` (no reference page for components)

#### Agent 2: Rules Index

- Regenerated 52 sections from updated ECLIPSE_RULES.md
- Added new categories: "components", "faq", "setup" to type definitions
- Created utility scripts for future regeneration:
  - `scripts/generate-rules-index.ts`
  - `scripts/verify-rules-index.ts`

#### Agent 3: Technologies Data

- Fixed Neutron Bombs: `techType: "permanent"` → `"instant"`
- Fixed Starbase: `scienceCost: 4` → `3`
- Fixed comment: "14 rare techs" → "15 rare techs"

#### Agent 4: Ship Parts Data

- Fixed Ion Cannon: energy cost `0` → `-1`
- Added missing Ion Missile (standard tech version)
- Fixed Plasma Missile: dice count `2` → `1`, energy `−1` → `0`
- Fixed Flux Missile: dice count `2` → `1`, removed initiative bonus
- Fixed Absorption Shield: energy production `4` → `1`
- Fixed Transition Drive: energy generation `0` → `2`, initiative `3` → `0`

#### Agent 5: Species Data

- Fixed Eridani Empire: starting money `26` → `2`
- Fixed Planta: trade ratio `3:1` → `4:1`
- Fixed Descendants of Draco: VP description updated
- Fixed Terran Factions: added `["starbase"]` to starting techs

#### Agent 6: Combat Rules Data

- Fixed hit rule: "natural 6 always hits" → "burst symbol (★) always hits"

### Verification

- ✅ `bun check` passed
- ✅ `bun format` applied
- ✅ `bun run build` succeeded
