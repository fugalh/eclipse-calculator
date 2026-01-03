# Plan: Types and Interfaces for Eclipse Calculator (Phases 2-5)

## Overview

Create a centralized type system for the Eclipse Calculator NextJS migration. Types will be organized in two locations:

- **`src/lib/types/`** - Types for NextJS server/client use
- **`convex/`** - Types needed by Convex functions (primarily for Phase 4 photo storage)

Convex types will be exported and re-exported from `src/lib/types/` for unified access.

**Scope**: Phases 1-5 type centralization, including refactoring existing Phase 1 types into the centralized system.

---

## Type Organization Strategy

### Convex Types (`convex/`)

Types that define database schema and are used by Convex functions:

- Game photo metadata
- Game session data
- Shareable link data

### NextJS Types (`src/lib/types/`)

All other application types, plus re-exports of Convex types:

- Combat simulation types (from Phase 1)
- Preset management types (from Phase 1)
- Component prop types (from Phase 1)
- Game content types (ship parts, techs, species, etc.)
- Search/reference types
- UI state types
- Re-exports from `convex/types.ts`

---

## Existing Types to Refactor (Phase 1)

Types currently scattered across the codebase that need to be centralized:

### From `src/lib/combat/simulation.ts`

| Type                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| `DiceColor`          | Union: "yellow" \| "orange" \| "blue" \| "red" |
| `ShipConfig`         | Ship attributes (weapons, defense, modifiers)  |
| `Fleet`              | Array of ships for a battle side               |
| `BattleResults`      | Win probabilities and survival rates           |
| `Dice`               | Individual die with damage value (internal)    |
| `DicePool`           | Collection of dice (internal)                  |
| `Combatant`          | Ship in combat with runtime HP (internal)      |
| `ShipGroup`          | Grouped ships with same stats (internal)       |
| `InitiativeOrder`    | Combat turn ordering (internal)                |
| `BattleStatus`       | Battle state tracking (internal)               |
| `SingleBattleResult` | Single iteration result (internal)             |

### From `src/lib/presets.ts`

| Type               | Description                                       |
| ------------------ | ------------------------------------------------- |
| `PresetType`       | Union: "generic" \| "npc" \| "player" \| "custom" |
| `Preset`           | ShipConfig extended with type field               |
| `ATTRIBUTE_LIMITS` | Const record for attribute min/max values         |

### From Component Files

| File                    | Types                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| `fleet-builder.tsx`     | `FleetBuilderProps`                                                 |
| `battle-results.tsx`    | `BattleResultsProps`, `VictoryChanceProps`, `SurvivalListProps`     |
| `ship-configurator.tsx` | `ShipConfiguratorProps`, `NumericAttribute`, `AttributeButtonProps` |
| `preset-manager.tsx`    | `PresetManagerProps`, `PresetItemProps`                             |
| `page.tsx`              | `PresetDialogState`                                                 |

---

## Files to Create

### 1. `convex/schema.ts` - Convex Database Schema

Defines the Convex tables for Phase 4 (Photo Upload):

```typescript
// Tables needed:
- gamePhotos: Photo uploads with metadata
- gameSessions: Optional grouping of photos into sessions
```

### 2. `convex/types.ts` - Shared Convex Types

Types used by both Convex functions and NextJS:

```typescript
// Photo/Session types that need to be shared
-GamePhotoMetadata - GameSession - PhotoAnnotation;
```

### 3. `src/lib/types/combat.ts` - Combat Simulation Types (Refactor from Phase 1)

Move types from `src/lib/combat/simulation.ts`:

