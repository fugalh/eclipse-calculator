"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotationDisplay } from "./notation-toggle";
import {
  PART_TYPE_INFO,
  DAMAGE_COLOR_INFO,
  parseNotationToDescription,
} from "@/lib/data";
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

interface PartCardProps {
  part: AnyShipPartData;
  className?: string;
}

export function PartCard({ part, className }: PartCardProps) {
  const Icon = PART_ICONS[part.type];
  const typeInfo = PART_TYPE_INFO[part.type];
  const descriptive = parseNotationToDescription(part.notation);

  // Get damage color for weapons
  const damageColor =
    "diceColor" in part ? DAMAGE_COLOR_INFO[part.diceColor] : null;

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
            <span
              className={
                part.energy > 0
                  ? "text-green-500"
                  : part.energy < 0
                    ? "text-red-500"
                    : ""
              }
            >
              {part.energy > 0 ? `+${part.energy}` : part.energy}
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
  const damageColor =
    "diceColor" in part ? DAMAGE_COLOR_INFO[part.diceColor] : null;
  const descriptive = parseNotationToDescription(part.notation);

  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-2 font-medium">{part.name}</td>
      <td className="p-2 text-sm">{typeInfo.label}</td>
      <td className="p-2 text-center">
        <span
          className={
            part.energy > 0
              ? "text-green-500"
              : part.energy < 0
                ? "text-red-500"
                : ""
          }
        >
          {part.energy > 0 ? `+${part.energy}` : part.energy}
        </span>
      </td>
      <td className="p-2">
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
      </td>
      <td className="p-2 font-mono text-sm">
        <NotationDisplay symbolic={part.notation} descriptive={descriptive} />
      </td>
      <td className="p-2">
        <Badge className={cn("text-xs text-white", SOURCE_COLORS[part.source])}>
          {part.source}
        </Badge>
      </td>
    </tr>
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
