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

// Landing-page banner photos (the circle frame on the yellow banner), keyed by
// the page's English path, e.g. "/plida". Blank → the page's default photo.
export type PageHeaderPhotos = Record<string, string>;

// A short piece of text in both site languages. 繁中 is optional — when it is
// blank the English is shown, so the office can edit English-only if they like.
export type Bilingual = { en: string; zh: string };
export const biEmpty: Bilingual = { en: "", zh: "" };
/** Pick the locale's text, falling back to English when the 繁中 is blank. */
export function pickLocale(b: Bilingual | undefined, locale: "en" | "zh"): string {
  if (!b) return "";
  return locale === "zh" ? (b.zh?.trim() || b.en || "") : (b.en || "");
}

// Top announcement bar (editable in Admin → Content → Announcement & pop-up).
export type AnnouncementContent = {
  enabled: boolean;
  parts: Bilingual[];                       // the messages shown, separated by ·
  cta: { label: Bilingual; href: string };  // the link at the end (blank label hides it)
};

// First-visit entry pop-up (same editor). Shown once per session.
export type PopupContent = {
  enabled: boolean;
  eyebrow: Bilingual;
  title: Bilingual;
  bullets: Bilingual[];
  cta1: { label: Bilingual; href: string };
  cta2: { label: Bilingual; href: string };  // blank label hides the second button
};

export type SiteContent = { hero: HeroContent; carousel: CarouselSlide[]; sectionPhotos: SectionPhotos; sponsors: Sponsors; pageHeaders: PageHeaderPhotos; announcement: AnnouncementContent; popup: PopupContent };

// Banner style per Giulia: these three landing pages get the homepage photo
// collage on the yellow banner; legal pages get a plain banner; every other
// landing page gets the yellow banner + a circle photo frame (editable in
// Admin → Content → Section photos).
export const COLLAGE_BANNER_PAGES = ["/courses/italian", "/culture", "/about"];
export const PLAIN_BANNER_PAGES = ["/privacy", "/terms", "/cookie-policy"];
export const CIRCLE_BANNER_PAGES: { path: string; label: string }[] = [
  { path: "/courses", label: "All courses" },
  { path: "/courses/italian/adult-groups", label: "Italian · Adult groups" },
  { path: "/courses/italian/kids", label: "Italian · Kids & Teens" },
  { path: "/courses/italian/private", label: "Italian · Private" },
  { path: "/courses/italian/corporate", label: "Italian · Corporate" },
  { path: "/courses/italian/online", label: "Italian · Online" },
  { path: "/courses/italian/special", label: "Italian · Special courses" },
  { path: "/courses/italian/level-progression", label: "Italian · Level progression" },
  { path: "/courses/latin", label: "Latin" },
  { path: "/courses/latin/groups", label: "Latin · Groups" },
  { path: "/courses/latin/kids", label: "Latin · Kids & Teens" },
  { path: "/courses/latin/private", label: "Latin · Private" },
  { path: "/courses/study-in-italy", label: "Study in Italy" },
  { path: "/courses/teacher-training", label: "Teacher training" },
  { path: "/special-offers", label: "Special offers" },
  { path: "/placement-test", label: "Placement test" },
  { path: "/plida", label: "PLIDA" },
  { path: "/culture/library", label: "Library" },
  { path: "/workshops", label: "Workshops" },
  { path: "/membership", label: "Membership" },
  { path: "/donate", label: "Donate" },
  { path: "/gift", label: "Gift" },
  { path: "/merch", label: "Shop" },
  { path: "/services/translation", label: "Translation" },
  { path: "/services/sponsorship", label: "Sponsorship" },
  { path: "/about/scuola-semplice", label: "Scuola Semplice" },
  { path: "/contact", label: "Contact" },
  { path: "/book-trial", label: "Book a trial" },
  { path: "/bad-weather", label: "Typhoon & severe weather" },
];

// PLACEHOLDER default circle photo for a page until the office uploads its own
// (picked deterministically from the stock collage photos).
export function defaultPageHeaderPhoto(path: string): string {
  let h = 0;
  for (const ch of path) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `/mosaic/${(h % 10) + 1}.jpg`;
}