```typescript
// Exported types
export type DiceColor = 'yellow' | 'orange' | 'blue' | 'red'

export interface ShipConfig {
  name: string
  shipClass: string
  number: number
  hull: number
  yellow: number
  orange: number
  blue: number
  red: number
  missiles_yellow: number
  missiles_orange: number
  missiles_blue: number
  missiles_red: number
  computers: number
  shields: number
  initiative: number
  splitter: boolean
  missile_shield: boolean
}

export interface Fleet {
  ships: ShipConfig[]
}

export interface BattleResults {
  attacker: number
  defender: number
  shipsAttacker: Record<string, number>
  shipsDefender: Record<string, number>
}

// Internal simulation types (keep in simulation.ts or export here)
export interface Dice { ... }
export interface DicePool { ... }
export interface Combatant extends ShipConfig { hp: number }
// ... etc
```

### 4. `src/lib/types/presets.ts` - Preset Types (Refactor from Phase 1)

Move types from `src/lib/presets.ts`:

```typescript
import type { ShipConfig } from "./combat";

export type PresetType = "generic" | "npc" | "player" | "custom";

export interface Preset extends ShipConfig {
  type: PresetType;
}

export const ATTRIBUTE_LIMITS = {
  number: [1, 8],
  hull: [0, 9],
  computers: [0, 5],
  shields: [0, 5],
  initiative: [0, 9],
  yellow: [0, 4],
  orange: [0, 4],
  blue: [0, 4],
  red: [0, 4],
  missiles_yellow: [0, 4],
  missiles_orange: [0, 4],
  missiles_blue: [0, 4],
  missiles_red: [0, 4],
} as const;
```

### 5. `src/lib/types/components.ts` - Component Prop Types (Refactor from Phase 1)

Centralize all component props:

```typescript
import type { ShipConfig, BattleResults } from "./combat";
import type { Preset } from "./presets";

// FleetBuilder props
export interface FleetBuilderProps {
  side: "attacker" | "defender";
  ships: ShipConfig[];
  onShipsChange: (ships: ShipConfig[]) => void;
  onOpenPresets: (shipIndex: number) => void;
  onSavePreset: (ship: ShipConfig) => void;
}

// BattleResults props
export interface BattleResultsProps {
  results: BattleResults | null;
  isCalculating: boolean;
}

// ShipConfigurator props
export interface ShipConfiguratorProps {
  ship: ShipConfig;
  onChange: (ship: ShipConfig) => void;
  onOpenPresets: () => void;
  onReset: () => void;
  onSave: () => void;
  onRemove: () => void;
}

// PresetManager props
export interface PresetManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPreset: (preset: Preset) => void;
}

// PresetDialogState
export interface PresetDialogState {
  open: boolean;
  side: "attacker" | "defender" | null;
  shipIndex: number | null;
}
```

### 6. `src/lib/types/index.ts` - Main Entry Point

Re-exports all types for clean imports:

```typescript
export * from "./combat";
export * from "./presets";
export * from "./components";
export * from "./game";
export * from "./reference";
export * from "./search";
export * from "./ui";
export * from "./convex";
```

### 7. `src/lib/types/game.ts` - Core Game Types

Entities from the Eclipse rulebook:

```typescript
// Enums
- DiceColor: 'yellow' | 'orange' | 'blue' | 'red'
- TechCategory: 'military' | 'grid' | 'nano' | 'rare'
- ResourceType: 'materials' | 'science' | 'money'
- ActionType: 'explore' | 'research' | 'upgrade' | 'build' | 'move' | 'influence'
- ShipType: 'interceptor' | 'cruiser' | 'dreadnought' | 'starbase'
- PartSlotType: 'cannon' | 'missile' | 'computer' | 'shield' | 'hull' | 'drive' | 'source'

// Ship Parts
- ShipPart (base interface)
- CannonPart, MissilePart, ComputerPart, ShieldPart, HullPart, DrivePart, SourcePart

// Technologies
- Technology
- TechTier

// Species
- Species
- SpeciesId
- StartingConditions
- ActionActivations

// Ships
- ShipBlueprint
- ShipInstance
```

### 8. `src/lib/types/reference.ts` - Reference Page Types

