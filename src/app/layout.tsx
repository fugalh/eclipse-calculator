import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { GlobalNav } from "@/components/layout/global-nav";
import { InstallPromptProvider } from "@/components/pwa";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";

const notoSans = Noto_Sans({ variable: "--font-sans", subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Eclipse Companion";
const APP_DESCRIPTION =
  "Companion app for Eclipse: Second Dawn for the Galaxy. Features combat simulator, quick reference guides, rule search, and game photo sharing.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Eclipse Calc",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/ios.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ConvexClientProvider>
            <InstallPromptProvider>
              <GlobalNav />
              {children}
              <Toaster position="bottom-center" />
            </InstallPromptProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
