"use client";

import { useState, useCallback } from "react";
import type {
  ShipConfig,
  BattleResults,
  PresetDialogState,
  AccordionMode,
} from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";
import { calculate, generateShipId } from "@/lib/combat/simulation";
import { findPresetByName, saveCustomPreset } from "@/lib/presets";
import { getSettings, updateSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FleetBuilder } from "@/components/calculator/fleet-builder";
import { BattleResults as BattleResultsComponent } from "@/components/calculator/battle-results";
import { PresetManager } from "@/components/calculator/preset-manager";
import { Switch } from "@/components/ui/switch";
import { Swords, Settings } from "lucide-react";

// ============================================================================
// Main Page Component
// ============================================================================

export default function CalculatorPage() {
  // Fleet state
  const [defenderFleet, setDefenderFleet] = useState<ShipConfig[]>(() => {
    const ancient = findPresetByName("Ancient");
    return ancient ? [{ ...ancient, id: generateShipId(), number: 1 }] : [];
  });
  const [attackerFleet, setAttackerFleet] = useState<ShipConfig[]>(() => {
    const cruiser = findPresetByName("Cruiser");
    return cruiser ? [{ ...cruiser, id: generateShipId(), number: 1 }] : [];
  });

  // Results state
  const [results, setResults] = useState<BattleResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Preset dialog state
  const [presetDialog, setPresetDialog] = useState<PresetDialogState>({
    open: false,
    side: null,
    shipIndex: null,
  });

  // Settings state - initialize from localStorage
  const [accordionMode, setAccordionMode] = useState<AccordionMode>(() => {
    // Only access localStorage on client
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS.accordionMode;
    }
    return getSettings().accordionMode;
  });

  const [cascadeAnimation, setCascadeAnimation] = useState<boolean>(() => {
    // Only access localStorage on client
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS.cascadeAnimation;
    }
    return getSettings().cascadeAnimation;
  });

  // Handle accordion mode change
  const handleAccordionModeChange = (value: string) => {
    const mode = value as AccordionMode;
    setAccordionMode(mode);
    updateSettings({ accordionMode: mode });
  };

  // Handle cascade animation toggle
  const handleCascadeAnimationChange = (checked: boolean) => {
    setCascadeAnimation(checked);
    updateSettings({ cascadeAnimation: checked });
  };

  // Handlers
  const handleCalculate = useCallback(() => {
    if (defenderFleet.length === 0 || attackerFleet.length === 0) {
      return;
    }

    setIsCalculating(true);

    // Use setTimeout to allow UI to update before heavy calculation
    setTimeout(() => {
      const battleResults = calculate(
        { ships: defenderFleet },
        { ships: attackerFleet },
        1000,
      );
      setResults(battleResults);
      setIsCalculating(false);
    }, 10);
  }, [defenderFleet, attackerFleet]);

  const handleOpenPresets = (
    side: "attacker" | "defender",
    shipIndex: number,
  ) => {
    setPresetDialog({ open: true, side, shipIndex });
  };

  const handleSelectPreset = (preset: ShipConfig) => {
    if (presetDialog.side === null || presetDialog.shipIndex === null) {
      return;
    }

    const fleet =
      presetDialog.side === "attacker" ? attackerFleet : defenderFleet;
    const setFleet =
      presetDialog.side === "attacker" ? setAttackerFleet : setDefenderFleet;

    const newFleet = [...fleet];
    const currentShip = newFleet[presetDialog.shipIndex];
    const currentId = currentShip?.id || generateShipId();
    const currentNumber = currentShip?.number || 1;
    newFleet[presetDialog.shipIndex] = {
      ...preset,
      id: currentId,
      number: currentNumber,
    };
    setFleet(newFleet);

    // Clear results when configuration changes
    setResults(null);
  };

  const handleSavePreset = (ship: ShipConfig) => {
    const name = window.prompt(
      "Name your preset:",
      `Ship ${Math.ceil(Math.random() * 1000)}`,
    );
    if (name) {
      saveCustomPreset({ ...ship, name });
    }
  };

  const handleFleetChange = (
    side: "attacker" | "defender",
    ships: ShipConfig[],
  ) => {
    if (side === "attacker") {
      setAttackerFleet(ships);
    } else {
      setDefenderFleet(ships);
    }
    // Clear results when configuration changes
    setResults(null);
  };

  const canCalculate = defenderFleet.length > 0 && attackerFleet.length > 0;

  return (
    <main className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header with Settings */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Combat Calculator</h1>
            <p className="text-sm text-muted-foreground">
              Simulate ship battles and calculate victory probabilities
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 size-4" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ship Cards</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={accordionMode}
                onValueChange={handleAccordionModeChange}
              >
                <DropdownMenuRadioItem value="multiple">
                  Expand multiple
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="single">
                  Expand one at a time
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Animations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <label className="flex items-center justify-between px-2 py-1.5 cursor-pointer">
                <span className="text-sm">Cascade collapse</span>
                <Switch
                  checked={cascadeAnimation}
                  onCheckedChange={handleCascadeAnimationChange}
                  size="sm"
                />
              </label>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Fleet Builders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FleetBuilder
            side="defender"
            ships={defenderFleet}
            onShipsChange={(ships) => handleFleetChange("defender", ships)}
            onOpenPresets={(index) => handleOpenPresets("defender", index)}
            onSavePreset={handleSavePreset}
            accordionMode={accordionMode}
            cascadeAnimation={cascadeAnimation}
          />
          <FleetBuilder
            side="attacker"
            ships={attackerFleet}
            onShipsChange={(ships) => handleFleetChange("attacker", ships)}
            onOpenPresets={(index) => handleOpenPresets("attacker", index)}
            onSavePreset={handleSavePreset}
            accordionMode={accordionMode}
            cascadeAnimation={cascadeAnimation}
          />
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleCalculate}
            disabled={!canCalculate || isCalculating}
            className="px-8"
          >
            <Swords className="size-4" />
            Calculate
          </Button>
        </div>

        {/* Results */}
        <div className="max-w-2xl mx-auto">
          <BattleResultsComponent
            results={results}
            isCalculating={isCalculating}
          />
        </div>
      </div>

      {/* Preset Manager Dialog */}
      <PresetManager
        open={presetDialog.open}
        onOpenChange={(open) => setPresetDialog((prev) => ({ ...prev, open }))}
        onSelectPreset={handleSelectPreset}
      />
    </main>
  );
}
