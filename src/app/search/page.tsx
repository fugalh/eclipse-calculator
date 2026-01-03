"use client";

import { Suspense, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RuleContent } from "@/components/search/rule-content";
import { cn } from "@/lib/utils";
import {
  SearchInput,
  MultiToggleFilter,
  ActiveFilters,
  FilterAccordion,
  buildActiveFilters,
} from "@/components/filters";
import { deserializeArray, serializeArray } from "@/lib/filters/url-helpers";
import { searchRules } from "@/lib/rules/search";
import {
  categoriesToFilterOptions,
  getCategoryLabels,
  getCategoryBadgeColors,
  getCategoryColor,
  getCategoryLabel,
} from "@/lib/rules/categories";
import {
  RULES_INDEX,
  getAllCategories,
  getCategoryCounts,
} from "@/lib/data/rules-index";
import type { SearchResult } from "@/lib/types";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL state
  const query = searchParams.get("q") ?? "";
  const selectedCategories = useMemo(
    () => deserializeArray(searchParams.get("categories")),
    [searchParams],
  );

  // Get available categories and counts
  const allCategories = useMemo(() => getAllCategories(), []);
  const categoryCounts = useMemo(() => getCategoryCounts(), []);
  const categoryOptions = useMemo(
    () => categoriesToFilterOptions(allCategories, categoryCounts),
    [allCategories, categoryCounts],
  );

  // Check if any search params are active
  const hasSearchParams = query || selectedCategories.length > 0;

  // Perform search (returns empty if no params)
  const results = useMemo(() => {
    if (!hasSearchParams) return [];
    return searchRules(RULES_INDEX, {
      query,
      categories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
      limit: 50,
    });
  }, [query, selectedCategories, hasSearchParams]);

  // Build active filters for display
  const activeFilters = useMemo(() => {
    return buildActiveFilters(
      selectedCategories,
      getCategoryLabels(),
      getCategoryBadgeColors(),
      query || undefined,
    );
  }, [selectedCategories, query]);

  // URL update helpers
  const updateUrl = useCallback(
    (newQuery: string, newCategories: string[]) => {
      const params = new URLSearchParams();
      if (newQuery) params.set("q", newQuery);
      if (newCategories.length > 0) {
        params.set("categories", serializeArray(newCategories));
      }
      const queryString = params.toString();
      router.push(queryString ? `/search?${queryString}` : "/search");
    },
    [router],
  );

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      updateUrl(newQuery, selectedCategories);
    },
    [updateUrl, selectedCategories],
  );

  const handleCategoriesChange = useCallback(
    (newCategories: string[]) => {
      updateUrl(query, newCategories);
    },
    [updateUrl, query],
  );

  const handleRemoveFilter = useCallback(
    (type: string, value: string) => {
      if (type === "search") {
        updateUrl("", selectedCategories);
      } else {
        updateUrl(
          query,
          selectedCategories.filter((c) => c !== value),
        );
      }
    },
    [updateUrl, query, selectedCategories],
  );

  const handleClearAll = useCallback(() => {
    router.push("/search");
  }, [router]);

  const handleCategoryClick = useCallback(
    (category: string) => {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      updateUrl(query, newCategories);
    },
    [selectedCategories, query, updateUrl],
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rule Search</h1>
          <p className="text-muted-foreground mt-2">
            Search the Eclipse: Second Dawn rulebook for specific rules,
            mechanics, and clarifications.
          </p>
        </div>

        {/* Search Input */}
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          placeholder="Search rules... (e.g., retreat, missiles, initiative)"
          debounceMs={300}
          autoFocus
          className="max-w-xl"
        />

        {/* Active Filters */}
        <ActiveFilters
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAll}
        />

        {/* Category Filter */}
        <FilterAccordion
          title="Filter by Category"
          defaultOpen={false}
          badge={selectedCategories.length}
        >
          <MultiToggleFilter
            options={categoryOptions}
            selected={selectedCategories}
            onChange={handleCategoriesChange}
          />
        </FilterAccordion>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "result" : "results"} found
        </p>

        {/* Results List */}
        <div className="space-y-4">
          {results.length === 0 && !hasSearchParams && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Enter a search term or select categories to find rules.
              </CardContent>
            </Card>
          )}

          {results.length === 0 && hasSearchParams && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No results found. Try different keywords or broaden your
                category filter.
              </CardContent>
            </Card>
          )}

          {results.map((result) => (
            <SearchResultCard
              key={result.id}
              result={result}
              query={query}
              selectedCategories={selectedCategories}
              onCategoryClick={handleCategoryClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SearchResultCardProps {
  result: SearchResult;
  query: string;
  selectedCategories: string[];
  onCategoryClick: (category: string) => void;
}

function SearchResultCard({
  result,
  selectedCategories,
  onCategoryClick,
}: SearchResultCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg">{result.heading}</CardTitle>
          <div className="flex flex-wrap gap-1 shrink-0">
            {result.categories.slice(0, 3).map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => onCategoryClick(category)}
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
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-muted rounded w-1/3" />
            <div className="h-10 bg-muted rounded w-full max-w-xl" />
            <div className="h-40 bg-muted rounded" />
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
