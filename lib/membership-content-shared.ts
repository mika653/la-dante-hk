// Editable membership + sponsorship COPY (descriptions, benefit lists, intro
// text). Prices live separately in pricing-shared.ts (key "pricing"); this is
// stored in the shared site_config table under key "membership-content".
// Defaults equal the copy the site shipped with, so nothing changes on screen
// until the office edits it. Every text is bilingual (English + 繁中); a blank
// 繁中 falls back to English. Pure / storage-agnostic.
//
// Text fields support **bold**, *italic* and line breaks (rendered by
// components/RichText). Price tokens, replaced with the live prices:
//   {silver} {gold} {diamond} {firstYear} {renewal}

import type { Bilingual } from "@/lib/site-content-shared";

export type MembershipIcon =
  | "store" | "ticket" | "library" | "landmark" | "star" | "gift" | "book"
  | "sparkles" | "id" | "percent" | "door" | "megaphone" | "brochure" | "users" | "wine" | "calendar";

export const MEMBERSHIP_ICONS: MembershipIcon[] = [
  "store", "ticket", "library", "landmark", "star", "gift", "book", "sparkles",
  "id", "percent", "door", "megaphone", "brochure", "users", "wine", "calendar",
];

export type IconItem = { icon: MembershipIcon; title: Bilingual; body: Bilingual };
export type IconLine = { icon: MembershipIcon; label: Bilingual };

export type TierId = "silver" | "gold" | "diamond";
export const TIER_IDS: TierId[] = ["silver", "gold", "diamond"];

export type TierCopy = {
  name: Bilingual;
  badge: Bilingual;     // small pill; blank hides it
  tagline: Bilingual;
  benefits: Bilingual[];
};

export type MembershipContent = {
  // "Membership card" block at the top of /membership
  card: {
    title: Bilingual;
    intro: Bilingual;
    adminTitle: Bilingual;
    admin: Bilingual[];          // card-administration bullets
    benefits: IconItem[];        // member-benefit tiles
  };
  // Individual-membership plan card in the sign-up stepper
  individual: {
    name: Bilingual;
    badge: Bilingual;
    blurb: Bilingual;
    cadence: Bilingual;          // after the price, e.g. "first year"
    renewal: Bilingual;          // line under the price; {renewal} = renewal price
    perks: Bilingual[];
  };
  // "Sponsorship / Corporate" card beside the individual plan
  sponsorCard: { badge: Bilingual; title: Bilingual; blurb: Bilingual };
  // Corporate sponsorship section (/membership#sponsorship and /services/sponsorship)
  sponsorship: {
    title: Bilingual;
    intro: Bilingual;
    tiers: Record<TierId, TierCopy>;
    classroom: { title: Bilingual; body: Bilingual; perks: IconLine[] };
  };
};

const en = (s: string): Bilingual => ({ en: s, zh: "" });

function sponsorBenefits(nominees: number): Bilingual[] {
  return [
    "Your logo across our Wan Chai centre & materials",
    "Discounts on corporate courses & team-building",
    "Private & group lesson hours",
    "A discount on translation services",
    `${nominees} membership cards for your nominees`,
    "Free hall-rental hours",
    "Library access for your team",
    "Discounts on our cultural events",
    "Invitation to the annual Dante dinner",
  ].map(en);
}

