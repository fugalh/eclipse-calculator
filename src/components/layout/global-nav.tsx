"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calculator,
  BookOpen,
  Search,
  Camera,
  Info,
  Menu,
  Download,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { usePWAInstall } from "@/lib/hooks/use-pwa-install";

const NAV_ITEMS = [
  { label: "Calculator", href: "/", icon: Calculator },
  { label: "Reference", href: "/reference", icon: BookOpen },
  { label: "Search", href: "/search", icon: Search },
  { label: "Photos", href: "/photos", icon: Camera },
  { label: "About", href: "/about", icon: Info },
];

export function GlobalNav() {
  const pathname = usePathname();
  const { isMobile, isInstalled, openTutorial } = usePWAInstall();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Mobile hamburger menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>Eclipse</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-4">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
            {isMobile && !isInstalled && (
              <SheetClose asChild>
                <button
                  onClick={openTutorial}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground mt-2"
                >
                  <Download className="h-5 w-5" />
                  Install App
                </button>
              </SheetClose>
            )}
            <div className="mt-auto flex items-center gap-2 p-4 border-t">
              <ThemeToggle />
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center gap-2">
          <span className="text-lg font-bold">Eclipse</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop theme/logout - hidden on mobile (shown in sheet) */}
        <div className="ml-auto hidden md:flex items-center gap-1">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
