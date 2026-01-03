# Plan: Add Icons Legend to About Page

## Goal

Enhance the Legend section in `/src/app/about/page.tsx` to display the actual game icons from `GAME_ICONS` (`/src/lib/icons.ts`) with **both** a visual icon grid gallery **and** icons inline with the existing text descriptions.

## Current State

- About page has a text-only Legend section (lines 90-163)
- `GAME_ICONS` defines icons for: dice, missiles, stats, ships, and roles
- Icons exist in `public/icons/game/` subdirectories
- Note: `computers` and `shields` stats are `null` (text fallback, no icon exists)

## Available Icons

| Category | Icons                                                                        |
| -------- | ---------------------------------------------------------------------------- |
| Dice     | yellow, orange, blue, red (damage 1, 2, 3, 4)                                |
| Missiles | yellow, orange, blue, red (damage 1, 2, 3, 4)                                |
| Stats    | hull, initiative, number (computers/shields have no icons)                   |
| Ships    | cruiser, interceptor, dreadnought, starbase, orbital, ancient, gc, deathmoon |
| Roles    | attacker, defender                                                           |

## Implementation

### Step 1: Convert to Client Component

Add `"use client"` directive and import `Image` from `next/image` and `GAME_ICONS` from `@/lib/icons`.

### Step 2: Add Visual Icon Gallery (NEW section before existing legend content)

Add a visual grid gallery at the top of the Legend card content, organized by category:

```
[Icon Gallery]
├── Dice Colors: 🎲yellow 🎲orange 🎲blue 🎲red (with damage labels)
├── Missiles: 🚀yellow 🚀orange 🚀blue 🚀red (with damage labels)
├── Stats: hull, initiative, number icons
├── Ships: all 8 ship type icons with labels
└── Roles: attacker, defender icons
```

Layout: Horizontal flex/grid per category, icons ~24-28px with label below.

### Step 3: Add Inline Icons to Existing Text Descriptions

Update the existing "Weapons" and "Ship Stats" text sections to include small icons (16-20px) inline with the text labels:

- **Missiles row**: Add 4 dice color icons inline
- **Cannons row**: Add 4 dice color icons inline
- **Number row**: Add number icon
- **Hull row**: Add hull icon
- **Initiative row**: Add initiative icon
- Computers/Shields: Keep text only (no icons available)

## Files to Modify

- `/src/app/about/page.tsx` - Enhance Legend section with icon gallery + inline icons

## Code Changes Summary

1. Add `"use client"` at top
2. Import `Image` from `next/image`
3. Import `GAME_ICONS` from `@/lib/icons`
4. Add icon gallery grid section before existing content
5. Update weapon/stat rows with inline icons

---

## Completion Summary (2025-12-30)

### Changes Made

- Converted `/src/app/about/page.tsx` from server to client component
- Added visual icon gallery with 5 categories:
  - **Dice Colors**: 4 dice icons with damage values (1-4)
  - **Missiles**: 4 missile icons with damage values (1-4)
  - **Ship Stats**: number, hull, initiative icons + text placeholders for computers/shields
  - **Ship Types**: 8 ship class icons (Interceptor, Cruiser, Dreadnought, Starbase, Orbital, Ancient, GC, Deathmoon)
  - **Roles**: attacker/defender icons
- Added inline icons (16px) to existing text descriptions for Missiles, Cannons, Number, Hull, and Initiative
- Added horizontal rule divider between gallery and text descriptions

### Verification

- `bun check` passes (also fixed stale `.next/types` reference to deleted test page)
- `bun format` applied