Types for Phase 2 (Quick Reference):

```typescript
// Reference data structures
- TechReference (display data for tech pages)
- ShipPartReference
- SpeciesReference
- CombatRuleReference

// Cross-linking
- ReferenceLink
- ReferenceCategory
```

### 9. `src/lib/types/search.ts` - Search System Types

Types for Phase 3 (Rule Search):

```typescript
// Search queries
-SearchQuery -
  SearchFilter -
  SearchCategory -
  // Search results
  SearchResult -
  SearchHighlight -
  SearchSection -
  // Indexing
  RuleSection -
  IndexedRule;
```

### 10. `src/lib/types/convex.ts` - Convex Re-exports

Re-export Convex types for NextJS use:

```typescript
export type {
  GamePhotoMetadata,
  GameSession,
  PhotoAnnotation,
} from "../../convex/types";
```

---

## Detailed Type Definitions

### Phase 2: Quick Reference Types

```typescript
// src/lib/types/game.ts

export type DiceColor = "yellow" | "orange" | "blue" | "red";

export const DICE_DAMAGE: Record<DiceColor, number> = {
  yellow: 1,
  orange: 2,
  blue: 3,
  red: 4,
};

export type TechCategory = "military" | "grid" | "nano" | "rare";

export type ResourceType = "materials" | "science" | "money";

export type ShipType = "interceptor" | "cruiser" | "dreadnought" | "starbase";

export type PartSlotType =
  | "cannon"
  | "missile"
  | "computer"
  | "shield"
  | "hull"
  | "drive"
  | "source";

// Base ship part interface
export interface ShipPart {
  id: string;
  name: string;
  type: PartSlotType;
  energy: number; // negative = consumes, positive = produces
  isAncient?: boolean;
  isRare?: boolean;
}

export interface CannonPart extends ShipPart {
  type: "cannon";
  diceColor: DiceColor;
  diceCount: number;
  initiativeBonus?: number;
}

export interface MissilePart extends ShipPart {
  type: "missile";
  diceColor: DiceColor;
  diceCount: number;
  initiativeBonus?: number;
}

export interface ComputerPart extends ShipPart {
  type: "computer";
  hitBonus: number;
  initiativeBonus?: number;
}

export interface ShieldPart extends ShipPart {
  type: "shield";
  shieldValue: number; // negative = reduces hit chance
  initiativeBonus?: number;
}

export interface HullPart extends ShipPart {
  type: "hull";
  hullPoints: number;
  initiativeBonus?: number;
}

export interface DrivePart extends ShipPart {
  type: "drive";
  movement: number;
  initiative: number;
}

export interface SourcePart extends ShipPart {
  type: "source";
  energyProduction: number;
  initiativeBonus?: number;
}

export type AnyShipPart =
  | CannonPart
  | MissilePart
  | ComputerPart
  | ShieldPart
  | HullPart
  | DrivePart
  | SourcePart;

// Technology
export interface Technology {
  id: string;
  name: string;
  category: TechCategory;
  scienceCost: number;
  minCost: number;
  discountValue: number;
  description: string;
  unlocksPartId?: string;
  instantEffect?: string;
  buildUnlock?: string;
  permanentAbility?: string;
}

// Species
export type SpeciesId =
  | "terran"
  | "eridani"
  | "hydran"
  | "planta"
  | "draco"
  | "mechanema"
  | "orion";

export interface ActionActivations {
  explore: number;
  research: number;
  upgrade: number;
  build: number;
  move: number;
  influence: number;
}

export interface StartingResources {
  materials: number;
  science: number;
  money: number;
}

export interface Species {
  id: SpeciesId;
  name: string;
  startingResources: StartingResources;
  startingTechs: string[]; // Tech IDs
  tradeRatio: number;
  activations: ActionActivations;
  specialAbilities: string[];
  influenceDiscs: number;
}

// Ship Blueprints
export interface ShipSlot {
  type: PartSlotType;
  partId?: string; // undefined = empty slot
}

export interface ShipBlueprint {
  shipType: ShipType;
  speciesId?: SpeciesId; // undefined = default/ancient
  slots: ShipSlot[];
  baseInitiative: number;
  buildCost: number;
  maxCount: number;
}
```

