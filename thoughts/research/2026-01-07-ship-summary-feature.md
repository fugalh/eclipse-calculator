---
date: 2026-01-07T00:00:00-08:00
researcher: Claude
commit: 0f5ab76
branch: main
repository: eclipse-calc
topic: "Ship Summary Feature - Collapsed Ship Blueprint Display"
tags: [research, codebase, ship-configurator, combat, ui]
status: complete
last_updated: 2026-01-07
last_updated_by: Claude
---

# Research: Ship Summary Feature - Collapsed Ship Blueprint Display

**Date**: 2026-01-07
**Researcher**: Claude
**Commit**: 0f5ab76
**Branch**: main
**Repository**: eclipse-calc

## Research Question

When a ship class is collapsed in the combat calculator, how should a summary of its blueprint be displayed? Research the current UI implementation, data model, and symbology to understand where this feature would integrate.

## Summary

The feature request in `thoughts/ship-summary.md` specifies displaying a compact summary of ship blueprints when collapsed. The codebase already has:

1. **Collapse/expand infrastructure** via Accordion components in `ShipConfigurator`
2. **ShipConfig data model** with all required attributes (initiative, missiles, cannons, computers, shields, hull)
3. **Existing notation system** in ship-parts.ts that uses similar symbols
4. **A designated location** for collapsed content in the ship header (line 330-332 of ship-configurator.tsx)

## Detailed Findings

### 1. Collapse/Expand Architecture

**File:** `src/components/calculator/ship-configurator.tsx`

The ship configurator uses Radix UI's Accordion primitive with a header/content pattern:

- **Lines 299-302**: `AccordionItem` wraps each ship
- **Lines 303-367**: Header content (visible when collapsed)
- **Lines 370-537**: Expandable content (visible when expanded)

The header already conditionally shows ship count when collapsed:

```tsx
<span className="... group-data-[state=open]:hidden">
  {ship.number > 1 ? `×${ship.number}` : ""}
</span>
```

This pattern (`group-data-[state=open]:hidden`) is the key mechanism for showing content only when collapsed.

### 2. Ship Data Model

**File:** `src/lib/types/combat.ts` (lines 20-41)

The `ShipConfig` interface contains all attributes needed for the summary:

| Attribute         | Type         | Summary Symbol |
| ----------------- | ------------ | -------------- |
| `initiative`      | number (0-8) | `^`            |
| `missiles_yellow` | number (0-6) | `ø`            |
| `missiles_orange` | number (0-6) | `øø`           |
| `missiles_blue`   | number (0-6) | `øøø`          |
| `missiles_red`    | number (0-6) | `øøøø`         |
| `yellow`          | number (0-6) | `o`            |
| `orange`          | number (0-6) | `oo`           |
| `blue`            | number (0-6) | `ooo`          |
| `red`             | number (0-6) | `oooo`         |
| `computers`       | number (0-8) | `+N`           |
| `shields`         | number (0-8) | `-N`           |
| `hull`            | number (0-8) | `*`            |

### 3. Existing Notation System

**File:** `src/lib/data/ship-parts.ts`

The codebase already uses similar notation for ship parts:

- `.` = Energy cost
- `^` = Initiative
- `ø` = Missile die
- `o` = Cannon die
- `+` = Computer bonus
- `-` = Shield value
- `*` = Hull point

This existing notation system in `PART_TYPE_INFO` (lines 575-583) and notation parsing (lines 106-134 of `src/lib/data/index.ts`) validates the proposed symbology.

### 4. Damage Value Mapping

**File:** `src/lib/types/combat.ts` (lines 156-161)

```typescript
export const DAMAGE_VALUES: Record<DiceColor, number> = {
  red: 4,
  blue: 3,
  orange: 2,
  yellow: 1,
};
```

The summary symbol length corresponds to damage value:

- Yellow (1 damage) = `o` or `ø`
- Orange (2 damage) = `oo` or `øø`
- Blue (3 damage) = `ooo` or `øøø`
- Red (4 damage) = `oooo` or `øøøø`

### 5. Current Header Layout

**File:** `src/components/calculator/ship-configurator.tsx` (lines 303-367)

Current header structure:

```
[Chevron] [Icon] [Name/Class] [Count when collapsed] [Actions when expanded] [Remove]
```

The summary would fit between ship name and actions, following the existing pattern for collapsed-only content.

## Code References

- `src/components/calculator/ship-configurator.tsx:299-367` - Ship header with collapse state detection
- `src/components/calculator/ship-configurator.tsx:330-332` - Existing collapsed-only content pattern
- `src/lib/types/combat.ts:20-41` - ShipConfig interface with all attributes
- `src/lib/types/combat.ts:156-161` - DAMAGE_VALUES constant
- `src/lib/data/ship-parts.ts:575-583` - Existing notation symbols
- `src/lib/types/presets.ts:37-52` - Attribute limits

## Architecture Documentation

### Summary Generation Logic

Based on the specification in `thoughts/ship-summary.md`:

**Order**: Initiative > Missiles > Cannons > Computer > Shields > Hull

**Formatting Rules**:

1. Omit zero-count items
2. Initiative: `N^` where N is the value
3. Missiles: `Nø` to `Nøøøø` by damage color, N omitted if 1
4. Cannons: `No` to `Noooo` by damage color, N omitted if 1
5. Computer: `+N` where N is the total bonus
6. Shields: `-N` where N is the total value
7. Hull: `N*` where N is hull points, N omitted if 1

**Acceptance Examples** (from spec):

```
{initiative: 2, missiles_red: 3, computers: 1, hull: 2} => "2^ 3øøøø +1 2*"

{initiative: 3, blue: 1, orange: 1, computers: 1, shields: 2, hull: 4} => "3^ oooo oo +1 -2 4*"
```

### Integration Point

The summary should be rendered in the ship header alongside the existing ship count display, using the same `group-data-[state=open]:hidden` pattern to only show when collapsed.

## Historical Context (from thoughts/)

- `thoughts/ship-summary.md` - Feature specification with acceptance criteria and symbology definitions

## Open Questions

1. Should the summary include special abilities (splitter, missile_shield)?
2. Should number of ships (×N) be part of the summary or remain separate?
3. Font/styling for symbols - monospace for alignment?
