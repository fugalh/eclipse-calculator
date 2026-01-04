/**
 * Convex Database Schema for Eclipse Calculator
 * Defines the structure of the Convex database tables
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Game sessions table - groups related photos together
  gameSessions: defineTable({
    ownerId: v.id("users"), // Session creator
    shareCode: v.string(), // 6-char code for sharing (e.g., "ABC123")
    name: v.optional(v.string()),
    createdAt: v.number(),
    lastActivityAt: v.optional(v.number()), // Last activity timestamp for cleanup
    playerCount: v.optional(v.number()),
    blockedUsers: v.optional(v.array(v.id("users"))), // Blocked user IDs
  })
    .index("by_owner", ["ownerId"])
    .index("by_share_code", ["shareCode"]),

  // Game photos table - stores uploaded gameplay photos
  gamePhotos: defineTable({
    userId: v.id("users"),
    sessionId: v.id("gameSessions"),
    // Storage abstraction: storageId for Convex, can swap to fileUrl/fileKey for uploadthing
    storageId: v.id("_storage"),
    photoType: v.union(
      v.literal("tech_tray"),
      v.literal("sector_map"),
      v.literal("other"),
    ),
    uploadedAt: v.number(),
    gameRound: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_session_type", ["sessionId", "photoType"]),
});
