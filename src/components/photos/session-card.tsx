"use client";

import Link from "next/link";
import { useState } from "react";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeSession({ id: session._id });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Card className="transition-colors hover:bg-muted/50">
      <Link href={`/photos/${session._id}`} className="block">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">
              {session.name || "Untitled Session"}
            </CardTitle>
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
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(session.createdAt, { addSuffix: true })}
          </CardDescription>
        </CardHeader>
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
    </Card>
  );
}
