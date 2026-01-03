"use client";

import { useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Code } from "lucide-react";

type NotationMode = "symbolic" | "descriptive";

interface NotationContextValue {
  mode: NotationMode;
  setMode: (mode: NotationMode) => void;
  toggle: () => void;
}

const NotationContext = createContext<NotationContextValue | null>(null);

const STORAGE_KEY = "eclipse-notation-mode";

export function NotationProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialization: load from localStorage on initial render
  const [mode, setModeState] = useState<NotationMode>(() => {
    if (typeof window === "undefined") return "symbolic";
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "symbolic" || stored === "descriptive"
      ? stored
      : "symbolic";
  });

  const setMode = (newMode: NotationMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  };

  const toggle = () => {
    setMode(mode === "symbolic" ? "descriptive" : "symbolic");
  };

  return (
    <NotationContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </NotationContext.Provider>
  );
}

export function useNotation() {
  const context = useContext(NotationContext);
  if (!context) {
    throw new Error("useNotation must be used within NotationProvider");
  }
  return context;
}

interface NotationToggleProps {
  className?: string;
}

export function NotationToggle({ className }: NotationToggleProps) {
  const { mode, toggle } = useNotation();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      className={className}
      title={
        mode === "symbolic"
          ? "Switch to descriptive notation"
          : "Switch to symbolic notation"
      }
    >
      {mode === "symbolic" ? (
        <>
          <Code className="mr-2 h-4 w-4" />
          Symbolic
        </>
      ) : (
        <>
          <Eye className="mr-2 h-4 w-4" />
          Descriptive
        </>
      )}
    </Button>
  );
}

interface NotationDisplayProps {
  symbolic: string;
  descriptive: string;
  className?: string;
}

/**
 * Displays notation in the current mode
 */
export function NotationDisplay({
  symbolic,
  descriptive,
  className,
}: NotationDisplayProps) {
  const { mode } = useNotation();

  if (!symbolic && !descriptive) {
    return <span className={className}>—</span>;
  }

  return (
    <span className={className}>
      {mode === "symbolic" ? symbolic || "—" : descriptive || "—"}
    </span>
  );
}

/**
 * Legend component explaining symbolic notation
 */
export function NotationLegend() {
  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <h4 className="mb-3 font-medium">Notation Legend</h4>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
        <div>
          <code className="text-muted-foreground">.</code> Energy Cost
        </div>
        <div>
          <code className="text-muted-foreground">z</code> Energy Source
        </div>
        <div>
          <code className="text-muted-foreground">^</code> Initiative
        </div>
        <div>
          <code className="text-muted-foreground">&gt;</code> Drive/Movement
        </div>
        <div>
          <code className="text-muted-foreground">*</code> Hull
        </div>
        <div>
          <code className="text-muted-foreground">-</code> Shield
        </div>
        <div>
          <code className="text-muted-foreground">+</code> Computer
        </div>
        <div>
          <code className="text-muted-foreground">ø</code> Missile Die
        </div>
        <div>
          <code className="text-muted-foreground">o</code> Cannon Die
        </div>
      </div>
      <div className="mt-3 text-sm text-muted-foreground">
        <strong>Damage colors:</strong> Yellow (1), Orange (2), Blue (3), Red
        (4)
      </div>
    </div>
  );
}
