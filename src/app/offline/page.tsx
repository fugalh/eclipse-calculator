import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <WifiOff className="size-16 text-muted-foreground mb-6" />
      <h1 className="text-2xl font-bold mb-2">You&apos;re Offline</h1>
      <p className="text-muted-foreground max-w-md">
        This page isn&apos;t available offline. Please check your internet
        connection and try again.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        The Calculator and Reference pages should work offline once they&apos;ve
        been loaded.
      </p>
    </main>
  );
}
