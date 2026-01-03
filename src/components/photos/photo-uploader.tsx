"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { PhotoType } from "@/convex/types";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

function formatFileSize(bytes: number | undefined): string {
  if (!bytes) return "0 B";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`;
}

const MIN_DIMENSION = 100; // Don't resize below 100px

async function resizeImage(file: File, maxSizeBytes: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let quality = 0.9;
      let width = img.width;
      let height = img.height;

      const tryResize = () => {
        // Guard against infinite loops - stop if dimensions get too small
        if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to resize image"));
                return;
              }
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            },
            "image/jpeg",
            quality,
          );
          return;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to resize image"));
              return;
            }

            if (blob.size <= maxSizeBytes || quality <= 0.1) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              // Reduce quality first, then dimensions
              if (quality > 0.5) {
                quality -= 0.1;
              } else {
                width = Math.floor(width * 0.9);
                height = Math.floor(height * 0.9);
              }
              tryResize();
            }
          },
          "image/jpeg",
          quality,
        );
      };

      tryResize();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };
    img.src = objectUrl;
  });
}

interface PhotoUploaderProps {
  sessionId: Id<"gameSessions">;
  onUploadComplete?: () => void;
}

const PHOTO_TYPE_LABELS: Record<PhotoType, string> = {
  tech_tray: "Tech Tray",
  sector_map: "Sector Map",
  other: "Other",
};

export function PhotoUploader({
  sessionId,
  onUploadComplete,
}: PhotoUploaderProps) {
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const createPhoto = useMutation(api.photos.create);

  const [photoType, setPhotoType] = useState<PhotoType>("tech_tray");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResizeDialog, setShowResizeDialog] = useState(false);
  const [oversizedFile, setOversizedFile] = useState<File | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (8MB max) - show resize dialog if over limit
    if (file.size > MAX_FILE_SIZE) {
      setOversizedFile(file);
      setShowResizeDialog(true);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();

      // Step 3: Create photo record
      await createPhoto({
        storageId,
        sessionId,
        photoType,
      });

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploadComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResizeAndContinue = async () => {
    if (!oversizedFile) return;

    setIsResizing(true);
    setShowResizeDialog(false);

    try {
      const resizedFile = await resizeImage(oversizedFile, MAX_FILE_SIZE);

      setSelectedFile(resizedFile);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(resizedFile);
    } catch {
      setError("Failed to resize image. Please try a smaller file.");
    } finally {
      setIsResizing(false);
      setOversizedFile(null);
    }
  };

  const handleResizeDialogClose = () => {
    setShowResizeDialog(false);
    setOversizedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="photoType">Photo Type</Label>
        <Select
          value={photoType}
          onValueChange={(value) => setPhotoType(value as PhotoType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PHOTO_TYPE_LABELS) as PhotoType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {PHOTO_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Uploading a new photo will replace any existing photo of this type
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isResizing ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Resizing image...</p>
        </div>
      ) : preview ? (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleClear}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to select an image
          </p>
          <p className="text-xs text-muted-foreground">Max size: 8MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {selectedFile && (
        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </>
          )}
        </Button>
      )}

      <AlertDialog open={showResizeDialog} onOpenChange={setShowResizeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <ImageIcon className="h-4 w-4" />
            </AlertDialogMedia>
            <AlertDialogTitle>Image Too Large</AlertDialogTitle>
            <AlertDialogDescription>
              This image is {formatFileSize(oversizedFile?.size)} which exceeds
              the 8MB limit. Would you like to automatically resize it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleResizeDialogClose}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResizeAndContinue}>
              Resize & Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
