"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useMutation } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Calendar,
  Image as ImageIcon,
  Trash2,
  Loader2,
} from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

interface SessionCardProps {
  session: Doc<"gameSessions">;
  photoCount?: number;
  isOwner?: boolean;
}

export function SessionCard({
  session,
  photoCount = 0,
  isOwner = false,
}: SessionCardProps) {
  const removeSession = useMutation(api.sessions.remove);
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await removeSession({ id: session._id });
        setShowDeleteDialog(false);
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    });
  };

  return (
    <Card className="transition-colors hover:bg-muted/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/photos/${session._id}`} className="flex-1">
            <CardTitle className="text-lg hover:underline">
              {session.name || "Untitled Session"}
            </CardTitle>
          </Link>
          {isOwner && (
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                Owner
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete session</span>
              </Button>
            </div>
          )}
        </div>
        <Link href={`/photos/${session._id}`}>
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(session.createdAt, { addSuffix: true })}
          </CardDescription>
        </Link>
      </CardHeader>
      <Link href={`/photos/${session._id}`}>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {session.playerCount && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {session.playerCount} players
              </div>
            )}
            <div className="flex items-center gap-1">
              <ImageIcon className="h-4 w-4" />
              {photoCount} {photoCount === 1 ? "photo" : "photos"}
            </div>
          </div>
        </CardContent>
      </Link>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;
              {session.name || "Untitled Session"}&quot; and all photos in this
              session. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
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
    </Card>
  );
}
