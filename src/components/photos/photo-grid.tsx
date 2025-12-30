"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { PhotoType } from "@/convex/types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, X } from "lucide-react";

interface PhotoData {
  _id: Id<"gamePhotos">;
  userId: Id<"users">;
  photoType: PhotoType;
  uploadedAt: number;
  url: string;
  gameRound?: number;
  notes?: string;
}

interface PhotoGridProps {
  photos: PhotoData[];
  canDelete?: boolean;
  currentUserId?: Id<"users">;
  sessionOwnerId?: Id<"users">;
  onPhotoDeleted?: () => void;
}

const PHOTO_TYPE_LABELS: Record<PhotoType, string> = {
  tech_tray: "Tech Tray",
  sector_map: "Sector Map",
  other: "Other",
};

export function PhotoGrid({
  photos,
  canDelete = false,
  currentUserId,
  sessionOwnerId,
  onPhotoDeleted,
}: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const removePhoto = useMutation(api.photos.remove);

  const handleDelete = async (photoId: Id<"gamePhotos">) => {
    setIsDeleting(true);
    try {
      await removePhoto({ id: photoId });
      setSelectedPhoto(null);
      onPhotoDeleted?.();
    } catch (error) {
      console.error("Failed to delete photo:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const canDeletePhoto = (photo: PhotoData) => {
    if (!canDelete || !currentUserId) return false;
    // Session owner can delete any photo
    if (sessionOwnerId && currentUserId === sessionOwnerId) return true;
    // Users can delete their own photos
    return photo.userId === currentUserId;
  };

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No photos yet</p>
        <p className="text-sm text-muted-foreground">
          Upload photos to share with your group
        </p>
      </div>
    );
  }

  // Group photos by type
  const photosByType = photos.reduce(
    (acc, photo) => {
      if (!acc[photo.photoType]) {
        acc[photo.photoType] = [];
      }
      acc[photo.photoType].push(photo);
      return acc;
    },
    {} as Record<PhotoType, PhotoData[]>,
  );

  return (
    <>
      <div className="space-y-6">
        {(Object.keys(PHOTO_TYPE_LABELS) as PhotoType[]).map((type) => {
          const typePhotos = photosByType[type];
          if (!typePhotos || typePhotos.length === 0) return null;

          return (
            <div key={type}>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                {PHOTO_TYPE_LABELS[type]}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {typePhotos.map((photo) => (
                  <button
                    key={photo._id}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <Image
                      src={photo.url}
                      alt={PHOTO_TYPE_LABELS[photo.photoType]}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        open={selectedPhoto !== null}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPhoto && PHOTO_TYPE_LABELS[selectedPhoto.photoType]}
            </DialogTitle>
            <DialogDescription>
              {selectedPhoto &&
                `Uploaded ${formatDistanceToNow(selectedPhoto.uploadedAt, { addSuffix: true })}`}
            </DialogDescription>
          </DialogHeader>
          {selectedPhoto && (
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedPhoto.url}
                  alt={PHOTO_TYPE_LABELS[selectedPhoto.photoType]}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
                {canDeletePhoto(selectedPhoto) && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedPhoto._id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
