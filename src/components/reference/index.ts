/**
 * Reference Components Barrel Export
 * Phase 2: Quick Reference Guides
 */

// Notation
export {
  NotationProvider,
  NotationToggle,
  NotationDisplay,
  NotationLegend,
  useNotation,
} from "./notation-toggle";

// Tech Components
export { TechCard, TechGrid, TechTable, TechTableRow } from "./tech-card";

// Part Components
export { PartCard, PartGrid, PartTable, PartTableRow } from "./part-card";

// Species Components
export { SpeciesCard, SpeciesGrid } from "./species-card";
export { SpeciesCompare } from "./species-compare";

// Combat Components
export {
  CombatSectionCard,
  CombatRulesList,
  CombatQuickReference,
} from "./combat-section";

// Difference Components
export {
  DifferenceCard,
  DifferenceList,
  DifferenceSection,
  DifferenceTable,
} from "./difference-item";

// Navigation
export {
  ReferenceSidebar,
  ReferenceTabs,
  Breadcrumb,
  PageHeader,
} from "./reference-nav";

// Filters
export {
  TechCategoryFilter,
  PartTypeFilter,
  PartSourceFilter,
  SearchFilter,
} from "./category-filter";
