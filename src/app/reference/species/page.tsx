"use client";

import { Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PageHeader,
  SpeciesGrid,
  SpeciesCompare,
} from "@/components/reference";
import { SearchInput } from "@/components/filters";
import { serializeArray, deserializeArray } from "@/lib/filters/url-helpers";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SPECIES, getSpeciesById } from "@/lib/data";
import type { SpeciesId } from "@/lib/types";
import { GitCompare } from "lucide-react";

function SpeciesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}

function SpeciesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL state
  const query = searchParams.get("q") ?? "";
  const selectedIds = useMemo(
    () => deserializeArray(searchParams.get("compare")),
    [searchParams],
  );
  const compareOpen = searchParams.get("dialog") === "compare";

  // URL update helper
  const updateUrl = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            params.delete(key);
          } else {
            params.set(key, serializeArray(value));
          }
        } else {
          params.set(key, value);
        }
      }

      const qs = params.toString();
      router.push(qs ? `/reference/species?${qs}` : "/reference/species");
    },
    [router, searchParams],
  );

  // Filter species
  const filteredSpecies = useMemo(() => {
    if (!query) return SPECIES;

    const searchLower = query.toLowerCase();
    return SPECIES.filter(
      (species) =>
        species.name.toLowerCase().includes(searchLower) ||
        species.fullName.toLowerCase().includes(searchLower) ||
        species.specialAbilities.some(
          (a) =>
            a.name.toLowerCase().includes(searchLower) ||
            a.description.toLowerCase().includes(searchLower),
        ),
    );
  }, [query]);

  // Handle compare toggle
  const handleCompareToggle = useCallback(
    (id: string) => {
      const newIds = selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id];
      updateUrl({ compare: newIds });
    },
    [selectedIds, updateUrl],
  );

  // Get selected species data
  const selectedSpecies = useMemo(() => {
    return selectedIds
      .map((id) => getSpeciesById(id as SpeciesId))
      .filter(Boolean) as NonNullable<ReturnType<typeof getSpeciesById>>[];
  }, [selectedIds]);

  // Handlers
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      updateUrl({ q: newQuery || null });
    },
    [updateUrl],
  );

  const handleOpenCompare = useCallback(() => {
    updateUrl({ dialog: "compare" });
  }, [updateUrl]);

  const handleCloseCompare = useCallback(
    (open: boolean) => {
      if (!open) {
        updateUrl({ dialog: null });
      }
    },
    [updateUrl],
  );

  const handleClearSelection = useCallback(() => {
    updateUrl({ compare: null });
  }, [updateUrl]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Species"
        description="Starting conditions and special abilities for each faction"
        actions={
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button onClick={handleOpenCompare}>
                <GitCompare className="mr-2 h-4 w-4" />
                Compare ({selectedIds.length})
              </Button>
            )}
            {selectedIds.length > 0 && (
              <Button variant="outline" onClick={handleClearSelection}>
                Clear
              </Button>
            )}
          </div>
        }
      />

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          placeholder="Search species..."
          debounceMs={200}
          className="w-64"
        />
        <span className="text-sm text-muted-foreground">
          {filteredSpecies.length} species
        </span>
      </div>

      {/* Instructions */}
      <p className="text-sm text-muted-foreground">
        Select multiple species to compare them side-by-side. Click on a species
        card to expand its special abilities.
      </p>

      {/* Species Grid */}
      <SpeciesGrid
        species={filteredSpecies}
        selectedIds={selectedIds}
        onCompareToggle={handleCompareToggle}
      />

      {filteredSpecies.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No species match your search
        </div>
      )}

      {/* Compare Dialog */}
      <SpeciesCompare
        species={selectedSpecies}
        open={compareOpen}
        onOpenChange={handleCloseCompare}
      />
    </div>
  );
}

export default function SpeciesPage() {
  return (
    <Suspense fallback={<SpeciesPageSkeleton />}>
      <SpeciesPageContent />
    </Suspense>
  );
}
