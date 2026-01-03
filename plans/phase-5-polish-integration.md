# Phase 5: Polish & Integration - Implementation Plan

## Overview

Complete the final phase of the Eclipse Calculator roadmap: theme toggle, offline support, and battle results sharing.

## Current State

| Feature           | Status      | Notes                                     |
| ----------------- | ----------- | ----------------------------------------- |
| Global Navigation | ✅ Complete | All 5 sections linked, active states work |
| Dark Mode Styling | ✅ Complete | Full light/dark CSS variables defined     |
| Theme Toggle      | ❌ Missing  | `next-themes` installed but not used      |
| Service Worker    | ❌ Missing  | No offline support                        |
| Share Results     | ❌ Missing  | Calculator has no share functionality     |

---

## Task 1: Theme Toggle

**Goal:** Add dark/light/system theme switching, defaulting to dark

### Files to Modify

| File                                   | Change                                                     |
| -------------------------------------- | ---------------------------------------------------------- |
| `src/app/layout.tsx`                   | Wrap app in `ThemeProvider`, remove hardcoded `dark` class |
| `src/components/layout/global-nav.tsx` | Add theme toggle button in header                          |
| `src/components/ui/theme-toggle.tsx`   | **Create** - Theme switcher dropdown                       |

### Implementation

1. **Create theme toggle component** (`src/components/ui/theme-toggle.tsx`):
   - Dropdown with Sun/Moon/Monitor icons
   - Options: Light, Dark, System
   - Uses `useTheme()` from next-themes

2. **Update layout.tsx**:

   ```tsx
   import { ThemeProvider } from "next-themes";

   // In body, remove className="dark", wrap children:
   <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
     {children}
   </ThemeProvider>;
   ```

3. **Update global-nav.tsx**:
   - Add `<ThemeToggle />` component before logout button
   - Use `suppressHydrationWarning` on html element in layout

---

## Task 2: Offline Support (Service Worker)

**Goal:** Full app offline capability using Serwist (modern next-pwa successor)

### Files to Modify/Create

| File                  | Change                                                    |
| --------------------- | --------------------------------------------------------- |
| `package.json`        | Add `@serwist/next` dependency                            |
| `next.config.ts`      | Add Serwist plugin configuration                          |
| `src/app/sw.ts`       | **Create** - Service worker entry point                   |
| `src/app/manifest.ts` | **Create** - Dynamic manifest (optional, can keep static) |

### Implementation

1. **Install Serwist**:

   ```bash
   bun add @serwist/next @serwist/precaching @serwist/strategies
   ```

2. **Create service worker** (`src/app/sw.ts`):
   - Precache app shell and static assets
   - CacheFirst for fonts, images
   - StaleWhileRevalidate for pages
   - NetworkFirst for Convex API calls

3. **Update next.config.ts**:

   ```ts
   import withSerwist from "@serwist/next";

   export default withSerwist({
     swSrc: "src/app/sw.ts",
     swDest: "public/sw.js",
     reloadOnOnline: true,
     disable: process.env.NODE_ENV === "development",
   })(nextConfig);
   ```

4. **Caching strategy**:
   - **Precache**: All reference data files, calculator page
   - **Runtime cache**:
     - `/reference/*` pages - StaleWhileRevalidate
     - `/photos/*` pages - NetworkFirst (needs auth)
     - Static assets - CacheFirst with max-age

---

## Task 3: Battle Results Sharing

**Goal:** Share calculator results via URL, Web Share API, and text export

### Files to Modify/Create

| File                                           | Change                                      |
| ---------------------------------------------- | ------------------------------------------- |
| `src/lib/share.ts`                             | **Create** - Share utilities                |
| `src/components/calculator/share-results.tsx`  | **Create** - Share dropdown component       |
| `src/components/calculator/battle-results.tsx` | Add share button to results display         |
| `src/app/page.tsx`                             | Handle URL params for shared battle configs |

### Implementation

1. **Create share utilities** (`src/lib/share.ts`):

   ```ts
   // Encode battle config to URL-safe string
   export function encodeBattleConfig(
     defenders: ShipConfig[],
     attackers: ShipConfig[],
   ): string;

   // Decode battle config from URL param
   export function decodeBattleConfig(encoded: string): {
     defenders: ShipConfig[];
     attackers: ShipConfig[];
   } | null;

   // Format results as shareable text
   export function formatResultsAsText(
     results: BattleResults,
     defenders: ShipConfig[],
     attackers: ShipConfig[],
   ): string;
   ```

2. **Create share component** (`src/components/calculator/share-results.tsx`):
   - DropdownMenu with three options:
     - Copy Link (clipboard icon) - copies shareable URL
     - Share (share icon) - Web Share API with fallback
     - Copy as Text (file-text icon) - formatted results
   - Show toast/copied state feedback
   - Detect Web Share API availability

3. **URL encoding strategy**:
   - Compress fleet configs to minimal JSON
   - Base64 encode for URL safety
   - Example: `/?battle=eyJkIjpbey4uLn1dLCJhIjpbey4uLn1dfQ`
   - Keep URL reasonably short (< 2000 chars)

