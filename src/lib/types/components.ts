/**
 * Component Prop Types for Eclipse Calculator
 * Centralized prop types for calculator components
 */

import type { ShipConfig, BattleResults, DiceColor } from "./combat";
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

export interface BattleResultsProps {
  results: BattleResults | null;
  isCalculating: boolean;
}

export interface VictoryChanceProps {
  side: "attacker" | "defender";
  probability: number;
  isWinner: boolean;
}

export interface SurvivalListProps {
  title: string;
  shipSurvival: Record<string, number>;
  color: "red" | "blue";
}

// ============================================================================
// Preset Manager Props
// ============================================================================

export interface PresetManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPreset: (preset: ShipConfig) => void;
}

export interface PresetItemProps {
  preset: Preset;
  onSelect: () => void;
  onDelete?: () => void;
}

// ============================================================================
// Page State Types
// ============================================================================

export interface PresetDialogState {
  open: boolean;
  side: "attacker" | "defender" | null;
  shipIndex: number | null;
}
