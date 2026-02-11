"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchRules } from "@/lib/rules/search";
import {
  getRulesIndex,
  getAllCategories,
  getCategoryCounts,
} from "@/lib/data/rules-index";
import {
  categoriesToFilterOptions,
  getCategoryLabels,
  getCategoryBadgeColors,
} from "@/lib/rules/categories";
import { deserializeArray, serializeArray } from "@/lib/filters/url-helpers";
import { buildActiveFilters } from "@/components/filters";
import type { SearchResult, FilterOption } from "@/lib/types";

// ============================================================================
// Context Interface
// ============================================================================

interface SearchState {
  query: string;
  selectedCategories: string[];
  results: SearchResult[];
  allCategories: string[];
  categoryCounts: Record<string, number>;
  categoryOptions: FilterOption<string>[];
  activeFilters: Array<{
    type: string;
    value: string;
    label: string;
    color?: string;
  }>;
  hasSearchParams: boolean;
}

interface SearchActions {
  updateQuery: (query: string) => void;
  updateCategories: (categories: string[]) => void;
  removeFilter: (type: string, value: string) => void;
  clearAll: () => void;
  toggleCategory: (category: string) => void;
}

interface SearchContextValue {
  state: SearchState;
  actions: SearchActions;
}

const SearchContext = createContext<SearchContextValue | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

export function SearchProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL state
  const query = searchParams.get("q") ?? "";
  const selectedCategories = useMemo(
    () => deserializeArray(searchParams.get("categories")),
    [searchParams],
  );

  // Get available categories and counts (static data, no memoization needed)
  const allCategories = getAllCategories();
  const categoryCounts = getCategoryCounts();
  const categoryOptions = categoriesToFilterOptions(
    allCategories,
    categoryCounts,
  );

  // Derived state
  const hasSearchParams = query.length > 0 || selectedCategories.length > 0;

  // Perform search
  const results = useMemo(() => {
    if (!hasSearchParams) return [];
    return searchRules(getRulesIndex(), {
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

  // URL update helper
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

  // Actions
  const actions: SearchActions = useMemo(
    () => ({
      updateQuery: (newQuery: string) => {
        updateUrl(newQuery, selectedCategories);
      },
      updateCategories: (newCategories: string[]) => {
        updateUrl(query, newCategories);
      },
      removeFilter: (type: string, value: string) => {
        if (type === "search") {
          updateUrl("", selectedCategories);
        } else {
          updateUrl(
            query,
            selectedCategories.filter((c) => c !== value),
          );
        }
      },
      clearAll: () => {
        router.push("/search");
      },
      toggleCategory: (category: string) => {
        const newCategories = selectedCategories.includes(category)
          ? selectedCategories.filter((c) => c !== category)
          : [...selectedCategories, category];
        updateUrl(query, newCategories);
      },
    }),
    [query, selectedCategories, updateUrl, router],
  );

  const state: SearchState = {
    query,
    selectedCategories,
    results,
    allCategories,
    categoryCounts,
    categoryOptions,
    activeFilters,
    hasSearchParams,
  };

  return <SearchContext value={{ state, actions }}>{children}</SearchContext>;
}

// ============================================================================
// Hook for consuming context
// ============================================================================

export function useSearch() {
  const context = use(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
