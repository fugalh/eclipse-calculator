/**
 * Game Photo Functions
 * CRUD operations for game photos with Convex Storage
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { getImageUrl, deleteImage } from "./storage";

const photoTypeValidator = v.union(
  v.literal("tech_tray"),
  v.literal("sector_map"),
  v.literal("other"),
);

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    storageId: v.id("_storage"),
    sessionId: v.id("gameSessions"),
    photoType: photoTypeValidator,
    gameRound: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify session exists and user is not blocked
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.blockedUsers?.includes(userId)) {
      throw new Error("You are blocked from this session");
    }

    // Delete older photo of same type by this user in this session
    // (skip for "other" type - those accumulate without replacement)
    if (args.photoType !== "other") {
      const existingPhotos = await ctx.db
        .query("gamePhotos")
        .withIndex("by_session_type", (q) =>
          q.eq("sessionId", args.sessionId).eq("photoType", args.photoType),
        )
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      for (const photo of existingPhotos) {
        await deleteImage(ctx, photo.storageId);
        await ctx.db.delete(photo._id);
      }
    }

    // Update session's last activity timestamp
    await ctx.db.patch(args.sessionId, { lastActivityAt: Date.now() });

    return await ctx.db.insert("gamePhotos", {
      userId,
      sessionId: args.sessionId,
      storageId: args.storageId,
      photoType: args.photoType,
      uploadedAt: Date.now(),
      gameRound: args.gameRound,
      notes: args.notes,
    });
  },
});

export const get = query({
  args: { id: v.id("gamePhotos") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const photo = await ctx.db.get(args.id);
    if (!photo) return null;

    // Verify user has access to session
    const session = await ctx.db.get(photo.sessionId);
    if (!session) return null;
    if (session.blockedUsers?.includes(userId)) return null;

    const url = await getImageUrl(ctx, photo.storageId);
    if (!url) return null;

    return { ...photo, url };
  },
});

export const getBySessionAndType = query({
  args: {
    sessionId: v.id("gameSessions"),
    photoType: photoTypeValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    // Verify user has access to session
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;
    if (session.blockedUsers?.includes(userId)) return null;

    const photo = await ctx.db
      .query("gamePhotos")
      .withIndex("by_session_type", (q) =>
        q.eq("sessionId", args.sessionId).eq("photoType", args.photoType),
      )
      .order("desc")
      .first();

    if (!photo) return null;

    const url = await getImageUrl(ctx, photo.storageId);
    if (!url) return null;

    return { ...photo, url };
  },
});

export const listBySession = query({
  args: { sessionId: v.id("gameSessions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    // Verify user has access to session
    const session = await ctx.db.get(args.sessionId);
    if (!session) return [];
    if (session.blockedUsers?.includes(userId)) return [];

    const photos = await ctx.db
      .query("gamePhotos")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();

    // Resolve URLs for all photos
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        const url = await getImageUrl(ctx, photo.storageId);
        return url ? { ...photo, url } : null;
      }),
    );

    return photosWithUrls.filter((p) => p !== null);
  },
});

export const remove = mutation({
  args: { id: v.id("gamePhotos") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const photo = await ctx.db.get(args.id);
    if (!photo) throw new Error("Photo not found");

    // Check permissions: session owner or photo uploader
    const session = await ctx.db.get(photo.sessionId);
    if (!session) throw new Error("Session not found");

    const isOwner = session.ownerId === userId;
    const isUploader = photo.userId === userId;

    if (!isOwner && !isUploader) {
      throw new Error("Not authorized to delete this photo");
    }

    await deleteImage(ctx, photo.storageId);
    await ctx.db.delete(args.id);
  },
});
