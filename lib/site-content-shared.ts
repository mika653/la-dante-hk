// Homepage content types + defaults, shared by the client hook, the admin
// editors, and the server actions. No "use client" / "use server" directive.

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

export type CarouselSlide = { id: string; src: string; alt: string; caption: string };

// Editable photo sets for homepage sections (swappable from the Media Library).
export type SectionPhotos = { workshops: string[]; mosaic: string[] };

export type SiteContent = { hero: HeroContent; carousel: CarouselSlide[]; sectionPhotos: SectionPhotos };

export const defaultHero: HeroContent = {
  eyebrow: "Italiano · Latino · Hong Kong · 1935",
  line1: "Impara",
  line2: "l'italiano",
  line3: "a Hong Kong",
  subhead:
    "Certified native teachers, CEFR-aligned courses, and a 90-year tradition of Italian culture in the heart of Wanchai.",
  cta1: { label: "Take the placement test", href: "/placement-test" },
  cta2: { label: "See September courses", href: "/courses/italian/adult-groups" },
  trust: ["4.9 rating", "1,500+ students", "Wanchai & online", "PLIDA certified"],
};

export const defaultCarousel: CarouselSlide[] = [
  { id: "s1", src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=2000&q=80&auto=format&fit=crop", alt: "A group of friends seen from behind walking together.", caption: "Students at Dante · 2024" },
  { id: "s2", src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000&q=80&auto=format&fit=crop", alt: "A group of people studying together around a table.", caption: "A1 Beginner class · Wanchai" },
  { id: "s3", src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=2000&q=80&auto=format&fit=crop", alt: "Students working together in a modern classroom environment.", caption: "B1 conversation practice" },
  { id: "s4", src: "/mural.png", alt: "The La Dante mural — Hong Kong skyline merged with Italian landmarks.", caption: "Il nostro murales — where Hong Kong meets Italy" },
];

export const defaultSectionPhotos: SectionPhotos = {
  workshops: ["/workshops/1.jpg", "/workshops/2.jpg", "/workshops/3.jpg", "/workshops/4.jpg", "/workshops/5.jpg", "/workshops/6.jpg"],
  mosaic: ["/mosaic/1.jpg", "/mosaic/2.jpg", "/mosaic/3.jpg", "/mosaic/4.jpg", "/mosaic/5.jpg", "/mosaic/6.jpg", "/mosaic/7.jpg", "/mosaic/8.jpg", "/mosaic/9.jpg", "/mosaic/10.jpg"],
};

export const defaultSiteContent: SiteContent = { hero: defaultHero, carousel: defaultCarousel, sectionPhotos: defaultSectionPhotos };

// Merge stored/partial content over the defaults so a missing field never blanks the page.
export function normaliseSiteContent(parsed: unknown): SiteContent {
  const p = (parsed ?? {}) as Partial<SiteContent>;
  const sp = (p.sectionPhotos ?? {}) as Partial<SectionPhotos>;
  const nonEmpty = (a: unknown, fallback: string[]) =>
    Array.isArray(a) && a.filter((x) => typeof x === "string" && x.trim()).length > 0
      ? (a as string[]).filter((x) => typeof x === "string" && x.trim())
      : fallback;
  return {
    hero: { ...defaultHero, ...(p.hero ?? {}) },
    carousel: Array.isArray(p.carousel) && p.carousel.length > 0 ? p.carousel : defaultCarousel,
    sectionPhotos: {
      workshops: nonEmpty(sp.workshops, defaultSectionPhotos.workshops),
      mosaic: nonEmpty(sp.mosaic, defaultSectionPhotos.mosaic),
    },
  };
}
