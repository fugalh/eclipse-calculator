"use client";

import { useRef, useState, useCallback } from "react";

const MAX_ZOOM = 3;
const MIN_ZOOM = 1;
const SWIPE_THRESHOLD = 50;
const SWIPE_MAX_DURATION = 300;
const TAP_THRESHOLD = 10;
const TAP_MAX_DURATION = 200;

interface PointerData {
  x: number;
  y: number;
}

interface GestureRef {
  pointers: Map<number, PointerData>;
  initialPinchDistance: number | null;
  initialScale: number;
  isPanning: boolean;
  panStartX: number;
  panStartY: number;
  initialTranslateX: number;
  initialTranslateY: number;
  gestureStartX: number;
  gestureStartY: number;
  gestureStartTime: number;
}

interface GestureCallbacks {
  onTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface GestureState {
  scale: number;
  translateX: number;
  translateY: number;
  isGesturing: boolean;
}

interface UsePhotoGesturesReturn {
  state: GestureState;
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
  };
  resetTransform: () => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function usePhotoGestures(
  callbacks: GestureCallbacks,
  containerSize: { width: number; height: number },
): UsePhotoGesturesReturn {
  const [scale, setScale] = useState(MIN_ZOOM);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isGesturing, setIsGesturing] = useState(false);

  const gestureRef = useRef<GestureRef>({
    pointers: new Map(),
    initialPinchDistance: null,
    initialScale: 1,
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    initialTranslateX: 0,
    initialTranslateY: 0,
    gestureStartX: 0,
    gestureStartY: 0,
    gestureStartTime: 0,
  });

  const resetTransform = useCallback(() => {
    setScale(MIN_ZOOM);
    setTranslateX(0);
    setTranslateY(0);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const ref = gestureRef.current;

      // Track this pointer
      ref.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Capture pointer for tracking outside element
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      if (ref.pointers.size === 1) {
        // Single pointer - could be tap, pan, or swipe
        ref.gestureStartX = e.clientX;
        ref.gestureStartY = e.clientY;
        ref.gestureStartTime = Date.now();
        ref.panStartX = e.clientX;
        ref.panStartY = e.clientY;
        ref.initialTranslateX = translateX;
        ref.initialTranslateY = translateY;
        ref.isPanning = false;
      } else if (ref.pointers.size === 2) {
        // Two pointers - pinch gesture starting
        ref.initialPinchDistance = null; // Will be set on first move
        ref.initialScale = scale;
        setIsGesturing(true);
      }
    },
    [scale, translateX, translateY],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const ref = gestureRef.current;

      // Update pointer position
      if (!ref.pointers.has(e.pointerId)) return;
      ref.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (ref.pointers.size === 2) {
        // Pinch gesture
        const pointerArray = Array.from(ref.pointers.values());
        const [p1, p2] = pointerArray;
        const currentDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        if (ref.initialPinchDistance === null) {
          // First move of pinch - record initial distance
          ref.initialPinchDistance = currentDistance;
        } else {
          // Calculate new scale
          const scaleFactor = currentDistance / ref.initialPinchDistance;
          const newScale = clamp(
            ref.initialScale * scaleFactor,
            MIN_ZOOM,
            MAX_ZOOM,
          );
          setScale(newScale);
        }
      } else if (ref.pointers.size === 1 && scale > MIN_ZOOM) {
        // Single pointer while zoomed - pan
        const deltaX = e.clientX - ref.panStartX;
        const deltaY = e.clientY - ref.panStartY;

        // Start panning if moved beyond tap threshold
        if (
          !ref.isPanning &&
          (Math.abs(deltaX) > TAP_THRESHOLD || Math.abs(deltaY) > TAP_THRESHOLD)
        ) {
          ref.isPanning = true;
          setIsGesturing(true);
        }

        if (ref.isPanning) {
          // Calculate bounds based on current scale
          const maxTranslateX = ((scale - 1) * containerSize.width) / 2;
          const maxTranslateY = ((scale - 1) * containerSize.height) / 2;

          setTranslateX(
            clamp(
              ref.initialTranslateX + deltaX,
              -maxTranslateX,
              maxTranslateX,
            ),
          );
          setTranslateY(
            clamp(
              ref.initialTranslateY + deltaY,
              -maxTranslateY,
              maxTranslateY,
            ),
          );
        }
      }
    },
    [scale, containerSize.width, containerSize.height],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const ref = gestureRef.current;

      // Release pointer capture
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Pointer may already be released
      }

      const wasMultiTouch = ref.pointers.size >= 2;

      // Remove this pointer
      ref.pointers.delete(e.pointerId);

      // If transitioning from multi-touch to single touch, reset pan start
      if (wasMultiTouch && ref.pointers.size === 1) {
        const remainingPointer = Array.from(ref.pointers.values())[0];
        ref.panStartX = remainingPointer.x;
        ref.panStartY = remainingPointer.y;
        ref.initialTranslateX = translateX;
        ref.initialTranslateY = translateY;
        ref.initialPinchDistance = null;
        return;
      }

      // All pointers released
      if (ref.pointers.size === 0) {
        setIsGesturing(false);

        // Check for tap or swipe (only if we weren't panning or pinching)
        if (!ref.isPanning && !wasMultiTouch) {
          const deltaX = e.clientX - ref.gestureStartX;
          const deltaY = e.clientY - ref.gestureStartY;
          const deltaTime = Date.now() - ref.gestureStartTime;

          // Check for tap
          if (
            Math.abs(deltaX) < TAP_THRESHOLD &&
            Math.abs(deltaY) < TAP_THRESHOLD &&
            deltaTime < TAP_MAX_DURATION
          ) {
            callbacks.onTap?.();
          }
          // Check for horizontal swipe (only when not zoomed)
          else if (scale === MIN_ZOOM && deltaTime < SWIPE_MAX_DURATION) {
            if (deltaX > SWIPE_THRESHOLD) {
              callbacks.onSwipeRight?.();
            } else if (deltaX < -SWIPE_THRESHOLD) {
              callbacks.onSwipeLeft?.();
            }
          }
        }

        // Reset gesture state
        ref.isPanning = false;
        ref.initialPinchDistance = null;
      }
    },
    [callbacks, scale, translateX, translateY],
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      handlePointerUp(e);
    },
    [handlePointerUp],
  );

  return {
    state: {
      scale,
      translateX,
      translateY,
      isGesturing,
    },
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
    resetTransform,
  };
}
