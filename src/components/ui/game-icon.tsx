import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface GameIconProps {
  /** Path to the icon image, or null for fallback */
  src: string | null;
  /** Alt text for accessibility */
  alt: string;
  /** Text to display when src is null */
  fallback?: string;
  /** Icon size preset */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SIZE_CONFIG = {
  sm: { classes: "w-5 h-5", pixels: 20 },
  md: { classes: "w-6 h-6", pixels: 24 },
  lg: { classes: "w-8 h-8", pixels: 32 },
} as const;

// ============================================================================
// Component
// ============================================================================

/**
 * Renders a game icon with Next.js Image optimization.
 * Falls back to text when src is null.
 */
export function GameIcon({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: GameIconProps) {
  const config = SIZE_CONFIG[size];

  // Fallback to text when icon is missing
  if (!src) {
    return (
      <span
        className={cn(
          "flex items-center justify-center font-medium text-xs",
          config.classes,
          className,
        )}
      >
        {fallback}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={config.pixels}
      height={config.pixels}
      className={cn(config.classes, "object-contain", className)}
      unoptimized // Use original PNGs without Next.js optimization for small icons
    />
  );
}
