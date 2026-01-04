"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type Platform = "ios" | "android" | "chrome-desktop" | "other";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSAL_KEY = "pwa-install-dismissed-at";
const CARD_SESSION_KEY = "pwa-install-card-shown-session";
const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "other";

  const ua = navigator.userAgent;
  const isIOS =
    (ua.includes("iPad") || ua.includes("iPhone") || ua.includes("iPod")) &&
    !("MSStream" in window);
  const isAndroid = ua.includes("Android");
  const isChrome =
    ua.includes("Chrome") && !ua.includes("Edge") && !ua.includes("Edg");

  if (isIOS) return "ios";
  if (isAndroid) return "android";
  if (isChrome && !isAndroid) return "chrome-desktop";
  return "other";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isDismissedWithin10Days(): boolean {
  if (typeof window === "undefined") return false;

  const dismissedAt = localStorage.getItem(DISMISSAL_KEY);
  if (!dismissedAt) return false;

  const timestamp = parseInt(dismissedAt, 10);
  if (isNaN(timestamp)) return false;

  return Date.now() - timestamp < TEN_DAYS_MS;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem("pwa-session-id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("pwa-session-id", sessionId);
  }
  return sessionId;
}

function wasCardShownThisSession(): boolean {
  if (typeof window === "undefined") return false;

  const shownSession = localStorage.getItem(CARD_SESSION_KEY);
  return shownSession === getSessionId();
}

function markCardShownThisSession(): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(CARD_SESSION_KEY, getSessionId());
}

export interface PWAInstallState {
  platform: Platform;
  canPromptNative: boolean;
  isInstalled: boolean;
  isDismissed: boolean;
  cardShownThisSession: boolean;
  showTutorialSheet: boolean;
  isMobile: boolean;
  triggerNativePrompt: () => Promise<void>;
  dismissPrompt: () => void;
  openTutorial: () => void;
  closeTutorial: () => void;
  markCardShown: () => void;
}

export function usePWAInstall(): PWAInstallState {
  // SSR-safe: Initialize with defaults that match server render, update after mount
  const [platform, setPlatform] = useState<Platform>("other");
  const [canPromptNative, setCanPromptNative] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [cardShownThisSession, setCardShownThisSession] = useState(false);
  const [showTutorialSheet, setShowTutorialSheet] = useState(false);

  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  // Initialize client-side state after mount to prevent hydration mismatch
  useEffect(() => {
    setPlatform(detectPlatform());
    setIsInstalled(isStandalone());
    setIsDismissed(isDismissedWithin10Days());
    setCardShownThisSession(wasCardShownThisSession());
  }, []);

  // Listen for browser events
  useEffect(() => {
    // Listen for beforeinstallprompt event (Chrome/Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setCanPromptNative(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      deferredPromptRef.current = null;
      setCanPromptNative(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const triggerNativePrompt = useCallback(async () => {
    if (!deferredPromptRef.current) return;

    try {
      await deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error("PWA install prompt failed:", error);
    } finally {
      deferredPromptRef.current = null;
      setCanPromptNative(false);
    }
  }, []);

  const dismissPrompt = useCallback(() => {
    localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
    setIsDismissed(true);
  }, []);

  const openTutorial = useCallback(() => {
    setShowTutorialSheet(true);
  }, []);

  const closeTutorial = useCallback(() => {
    setShowTutorialSheet(false);
  }, []);

  const markCardShown = useCallback(() => {
    markCardShownThisSession();
    setCardShownThisSession(true);
  }, []);

  return {
    platform,
    canPromptNative,
    isInstalled,
    isDismissed,
    cardShownThisSession,
    showTutorialSheet,
    isMobile: platform === "ios" || platform === "android",
    triggerNativePrompt,
    dismissPrompt,
    openTutorial,
    closeTutorial,
    markCardShown,
  };
}
