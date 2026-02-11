"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  usePWAInstall,
  type PWAInstallState,
} from "@/lib/hooks/use-pwa-install";
import { useInstallToast } from "./install-toast";
import { InstallTutorialSheet } from "./install-tutorial-sheet";

// Storage keys for engagement tracking
const SIMULATION_RUN_KEY = "eclipse-simulation-run";
const VISIT_COUNT_KEY = "eclipse-visit-count";

interface InstallPromptContextValue {
  showCard: boolean;
  platform: PWAInstallState["platform"];
  canPromptNative: boolean;
  isMobile: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<void>;
  onLearnHow: () => void;
  onDismissCard: () => void;
}

const InstallPromptContext = createContext<InstallPromptContextValue | null>(
  null,
);

export function useInstallPrompt() {
  const context = useContext(InstallPromptContext);
  if (!context) {
    throw new Error(
      "useInstallPrompt must be used within InstallPromptProvider",
    );
  }
  return context;
}

/**
 * Mark that a simulation has been run - call this from the calculator
 * when the user clicks "Calculate"
 */
export function markSimulationRun(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SIMULATION_RUN_KEY, "true");
}

interface EngagementState {
  hasEngagement: boolean;
}

/**
 * Hook for managing user engagement tracking
 * Separates engagement logic from UI context provision
 */
function useInstallEngagement(): EngagementState {
  const [hasEngagement] = useState(() => {
    if (typeof window === "undefined") return false;

    // Check all trigger conditions:
    // 1. First visit (immediate) - always true after first load
    // 2. Has run a simulation
    // 3. Visit count >= 3
    const visitCount = getAndIncrementVisitCount();
    const simulationRun = hasRunSimulation();

    // Any of these conditions enables the prompt
    return visitCount >= 1 || simulationRun || visitCount >= 3;
  });

  return { hasEngagement };
}

/**
 * Check if user has run at least one simulation
 */
function hasRunSimulation(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SIMULATION_RUN_KEY) === "true";
}

/**
 * Increment and get visit count
 */
function getAndIncrementVisitCount(): number {
  if (typeof window === "undefined") return 0;

  const currentCount = parseInt(
    localStorage.getItem(VISIT_COUNT_KEY) || "0",
    10,
  );
  const newCount = currentCount + 1;
  localStorage.setItem(VISIT_COUNT_KEY, newCount.toString());
  return newCount;
}

interface InstallPromptProviderProps {
  children: ReactNode;
}

export function InstallPromptProvider({
  children,
}: InstallPromptProviderProps) {
  const pwa = usePWAInstall();
  const { hasEngagement } = useInstallEngagement();
  const [cardDismissedThisSession, setCardDismissedThisSession] =
    useState(false);

  // Determine if prompts should be shown
  const shouldShowPrompts =
    hasEngagement &&
    !pwa.isInstalled &&
    !pwa.isDismissed &&
    pwa.platform !== "other";

  // Show card only on first load of session (and not yet dismissed this session)
  const showCard =
    shouldShowPrompts && !pwa.cardShownThisSession && !cardDismissedThisSession;

  const handleDismissCard = () => {
    setCardDismissedThisSession(true);
    pwa.dismissPrompt();
    pwa.markCardShown();
  };

  const contextValue: InstallPromptContextValue = {
    showCard,
    platform: pwa.platform,
    canPromptNative: pwa.canPromptNative,
    isMobile: pwa.isMobile,
    isInstalled: pwa.isInstalled,
    onInstall: pwa.triggerNativePrompt,
    onLearnHow: pwa.openTutorial,
    onDismissCard: handleDismissCard,
  };

  return (
    <InstallPromptContext.Provider value={contextValue}>
      {children}
      <InstallToastManager shouldShow={shouldShowPrompts} />
      <InstallTutorialSheet
        open={pwa.showTutorialSheet}
        onOpenChange={(open) => {
          if (!open) pwa.closeTutorial();
        }}
        platform={pwa.platform}
      />
    </InstallPromptContext.Provider>
  );
}

/**
 * Component that manages toast display lifecycle
 * Consumes context and shows toast when conditions are met
 */
function InstallToastManager({ shouldShow }: { shouldShow: boolean }) {
  const { showToast } = useInstallToast();
  const toastTriggeredRef = useRef(false);

  useEffect(() => {
    if (shouldShow && !toastTriggeredRef.current) {
      toastTriggeredRef.current = true;
      showToast();
    }
  }, [shouldShow, showToast]);

  return null;
}
