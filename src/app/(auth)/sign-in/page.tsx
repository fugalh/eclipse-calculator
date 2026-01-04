"use client";

import { useConvexAuth } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { isConvexAvailable } from "@/lib/convex-available";

function SignInFormContent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const returnUrl = searchParams.get("returnUrl") || "/photos";
      router.push(returnUrl);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-4">
      <SignInForm />
    </main>
  );
}

function SignInContent() {
  if (!isConvexAvailable()) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Authentication Unavailable</h1>
        <p className="text-muted-foreground mt-2">
          Authentication requires Convex configuration. Please run{" "}
          <code className="bg-muted px-1 py-0.5 rounded">npx convex dev</code>{" "}
          and ensure NEXT_PUBLIC_CONVEX_URL is set.
        </p>
      </div>
    );
  }

  return <SignInFormContent />;
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
