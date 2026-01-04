/**
 * Shared Convex Types for Eclipse Calculator
 * Types used by both Convex functions and NextJS client
 */

import type { Id } from "./_generated/dataModel";

// ============================================================================
// Photo Types
// ============================================================================

export type PhotoType = "tech_tray" | "sector_map" | "other";

export interface GamePhotoData {
  _id: Id<"gamePhotos">;
  userId: Id<"users">;
  sessionId: Id<"gameSessions">;
  photoType: PhotoType;
  uploadedAt: number;
  gameRound?: number;
  notes?: string;
  url: string; // Resolved from storage
}

// ============================================================================
// Game Session Types
// ============================================================================

export interface GameSessionData {
  _id: Id<"gameSessions">;
  ownerId: Id<"users">;
  shareCode: string;
  name?: string;
  createdAt: number;
  playerCount?: number;
}

export interface GameSessionWithPhotos extends GameSessionData {
  photos: GamePhotoData[];
}
