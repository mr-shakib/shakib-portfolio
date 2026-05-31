import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const baseUrl = siteConfig.url;

interface BuildMetadataArgs {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

/** Composes consistent metadata (OG + Twitter + canonical) for any page. */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  type = "website",
  noIndex = false,
}: BuildMetadataArgs = {}): Metadata {
  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title;
  const url = new URL(path, baseUrl).toString();
  const ogImage = image ?? `/api/og?title=${encodeURIComponent(title ?? siteConfig.name)}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: baseUrl }],
  creator: siteConfig.name,
  ...buildMetadata(),
};
