/**
 * Convex Database Schema for Eclipse Calculator
 * Defines the structure of the Convex database tables
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Game photos table - stores uploaded gameplay photos
  gamePhotos: defineTable({
    // Reference to the file in Convex storage
    storageId: v.string(),
    // Timestamp when the photo was uploaded
    uploadedAt: v.number(),
    // Optional game round number (1-8 for Second Dawn)
    gameRound: v.optional(v.number()),
    // Optional number of players in the game
    playerCount: v.optional(v.number()),
    // Optional notes about the photo
    notes: v.optional(v.string()),
    // Optional annotations on the photo
    annotations: v.optional(
      v.array(
        v.object({
          x: v.number(),
          y: v.number(),
          text: v.string(),
        }),
      ),
    ),
    // Optional reference to a game session
    sessionId: v.optional(v.id("gameSessions")),
  }),

  // Game sessions table - groups related photos together
  gameSessions: defineTable({
    // Optional name for the session
    name: v.optional(v.string()),
    // Timestamp when the session was created
    createdAt: v.number(),
    // Number of players in this game
    playerCount: v.optional(v.number()),
  }),
});