4. **Update calculator page**:
   - Read `battle` URL param on mount
   - Decode and populate fleets if present
   - Auto-calculate when loading shared battle

5. **Text export format**:

   ```
   Eclipse Combat Results
   ─────────────────────
   Defender: 2x Cruiser, 1x Starbase
   Attacker: 3x Interceptor

   Winner: Attacker (67.3%)

   Defender Survivors:
   • Cruiser: 0.4 avg (0-2)
   • Starbase: 0.1 avg (0-1)

   Attacker Survivors:
   • Interceptor: 1.8 avg (0-3)
   ```

---

## Execution Order

1. **Theme Toggle** (simplest, enables testing in both modes)
2. **Battle Results Sharing** (independent feature)
3. **Service Worker** (test last, can affect development)

---

## Critical Files Summary

```
src/
├── app/
│   ├── layout.tsx          # Add ThemeProvider
│   ├── page.tsx            # Handle shared battle URL params
│   └── sw.ts               # NEW: Service worker
├── components/
│   ├── layout/
│   │   └── global-nav.tsx  # Add theme toggle
│   ├── calculator/
│   │   ├── battle-results.tsx  # Add share button
│   │   └── share-results.tsx   # NEW: Share dropdown
│   └── ui/
│       └── theme-toggle.tsx    # NEW: Theme switcher
├── lib/
│   └── share.ts            # NEW: Share utilities
next.config.ts              # Add Serwist PWA config
package.json                # Add @serwist/* dependencies
```

---

## Testing Checklist

- [x] Theme toggle persists across page refreshes
- [x] Theme respects system preference when set to "System"
- [x] Shared battle URLs load correct fleet configurations
- [x] Web Share API works on mobile Safari/Chrome
- [x] Copied text format is readable and complete
- [x] App works offline after initial load
- [x] Reference pages display cached content offline
- [x] Calculator functions fully offline

---

## Completion Summary

**Completed: 2024-12-30**

### Features Implemented

#### 1. Theme Toggle

- Created `src/components/ui/theme-toggle.tsx` - Dropdown with Light/Dark/System options using lucide-react icons
- Updated `src/app/layout.tsx` - Added `ThemeProvider` from next-themes with `defaultTheme="dark"` and `enableSystem`
- Updated `src/components/layout/global-nav.tsx` - Added theme toggle button in header before logout

#### 2. Battle Results Sharing

- Created `src/lib/share.ts` with:
  - `encodeBattleConfig()` / `decodeBattleConfig()` - Base64url encoding of compressed fleet configs
  - `generateShareUrl()` - Creates shareable URLs with `?battle=` parameter
  - `formatResultsAsText()` - Human-readable text export format
  - `canUseWebShare()` / `shareViaWebShare()` - Web Share API integration
  - `copyToClipboard()` - Clipboard API wrapper
- Created `src/components/calculator/share-results.tsx` - Share dropdown with three options:
  - Copy Link - Copies shareable URL to clipboard
  - Share... - Native share dialog (on supported devices)
  - Copy as Text - Formatted results for pasting
- Updated `src/components/calculator/battle-results.tsx` - Added share button when results are displayed
- Updated `src/app/page.tsx` - Handles `?battle=` URL param to load and auto-calculate shared battles

#### 3. Offline Support (PWA)

- Installed `@serwist/next` and `serwist` packages
- Created `src/app/sw.ts` - Service worker with Serwist default caching strategies
- Created `src/app/offline/page.tsx` - Fallback page for offline navigation
- Updated `next.config.ts` - Integrated Serwist plugin (disabled in development)
- Renamed `public/manifest.json` to `public/manifest.webmanifest`

### Files Created

| File                                          | Purpose                                    |
| --------------------------------------------- | ------------------------------------------ |
| `src/components/ui/theme-toggle.tsx`          | Theme switcher dropdown component          |
| `src/components/calculator/share-results.tsx` | Share dropdown for battle results          |
| `src/lib/share.ts`                            | URL encoding, text export, share utilities |
| `src/app/sw.ts`                               | Serwist service worker                     |
| `src/app/offline/page.tsx`                    | Offline fallback page                      |

### Files Modified

| File                                           | Changes                                               |
| ---------------------------------------------- | ----------------------------------------------------- |
| `src/app/layout.tsx`                           | Added ThemeProvider, updated manifest path            |
| `src/app/page.tsx`                             | Added URL param handling, pass fleet data to results  |
| `src/components/layout/global-nav.tsx`         | Added ThemeToggle component                           |
| `src/components/calculator/battle-results.tsx` | Added ShareResults component                          |
| `src/lib/types/components.ts`                  | Added defenders/attackers props to BattleResultsProps |
| `next.config.ts`                               | Added Serwist PWA configuration                       |
| `public/manifest.webmanifest`                  | Renamed from manifest.json                            |

### Dependencies Added

- `@serwist/next@9.4.2`
- `serwist@9.4.2`