### Phase 3: Search Types

```typescript
// src/lib/types/search.ts

export type SearchCategory =
  | "game-concepts"
  | "actions"
  | "combat"
  | "technologies"
  | "species"
  | "structures"
  | "ship-parts";

export interface SearchQuery {
  query: string;
  categories?: SearchCategory[];
  limit?: number;
}

export interface SearchHighlight {
  start: number;
  end: number;
}

export interface SearchResult {
  id: string;
  heading: string;
  matchedText: string;
  highlights: SearchHighlight[];
  category: SearchCategory;
  referenceLink: string;
  relevanceScore: number;
}

export interface RuleSection {
  id: string;
  heading: string;
  content: string;
  category: SearchCategory;
  parentSection?: string;
  subsections?: string[];
}

export interface IndexedRule {
  section: RuleSection;
  searchableText: string; // normalized for search
  keywords: string[];
}
```

### Phase 4: Convex/Photo Types

```typescript
// convex/types.ts

export interface PhotoAnnotation {
  x: number;
  y: number;
  text: string;
}

export interface GamePhotoMetadata {
  uploadedAt: number; // timestamp
  gameRound?: number;
  playerCount?: number;
  notes?: string;
  annotations?: PhotoAnnotation[];
}

export interface GameSession {
  name?: string;
  createdAt: number;
  photoIds: string[];
  playerCount?: number;
}

// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  gamePhotos: defineTable({
    storageId: v.string(),
    uploadedAt: v.number(),
    gameRound: v.optional(v.number()),
    playerCount: v.optional(v.number()),
    notes: v.optional(v.string()),
    annotations: v.optional(
      v.array(
        v.object({
          x: v.number(),
          y: v.number(),
          text: v.string(),
        }),
      ),
    ),
    sessionId: v.optional(v.id("gameSessions")),
  }),
  gameSessions: defineTable({
    name: v.optional(v.string()),
    createdAt: v.number(),
    playerCount: v.optional(v.number()),
  }),
});
```

### Phase 5: UI/Navigation Types

```typescript
// src/lib/types/ui.ts

export type ThemeMode = "light" | "dark" | "system";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
}

export interface NavigationConfig {
  mainNav: NavItem[];
  mobileNav: NavItem[];
}
```

---

## Implementation Order

### Phase A: Create Type Files

1. **Create `src/lib/types/` directory**
2. **Create `src/lib/types/combat.ts`** - Move types from `simulation.ts`
3. **Create `src/lib/types/presets.ts`** - Move types from `presets.ts`
4. **Create `src/lib/types/components.ts`** - Consolidate component props
5. **Create `convex/types.ts`** - Shared types for Convex
6. **Create `convex/schema.ts`** - Database schema
7. **Create `src/lib/types/game.ts`** - Core game entities (ship parts, techs, species, blueprints)
8. **Create `src/lib/types/reference.ts`** - Reference page types
9. **Create `src/lib/types/search.ts`** - Search system types
10. **Create `src/lib/types/ui.ts`** - UI/navigation types
11. **Create `src/lib/types/convex.ts`** - Re-exports from convex
12. **Create `src/lib/types/index.ts`** - Main barrel export

### Phase B: Refactor Existing Files

