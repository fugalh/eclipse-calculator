"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SpeciesData } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Users,
  FlaskConical,
  Coins,
  Boxes,
  Rocket,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface SpeciesCardProps {
  species: SpeciesData;
  className?: string;
  actionButton?: React.ReactNode;
}

export function SpeciesCard({
  species,
  className,
  actionButton,
}: SpeciesCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Combine ability filtering into single iteration
  const { positive: positiveAbilities, negative: negativeAbilities } =
    useMemo(() => {
      const positive = [];
      const negative = [];
      for (const ability of species.specialAbilities) {
        if (ability.isPositive) {
          positive.push(ability);
        } else {
          negative.push(ability);
        }
      }
      return { positive, negative };
    }, [species.specialAbilities]);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{species.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{species.fullName}</p>
          </div>
          {actionButton}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Starting Resources */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-1 rounded bg-orange-500/10 px-2 py-1 text-sm">
            <Boxes className="h-4 w-4 text-orange-500" />
            <span>{species.startingResources.materials}</span>
          </div>
          <div className="flex items-center gap-1 rounded bg-pink-500/10 px-2 py-1 text-sm">
            <FlaskConical className="h-4 w-4 text-pink-500" />
            <span>{species.startingResources.science}</span>
          </div>
          <div className="flex items-center gap-1 rounded bg-amber-600/10 px-2 py-1 text-sm">
            <Coins className="h-4 w-4 text-amber-600" />
            <span>{species.startingResources.money}</span>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 rounded bg-muted px-2 py-1">
            <Rocket className="h-4 w-4 text-muted-foreground" />
            <span>{species.colonyShips} Colony Ships</span>
          </div>
          <div className="flex items-center gap-2 rounded bg-muted px-2 py-1">
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            <span>Trade {species.tradeRatio}:1</span>
          </div>
        </div>

        {/* Starting Techs */}
        {species.startingTechs.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Starting Technologies
            </p>
            <div className="flex flex-wrap gap-1">
              {species.startingTechs.map((techId) => (
                <Badge key={techId} variant="secondary" className="text-xs">
                  {techId.replace(/-/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Activations Summary */}
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Action Activations
          </p>
          <div className="flex flex-wrap gap-1 text-xs">
            <Badge variant="outline">EXP {species.activations.explore}</Badge>
            <Badge variant="outline">RES {species.activations.research}</Badge>
            <Badge variant="outline">UPG {species.activations.upgrade}</Badge>
            <Badge variant="outline">BUI {species.activations.build}</Badge>
            <Badge variant="outline">MOV {species.activations.move}</Badge>
            <Badge variant="outline">INF {species.activations.influence}</Badge>
          </div>
        </div>

        {/* Expandable Abilities */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Special Abilities ({species.specialAbilities.length})
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {expanded && (
            <div className="mt-2 space-y-2">
              {positiveAbilities.map((ability) => (
                <div
                  key={ability.name}
                  className="flex items-start gap-2 rounded bg-green-500/10 p-2 text-sm"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <div>
                    <p className="font-medium">{ability.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ability.description}
                    </p>
                  </div>
                </div>
              ))}
              {negativeAbilities.map((ability) => (
                <div
                  key={ability.name}
                  className="flex items-start gap-2 rounded bg-red-500/10 p-2 text-sm"
                >
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <p className="font-medium">{ability.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ability.description}
                    </p>
                  </div>
                </div>
              ))}
              {species.blueprintNotes && (
                <p className="text-xs text-muted-foreground">
                  {species.blueprintNotes}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface SpeciesGridProps {
  species: SpeciesData[];
  className?: string;
  selectedIds?: string[];
  onCompareToggle?: (id: string) => void;
}

export function SpeciesGrid({
  species,
  className,
  selectedIds = [],
  onCompareToggle,
}: SpeciesGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {species.map((s) => {
        const isSelected = selectedIds.includes(s.id);
        return (
          <SpeciesCard
            key={s.id}
            species={s}
            actionButton={
              onCompareToggle ? (
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCompareToggle(s.id)}
                >
                  {isSelected ? "Selected" : "Compare"}
                </Button>
              ) : undefined
            }
          />
        );
      })}
    </div>
  );
}
