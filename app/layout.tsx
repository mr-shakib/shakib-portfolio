import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { fontVariables } from "@/styles/fonts";
import { baseMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { personJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import "@/styles/globals.css";

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        {/* Skip link for keyboard / screen-reader users */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        {children}
        <JsonLd data={personJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <Analytics />
      </body>
    </html>
  );
}
