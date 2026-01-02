"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePhotoGestures } from "@/hooks/use-photo-gestures";
import type { Id } from "@/convex/_generated/dataModel";
import type { GamePhotoData } from "@/convex/types";

interface PhotoViewerProps {
  photos: GamePhotoData[];
  initialIndex: number;
  onClose: () => void;
  onDelete?: (photoId: Id<"gamePhotos">) => Promise<void>;
  canDelete?: (photo: GamePhotoData) => boolean;
}

export function PhotoViewer({
  photos,
  initialIndex,
  onClose,
  onDelete,
  canDelete,
}: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showControls, setShowControls] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const currentPhoto = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const navigatePrev = useCallback(() => {
    if (hasPrev) {
      setCurrentIndex((i) => i - 1);
    }
  }, [hasPrev]);

  const navigateNext = useCallback(() => {
    if (hasNext) {
      setCurrentIndex((i) => i + 1);
    }
  }, [hasNext]);

  const toggleControls = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  const { state, handlers, resetTransform } = usePhotoGestures(
    {
      onTap: toggleControls,
      onSwipeLeft: navigateNext,
      onSwipeRight: navigatePrev,
    },
    containerSize,
  );

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Reset transform when changing photos
  useEffect(() => {
    resetTransform();
  }, [currentIndex, resetTransform]);

  // Focus management
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    return () => {
      previousFocusRef.current?.focus();
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          navigatePrev();
          break;
        case "ArrowRight":
          navigateNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, navigatePrev, navigateNext]);

  // Prevent body scroll when viewer is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleDelete = async () => {
    if (!onDelete || !currentPhoto) return;

    setIsDeleting(true);
    try {
      await onDelete(currentPhoto._id);

      // Navigate or close after delete
      if (photos.length <= 1) {
        onClose();
      } else if (currentIndex >= photos.length - 1) {
        setCurrentIndex(currentIndex - 1);
      }
      // Otherwise stay on same index (next photo slides in)
    } catch (error) {
      console.error("Failed to delete photo:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentPhoto) {
    return null;
  }

  const imageStyle: React.CSSProperties = {
    transform: `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`,
    transition: state.isGesturing ? "none" : "transform 0.2s ease-out",
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      {/* Image Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ touchAction: "none" }}
        {...handlers}
      >
        <div className="relative h-full w-full" style={imageStyle}>
          <Image
            src={currentPhoto.url}
            alt=""
            fill
            className="object-contain"
            priority
            draggable={false}
            sizes="100vw"
          />
        </div>
      </div>

      {/* Controls Overlay */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-200",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Close Button */}
        <Button
          ref={closeButtonRef}
          variant="ghost"
          size="icon"
          className={cn(
            "pointer-events-auto absolute right-4 top-4",
            "h-12 w-12 rounded-full",
            "bg-black/50 text-white hover:bg-black/70",
          )}
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Previous Button */}
        {hasPrev && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2",
              "h-12 w-12 rounded-full",
              "bg-black/50 text-white hover:bg-black/70",
            )}
            onClick={navigatePrev}
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}

        {/* Next Button */}
        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2",
              "h-12 w-12 rounded-full",
              "bg-black/50 text-white hover:bg-black/70",
            )}
            onClick={navigateNext}
            aria-label="Next photo"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}

        {/* Delete Button */}
        {onDelete && canDelete?.(currentPhoto) && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "pointer-events-auto absolute bottom-4 right-4",
              "h-12 w-12 rounded-full",
              "bg-red-500/50 text-white hover:bg-red-500/70",
            )}
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete photo"
          >
            <Trash2 className="h-6 w-6" />
          </Button>
        )}

        {/* Photo Counter */}
        {photos.length > 1 && (
          <div
            className={cn(
              "pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2",
              "rounded-full bg-black/50 px-4 py-2 text-sm text-white",
            )}
          >
            {currentIndex + 1} / {photos.length}
          </div>
        )}
      </div>
    </div>
  );
}
