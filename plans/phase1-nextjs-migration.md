# Phase 1: NextJS Migration Plan

## Overview

Migrate the Eclipse Calculator from static HTML/JS to NextJS while preserving all functionality. The foundation (NextJS, Tailwind, shadcn/ui) is already configured.

---

## 1. Combat Simulation Engine (TypeScript)

**File:** `src/lib/combat/simulation.ts`

Port `js/battlestats.js` to TypeScript with proper types:

### Types to define:

```typescript
interface ShipConfig {
  name: string;
  shipClass: string;
  number: number;
  hull: number;
  yellow: number;
  orange: number;
  blue: number;
  red: number;
  missiles_yellow: number;
  missiles_orange: number;
  missiles_blue: number;
  missiles_red: number;
  computers: number;
  shields: number;
  initiative: number;
  splitter: boolean;
  missile_shield: boolean;
}

interface Fleet {
  ships: ShipConfig[];
}

interface BattleResults {
  attacker: number; // Win probability 0-1
  defender: number;
  shipsAttacker: Record<string, number>; // Survival rates
  shipsDefender: Record<string, number>;
}
```

### Functions to port:

- `Dice` class - dice creation with damage values
- `checkHit()` - hit detection logic
- `DicePool()` - generate dice for ship group
- `splitAntimatter()` - Antimatter Splitter conversion
- `distributeHits()` - AI hit distribution algorithm
- `combatRound()` - resolve missile/cannon phases
- `resolveBattle()` - full battle simulation
- `calculate()` - Monte Carlo runner (1000 iterations)

---

## 2. React Components

### 2.1 ShipConfigurator

**File:** `src/components/calculator/ship-configurator.tsx`

The tap-to-cycle ship attribute editor.

**Features:**

- 14 attribute buttons arranged in 3 rows:
  - Row 1: initiative, hull, computers, shields, number
  - Row 2: missiles (yellow, orange, blue, red)
  - Row 3: cannons (yellow, orange, blue, red)
- Two toggle switches: Antimatter Splitter, Distortion Field
- Ship name display with class icon
- Action buttons: Presets, Reset, Save, Remove

**UI approach:**

- Use shadcn Button primitives for attribute buttons
- Custom styling for colored dice buttons (yellow/orange/blue/red gradients)
- Use shadcn Switch or custom toggle for splitter/missile_shield

### 2.2 FleetBuilder

**File:** `src/components/calculator/fleet-builder.tsx`

Manages a fleet (attacker or defender).

**Features:**

- Section header with side indicator (attacker/defender)
- "Add ship class" button
- List of ShipConfigurator components
- Fleet state management (add/remove ships)

**Props:**

```typescript
interface FleetBuilderProps {
  side: "attacker" | "defender";
  ships: ShipConfig[];
  onShipsChange: (ships: ShipConfig[]) => void;
  onOpenPresets: (shipIndex: number) => void;
}
```

### 2.3 BattleResults

**File:** `src/components/calculator/battle-results.tsx`

Displays victory probability and survival rates.

**Features:**

- Victory percentage for attacker vs defender
- Winner highlight
- Survival rates table for winning fleet's ships
- Empty state when no results

**Props:**

```typescript
interface BattleResultsProps {
  results: BattleResults | null;
  isCalculating: boolean;
}
```

### 2.4 PresetManager

**File:** `src/components/calculator/preset-manager.tsx`

Modal for selecting/saving ship presets.

**Features:**

- List of default presets (9 built-in ships)
- List of custom presets (user-saved)
- Click to apply preset
- Save current ship as new preset
- Delete custom presets

**UI approach:**

- Use shadcn Dialog for modal
- Use shadcn Card for preset items
- Category badges for preset types (NPC, Player, Generic)

---

## 3. Main Calculator Page

**File:** `src/app/page.tsx`

Wire everything together:

```tsx
export default function CalculatorPage() {
  // State
  const [attackerFleet, setAttackerFleet] = useState<ShipConfig[]>([]);
  const [defenderFleet, setDefenderFleet] = useState<ShipConfig[]>([]);
  const [results, setResults] = useState<BattleResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate handler
  const handleCalculate = () => {
    setIsCalculating(true);
    const results = calculate(
      { ships: defenderFleet },
      { ships: attackerFleet },
      1000
    );
    setResults(results);
    setIsCalculating(false);
  };

  return (
    <main>
      <FleetBuilder side="defender" ... />
      <FleetBuilder side="attacker" ... />
      <Button onClick={handleCalculate}>Calculate</Button>
      <BattleResults results={results} />
    </main>
  );
}
```

---

## 4. Preset Persistence (localStorage)

**File:** `src/lib/presets.ts`

### Default presets (hardcoded):

1. Generic ship (empty Cruiser)
2. Galactic Center (4 yellow, 1 computer, 7 hull)
3. Ancient (2 yellow, 1 computer, 1 hull, 2 init)
4. Interceptor (1 yellow, 3 init)
5. Cruiser (1 yellow, 1 computer, 1 hull, 2 init)
6. Dreadnought (2 yellow, 1 computer, 2 hull, 1 init)
7. Starbase (1 yellow, 1 computer, 2 hull, 4 init)
8. Orbital (2 yellow, 3 hull)
9. Deathmoon (1 red, 1 computer, 4 hull, 1 init)

