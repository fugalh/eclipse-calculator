"use client";

import { useState } from "react";
import { Check, Copy, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ShipConfig, BattleResults } from "@/lib/types";
import {
  generateShareUrl,
  formatResultsAsText,
  canUseWebShare,
  shareViaWebShare,
  copyToClipboard,
} from "@/lib/share";

interface ShareResultsProps {
  results: BattleResults;
  defenders: ShipConfig[];
  attackers: ShipConfig[];
}

type CopiedState = "none" | "link" | "text";

export function ShareResults({
  results,
  defenders,
  attackers,
}: ShareResultsProps) {
  const [copied, setCopied] = useState<CopiedState>("none");
  const showWebShare = canUseWebShare();

  const handleCopyLink = async () => {
    const url = generateShareUrl(defenders, attackers);
    const success = await copyToClipboard(url);
    if (success) {
      setCopied("link");
      setTimeout(() => setCopied("none"), 2000);
    }
  };

  const handleCopyText = async () => {
    const text = formatResultsAsText(results, defenders, attackers);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied("text");
      setTimeout(() => setCopied("none"), 2000);
    }
  };

  const handleWebShare = async () => {
    const url = generateShareUrl(defenders, attackers);
    const text = `Eclipse Combat: ${Math.round(results.defender * 100)}% Defender vs ${Math.round(results.attacker * 100)}% Attacker`;
    await shareViaWebShare("Eclipse Combat Results", text, url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 size-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied === "link" ? (
            <Check className="mr-2 size-4 text-green-500" />
          ) : (
            <Copy className="mr-2 size-4" />
          )}
          {copied === "link" ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>

        {showWebShare && (
          <DropdownMenuItem onClick={handleWebShare}>
            <Share2 className="mr-2 size-4" />
            Share...
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleCopyText}>
          {copied === "text" ? (
            <Check className="mr-2 size-4 text-green-500" />
          ) : (
            <FileText className="mr-2 size-4" />
          )}
          {copied === "text" ? "Copied!" : "Copy as Text"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
