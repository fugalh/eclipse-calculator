"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { isConvexAvailable } from "@/lib/convex-available";
import { useReturnUrl } from "@/components/auth/use-return-url";

/**
 * Sign-in page variant: User is authenticated, redirect to return URL
 */
function SignInRedirecting() {
  const router = useRouter();
  const returnUrl = useReturnUrl();

  useEffect(() => {
    router.push(returnUrl);
  }, [router, returnUrl]);

  return null;
}

/**
 * Sign-in page variant: Show sign-in form
 */
function SignInFormPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-4">
      <SignInForm />
    </main>
  );
}

/**
 * Sign-in page variant: Loading authentication state
 */
function SignInLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

/**
 * Sign-in page variant: Convex is not configured
 */
function SignInUnavailable() {
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
function SignInContent() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (!isConvexAvailable()) {
    return <SignInUnavailable />;
  }

  if (isLoading) {
    return <SignInLoading />;
  }

  if (isAuthenticated) {
    return <SignInRedirecting />;
  }

  return <SignInFormPage />;
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
}
