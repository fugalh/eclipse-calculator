/**
 * Storage Abstraction Layer
 * Allows swapping Convex Storage <-> uploadthing
 */

import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export async function getImageUrl(
  ctx: QueryCtx,
  storageId: Id<"_storage">,
): Promise<string | null> {
  return await ctx.storage.getUrl(storageId);
}

export async function deleteImage(
  ctx: MutationCtx,
  storageId: Id<"_storage">,
): Promise<void> {
  await ctx.storage.delete(storageId);
}