### Storage functions:

```typescript
export function getCustomPresets(): ShipConfig[];
export function saveCustomPreset(preset: ShipConfig): void;
export function deleteCustomPreset(name: string): void;
export function getAllPresets(): ShipConfig[];
```

---

## 5. PWA Capabilities

**Files to create/update:**

- `public/manifest.json` - PWA manifest
- `src/app/layout.tsx` - Add manifest link and meta tags
- Copy icons from `images/` to `public/icons/`

**Manifest contents:**

- App name: "Eclipse Calculator"
- Theme color matching the dark UI
- Display: standalone
- Icons: 192x192 and 512x512

---

## 6. Styling Approach

Use shadcn/ui default theming with dark mode as default, light mode toggle available.

### Theme Setup:

- Use shadcn's built-in dark/light mode CSS variables
- Default to dark mode via `<html class="dark">`
- Add theme toggle in layout header (use `next-themes` if needed)

### Dice Buttons:

Extend shadcn Button with custom color variants:

```tsx
// In button.tsx variants or custom dice-button component
const diceVariants = {
  yellow:
    "bg-gradient-to-b from-[#ffe82e] to-[#ffc90d] border-[#b48e08] text-black",
  orange:
    "bg-gradient-to-b from-[#ff9b0d] to-[#ff730d] border-[#ae4600] text-black",
  blue: "bg-gradient-to-b from-[#4d4dff] to-[#0000ff] border-[#0000b3] text-white",
  red: "bg-gradient-to-b from-[#ff3d11] to-[#df210d] border-[#a21f01] text-white",
};
```

### Ship Icons:

- Copy icon images to `public/icons/ships/`
- Use CSS background-image for ship class indicators

---

## 7. Additional Dependencies

Install these packages:

```bash
bun add next-themes  # Theme toggle support
```

Install additional shadcn components:

```bash
bunx shadcn@latest add dialog switch
```

---

## Implementation Order

1. **simulation.ts** - Port combat engine first (can test independently)
2. **presets.ts** - Preset storage utilities
3. **ShipConfigurator** - Core UI component
4. **FleetBuilder** - Container for ships
5. **BattleResults** - Results display
6. **PresetManager** - Modal for presets
7. **page.tsx** - Wire everything together
8. **PWA manifest** - Add manifest and icons
9. **Testing and polish** - Verify calculations match original

---

## Critical Files to Reference

- `js/battlestats.js` - Combat simulation logic
- `js/ui.js` - UI logic and presets
- `index.html` - HTML structure
- `css/analyzer.css` - Styling patterns
- `images/icons/` - Ship and dice icons

---

## Verification

After implementation, verify:

1. Combat calculations match original (compare results for same inputs)
2. Tap-to-cycle works on mobile
3. Presets save/load correctly
4. PWA installs on mobile devices
5. Run `bun check` and `bun format` to ensure code quality

---

## Completion Summary

**Completed: 2025-12-29**

### Files Created

| File                                              | Description                                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| `src/lib/combat/simulation.ts`                    | Full TypeScript port of combat simulation engine with all types and functions |
| `src/lib/presets.ts`                              | Preset storage utilities with 9 default presets and localStorage persistence  |
| `src/components/calculator/ship-configurator.tsx` | Tap-to-cycle ship attribute editor with 3 rows and toggles                    |
| `src/components/calculator/fleet-builder.tsx`     | Fleet management component with add/remove ships                              |
| `src/components/calculator/battle-results.tsx`    | Victory percentages and survival rates display                                |
| `src/components/calculator/preset-manager.tsx`    | Dialog for selecting/managing ship presets                                    |
| `src/app/page.tsx`                                | Main calculator page wiring all components together                           |
| `public/manifest.json`                            | PWA manifest with app metadata                                                |
| `public/icons/android.png`                        | Android app icon (copied from images/appicons)                                |
| `public/icons/ios.png`                            | iOS app icon (copied from images/appicons)                                    |

### Files Modified

| File                 | Changes                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `src/app/layout.tsx` | Added metadata, viewport config, manifest link, apple-touch-icon |
| `eslint.config.mjs`  | Added `js/**` to global ignores for legacy files                 |

### Dependencies Added

- `next-themes@0.4.6` - Theme toggle support
- `@radix-ui/react-dialog` - Dialog component (via shadcn)
- `@radix-ui/react-switch` - Switch component (via shadcn)

### Code Quality

- `bun check`: 0 errors, 1 warning (pre-existing in component-example.tsx)
- `bun format`: Applied to all files
- `bun run build`: Successful production build

### What's Working

1. Combat simulation engine ported with full TypeScript types
2. Monte Carlo simulation (1000 iterations) calculates win probabilities
3. Ship configurator with tap-to-cycle attributes
4. Colored dice buttons (yellow/orange/blue/red gradients)
5. Antimatter Splitter and Distortion Field toggles
6. Fleet builder with add/remove ships
7. Preset manager dialog with default and custom presets
8. localStorage persistence for custom presets
9. PWA manifest for mobile installation
10. Dark mode as default

### Remaining for Future Phases

- Theme toggle (light/dark mode switch)
- Ship class icons (currently showing first letter)
- Mobile tap optimization testing
- Comparison testing with original calculator
- Service worker for offline support
