"use client";

import { Suspense, useMemo, useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PageHeader,
  NotationToggle,
  NotationLegend,
  TechGrid,
  TechTable,
} from "@/components/reference";
import {
  SearchInput,
  SingleToggleFilter,
  ActiveFilters,
} from "@/components/filters";
import {
  getTechCategoryOptions,
  TECH_CATEGORY_LABELS,
  TECH_CATEGORY_BADGE_COLORS,
} from "@/lib/filters/reference-options";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TECHS, getTechsByCategory } from "@/lib/data";
import type { TechCategory, ActiveFilter } from "@/lib/types";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "grid" | "table";

function TechsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-20" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}

function TechsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showLegend, setShowLegend] = useState(false);

  // Parse URL state
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") as TechCategory | null;
  const viewMode = (searchParams.get("view") as ViewMode) ?? "grid";

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
      router.push(qs ? `/reference/techs?${qs}` : "/reference/techs");
    },
    [router, searchParams],
  );

  // Calculate counts for each category
  const counts = useMemo(() => {
    const categories: TechCategory[] = ["military", "grid", "nano", "rare"];
    return Object.fromEntries(
      categories.map((cat) => [cat, getTechsByCategory(cat).length]),
    ) as Record<TechCategory, number>;
  }, []);

  // Filter options with counts
  const categoryOptions = useMemo(
    () => getTechCategoryOptions(counts),
    [counts],
  );

  // Filter techs
  const filteredTechs = useMemo(() => {
    let result = category === null ? TECHS : getTechsByCategory(category);

    if (query) {
      const searchLower = query.toLowerCase();
      result = result.filter(
        (tech) =>
          tech.name.toLowerCase().includes(searchLower) ||
          tech.effect.toLowerCase().includes(searchLower),
      );
    }

    return result;
  }, [category, query]);

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

    if (category) {
      filters.push({
        type: "Category",
        value: category,
        label: TECH_CATEGORY_LABELS[category],
        color: TECH_CATEGORY_BADGE_COLORS[category],
      });
    }

    return filters;
  }, [query, category]);

  // Handlers
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      updateUrl({ q: newQuery || null });
    },
    [updateUrl],
  );

  const handleCategoryChange = useCallback(
    (newCategory: TechCategory | null) => {
      updateUrl({ category: newCategory });
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
      } else if (type === "Category") {
        updateUrl({ category: null });
      }
    },
    [updateUrl],
  );

  const handleClearAll = useCallback(() => {
    router.push("/reference/techs");
  }, [router]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technologies"
        description="Tech tree with costs, categories, and effects"
        actions={<NotationToggle />}
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SingleToggleFilter
          options={categoryOptions}
          selected={category}
          onChange={handleCategoryChange}
          includeAllOption
          allCount={TECHS.length}
        />
        <div className="flex items-center gap-2">
          <SearchInput
            value={query}
            onChange={handleQueryChange}
            placeholder="Search techs..."
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

      {/* Active Filters */}
      <ActiveFilters
        filters={activeFilters}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

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

export default function TechsPage() {
  return (
    <Suspense fallback={<TechsPageSkeleton />}>
      <TechsPageContent />
    </Suspense>
  );
}
