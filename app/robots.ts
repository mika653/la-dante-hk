import type { MetadataRoute } from "next";
import { SITE_URL, SITE_LIVE } from "./layout";

export default function robots(): MetadataRoute.Robots {
  // While the site isn't flagged live (staging), disallow all crawling so it
  // never lands in search results. Once NEXT_PUBLIC_SITE_LIVE=true, allow the
  // public site but keep the dashboard and personal areas out.
  if (!SITE_LIVE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/leave", "/account", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
