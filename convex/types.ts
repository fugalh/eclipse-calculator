/**
 * Shared Convex Types for Eclipse Calculator
 * Types used by both Convex functions and NextJS client
 */

// ============================================================================
// Photo Annotation Types
// ============================================================================

export interface PhotoAnnotation {
  x: number;
  y: number;
  text: string;
}

// ============================================================================
// Game Photo Types
// ============================================================================

export interface GamePhotoMetadata {
  uploadedAt: number; // timestamp
  gameRound?: number;
  playerCount?: number;
  notes?: string;
  annotations?: PhotoAnnotation[];
}

// ============================================================================
// Game Session Types
// ============================================================================

export interface GameSession {
  name?: string;
  createdAt: number;
  photoIds: string[];
  playerCount?: number;
}
