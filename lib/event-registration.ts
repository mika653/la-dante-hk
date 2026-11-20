// The standard event-registration questions (Giulia's list). Which ones appear
// is configurable per event (admin ticks them when creating/editing the event);
// the identity fields are always on. Pure / storage-agnostic.

export type RegFieldKey = "firstName" | "surname" | "email" | "phone" | "source" | "member" | "newsletter" | "consent";

export type RegFieldDef = {
  key: RegFieldKey;
  label: string;
  always?: boolean;     // forced on — can't be removed per event
  optional?: boolean;   // not required even when shown (e.g. the newsletter opt-in)
};

export const REG_FIELDS: RegFieldDef[] = [
  { key: "firstName", label: "First name", always: true },
  { key: "surname",   label: "Surname", always: true },
  { key: "email",     label: "Email", always: true },
  { key: "phone",     label: "Phone number" },
  { key: "source",    label: "How did you find out about the event?" },
  { key: "member",    label: "Are you a DA member / ICC member / staff of a DA sponsor?" },
  { key: "newsletter", label: "Newsletter opt-in", optional: true },
  { key: "consent",   label: "Privacy consent (required to register)" },
];

export const DEFAULT_REG_FIELDS: RegFieldKey[] = REG_FIELDS.map((f) => f.key);

export const SOURCE_OPTIONS = [
  "Dante Alighieri Hong Kong Instagram",
  "Dante Alighieri Hong Kong Facebook",
  "Dante Alighieri Hong Kong Newsletter",
  "Dante Alighieri Hong Kong Website",
  "Friends",
  "ICC newsletter",
  "Other",
];

export const CONSENT_TEXT =
  "I expressly authorize the processing of my personal data for purposes related to promotion, advertising, marketing, and profiling according to the Privacy Policy.";
export const NEWSLETTER_TEXT =
  "I wish to receive news about Italian courses, cultural events, workshops, special offers and other promotional emails from the Dante Alighieri Society in Hong Kong.";

/** Resolve which fields an event actually uses: stored selection (or the default
 * set) with the always-on identity fields forced in, returned in catalogue order. */
export function activeRegFields(stored: string[] | null | undefined): RegFieldKey[] {
  const base = Array.isArray(stored) && stored.length > 0 ? stored : DEFAULT_REG_FIELDS;
  const set = new Set(base.filter((k): k is RegFieldKey => REG_FIELDS.some((f) => f.key === k)));
  for (const f of REG_FIELDS) if (f.always) set.add(f.key);
  return REG_FIELDS.filter((f) => set.has(f.key)).map((f) => f.key);
}