export const defaultHero: HeroContent = {
  eyebrow: "Italiano · Latino · Hong Kong · 1934",
  line1: "Since 1934.",
  line2: "",
  line3: "",
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

// Seeded from the strings the bar + pop-up shipped with, so turning them into
// editable content changes nothing on screen until the office edits them.
export const defaultAnnouncement: AnnouncementContent = {
  enabled: true,
  parts: [
    { en: "Early-bird discount — new term now open", zh: "新學期早鳥優惠開始了" },
    { en: "University students & seniors 10% off", zh: "大學生及長者 9 折" },
  ],
  cta: { label: { en: "See all offers →", zh: "查看所有優惠 →" }, href: "/special-offers" },
};

export const defaultPopup: PopupContent = {
  enabled: true,
  eyebrow: { en: "New this term", zh: "本學期新推出" },
  title: { en: "September–December 2026 enrolment is open.", zh: "2026 年 9 月至 12 月課程現已開始報名。" },
  bullets: [
    { en: "Early-bird discount on the new term", zh: "新學期早鳥優惠" },
    { en: "University students & seniors 10% off", zh: "大學生及長者 9 折" },
    { en: "Gift cards available", zh: "備有禮品卡" },
    { en: "Bring a friend & you both save", zh: "帶朋友同行，雙方同享優惠" },
  ],
  cta1: { label: { en: "See courses", zh: "查看課程" }, href: "/courses/italian/adult-groups" },
  cta2: { label: { en: "Find my level", zh: "測試我的程度" }, href: "/placement-test" },
};

export const defaultSiteContent: SiteContent = { hero: defaultHero, carousel: defaultCarousel, sectionPhotos: defaultSectionPhotos, sponsors: defaultSponsors, pageHeaders: {}, announcement: defaultAnnouncement, popup: defaultPopup };

// Keep a stored bilingual value but coerce each side to a string; a missing side
// falls back to the default so a half-saved field never blanks the page.
function cleanBi(v: unknown, fallback: Bilingual): Bilingual {
  if (v == null) return { ...fallback };
  const o = v as Partial<Bilingual>;
  return {
    en: typeof o.en === "string" ? o.en : fallback.en,
    zh: typeof o.zh === "string" ? o.zh : fallback.zh,
  };
}
const biFilled = (b: Bilingual) => b.en.trim() !== "" || b.zh.trim() !== "";

function normaliseAnnouncement(v: unknown): AnnouncementContent {
  const a = (v ?? {}) as Partial<AnnouncementContent>;
  const parts = Array.isArray(a.parts) ? a.parts.map((p) => cleanBi(p, biEmpty)).filter(biFilled) : [];
  const cta = (a.cta ?? {}) as Partial<AnnouncementContent["cta"]>;
  return {
    enabled: typeof a.enabled === "boolean" ? a.enabled : defaultAnnouncement.enabled,
    parts: parts.length > 0 ? parts : defaultAnnouncement.parts,
    cta: {
      label: cleanBi(cta.label, defaultAnnouncement.cta.label),
      href: typeof cta.href === "string" && cta.href.trim() ? cta.href.trim() : defaultAnnouncement.cta.href,
    },
  };
}

function normalisePopup(v: unknown): PopupContent {
  const p = (v ?? {}) as Partial<PopupContent>;
  const bullets = Array.isArray(p.bullets) ? p.bullets.map((b) => cleanBi(b, biEmpty)).filter(biFilled) : [];
  const c1 = (p.cta1 ?? {}) as Partial<PopupContent["cta1"]>;
  const c2 = (p.cta2 ?? {}) as Partial<PopupContent["cta2"]>;
  return {
    enabled: typeof p.enabled === "boolean" ? p.enabled : defaultPopup.enabled,
    eyebrow: cleanBi(p.eyebrow, defaultPopup.eyebrow),
    title: cleanBi(p.title, defaultPopup.title),
    bullets: bullets.length > 0 ? bullets : defaultPopup.bullets,
    cta1: {
      label: cleanBi(c1.label, defaultPopup.cta1.label),
      href: typeof c1.href === "string" && c1.href.trim() ? c1.href.trim() : defaultPopup.cta1.href,
    },
    cta2: {
      // Fall back to the default label when the field was never set; an admin who
      // clears it (stored as "") keeps it empty, which hides the 2nd button.
      label: cleanBi(c2.label, defaultPopup.cta2.label),
      href: typeof c2.href === "string" && c2.href.trim() ? c2.href.trim() : defaultPopup.cta2.href,
    },
  };
}

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
    pageHeaders: Object.fromEntries(
      Object.entries((p.pageHeaders ?? {}) as Record<string, unknown>)
        .filter(([k, v]) => k.startsWith("/") && typeof v === "string" && v.trim())
        .map(([k, v]) => [k, (v as string).trim()])
    ),
    announcement: normaliseAnnouncement(p.announcement),
    popup: normalisePopup(p.popup),
  };
}
