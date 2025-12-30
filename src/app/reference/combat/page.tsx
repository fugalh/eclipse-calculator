"use client";

import { useState } from "react";
import {
  PageHeader,
  CombatRulesList,
  CombatQuickReference,
  SearchFilter,
} from "@/components/reference";
import { Button } from "@/components/ui/button";
import { COMBAT_RULES } from "@/lib/data";
import { BookOpen, Zap } from "lucide-react";

type ViewMode = "full" | "quick";

export default function CombatPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("full");

  // Filter sections by search
  const filteredSections = search
    ? COMBAT_RULES.filter((section) => {
        const searchLower = search.toLowerCase();
        return (
          section.title.toLowerCase().includes(searchLower) ||
          section.content.toLowerCase().includes(searchLower) ||
          section.subsections?.some(
            (sub) =>
              sub.title.toLowerCase().includes(searchLower) ||
              sub.content.toLowerCase().includes(searchLower),
          ) ||
          section.tips?.some((tip) =>
            tip.toLowerCase().includes(searchLower),
          ) ||
          section.examples?.some((ex) => ex.toLowerCase().includes(searchLower))
        );
      })
    : COMBAT_RULES;

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
              onClick={() => setViewMode("full")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Full Rules
            </Button>
            <Button
              variant={viewMode === "quick" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("quick")}
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
            <SearchFilter
              value={search}
              onChange={setSearch}
              placeholder="Search rules..."
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
