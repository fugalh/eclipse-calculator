"use client";

import { useState, useMemo } from "react";
import {
  PageHeader,
  SpeciesGrid,
  SpeciesCompare,
  SearchFilter,
} from "@/components/reference";
import { Button } from "@/components/ui/button";
import { SPECIES, getSpeciesById } from "@/lib/data";
import type { SpeciesId } from "@/lib/types";
import { GitCompare } from "lucide-react";

export default function SpeciesPage() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  // Filter species
  const filteredSpecies = useMemo(() => {
    if (!search) return SPECIES;

    const searchLower = search.toLowerCase();
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
  }, [search]);

  // Handle compare toggle
  const handleCompareToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Get selected species data
  const selectedSpecies = useMemo(() => {
    return selectedIds
      .map((id) => getSpeciesById(id as SpeciesId))
      .filter(Boolean) as NonNullable<ReturnType<typeof getSpeciesById>>[];
  }, [selectedIds]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Species"
        description="Starting conditions and special abilities for each faction"
        actions={
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button onClick={() => setCompareOpen(true)}>
                <GitCompare className="mr-2 h-4 w-4" />
                Compare ({selectedIds.length})
              </Button>
            )}
            {selectedIds.length > 0 && (
              <Button variant="outline" onClick={() => setSelectedIds([])}>
                Clear
              </Button>
            )}
          </div>
        }
      />

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search species..."
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
        onOpenChange={setCompareOpen}
      />
    </div>
  );
}
