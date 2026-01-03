"use client";

import { Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PageHeader,
  DifferenceSection,
  DifferenceTable,
} from "@/components/reference";
import { SearchInput } from "@/components/filters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DIFFERENCES } from "@/lib/data";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "sections" | "table";

function DifferencesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

function DifferencesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL state
  const query = searchParams.get("q") ?? "";
  const viewMode = (searchParams.get("view") as ViewMode) ?? "sections";

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
      router.push(
        qs ? `/reference/differences?${qs}` : "/reference/differences",
      );
    },
    [router, searchParams],
  );

  // Filter differences by search
  const filteredDifferences = useMemo(() => {
    if (!query) return DIFFERENCES;

    const searchLower = query.toLowerCase();
    return DIFFERENCES.filter(
      (diff) =>
        diff.title.toLowerCase().includes(searchLower) ||
        diff.description.toLowerCase().includes(searchLower),
    );
  }, [query]);

  // Get filtered by category for sections view
  const notable = useMemo(
    () => filteredDifferences.filter((d) => d.category === "notable"),
    [filteredDifferences],
  );
  const discovery = useMemo(
    () => filteredDifferences.filter((d) => d.category === "discovery"),
    [filteredDifferences],
  );
  const minor = useMemo(
    () => filteredDifferences.filter((d) => d.category === "minor"),
    [filteredDifferences],
  );

  // Handlers
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      updateUrl({ q: newQuery || null });
    },
    [updateUrl],
  );

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      updateUrl({ view: mode === "sections" ? null : mode });
    },
    [updateUrl],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edition Differences"
        description="Changes from New Dawn (2011) to Second Dawn (2020)"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "sections" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("sections")}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Sections
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("table")}
            >
              <List className="mr-2 h-4 w-4" />
              Table
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          placeholder="Search differences..."
          debounceMs={200}
          className="w-64"
        />
        <span className="text-sm text-muted-foreground">
          {filteredDifferences.length} changes
        </span>
      </div>

      {viewMode === "sections" ? (
        <div className="space-y-8">
          {notable.length > 0 && (
            <DifferenceSection category="notable" differences={notable} />
          )}
          {discovery.length > 0 && (
            <DifferenceSection category="discovery" differences={discovery} />
          )}
          {minor.length > 0 && (
            <DifferenceSection category="minor" differences={minor} />
          )}
        </div>
      ) : (
        <DifferenceTable differences={filteredDifferences} />
      )}

      {filteredDifferences.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No differences match your search
        </div>
      )}
    </div>
  );
}

export default function DifferencesPage() {
  return (
    <Suspense fallback={<DifferencesPageSkeleton />}>
      <DifferencesPageContent />
    </Suspense>
  );
}
