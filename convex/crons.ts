/**
 * Convex Cron Jobs
 * Scheduled tasks for maintenance and cleanup
 */

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Clean up stale sessions (>5 days of inactivity) daily at 3:00 AM UTC
crons.daily(
  "cleanup stale sessions",
  { hourUTC: 3, minuteUTC: 0 },
  internal.sessions.cleanupStaleSessions,
);

export default crons;
