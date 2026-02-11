"use client";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyStateNoParams() {
  return (
    <Card>
      <CardContent className="py-8 text-center text-muted-foreground">
        Enter a search term or select categories to find rules.
      </CardContent>
    </Card>
  );
}

export function EmptyStateNoResults() {
  return (
    <Card>
      <CardContent className="py-8 text-center text-muted-foreground">
        No results found. Try different keywords or broaden your category
        filter.
      </CardContent>
    </Card>
  );
}
