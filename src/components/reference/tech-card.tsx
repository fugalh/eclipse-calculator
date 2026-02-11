"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotationDisplay } from "./notation-toggle";
import { TableRow, TableCell } from "./table-components";
import { TECH_CATEGORY_INFO } from "@/lib/data/techs";
import { parseNotationToDescription } from "@/lib/data/index";
import type { TechData } from "@/lib/data";
import { cn } from "@/lib/utils";

interface TechCardProps {
  tech: TechData;
  className?: string;
}

export function TechCard({ tech, className }: TechCardProps) {
  const categoryInfo = TECH_CATEGORY_INFO[tech.category];
  const descriptive = useMemo(
    () => parseNotationToDescription(tech.notation),
    [tech.notation],
  );

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{tech.name}</CardTitle>
          <Badge className={cn("shrink-0", categoryInfo.color, "text-white")}>
            {categoryInfo.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Cost: {tech.scienceCost}/{tech.minCost}
          </span>
          <span className="text-xs">
            ({tech.scienceCost} base, {tech.minCost} min)
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">{tech.effect}</p>
        {tech.notation && (
          <div className="rounded bg-muted px-2 py-1 font-mono text-sm">
            <NotationDisplay
              symbolic={tech.notation}
              descriptive={descriptive}
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {tech.techType}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface TechListProps {
  techs: TechData[];
  className?: string;
}

export function TechGrid({ techs, className }: TechListProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {techs.map((tech) => (
        <TechCard key={tech.id} tech={tech} />
      ))}
    </div>
  );
}

interface TechTableRowProps {
  tech: TechData;
}

export function TechTableRow({ tech }: TechTableRowProps) {
  const categoryInfo = TECH_CATEGORY_INFO[tech.category];
  const descriptive = useMemo(
    () => parseNotationToDescription(tech.notation),
    [tech.notation],
  );

  return (
    <TableRow>
      <TableCell className="font-medium">{tech.name}</TableCell>
      <TableCell>
        <Badge className={cn("text-xs", categoryInfo.color, "text-white")}>
          {categoryInfo.symbol}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        {tech.scienceCost}/{tech.minCost}
      </TableCell>
      <TableCell className="font-mono text-sm">
        <NotationDisplay symbolic={tech.notation} descriptive={descriptive} />
      </TableCell>
      <TableCell className="text-sm">{tech.effect}</TableCell>
    </TableRow>
  );
}

export function TechTable({ techs, className }: TechListProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-sm">
            <th className="p-2 font-medium">Name</th>
            <th className="p-2 font-medium">Cat.</th>
            <th className="p-2 text-center font-medium">Cost</th>
            <th className="p-2 font-medium">Parts</th>
            <th className="p-2 font-medium">Effect</th>
          </tr>
        </thead>
        <tbody>
          {techs.map((tech) => (
            <TechTableRow key={tech.id} tech={tech} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
