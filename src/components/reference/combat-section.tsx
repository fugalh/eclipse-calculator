"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Lightbulb, FileText } from "lucide-react";
import type { CombatRuleSection } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CombatSectionCardProps {
  section: CombatRuleSection;
  className?: string;
  defaultExpanded?: boolean;
}

export function CombatSectionCard({
  section,
  className,
  defaultExpanded = false,
}: CombatSectionCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasDetails = section.subsections || section.examples || section.tips;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Button
            variant="ghost"
            className="h-auto p-0 text-left hover:bg-transparent"
            onClick={() => hasDetails && setExpanded(!expanded)}
            disabled={!hasDetails}
          >
            <div className="flex items-center gap-2">
              {hasDetails &&
                (expanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                ))}
              <CardTitle className="text-base">{section.title}</CardTitle>
            </div>
          </Button>
          {section.subsections && (
            <Badge variant="secondary" className="shrink-0">
              {section.subsections.length} subsections
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{section.content}</p>
      </CardHeader>

      {expanded && hasDetails && (
        <CardContent className="space-y-4">
          {/* Subsections */}
          {section.subsections && (
            <div className="space-y-3">
              {section.subsections.map((sub) => (
                <div key={sub.id} className="rounded-lg border bg-muted/30 p-3">
                  <h4 className="mb-1 font-medium">{sub.title}</h4>
                  <p className="text-sm text-muted-foreground">{sub.content}</p>
                  {sub.examples && (
                    <div className="mt-2 space-y-1">
                      {sub.examples.map((ex, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <FileText className="mt-0.5 h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{ex}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Examples */}
          {section.examples && (
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
              <h4 className="mb-2 flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4 text-blue-500" />
                Examples
              </h4>
              <ul className="space-y-1 text-sm">
                {section.examples.map((ex, i) => (
                  <li key={i} className="text-muted-foreground">
                    • {ex}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {section.tips && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
              <h4 className="mb-2 flex items-center gap-2 font-medium">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Tips
              </h4>
              <ul className="space-y-1 text-sm">
                {section.tips.map((tip, i) => (
                  <li key={i} className="text-muted-foreground">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

interface CombatRulesListProps {
  sections: CombatRuleSection[];
  className?: string;
}

export function CombatRulesList({ sections, className }: CombatRulesListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {sections.map((section) => (
        <CombatSectionCard key={section.id} section={section} />
      ))}
    </div>
  );
}

/**
 * Quick reference panel for combat
 */
export function CombatQuickReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Reference</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hit Formula */}
        <div className="rounded-lg bg-muted p-3">
          <h4 className="mb-2 font-medium">Hit Formula</h4>
          <code className="text-sm">
            Die Roll + Computers - Shields ≥ 6 = Hit
          </code>
          <p className="mt-1 text-xs text-muted-foreground">
            Natural 6 always hits, natural 1 always misses
          </p>
        </div>

        {/* Dice Damage */}
        <div className="rounded-lg bg-muted p-3">
          <h4 className="mb-2 font-medium">Dice Damage</h4>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-yellow-400 text-black">Yellow: 1</Badge>
            <Badge className="bg-orange-500 text-white">Orange: 2</Badge>
            <Badge className="bg-blue-500 text-white">Blue: 3</Badge>
            <Badge className="bg-red-500 text-white">Red: 4</Badge>
          </div>
        </div>

        {/* Base Initiative */}
        <div className="rounded-lg bg-muted p-3">
          <h4 className="mb-2 font-medium">Base Ship Initiative</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Starbase: +4</div>
            <div>Interceptor: +2</div>
            <div>Cruiser: +1</div>
            <div>Dreadnought: 0</div>
          </div>
        </div>

        {/* Reputation */}
        <div className="rounded-lg bg-muted p-3">
          <h4 className="mb-2 font-medium">Reputation Tiles</h4>
          <div className="text-sm text-muted-foreground">
            <p>Participation: 1 tile</p>
            <p>Interceptor/Starbase/Ancient: 1 tile each</p>
            <p>Cruiser/Guardian: 2 tiles each</p>
            <p>Dreadnought/GCDS: 3 tiles each</p>
            <p className="mt-1 font-medium text-foreground">Max 5 per battle</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
