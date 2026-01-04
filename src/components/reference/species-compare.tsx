"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { SpeciesData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { X, Check } from "lucide-react";

interface SpeciesCompareProps {
  species: SpeciesData[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpeciesCompare({
  species,
  open,
  onOpenChange,
}: SpeciesCompareProps) {
  if (species.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-[calc(100%-1rem)] flex-col overflow-hidden sm:max-w-2xl md:max-w-3xl lg:max-w-4xl landscape:max-w-[calc(100%-1rem)]">
        <DialogHeader>
          <DialogTitle>Species Comparison</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[400px]">
            <thead className="sticky top-0 z-20 bg-background">
              <tr className="border-b">
                <th className="sticky left-0 z-30 bg-background p-1.5 text-left font-medium sm:p-2">
                  Attribute
                </th>
                {species.map((s) => (
                  <th
                    key={s.id}
                    className="bg-background p-1.5 text-center font-medium sm:p-2"
                  >
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Starting Resources */}
              <tr className="border-b bg-muted/30">
                <td className="sticky left-0 z-10 bg-muted/30 p-1.5 font-medium sm:p-2">
                  Starting
                </td>
                {species.map((s) => (
                  <td key={s.id} className="bg-muted/30 p-1.5 sm:p-2" />
                ))}
              </tr>
              <tr className="border-b">
                <td className="sticky left-0 z-10 bg-background p-1.5 text-muted-foreground sm:p-2">
                  Materials
                </td>
                {species.map((s) => (
                  <td key={s.id} className="p-1.5 text-center sm:p-2">
                    <HighlightValue
                      value={s.startingResources.materials}
                      allValues={species.map(
                        (x) => x.startingResources.materials,
                      )}
                      higherBetter
                    />
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="sticky left-0 z-10 bg-background p-1.5 text-muted-foreground sm:p-2">
                  Science
                </td>
                {species.map((s) => (
                  <td key={s.id} className="p-1.5 text-center sm:p-2">
                    <HighlightValue
                      value={s.startingResources.science}
                      allValues={species.map(
                        (x) => x.startingResources.science,
                      )}
                      higherBetter
                    />
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="sticky left-0 z-10 bg-background p-1.5 text-muted-foreground sm:p-2">
                  Money
                </td>
                {species.map((s) => (
                  <td key={s.id} className="p-1.5 text-center sm:p-2">
                    <HighlightValue
                      value={s.startingResources.money}
                      allValues={species.map((x) => x.startingResources.money)}
                      higherBetter
                    />
                  </td>
                ))}
              </tr>

              {/* Other Stats */}
              <tr className="border-b bg-muted/30">
                <td className="sticky left-0 z-10 bg-muted/30 p-1.5 font-medium sm:p-2">
                  Key Stats
                </td>
                {species.map((s) => (
                  <td key={s.id} className="bg-muted/30 p-1.5 sm:p-2" />
                ))}
              </tr>
              <tr className="border-b">
                <td className="sticky left-0 z-10 bg-background p-1.5 text-muted-foreground sm:p-2">
                  Colony Ships
                </td>
                {species.map((s) => (
                  <td key={s.id} className="p-1.5 text-center sm:p-2">
                    <HighlightValue
                      value={s.colonyShips}
                      allValues={species.map((x) => x.colonyShips)}
                      higherBetter
                    />
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="sticky left-0 z-10 bg-background p-1.5 text-muted-foreground sm:p-2">
                  Trade Ratio
                </td>
                {species.map((s) => (
                  <td key={s.id} className="p-1.5 text-center sm:p-2">
                    <HighlightValue
                      value={s.tradeRatio}
                      allValues={species.map((x) => x.tradeRatio)}
                      higherBetter={false}
                    />
                    :1
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="sticky left-0 z-10 bg-background p-1.5 text-muted-foreground sm:p-2">
                  Starting Techs
                </td>
                {species.map((s) => (
                  <td key={s.id} className="p-1.5 text-center sm:p-2">
                    {s.startingTechs.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {s.startingTechs.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="text-xs"
                          >
                            {t.split("-")[0]}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Activations */}
              <tr className="border-b bg-muted/30">
                <td className="sticky left-0 z-10 bg-muted/30 p-1.5 font-medium sm:p-2">
                  Actions
                </td>
                {species.map((s) => (
                  <td key={s.id} className="bg-muted/30 p-1.5 sm:p-2" />
                ))}
              </tr>
              {(
                [
                  "explore",
                  "research",
                  "upgrade",
                  "build",
                  "move",
                  "influence",
                ] as const
              ).map((action) => (
                <tr key={action} className="border-b">
                  <td className="sticky left-0 z-10 bg-background p-1.5 text-muted-foreground capitalize sm:p-2">
                    {action}
                  </td>
                  {species.map((s) => (
                    <td key={s.id} className="p-1.5 text-center sm:p-2">
                      <HighlightValue
                        value={s.activations[action]}
                        allValues={species.map((x) => x.activations[action])}
                        higherBetter
                      />
                    </td>
                  ))}
                </tr>
              ))}

              {/* Special Abilities */}
              <tr className="border-b bg-muted/30">
                <td className="sticky left-0 z-10 bg-muted/30 p-1.5 font-medium sm:p-2">
                  Special
                </td>
                {species.map((s) => (
                  <td key={s.id} className="bg-muted/30 p-1.5 sm:p-2" />
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 z-10 bg-background p-1.5 align-top text-muted-foreground sm:p-2">
                  Abilities
                </td>
                {species.map((s) => (
                  <td key={s.id} className="p-1.5 align-top sm:p-2">
                    <div className="space-y-1">
                      {s.specialAbilities.map((ability) => (
                        <div
                          key={ability.name}
                          className={cn(
                            "flex items-start gap-1 rounded px-1 py-0.5 text-xs",
                            ability.isPositive
                              ? "bg-green-500/10"
                              : "bg-red-500/10",
                          )}
                        >
                          {ability.isPositive ? (
                            <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                          ) : (
                            <X className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
                          )}
                          <span>{ability.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

interface HighlightValueProps {
  value: number;
  allValues: number[];
  higherBetter: boolean;
}

function HighlightValue({
  value,
  allValues,
  higherBetter,
}: HighlightValueProps) {
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);

  const isBest = higherBetter ? value === max : value === min;
  const isWorst = higherBetter ? value === min : value === max;

  // Only highlight if there's variation
  const hasVariation = max !== min;

  return (
    <span
      className={cn(
        hasVariation && isBest && "font-medium text-green-500",
        hasVariation && isWorst && "text-red-500",
      )}
    >
      {value}
    </span>
  );
}
