/**
 * Filter System Types for Eclipse Calculator
 * Reusable types for URL-driven filtering
 */

/**
 * Generic filter option for toggle buttons
 */
export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
  count?: number;
  color?: string;
  icon?: string;
}

/**
 * Represents an active filter that can be displayed and removed
 */
export interface ActiveFilter {
  type: string;
  value: string;
  label: string;
  color?: string;
}

/**
 * URL filter state as key-value pairs
 */
export interface UrlFilterState {
  [key: string]: string | string[] | undefined;
}

/**
 * Generic filter change handler type
 */
export type FilterChangeHandler<T> = (value: T) => void;

/**
 * Multi-select filter change handler (for array values)
 */
export type MultiFilterChangeHandler = (values: string[]) => void;
