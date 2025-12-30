# Eclipse Combat Calculator

A web application for calculating combat outcomes in the board game _Eclipse: Second Dawn for the Galaxy_.

## Features

- Calculate victory chances in ship battles using Monte Carlo simulation (1000 iterations)
- Configure attacker and defender fleets with customizable ship attributes
- Tap-to-cycle interface optimized for mobile devices
- Save custom ship configurations as presets (stored in localStorage)
- See survival probabilities for ships in the winning fleet
- PWA support for mobile installation
- Dark mode default

## Provenance

This application was originally hosted at `eclipse-calculator.com` and created in 2014. When the original website was abandoned, the files were preserved on Amazon S3 at `https://s3.amazonaws.com/eclipse-calculator/`.

The current version was retrieved from the Wayback Machine archive on December 29, 2025, and downloaded from the S3 bucket. It has since been migrated to a modern NextJS architecture.

### Original Copyright

© 2014 Eclipse-Calculator.com

## Tech Stack

| Layer       | Technology                        |
| ----------- | --------------------------------- |
| Framework   | Next.js 16.1.1 (App Router)       |
| Language    | TypeScript (strict mode)          |
| Styling     | Tailwind CSS + shadcn/ui          |
| Database    | Convex (for future photo sharing) |
| Persistence | localStorage (presets)            |
| Deployment  | Vercel (recommended)              |

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Open in browser
open http://localhost:3000
```

## Project Structure

```
├── src/
│   ├── app/                    # NextJS App Router pages
│   │   └── page.tsx            # Combat calculator (main page)
│   ├── components/
│   │   ├── calculator/         # Calculator UI components
│   │   │   ├── ship-configurator.tsx
│   │   │   ├── fleet-builder.tsx
│   │   │   ├── battle-results.tsx
│   │   │   └── preset-manager.tsx
│   │   └── ui/                 # shadcn/ui components
│   └── lib/
│       ├── combat/
│       │   └── simulation.ts   # Combat simulation engine
│       ├── types/              # Centralized TypeScript types
│       └── presets.ts          # Preset storage utilities
├── convex/                     # Convex schema and functions
├── public/                     # Static assets and PWA manifest
├── plans/                      # Implementation plans
└── rules/                      # Eclipse game rules reference
```

## Development

```bash
bun check        # TypeScript checking
bun format       # Code formatting
bun build        # Production build
npx convex dev   # Convex development (when using database features)
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features:

- **Phase 1**: NextJS Migration (Complete)
- **Phase 2**: Quick Reference Guides
- **Phase 3**: Rule Search
- **Phase 4**: Gameplay Photo Upload
- **Phase 5**: Polish & Integration

## Modifications History

### Phase 1: NextJS Migration (2025-12-29)

Migrated the application from static HTML/JS to NextJS:

- Set up NextJS 16.1.1 with App Router and React Compiler
- Ported combat simulation engine to TypeScript (`src/lib/combat/simulation.ts`)
- Created React components for ship configuration and battle results
- Replaced cookie storage with localStorage for presets
- Added PWA manifest and mobile app icons
- Integrated Tailwind CSS and shadcn/ui for styling
- Added dark mode as default theme

### Type Centralization (2025-12-29)

Centralized TypeScript types for all phases:

- Created `src/lib/types/` with types for combat, presets, components, game entities
- Added Convex schema for Phase 4 photo storage
- Refactored existing components to use centralized types

### Second Dawn Compatibility Update (2025-12-29)

Updated combat mechanics for Second Dawn rules (in legacy code, preserved in TypeScript port):

- Changed missiles from 2 dice per module to 1 die per missile
- Added blue missiles support (all 4 colors: yellow, orange, blue, red)
- Updated missile damage values to match cannons

### Initial Setup (2025-12-29)

Downloaded and preserved the original application:

- Retrieved all assets from S3 and Wayback Machine
- Converted external URLs to local paths
- Downloaded dependencies locally (jQuery, jquery-cookie, Underscore.js)
- Added git repository

## Original Source

The original HTML/JS/CSS files from 2014 have been migrated and removed. The combat simulation logic from `js/battlestats.js` was ported to TypeScript in `src/lib/combat/simulation.ts` with full type safety and documentation.
