/**
 * Module-level cache for settings to avoid repeated localStorage reads
 * Implements Issue 12: Cache Storage API Calls
 */

import type { UserSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";

const SETTINGS_KEY = "eclipse-calculator-settings";

let settingsCache: UserSettings | null = null;

export function getCachedSettings(): UserSettings {
  if (settingsCache !== null) {
    return settingsCache;
  }

  // Only read localStorage once
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    settingsCache = stored
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
      : DEFAULT_SETTINGS;
  } catch {
    settingsCache = DEFAULT_SETTINGS;
  }

  // settingsCache is guaranteed non-null after the try/catch above
  return settingsCache as UserSettings;
}

export function updateCachedSettings(
  updates: Partial<UserSettings>,
): UserSettings {
  const current = getCachedSettings();
  settingsCache = { ...current, ...updates };

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsCache));
  } catch {
    // Fail silently (incognito mode, quota exceeded, etc.)
  }

  return settingsCache;
}

export function clearSettingsCache(): void {
  settingsCache = null;
}

// Invalidate cache when storage changes from another tab
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === SETTINGS_KEY) {
      clearSettingsCache();
    }
  });
}
