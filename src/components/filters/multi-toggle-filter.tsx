"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FilterOption } from "@/lib/types";

interface MultiToggleFilterProps<T extends string> {
  options: FilterOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
  className?: string;
}

/**
 * Generic multi-select toggle filter with pill-shaped buttons
 * Supports count badges and optional color-coding per option
 */
export function MultiToggleFilter<T extends string>({
  options,
  selected,
  onChange,
  className,
}: MultiToggleFilterProps<T>) {
  const handleToggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);

        return (
          <Button
            key={option.value}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => handleToggle(option.value)}
            className={cn(
              "transition-colors",
              isSelected && option.color && option.color,
              isSelected && option.color && "text-white border-transparent",
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className="ml-2"
              >
                {option.count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

interface SingleToggleFilterProps<T extends string> {
  options: FilterOption<T>[];
  selected: T | null;
  onChange: (selected: T | null) => void;
  allowDeselect?: boolean;
  className?: string;
}

/**
 * Single-select toggle filter (radio-button style)
 * Only one option can be selected at a time
 */
export function SingleToggleFilter<T extends string>({
  options,
  selected,
  onChange,
  allowDeselect = true,
  className,
}: SingleToggleFilterProps<T>) {
  const handleSelect = (value: T) => {
    if (selected === value && allowDeselect) {
      onChange(null);
    } else {
      onChange(value);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <Button
            key={option.value}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelect(option.value)}
            className={cn(
              "transition-colors",
              isSelected && option.color && option.color,
              isSelected && option.color && "text-white border-transparent",
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className="ml-2"
              >
                {option.count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}
