/**
 * UI and Navigation Types for Eclipse Calculator
 * Types for theming, navigation, and UI state (Phase 5)
 */

// ============================================================================
// Theme Types
// ============================================================================

export type ThemeMode = "light" | "dark" | "system";

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
  children?: NavItem[];
}

export interface NavigationConfig {
  mainNav: NavItem[];
  mobileNav: NavItem[];
}

// ============================================================================
// Layout Types
// ============================================================================

export interface PageMeta {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface DialogState {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
  duration?: number;
}
