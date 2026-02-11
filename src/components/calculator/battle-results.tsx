"use client";

import { memo } from "react";
import type {
  BattleResultsProps,
  VictoryChanceProps,
  SurvivalListProps,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ShareResults } from "./share-results";
import { SurvivalDistributionDisplay } from "./survival-display";

const VictoryChance = memo(function VictoryChance({
  side,
  probability,
  isWinner,
}: VictoryChanceProps) {
  const isAttacker = side === "attacker";

  return (
    <div
      className={cn(
        "flex-1 p-4 rounded-lg text-center transition-all",
        isWinner
          ? isAttacker
            ? "bg-red-500/20 border-2 border-red-500"
            : "bg-blue-500/20 border-2 border-blue-500"
          : "bg-muted border-2 border-transparent",
      )}
    >
      <div
        className={cn(
          "text-sm font-medium mb-1",
          isAttacker ? "text-red-500" : "text-blue-500",
        )}
      >
        {isAttacker ? "Attacker" : "Defender"}
      </div>
      <div
        className={cn(
          "text-3xl font-bold",
          isWinner && (isAttacker ? "text-red-500" : "text-blue-500"),
        )}
      >
        {Math.round(probability * 100)}%
      </div>
    </div>
  );
});

const SurvivalList = memo(function SurvivalList({
  title,
  shipSurvival,
  survivalDistributions,
  color,
}: SurvivalListProps) {
  const entries = Object.entries(shipSurvival);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3
        className={cn(
          "text-sm font-medium",
          color === "red" ? "text-red-500" : "text-blue-500",
        )}
      >
        {title}
      </h3>
      <div className="space-y-1">
        {entries.map(([name]) => {
          const distribution = survivalDistributions?.[name];

          if (distribution) {
            return (
              <SurvivalDistributionDisplay
                key={name}
                name={name}
                distribution={distribution}
              />
            );
          }

          // Fallback to simple rate display
          const rate = shipSurvival[name];
          return (
            <div
              key={name}
              className="flex items-center justify-between text-sm bg-muted/50 px-3 py-1.5 rounded"
            >
              <span>{name}</span>
              <span className="font-medium">{Math.round(rate * 100)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ============================================================================
// Main Component
// ============================================================================

export function BattleResults({
  results,
  isCalculating,
  defenders = [],
  attackers = [],
}: BattleResultsProps) {
  if (isCalculating) {
    return (
      <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        <span>Calculating...</span>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
        Add ships to both fleets and click Calculate to see battle results.
      </div>
    );
  }

  const attackerWins = results.attacker > results.defender;
  const defenderWins = results.defender > results.attacker;
  const tie = results.attacker === results.defender;
  const canShare = defenders.length > 0 && attackers.length > 0;

  return (
    <div className="space-y-4">
      {/* Header with Share Button */}
      {canShare && (
        <div className="flex justify-end">
          <ShareResults
            results={results}
            defenders={defenders}
            attackers={attackers}
          />
        </div>
      )}

      {/* Victory Chances */}
      <div className="flex gap-4">
        <VictoryChance
          side="defender"
          probability={results.defender}
          isWinner={defenderWins || tie}
        />
        <VictoryChance
          side="attacker"
          probability={results.attacker}
          isWinner={attackerWins}
        />
      </div>

      {/* Survival Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(results.shipsDefender).length > 0 && (
          <SurvivalList
            title="Defender Survival (when winning)"
            shipSurvival={results.shipsDefender}
            survivalDistributions={results.survivalDistributions?.defender}
            color="blue"
          />
        )}
        {Object.keys(results.shipsAttacker).length > 0 && (
          <SurvivalList
            title="Attacker Survival (when winning)"
            shipSurvival={results.shipsAttacker}
            survivalDistributions={results.survivalDistributions?.attacker}
            color="red"
          />
        )}
      </div>
    </div>
  );
}
