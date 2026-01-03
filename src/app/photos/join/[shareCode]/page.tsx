"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

export default function JoinSessionPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();
  const params = useParams();
  const shareCode = params.shareCode as string;

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/sign-in?returnUrl=/photos/join/${shareCode}`);
    }
  }, [authLoading, isAuthenticated, router, shareCode]);

  const session = useQuery(
    api.sessions.getByShareCode,
    isAuthenticated ? { shareCode } : "skip",
  );

  // Redirect to session page once we have the session
  useEffect(() => {
    if (session) {
      router.push(`/photos/${session._id}`);
    }
  }, [session, router]);

  if (authLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (session === undefined) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Joining session...</p>
        </div>
      </main>
    );
  }

  if (session === null) {
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

  return null;
}
