"use client";

import { Suspense } from "react";
import {
  SearchInput,
  MultiToggleFilter,
  ActiveFilters,
  FilterAccordion,
} from "@/components/filters";
import { SearchProvider, useSearch } from "@/components/search/search-context";
import { SearchResultCard } from "@/components/search/search-result-card";
import {
  EmptyStateNoParams,
  EmptyStateNoResults,
} from "@/components/search/empty-state";

function SearchPageContent() {
  const {
    state: {
      query,
      selectedCategories,
      results,
      categoryOptions,
      activeFilters,
      hasSearchParams,
    },
    actions: { updateQuery, updateCategories, removeFilter, clearAll },
  } = useSearch();

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
          onChange={updateQuery}
          placeholder="Search rules... (e.g., retreat, missiles, initiative)"
          debounceMs={300}
          autoFocus
          className="max-w-xl"
        />

        {/* Active Filters */}
        <ActiveFilters
          filters={activeFilters}
          onRemove={removeFilter}
          onClearAll={clearAll}
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
            onChange={updateCategories}
          />
        </FilterAccordion>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "result" : "results"} found
        </p>

        {/* Results List */}
        <div className="space-y-4">
          {results.length === 0 && !hasSearchParams && <EmptyStateNoParams />}
          {results.length === 0 && hasSearchParams && <EmptyStateNoResults />}
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </div>
      </div>
    </div>
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
      <SearchProvider>
        <SearchPageContent />
      </SearchProvider>
    </Suspense>
  );
}
