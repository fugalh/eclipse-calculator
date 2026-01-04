"use client";

import Image from "next/image";
import { X } from "lucide-react";
import type {
  PresetManagerProps,
  PresetItemProps,
  Preset,
  PresetType,
} from "@/lib/types";
import {
  DEFAULT_PRESETS,
  getCustomPresets,
  deleteCustomPreset,
} from "@/lib/presets";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useReducer, useState, useEffect, useCallback } from "react";
import { getShipIcon } from "@/lib/icons";

// ============================================================================
// Constants
// ============================================================================

const TYPE_LABELS: Record<PresetType, string> = {
  generic: "Generic",
  npc: "NPC",
  player: "Player",
  custom: "Custom",
};

const TYPE_COLORS: Record<PresetType, string> = {
  generic: "bg-gray-500/20 text-gray-400",
  npc: "bg-purple-500/20 text-purple-400",
  player: "bg-green-500/20 text-green-400",
  custom: "bg-yellow-500/20 text-yellow-400",
};

function PresetItem({ preset, onSelect, onDelete }: PresetItemProps) {
  const iconPath = getShipIcon(preset.shipClass);

  return (
    <div className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group">
      <button
        type="button"
        onClick={onSelect}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <div className="w-9 h-9 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
          {iconPath ? (
            <Image
              src={iconPath}
              alt={preset.shipClass}
              width={36}
              height={36}
              className="w-7 h-7 object-contain"
              unoptimized
            />
          ) : (
            <span className="text-xs font-medium">
              {preset.shipClass.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{preset.name}</div>
          <div className="text-xs text-muted-foreground">
            {preset.shipClass}
          </div>
        </div>
        <Badge className={cn("text-[10px] px-1.5", TYPE_COLORS[preset.type])}>
          {TYPE_LABELS[preset.type]}
        </Badge>
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="p-1 hover:bg-destructive/20 rounded transition-all shrink-0"
          aria-label="Delete preset"
        >
          <X className="size-3.5 text-destructive" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PresetManager({
  open,
  onOpenChange,
  onSelectPreset,
  onDeletePreset,
  refreshKey: externalRefreshKey,
}: PresetManagerProps) {
  // Use reducer to force refresh of custom presets
  const [refreshKey, forceRefresh] = useReducer((x: number) => x + 1, 0);
  const [customPresets, setCustomPresets] = useState<Preset[]>([]);

  // Load custom presets when dialog opens or refresh keys change
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomPresets(getCustomPresets());
    }
  }, [open, refreshKey, externalRefreshKey]);

  const handleDeleteCustomPreset = useCallback(
    (name: string) => {
      if (onDeletePreset) {
        onDeletePreset(name);
      } else {
        deleteCustomPreset(name);
      }
      forceRefresh();
    },
    [onDeletePreset],
  );

  const handleSelectPreset = useCallback(
    (preset: Preset) => {
      onSelectPreset(preset);
      onOpenChange(false);
    },
    [onSelectPreset, onOpenChange],
  );

  // Group presets by type
  const npcPresets = DEFAULT_PRESETS.filter((p) => p.type === "npc");
  const playerPresets = DEFAULT_PRESETS.filter((p) => p.type === "player");
  const genericPresets = DEFAULT_PRESETS.filter((p) => p.type === "generic");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ship Presets</DialogTitle>
          <DialogDescription>
            Select a preset to apply to your ship configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Generic */}
          {genericPresets.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">
                Generic
              </h3>
              <div className="space-y-1">
                {genericPresets.map((preset) => (
                  <PresetItem
                    key={preset.name}
                    preset={preset}
                    onSelect={() => handleSelectPreset(preset)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* NPCs */}
          {npcPresets.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">
                NPC Ships
              </h3>
              <div className="space-y-1">
                {npcPresets.map((preset) => (
                  <PresetItem
                    key={preset.name}
                    preset={preset}
                    onSelect={() => handleSelectPreset(preset)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Player Ships */}
          {playerPresets.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">
                Player Ships
              </h3>
              <div className="space-y-1">
                {playerPresets.map((preset) => (
                  <PresetItem
                    key={preset.name}
                    preset={preset}
                    onSelect={() => handleSelectPreset(preset)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Custom Presets */}
          {customPresets.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">
                Custom Presets
              </h3>
              <div className="space-y-1">
                {customPresets.map((preset) => (
                  <PresetItem
                    key={preset.name}
                    preset={preset}
                    onSelect={() => handleSelectPreset(preset)}
                    onDelete={() => handleDeleteCustomPreset(preset.name)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
