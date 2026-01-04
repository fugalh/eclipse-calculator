# PWA Install Prompts for Eclipse Calculator

## Overview

Add PWA installation prompts to Eclipse Calculator, adapted from the Read-by-EAR library implementation. This includes platform-detection, install cards, toast notifications, and detailed platform-specific installation tutorials with Eclipse-branded mockups.

## Dependencies to Install

- `sonner` - Toast notification library (required for install-toast.tsx)
- `Sheet` component from shadcn/ui (required for install-tutorial-sheet.tsx)

## Files to Create

### 1. Core Hook: `src/lib/hooks/use-pwa-install.ts`

Copy from source with no modifications needed - handles:

- Platform detection (iOS, Android, Chrome Desktop, other)
- Installation status detection (`display-mode: standalone`)
- 10-day dismissal cooldown via localStorage
- Session tracking for card display
- `beforeinstallprompt` event capture for native prompts

### 2. PWA Components: `src/components/pwa/`

#### `install-toast.tsx`

- Adapt toast messages for Eclipse Calculator context
- Messages: "Add Eclipse Calculator to your home screen", etc.
- Keep scroll-dismiss behavior and delayed display

#### `install-card.tsx`

- Copy from source with Eclipse-specific messaging
- Update titles/descriptions for Eclipse context
- No structural changes needed

#### `install-prompt-provider.tsx`

- **Key adaptation**: Replace `@legendapp/state` reading tracking with Eclipse-specific triggers
- Implement configurable trigger system supporting:
  1. **Immediate**: Show on first visit
  2. **After use**: Show after running combat simulation (track via localStorage)
  3. **After visits**: Show after 2-3 visits (track visit count in localStorage)
- Provider wraps the app and manages all PWA state

#### `install-tutorial-sheet.tsx`

- **Major adaptation**: Create Eclipse Calculator mockups
- Update all mockup components:
  - `IOSBrowserMockup` - Show Eclipse Calculator URL and content preview
  - `IOSMenuMockup` - Same menu items, keep structure
  - `IOSShareSheetMockup` - Generic share sheet (reuse most)
  - `IOSAddScreenMockup` - Show Eclipse app icon and name
  - `AndroidBrowserMockup` - Eclipse URL bar
  - `AndroidMenuMockup` - Keep menu structure
  - `AndroidInstallMockup` - Eclipse app icon and name
  - `DesktopURLBarMockup` - Eclipse URL
- Update sheet title: "Install Eclipse Calculator"

#### `index.ts`

- Barrel export for all PWA components

### 3. Integration Points

#### `src/app/layout.tsx`

- Add `<Toaster />` from sonner for toast support
- Wrap app content with `<InstallPromptProvider>`

#### Trigger Logic (in provider)

```typescript
// Track engagement in localStorage
const SIMULATION_RUN_KEY = "eclipse-simulation-run";
const VISIT_COUNT_KEY = "eclipse-visit-count";

// Trigger conditions (any of):
// 1. First visit (immediate)
// 2. Has run a simulation
// 3. Visit count >= 3
```

#### Combat Simulation Integration

- Add call to mark simulation run in `src/app/page.tsx` line ~92 (`handleCalculate`)
- Add `markSimulationRun()` call after successful calculation to track engagement

## UI Placement

- **Install Card**: Show below GlobalNav or in a prominent location on home page
- **Toast**: Standard sonner positioning (typically bottom-right or top-center)
- **Tutorial Sheet**: Bottom sheet overlay (default shadcn Sheet behavior)

## Implementation Order

1. Install dependencies (`bun add sonner`, `bunx shadcn@latest add sheet`)
2. Create `src/lib/hooks/use-pwa-install.ts`
3. Create `src/components/pwa/install-toast.tsx`
4. Create `src/components/pwa/install-card.tsx`
5. Create `src/components/pwa/install-tutorial-sheet.tsx` with Eclipse mockups
6. Create `src/components/pwa/install-prompt-provider.tsx` with trigger logic
7. Create `src/components/pwa/index.ts` barrel export
8. Update `src/app/layout.tsx` to integrate provider and toaster
9. Add simulation tracking to calculator component
10. Run `bun check` and `bun format`

## Key Files to Modify

- `src/app/layout.tsx` - Add provider wrapper and Toaster
- `src/components/calculator/` - Add simulation tracking call (need to identify exact file)
- `package.json` - New dependencies added via bun

## Mockup Content Adaptations

### iOS Browser Mockup Content

```
URL: eclipse-calc.app (or your domain)
Content preview:
- "ECLIPSE CALCULATOR"
- "Combat Simulator for Second Dawn"
```

### iOS Add Screen Mockup

```
App icon: /icons/ios.png
Name: Eclipse Calc
URL: eclipse-calc.app
```

### Android Install Mockup

```
App icon: /icons/android.png
Name: Eclipse Combat Calculator
URL: eclipse-calc.app
```

---

## Completion Summary

**Status:** ✅ Complete

**Date:** 2025-12-30

### Files Created

| File                                             | Purpose                                                                            |
| ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `src/lib/hooks/use-pwa-install.ts`               | Core PWA hook with platform detection, installation status, and dismissal tracking |
| `src/components/pwa/install-toast.tsx`           | Scroll-dismissible toast notification with install/learn-how actions               |
| `src/components/pwa/install-card.tsx`            | Dismissible card UI with platform-specific messaging                               |
| `src/components/pwa/install-tutorial-sheet.tsx`  | Platform-specific install tutorials with Eclipse-branded mockups                   |
| `src/components/pwa/install-prompt-provider.tsx` | Context provider managing all PWA state and triggers                               |
| `src/components/pwa/index.ts`                    | Barrel export for PWA components                                                   |
| `src/components/ui/sheet.tsx`                    | shadcn Sheet component (added via CLI)                                             |

### Files Modified

| File                 | Changes                                                               |
| -------------------- | --------------------------------------------------------------------- |
| `src/app/layout.tsx` | Added `Toaster` from sonner, wrapped app with `InstallPromptProvider` |
| `src/app/page.tsx`   | Added `markSimulationRun()` call after combat simulation completes    |
| `package.json`       | Added `sonner` dependency                                             |

### Features Implemented

- **Platform Detection**: iOS, Android, Chrome Desktop, and fallback for other browsers
- **Three Trigger Conditions**: Immediate (first visit), after running simulation, or after 3+ visits
- **Smart Dismissal**: 10-day cooldown after explicit dismissal, session-based card display
- **Native Install Prompt**: Captures `beforeinstallprompt` event on supported browsers
- **Tutorial Sheets**: Step-by-step installation guides with Eclipse-branded mockups for iOS, Android, and Desktop Chrome
- **Toast Notifications**: Auto-dismiss on scroll (>50px) with install/learn-how action buttons

### Dependencies Added

- `sonner@2.0.7` - Toast notification library
- `@radix-ui/react-dialog` - Sheet component dependency (via shadcn)

### Notes

- The `install-prompt-provider.tsx` was refactored to use a lazy initializer pattern instead of `useEffect` for setting initial engagement state (React best practice)
- All mockups use `eclipse-calc.vercel.app` as the placeholder URL
- The install card component is exported but not currently rendered in a specific location - it can be added to the home page if desired
