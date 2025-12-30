"use client";

import { useState, useMemo } from "react";
import {
  PageHeader,
  DifferenceSection,
  DifferenceTable,
  SearchFilter,
} from "@/components/reference";
import { Button } from "@/components/ui/button";
import { DIFFERENCES } from "@/lib/data";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "sections" | "table";

export default function DifferencesPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("sections");

  // Filter differences by search
  const filteredDifferences = useMemo(() => {
    if (!search) return DIFFERENCES;

    const searchLower = search.toLowerCase();
    return DIFFERENCES.filter(
      (diff) =>
        diff.title.toLowerCase().includes(searchLower) ||
        diff.description.toLowerCase().includes(searchLower),
    );
  }, [search]);

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
              onClick={() => setViewMode("sections")}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Sections
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="mr-2 h-4 w-4" />
              Table
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search differences..."
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
