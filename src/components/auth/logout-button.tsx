"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { isConvexAvailable } from "@/lib/convex-available";

function LogoutButtonContent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
}

export function LogoutButton() {
  if (!isConvexAvailable()) {
    return null;
  }

  return <LogoutButtonContent />;
}
