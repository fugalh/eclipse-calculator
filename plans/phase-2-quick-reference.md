# Phase 2: Quick Reference Guides - Implementation Plan

## Overview

Create static reference pages for Eclipse: Second Dawn game rules and components. Five reference sections with mobile-optimized tables, color-coded categories, and internal cross-linking.

## Pages to Create

| Route                    | Content Source                | Description                                |
| ------------------------ | ----------------------------- | ------------------------------------------ |
| `/reference`             | -                             | Hub page with links to all sections        |
| `/reference/techs`       | Techs.html + ECLIPSE_RULES.md | Tech tree with costs, categories, effects  |
| `/reference/ship-parts`  | ECLIPSE_RULES.md              | Ship part stats (weapons, shields, drives) |
| `/reference/species`     | ECLIPSE_RULES.md              | Species abilities and starting conditions  |
| `/reference/combat`      | ECLIPSE_RULES.md              | Combat rules quick reference               |
| `/reference/differences` | Differences.html              | New Dawn vs Second Dawn changes            |

## Architecture Decisions

### Data Layer

**Static TypeScript data files** in `src/lib/data/`:

- Type-safe, fast builds, easy to maintain
- Files: `techs.ts`, `ship-parts.ts`, `species.ts`, `combat-rules.ts`, `differences.ts`

### Notation Display

**Toggleable notation** - Users can switch between:

- **Symbolic**: Compact notation matching game aids (e.g., `..***` = 2 energy, 3 hull)
- **Descriptive**: Beginner-friendly text (e.g., "Energy: 2, Hull: +3")
- Store preference in localStorage

### Species Format

**Hybrid approach**:

- Individual species cards with full details
- "Compare" button to show selected species side-by-side in modal/drawer

### Navigation

- Global nav in `layout.tsx` (Calculator | Reference)
- Reference pages share `app/reference/layout.tsx` with sidebar/tabs
- Mobile: Horizontal tabs or collapsible sidebar

## Implementation Steps

### Step 1: Data Layer (`src/lib/data/`)

Create typed data files extracted from ECLIPSE_RULES.md and HTML:

| File              | Content                                             | ~Records |
| ----------------- | --------------------------------------------------- | -------- |
| `techs.ts`        | All technologies with category, cost, effect, parts | 36       |
| `ship-parts.ts`   | All parts with stats, energy, damage values         | 30+      |
| `species.ts`      | Species with resources, techs, abilities            | 8        |
| `combat-rules.ts` | Combat mechanics as structured sections             | ~10      |
| `differences.ts`  | Second Dawn changes from New Dawn                   | ~20      |
| `index.ts`        | Barrel export                                       | -        |

### Step 2: Shared Components (`src/components/reference/`)

| Component             | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `notation-toggle.tsx` | Switch between symbolic/descriptive view |
| `tech-card.tsx`       | Tech display with category color badge   |
| `part-card.tsx`       | Ship part with stats grid                |
| `species-card.tsx`    | Species overview with expandable details |
| `species-compare.tsx` | Side-by-side comparison drawer           |
| `combat-section.tsx`  | Collapsible rule accordion               |
| `difference-item.tsx` | Before/after change display              |
| `reference-nav.tsx`   | Sidebar/tabs navigation                  |
| `category-filter.tsx` | Filter by tech/part category             |

### Step 3: Reference Layout (`src/app/reference/layout.tsx`)

- Sidebar navigation (desktop) / horizontal tabs (mobile)
- Active page indicator
- Breadcrumb support
- Notation toggle in header

### Step 4: Reference Pages

| Route                    | Key Features                                 |
| ------------------------ | -------------------------------------------- |
| `/reference`             | Hub with cards linking to each section       |
| `/reference/techs`       | Grid view, filter by category, search        |
| `/reference/ship-parts`  | Table with sortable columns, category filter |
| `/reference/species`     | Cards + compare modal                        |
| `/reference/combat`      | Accordion sections with examples             |
| `/reference/differences` | Grouped by category (notable, minor)         |

### Step 5: Global Navigation

Update `src/app/layout.tsx`:

- Add header with nav links: Calculator | Reference
- Active state styling with underline

---

## Design Specifications

### Color Coding (Tech Categories)

| Category | Color  | Tailwind        |
| -------- | ------ | --------------- |
| Military | Orange | `bg-orange-500` |
| Grid     | Green  | `bg-green-500`  |
| Nano     | Gray   | `bg-zinc-400`   |
| Rare     | Purple | `bg-purple-500` |

