"use client";

import { useState, useMemo } from "react";
import {
  PageHeader,
  NotationToggle,
  NotationLegend,
  TechGrid,
  TechTable,
  TechCategoryFilter,
  SearchFilter,
} from "@/components/reference";
import { Button } from "@/components/ui/button";
import { TECHS, getTechsByCategory } from "@/lib/data";
import type { TechCategory } from "@/lib/types";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "grid" | "table";

export default function TechsPage() {
  const [category, setCategory] = useState<TechCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showLegend, setShowLegend] = useState(false);

  // Filter techs
  const filteredTechs = useMemo(() => {
    let result = category === "all" ? TECHS : getTechsByCategory(category);

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (tech) =>
          tech.name.toLowerCase().includes(searchLower) ||
          tech.effect.toLowerCase().includes(searchLower),
      );
    }

    return result;
  }, [category, search]);

  // Calculate counts for each category
  const counts = useMemo(() => {
    const allCategories: (TechCategory | "all")[] = [
      "all",
      "military",
      "grid",
      "nano",
      "rare",
    ];
    return Object.fromEntries(
      allCategories.map((cat) => [
        cat,
        cat === "all" ? TECHS.length : getTechsByCategory(cat).length,
      ]),
    ) as Record<TechCategory | "all", number>;
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technologies"
        description="Tech tree with costs, categories, and effects"
        actions={<NotationToggle />}
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TechCategoryFilter
          selected={category}
          onChange={setCategory}
          counts={counts}
        />
        <div className="flex items-center gap-2">
          <SearchFilter
            value={search}
            onChange={setSearch}
            placeholder="Search techs..."
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

      {/* Legend Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLegend(!showLegend)}
        >
          {showLegend ? "Hide Legend" : "Show Legend"}
        </Button>
        <span className="text-sm text-muted-foreground">
          {filteredTechs.length} technologies
        </span>
      </div>

      {showLegend && <NotationLegend />}

      {/* Tech Display */}
      {viewMode === "grid" ? (
        <TechGrid techs={filteredTechs} />
      ) : (
        <TechTable techs={filteredTechs} />
      )}

      {filteredTechs.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No technologies match your filters
        </div>
      )}
    </div>
  );
}
