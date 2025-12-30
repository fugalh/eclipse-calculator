"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TECH_CATEGORY_INFO, PART_TYPE_INFO } from "@/lib/data";
import type { TechCategory, PartSlotType } from "@/lib/types";
import { cn } from "@/lib/utils";

// ============================================================================
// Tech Category Filter
// ============================================================================

interface TechCategoryFilterProps {
  selected: TechCategory | "all";
  onChange: (category: TechCategory | "all") => void;
  counts?: Record<TechCategory | "all", number>;
  className?: string;
}

export function TechCategoryFilter({
  selected,
  onChange,
  counts,
  className,
}: TechCategoryFilterProps) {
  const categories: (TechCategory | "all")[] = [
    "all",
    "military",
    "grid",
    "nano",
    "rare",
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((cat) => {
        const isSelected = selected === cat;
        const info = cat === "all" ? null : TECH_CATEGORY_INFO[cat];

        return (
          <Button
            key={cat}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(cat)}
            className={cn(
              isSelected && cat !== "all" && info?.color,
              isSelected && cat !== "all" && "text-white",
            )}
          >
            {cat === "all" ? "All" : info?.label}
            {counts && (
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className="ml-2"
              >
                {counts[cat]}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Part Type Filter
// ============================================================================

interface PartTypeFilterProps {
  selected: PartSlotType | "all";
  onChange: (type: PartSlotType | "all") => void;
  counts?: Record<PartSlotType | "all", number>;
  className?: string;
}

export function PartTypeFilter({
  selected,
  onChange,
  counts,
  className,
}: PartTypeFilterProps) {
  const types: (PartSlotType | "all")[] = [
    "all",
    "cannon",
    "missile",
    "computer",
    "shield",
    "hull",
    "drive",
    "source",
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {types.map((type) => {
        const isSelected = selected === type;
        const info = type === "all" ? null : PART_TYPE_INFO[type];

        return (
          <Button
            key={type}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(type)}
          >
            {type === "all" ? "All" : info?.label}
            {counts && (
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className="ml-2"
              >
                {counts[type]}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Part Source Filter
// ============================================================================

type PartSourceType =
  | "all"
  | "starting"
  | "technology"
  | "ancient"
  | "discovery";

interface PartSourceFilterProps {
  selected: PartSourceType;
  onChange: (source: PartSourceType) => void;
  counts?: Record<PartSourceType, number>;
  className?: string;
}

const SOURCE_LABELS: Record<PartSourceType, string> = {
  all: "All",
  starting: "Starting",
  technology: "Tech",
  ancient: "Ancient",
  discovery: "Discovery",
};

export function PartSourceFilter({
  selected,
  onChange,
  counts,
  className,
}: PartSourceFilterProps) {
  const sources: PartSourceType[] = [
    "all",
    "starting",
    "technology",
    "ancient",
    "discovery",
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sources.map((source) => {
        const isSelected = selected === source;

        return (
          <Button
            key={source}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(source)}
          >
            {SOURCE_LABELS[source]}
            {counts && (
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className="ml-2"
              >
                {counts[source]}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Search Input
// ============================================================================

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchFilter({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchFilterProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-9 rounded-md border border-input bg-background px-3 text-sm",
        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
        className,
      )}
    />
  );
}
