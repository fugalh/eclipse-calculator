"use client";

import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { type Platform } from "@/lib/hooks/use-pwa-install";
import { useInstallPrompt } from "./install-prompt-provider";

/**
 * Hook for managing install toast lifecycle
 * Consumes InstallPromptContext for all state and actions
 */
export function useInstallToast() {
  const { platform, canPromptNative, onInstall, onLearnHow, onDismissCard } =
    useInstallPrompt();

  const toastIdRef = useRef<string | number | null>(null);
  const hasShownRef = useRef(false);
  const scrollHandlerRef = useRef<(() => void) | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const dismissToast = useCallback(() => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
    // Inline cleanup to avoid circular dependency
    if (scrollHandlerRef.current) {
      window.removeEventListener("scroll", scrollHandlerRef.current);
      scrollHandlerRef.current = null;
    }
  }, []);

  const showToast = useCallback(() => {
    if (hasShownRef.current) return;
    hasShownRef.current = true;

    const message = getToastMessage(platform);
    const actionLabel = canPromptNative ? "Install" : "Learn how";
    const actionHandler = canPromptNative
      ? async () => {
          try {
            await onInstall();
            dismissToast();
          } catch {
            // Handle install errors silently
            dismissToast();
          }
        }
      : () => {
          onLearnHow();
          dismissToast();
        };

    // Small delay to let the page render
    timeoutIdRef.current = setTimeout(() => {
      toastIdRef.current = toast(message, {
        action: {
          label: actionLabel,
          onClick: actionHandler,
        },
        duration: Infinity, // Persist until scroll or dismiss
        onDismiss: () => {
          onDismissCard();
          toastIdRef.current = null;
          // Inline cleanup instead of calling cleanupScrollListener
          if (scrollHandlerRef.current) {
            window.removeEventListener("scroll", scrollHandlerRef.current);
            scrollHandlerRef.current = null;
          }
        },
      });

      // Add scroll listener AFTER toast is created
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (toastIdRef.current && window.scrollY > 50) {
              dismissToast();
              onDismissCard();
            }
            ticking = false;
          });
          ticking = true;
        }
      };
      scrollHandlerRef.current = handleScroll;
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 500);
  }, [
    platform,
    canPromptNative,
    onInstall,
    onLearnHow,
    onDismissCard,
    dismissToast,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      // Inline cleanup
      if (scrollHandlerRef.current) {
        window.removeEventListener("scroll", scrollHandlerRef.current);
        scrollHandlerRef.current = null;
      }
    };
  }, []);

  return { showToast, dismissToast };
}

function getToastMessage(platform: Platform): string {
  switch (platform) {
    case "ios":
      return "Add Eclipse Companion to your home screen for quick access";
    case "android":
      return "Install Eclipse Companion for a better experience";
    case "chrome-desktop":
      return "Install the Eclipse Companion app";
    default:
      return "Install Eclipse Companion for offline access";
  }
}
