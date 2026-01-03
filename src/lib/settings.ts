/**
 * User Settings Storage
 * Manages user preferences in localStorage
 */

import type { UserSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";

const SETTINGS_KEY = "eclipse-calculator-settings";

/**
 * Get current user settings from localStorage
 * Returns defaults if no settings are saved or on SSR
 */
export function getSettings(): UserSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(stored) as Partial<UserSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Update user settings in localStorage
 * Merges with existing settings
 */
export function updateSettings(partial: Partial<UserSettings>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const current = getSettings();
    const updated = { ...current, ...partial };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
