import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import "./globals.css";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { MobileTabBar } from "@/components/marketing/mobile-tabbar";
import { AppProviders } from "@/components/providers/app-providers";
import { BootstrapProvider } from "@/components/providers/bootstrap-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { site } from "@/lib/site";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.shortName}`
  },
  description: site.description,
  applicationName: site.name
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} site-shell`}>
        <BootstrapProvider />
        <ThemeProvider />
        <AppProviders>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <MobileTabBar />
        </AppProviders>
      </body>
    </html>
  );
}
