/**
 * Game Session Functions
 * CRUD operations for game sessions with sharing support
 */

import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { auth } from "./auth";

// Generate a random 6-character share code
function generateShareCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Avoid confusing chars
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const create = mutation({
  args: {
    name: v.optional(v.string()),
    playerCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Generate unique share code
    let shareCode = generateShareCode();
    let existing = await ctx.db
      .query("gameSessions")
      .withIndex("by_share_code", (q) => q.eq("shareCode", shareCode))
      .first();

    // Retry if collision (rare)
    while (existing) {
      shareCode = generateShareCode();
      existing = await ctx.db
        .query("gameSessions")
        .withIndex("by_share_code", (q) => q.eq("shareCode", shareCode))
        .first();
    }

    const now = Date.now();
    return await ctx.db.insert("gameSessions", {
      ownerId: userId,
      shareCode,
      name: args.name,
      createdAt: now,
      lastActivityAt: now,
      playerCount: args.playerCount,
    });
  },
});

export const get = query({
  args: { id: v.id("gameSessions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const session = await ctx.db.get(args.id);
    if (!session) return null;

    // Check if user is blocked
    if (session.blockedUsers?.includes(userId)) {
      return null;
    }

    return session;
  },
});

export const getByShareCode = query({
  args: { shareCode: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const session = await ctx.db
      .query("gameSessions")
      .withIndex("by_share_code", (q) => q.eq("shareCode", args.shareCode))
      .first();

    if (!session) return null;

    // Check if user is blocked
    if (session.blockedUsers?.includes(userId)) {
      return null;
    }

    return session;
  },
});

export const listOwned = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("gameSessions")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .order("desc")
      .collect();
  },
});

export const listJoined = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    // Find sessions where user has uploaded photos (but doesn't own)
    const userPhotos = await ctx.db
      .query("gamePhotos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const sessionIds = [...new Set(userPhotos.map((p) => p.sessionId))];

    const sessions = await Promise.all(sessionIds.map((id) => ctx.db.get(id)));

    return sessions
      .filter(
        (s): s is NonNullable<typeof s> => s !== null && s.ownerId !== userId,
      )
      .filter((s) => !s.blockedUsers?.includes(userId));
  },
});

export const update = mutation({
  args: {
    id: v.id("gameSessions"),
    name: v.optional(v.string()),
    playerCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.id);
    if (!session || session.ownerId !== userId) {
      throw new Error("Session not found or not authorized");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("gameSessions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.id);
    if (!session || session.ownerId !== userId) {
      throw new Error("Session not found or not authorized");
    }

    // Delete all photos in the session
    const photos = await ctx.db
      .query("gamePhotos")
      .withIndex("by_session", (q) => q.eq("sessionId", args.id))
      .collect();

    for (const photo of photos) {
      await ctx.storage.delete(photo.storageId);
      await ctx.db.delete(photo._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const blockUser = mutation({
  args: {
    sessionId: v.id("gameSessions"),
    userIdToBlock: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.ownerId !== userId) {
      throw new Error("Session not found or not authorized");
    }

    // Can't block yourself
    if (args.userIdToBlock === userId) {
      throw new Error("Cannot block yourself");
    }

    const blockedUsers = session.blockedUsers ?? [];
    if (!blockedUsers.includes(args.userIdToBlock)) {
      blockedUsers.push(args.userIdToBlock);
      await ctx.db.patch(args.sessionId, { blockedUsers });
    }
  },
});

export const unblockUser = mutation({
  args: {
    sessionId: v.id("gameSessions"),
    userIdToUnblock: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.ownerId !== userId) {
      throw new Error("Session not found or not authorized");
    }

    const blockedUsers = session.blockedUsers ?? [];
    const index = blockedUsers.indexOf(args.userIdToUnblock);
    if (index > -1) {
      blockedUsers.splice(index, 1);
      await ctx.db.patch(args.sessionId, { blockedUsers });
    }
  },
});

export const listParticipants = query({
  args: { sessionId: v.id("gameSessions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.ownerId !== userId) {
      return []; // Only owner can see participants
    }

    // Get unique user IDs who have uploaded photos
    const photos = await ctx.db
      .query("gamePhotos")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const participantIds = [...new Set(photos.map((p) => p.userId))];

    // Get user info for each participant
    const participants = await Promise.all(
      participantIds.map(async (id) => {
        const user = await ctx.db.get(id);
        return user
          ? {
              _id: id,
              email: user.email,
              isBlocked: session.blockedUsers?.includes(id) ?? false,
            }
          : null;
      }),
    );

    return participants.filter((p) => p !== null);
  },
});

// Internal mutation to cleanup stale sessions (called by cron)
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export const cleanupStaleSessions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoffTime = Date.now() - FIVE_DAYS_MS;

    // Get all sessions
    const allSessions = await ctx.db.query("gameSessions").collect();

    // Filter to stale sessions (use lastActivityAt or fallback to createdAt)
    const staleSessions = allSessions.filter((session) => {
      const activityTime = session.lastActivityAt ?? session.createdAt;
      return activityTime < cutoffTime;
    });

    let deletedCount = 0;

    for (const session of staleSessions) {
      // Delete all photos in the session
      const photos = await ctx.db
        .query("gamePhotos")
        .withIndex("by_session", (q) => q.eq("sessionId", session._id))
        .collect();

      for (const photo of photos) {
        await ctx.storage.delete(photo.storageId);
        await ctx.db.delete(photo._id);
      }

      // Delete the session
      await ctx.db.delete(session._id);
      deletedCount++;
    }

    console.log(`Cleaned up ${deletedCount} stale sessions`);
  },
});
