# Phase 4: Gameplay Photo Upload - Implementation Plan

## Overview

Implement photo upload and sharing for Eclipse: Second Dawn gameplay, with Convex Auth for user authentication and Convex Storage for images. Photos are typed (Tech Tray, Sector Map) and linked to game sessions, with newer photos replacing older ones of the same type.

## Key Design Decisions

| Decision        | Choice                 | Rationale                                          |
| --------------- | ---------------------- | -------------------------------------------------- |
| **Auth**        | Convex Auth (Password) | User requested; follows my-fitness-app pattern     |
| **Storage**     | Convex Storage         | Start simple; structure for uploadthing pivot      |
| **Sessions**    | Include                | Group photos by game; enable photo replacement     |
| **Photo Types** | Tech Tray, Sector Map  | Auto-replace older photos of same type per session |
| **Sharing**     | Collaborative          | Anyone with session link can upload photos         |
| **Annotations** | Defer                  | Only metadata (type, gameId) for Phase 4           |

## Collaborative Session Model

Sessions have a **shareCode** (short random string like `ABC123`) that allows **authenticated users** to:

1. View the session and all photos
2. Upload new photos
3. Session owner can delete any photo; uploaders can delete their own
4. Session owner can block users from the session

```
Session URL: /photos/join/ABC123
```

Non-authenticated users are redirected to sign in/up, then returned to the session after authentication.

**Blocking:** Blocked users cannot view or upload to the session. Their existing photos remain but they lose access.

---

## Implementation Steps

### Step 1: Install Dependencies

```bash
bun add @convex-dev/auth @auth/core@0.37.0
bun add uploadthing @uploadthing/react
npx @convex-dev/auth
```

### Step 2: Convex Auth Setup

**Create: `convex/auth.ts`**

```typescript
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
```

**Create: `convex/auth.config.ts`**

```typescript
export default {
  providers: [{ domain: process.env.CONVEX_SITE_URL, applicationID: "convex" }],
};
```

**Create: `convex/http.ts`**

```typescript
import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);

export default http;
```

### Step 3: Update Schema

**Modify: `convex/schema.ts`**

```typescript
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  gameSessions: defineTable({
    ownerId: v.id("users"), // Session creator
    shareCode: v.string(), // 6-char code for sharing (e.g., "ABC123")
    name: v.optional(v.string()),
    createdAt: v.number(),
    playerCount: v.optional(v.number()),
    blockedUsers: v.optional(v.array(v.id("users"))), // Blocked user IDs
  })
    .index("by_owner", ["ownerId"])
    .index("by_share_code", ["shareCode"]), // For joining via link

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
```

### Step 4: Create Convex Functions

**Create: `convex/sessions.ts`**

- `create` - Create session with generated shareCode
- `getByShareCode` - Lookup session by share code (checks blocked)
- `listOwned` - List sessions user owns
- `listJoined` - List sessions user has uploaded to
- `get` - Get single session by ID (checks blocked)
- `update` - Update name/playerCount (owner only)
- `delete` - Delete session and all photos (owner only)
- `blockUser` - Add user to blockedUsers array (owner only)
- `unblockUser` - Remove user from blockedUsers array (owner only)
- `listParticipants` - List users who have uploaded photos (owner only)

**Create: `convex/photos.ts`**

- `generateUploadUrl` - Get presigned upload URL (requires auth)
- `create` - Save photo with uploaderId, delete older photo of same type/uploader
- `get` - Get single photo with URL (requires auth)
- `getBySessionAndType` - Get photo by session + type (requires auth)
- `listBySession` - List photos in a session (requires auth)
- `delete` - Delete photo (session owner or photo uploader only)

**Create: `convex/storage.ts`** (abstraction layer for pivot)

```typescript
// Abstraction to swap Convex Storage <-> uploadthing
export async function getImageUrl(ctx: QueryCtx, storageId: Id<"_storage">) {
  return await ctx.storage.getUrl(storageId);
}

export async function deleteImage(ctx: MutationCtx, storageId: Id<"_storage">) {
  await ctx.storage.delete(storageId);
}
```

### Step 4b: UploadThing Setup (Pre-configured for Pivot)

**Create: `src/app/api/uploadthing/core.ts`**

