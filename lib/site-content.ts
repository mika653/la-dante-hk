"use client";
import { useEffect, useState } from "react";

// -------------- Types --------------
export type HeroContent = {
  eyebrow: string;
  line1: string;
  line2: string;
  line3: string;
  subhead: string;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
  trust: string[];
};

export type CarouselSlide = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export type SiteContent = {
  hero: HeroContent;
  carousel: CarouselSlide[];
};

// -------------- Defaults (match current hard-coded site) --------------
export const defaultHero: HeroContent = {
  eyebrow: "Italiano · Latino · Hong Kong · 1935",
  line1: "Impara",
  line2: "l'italiano",
  line3: "a Hong Kong",
  subhead:
    "Certified native teachers, CEFR-aligned courses, and a 90-year tradition of Italian culture in the heart of Wanchai.",
  cta1: { label: "Take the placement test", href: "/placement-test" },
  cta2: { label: "See May–July courses", href: "/courses/italian/adult-groups" },
  trust: ["4.9 rating", "1,500+ students", "Wanchai & online", "PLIDA certified"],
};

export const defaultCarousel: CarouselSlide[] = [
  {
    id: "s1",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=2000&q=80&auto=format&fit=crop",
    alt: "A group of friends seen from behind walking together.",
    caption: "Students at Dante · 2024",
  },
  {
    id: "s2",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000&q=80&auto=format&fit=crop",
    alt: "A group of people studying together around a table.",
    caption: "A1 Beginner class · Wanchai",
  },
  {
    id: "s3",
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=2000&q=80&auto=format&fit=crop",
    alt: "Students working together in a modern classroom environment.",
    caption: "B1 conversation practice",
  },
  {
    id: "s4",
    src: "/mural.png",
    alt: "The La Dante mural — Hong Kong skyline merged with Italian landmarks.",
    caption: "Il nostro murales — where Hong Kong meets Italy",
  },
];

export const defaultSiteContent: SiteContent = {
  hero: defaultHero,
  carousel: defaultCarousel,
};

// -------------- Store (localStorage) --------------
const KEY = "ladante-site-content";

export function readSiteContent(): SiteContent {
  if (typeof window === "undefined") return defaultSiteContent;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSiteContent;
    const parsed = JSON.parse(raw);
    return {
      hero: { ...defaultHero, ...(parsed.hero ?? {}) },
      carousel: Array.isArray(parsed.carousel) && parsed.carousel.length > 0
        ? parsed.carousel
        : defaultCarousel,
    };
  } catch {
    return defaultSiteContent;
  }
}

export function writeSiteContent(content: SiteContent) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(content)); } catch {}
}

export function resetSiteContent() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(KEY); } catch {}
}

// -------------- Hook for public components --------------
export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    setContent(readSiteContent());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setContent(readSiteContent());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return content;
}
