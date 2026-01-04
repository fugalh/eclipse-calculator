# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web-based companion app for the board game _Eclipse: Second Dawn for the Galaxy_. Built with Next.js, TypeScript, and Convex. Features include a Monte Carlo combat simulator, quick reference guides, rule search, and collaborative game photo sharing.

## Commands

```bash
bun dev              # Start development server (localhost:3000)
bun check            # Run ESLint + TypeScript type checking
bun format           # Prettier formatting
bun run build        # Production build
npx convex dev       # [OPTIONAL] Convex database (enables photos feature)
```

## Architecture

### Combat Simulation Engine (`src/lib/combat/simulation.ts`)

Monte Carlo simulator (1000 iterations) implementing Eclipse combat rules:

- **Dice System**: 4 colors with damage values (yellow=1, orange=2, blue=3, red=4)
- **Hit Detection**: `roll + computers - shields >= 6` (natural 6 always hits, natural 1 always misses)
- **Initiative Order**: Ships fire highest initiative first; defender gets +0.1 tie-breaker bonus
- **Missile Phase**: Only fires first combat round (1 die per missile)
- **Antimatter Splitter**: Converts each red die to 4 yellow dice with same roll value
- **Hit Distribution**: Prioritizes killing ships; otherwise targets by priority order:
  `Orbital > Ancient > GC > Interceptor > Starbase > Cruiser > Dreadnought > Deathmoon`

### Convex Backend (`convex/`)

| File          | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| `auth.ts`     | Password-based authentication via `@convex-dev/auth` |
| `sessions.ts` | Game session CRUD with share codes and user blocking |
| `photos.ts`   | Photo upload/storage tied to sessions                |
| `storage.ts`  | Abstraction layer for Convex Storage                 |
| `crons.ts`    | Stale session cleanup (5-day inactivity threshold)   |
| `schema.ts`   | Database schema: `gameSessions`, `gamePhotos`        |

### Key Component Directories

| Directory                    | Purpose                                     |
| ---------------------------- | ------------------------------------------- |
| `src/components/calculator/` | Combat calculator UI (ship config, results) |
| `src/components/reference/`  | Tech cards, species cards, part cards       |
| `src/components/filters/`    | URL-synced filtering with accordion UI      |
| `src/components/photos/`     | Session management and photo upload         |
| `src/components/auth/`       | Sign-in/sign-up forms, logout button        |

### Reference Data (`src/lib/data/`)

Static game data exported from barrel file `index.ts`:

- `techs.ts` - Technology tree with costs, categories, effects
- `ship-parts.ts` - Ship part stats (weapons, shields, drives)
- `species.ts` - Species abilities and starting conditions
- `combat-rules.ts` - Combat rules quick reference
- `differences.ts` - First Dawn vs Second Dawn changes

### Type System (`src/lib/types/`)

Centralized types with barrel export from `index.ts`:

- `combat.ts` - `ShipConfig`, `BattleResult`, `SimulationResult`
- `game.ts` - `Tech`, `ShipPart`, `Species`
- `filters.ts` - `FilterState`, `FilterOption`
- `convex.ts` - Re-exports from Convex generated types

### Key Patterns

- **Types First**: All types in `src/lib/types/` with barrel export
- **Client Components**: Interactive components use `"use client"` directive
- **Tap-to-Cycle UI**: Buttons cycle values 0→max for mobile optimization
- **URL-synced Filters**: `/reference/*` pages sync filter state to URL params
- **React Compiler**: Enabled in `next.config.ts` for automatic memoization
- **Path Alias**: `@/*` maps to `./src/*`

## Convex Patterns

```typescript
// Server-side (RSC or Server Actions)
import { fetchMutation, fetchQuery } from "convex/nextjs";

// Client components
import { useMutation, useQuery } from "convex/react";

// Auth context in Convex functions
const userId = await auth.getUserId(ctx);
if (!userId) throw new Error("Not authenticated");
```

## Optional Features

### Photos Feature (Requires Convex)

The collaborative photo sharing feature requires Convex configuration:

1. Run `npx convex dev` to start the Convex development server
2. This will create `.env.local` with `NEXT_PUBLIC_CONVEX_URL`
3. Restart the Next.js dev server to enable photos and authentication

**Without Convex:** The app will run normally with calculator, reference, and search features. The Photos nav item and auth pages will be hidden.

## Workflow Instructions

- After completing a plan, use an agent to find and address any issues with `bun check`; when that agent completes successfully, run `bun format`; then `bun run build`
- When a plan is completed, copy the markdown file to `./plans/` and append the completion summary to the local `{plan}.md` file

## Roadmap Status

- **Phase 1**: NextJS Foundation ✅
- **Phase 2**: Quick Reference Guides ✅ (`/reference/*` pages)
- **Phase 3**: Rule Search ✅ (`/search` with category filtering)
- **Phase 4**: Photo Upload ✅ (Convex Storage with session sharing)
- **Phase 5**: Polish & Integration (in progress)

See `ROADMAP.md` for full details. Game rules reference in `rules/ECLIPSE_RULES.md`.
