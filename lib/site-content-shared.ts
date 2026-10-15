// Homepage content types + defaults, shared by the client hook, the admin
// editors, and the server actions. No "use client" / "use server" directive.
import { classroomSponsors as seedClassroom, sponsors as seedSponsors } from "@/lib/data";

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

// Editable sponsors (classroom A–G, gold, silver tiers).
export type SponsorItem = { name: string; logo: string; room?: string };
export type Sponsors = { classroom: SponsorItem[]; gold: SponsorItem[]; silver: SponsorItem[] };

export type SiteContent = { hero: HeroContent; carousel: CarouselSlide[]; sectionPhotos: SectionPhotos; sponsors: Sponsors };

export const defaultHero: HeroContent = {
  eyebrow: "Italiano · Latino · Hong Kong · 1934",
  line1: "Impara",
  line2: "l'italiano",
  line3: "a Hong Kong",
  subhead:
    "Certified native teachers, CEFR-aligned courses, and a 90-year tradition of Italian culture in the heart of Wanchai.",
  cta1: { label: "Take the placement test", href: "/placement-test" },
  cta2: { label: "See September courses", href: "/courses/italian/adult-groups" },
  trust: ["Courses", "Events", "Workshops", "Community"],
};

// Stock photos (placeholders) downloaded locally for reliability — swap for real
// La Dante photos anytime via Admin → Content → Hero carousel.
export const defaultCarousel: CarouselSlide[] = [
  { id: "s1", src: "/carousel/1.jpg", alt: "A group of friends seen from behind walking together.", caption: "Students at Dante" },
  { id: "s2", src: "/carousel/2.jpg", alt: "A group of people studying together around a table.", caption: "A1 Beginner class · Wanchai" },
  { id: "s3", src: "/carousel/3.jpg", alt: "Students working together in a modern classroom environment.", caption: "B1 conversation practice" },
  { id: "s4", src: "/carousel/4.jpg", alt: "A bright study space with notes and a laptop.", caption: "Learning together" },
  { id: "s5", src: "/mural.png", alt: "The La Dante mural — Hong Kong skyline merged with Italian landmarks.", caption: "Il nostro murales — where Hong Kong meets Italy" },
];

export const defaultSectionPhotos: SectionPhotos = {
  workshops: ["/workshops/1.jpg", "/workshops/2.jpg", "/workshops/3.jpg", "/workshops/4.jpg", "/workshops/5.jpg", "/workshops/6.jpg"],
  mosaic: ["/mosaic/1.jpg", "/mosaic/2.jpg", "/mosaic/3.jpg", "/mosaic/4.jpg", "/mosaic/5.jpg", "/mosaic/6.jpg", "/mosaic/7.jpg", "/mosaic/8.jpg", "/mosaic/9.jpg", "/mosaic/10.jpg"],
};

export const defaultSponsors: Sponsors = {
  classroom: seedClassroom.map((s) => ({ room: s.room, name: s.name, logo: s.logo })),
  gold: seedSponsors.gold.map((s) => ({ name: s.name, logo: s.logo })),
  silver: seedSponsors.silver.map((s) => ({ name: s.name, logo: s.logo })),
};

export const defaultSiteContent: SiteContent = { hero: defaultHero, carousel: defaultCarousel, sectionPhotos: defaultSectionPhotos, sponsors: defaultSponsors };

// Merge stored/partial content over the defaults so a missing field never blanks the page.
export function normaliseSiteContent(parsed: unknown): SiteContent {
  const p = (parsed ?? {}) as Partial<SiteContent>;
  const sp = (p.sectionPhotos ?? {}) as Partial<SectionPhotos>;
  const sponsors = (p.sponsors ?? {}) as Partial<Sponsors>;
  const nonEmpty = (a: unknown, fallback: string[]) =>
    Array.isArray(a) && a.filter((x) => typeof x === "string" && x.trim()).length > 0
      ? (a as string[]).filter((x) => typeof x === "string" && x.trim())
      : fallback;
  // Sponsors: keep a saved list (even if emptied) but clean rows; fall back to
  // defaults only when the tier was never saved.
  const tier = (a: unknown, fallback: SponsorItem[]): SponsorItem[] =>
    Array.isArray(a)
      ? (a as SponsorItem[]).filter((s) => s && typeof s.logo === "string" && s.logo.trim())
          .map((s) => ({ name: String(s.name ?? ""), logo: s.logo, ...(s.room ? { room: String(s.room) } : {}) }))
      : fallback;
  return {
    hero: { ...defaultHero, ...(p.hero ?? {}) },
    carousel: Array.isArray(p.carousel) && p.carousel.length > 0 ? p.carousel : defaultCarousel,
    sectionPhotos: {
      workshops: nonEmpty(sp.workshops, defaultSectionPhotos.workshops),
      mosaic: nonEmpty(sp.mosaic, defaultSectionPhotos.mosaic),
    },
    sponsors: {
      classroom: tier(sponsors.classroom, defaultSponsors.classroom),
      gold: tier(sponsors.gold, defaultSponsors.gold),
      silver: tier(sponsors.silver, defaultSponsors.silver),
    },
  };
}