13. **Update `src/lib/combat/simulation.ts`** - Import types from `@/lib/types`, remove type definitions
14. **Update `src/lib/presets.ts`** - Import types from `@/lib/types`, remove type definitions
15. **Update `src/components/calculator/ship-configurator.tsx`** - Import props from `@/lib/types`
16. **Update `src/components/calculator/fleet-builder.tsx`** - Import props from `@/lib/types`
17. **Update `src/components/calculator/battle-results.tsx`** - Import props from `@/lib/types`
18. **Update `src/components/calculator/preset-manager.tsx`** - Import props from `@/lib/types`
19. **Update `src/app/page.tsx`** - Import types from `@/lib/types`

### Phase C: Finalize

20. **Run `npx convex dev`** - Regenerate Convex types after schema creation
21. **Run `bun check`** - Verify no TypeScript errors
22. **Run `bun format`** - Format all files

---

## Critical Files

### New Type Files

| File                          | Purpose                                                  |
| ----------------------------- | -------------------------------------------------------- |
| `src/lib/types/combat.ts`     | Combat simulation types (refactored from Phase 1)        |
| `src/lib/types/presets.ts`    | Preset management types (refactored from Phase 1)        |
| `src/lib/types/components.ts` | Component prop types (refactored from Phase 1)           |
| `src/lib/types/game.ts`       | Core game types - ship parts, techs, species, blueprints |
| `src/lib/types/index.ts`      | Main barrel export                                       |
| `convex/schema.ts`            | Database schema (run `npx convex dev` after)             |
| `convex/types.ts`             | Shared Convex types for photos/sessions                  |

### Files to Refactor

| File                              | Changes                                            |
| --------------------------------- | -------------------------------------------------- |
| `src/lib/combat/simulation.ts`    | Remove type definitions, import from `@/lib/types` |
| `src/lib/presets.ts`              | Remove type definitions, import from `@/lib/types` |
| `src/components/calculator/*.tsx` | Import props from `@/lib/types`                    |
| `src/app/page.tsx`                | Import types from `@/lib/types`                    |

---

## Notes

- All types use TypeScript strict mode
- Prefer union types over enums for better tree-shaking
- Const objects for runtime values (e.g., `DICE_DAMAGE`)
- Keep Convex types minimal - only what's stored in the database
- Reference types extend game types with display-specific fields
- Species-specific blueprints are defined per species (7 species × 4 ship types)

---

## Completion Summary

**Status: Completed** (2025-12-29)

### New Type Files Created (11 total)

| File                          | Purpose                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| `src/lib/types/combat.ts`     | Combat simulation types (DiceColor, ShipConfig, Fleet, BattleResults, etc.) |
| `src/lib/types/presets.ts`    | Preset types (PresetType, Preset, ATTRIBUTE_LIMITS)                         |
| `src/lib/types/components.ts` | Component prop types (FleetBuilderProps, BattleResultsProps, etc.)          |
| `src/lib/types/game.ts`       | Core game types (Technologies, Species, Ship Blueprints)                    |
| `src/lib/types/reference.ts`  | Reference page types for Phase 2                                            |
| `src/lib/types/search.ts`     | Search system types for Phase 3                                             |
| `src/lib/types/ui.ts`         | UI/navigation types for Phase 5                                             |
| `src/lib/types/convex.ts`     | Re-exports from Convex types                                                |
| `src/lib/types/index.ts`      | Barrel export                                                               |
| `convex/types.ts`             | Shared Convex types (photos, sessions)                                      |
| `convex/schema.ts`            | Convex database schema                                                      |

### Files Refactored (7 total)

- `src/lib/combat/simulation.ts` - Now imports types from `@/lib/types`
- `src/lib/presets.ts` - Now imports types from `@/lib/types`
- `src/components/calculator/ship-configurator.tsx`
- `src/components/calculator/fleet-builder.tsx`
- `src/components/calculator/battle-results.tsx`
- `src/components/calculator/preset-manager.tsx`
- `src/app/page.tsx`

### Verification

- `npx convex dev --once` - Convex schema deployed successfully
- `bun check` - TypeScript check passes (only 1 unrelated warning about `<img>`)
- `bun format` - All files formatted