```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  gamePhotoUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // TODO: Add auth check when pivoting to uploadthing
      return { uploadedAt: Date.now() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        fileUrl: file.ufsUrl,
        fileKey: file.key,
        uploadedAt: metadata.uploadedAt,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

**Create: `src/app/api/uploadthing/route.ts`**

```typescript
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
```

**Create: `src/lib/uploadthing.ts`**

```typescript
import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
```

**Note:** These files are set up but unused until pivot. No `UPLOADTHING_TOKEN` needed until then.

### Step 5: Client Provider Setup

**Create: `src/app/ConvexClientProvider.tsx`**

```typescript
"use client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
```

**Modify: `src/app/layout.tsx`**

- Wrap children with `<ConvexClientProvider>`

### Step 6: Auth Components

**Create: `src/components/auth/sign-in-form.tsx`**
**Create: `src/components/auth/sign-up-form.tsx`**

- Use `useAuthActions()` from `@convex-dev/auth/react`
- Password flow with email/password
- Redirect on success

**Create: `src/app/(auth)/sign-in/page.tsx`**
**Create: `src/app/(auth)/sign-up/page.tsx`**

- Redirect authenticated users to /photos

### Step 7: Photo Components

**Create: `src/components/photos/photo-uploader.tsx`**

```typescript
// Flow:
// 1. generateUploadUrl() mutation
// 2. fetch(url, { method: "POST", body: file })
// 3. create({ storageId, sessionId, photoType }) mutation
// 4. Auto-deletes older photo of same type
```

**Create: `src/components/photos/session-card.tsx`**

- Shows session name, date, player count
- Preview thumbnails of photos

**Create: `src/components/photos/photo-grid.tsx`**

- Displays photos in a session by type
- Click to view full size

**Create: `src/components/photos/photo-viewer.tsx`**

- Full-size photo view with metadata
- Share link, delete button

### Step 8: Photo Pages

**Create: `src/app/photos/page.tsx`**

- Protected route (redirect if not authenticated)
- List user's game sessions
- Create new session button
- Each session shows photo previews

**Create: `src/app/photos/join/[shareCode]/page.tsx`**

- Protected route (requires authentication)
- Redirects to sign-in with return URL if not authenticated
- Shows session with photos once authenticated
- Authenticated users can upload directly

**Create: `src/app/photos/[sessionId]/page.tsx`**

- Session detail view (for session owner)
- Upload photos by type (Tech Tray, Sector Map)
- Grid of current photos
- Copy share link button

**Create: `src/app/photos/[sessionId]/[photoId]/page.tsx`**

- Individual photo view
- Shareable (public by ID)
- Metadata display

### Step 9: Update Navigation

**Modify: `src/components/layout/global-nav.tsx`**

```typescript
import { Camera } from "lucide-react";

const NAV_ITEMS = [
  { label: "Calculator", href: "/", icon: Calculator },
  { label: "Reference", href: "/reference", icon: BookOpen },
  { label: "Search", href: "/search", icon: Search },
  { label: "Photos", href: "/photos", icon: Camera },
];
```

### Step 10: Types Update

**Modify: `convex/types.ts`**

```typescript
export type PhotoType = "tech_tray" | "sector_map" | "other";

export interface GameSessionData {
  _id: Id<"gameSessions">;
  name?: string;
  createdAt: number;
  playerCount?: number;
}

