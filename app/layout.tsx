/**
 * ===================================
 * ROOT LAYOUT (Application Shell)
 * ===================================
 * 
 * Purpose: The outermost layout component that wraps all pages in the application.
 * Defines the app's structure, typography system, providers, and persistent UI chrome.
 * 
 * Key Features:
 * - Imports Google Fonts (Manrope for body, Space_Grotesk for display headings)
 * - Sets up CSS variables for font families (--font-body, --font-display)
 * - Wraps entire app in multiple provider layers:
 *   • BootstrapProvider: Initializes app data and caches
 *   • ThemeProvider: Manages dark/light theme switching
 *   • AppProviders: Additional Next.js/React provider stack
 * - Includes persistent UI: Header, Footer, Mobile Tab Bar, Theme Toggle
 * - Cursor Aura: Interactive glow effect that follows mouse
 * 
 * Metadata: Sets page title template and description for SEO.
 * suppressHydrationWarning: Prevents hydration mismatch errors with theme switching.
 * 
 * This component renders ONCE per app session, wrapping all page content.
 */

import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import "./globals.css";
import styles from "./layout.module.css";

import { CursorAura } from "@/components/marketing/cursor-aura";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { MobileTabBar } from "@/components/marketing/mobile-tabbar";
import { AppProviders } from "@/components/providers/app-providers";
import { BootstrapProvider } from "@/components/providers/bootstrap-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { site } from "@/lib/site";

/* Load Space_Grotesk font for display/heading typography
   variable: "--font-display" exposes the font as a CSS custom property
   This is injected into <html> tag for use throughout the app */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display" /* CSS variable name: used in globals.css */
});

/* Load Manrope font for body text and regular typography
   variable: "--font-body" makes it available as a CSS custom property
   This ensures consistent typography across all pages */
const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body" /* CSS variable name: used in globals.css */
});

/* SEO metadata configuration
   - title.default: Used for home page (shows full site name)
   - title.template: Used for all other pages (shows "Page Title | dialed")
   - description: Short text shown in search results
   - applicationName: Registered app name
   Impact: Improves search engine visibility and social media sharing */
export const metadata: Metadata = {
  title: {
    default: site.name,              /* e.g., "Dialed" */
    template: `%s | ${site.shortName}` /* e.g., "Dashboard | dialed" */
  },
  description: site.description,     /* App tagline for SEO */
  applicationName: site.name         /* Registered application name */
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* HTML root element with lang="en" for accessibility
       suppressHydrationWarning: Prevents errors when theme data doesn't match initial render */
    <html lang="en" suppressHydrationWarning>
      {/* Body element with font CSS variables injected from imported fonts
          site-shell class: Base styling from globals.css */}
      <body className={`${display.variable} ${body.variable} site-shell ${styles.layout}`}>
        {/* BootstrapProvider: Initializes app data, cache, and database connection */}
        <BootstrapProvider />
        
        {/* ThemeProvider: Manages dark/light theme state and data-theme attribute */}
        <ThemeProvider>
          {/* AppProviders: Additional context providers (Favorites, Auth, etc.) */}
          <AppProviders>
            {/* CursorAura: Interactive glow effect that follows mouse position */}
            <CursorAura />
            
            {/* SiteHeader: Sticky navigation with logo, links, and auth controls */}
            <SiteHeader />
            
            {/* Main content area: Children (individual pages) render here */}
            <main>{children}</main>
            
            {/* SiteFooter: Footer with links, copyright, social media */}
            <SiteFooter />
            
            {/* MobileTabBar: Fixed bottom navigation visible only on mobile (<768px) */}
            <MobileTabBar />
            
            {/* ThemeToggle: Floating action button to launch theme customization modal */}
            <ThemeToggle />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
