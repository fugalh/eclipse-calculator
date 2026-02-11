"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Loader2 } from "lucide-react";

export function JoinSessionDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Only query when we have a full 6-character code and user clicks Join
  const session = useQuery(
    api.sessions.getByShareCode,
    isJoining && code.length === 6 ? { shareCode: code } : "skip",
  );

  // Derive error state from session lookup result (calculated during render, not in effect)
  const hasSessionError = isJoining && session === null;
  const displayError =
    localError || hasSessionError
      ? "Session not found. Check the code and try again."
      : null;

  // Handle successful session lookup - only navigation in effect
  useEffect(() => {
    if (isJoining && session && session !== null) {
      // Navigation is an external side effect, appropriate for useEffect
      router.push(`/photos/${session._id}`);
    }
  }, [session, isJoining, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (code.length !== 6) {
      setLocalError("Please enter a 6-character code");
      return;
    }

    setIsJoining(true);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and limit to 6 characters
    const value = e.target.value.toUpperCase().slice(0, 6);
    setCode(value);
    setLocalError(null);
    // Reset error when user types
    if (hasSessionError) {
      setIsJoining(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Event handler can safely reset state
      setCode("");
      setLocalError(null);
      setIsJoining(false);
    }
  };

  const handleRetry = () => {
    // Event handler to reset error state
    setIsJoining(false);
    setLocalError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Join Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join Game Session</DialogTitle>
            <DialogDescription>
              Enter the 6-character code shared by the session owner
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {displayError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {displayError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="code">Session Code</Label>
              <Input
                id="code"
                placeholder="ABC123"
                value={code}
                onChange={handleCodeChange}
                className="font-mono text-center text-lg tracking-widest"
                maxLength={6}
                autoComplete="off"
                disabled={isJoining && session === undefined}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            {hasSessionError ? (
              <Button type="button" onClick={handleRetry}>
                Try Again
              </Button>
            ) : (
              <Button type="submit" disabled={isJoining || code.length !== 6}>
                {isJoining && session === undefined ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Session"
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
