"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DifferenceItem, DifferenceCategory } from "@/lib/data";
import { DIFFERENCE_CATEGORY_INFO } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Sparkles, Package, Wrench } from "lucide-react";

const CATEGORY_ICONS = {
  notable: Sparkles,
  discovery: Package,
  minor: Wrench,
} as const;

const CATEGORY_COLORS = {
  notable: "bg-purple-500",
  discovery: "bg-amber-500",
  minor: "bg-zinc-500",
} as const;

interface DifferenceCardProps {
  difference: DifferenceItem;
  className?: string;
}

export function DifferenceCard({ difference, className }: DifferenceCardProps) {
  const Icon = CATEGORY_ICONS[difference.category];

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{difference.title}</CardTitle>
          </div>
          {difference.quantity && (
            <Badge variant="secondary" className="shrink-0">
              {difference.quantity}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {difference.description}
        </p>
      </CardContent>
    </Card>
  );
}

interface DifferenceListProps {
  differences: DifferenceItem[];
  className?: string;
}

export function DifferenceList({
  differences,
  className,
}: DifferenceListProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {differences.map((diff) => (
        <DifferenceCard key={diff.id} difference={diff} />
      ))}
    </div>
  );
}

interface DifferenceSectionProps {
  category: DifferenceCategory;
  differences: DifferenceItem[];
  className?: string;
}

export function DifferenceSection({
  category,
  differences,
  className,
}: DifferenceSectionProps) {
  const info = DIFFERENCE_CATEGORY_INFO[category];
  const Icon = CATEGORY_ICONS[category];

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-white",
            CATEGORY_COLORS[category],
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{info.label}</h2>
          <p className="text-sm text-muted-foreground">{info.description}</p>
        </div>
        <Badge variant="outline" className="ml-auto">
          {differences.length}
        </Badge>
      </div>
      <DifferenceList differences={differences} />
    </section>
  );
}

interface DifferenceTableRowProps {
  difference: DifferenceItem;
}

export function DifferenceTableRow({ difference }: DifferenceTableRowProps) {
  const Icon = CATEGORY_ICONS[difference.category];

  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{difference.title}</span>
        </div>
      </td>
      <td className="p-2">
        <Badge
          className={cn(
            "text-xs text-white",
            CATEGORY_COLORS[difference.category],
          )}
        >
          {difference.category}
        </Badge>
      </td>
      <td className="p-2 text-sm text-muted-foreground">
        {difference.description}
      </td>
      <td className="p-2 text-center text-sm">{difference.quantity || "—"}</td>
    </tr>
  );
}

export function DifferenceTable({
  differences,
  className,
}: DifferenceListProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-sm">
            <th className="p-2 font-medium">Change</th>
            <th className="p-2 font-medium">Type</th>
            <th className="p-2 font-medium">Description</th>
            <th className="p-2 text-center font-medium">Qty</th>
          </tr>
        </thead>
        <tbody>
          {differences.map((diff) => (
            <DifferenceTableRow key={diff.id} difference={diff} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
