"use client";

import { useSearchParams } from "next/navigation";

/**
 * Custom hook to extract and normalize the returnUrl from search params
 * Centralizes navigation logic for sign-in/sign-up flows
 */
export function useReturnUrl(defaultUrl = "/photos"): string {
  const searchParams = useSearchParams();
  return searchParams.get("returnUrl") || defaultUrl;
}
