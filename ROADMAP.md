# Eclipse Calculator - NextJS Migration & Feature Roadmap

## Overview

Transform the Eclipse: Second Dawn combat calculator from a static HTML/JS app into a NextJS application with expanded features for game reference and photo sharing.

**Architecture Principles:**

- Server renders mostly static pages
- All calculations remain client-side (combat simulation)
- Server actions for rule search and photo upload handling
- uploadthing integration for image storage

---

## Phase 1: NextJS Foundation

**Goal:** Migrate existing functionality to NextJS while preserving all current features.

### Tasks

1. Set up NextJS project with App Router
2. Convert combat calculator to React components:
   - `ShipConfigurator` - Ship attribute editor (tap-to-cycle interface)
   - `FleetBuilder` - Attacker/Defender fleet management
   - `BattleResults` - Victory probability and survival display
   - `PresetManager` - Ship preset selection and saving
3. Extract `battlestats.js` as TypeScript utility module (pure functions)
4. Migrate from cookies to localStorage for preset persistence
5. Preserve PWA capabilities (manifest, icons)

### Key Files to Migrate

- `js/battlestats.js` → `lib/combat/simulation.ts`
- `js/ui.js` → React components in `components/calculator/`
- `css/analyzer.css` → Tailwind + CSS modules

---

## Phase 2: Quick Reference Guides

**Goal:** Static reference pages for game rules and components.

### Pages to Create

| Page                     | Content Source   | Description                                      |
| ------------------------ | ---------------- | ------------------------------------------------ |
| `/reference/techs`       | Techs.html       | Tech tree with costs, categories, effects        |
| `/reference/ship-parts`  | ECLIPSE_RULES.md | Ship part stats (weapons, shields, drives, etc.) |
| `/reference/species`     | ECLIPSE_RULES.md | Species abilities and starting conditions        |
| `/reference/combat`      | ECLIPSE_RULES.md | Combat rules quick reference                     |
| `/reference/differences` | Differences.html | New Dawn vs Second Dawn changes                  |

### Features

- Color-coded tech categories (Military, Grid, Nano, Rare)
- Symbolic notation for ship parts (as in Techs.html)
- Mobile-optimized tables
- Internal linking between related concepts

---

## Phase 3: Rule Search

**Goal:** Server-powered search returning relevant rule excerpts with context.

### Implementation

- **Server Actions** for search queries
- Parse `ECLIPSE_RULES.md` into indexed sections
- Return matching sections with surrounding context (not full rulebook)
- Support both:
  - Full-text keyword search
  - Category filters (Combat, Movement, Technologies, Species, etc.)

### Search Result Format

```
{heading}
{matched text with highlights}
[Link to full section in reference]
```

### Categories to Index

- Game Concepts (Resources, Influence, Control)
- Actions (Explore, Research, Upgrade, Build, Move, Influence)
- Combat (Initiative, Missiles, Engagement, Retreat, Reputation)
- Technologies (Military, Grid, Nano, Rare)
- Species (Terran, Eridani, Hydran, Planta, Draco, Mechanema, Orion)
- Structures (Orbitals, Monoliths, Starbases)

---

## Phase 4: Gameplay Photo Upload

**Goal:** Upload and share photos of current game state (especially tech availability).

### Primary Use Cases

1. **Personal tracking** - Save snapshots of game state for analysis
2. **Share with friends** - Generate shareable links for current game

### Implementation with uploadthing

- Image upload component for tech tray photos
- Generate shareable links
- Optional: Add annotations/notes to photos
- Storage: uploadthing handles hosting

### Suggested Flow

1. User takes photo of tech tray during game
2. Uploads via app
3. Gets shareable link to send to other players
4. Optional: Add game metadata (round number, player count)

### Future Consideration

- OCR to auto-detect available techs from photo (stretch goal)

---

## Phase 5: Polish & Integration

**Goal:** Unified navigation and enhanced UX.

### Tasks

- Global navigation between Calculator, Reference, Search, Photos
- Consistent styling across all sections
- Dark mode support
- Offline support for reference pages (service worker)
- Share buttons for battle results

---

## Technical Stack

| Layer       | Technology                                                                 |
| ----------- | -------------------------------------------------------------------------- |
| Framework   | Next.js (App Router)                                                       |
| Styling     | Tailwind CSS and shadcn/ui                                                 |
| State       | React useState/useReducer (no external state library needed)               |
| Gameplay    | Convex React library for sharing gameplay photos as unified game dashboard |
| Persistence | localStorage (presets), uploadthing (photos)                               |
| Search      | Server Actions with parsed markdown index                                  |
| Deployment  | Vercel (recommended for uploadthing integration)                           |

---

## File Structure (Proposed)

```
app/
├── page.tsx                    # Combat calculator (main)
├── reference/
│   ├── techs/page.tsx
│   ├── ship-parts/page.tsx
│   ├── species/page.tsx
│   ├── combat/page.tsx
│   └── differences/page.tsx
├── search/
│   └── page.tsx                # Rule search interface
├── photos/
│   ├── page.tsx                # Upload interface
│   └── [id]/page.tsx           # Shareable photo view
├── api/
│   └── uploadthing/            # uploadthing route handler
└── layout.tsx                  # Global nav, theme

components/
├── calculator/
│   ├── ShipConfigurator.tsx
│   ├── FleetBuilder.tsx
│   ├── BattleResults.tsx
│   └── PresetManager.tsx
├── reference/
│   └── TechTable.tsx
├── search/
│   └── RuleSearchBar.tsx
└── photos/
    └── PhotoUploader.tsx

lib/
├── combat/
│   └── simulation.ts           # Ported from battlestats.js
├── rules/
│   ├── parser.ts               # Parse ECLIPSE_RULES.md
│   └── search.ts               # Search server action
└── uploadthing.ts              # uploadthing config

content/
├── rules.md                    # ECLIPSE_RULES.md
└── reference/                  # Structured reference data
```

---

## Priority Order

1. **Phase 1** - Core migration (foundation for everything else)
2. **Phase 2** - Quick reference (high value, relatively simple)
3. **Phase 3** - Rule search (builds on Phase 2 content)
4. **Phase 4** - Photo upload (independent feature, can parallelize)
5. **Phase 5** - Polish (ongoing refinement)

---

## Notes

- Combat simulation logic in `battlestats.js` is already pure functions - straightforward TypeScript conversion
- The existing quick reference HTML files (Techs.html, Differences.html) provide good templates for data structure
- ECLIPSE_RULES.md is comprehensive (~1100 lines) and well-structured with markdown headers - good for parsing
- Consider keeping the tap-to-cycle UI pattern from original calculator - it works well on mobile
