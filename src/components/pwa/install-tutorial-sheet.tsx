"use client";

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { type Platform } from "@/lib/hooks/use-pwa-install";
import {
  MoreHorizontal,
  Share,
  Plus,
  Star,
  Bookmark,
  NotepadText,
  FileSearch,
  SquarePlus,
  MoreVertical,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Copy,
  PenLine,
  Swords,
} from "lucide-react";

interface InstallTutorialSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: Platform;
}

export function InstallTutorialSheet({
  open,
  onOpenChange,
  platform,
}: InstallTutorialSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Install Eclipse Calculator</SheetTitle>
          <SheetDescription>
            {platform === "ios"
              ? "Add to your home screen for quick access"
              : platform === "android"
                ? "Install the app for a better experience"
                : "Install the app to your computer"}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-8">
          {platform === "ios" && <IOSTutorial />}
          {platform === "android" && <AndroidTutorial />}
          {platform === "chrome-desktop" && <DesktopChromeTutorial />}
          {platform === "other" && <GenericTutorial />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function IOSTutorial() {
  return (
    <div className="space-y-6">
      {/* Step 1: Tap menu */}
      <TutorialStep step={1} title="Tap the menu button">
        <IOSBrowserMockup highlightMenu />
        <p className="text-muted-foreground mt-2 text-xs">
          The menu may appear at the top or bottom of your screen
        </p>
      </TutorialStep>

      {/* Step 2: Tap Share */}
      <TutorialStep step={2} title='Tap "Share"'>
        <IOSMenuMockup highlightShare />
      </TutorialStep>

      {/* Step 3: Scroll down */}
      <TutorialStep step={3} title="Scroll down">
        <IOSShareSheetInitialMockup />
      </TutorialStep>

      {/* Step 4: Add to Home Screen */}
      <TutorialStep step={4} title='Tap "Add to Home Screen"'>
        <IOSShareSheetMockup />
      </TutorialStep>

      {/* Step 5: Confirm */}
      <TutorialStep step={5} title='Tap "Add" to confirm'>
        <IOSAddScreenMockup />
      </TutorialStep>
    </div>
  );
}

function AndroidTutorial() {
  return (
    <div className="space-y-6">
      {/* Step 1: Tap menu */}
      <TutorialStep step={1} title="Tap the menu button">
        <AndroidBrowserMockup highlightMenu>
          <div className="bg-muted h-20 rounded" />
        </AndroidBrowserMockup>
      </TutorialStep>

      {/* Step 2: Add to Home screen */}
      <TutorialStep step={2} title='Tap "Add to Home screen"'>
        <AndroidMenuMockup />
      </TutorialStep>

      {/* Step 3: Install */}
      <TutorialStep step={3} title='Tap "Install" to confirm'>
        <AndroidInstallMockup />
      </TutorialStep>
    </div>
  );
}

function DesktopChromeTutorial() {
  return (
    <div className="space-y-6">
      <TutorialStep step={1} title="Click the install icon in your URL bar">
        <DesktopURLBarMockup />
      </TutorialStep>
      <p className="text-muted-foreground text-center text-sm">
        Look for the{" "}
        <Download className="mx-1 inline-block h-4 w-4 align-text-bottom" />{" "}
        icon on the right side of your address bar
      </p>
    </div>
  );
}

function GenericTutorial() {
  return (
    <div className="text-muted-foreground space-y-4 py-8 text-center">
      <p>
        To install this app, look for an &quot;Install&quot; or &quot;Add to
        Home Screen&quot; option in your browser&apos;s menu.
      </p>
    </div>
  );
}

function TutorialStep({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium">
          {step}
        </span>
        <p className="font-medium">{title}</p>
      </div>
      <div className="ml-9">{children}</div>
    </div>
  );
}

// iOS Mockup Components
function IOSBrowserMockup({
  highlightMenu = false,
}: {
  highlightMenu?: boolean;
}) {
  return (
    <div className="bg-muted/50 overflow-hidden rounded-2xl border">
      {/* Safari URL bar */}
      <div className="bg-background/80 border-b px-3 py-2">
        <div className="bg-muted/60 mx-auto flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-muted-foreground">eclipse-calc.vercel.app</span>
        </div>
      </div>

      {/* Simplified page content */}
      <div className="bg-background p-4">
        <div className="space-y-2">
          <div className="text-muted-foreground text-[10px] font-medium tracking-wide">
            ECLIPSE CALCULATOR
          </div>
          <div className="text-sm font-semibold">
            Combat Simulator for
            <br />
            <span className="text-primary">Second Dawn</span>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Swords className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-xs">
              Calculate battle outcomes
            </span>
          </div>
        </div>
      </div>

      {/* Safari bottom toolbar */}
      <div className="bg-background/90 flex items-center justify-around border-t px-2 py-2">
        <ChevronLeft className="text-muted-foreground h-5 w-5" />
        <ChevronRight className="text-muted-foreground h-5 w-5 opacity-40" />
        <Share className="text-muted-foreground h-5 w-5" />
        <Copy className="text-muted-foreground h-5 w-5" />
        <div
          className={`rounded-full p-1 ${highlightMenu ? "ring-destructive bg-destructive/10 ring-2" : ""}`}
        >
          <MoreHorizontal className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function IOSMenuMockup({
  highlightShare = false,
}: {
  highlightShare?: boolean;
}) {
  return (
    <div className="bg-muted/30 overflow-hidden rounded-2xl border">
      {/* Drag handle */}
      <div className="flex justify-center py-2">
        <div className="bg-muted-foreground/30 h-1 w-10 rounded-full" />
      </div>

      <div className="divide-border/50 divide-y">
        {/* Share row - highlighted */}
        <div
          className={`flex items-center gap-3 px-4 py-3 ${highlightShare ? "ring-destructive bg-destructive/10 ring-2 ring-inset" : ""}`}
        >
          <Share className="h-5 w-5 text-blue-500" />
          <span className="font-medium">Share</span>
        </div>

        {/* Add Bookmarks row */}
        <div className="text-muted-foreground flex items-center gap-3 px-4 py-3">
          <Bookmark className="h-5 w-5" />
          <span>Add Bookmarks...</span>
        </div>

        {/* New Tab row */}
        <div className="text-muted-foreground flex items-center gap-3 px-4 py-3">
          <Plus className="h-5 w-5" />
          <span>New Tab</span>
        </div>
      </div>
    </div>
  );
}

function IOSShareSheetInitialMockup() {
  return (
    <div className="bg-muted/30 overflow-hidden rounded-2xl border">
      {/* Drag handle */}
      <div className="flex justify-center py-2">
        <div className="bg-muted-foreground/30 h-1 w-10 rounded-full" />
      </div>

      {/* App info header */}
      <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl bg-zinc-800/50 p-3">
        <Image
          src="/icons/ios.png"
          alt="App icon"
          width={48}
          height={48}
          className="shrink-0 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Eclipse Calculator</p>
          <p className="text-muted-foreground truncate text-xs">
            eclipse-calc.vercel.app
          </p>
          <button className="mt-1 flex items-center gap-0.5 rounded-full border bg-zinc-700/80 px-2 py-0.5 text-xs">
            Options
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Contacts row */}
      <div className="grid grid-cols-4 border-t px-3 py-3">
        {["Contact", "Contact", "Contact", "Contact"].map((name, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
              <span className="text-muted-foreground text-lg">👤</span>
            </div>
            <span className="text-muted-foreground truncate text-center text-[10px]">
              {name}
            </span>
          </div>
        ))}
      </div>

      {/* Apps row */}
      <div className="grid grid-cols-4 border-t px-3 py-3">
        {[
          { icon: "💬", label: "Messages", color: "bg-green-900/50" },
          { icon: "✉️", label: "Mail", color: "bg-blue-900/50" },
          { icon: "📝", label: "Notes", color: "bg-yellow-900/50" },
          { icon: "📝", label: "Reminders", color: "bg-orange-900/50" },
        ].map((app) => (
          <div key={app.label} className="flex flex-col items-center gap-1">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${app.color}`}
            >
              <span className="text-lg">{app.icon}</span>
            </div>
            <span className="text-muted-foreground truncate text-center text-[10px]">
              {app.label}
            </span>
          </div>
        ))}
      </div>

      {/* Actions row */}
      <div className="grid grid-cols-4 border-t px-3 py-3">
        {[
          { icon: Copy, label: "Copy" },
          { icon: Bookmark, label: "Bookmarks" },
          { icon: MoreHorizontal, label: "More" },
        ].map((action) => (
          <div key={action.label} className="flex flex-col items-center gap-1">
            <div className="bg-muted/60 flex h-12 w-12 items-center justify-center rounded-full">
              <action.icon className="text-muted-foreground h-5 w-5" />
            </div>
            <span className="text-muted-foreground truncate text-center text-[10px]">
              {action.label}
            </span>
          </div>
        ))}
      </div>

      {/* Animated scroll indicator */}
      <div className="flex flex-col items-center gap-0 pb-2">
        <div className="animate-bounce">
          <ChevronDown className="text-destructive h-5 w-5" />
        </div>
        <span className="text-destructive text-[10px]">Scroll</span>
      </div>
    </div>
  );
}

function IOSShareSheetMockup() {
  return (
    <div className="bg-muted/30 overflow-hidden rounded-2xl border">
      {/* Drag handle */}
      <div className="flex justify-center py-2">
        <div className="bg-muted-foreground/30 h-1 w-10 rounded-full" />
      </div>

      {/* Scroll fade indicator - shows this is scrolled view */}
      <div className="from-muted/50 via-muted/20 h-4 bg-gradient-to-b to-transparent" />

      {/* Action list - scrolled down state */}
      <div className="divide-border/50 divide-y">
        {/* Add to Favorites */}
        <div className="text-muted-foreground flex items-center gap-3 px-4 py-3">
          <Star className="h-5 w-5" />
          <span>Add to Favorites</span>
        </div>

        {/* Add to Quick Note */}
        <div className="text-muted-foreground flex items-center gap-3 px-4 py-3">
          <NotepadText className="h-5 w-5" />
          <span>Add to Quick Note</span>
        </div>

        {/* Find on Page */}
        <div className="text-muted-foreground flex items-center gap-3 px-4 py-3">
          <FileSearch className="h-5 w-5" />
          <span>Find on Page</span>
        </div>

        {/* Add to Home Screen - highlighted */}
        <div className="ring-destructive bg-destructive/10 flex items-center gap-3 px-4 py-3 ring-2 ring-inset">
          <SquarePlus className="h-5 w-5" />
          <span className="font-medium">Add to Home Screen</span>
        </div>

        {/* Markup */}
        <div className="text-muted-foreground flex items-center gap-3 px-4 py-3">
          <PenLine className="h-5 w-5" />
          <span>Markup</span>
        </div>
      </div>
    </div>
  );
}

function IOSAddScreenMockup() {
  return (
    <div className="bg-muted/30 overflow-hidden rounded-2xl border">
      {/* Header with X, Title, Add */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-muted-foreground text-lg">✕</span>
        <span className="text-sm font-semibold">Add to Home Screen</span>
        <span className="ring-destructive bg-destructive/10 rounded-full px-4 py-1.5 text-sm font-semibold text-blue-400 ring-2">
          Add
        </span>
      </div>

      {/* App preview with icon and editable name */}
      <div className="bg-background p-4">
        <div className="flex items-start gap-3">
          {/* App icon */}
          <Image
            src="/icons/ios.png"
            alt="App icon"
            width={56}
            height={56}
            className="shrink-0 rounded-xl"
          />

          {/* Name and URL */}
          <div className="flex-1 space-y-1">
            {/* Editable name field */}
            <div className="border-b border-blue-400 pb-1">
              <span className="text-sm">Eclipse Calc</span>
            </div>
            {/* URL display */}
            <p className="text-muted-foreground truncate text-xs">
              https://eclipse-calc.vercel.app/
            </p>
          </div>
        </div>
      </div>

      {/* Open as Web App toggle */}
      <div className="bg-background mt-2 flex items-center justify-between px-4 py-3">
        <span className="text-sm">Open as Web App</span>
        {/* Toggle switch - styled as "on" */}
        <div className="h-7 w-12 rounded-full bg-green-500 p-0.5">
          <div className="ml-auto h-6 w-6 rounded-full bg-white shadow" />
        </div>
      </div>

      {/* Helper text */}
      <p className="text-muted-foreground px-4 pb-4 text-xs">
        An icon will be added to your Home Screen so you can quickly access this
        website.
      </p>
    </div>
  );
}

// Android Mockup Components
function AndroidBrowserMockup({
  children,
  highlightMenu = false,
}: {
  children?: React.ReactNode;
  highlightMenu?: boolean;
}) {
  return (
    <div className="bg-muted/50 overflow-hidden rounded-xl border">
      {/* Browser chrome */}
      <div className="bg-background flex items-center justify-between border-b px-3 py-2">
        <div className="text-muted-foreground flex-1 text-xs">
          eclipse-calc.vercel.app
        </div>
        <div
          className={`rounded p-1 ${highlightMenu ? "ring-destructive bg-destructive/10 ring-2" : ""}`}
        >
          <MoreVertical className="h-4 w-4" />
        </div>
      </div>
      {/* Content area */}
      <div className="p-3">{children}</div>
    </div>
  );
}

function AndroidMenuMockup() {
  return (
    <div className="bg-muted/50 overflow-hidden rounded-xl border">
      <div className="divide-y">
        <div className="text-muted-foreground px-4 py-3 text-sm">New tab</div>
        <div className="text-muted-foreground px-4 py-3 text-sm">
          New incognito tab
        </div>
        <div className="text-muted-foreground px-4 py-3 text-sm">Bookmarks</div>
        <div className="ring-destructive bg-destructive/10 flex items-center gap-3 rounded-b-xl px-4 py-3 ring-2 ring-inset">
          <Download className="h-5 w-5" />
          <span className="font-medium">Add to Home screen</span>
        </div>
      </div>
    </div>
  );
}

function AndroidInstallMockup() {
  return (
    <div className="bg-muted/50 overflow-hidden rounded-xl border">
      <div className="p-4">
        <div className="mb-4 flex items-center gap-3">
          {/* App icon */}
          <Image
            src="/icons/android.png"
            alt="App icon"
            width={56}
            height={56}
            className="shrink-0 rounded-xl"
          />
          <div>
            <p className="font-medium">Eclipse Combat Calculator</p>
            <p className="text-muted-foreground text-sm">
              eclipse-calc.vercel.app
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <span className="text-muted-foreground px-4 py-2">Cancel</span>
          <span className="ring-destructive bg-destructive/10 rounded-full px-6 py-2 font-medium text-blue-400 ring-2">
            Install
          </span>
        </div>
      </div>
    </div>
  );
}

function DesktopURLBarMockup() {
  return (
    <div className="bg-muted/50 overflow-hidden rounded-xl border">
      <div className="bg-background flex items-center gap-2 border-b px-4 py-3">
        <div className="bg-muted flex-1 rounded-full px-4 py-2 text-sm">
          <span className="text-muted-foreground">
            https://eclipse-calc.vercel.app
          </span>
        </div>
        <div className="ring-destructive bg-destructive/10 rounded p-2 ring-2">
          <Download className="h-4 w-4" />
        </div>
      </div>
      <div className="bg-muted h-24" />
    </div>
  );
}
