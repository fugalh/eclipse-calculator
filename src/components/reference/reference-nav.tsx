"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FlaskConical,
  Wrench,
  Users,
  Swords,
  GitCompare,
  LayoutGrid,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/reference", icon: LayoutGrid },
  { label: "Technologies", href: "/reference/techs", icon: FlaskConical },
  { label: "Ship Parts", href: "/reference/ship-parts", icon: Wrench },
  { label: "Species", href: "/reference/species", icon: Users },
  { label: "Combat", href: "/reference/combat", icon: Swords },
  { label: "Differences", href: "/reference/differences", icon: GitCompare },
];

interface ReferenceNavProps {
  className?: string;
}

/**
 * Sidebar navigation for desktop
 */
export function ReferenceSidebar({ className }: ReferenceNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-1", className)}>
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/reference" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Horizontal tabs for mobile
 */
export function ReferenceTabs({ className }: ReferenceNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex gap-1 overflow-x-auto pb-2 scrollbar-hide",
        className,
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/reference" && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Breadcrumb navigation
 */
interface BreadcrumbProps {
  items: { label: string; href?: string }[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-2 text-sm", className)}>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-muted-foreground">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * Page header with title and optional actions
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
