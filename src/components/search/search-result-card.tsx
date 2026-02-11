"use client";

import { memo } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RuleContent } from "@/components/search/rule-content";
import { cn } from "@/lib/utils";
import { getCategoryColor, getCategoryLabel } from "@/lib/rules/categories";
import { useSearch } from "./search-context";
import type { SearchResult } from "@/lib/types";

interface SearchResultCardProps {
  result: SearchResult;
}

export const SearchResultCard = memo(function SearchResultCard({
  result,
}: SearchResultCardProps) {
  const {
    state: { selectedCategories },
    actions: { toggleCategory },
  } = useSearch();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg">{result.heading}</CardTitle>
          <div className="flex flex-wrap gap-1 shrink-0">
            {result.categories.slice(0, 3).map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <CategoryBadge
                  key={category}
                  category={category}
                  isSelected={isSelected}
                  onClick={() => toggleCategory(category)}
                />
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <RuleContent
          content={result.fullContent}
          preview={result.matchedText}
        />
        {result.referenceLink && (
          <Link
            href={result.referenceLink}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
          >
            View in Reference
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
});

// Memoized category badge to prevent inline function recreation
const CategoryBadge = memo(function CategoryBadge({
  category,
  isSelected,
  onClick,
}: {
  category: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
        getCategoryColor(category),
        "text-white",
        isSelected
          ? "ring-2 ring-primary ring-offset-1"
          : "opacity-80 hover:opacity-100",
      )}
    >
      {getCategoryLabel(category)}
    </button>
  );
});
