"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type {
  ShipConfig,
  BattleResultsExtended,
  PresetDialogState,
  AccordionMode,
} from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";
import {
  calculate,
  generateShipId,
  hasActiveShips,
} from "@/lib/combat/simulation";
import {
  findPresetByName,
  saveCustomPreset,
  deleteCustomPreset,
} from "@/lib/presets";
import { decodeBattleConfig } from "@/lib/share";
import { getSettings, updateSettings } from "@/lib/settings";
import { useDebouncedCalculation } from "@/lib/hooks/use-debounced-calculation";
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
import { markSimulationRun } from "@/components/pwa";

export function CalculatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Fleet state
  const [defenderFleet, setDefenderFleet] = useState<ShipConfig[]>(() => {
    const ancient = findPresetByName("Ancient");
    return ancient ? [{ ...ancient, id: generateShipId(), number: 1 }] : [];
  });
  const [attackerFleet, setAttackerFleet] = useState<ShipConfig[]>(() => {
    const cruiser = findPresetByName("Cruiser");
    return cruiser ? [{ ...cruiser, id: generateShipId(), number: 1 }] : [];
  });

  // Results state - for manual calculation or URL-loaded battles
  const [manualResults, setManualResults] =
    useState<BattleResultsExtended | null>(null);
  const [isManualCalculating, setIsManualCalculating] = useState(false);

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

  const [autoCalculate, setAutoCalculate] = useState<boolean>(() => {
    // Only access localStorage on client
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS.autoCalculate;
    }
    return getSettings().autoCalculate;
  });

  // Debounced auto-calculation hook
  const {
    results: autoResults,
    isCalculating: isAutoCalculating,
    triggerCalculation,
  } = useDebouncedCalculation(defenderFleet, attackerFleet, {
    enabled: autoCalculate,
    debounceMs: 500,
  });

  // Use auto results when auto-calculate is enabled, otherwise use manual results
  const results = autoCalculate ? autoResults : manualResults;
  const isCalculating = autoCalculate ? isAutoCalculating : isManualCalculating;

  // Track simulations for PWA install prompt
  useEffect(() => {
    if (autoResults && autoCalculate) {
      markSimulationRun();
    }
  }, [autoResults, autoCalculate]);

  // Handle shared battle URL params
  useEffect(() => {
    const battleParam = searchParams.get("battle");
    if (!battleParam) return;

    const decoded = decodeBattleConfig(battleParam);
    if (!decoded) return;

    // Update fleets and auto-calculate
    const updateAndCalculate = () => {
      setDefenderFleet(decoded.defenders);
      setAttackerFleet(decoded.attackers);

      // Calculate immediately for URL-loaded battles (bypass auto-calculate)
      setTimeout(() => {
        const battleResults = calculate(
          { ships: decoded.defenders },
          { ships: decoded.attackers },
          1000,
        );
        setManualResults(battleResults);
      }, 100);

      // Clear the URL param after loading
      router.replace("/", { scroll: false });
    };

    // Schedule state updates to avoid synchronous setState in effect
    setTimeout(updateAndCalculate, 0);
  }, [searchParams, router]);

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

  // Handle auto-calculate toggle
  const handleAutoCalculateChange = (checked: boolean) => {
    setAutoCalculate(checked);
    updateSettings({ autoCalculate: checked });
    // If enabling auto-calculate, trigger an immediate calculation
    if (checked) {
      triggerCalculation();
    }
  };

  // Handlers
  const handleCalculate = useCallback(() => {
    if (!hasActiveShips(defenderFleet) || !hasActiveShips(attackerFleet)) {
      return;
    }

    setIsManualCalculating(true);

    // Use setTimeout to allow UI to update before heavy calculation
    setTimeout(() => {
      const battleResults = calculate(
        { ships: defenderFleet },
        { ships: attackerFleet },
        1000,
      );
      setManualResults(battleResults);
      setIsManualCalculating(false);

      // Track simulation for PWA install prompt
      markSimulationRun();
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

    // Clear manual results when configuration changes
    setManualResults(null);
  };

  const [presetRefreshKey, setPresetRefreshKey] = useState(0);

  const handleDeletePreset = (presetName: string) => {
    // Delete the preset from localStorage
    deleteCustomPreset(presetName);

    // Update any ships using this preset to have a generic name
    const updateShipName = (fleet: ShipConfig[]) =>
      fleet.map((ship) =>
        ship.name === presetName ? { ...ship, name: "Custom Ship" } : ship,
      );

    setAttackerFleet((prev) => updateShipName(prev));
    setDefenderFleet((prev) => updateShipName(prev));

    // Trigger refresh of preset manager
    setPresetRefreshKey((k) => k + 1);
  };

  const handleSavePreset = (ship: ShipConfig) => {
    const name = window.prompt(
      "Name your preset:",
      `Ship ${Math.ceil(Math.random() * 1000)}`,
    );
    if (name) {
      // Save the preset with the new name
      saveCustomPreset({ ...ship, name });

      // Update the ship's name in the fleet
      const updateFleetName = (fleet: ShipConfig[]) =>
        fleet.map((s) => (s.id === ship.id ? { ...s, name } : s));

      setAttackerFleet((prev) => updateFleetName(prev));
      setDefenderFleet((prev) => updateFleetName(prev));

      // Trigger refresh of preset manager
      setPresetRefreshKey((k) => k + 1);
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
    // Clear manual results when configuration changes
    setManualResults(null);
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
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Calculation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <label className="flex items-center justify-between px-2 py-1.5 cursor-pointer">
                <span className="text-sm">Auto-calculate</span>
                <Switch
                  checked={autoCalculate}
                  onCheckedChange={handleAutoCalculateChange}
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

        {/* Calculate Button - only show when auto-calculate is disabled */}
        {!autoCalculate && (
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
        )}

        {/* Results */}
        <div className="max-w-2xl mx-auto">
          <BattleResultsComponent
            results={results}
            isCalculating={isCalculating}
            defenders={defenderFleet}
            attackers={attackerFleet}
          />
        </div>
      </div>

      {/* Preset Manager Dialog */}
      <PresetManager
        open={presetDialog.open}
        onOpenChange={(open) => setPresetDialog((prev) => ({ ...prev, open }))}
        onSelectPreset={handleSelectPreset}
        onDeletePreset={handleDeletePreset}
        refreshKey={presetRefreshKey}
      />
    </main>
  );
}
