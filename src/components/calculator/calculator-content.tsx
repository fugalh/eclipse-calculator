"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type {
  ShipConfig,
  BattleResultsExtended,
  PresetDialogState,
  AccordionMode,
} from "@/lib/types";
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
import { getCachedSettings, updateCachedSettings } from "@/lib/settings/cache";
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

/**
 * Decode a shared battle config from URL search params.
 * Returns the decoded config or null if no valid battle param exists.
 */
function getInitialBattleConfig(searchParams: URLSearchParams) {
  const battleParam = searchParams.get("battle");
  if (!battleParam) return null;
  return decodeBattleConfig(battleParam);
}

export function CalculatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Decode shared battle from URL once for use in lazy initializers.
  // This is a plain local variable (not a ref) so it can be read during render.
  // It is re-evaluated on every render but decodeBattleConfig is cheap and
  // the lazy initializers only use the value on mount.
  const initialBattle = getInitialBattleConfig(searchParams);
  const hadInitialBattle = useRef(initialBattle !== null);

  // Fleet state - initialize from URL battle param if present, otherwise use defaults
  const [defenderFleet, setDefenderFleet] = useState<ShipConfig[]>(() => {
    if (initialBattle) return initialBattle.defenders;
    const ancient = findPresetByName("Ancient");
    return ancient ? [{ ...ancient, id: generateShipId(), number: 1 }] : [];
  });
  const [attackerFleet, setAttackerFleet] = useState<ShipConfig[]>(() => {
    if (initialBattle) return initialBattle.attackers;
    const cruiser = findPresetByName("Cruiser");
    return cruiser ? [{ ...cruiser, id: generateShipId(), number: 1 }] : [];
  });

  // Results state - for manual calculation or URL-loaded battles
  // Pre-calculate results if loaded from a shared battle URL
  const [manualResults, setManualResults] =
    useState<BattleResultsExtended | null>(() => {
      if (!initialBattle) return null;
      return calculate(
        { ships: initialBattle.defenders },
        { ships: initialBattle.attackers },
        1000,
      );
    });
  const [isManualCalculating, setIsManualCalculating] = useState(false);

  // Preset dialog state
  const [presetDialog, setPresetDialog] = useState<PresetDialogState>({
    open: false,
    side: null,
    shipIndex: null,
  });

  // Settings state - initialize from cache
  const [settings, setSettings] = useState(() => getCachedSettings());

  // Debounced auto-calculation hook
  const {
    results: autoResults,
    isCalculating: isAutoCalculating,
    triggerCalculation,
  } = useDebouncedCalculation(defenderFleet, attackerFleet, {
    enabled: settings.autoCalculate,
    debounceMs: 500,
  });

  // Use auto results when auto-calculate is enabled, otherwise use manual results
  const results = settings.autoCalculate ? autoResults : manualResults;
  const isCalculating = settings.autoCalculate
    ? isAutoCalculating
    : isManualCalculating;

  // Track simulations for PWA install prompt
  useEffect(() => {
    if (autoResults && settings.autoCalculate) {
      markSimulationRun();
    }
  }, [autoResults, settings.autoCalculate]);

  // Clear the battle URL param after initial load (state was set via lazy initializers)
  useEffect(() => {
    if (hadInitialBattle.current) {
      hadInitialBattle.current = false;
      router.replace("/", { scroll: false });
    }
  }, [router]);

  // Handle accordion mode change
  const handleAccordionModeChange = (value: string) => {
    const mode = value as AccordionMode;
    const newSettings = updateCachedSettings({ accordionMode: mode });
    setSettings(newSettings);
  };

  // Handle cascade animation toggle
  const handleCascadeAnimationChange = (checked: boolean) => {
    const newSettings = updateCachedSettings({ cascadeAnimation: checked });
    setSettings(newSettings);
  };

  // Handle auto-calculate toggle
  const handleAutoCalculateChange = (checked: boolean) => {
    const newSettings = updateCachedSettings({ autoCalculate: checked });
    setSettings(newSettings);
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

    setAttackerFleet(updateShipName);
    setDefenderFleet(updateShipName);

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

      setAttackerFleet(updateFleetName);
      setDefenderFleet(updateFleetName);

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
                value={settings.accordionMode}
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
                  checked={settings.cascadeAnimation}
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
                  checked={settings.autoCalculate}
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
            accordionMode={settings.accordionMode}
            cascadeAnimation={settings.cascadeAnimation}
          />
          <FleetBuilder
            side="attacker"
            ships={attackerFleet}
            onShipsChange={(ships) => handleFleetChange("attacker", ships)}
            onOpenPresets={(index) => handleOpenPresets("attacker", index)}
            onSavePreset={handleSavePreset}
            accordionMode={settings.accordionMode}
            cascadeAnimation={settings.cascadeAnimation}
          />
        </div>

        {/* Calculate Button - only show when auto-calculate is disabled */}
        {!settings.autoCalculate && (
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
