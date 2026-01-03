"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActiveFilter } from "@/lib/types";

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (type: string, value: string) => void;
  onClearAll: () => void;
  className?: string;
}

/**
 * Display active filters as color-coded badges with remove buttons
 * Shows a "Clear all" button when multiple filters are active
 */
export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2 py-3", className)}>
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {filters.map((filter) => (
        <span
          key={`${filter.type}-${filter.value}`}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm",
            filter.color || "bg-primary/10 text-primary",
          )}
        >
          {filter.type !== "search" && (
            <span className="text-xs opacity-70">{filter.type}:</span>
          )}
          {filter.label}
          <button
            onClick={() => onRemove(filter.type, filter.value)}
            className="ml-1 rounded-full p-0.5 hover:bg-black/10"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {filters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}

/**
 * Helper to build ActiveFilter array from filter state
 */
export function buildActiveFilters(
  categories: string[],
  categoryLabels: Record<string, string>,
  categoryColors: Record<string, string>,
  searchQuery?: string,
): ActiveFilter[] {
  const filters: ActiveFilter[] = [];

  // Add search query as a filter
  if (searchQuery) {
    filters.push({
      type: "search",
      value: searchQuery,
      label: `"${searchQuery}"`,
      color: "bg-blue-100 text-blue-800",
    });
  }

  // Add category filters
  for (const category of categories) {
    filters.push({
      type: "Category",
      value: category,
      label: categoryLabels[category] || category,
      color: categoryColors[category] || "bg-gray-100 text-gray-800",
    });
  }

  return filters;
}
