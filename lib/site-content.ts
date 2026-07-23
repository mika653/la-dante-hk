"use client";
import { useEffect, useState } from "react";
import {
  defaultSiteContent, normaliseSiteContent,
  type SiteContent, type HeroContent, type CarouselSlide,
} from "@/lib/site-content-shared";

export type { SiteContent, HeroContent, CarouselSlide };
export { defaultHero, defaultCarousel, defaultSiteContent } from "@/lib/site-content-shared";

// Public hook: reads homepage content from /api/site-content so an admin's edit
// is seen by everyone. Starts from defaults for an instant paint, then swaps in
// the live content; keeps the defaults if the fetch fails.
export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  useEffect(() => {
    let alive = true;
    fetch("/api/site-content", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (alive && data?.content) setContent(normaliseSiteContent(data.content)); })
      .catch(() => { /* keep defaults */ });
    return () => { alive = false; };
  }, []);
  return content;
}
