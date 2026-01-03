"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Platform } from "@/lib/hooks/use-pwa-install";
import { X, Smartphone, Monitor, Download } from "lucide-react";

interface InstallCardProps {
  platform: Platform;
  canPromptNative: boolean;
  onInstall: () => Promise<void>;
  onLearnHow: () => void;
  onDismiss: () => void;
}

export function InstallCard({
  platform,
  canPromptNative,
  onInstall,
  onLearnHow,
  onDismiss,
}: InstallCardProps) {
  const title = getCardTitle(platform);
  const description = getCardDescription(platform);

  const handleAction = () => {
    if (canPromptNative) {
      void onInstall();
    } else {
      onLearnHow();
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </Button>

      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <PlatformIcon platform={platform} />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAction}
          className="w-full sm:w-auto"
        >
          {canPromptNative ? (
            <>
              <Download className="mr-2 h-4 w-4" />
              Install app
            </>
          ) : (
            "Learn how to install"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function PlatformIcon({ platform }: { platform: Platform }) {
  const className = "text-primary h-5 w-5";

  switch (platform) {
    case "ios":
    case "android":
      return <Smartphone className={className} />;
    case "chrome-desktop":
    default:
      return <Monitor className={className} />;
  }
}

function getCardTitle(platform: Platform): string {
  switch (platform) {
    case "ios":
      return "Add to Home Screen";
    case "android":
      return "Install the App";
    case "chrome-desktop":
      return "Install Desktop App";
    default:
      return "Install App";
  }
}

function getCardDescription(platform: Platform): string {
  switch (platform) {
    case "ios":
      return "Quick access from your home screen";
    case "android":
      return "Get the full app experience";
    case "chrome-desktop":
      return "Launch directly from your desktop";
    default:
      return "For a better experience";
  }
}
