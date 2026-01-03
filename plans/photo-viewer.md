# iOS-Style Photo Viewer Implementation Plan

## Overview

Replace the current Dialog-based photo viewer with a full-screen iOS-style viewer featuring pinch-to-zoom, pan, swipe navigation, and tap-to-toggle UI controls using native browser APIs.

## Files to Create/Modify

| File                                     | Action                                                   |
| ---------------------------------------- | -------------------------------------------------------- |
| `src/hooks/use-photo-gestures.ts`        | **Create** - Custom gesture hook for pinch/pan/swipe/tap |
| `src/components/photos/photo-viewer.tsx` | **Create** - Full-screen photo viewer component          |
| `src/components/photos/photo-grid.tsx`   | **Modify** - Replace Dialog with PhotoViewer             |

## Implementation Steps

### Step 1: Create `use-photo-gestures.ts` Hook

Custom hook encapsulating all gesture logic using native PointerEvents:

```typescript
interface GestureState {
  scale: number; // 1.0 to 3.0
  translateX: number; // Pan offset
  translateY: number; // Pan offset
  isGesturing: boolean; // Disable CSS transitions during gesture
}

interface GestureHandlers {
  onTap: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}
```

**Features:**

- Track multiple pointers via `Map<pointerId, {x, y}>`
- Pinch detection: 2 pointers → calculate distance delta → update scale
- Pan detection: 1 pointer + scale > 1 → update translate with bounds
- Swipe detection: 1 pointer + scale === 1 + quick horizontal movement
- Tap detection: minimal movement + short duration
- Zoom toward pinch center point

### Step 2: Create `photo-viewer.tsx` Component

Full-screen overlay component:

**Structure:**

```
<div fixed inset-0 z-50 bg-black>
  <div image-container with gesture handlers>
    <Image with transform styles />
  </div>
  <div controls (conditionally visible)>
    <Button close (top-right) />
    <Button prev (left-center) />
    <Button next (right-center) />
    <Button delete (bottom-right, if authorized) />
    <span counter (bottom-center) />
  </div>
</div>
```

**Props:**

```typescript
interface PhotoViewerProps {
  photos: PhotoData[];
  initialIndex: number;
  onClose: () => void;
  onDelete?: (photoId: Id<"gamePhotos">) => Promise<void>;
  canDelete?: (photo: PhotoData) => boolean;
}
```

**Behavior:**

- Tap anywhere → toggle `showControls`
- Pinch → zoom (1x to 3x)
- Pan when zoomed → drag image within bounds
- Swipe left/right when not zoomed → navigate photos
- Reset zoom/pan when changing photos
- Keyboard: Escape closes, Arrow keys navigate

### Step 3: Modify `photo-grid.tsx`

**Changes:**

1. Replace `selectedPhoto: PhotoData | null` with `selectedPhotoIndex: number | null`
2. Create flattened photo array maintaining type-group order
3. Replace `<Dialog>` with `<PhotoViewer>`
4. Pass photo array, index, and callbacks to PhotoViewer

### Step 4: Styling Details

**Image transform:**

```css
transform: translate(${x}px, ${y}px) scale(${scale});
transition: isGesturing ? 'none' : 'transform 0.2s ease-out';
touch-action: none;
```

**Controls visibility:**

```css
transition-opacity duration-200
opacity-100 / opacity-0 pointer-events-none
```

**Button styling:**

```css
bg-black/50 hover:bg-black/70 text-white rounded-full
```

### Step 5: Accessibility

- `role="dialog"` and `aria-modal="true"` on viewer
- `aria-label` on all buttons
- Focus close button on open
- Return focus to thumbnail on close
- Keyboard navigation (Escape, Arrow keys)

## Gesture Algorithm Details

### Pinch-to-Zoom

```
onPointerMove:
  if pointers.size === 2:
    currentDistance = hypot(p2 - p1)
    if initialDistance is null:
      initialDistance = currentDistance
      initialScale = scale
    else:
      newScale = clamp(initialScale * (currentDistance / initialDistance), 1, 3)
```

### Pan Bounds

```
maxTranslate = ((scale - 1) * imageDimension) / 2
translate = clamp(initialTranslate + delta, -max, max)
```

### Swipe vs Pan Disambiguation

```
if scale === 1:
  horizontal movement → swipe navigation
else:
  movement → pan
```

### Tap Detection

```
if deltaX < 10 && deltaY < 10 && deltaTime < 200ms:
  toggle controls
```

## Edge Cases

- **Single photo**: Hide nav buttons, disable swipe
- **Delete current**: Navigate to next (or prev if last), close if empty
- **Image load error**: Show error state with retry
- **Rapid gestures**: Use refs (not state) for gesture tracking to avoid re-render lag

---

## Completion Summary

**Status:** ✅ Completed

**Created 2 new files:**

1. **`src/hooks/use-photo-gestures.ts`** - Custom gesture hook using native PointerEvents
   - Pinch-to-zoom (1x to 3x)
   - Pan when zoomed (with bounds checking)
   - Swipe left/right detection (when not zoomed)
   - Tap detection for toggling controls
   - All gesture state managed via refs to avoid re-render lag

2. **`src/components/photos/photo-viewer.tsx`** - Full-screen iOS-style photo viewer
   - Full-screen black overlay with centered image
   - Tap anywhere to show/hide controls
   - Close button (top-right), nav arrows (left/right center), delete button (bottom-right)
   - Photo counter (bottom-center)
   - Keyboard navigation (Escape, Arrow keys)
   - Accessibility: focus management, ARIA labels, body scroll lock

**Modified 1 file:**

3. **`src/components/photos/photo-grid.tsx`** - Replaced Dialog with PhotoViewer
   - Changed from `selectedPhoto` to `selectedPhotoIndex`
   - Created flattened photo array for navigation across type groups
   - Removed unused Dialog imports
