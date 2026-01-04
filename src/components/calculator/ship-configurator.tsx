"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type {
  ShipConfiguratorProps,
  NumericAttributeName,
  DiceColor,
  TargetPriority,
} from "@/lib/types";
import { cycleAttribute } from "@/lib/presets";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { GAME_ICONS, getShipIcon } from "@/lib/icons";

// ============================================================================
// Constants
// ============================================================================

const DICE_COLORS: Record<DiceColor, string> = {
  yellow:
    "bg-gradient-to-b from-[#ffe82e] to-[#ffc90d] border-[#b48e08] text-black shadow-sm",
  orange:
    "bg-gradient-to-b from-[#ff9b0d] to-[#ff730d] border-[#ae4600] text-black shadow-sm",
  blue: "bg-gradient-to-b from-[#4d4dff] to-[#0000ff] border-[#0000b3] text-white shadow-sm",
  red: "bg-gradient-to-b from-[#ff3d11] to-[#df210d] border-[#a21f01] text-white shadow-sm",
};

// Stat button background colors (from original design)
const STAT_COLORS: Record<string, string> = {
  initiative:
    "bg-gradient-to-b from-[#a7a7a7] to-[#737373] border-[#3a3a3a] text-white",
  hull: "bg-gradient-to-b from-[#a7a7a7] to-[#737373] border-[#3a3a3a] text-white",
  computers:
    "bg-gradient-to-b from-[#f0f0f0] to-[#cccccc] border-[#8b8b8b] text-black",
  shields:
    "bg-gradient-to-b from-[#252525] to-[#111111] border-black text-white",
  number:
    "bg-gradient-to-b from-[#d4d4d4] via-[#b7b7b7] to-[#8b8b8b] border-[#2e2e2e] text-white",
};

// Text fallbacks for stats without icons
const STAT_FALLBACKS: Record<string, string> = {
  initiative: "I",
  hull: "H",
  computers: "+",
  shields: "-",
  number: "×",
};

// Priority target button styles
const PRIORITY_STYLES: Record<TargetPriority, string> = {
  high: "bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400",
  normal: "bg-muted border-border text-muted-foreground",
  low: "bg-slate-500/20 border-slate-500 text-slate-600 dark:text-slate-400",
};

const PRIORITY_LABELS: Record<TargetPriority, string> = {
  high: "High",
  normal: "Normal",
  low: "Low",
};

// ============================================================================
// Sub-Components
// ============================================================================

interface AttributeButtonProps {
  name: NumericAttributeName;
  value: number;
  onClick: () => void;
  variant?: "stat" | "dice" | "missile";
  diceColor?: DiceColor;
}

