"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { SessionCard } from "@/components/photos/session-card";
import { CreateSessionDialog } from "@/components/photos/create-session-dialog";
import { JoinSessionDialog } from "@/components/photos/join-session-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isConvexAvailable } from "@/lib/convex-available";

function PhotosPageContent() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/sign-in?returnUrl=/photos");
    }
  }, [authLoading, isAuthenticated, router]);

  const ownedSessions = useQuery(
    api.sessions.listOwned,
    isAuthenticated ? {} : "skip",
  );
  const joinedSessions = useQuery(
    api.sessions.listJoined,
    isAuthenticated ? {} : "skip",
  );

  if (authLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Game Photos</h1>
          <p className="text-muted-foreground">
            Share gameplay photos with your group
          </p>
        </div>
        <div className="flex gap-2">
          <JoinSessionDialog />
          <CreateSessionDialog />
        </div>
      </div>

      <Tabs defaultValue="owned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="owned">My Sessions</TabsTrigger>
          <TabsTrigger value="joined">Joined Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="owned" className="space-y-4">
          {ownedSessions === undefined ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading sessions...
            </div>
          ) : ownedSessions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No sessions yet. Create your first session!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ownedSessions.map((session) => (
                <SessionCard key={session._id} session={session} isOwner />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="joined" className="space-y-4">
          {joinedSessions === undefined ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading sessions...
            </div>
          ) : joinedSessions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No joined sessions. Ask a friend to share a session link!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {joinedSessions
                .filter((s): s is NonNullable<typeof s> => s !== null)
                .map((session) => (
                  <SessionCard key={session._id} session={session} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default function PhotosPage() {
  if (!isConvexAvailable()) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Photos Feature Unavailable</h1>
        <p className="text-muted-foreground mt-2">
          The photos feature requires Convex configuration. Please run{" "}
          <code className="bg-muted px-1 py-0.5 rounded">npx convex dev</code>{" "}
          and ensure NEXT_PUBLIC_CONVEX_URL is set.
        </p>
      </div>
    );
  }

  return <PhotosPageContent />;
}
