"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { isConvexAvailable } from "@/lib/convex-available";

/**
 * Join session page variant: Convex not available
 */
function JoinSessionUnavailable() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Photos Feature Unavailable</h1>
      <p className="text-muted-foreground mt-2">
        The photos feature requires Convex configuration. Please run{" "}
        <code className="bg-muted px-1 py-0.5 rounded">npx convex dev</code> and
        ensure NEXT_PUBLIC_CONVEX_URL is set.
      </p>
    </div>
  );
}

/**
 * Join session page variant: Loading authentication
 */
function JoinSessionAuthLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </main>
  );
}

/**
 * Join session page variant: Looking up session
 */
function JoinSessionLookingUp() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Joining session...</p>
      </div>
    </main>
  );
}

/**
 * Join session page variant: Session not found
 */
function JoinSessionNotFound() {
  const router = useRouter();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-2xl font-bold">Session Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          This session doesn&apos;t exist or you don&apos;t have access.
        </p>
        <button
          onClick={() => router.push("/photos")}
          className="mt-4 text-primary hover:underline"
        >
          Go to Photos
        </button>
      </div>
    </main>
  );
}

/**
 * Main join session content - handles authentication and session lookup
 */
function JoinSessionContent() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();
  const params = useParams();
  const shareCode = params.shareCode as string;

  // Query session only when authenticated
  const session = useQuery(
    api.sessions.getByShareCode,
    isAuthenticated ? { shareCode } : "skip",
  );

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/sign-in?returnUrl=/photos/join/${shareCode}`);
    }
  }, [authLoading, isAuthenticated, router, shareCode]);

  // Redirect to session page once found
  useEffect(() => {
    if (session) {
      router.push(`/photos/${session._id}`);
    }
  }, [session, router]);

  // Determine which variant to render
  if (authLoading) {
    return <JoinSessionAuthLoading />;
  }

  if (!isAuthenticated) {
    // Redirecting to sign-in, show nothing
    return null;
  }

  if (session === undefined) {
    // Still loading session
    return <JoinSessionLookingUp />;
  }

  if (session === null) {
    // Session not found
    return <JoinSessionNotFound />;
  }

  // Session found, redirecting
  return null;
}

export default function JoinSessionPage() {
  if (!isConvexAvailable()) {
    return <JoinSessionUnavailable />;
  }

  return <JoinSessionContent />;
}
