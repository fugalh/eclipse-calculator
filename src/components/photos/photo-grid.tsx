"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { PhotoType, GamePhotoData } from "@/convex/types";
import { PhotoViewer } from "./photo-viewer";

interface PhotoGridProps {
  photos: GamePhotoData[];
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const removePhoto = useMutation(api.photos.remove);

  // Group photos by type (memoized to prevent unnecessary recalculations)
  const photosByType = useMemo(
    () =>
      photos.reduce(
        (acc, photo) => {
          if (!acc[photo.photoType]) {
            acc[photo.photoType] = [];
          }
          acc[photo.photoType].push(photo);
          return acc;
        },
        {} as Record<PhotoType, GamePhotoData[]>,
      ),
    [photos],
  );

  // Flatten photos maintaining type-group order for navigation
  const flattenedPhotos = useMemo(() => {
    const ordered: GamePhotoData[] = [];
    for (const type of Object.keys(PHOTO_TYPE_LABELS) as PhotoType[]) {
      if (photosByType[type]) {
        ordered.push(...photosByType[type]);
      }
    }
    return ordered;
  }, [photosByType]);

  const handlePhotoClick = (photo: GamePhotoData) => {
    const index = flattenedPhotos.findIndex((p) => p._id === photo._id);
    setSelectedPhotoIndex(index);
  };

  const handleDelete = async (photoId: Id<"gamePhotos">) => {
    try {
      await removePhoto({ id: photoId });
      onPhotoDeleted?.();
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
  };

  const canDeletePhoto = (photo: GamePhotoData) => {
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
                    onClick={() => handlePhotoClick(photo)}
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

      {selectedPhotoIndex !== null && (
        <PhotoViewer
          photos={flattenedPhotos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
          onDelete={handleDelete}
          canDelete={canDeletePhoto}
        />
      )}
    </>
  );
}
