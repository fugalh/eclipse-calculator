"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Plus, ChevronRight } from "lucide-react";
import type { FleetBuilderProps, ShipConfig } from "@/lib/types";
import { findPresetByName } from "@/lib/presets";
import { generateShipId } from "@/lib/combat/simulation";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Accordion } from "@/components/ui/accordion";
import { ShipConfigurator } from "./ship-configurator";
import { cn } from "@/lib/utils";
import { GAME_ICONS } from "@/lib/icons";

const CASCADE_DELAY = 1200; // ms delay between ship collapse and fleet collapse

// ============================================================================
// Main Component
// ============================================================================

export function FleetBuilder({
  side,
  ships,
  onShipsChange,
  onOpenPresets,
  onSavePreset,
  accordionMode,
  cascadeAnimation,
}: FleetBuilderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [accordionValue, setAccordionValue] = useState<string[]>(() =>
    ships.map((s) => s.id),
  );
  const cascadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAttacker = side === "attacker";

  const handleAddShip = () => {
    const genericPreset = findPresetByName("Generic ship");
    if (genericPreset) {
      const newShip: ShipConfig = {
        ...genericPreset,
        id: generateShipId(),
        number: 1,
      };
      onShipsChange([...ships, newShip]);
      // Expand the new ship
      setAccordionValue((prev) => [...prev, newShip.id]);
      // Open preset selector for the new ship
      onOpenPresets(ships.length);
    }
  };

  const handleShipChange = (index: number, updatedShip: ShipConfig) => {
    const newShips = [...ships];
    newShips[index] = updatedShip;
    onShipsChange(newShips);
  };

  const handleRemoveShip = (index: number) => {
    const newShips = ships.filter((_, i) => i !== index);
    onShipsChange(newShips);
  };

  const handleResetShip = (index: number) => {
    const ship = ships[index];
    const preset = findPresetByName(ship.name);
    if (preset) {
      handleShipChange(index, { ...preset, id: ship.id, number: ship.number });
    }
  };

  // Handle accordion value change
  const handleAccordionChange = useCallback(
    (value: string | string[]) => {
      if (accordionMode === "single") {
        // For single mode, value is a string or undefined
        setAccordionValue(value ? [value as string] : []);
      } else {
        // For multiple mode, value is an array
        setAccordionValue(value as string[]);
      }
    },
    [accordionMode],
  );

  // Handle fleet collapse with optional cascade effect
  const handleFleetOpenChange = useCallback(
    (open: boolean) => {
      // Clear any pending timeout
      if (cascadeTimeoutRef.current) {
        clearTimeout(cascadeTimeoutRef.current);
        cascadeTimeoutRef.current = null;
      }

      if (!cascadeAnimation) {
        // Simple mode: just toggle the collapsible, leave accordion values unchanged
        setIsOpen(open);
        return;
      }

      if (open) {
        // Opening: expand fleet immediately, then expand ships after a brief delay
        // This ensures the collapsible content is visible before accordion animations start
        setIsOpen(true);
        // Delay ship expansion to allow collapsible to calculate initial height
        cascadeTimeoutRef.current = setTimeout(() => {
          setAccordionValue(ships.map((s) => s.id));
        }, 50);
      } else {
        // Closing: collapse ships first, then fleet after delay
        setAccordionValue([]);
        cascadeTimeoutRef.current = setTimeout(() => {
          setIsOpen(false);
        }, CASCADE_DELAY);
      }
    },
    [ships, cascadeAnimation],
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={handleFleetOpenChange}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ChevronRight
            className={cn(
              "size-4 transition-transform duration-200",
              isOpen && "rotate-90",
            )}
          />
          <Image
            src={
              isAttacker ? GAME_ICONS.roles.attacker : GAME_ICONS.roles.defender
            }
            alt={isAttacker ? "Attacker" : "Defender"}
            width={28}
            height={28}
            className="w-6 h-6 md:w-7 md:h-7 object-contain"
            unoptimized
          />
          <h2
            className={cn(
              "text-lg font-semibold",
              isAttacker ? "text-red-500" : "text-blue-500",
            )}
          >
            {isAttacker ? "Attacker" : "Defender"}
          </h2>
          {!isOpen && ships.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({ships.length} {ships.length === 1 ? "ship" : "ships"})
            </span>
          )}
        </CollapsibleTrigger>
        <Button variant="outline" size="sm" onClick={handleAddShip}>
          <Plus className="size-3.5" />
          Add ship class
        </Button>
      </div>

      {/* Ships */}
      <CollapsibleContent>
        {ships.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
            No ships. Click &quot;Add ship class&quot; to add one.
          </div>
        ) : accordionMode === "single" ? (
          <Accordion
            type="single"
            value={accordionValue[0]}
            onValueChange={(value) => handleAccordionChange(value)}
            collapsible
            className="space-y-2 border-0"
          >
            {ships.map((ship, index) => (
              <ShipConfigurator
                key={ship.id}
                ship={ship}
                onChange={(updated) => handleShipChange(index, updated)}
                onOpenPresets={() => onOpenPresets(index)}
                onReset={() => handleResetShip(index)}
                onSave={() => onSavePreset(ship)}
                onRemove={() => handleRemoveShip(index)}
              />
            ))}
          </Accordion>
        ) : (
          <Accordion
            type="multiple"
            value={accordionValue}
            onValueChange={(value) => handleAccordionChange(value)}
            className="space-y-2 border-0"
          >
            {ships.map((ship, index) => (
              <ShipConfigurator
                key={ship.id}
                ship={ship}
                onChange={(updated) => handleShipChange(index, updated)}
                onOpenPresets={() => onOpenPresets(index)}
                onReset={() => handleResetShip(index)}
                onSave={() => onSavePreset(ship)}
                onRemove={() => handleRemoveShip(index)}
              />
            ))}
          </Accordion>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
