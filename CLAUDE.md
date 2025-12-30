# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web-based combat calculator for the board game _Eclipse: Second Dawn for the Galaxy_. Built with Next.js and TypeScript, it simulates ship battles using Monte Carlo methods (1000 iterations) to compute victory probabilities and ship survival rates.

## Commands

```bash
bun dev              # Start development server (localhost:3000)
bun check            # Run ESLint + TypeScript type checking
bun format           # Prettier formatting
bun build            # Production build
npx convex dev       # Convex database development (Phase 4+)
```

## Architecture

### Combat Simulation Engine (`src/lib/combat/simulation.ts`)

The core Monte Carlo simulator implements Eclipse combat rules:

- **Dice System**: 4 colors with damage values (yellow=1, orange=2, blue=3, red=4)
- **Hit Detection**: `roll + computers - shields >= 6` (natural 6 always hits, natural 1 always misses)
- **Initiative Order**: Ships fire highest initiative first; defender gets +0.1 tie-breaker bonus
- **Missile Phase**: Only fires first combat round (1 die per missile)
- **Antimatter Splitter**: Converts each red die to 4 yellow dice with same roll value
- **Hit Distribution**: Prioritizes killing ships; otherwise targets by priority order:
  `Orbital > Ancient > GC > Interceptor > Starbase > Cruiser > Dreadnought > Deathmoon`

### Ship Model (`ShipConfig`)

```typescript
{
  name: string;
  shipClass: string;           // Cruiser, Dreadnought, etc.
  number: number;              // Count (1-6)
  yellow, orange, blue, red: number;           // Cannon dice (0-6)
  missiles_yellow/orange/blue/red: number;     // Missile dice (0-6)
  hull: number;                // HP = hull + 1
  shields: number;             // Defense (0-8)
  missile_shield: boolean;     // +2 shields vs missiles
  computers: number;           // Hit bonus (0-8)
  splitter: boolean;           // Antimatter splitter
  initiative: number;          // Combat order (0-8)
}
```

### Component Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with PWA config
│   ├── page.tsx                # Combat calculator (client component)
│   └── globals.css             # Tailwind + theme variables
├── components/
│   ├── calculator/             # Calculator UI
│   │   ├── ship-configurator.tsx   # Ship attribute editor (tap-to-cycle)
│   │   ├── fleet-builder.tsx       # Fleet management
│   │   ├── battle-results.tsx      # Results display
│   │   └── preset-manager.tsx      # Preset selection dialog
│   └── ui/                     # shadcn/ui components
└── lib/
    ├── combat/simulation.ts    # Combat engine
    ├── types/                  # Centralized TypeScript types
    └── presets.ts              # localStorage preset storage
```

### Key Patterns

- **Types First**: All types in `src/lib/types/` with barrel export from `index.ts`
- **Client Components**: Interactive components use `"use client"` directive
- **Tap-to-Cycle UI**: Buttons cycle values 0→max for mobile optimization
- **React Compiler**: Enabled in `next.config.ts` for automatic memoization
- **Path Alias**: `@/*` maps to `./src/*`

## Convex Integration

For reactive Convex in future phases:

- Server actions: `import { fetchMutation, fetchQuery } from "convex/nextjs"`
- Client components: `import { useMutation, useQuery } from "convex/react"`

## Workflow Instructions

- After completing a plan, use an agent to find and address any issues with `bun check`; when that agent completes successfully, run `bun format`
- When a plan is completed, copy the markdown file to `./plans/` and append the completion summary to the local `{plan}.md` file

## Roadmap

- **Phase 1**: NextJS Foundation ✅ (Complete)
- **Phase 2**: Quick Reference Guides (`/reference/*` pages)
- **Phase 3**: Rule Search (Server Actions + ECLIPSE_RULES.md parsing)
- **Phase 4**: Gameplay Photo Upload (uploadthing + Convex)
- **Phase 5**: Polish & Integration

See `ROADMAP.md` for full details. Game rules reference in `rules/ECLIPSE_RULES.md`.
