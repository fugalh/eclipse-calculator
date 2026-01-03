# Image Resize Dialog Implementation Plan

## Overview

Add a dialog to the photo uploader that prompts users to automatically resize images when they exceed the 8MB upload limit, rather than just showing an error.

## File to Modify

| File                                       | Action                                                  |
| ------------------------------------------ | ------------------------------------------------------- |
| `src/components/photos/photo-uploader.tsx` | **Modify** - Add resize dialog and image resizing logic |

## Implementation Steps

### Step 1: Add State for Resize Dialog

```typescript
const [showResizeDialog, setShowResizeDialog] = useState(false);
const [oversizedFile, setOversizedFile] = useState<File | null>(null);
const [isResizing, setIsResizing] = useState(false);
```

### Step 2: Modify `handleFileSelect` to Trigger Dialog

Instead of showing an error for oversized files, store the file and show the resize dialog:

```typescript
// Current: shows error
if (file.size > 8 * 1024 * 1024) {
  setError("Image must be smaller than 8MB");
  return;
}

// New: show resize dialog
if (file.size > 8 * 1024 * 1024) {
  setOversizedFile(file);
  setShowResizeDialog(true);
  return;
}
```

### Step 3: Add Image Resize Utility Function

Use Canvas API to resize images client-side:

```typescript
async function resizeImage(file: File, maxSizeBytes: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let quality = 0.9;
      let width = img.width;
      let height = img.height;

      // Iteratively reduce quality/dimensions until under limit
      const tryResize = () => {
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

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
```

### Step 4: Add Resize Handler

```typescript
const handleResizeAndUpload = async () => {
  if (!oversizedFile) return;

  setIsResizing(true);
  setShowResizeDialog(false);

  try {
    const resizedFile = await resizeImage(oversizedFile, 8 * 1024 * 1024);

    // Set the resized file as selected
    setSelectedFile(resizedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(resizedFile);
  } catch (err) {
    setError("Failed to resize image. Please try a smaller file.");
  } finally {
    setIsResizing(false);
    setOversizedFile(null);
  }
};
```

### Step 5: Add AlertDialog Component

Use existing AlertDialog components:

```tsx
<AlertDialog open={showResizeDialog} onOpenChange={setShowResizeDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogMedia>
        <ImageIcon className="h-4 w-4" />
      </AlertDialogMedia>
      <AlertDialogTitle>Image Too Large</AlertDialogTitle>
      <AlertDialogDescription>
        This image is {formatFileSize(oversizedFile?.size)} which exceeds the
        8MB limit. Would you like to automatically resize it?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setOversizedFile(null)}>
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction onClick={handleResizeAndUpload}>
        Resize & Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Step 6: Add File Size Formatter

```typescript
function formatFileSize(bytes: number | undefined): string {
  if (!bytes) return "0 B";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`;
}
```

### Step 7: Add Resizing State UI

Show loading state while resizing:

```tsx
{
  isResizing && (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Resizing image...</p>
    </div>
  );
}
```

## New Imports Required

```typescript
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
import { ImageIcon } from "lucide-react";
```

## Resize Algorithm Notes

1. Start with quality 0.9, reduce by 0.1 until 0.5
2. Then start reducing dimensions by 10% per iteration
3. Stop when file size is under 8MB or quality drops below 0.1
4. Convert to JPEG for consistent compression (most photos are JPEG anyway)
5. Preserve original filename

---

## Completion Summary

**Status:** ✅ Completed

**Changes Made:**

- Modified `src/components/photos/photo-uploader.tsx` to add automatic image resize functionality

**New Features:**

1. **Resize Dialog**: When a user selects an image over 8MB, an AlertDialog prompts them to resize instead of showing an error
2. **Client-side Resizing**: Uses Canvas API to iteratively reduce JPEG quality (0.9→0.5) then dimensions until under 8MB
3. **Loading State**: Shows "Resizing image..." with spinner while processing
4. **File Size Display**: Dialog shows the actual file size (e.g., "12.5MB")

**User Flow:**

1. User selects an oversized image
2. Dialog appears: "This image is 12.5MB which exceeds the 8MB limit. Would you like to automatically resize it?"
3. User clicks "Resize & Continue" → image is resized and preview shown
4. User clicks "Upload Photo" to complete
