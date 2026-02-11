"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Hoist static plugin array to prevent recreation on every render
const REMARK_PLUGINS = [remarkGfm];

// Consistent prose styling for both expanded and non-expanded states
const PROSE_CLASSES = "prose prose-sm max-w-none dark:prose-invert";

interface RuleContentProps {
  content: string;
  preview?: string;
  className?: string;
}

export function RuleContent({ content, preview, className }: RuleContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsExpansion = content.length > 300;

  if (!needsExpansion) {
    return (
      <div className={cn(PROSE_CLASSES, className)}>
        <ReactMarkdown remarkPlugins={REMARK_PLUGINS}>{content}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={cn(PROSE_CLASSES, className)}>
      <div className={cn(!isExpanded && "line-clamp-4")}>
        <ReactMarkdown remarkPlugins={REMARK_PLUGINS}>
          {isExpanded ? content : preview || content}
        </ReactMarkdown>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-primary"
      >
        {isExpanded ? (
          <>
            Show less <ChevronUp className="ml-1 h-4 w-4" />
          </>
        ) : (
          <>
            Read more <ChevronDown className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
