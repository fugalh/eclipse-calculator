"use client";

import { useState, useMemo } from "react";
import {
  PageHeader,
  NotationToggle,
  NotationLegend,
  PartGrid,
  PartTable,
  PartTypeFilter,
  PartSourceFilter,
  SearchFilter,
} from "@/components/reference";
import { Button } from "@/components/ui/button";
import { ALL_PARTS, getPartsByType, getPartsBySource } from "@/lib/data";
import type { PartSlotType } from "@/lib/types";
import type { PartSource } from "@/lib/data";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "grid" | "table";
type SourceFilter = PartSource | "all";

export default function ShipPartsPage() {
  const [partType, setPartType] = useState<PartSlotType | "all">("all");
  const [source, setSource] = useState<SourceFilter>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showLegend, setShowLegend] = useState(false);

  // Filter parts
  const filteredParts = useMemo(() => {
    let result = ALL_PARTS;

    if (partType !== "all") {
      result = result.filter((part) => part.type === partType);
    }

    if (source !== "all") {
      result = result.filter((part) => part.source === source);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (part) =>
          part.name.toLowerCase().includes(searchLower) ||
          part.effect.toLowerCase().includes(searchLower),
      );
    }

    return result;
  }, [partType, source, search]);

  // Calculate type counts
  const typeCounts = useMemo(() => {
    const types: (PartSlotType | "all")[] = [
      "all",
      "cannon",
      "missile",
      "computer",
      "shield",
      "hull",
      "drive",
      "source",
    ];
    return Object.fromEntries(
      types.map((type) => [
        type,
        type === "all" ? ALL_PARTS.length : getPartsByType(type).length,
      ]),
    ) as Record<PartSlotType | "all", number>;
  }, []);

  // Calculate source counts
  const sourceCounts = useMemo(() => {
    const sources: SourceFilter[] = [
      "all",
      "starting",
      "technology",
      "ancient",
      "discovery",
    ];
    return Object.fromEntries(
      sources.map((s) => [
        s,
        s === "all"
          ? ALL_PARTS.length
          : getPartsBySource(s as PartSource).length,
      ]),
    ) as Record<SourceFilter, number>;
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ship Parts"
        description="Weapons, shields, drives, and energy sources"
        actions={<NotationToggle />}
      />

      {/* Type Filter */}
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Part Type
          </label>
          <PartTypeFilter
            selected={partType}
            onChange={setPartType}
            counts={typeCounts}
          />
        </div>

        {/* Source Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Source
          </label>
          <PartSourceFilter
            selected={source}
            onChange={(s) => setSource(s as SourceFilter)}
            counts={sourceCounts}
          />
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
          >
            {showLegend ? "Hide Legend" : "Show Legend"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredParts.length} parts
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SearchFilter
            value={search}
            onChange={setSearch}
            placeholder="Search parts..."
            className="w-48"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
            title={
              viewMode === "grid"
                ? "Switch to table view"
                : "Switch to grid view"
            }
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {showLegend && <NotationLegend />}

      {/* Parts Display */}
      {viewMode === "grid" ? (
        <PartGrid parts={filteredParts} />
      ) : (
        <PartTable parts={filteredParts} />
      )}

      {filteredParts.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No ship parts match your filters
        </div>
      )}
    </div>
  );
}
