"use client";

import { Suspense, useMemo, useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PageHeader,
  NotationToggle,
  NotationLegend,
  PartGrid,
  PartTable,
} from "@/components/reference";
import {
  SearchInput,
  SingleToggleFilter,
  ActiveFilters,
} from "@/components/filters";
import {
  getPartTypeOptions,
  getPartSourceOptions,
  PART_TYPE_LABELS,
  PART_SOURCE_LABELS,
  PART_SOURCE_BADGE_COLORS,
} from "@/lib/filters/reference-options";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ALL_PARTS, getPartsByType, getPartsBySource } from "@/lib/data";
import type { PartSlotType, ActiveFilter } from "@/lib/types";
import type { PartSource } from "@/lib/data";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "grid" | "table";

function ShipPartsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-9 w-20" />
          ))}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-20" />
          ))}
        </div>
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function ShipPartsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showLegend, setShowLegend] = useState(false);

  // Parse URL state
  const query = searchParams.get("q") ?? "";
  const partType = searchParams.get("type") as PartSlotType | null;
  const source = searchParams.get("source") as PartSource | null;
  const viewMode = (searchParams.get("view") as ViewMode) ?? "table";

  // URL update helper
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.push(qs ? `/reference/ship-parts?${qs}` : "/reference/ship-parts");
    },
    [router, searchParams],
  );

  // Calculate type counts
  const typeCounts = useMemo(() => {
    const types: PartSlotType[] = [
      "cannon",
      "missile",
      "computer",
      "shield",
      "hull",
      "drive",
      "source",
    ];
    return Object.fromEntries(
      types.map((type) => [type, getPartsByType(type).length]),
    ) as Record<PartSlotType, number>;
  }, []);

  // Calculate source counts
  const sourceCounts = useMemo(() => {
    const sources: PartSource[] = [
      "starting",
      "technology",
      "ancient",
      "discovery",
    ];
    return Object.fromEntries(
      sources.map((s) => [s, getPartsBySource(s).length]),
    ) as Record<PartSource, number>;
  }, []);

  // Filter options with counts
  const typeOptions = useMemo(
    () => getPartTypeOptions(typeCounts),
    [typeCounts],
  );
  const sourceOptions = useMemo(
    () => getPartSourceOptions(sourceCounts),
    [sourceCounts],
  );

  // Filter parts
  const filteredParts = useMemo(() => {
    let result = ALL_PARTS;

    if (partType !== null) {
      result = result.filter((part) => part.type === partType);
    }

    if (source !== null) {
      result = result.filter((part) => part.source === source);
    }

    if (query) {
      const searchLower = query.toLowerCase();
      result = result.filter(
        (part) =>
          part.name.toLowerCase().includes(searchLower) ||
          part.effect.toLowerCase().includes(searchLower),
      );
    }

    return result;
  }, [partType, source, query]);

  // Build active filters for display
  const activeFilters = useMemo(() => {
    const filters: ActiveFilter[] = [];

    if (query) {
      filters.push({
        type: "search",
        value: query,
        label: `"${query}"`,
        color: "bg-blue-100 text-blue-800",
      });
    }

    if (partType) {
      filters.push({
        type: "Type",
        value: partType,
        label: PART_TYPE_LABELS[partType],
      });
    }

    if (source) {
      filters.push({
        type: "Source",
        value: source,
        label: PART_SOURCE_LABELS[source],
        color: PART_SOURCE_BADGE_COLORS[source],
      });
    }

    return filters;
  }, [query, partType, source]);

  // Handlers
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      updateUrl({ q: newQuery || null });
    },
    [updateUrl],
  );

  const handleTypeChange = useCallback(
    (newType: PartSlotType | null) => {
      updateUrl({ type: newType });
    },
    [updateUrl],
  );

  const handleSourceChange = useCallback(
    (newSource: PartSource | null) => {
      updateUrl({ source: newSource });
    },
    [updateUrl],
  );

  const handleViewModeToggle = useCallback(() => {
    updateUrl({ view: viewMode === "grid" ? "table" : "grid" });
  }, [updateUrl, viewMode]);

  const handleRemoveFilter = useCallback(
    (type: string) => {
      if (type === "search") {
        updateUrl({ q: null });
      } else if (type === "Type") {
        updateUrl({ type: null });
      } else if (type === "Source") {
        updateUrl({ source: null });
      }
    },
    [updateUrl],
  );

  const handleClearAll = useCallback(() => {
    router.push("/reference/ship-parts");
  }, [router]);

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
          <SingleToggleFilter
            options={typeOptions}
            selected={partType}
            onChange={handleTypeChange}
            includeAllOption
            allCount={ALL_PARTS.length}
          />
        </div>

        {/* Source Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Source
          </label>
          <SingleToggleFilter
            options={sourceOptions}
            selected={source}
            onChange={handleSourceChange}
            includeAllOption
            allCount={ALL_PARTS.length}
          />
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        filters={activeFilters}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

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
          <SearchInput
            value={query}
            onChange={handleQueryChange}
            placeholder="Search parts..."
            debounceMs={200}
            className="w-48"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleViewModeToggle}
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

export default function ShipPartsPage() {
  return (
    <Suspense fallback={<ShipPartsPageSkeleton />}>
      <ShipPartsPageContent />
    </Suspense>
  );
}