export interface GamePhotoData {
  _id: Id<"gamePhotos">;
  sessionId: Id<"gameSessions">;
  photoType: PhotoType;
  uploadedAt: number;
  gameRound?: number;
  notes?: string;
  url: string; // Resolved from storage
}
```

---

## File Summary

### New Files (19)

| File                                       | Purpose                                  |
| ------------------------------------------ | ---------------------------------------- |
| `convex/auth.ts`                           | Convex Auth configuration                |
| `convex/auth.config.ts`                    | Auth provider config                     |
| `convex/http.ts`                           | HTTP routes for auth                     |
| `convex/sessions.ts`                       | Game session CRUD                        |
| `convex/photos.ts`                         | Photo CRUD with storage                  |
| `convex/storage.ts`                        | Storage abstraction layer                |
| `src/app/api/uploadthing/core.ts`          | UploadThing file router (pre-configured) |
| `src/app/api/uploadthing/route.ts`         | UploadThing API handler (pre-configured) |
| `src/lib/uploadthing.ts`                   | UploadThing React hooks (pre-configured) |
| `src/app/ConvexClientProvider.tsx`         | Auth provider wrapper                    |
| `src/components/auth/sign-in-form.tsx`     | Sign in form                             |
| `src/components/auth/sign-up-form.tsx`     | Sign up form                             |
| `src/app/(auth)/sign-in/page.tsx`          | Sign in page                             |
| `src/app/(auth)/sign-up/page.tsx`          | Sign up page                             |
| `src/components/photos/photo-uploader.tsx` | Upload component                         |
| `src/components/photos/session-card.tsx`   | Session display                          |
| `src/app/photos/page.tsx`                  | Sessions list page                       |
| `src/app/photos/join/[shareCode]/page.tsx` | Join session page                        |
| `src/app/photos/[sessionId]/page.tsx`      | Session detail page                      |

### Modified Files (4)

| File                                   | Changes                                        |
| -------------------------------------- | ---------------------------------------------- |
| `convex/schema.ts`                     | Add authTables, update gameSessions/gamePhotos |
| `convex/types.ts`                      | Add PhotoType, session/photo data types        |
| `src/app/layout.tsx`                   | Wrap with ConvexClientProvider                 |
| `src/components/layout/global-nav.tsx` | Add Photos nav item                            |

---

## uploadthing Pivot Strategy

The `convex/storage.ts` abstraction allows swapping storage backends:

```typescript
// Current: Convex Storage
export async function getImageUrl(ctx, storageId) {
  return await ctx.storage.getUrl(storageId);
}

// Future: uploadthing
export async function getImageUrl(ctx, fileUrl) {
  return fileUrl; // URL stored directly
}
```

Schema change for pivot:

```typescript
// From
storageId: v.id("_storage")

