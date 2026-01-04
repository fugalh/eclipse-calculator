"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  serializeArray,
  deserializeArray,
  buildSearchParams,
} from "@/lib/filters/url-helpers";

/**
 * Hook for managing a single string filter in URL search params
 */
export function useUrlFilter(
  paramName: string,
  defaultValue: string = "",
): [string, (value: string) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = searchParams.get(paramName) ?? defaultValue;

  const setValue = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams);
      if (newValue === "" || newValue === defaultValue) {
        params.delete(paramName);
      } else {
        params.set(paramName, newValue);
      }
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : window.location.pathname);
    },
    [router, searchParams, paramName, defaultValue],
  );

  return [value, setValue];
}

/**
 * Hook for managing an array filter in URL search params (comma-separated)
 */
export function useUrlArrayFilter(
  paramName: string,
): [string[], (values: string[]) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();

  const values = useMemo(
    () => deserializeArray(searchParams.get(paramName)),
    [searchParams, paramName],
  );

  const setValues = useCallback(
    (newValues: string[]) => {
      const params = new URLSearchParams(searchParams);
      if (newValues.length === 0) {
        params.delete(paramName);
      } else {
        params.set(paramName, serializeArray(newValues));
      }
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : window.location.pathname);
    },
    [router, searchParams, paramName],
  );

  return [values, setValues];
}

/**
 * Hook for managing multiple filter params at once
 * Useful when you need to update multiple params atomically
 */
export function useUrlFilters(basePath: string = "") {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const queryString = buildSearchParams(updates, searchParams);
      const path = basePath || window.location.pathname;
      router.push(`${path}${queryString}`);
    },
    [router, searchParams, basePath],
  );

  const clearAllFilters = useCallback(() => {
    const path = basePath || window.location.pathname;
    router.push(path);
  }, [router, basePath]);

  return {
    searchParams,
    updateFilters,
    clearAllFilters,
  };
}
