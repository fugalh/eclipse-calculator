import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  gamePhotoUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // TODO: Add authentication check when UploadThing migration is complete
      // This middleware should verify the user session and extract userId
      // Example implementation:
      //   const session = await getAuthSession(req);
      //   if (!session?.userId) {
      //     throw new Error("Unauthorized: You must be signed in to upload photos");
      //   }
      //   return {
      //     uploadedAt: Date.now(),
      //     userId: session.userId,
      //     sessionId: session.sessionId,
      //   };

      // Temporary: Return minimal metadata until auth is implemented
      return {
        uploadedAt: Date.now(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Validate file properties
      if (!file.key || !file.ufsUrl) {
        throw new Error("Invalid upload: missing file key or URL");
      }

      // TODO: Add error handling and audit logging
      // Example:
      //   try {
      //     await db.insert({
      //       fileUrl: file.ufsUrl,
      //       fileKey: file.key,
      //       uploadedAt: metadata.uploadedAt,
      //       userId: metadata.userId,
      //     });
      //     await logUploadEvent(metadata.userId, file.key);
      //   } catch (error) {
      //     console.error("Upload completion failed:", error);
      //     throw error;
      //   }

      return {
        fileUrl: file.ufsUrl,
        fileKey: file.key,
        uploadedAt: metadata.uploadedAt,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
