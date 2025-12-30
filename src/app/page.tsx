import { Suspense } from "react";
import { CalculatorContent } from "@/components/calculator/calculator-content";

export default function CalculatorPage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <CalculatorContent />
    </Suspense>
  );
}

function CalculatorSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Combat Calculator</h1>
            <p className="text-sm text-muted-foreground">
              Simulate ship battles and calculate victory probabilities
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />
        </div>
      </div>
    </main>
  );
}
