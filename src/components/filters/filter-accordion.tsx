"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number;
  className?: string;
}

/**
 * Collapsible accordion wrapper for filter sections
 * Shows optional count badge and animates open/close
 */
export function FilterAccordion({
  title,
  children,
  defaultOpen = false,
  badge,
  className,
}: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left hover:bg-muted/50 px-1"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 font-medium">
          {title}
          {badge !== undefined && badge > 0 && (
            <Badge variant="secondary" className="ml-1">
              {badge}
            </Badge>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-[500px] pb-4" : "max-h-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}
