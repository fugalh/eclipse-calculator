"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotationDisplay } from "./notation-toggle";
import { TableRow, TableCell } from "./table-components";
import { PART_TYPE_INFO, DAMAGE_COLOR_INFO } from "@/lib/data/ship-parts";
import { parseNotationToDescription } from "@/lib/data/index";
import type { AnyShipPartData, PartSource } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Target,
  Rocket,
  Cpu,
  Shield,
  Box,
  Zap,
  BatteryCharging,
} from "lucide-react";

const PART_ICONS = {
  cannon: Target,
  missile: Rocket,
  computer: Cpu,
  shield: Shield,
  hull: Box,
  drive: Zap,
  source: BatteryCharging,
} as const;

const SOURCE_COLORS: Record<PartSource, string> = {
  starting: "bg-zinc-500",
  technology: "bg-blue-500",
  ancient: "bg-amber-600",
  discovery: "bg-purple-500",
};

// Helper functions to eliminate duplication
function getEnergyColor(energy: number): string {
  if (energy > 0) return "text-green-500";
  if (energy < 0) return "text-red-500";
  return "";
}

function formatEnergy(energy: number): string {
  return energy > 0 ? `+${energy}` : `${energy}`;
}

interface PartCardProps {
  part: AnyShipPartData;
  className?: string;
}

export function PartCard({ part, className }: PartCardProps) {
  const Icon = PART_ICONS[part.type];
  const typeInfo = PART_TYPE_INFO[part.type];
  const descriptive = useMemo(
    () => parseNotationToDescription(part.notation),
    [part.notation],
  );

  // Cache property checks
  const hasDamageColor = "diceColor" in part;
  const damageColor = hasDamageColor ? DAMAGE_COLOR_INFO[part.diceColor] : null;

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{part.name}</CardTitle>
          </div>
          <Badge
            className={cn("shrink-0 text-white", SOURCE_COLORS[part.source])}
          >
            {part.source}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between rounded bg-muted px-2 py-1">
            <span className="text-muted-foreground">Type</span>
            <span>{typeInfo.label}</span>
          </div>
          <div className="flex justify-between rounded bg-muted px-2 py-1">
            <span className="text-muted-foreground">Energy</span>
            <span className={getEnergyColor(part.energy)}>
              {formatEnergy(part.energy)}
            </span>
          </div>
          {damageColor && (
            <div className="col-span-2 flex justify-between rounded bg-muted px-2 py-1">
              <span className="text-muted-foreground">Damage</span>
              <span className="flex items-center gap-1">
                <span
                  className={cn(
                    "inline-block h-3 w-3 rounded-full",
                    damageColor.color,
                  )}
                />
                {damageColor.label} ({damageColor.damage})
              </span>
            </div>
          )}
        </div>

        {/* Effect */}
        <p className="text-sm">{part.effect}</p>

        {/* Notation */}
        {part.notation && (
          <div className="rounded bg-muted px-2 py-1 font-mono text-sm">
            <NotationDisplay
              symbolic={part.notation}
              descriptive={descriptive}
            />
          </div>
        )}

        {/* Required tech */}
        {part.requiredTechId && (
          <div className="text-xs text-muted-foreground">
            Requires: {part.requiredTechId.replace(/-/g, " ")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PartGridProps {
  parts: AnyShipPartData[];
  className?: string;
}

export function PartGrid({ parts, className }: PartGridProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {parts.map((part) => (
        <PartCard key={part.id} part={part} />
      ))}
    </div>
  );
}

interface PartTableRowProps {
  part: AnyShipPartData;
}

export function PartTableRow({ part }: PartTableRowProps) {
  const typeInfo = PART_TYPE_INFO[part.type];
  const hasDamageColor = "diceColor" in part;
  const damageColor = hasDamageColor ? DAMAGE_COLOR_INFO[part.diceColor] : null;
  const descriptive = useMemo(
    () => parseNotationToDescription(part.notation),
    [part.notation],
  );

  return (
    <TableRow>
      <TableCell className="font-medium">{part.name}</TableCell>
      <TableCell className="text-sm">{typeInfo.label}</TableCell>
      <TableCell className="text-center">
        <span className={getEnergyColor(part.energy)}>
          {formatEnergy(part.energy)}
        </span>
      </TableCell>
      <TableCell>
        {damageColor && (
          <span className="flex items-center gap-1">
            <span
              className={cn(
                "inline-block h-3 w-3 rounded-full",
                damageColor.color,
              )}
            />
            {damageColor.damage}
          </span>
        )}
      </TableCell>
      <TableCell className="font-mono text-sm">
        <NotationDisplay symbolic={part.notation} descriptive={descriptive} />
      </TableCell>
      <TableCell>
        <Badge className={cn("text-xs text-white", SOURCE_COLORS[part.source])}>
          {part.source}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

export function PartTable({ parts, className }: PartGridProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-sm">
            <th className="p-2 font-medium">Name</th>
            <th className="p-2 font-medium">Type</th>
            <th className="p-2 text-center font-medium">Energy</th>
            <th className="p-2 font-medium">Dmg</th>
            <th className="p-2 font-medium">Effect</th>
            <th className="p-2 font-medium">Source</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <PartTableRow key={part.id} part={part} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