export const defaultMembershipContent: MembershipContent = {
  card: {
    title: en("Your DA membership card."),
    intro: en("Membership is compulsory for all private and group-course students. On presentation of their DA membership card, members can access a range of special offers, discounts and cultural benefits."),
    adminTitle: en("Card administration"),
    admin: [
      en("The membership-card fee is added to your course invoice at enrolment."),
      en("Each member is assigned a card number and receives the sticker for the current year."),
      en("The card is valid from **January to December**, whichever month you join — it always expires in December."),
    ],
    benefits: [
      { icon: "store", title: en("Partner offers"), body: en("Special offers and discounts at selected restaurants, fashion brands, home-living shops and other participating businesses.") },
      { icon: "ticket", title: en("Culture for less"), body: en("Discounts on selected cultural activities and short courses organised by the Dante Alighieri Society in Hong Kong.") },
      { icon: "library", title: en("The Dante Library"), body: en("Free access to the Dante Library — more than 1,400 Italian books and DVDs.") },
      { icon: "landmark", title: en("Rome privileges"), body: en("Privileges offered by the Società Dante Alighieri in Rome, Italy.") },
    ],
  },
  individual: {
    name: en("Individual membership"),
    badge: en("With voting rights"),
    blurb: en("For lovers of Italian culture who aren't enrolled in a course. Includes voting rights at the AGM."),
    cadence: en("first year"),
    renewal: en("then {renewal} / year renewal"),
    perks: [
      en("Special offers at partner restaurants, fashion, home-living shops & more"),
      en("Discounts on selected cultural activities & short courses"),
      en("Free access to the Dante Library (1,400+ Italian books & DVDs)"),
      en("Privileges from the Società Dante Alighieri in Rome"),
      en("Voting rights & invitation to the AGM"),
    ],
  },
  sponsorCard: {
    badge: en("Companies & patrons"),
    title: en("Sponsorship / Corporate"),
    blurb: en("Support Dante's mission at one of three levels — Silver, Gold or Diamond — with the option to sponsor a classroom."),
  },
  sponsorship: {
    title: en("Put your brand behind Italian culture."),
    intro: en("For individuals or companies who want to support Dante's mission. Three sponsorship levels from {silver} to {diamond} — each with logo placement, course and team-building discounts, lesson hours, member cards for your team, and an invitation to our annual Dante dinner."),
    tiers: {
      silver: { name: en("Silver"), badge: en(""), tagline: en("An entry-level partnership with real brand visibility."), benefits: sponsorBenefits(5) },
      gold: { name: en("Gold"), badge: en("Most popular"), tagline: en("Our most popular corporate partnership."), benefits: sponsorBenefits(10) },
      diamond: { name: en("Diamond"), badge: en(""), tagline: en("Our flagship tier, with the most generous allowances."), benefits: sponsorBenefits(15) },
    },
    classroom: {
      title: en("Classroom sponsorship."),
      body: en("Sponsors at any level are also entitled to sponsor one of our classrooms — your name on the door and your brand in front of our whole community."),
      perks: [
        { icon: "door", label: en("Your logo at the centre entrance and on a classroom door") },
        { icon: "megaphone", label: en("Promotional materials displayed at our reception") },
        { icon: "brochure", label: en("Your logo featured in our brochure and events calendar") },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// Normalisation: coerce whatever is stored into a full, valid object. Missing
// fields fall back to the defaults so a partial save never blanks the page.

const MAX_TEXT = 1500;
const MAX_LIST = 30;

function bi(v: unknown, fallback: Bilingual): Bilingual {
  if (v == null || typeof v !== "object") return { ...fallback };
  const o = v as Partial<Bilingual>;
  return {
    en: typeof o.en === "string" ? o.en.slice(0, MAX_TEXT) : fallback.en,
    zh: typeof o.zh === "string" ? o.zh.slice(0, MAX_TEXT) : fallback.zh,
  };
}
const filled = (b: Bilingual) => b.en.trim() !== "" || b.zh.trim() !== "";
const iconOf = (v: unknown, fallback: MembershipIcon): MembershipIcon =>
  MEMBERSHIP_ICONS.includes(v as MembershipIcon) ? (v as MembershipIcon) : fallback;

/** A list of bilingual lines; blank rows dropped. Missing list → defaults; an
 *  intentionally emptied list stays empty. */
function biList(v: unknown, fallback: Bilingual[]): Bilingual[] {
  if (!Array.isArray(v)) return fallback.map((b) => ({ ...b }));
  return v.map((x) => bi(x, { en: "", zh: "" })).filter(filled).slice(0, MAX_LIST);
}

function iconItems(v: unknown, fallback: IconItem[]): IconItem[] {
  if (!Array.isArray(v)) return fallback;
  return v
    .map((x): IconItem => {
      const o = (x ?? {}) as Partial<IconItem>;
      return { icon: iconOf(o.icon, "star"), title: bi(o.title, { en: "", zh: "" }), body: bi(o.body, { en: "", zh: "" }) };
    })
    .filter((x) => filled(x.title) || filled(x.body))
    .slice(0, MAX_LIST);
}

function iconLines(v: unknown, fallback: IconLine[]): IconLine[] {
  if (!Array.isArray(v)) return fallback;
  return v
    .map((x): IconLine => {
      const o = (x ?? {}) as Partial<IconLine>;
      return { icon: iconOf(o.icon, "star"), label: bi(o.label, { en: "", zh: "" }) };
    })
    .filter((x) => filled(x.label))
    .slice(0, MAX_LIST);
}

function tier(v: unknown, d: TierCopy): TierCopy {
  const o = (v ?? {}) as Partial<TierCopy>;
  const name = bi(o.name, d.name);
  return {
    name: filled(name) ? name : { ...d.name },
    badge: bi(o.badge, d.badge),
    tagline: bi(o.tagline, d.tagline),
    benefits: biList(o.benefits, d.benefits),
  };
}

export function normaliseMembershipContent(parsed: unknown): MembershipContent {
  const d = defaultMembershipContent;
  const p = (parsed ?? {}) as Partial<MembershipContent>;
  const card = (p.card ?? {}) as Partial<MembershipContent["card"]>;
  const ind = (p.individual ?? {}) as Partial<MembershipContent["individual"]>;
  const sc = (p.sponsorCard ?? {}) as Partial<MembershipContent["sponsorCard"]>;
  const sp = (p.sponsorship ?? {}) as Partial<MembershipContent["sponsorship"]>;
  const tiers = (sp.tiers ?? {}) as Partial<Record<TierId, TierCopy>>;
  const cls = (sp.classroom ?? {}) as Partial<MembershipContent["sponsorship"]["classroom"]>;
  const indName = bi(ind.name, d.individual.name);
  return {
    card: {
      title: bi(card.title, d.card.title),
      intro: bi(card.intro, d.card.intro),
      adminTitle: bi(card.adminTitle, d.card.adminTitle),
      admin: biList(card.admin, d.card.admin),
      benefits: iconItems(card.benefits, d.card.benefits),
    },
    individual: {
      name: filled(indName) ? indName : { ...d.individual.name },
      badge: bi(ind.badge, d.individual.badge),
      blurb: bi(ind.blurb, d.individual.blurb),
      cadence: bi(ind.cadence, d.individual.cadence),
      renewal: bi(ind.renewal, d.individual.renewal),
      perks: biList(ind.perks, d.individual.perks),
    },
    sponsorCard: {
      badge: bi(sc.badge, d.sponsorCard.badge),
      title: bi(sc.title, d.sponsorCard.title),
      blurb: bi(sc.blurb, d.sponsorCard.blurb),
    },
    sponsorship: {
      title: bi(sp.title, d.sponsorship.title),
      intro: bi(sp.intro, d.sponsorship.intro),
      tiers: {
        silver: tier(tiers.silver, d.sponsorship.tiers.silver),
        gold: tier(tiers.gold, d.sponsorship.tiers.gold),
        diamond: tier(tiers.diamond, d.sponsorship.tiers.diamond),
      },
      classroom: {
        title: bi(cls.title, d.sponsorship.classroom.title),
        body: bi(cls.body, d.sponsorship.classroom.body),
        perks: iconLines(cls.perks, d.sponsorship.classroom.perks),
      },
    },
  };
}

/** Replace {token} placeholders (e.g. {silver}) with values; unknown tokens are left as-is. */
export function fillTokens(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? values[k] : m));
}
