"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PhotoUploader } from "@/components/photos/photo-uploader";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Copy,
  Check,
  Users,
  Calendar,
  Trash2,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { isConvexAvailable } from "@/lib/convex-available";

function SessionDetailContent() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as Id<"gameSessions">;

  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const removeSession = useMutation(api.sessions.remove);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/sign-in?returnUrl=/photos/${sessionId}`);
    }
  }, [authLoading, isAuthenticated, router, sessionId]);

  const session = useQuery(
    api.sessions.get,
    isAuthenticated ? { id: sessionId } : "skip",
  );

  const photos = useQuery(
    api.photos.listBySession,
    isAuthenticated && session ? { sessionId } : "skip",
  );

  const currentUser = useQuery(
    api.sessions.listOwned,
    isAuthenticated ? {} : "skip",
  );

  // Determine if current user is the owner
  const isOwner =
    session && currentUser
      ? currentUser.some((s) => s._id === sessionId)
      : false;

  const handleCopyLink = async () => {
    if (!session) return;
    const shareUrl = `${window.location.origin}/photos/join/${session.shareCode}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeSession({ id: sessionId });
      router.push("/photos");
    } catch {
      setIsDeleting(false);
    }
  };

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

  if (session === undefined) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading session...</div>
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
          <Link href="/photos" className="mt-4 text-primary hover:underline">
            Go to Photos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/photos"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Photos
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {session.name || "Untitled Session"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDistanceToNow(session.createdAt, { addSuffix: true })}
            </div>
            {session.playerCount && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {session.playerCount} players
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyLink}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Share Link
              </>
            )}
          </Button>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete &quot;
                    {session.name || "Untitled Session"}&quot; and all photos in
                    this session. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>
                {photos?.length ?? 0} photos in this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              {photos === undefined ? (
                <div className="py-8 text-center text-muted-foreground">
                  Loading photos...
                </div>
              ) : (
                <PhotoGrid
                  photos={photos}
                  canDelete
                  currentUserId={isOwner ? session.ownerId : undefined}
                  sessionOwnerId={session.ownerId}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Photo</CardTitle>
              <CardDescription>Add a photo to this session</CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUploader sessionId={sessionId} />
            </CardContent>
          </Card>

          {isOwner && (
            <>
              <Separator className="my-6" />
              <Card>
                <CardHeader>
                  <CardTitle>Share Code</CardTitle>
                  <CardDescription>
                    Share this code with friends to let them upload photos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center rounded-lg bg-muted p-4">
                    <span className="font-mono text-2xl font-bold tracking-widest">
                      {session.shareCode}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SessionDetailPage() {
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

  return <SessionDetailContent />;
}
