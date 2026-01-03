# Plan: Update README.md to Reflect NextJS Migration

## Overview

Update the README.md to document the completed Phase 1 NextJS migration and type centralization work. The current README reflects the legacy static HTML/JS application, which is now outdated.

---

## Changes Required

### 1. Update Project Description

- Change from "static HTML/JS app" to "NextJS application"
- Mention the migration from legacy code
- Keep provenance information

### 2. Update Tech Stack Section

Add new technologies:

- NextJS 16.1.1 (App Router)
- React with TypeScript
- Tailwind CSS + shadcn/ui
- Convex (for Phase 4 photo sharing)
- localStorage (replaces cookies)

### 3. Update File Structure

Replace old structure with new:

```
├── src/
│   ├── app/              # NextJS App Router pages
│   ├── components/       # React components
│   └── lib/              # Utilities and types
├── convex/               # Convex schema and functions
├── public/               # Static assets and PWA manifest
├── plans/                # Implementation plans
└── rules/                # Eclipse game rules reference
```

### 4. Update Running Instructions

Replace `open index.html` with:

```bash
bun install
bun dev          # Development server
bun build        # Production build
bun check        # TypeScript checking
bun format       # Code formatting
```

### 5. Update Modifications Section

Add:

- Phase 1 NextJS migration (2025-12-29)
  - Migrated to NextJS with App Router
  - Ported combat simulation to TypeScript
  - Created React components
  - Added PWA manifest
  - Replaced cookies with localStorage
- Type centralization (2025-12-29)
  - Centralized types in `src/lib/types/`
  - Added Convex schema for Phase 4

### 6. Add Roadmap Reference

Link to ROADMAP.md for future phases (2-5)

### 7. Remove Outdated Sections

- Remove old file structure
- Remove references to js/vendor/ dependencies
- Remove `open index.html` instructions

---

## Files to Modify

| File        | Action                                 |
| ----------- | -------------------------------------- |
| `README.md` | Rewrite to reflect NextJS architecture |

---

## Completion Summary

**Status: Completed** (2025-12-29)

### Changes Made

Updated `README.md` with:

1. **New Features section** - Highlights Monte Carlo simulation, tap-to-cycle interface, localStorage presets, PWA support, dark mode
2. **Updated Provenance** - Added note about NextJS migration
3. **Tech Stack table** - NextJS 16.1.1, TypeScript, Tailwind CSS + shadcn/ui, Convex, localStorage
4. **Getting Started** - `bun install` and `bun dev` instructions
5. **Project Structure** - New `src/`, `convex/`, `public/`, `plans/`, `rules/` layout
6. **Development commands** - `bun check`, `bun format`, `bun build`, `npx convex dev`
7. **Roadmap section** - Links to ROADMAP.md with Phase 1-5 overview
8. **Modifications History** - Timeline of all changes (Phase 1 migration, type centralization, Second Dawn update, initial setup)
9. **Original Source note** - Explains legacy files were migrated and removed
