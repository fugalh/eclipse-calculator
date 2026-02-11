"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Calculator,
  BookOpen,
  Search,
  Camera,
  Info,
  Menu,
  Download,
  type LucideIcon,
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
import { useInstallPrompt } from "@/components/pwa";
import { isConvexAvailable } from "@/lib/convex-available";

// ============================================================================
// Constants
// ============================================================================

const NAV_ITEMS = [
  { label: "Calculator", href: "/", icon: Calculator },
  { label: "Reference", href: "/reference", icon: BookOpen },
  { label: "Search", href: "/search", icon: Search },
  { label: "Photos", href: "/photos", icon: Camera },
  { label: "About", href: "/about", icon: Info },
];

// ============================================================================
// Helpers
// ============================================================================

/**
 * Determines if a nav item is currently active based on pathname
 * Home ("/") requires exact match; other routes match by prefix
 */
function isNavItemActive(itemHref: string, pathname: string): boolean {
  return itemHref === "/" ? pathname === "/" : pathname.startsWith(itemHref);
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Navigation item component - shared between mobile and desktop
 */
function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
  iconSize = "h-4 w-4",
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  iconSize?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className={iconSize} />
      {label}
    </Link>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function GlobalNav() {
  const pathname = usePathname();
  const { isMobile, isInstalled, onLearnHow } = useInstallPrompt();

  // Filter nav items based on feature availability
  const navItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      if (item.href === "/photos" && !isConvexAvailable()) {
        return false;
      }
      return true;
    });
  }, []);

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
              {navItems.map((item) => (
                <SheetClose key={item.href} asChild>
                  <NavItem
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isActive={isNavItemActive(item.href, pathname)}
                    iconSize="h-5 w-5"
                  />
                </SheetClose>
              ))}
            </nav>
            {isMobile && !isInstalled && (
              <SheetClose asChild>
                <button
                  onClick={onLearnHow}
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
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isNavItemActive(item.href, pathname)}
            />
          ))}
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
