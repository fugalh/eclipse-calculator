"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { isConvexAvailable } from "@/lib/convex-available";

// Static loading skeleton to avoid re-creation on every render
const LOADING_SKELETON = (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="text-muted-foreground">Loading...</div>
  </div>
);

/**
 * Sign-up form variant: Show sign-up form when not authenticated
 */
function SignUpFormContent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Read returnUrl directly from window to avoid subscription to searchParams
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get("returnUrl") || "/photos";
      router.push(returnUrl);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return LOADING_SKELETON;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-4">
      <SignUpForm />
    </main>
  );
}

/**
 * Sign-up page variant: Convex is not configured
 */
function SignUpUnavailable() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Authentication Unavailable</h1>
      <p className="text-muted-foreground mt-2">
        Authentication requires Convex configuration. Please run{" "}
        <code className="bg-muted px-1 py-0.5 rounded">npx convex dev</code> and
        ensure NEXT_PUBLIC_CONVEX_URL is set.
      </p>
    </div>
  );
}

/**
 * Main content component that determines which variant to render
 */
function SignUpContent() {
  if (!isConvexAvailable()) {
    return <SignUpUnavailable />;
  }

  return <SignUpFormContent />;
}

export default function SignUpPage() {
  return (
    <Suspense fallback={LOADING_SKELETON}>
      <SignUpContent />
    </Suspense>
  );
}
