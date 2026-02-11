"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

interface UseAuthFormOptions {
  flow: "signIn" | "signUp";
  returnUrl: string;
  onValidationError?: (error: string) => void;
}

interface UseAuthFormResult {
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  clearError: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  signIn: "Invalid email or password",
  signUp: "Could not create account. Email may already be in use.",
};

export function useAuthForm({
  flow,
  returnUrl,
}: UseAuthFormOptions): UseAuthFormResult {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        await signIn("password", { email, password, flow });
        router.push(returnUrl);
      } catch {
        setError(AUTH_ERROR_MESSAGES[flow]);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, flow, signIn, router, returnUrl],
  );

  return {
    email,
    password,
    confirmPassword,
    error,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    clearError,
    handleSubmit,
  };
}
