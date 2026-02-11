/**
 * Type Exports for Eclipse Calculator
 * Central barrel export for all application types
 *
 * NOTE: This barrel file is acceptable for type-only exports.
 * However, prefer importing directly from source files when possible:
 * - PREFERRED: import type { ShipConfig } from '@/lib/types/combat'
 * - ACCEPTABLE: import type { ShipConfig } from '@/lib/types'
 *
 * Direct imports provide better tree-shaking and faster builds,
 * especially in large codebases with many type files.
 */

// Combat simulation types (Phase 1)
export * from "./combat";

// Preset types (Phase 1)
export * from "./presets";

// Component prop types (Phase 1)
export * from "./components";

// Core game types (Phases 2-5)
export * from "./game";

// Reference page types (Phase 2)
export * from "./reference";

// Search system types (Phase 3)
export * from "./search";

// Filter system types (Phase 3)
export * from "./filters";

// UI/navigation types (Phase 5)
export * from "./ui";

// Convex re-exports (Phase 4)
export * from "./convex";

// User settings types
export * from "./settings";
