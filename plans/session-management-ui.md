# Plan: Session Delete, Join-by-Code, Auto-Cleanup & Photo Fix

## Summary

1. **Delete session UI** - Allow owners to delete sessions from both SessionCard and session detail page
2. **Join by code dialog** - Enter 6-character share code (no URL required)
3. **Cron cleanup** - Auto-delete inactive sessions (>5 days) and their photos
4. **Photo type fix** - "other" type should not overwrite previous photos

---

## Files to Modify

| File                                            | Change                                                                           |
| ----------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/components/photos/session-card.tsx`        | Add delete button (owner only)                                                   |
| `src/app/photos/[sessionId]/page.tsx`           | Add delete button with confirmation                                              |
| `src/app/photos/page.tsx`                       | Add JoinSessionDialog button                                                     |
| `src/components/photos/join-session-dialog.tsx` | **NEW** - Dialog with code input                                                 |
| `convex/schema.ts`                              | Add `lastActivityAt` field to gameSessions                                       |
| `convex/sessions.ts`                            | Update `lastActivityAt` on create, add internal cleanup mutation                 |
| `convex/photos.ts`                              | Update session `lastActivityAt` on photo upload, skip overwrite for "other" type |
| `convex/crons.ts`                               | **NEW** - Daily cron to cleanup stale sessions                                   |

---

## Implementation Steps

### 1. Schema: Add Activity Tracking

**File:** `convex/schema.ts`

Add `lastActivityAt: v.number()` to `gameSessions` table for tracking last activity timestamp.

### 2. Create Cron for Session Cleanup

**File:** `convex/crons.ts` (NEW)

```ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "cleanup stale sessions",
  { hourUTC: 3, minuteUTC: 0 }, // 3:00 AM UTC
  internal.sessions.cleanupStaleSessions,
);

export default crons;
```

### 3. Add Cleanup Mutation

**File:** `convex/sessions.ts`

Add internal mutation `cleanupStaleSessions`:

- Query all sessions where `lastActivityAt < Date.now() - 5 * 24 * 60 * 60 * 1000`
- For each stale session: delete all photos (and storage), then delete session
- Log count of deleted sessions

### 4. Update Activity on Photo Upload

**File:** `convex/photos.ts`

In `create` mutation:

- After inserting photo, patch session's `lastActivityAt = Date.now()`

### 5. Fix "other" Photo Type Overwrite

**File:** `convex/photos.ts`

In `create` mutation:

- Only delete existing photos if `photoType !== "other"`
- "other" photos accumulate without replacement

### 6. Create JoinSessionDialog Component

**File:** `src/components/photos/join-session-dialog.tsx`

- Dialog with 6-character code input (uppercase, alphanumeric)
- Auto-uppercase input, max 6 chars
- "Join" button calls `sessions.getByShareCode`
- On success: redirect to `/photos/[sessionId]`
- On failure: show "Session not found" error

### 7. Add JoinSessionDialog to Photos Page

**File:** `src/app/photos/page.tsx`

- Add "Join Session" button next to "New Session" in header
- Import and render `JoinSessionDialog`

### 8. Add Delete to SessionCard

**File:** `src/components/photos/session-card.tsx`

- Add delete icon button (Trash2) when `isOwner` prop is true
- Use `AlertDialog` for confirmation
- Call `sessions.remove` mutation
- Prevent card navigation when clicking delete

### 9. Add Delete to Session Detail Page

**File:** `src/app/photos/[sessionId]/page.tsx`

- Add delete button in header area (owner only)
- Use `AlertDialog` for confirmation
- Call `sessions.remove` mutation
- Redirect to `/photos` after successful deletion

---

## Data Migration Note

Existing sessions will have `lastActivityAt = undefined`. The cron should handle this by treating `undefined` as "created at" time (use `createdAt` as fallback).

---

## Completion Summary

**Completed:** 2024-12-30

All features implemented successfully:

1. **Schema updated** - Added `lastActivityAt` optional field to `gameSessions` table
2. **Cron job created** - `convex/crons.ts` runs daily at 3 AM UTC to cleanup stale sessions (>5 days inactive)
3. **Cleanup mutation added** - `cleanupStaleSessions` internal mutation in `sessions.ts` handles cascade deletion
4. **Activity tracking** - Sessions update `lastActivityAt` on creation and photo uploads
5. **Photo type fix** - "other" photos no longer overwrite; only `tech_tray` and `sector_map` replace existing
6. **JoinSessionDialog** - New component for entering 6-char codes directly
7. **Delete UI** - Added to both SessionCard (inline with Owner badge) and session detail page
8. **Bug fix** - Added `e.preventDefault()` to trash button to prevent Link navigation when opening delete dialog