### Symbolic Notation Legend

```
.  = Energy Cost       z  = Energy Source
^  = Initiative        >  = Drive
*  = Hull              -  = Shield
+  = Computer          ø  = Missile damage
o  = Cannon damage
```

Colors: Yellow (1 dmg), Orange (2), Blue (3), Red (4)

### Mobile Optimization

- Horizontal scroll for wide tables
- Touch-friendly tap targets (min 44px)
- Collapsible sections for long content
- Bottom sheet for species compare

---

## File Changes Summary

**New Files (20 files):**

```
src/lib/data/
├── techs.ts
├── ship-parts.ts
├── species.ts
├── combat-rules.ts
├── differences.ts
└── index.ts

src/components/reference/
├── notation-toggle.tsx
├── tech-card.tsx
├── part-card.tsx
├── species-card.tsx
├── species-compare.tsx
├── combat-section.tsx
├── difference-item.tsx
├── reference-nav.tsx
└── category-filter.tsx

src/app/reference/
├── layout.tsx
├── page.tsx
├── techs/page.tsx
├── ship-parts/page.tsx
├── species/page.tsx
├── combat/page.tsx
└── differences/page.tsx
```

**Modified Files:**

- `src/app/layout.tsx` - Add global navigation header

---

## Critical Files to Reference

| File                                                | Purpose                          |
| --------------------------------------------------- | -------------------------------- |
| `rules/ECLIPSE_RULES.md`                            | Primary content source           |
| `rules/Eclipse Aids (Second Dawn)/Techs.html`       | Tech data + notation             |
| `rules/Eclipse Aids (Second Dawn)/Differences.html` | Edition changes                  |
| `src/lib/types/reference.ts`                        | Existing type definitions        |
| `src/components/calculator/*.tsx`                   | Pattern reference for components |
| `components.json`                                   | shadcn/ui configuration          |

---

## Implementation Order

1. **Data layer** - Extract all data into typed files
2. **Reference layout** - Navigation structure
3. **Techs page** - First page with notation toggle
4. **Ship parts page** - Reuse notation toggle
5. **Species page** - Cards + compare feature
6. **Combat page** - Accordion sections
7. **Differences page** - Simple list view
8. **Global nav** - Update root layout
9. **Polish** - Cross-linking, mobile testing

---

## Dependencies

No new packages required. Uses existing:

- shadcn/ui components (Card, Badge, Button, Dialog)
- Tailwind CSS with existing theme
- lucide-react icons

---

## Completion Summary

**Status:** ✅ Complete

**Date:** 2025-12-29

### What Was Built

1. **Data Layer** (`src/lib/data/`)
   - 39 technologies with full notation support
   - 30+ ship parts including ancient/discovery parts
   - 7 species with abilities and starting conditions
   - 10 combat rule sections with examples/tips
   - 25+ edition differences categorized

2. **Reference Components** (`src/components/reference/`)
   - Notation toggle with localStorage persistence
   - Tech/Part cards with grid and table views
   - Species cards with expandable abilities
   - Species comparison modal
   - Combat accordion sections with quick reference
   - Difference cards grouped by category
   - Filter components for categories/types/sources

3. **Reference Pages** (`src/app/reference/`)
   - Hub page with section cards
   - Technologies with category filter + search
   - Ship Parts with type/source filters + search
   - Species with compare feature
   - Combat with full/quick reference modes
   - Differences with section/table views

4. **Global Navigation**
   - New `GlobalNav` component in root layout
   - Calculator and Reference nav links
   - Updated calculator page header

### Key Features

- **Toggleable notation**: Switch between symbolic (`..**`) and descriptive ("Energy: 2, Hull: +2")
- **Search and filter**: All pages have search + category filters
- **Species comparison**: Select multiple species to compare side-by-side
- **View modes**: Grid/table toggle on techs and parts pages
- **Responsive**: Desktop sidebar, mobile horizontal tabs
- **Dark theme**: Consistent with existing calculator styling

### Files Created

- 6 data files in `src/lib/data/`
- 10 component files in `src/components/reference/`
- 7 page files in `src/app/reference/`
- 1 layout component in `src/components/layout/`

### Verification

- ✅ `bun check` passes (TypeScript + ESLint)
- ✅ `bun format` applied (Prettier)