// To
fileUrl: v.string(),
fileKey: v.string(),
```

---

## Testing Checklist

### Authentication

- [ ] Create account with email/password
- [ ] Sign in/out flow
- [ ] Redirect to sign-in when accessing /photos without auth
- [ ] Return to original URL after sign-in

### Session Management

- [ ] Create game session (generates shareCode)
- [ ] View owned sessions list
- [ ] Copy share link from session
- [ ] Join session via share code (as different user)

### Photo Upload

- [ ] Upload Tech Tray photo
- [ ] Upload Sector Map photo
- [ ] Upload second Tech Tray (replaces first)
- [ ] Multiple users upload to same session

### Permissions

- [ ] Session owner can delete any photo
- [ ] Uploader can delete own photo
- [ ] Non-owner cannot delete others' photos
- [ ] Only owner can delete session
- [ ] Owner can block a user
- [ ] Blocked user cannot view session
- [ ] Blocked user cannot upload to session

### Mobile

- [ ] Responsive upload UI
- [ ] Photo grid displays correctly

---

## Reference Files

### Convex Auth Patterns (my-fitness-app)

| File                                                                      | Reference For                             |
| ------------------------------------------------------------------------- | ----------------------------------------- |
| `/Users/russfugal/repo/my-fitness-app/convex/auth.ts`                     | Auth configuration with Password provider |
| `/Users/russfugal/repo/my-fitness-app/convex/auth.config.ts`              | Auth config structure                     |
| `/Users/russfugal/repo/my-fitness-app/convex/http.ts`                     | HTTP router with auth routes              |
| `/Users/russfugal/repo/my-fitness-app/convex/schema.ts`                   | Schema with authTables spread             |
| `/Users/russfugal/repo/my-fitness-app/convex/userProfile.ts`              | Protected queries/mutations pattern       |
| `/Users/russfugal/repo/my-fitness-app/convex/measurements.ts`             | CRUD with ownership checks                |
| `/Users/russfugal/repo/my-fitness-app/src/app/ConvexClientProvider.tsx`   | ConvexAuthProvider setup                  |
| `/Users/russfugal/repo/my-fitness-app/src/components/auth/SignInForm.tsx` | Sign in form with useAuthActions          |
| `/Users/russfugal/repo/my-fitness-app/src/components/auth/SignUpForm.tsx` | Sign up form with password flow           |
| `/Users/russfugal/repo/my-fitness-app/src/app/(dashboard)/layout.tsx`     | Protected route with useConvexAuth        |

### UploadThing Patterns

| File                                                                                    | Reference For                  |
| --------------------------------------------------------------------------------------- | ------------------------------ |
| `/Users/russfugal/repo/uploadthing/docs/src/app/(docs)/getting-started/appdir/page.mdx` | Next.js App Router setup guide |
| `/Users/russfugal/repo/uploadthing/docs/src/app/(api)/api-reference/server/page.mdx`    | Server API reference           |
| `/Users/russfugal/repo/uploadthing/examples/minimal-appdir/`                            | Minimal Next.js example        |

### Current Project

| File                                                                            | Reference For                |
| ------------------------------------------------------------------------------- | ---------------------------- |
| `/Users/russfugal/repo/eclipse-calculator/convex/schema.ts`                     | Current schema to modify     |
| `/Users/russfugal/repo/eclipse-calculator/convex/types.ts`                      | Current types to extend      |
| `/Users/russfugal/repo/eclipse-calculator/src/app/layout.tsx`                   | Layout to wrap with provider |
| `/Users/russfugal/repo/eclipse-calculator/src/components/layout/global-nav.tsx` | Navigation to update         |
| `/Users/russfugal/repo/eclipse-calculator/ROADMAP.md`                           | Phase 4 requirements         |

---

## Completion Summary

**Completed: 2024-12-30**

### Files Created (21)

| File                                              | Purpose                                    |
| ------------------------------------------------- | ------------------------------------------ |
| `convex/auth.ts`                                  | Convex Auth with Password provider         |
| `convex/auth.config.ts`                           | Auth provider configuration                |
| `convex/http.ts`                                  | HTTP routes for auth                       |
| `convex/sessions.ts`                              | Game session CRUD with sharing, blocking   |
| `convex/photos.ts`                                | Photo CRUD with Convex Storage             |
| `convex/storage.ts`                               | Storage abstraction layer for future pivot |
| `src/app/api/uploadthing/core.ts`                 | UploadThing file router (pre-configured)   |
| `src/app/api/uploadthing/route.ts`                | UploadThing API handler (pre-configured)   |
| `src/lib/uploadthing.ts`                          | UploadThing React hooks (pre-configured)   |
| `src/app/ConvexClientProvider.tsx`                | ConvexAuthProvider wrapper                 |
| `src/components/auth/sign-in-form.tsx`            | Sign in form with return URL support       |
| `src/components/auth/sign-up-form.tsx`            | Sign up form with validation               |
| `src/app/(auth)/sign-in/page.tsx`                 | Sign in page with redirect                 |
| `src/app/(auth)/sign-up/page.tsx`                 | Sign up page with redirect                 |
| `src/components/photos/photo-uploader.tsx`        | Photo upload with type selection           |
| `src/components/photos/session-card.tsx`          | Session display card                       |
| `src/components/photos/photo-grid.tsx`            | Photo gallery with viewer modal            |
| `src/components/photos/create-session-dialog.tsx` | Create session dialog                      |
| `src/app/photos/page.tsx`                         | Sessions list (owned/joined tabs)          |
| `src/app/photos/join/[shareCode]/page.tsx`        | Join session via share code                |
| `src/app/photos/[sessionId]/page.tsx`             | Session detail with photos                 |

### Files Modified (4)

| File                                   | Changes                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| `convex/schema.ts`                     | Added authTables, updated gameSessions/gamePhotos with userId, shareCode, blockedUsers |
| `convex/types.ts`                      | Added PhotoType, GamePhotoData, GameSessionData types                                  |
| `src/app/layout.tsx`                   | Wrapped with ConvexClientProvider                                                      |
| `src/components/layout/global-nav.tsx` | Added Photos nav item with Camera icon                                                 |

### Dependencies Added

- `@convex-dev/auth@0.0.90`
- `@auth/core@0.37.0`
- `uploadthing@7.7.4`
- `@uploadthing/react@7.3.3`
- `date-fns` (for date formatting)

### UI Components Added

- `tabs` from shadcn/ui

### Key Features Implemented

1. **Authentication**: Email/password auth with Convex Auth
2. **Session Management**: Create sessions with auto-generated share codes
3. **Photo Upload**: Upload photos with type selection (Tech Tray, Sector Map, Other)
4. **Auto-Replace**: New photos of same type replace older ones per user per session
5. **Sharing**: Share sessions via 6-character codes (e.g., ABC123)
6. **Permissions**: Session owner can delete any photo; uploaders can delete own photos
7. **Blocking**: Session owner can block users from viewing/uploading
8. **Protected Routes**: Photos pages redirect to sign-in if not authenticated

### Notes

- UploadThing is pre-configured but not active (no UPLOADTHING_TOKEN needed yet)
- Storage abstraction layer (`convex/storage.ts`) ready for uploadthing pivot
- All type checks and linting pass
