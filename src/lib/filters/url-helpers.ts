/**
 * URL Filter Helpers
 * Utilities for serializing/deserializing filter state to/from URL search params
 */

/**
 * Serialize an array of strings to a comma-separated URL param value
 */
export function serializeArray(values: string[]): string {
  return values.filter(Boolean).join(",");
}

/**
 * Deserialize a comma-separated URL param value to an array of strings
 */
export function deserializeArray(param: string | null): string[] {
  if (!param) return [];
  return param.split(",").filter(Boolean);
}

/**
 * Build a URL search params string from an object of updates
 * Handles strings, arrays, and null (for removal)
 */
export function buildSearchParams(
  updates: Record<string, string | string[] | null>,
  base?: URLSearchParams,
): string {
  const params = new URLSearchParams(base);

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        params.delete(key);
      } else {
        params.set(key, serializeArray(value));
      }
    } else if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  const result = params.toString();
  return result ? `?${result}` : "";
}

/**
 * Parse all filter-related params from URLSearchParams
 */
export function parseFilterParams(searchParams: URLSearchParams): {
  query: string;
  categories: string[];
  page: number;
} {
  return {
    query: searchParams.get("q") ?? "",
    categories: deserializeArray(searchParams.get("categories")),
    page: parseInt(searchParams.get("page") ?? "1", 10),
  };
}
