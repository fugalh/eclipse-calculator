"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ShipConfig, BattleResultsExtended } from "@/lib/types";
import { calculate } from "@/lib/combat/simulation";

interface UseDebouncedCalculationOptions {
  /** Debounce delay in milliseconds (default: 500) */
  debounceMs?: number;
  /** Number of simulation iterations (default: 1000) */
  iterations?: number;
  /** Whether auto-calculation is enabled (default: true) */
  enabled?: boolean;
}

interface UseDebouncedCalculationReturn {
  /** Current battle results (null if not yet calculated) */
  results: BattleResultsExtended | null;
  /** Whether a calculation is in progress */
  isCalculating: boolean;
  /** Manually trigger a calculation (useful when auto-calculate is disabled) */
  triggerCalculation: () => void;
}

/**
 * Hook for debounced auto-calculation of battle results
 * Feature 6: Continuous async update with 500ms debounce
 */
export function useDebouncedCalculation(
  defenderFleet: ShipConfig[],
  attackerFleet: ShipConfig[],
  options: UseDebouncedCalculationOptions = {},
): UseDebouncedCalculationReturn {
  const { debounceMs = 500, iterations = 1000, enabled = true } = options;

  const [results, setResults] = useState<BattleResultsExtended | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Refs to track debounce timeout and abort state
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<boolean>(false);

  // Track fleet configs as JSON for deep comparison
  const defenderKey = JSON.stringify(defenderFleet);
  const attackerKey = JSON.stringify(attackerFleet);

  const runCalculation = useCallback(() => {
    // Don't calculate if either fleet is empty
    if (defenderFleet.length === 0 || attackerFleet.length === 0) {
      setResults(null);
      setIsCalculating(false);
      return;
    }

    setIsCalculating(true);
    abortRef.current = false;

    // Use requestIdleCallback if available, otherwise setTimeout
    // This allows the UI to remain responsive during calculation
    const scheduleCalculation =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? (cb: () => void) =>
            (
              window as Window & {
                requestIdleCallback: (cb: () => void) => number;
              }
            ).requestIdleCallback(cb)
        : (cb: () => void) => setTimeout(cb, 10);

    scheduleCalculation(() => {
      // Check if calculation was aborted (e.g., fleet changed again)
      if (abortRef.current) {
        return;
      }

      const battleResults = calculate(
        { ships: defenderFleet },
        { ships: attackerFleet },
        iterations,
      );

      // Only update results if not aborted
      if (!abortRef.current) {
        setResults(battleResults);
        setIsCalculating(false);
      }
    });
  }, [defenderFleet, attackerFleet, iterations]);

  // Debounced auto-calculation when fleets change
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Clear any existing debounce timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Abort any in-progress calculation
    abortRef.current = true;

    // Schedule a new calculation after debounce delay
    debounceRef.current = setTimeout(() => {
      runCalculation();
    }, debounceMs);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      abortRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defenderKey, attackerKey, debounceMs, enabled]);

  return {
    results,
    isCalculating,
    triggerCalculation: runCalculation,
  };
}