function AttributeButton({
  name,
  value,
  onClick,
  variant = "stat",
  diceColor,
}: AttributeButtonProps) {
  const baseClasses = cn(
    "relative flex items-center justify-center overflow-hidden",
    "min-w-[72px] h-[72px]", // Mobile: 72x72
    "md:min-w-[80px] md:h-[80px]", // Desktop: 80x80 (matches original)
    "rounded-lg border-2 cursor-pointer select-none",
    "transition-all active:scale-95 touch-manipulation",
  );

  const getVariantClasses = () => {
    if (variant === "dice" || variant === "missile") {
      return diceColor
        ? cn(DICE_COLORS[diceColor], "border-2")
        : "bg-muted border-border";
    }
    // Use stat-specific colors
    if (name in STAT_COLORS) {
      return cn(STAT_COLORS[name], "border-2");
    }
    return "bg-muted border-border hover:bg-muted/80";
  };

  // Get icon path based on variant and color
  const getIconPath = (): string | null => {
    if (variant === "dice" && diceColor) {
      return GAME_ICONS.dice[diceColor];
    }
    if (variant === "missile" && diceColor) {
      return GAME_ICONS.missiles[diceColor];
    }
    if (variant === "stat") {
      const statName = name as keyof typeof GAME_ICONS.stats;
      return GAME_ICONS.stats[statName] ?? null;
    }
    return null;
  };

  // Get fallback text for stats without icons
  const getFallback = (): string => {
    if (variant === "stat" && name in STAT_FALLBACKS) {
      return STAT_FALLBACKS[name];
    }
    return "";
  };

  const iconPath = getIconPath();
  const fallback = getFallback();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseClasses, getVariantClasses())}
    >
      {/* Icon at top */}
      {iconPath && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-90">
          <Image
            src={iconPath}
            alt={name}
            width={64}
            height={64}
            className="w-14 h-14 md:w-16 md:h-16 object-contain"
            unoptimized
          />
        </div>
      )}
      {/* Fallback icon at top for stats without images */}
      {!iconPath && fallback && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xl md:text-2xl opacity-80 font-bold">
          {fallback}
        </span>
      )}
      {/* Value at bottom */}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-lg md:text-xl font-bold">
        {name === "number" ? `×${value}` : value}
      </span>
    </button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ShipConfigurator({
  ship,
  onChange,
  onOpenPresets,
  onReset,
  onSave,
  onRemove,
}: ShipConfiguratorProps) {
  const handleAttributeClick = (attr: NumericAttributeName) => {
    const currentValue = ship[attr] as number;
    // Pass shipClass for 'number' attribute to use class-specific limits
    const newValue = cycleAttribute(currentValue, attr, ship.shipClass);
    onChange({ ...ship, [attr]: newValue });
  };

  const handleToggle = (field: "splitter" | "missile_shield") => {
    onChange({ ...ship, [field]: !ship[field] });
  };

  const handlePriorityChange = (priority: TargetPriority) => {
    onChange({ ...ship, priorityTarget: priority });
  };

  const currentPriority = ship.priorityTarget || "normal";

  return (
    <AccordionItem
      value={ship.id}
      className="bg-card border border-border rounded-lg overflow-hidden group"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <AccordionTrigger className="flex items-center gap-2 hover:no-underline hover:opacity-80 transition-opacity p-0 border-0 text-left flex-1 [&>svg]:hidden">
          <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          <div className="w-7 h-7 md:w-9 md:h-9 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {getShipIcon(ship.shipClass) ? (
              <Image
                src={getShipIcon(ship.shipClass)!}
                alt={ship.shipClass}
                width={36}
                height={36}
                className="w-6 h-6 md:w-8 md:h-8 object-contain"
                unoptimized
              />
            ) : (
              <span className="text-xs font-medium">
                {ship.shipClass.charAt(0)}
              </span>
            )}
          </div>
          <div className="text-left min-w-0">
            <div className="text-sm font-medium truncate">{ship.name}</div>
            <div className="text-xs text-muted-foreground">
              {ship.shipClass}
            </div>
          </div>
          {/* Show count when collapsed */}
          <span className="text-sm text-muted-foreground ml-2 group-data-[state=open]:hidden">
            ×{ship.number}
          </span>
        </AccordionTrigger>
        <div className="flex items-center gap-1 shrink-0">
          {/* Actions visible when expanded */}
          <div className="hidden group-data-[state=open]:flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenPresets}
              className="text-xs text-primary hover:underline px-2 py-1"
            >
              Presets
            </button>
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onSave}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
            >
              Save
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-destructive hover:text-destructive/80 px-2 py-1"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Expandable content */}
      <AccordionContent className="px-3 pb-3 pt-0">
        <div className="space-y-3">
          {/* Row 1: Ship Info */}
          <div className="flex gap-2">
            <AttributeButton
              name="initiative"
              value={ship.initiative}
              onClick={() => handleAttributeClick("initiative")}
              variant="stat"
            />
            <AttributeButton
              name="number"
              value={ship.number}
              onClick={() => handleAttributeClick("number")}
              variant="stat"
            />
          </div>

          {/* Row 2: Combat Stats */}
          <div className="flex gap-2">
            <AttributeButton
              name="hull"
              value={ship.hull}
              onClick={() => handleAttributeClick("hull")}
              variant="stat"
            />
            <AttributeButton
              name="computers"
              value={ship.computers}
              onClick={() => handleAttributeClick("computers")}
              variant="stat"
            />
            <AttributeButton
              name="shields"
              value={ship.shields}
              onClick={() => handleAttributeClick("shields")}
              variant="stat"
            />
          </div>

          {/* Row 3: Missiles */}
          <div className="flex gap-2">
            <AttributeButton
              name="missiles_yellow"
              value={ship.missiles_yellow}
              onClick={() => handleAttributeClick("missiles_yellow")}
              variant="missile"
              diceColor="yellow"
            />
            <AttributeButton
              name="missiles_orange"
              value={ship.missiles_orange}
              onClick={() => handleAttributeClick("missiles_orange")}
              variant="missile"
              diceColor="orange"
            />
            <AttributeButton
              name="missiles_blue"
              value={ship.missiles_blue}
              onClick={() => handleAttributeClick("missiles_blue")}
              variant="missile"
              diceColor="blue"
            />
            <AttributeButton
              name="missiles_red"
              value={ship.missiles_red}
              onClick={() => handleAttributeClick("missiles_red")}
              variant="missile"
              diceColor="red"
            />
          </div>

          {/* Row 4: Cannons */}
          <div className="flex gap-2">
            <AttributeButton
              name="yellow"
              value={ship.yellow}
              onClick={() => handleAttributeClick("yellow")}
              variant="dice"
              diceColor="yellow"
            />
            <AttributeButton
              name="orange"
              value={ship.orange}
              onClick={() => handleAttributeClick("orange")}
              variant="dice"
              diceColor="orange"
            />
            <AttributeButton
              name="blue"
              value={ship.blue}
              onClick={() => handleAttributeClick("blue")}
              variant="dice"
              diceColor="blue"
            />
            <AttributeButton
              name="red"
              value={ship.red}
              onClick={() => handleAttributeClick("red")}
              variant="dice"
              diceColor="red"
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch
                checked={ship.splitter}
                onCheckedChange={() => handleToggle("splitter")}
                size="sm"
              />
              <span className="text-xs">Antimatter Splitter</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch
                checked={ship.missile_shield}
                onCheckedChange={() => handleToggle("missile_shield")}
                size="sm"
              />
              <span className="text-xs">Distortion Field</span>
            </label>
          </div>

          {/* Priority Target Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Target Priority:
            </span>
            <div className="flex gap-1">
              {(["high", "normal", "low"] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handlePriorityChange(priority)}
                  className={cn(
                    "px-2 py-1 text-xs rounded border transition-all",
                    currentPriority === priority
                      ? PRIORITY_STYLES[priority]
                      : "bg-muted/30 border-transparent text-muted-foreground/50 hover:bg-muted/50",
                  )}
                >
                  {PRIORITY_LABELS[priority]}
                </button>
              ))}
            </div>
            <span
              className="text-xs text-muted-foreground/60 ml-1"
              title="Priority Target affects how your opponent targets this ship. High priority ships are attacked first; low priority ships are attacked last."
            >
              ?
            </span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
