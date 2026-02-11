"use client";

import { memo } from "react";
import type { SurvivalDistribution } from "@/lib/types";

// Small fleet: show exact count distribution
export const SmallFleetSurvival = memo(function SmallFleetSurvival({
  name,
  distribution,
}: {
  name: string;
  distribution: SurvivalDistribution;
}) {
  const { distribution: dist, averageRate } = distribution;

  const sortedCounts = Object.entries(dist)
    .map(([count, prob]) => ({ count: parseInt(count, 10), prob }))
    .filter(({ prob }) => prob > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-muted/50 px-3 py-2 rounded space-y-1">
      <div className="flex justify-between text-sm font-medium">
        <span>{name}</span>
        <span className="text-muted-foreground">
          {Math.round(averageRate * 100)}% avg
        </span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
        {sortedCounts.map(({ count, prob }) => (
          <span key={count}>
            {count}: {Math.round(prob * 100)}%
          </span>
        ))}
      </div>
    </div>
  );
});

// Large fleet without buckets: show average only
export const AverageSurvival = memo(function AverageSurvival({
  name,
  averageRate,
}: {
  name: string;
  averageRate: number;
}) {
  return (
    <div className="bg-muted/50 px-3 py-1.5 rounded flex items-center justify-between text-sm">
      <span>{name}</span>
      <span className="font-medium">{Math.round(averageRate * 100)}%</span>
    </div>
  );
});

// Large fleet with buckets: show bucket distribution
export const LargeFleetSurvival = memo(function LargeFleetSurvival({
  name,
  distribution,
}: {
  name: string;
  distribution: SurvivalDistribution;
}) {
  const { buckets, averageRate } = distribution;

  if (!buckets) {
    return <AverageSurvival name={name} averageRate={averageRate} />;
  }

  return (
    <div className="bg-muted/50 px-3 py-2 rounded space-y-1">
      <div className="flex justify-between text-sm font-medium">
        <span>{name}</span>
        <span className="text-muted-foreground">
          {Math.round(averageRate * 100)}% avg
        </span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
        <span>All: {Math.round(buckets.all * 100)}%</span>
        <span>Most: {Math.round(buckets.most * 100)}%</span>
        <span>Some: {Math.round(buckets.some * 100)}%</span>
        <span>None: {Math.round(buckets.none * 100)}%</span>
      </div>
    </div>
  );
});

// Auto-select appropriate display based on fleet size
export const SurvivalDistributionDisplay = memo(
  function SurvivalDistributionDisplay({
    name,
    distribution,
  }: {
    name: string;
    distribution: SurvivalDistribution;
  }) {
    const { totalCount } = distribution;

    if (totalCount <= 4) {
      return <SmallFleetSurvival name={name} distribution={distribution} />;
    }

    return <LargeFleetSurvival name={name} distribution={distribution} />;
  },
);
