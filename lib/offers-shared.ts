// Editable Special Offers content, stored in site_config (key "offers").
// Defaults match what the page shipped with, so nothing changes until the office
// edits it. Pure / storage-agnostic.

export type OfferIcon =
  | "timer" | "graduation" | "id" | "gift" | "percent"
  | "sparkles" | "star" | "book" | "ticket" | "tag";

export const OFFER_ICONS: OfferIcon[] = ["timer", "graduation", "id", "gift", "percent", "sparkles", "star", "book", "ticket", "tag"];

export type Offer = {
  id: string;
  icon: OfferIcon;
  tag: string;
  title: string;
  body: string;   // supports line breaks + **bold** / *italic*
  href: string;
  cta: string;
};

export type OffersContent = { items: Offer[]; terms: string };

export const defaultOffers: OffersContent = {
  items: [
    { id: "early-bird", icon: "timer", tag: "New term", title: "Early-bird discount", body: "Enrol early for the new term and save on your group course. Ask the office for this term's early-bird rate and deadline.", href: "/courses/italian/adult-groups", cta: "See group courses" },
    { id: "students-seniors", icon: "graduation", tag: "10% off", title: "University students & seniors", body: "10% off our courses for full-time university students and seniors. Bring a valid student or senior ID when you enrol.", href: "/courses", cta: "Browse all courses" },
    { id: "members", icon: "id", tag: "Members", title: "Member discounts & perks", body: "Your Dante membership card unlocks discounts on selected cultural activities and short courses, plus offers at partner restaurants, wine shops and more.", href: "/membership#perks", cta: "See member perks" },
    { id: "gift", icon: "gift", tag: "Gift", title: "Give Italian", body: "Gift a course or a membership to someone who loves Italy.", href: "/contact", cta: "Contact us" },
  ],
  terms: "Offers can't be combined unless stated, and are subject to availability. Contact the office for full terms.",
};

export function normaliseOffers(parsed: unknown): OffersContent {
  const p = (parsed ?? {}) as Partial<OffersContent>;
  const str = (v: unknown, max: number) => String(v ?? "").slice(0, max);
  const icon = (v: unknown): OfferIcon => (OFFER_ICONS.includes(v as OfferIcon) ? (v as OfferIcon) : "tag");
  const items = Array.isArray(p.items)
    ? p.items
        .map((o, i): Offer => ({
          id: str((o as Offer)?.id, 60) || `offer-${i + 1}`,
          icon: icon((o as Offer)?.icon),
          tag: str((o as Offer)?.tag, 40),
          title: str((o as Offer)?.title, 120),
          body: str((o as Offer)?.body, 1200),
          href: str((o as Offer)?.href, 300) || "/contact",
          cta: str((o as Offer)?.cta, 60) || "Learn more",
        }))
        .filter((o) => o.title.trim())
        .slice(0, 24)
    : defaultOffers.items;
  return {
    items: items.length > 0 ? items : defaultOffers.items,
    terms: p.terms !== undefined ? str(p.terms, 600) : defaultOffers.terms,
  };
}
