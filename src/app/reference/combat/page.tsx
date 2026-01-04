"use client";

import { Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PageHeader,
  CombatRulesList,
  CombatQuickReference,
} from "@/components/reference";
import { SearchInput } from "@/components/filters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { COMBAT_RULES } from "@/lib/data";
import { BookOpen, Zap } from "lucide-react";

type ViewMode = "full" | "quick";

function CombatPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

function CombatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL state
  const query = searchParams.get("q") ?? "";
  const viewMode = (searchParams.get("view") as ViewMode) ?? "full";

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
      router.push(qs ? `/reference/combat?${qs}` : "/reference/combat");
    },
    [router, searchParams],
  );

  // Filter sections by search
  const filteredSections = useMemo(() => {
    if (!query) return COMBAT_RULES;

    const searchLower = query.toLowerCase();
    return COMBAT_RULES.filter((section) => {
      return (
        section.title.toLowerCase().includes(searchLower) ||
        section.content.toLowerCase().includes(searchLower) ||
        section.subsections?.some(
          (sub) =>
            sub.title.toLowerCase().includes(searchLower) ||
            sub.content.toLowerCase().includes(searchLower),
        ) ||
        section.tips?.some((tip) => tip.toLowerCase().includes(searchLower)) ||
        section.examples?.some((ex) => ex.toLowerCase().includes(searchLower))
      );
    });
  }, [query]);

  // Handlers
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      updateUrl({ q: newQuery || null });
    },
    [updateUrl],
  );

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      updateUrl({ view: mode === "full" ? null : mode });
    },
    [updateUrl],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Combat Rules"
        description="Battle mechanics and quick reference for Eclipse combat"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "full" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("full")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Full Rules
            </Button>
            <Button
              variant={viewMode === "quick" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("quick")}
            >
              <Zap className="mr-2 h-4 w-4" />
              Quick Ref
            </Button>
          </div>
        }
      />

      {viewMode === "full" ? (
        <>
          {/* Search */}
          <div className="flex items-center justify-between gap-4">
            <SearchInput
              value={query}
              onChange={handleQueryChange}
              placeholder="Search rules..."
              debounceMs={200}
              className="w-64"
            />
            <span className="text-sm text-muted-foreground">
              {filteredSections.length} sections
            </span>
          </div>

          {/* Combat Rules */}
          <CombatRulesList sections={filteredSections} />

          {filteredSections.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No rules match your search
            </div>
          )}
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <CombatQuickReference />

          {/* Combat Steps Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Combat Phase Steps</h3>
            <ol className="list-inside list-decimal space-y-2 text-sm">
              <li>
                <strong>Determine Battles</strong> - Identify sectors with
                opposing ships
              </li>
              <li>
                <strong>Resolve Battles</strong> - Resolve in descending sector
                number order
              </li>
              <li>
                <strong>Attack Population</strong> - Ships attack population
                cubes
              </li>
              <li>
                <strong>Influence Sectors</strong> - Take control of
                uncontrolled sectors
              </li>
              <li>
                <strong>Discovery Tiles</strong> - Claim undefended discovery
                tiles
              </li>
              <li>
                <strong>Repair Damage</strong> - Remove all damage cubes
              </li>
            </ol>

            <h3 className="mt-6 text-lg font-semibold">Battle Steps</h3>
            <ol className="list-inside list-decimal space-y-2 text-sm">
              <li>Determine Attacker and Defender</li>
              <li>Calculate Initiative for each ship type</li>
              <li>
                <strong>Fire Missiles</strong> (first round only)
              </li>
              <li>
                <strong>Engagement Rounds</strong> - Attack or Retreat in
                initiative order
              </li>
              <li>Repeat until one side destroyed or retreated</li>
              <li>Draw Reputation Tiles</li>
            </ol>

            <h3 className="mt-6 text-lg font-semibold">Key Reminders</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Defender wins initiative ties</li>
              <li>Natural 6 always hits, natural 1 always misses</li>
              <li>Missiles fire once per battle (before first engagement)</li>
              <li>Overkill damage is wasted</li>
              <li>Max 5 reputation tiles per battle</li>
              <li>Retreating loses participation reputation</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CombatPage() {
  return (
    <Suspense fallback={<CombatPageSkeleton />}>
      <CombatPageContent />
    </Suspense>
  );
}
