/**
 * Component Prop Types for Eclipse Calculator
 * Centralized prop types for calculator components
 */

import type {
  ShipConfig,
  BattleResultsExtended,
  DiceColor,
  SurvivalDistribution,
} from "./combat";
import type { Preset, NumericAttributeName } from "./presets";
import type { AccordionMode } from "./settings";

// ============================================================================
// Ship Configurator Props
// ============================================================================

export interface ShipConfiguratorProps {
  ship: ShipConfig;
  onChange: (ship: ShipConfig) => void;
  onOpenPresets: () => void;
  onReset: () => void;
  onSave: () => void;
  onRemove: () => void;
}

export interface AttributeButtonProps {
  name: NumericAttributeName;
  value: number;
  onClick: () => void;
  variant?: "stat" | "dice" | "missile";
  diceColor?: DiceColor;
}

// ============================================================================
// Fleet Builder Props
// ============================================================================

export interface FleetBuilderProps {
  side: "attacker" | "defender";
  ships: ShipConfig[];
  onShipsChange: (ships: ShipConfig[]) => void;
  onOpenPresets: (shipIndex: number) => void;
  onSavePreset: (ship: ShipConfig) => void;
  accordionMode: AccordionMode;
  cascadeAnimation: boolean;
}

// ============================================================================
// Battle Results Props
// ============================================================================

/**
 * Battle results component props.
 *
 * REFACTORING NOTE: This component uses optional defenders/attackers arrays
 * for conditional rendering and sharing logic. Consider creating explicit variants:
 * - BattleResultsWithShips (includes defenders & attackers for sharing)
 * - BattleResultsOnly (results display without sharing functionality)
 *
 * Explicit variants make the component's requirements clearer and avoid
 * implicit coupling between UI rendering and data availability.
 */
export interface BattleResultsProps {
  results: BattleResultsExtended | null;
  isCalculating: boolean;
  defenders?: ShipConfig[];
  attackers?: ShipConfig[];
}

export interface VictoryChanceProps {
  side: "attacker" | "defender";
  probability: number;
  isWinner: boolean;
}

export interface SurvivalListProps {
  title: string;
  shipSurvival: Record<string, number>;
  survivalDistributions?: Record<string, SurvivalDistribution>;
  color: "red" | "blue";
}

// ============================================================================
// Preset Manager Props
// ============================================================================

export interface PresetManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPreset: (preset: ShipConfig) => void;
  onDeletePreset?: (name: string) => void;
  refreshKey?: number;
}

export interface PresetItemProps {
  preset: Preset;
  onSelect: () => void;
  onDelete?: () => void;
}

// ============================================================================
// Page State Types
// ============================================================================

/**
 * Preset dialog UI state.
 *
 * REFACTORING NOTE: This state should be lifted into a PresetDialogProvider
 * to decouple components from the specific state shape. Consider creating:
 * - PresetDialogState (this interface)
 * - PresetDialogActions (open, close, setShip handlers)
 * - PresetDialogMeta (any metadata like dialog title, etc.)
 * - PresetDialogContextValue (combines state, actions, meta)
 *
 * This would allow components to access dialog state through context
 * instead of prop drilling, following the composition patterns in the guidelines.
 */
export interface PresetDialogState {
  open: boolean;
  side: "attacker" | "defender" | null;
  shipIndex: number | null;
}
