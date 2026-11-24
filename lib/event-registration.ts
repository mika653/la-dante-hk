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
  { key: "member",    label: "Are you a DA member / ICC member / Staff of DA sponsors?" },
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
  "I expressly authorize the processing of my personal data for purposes related to promotion, advertising, marketing, and profiling according to our Privacy Policy.";
export const MEMBER_QUESTION = "Are you a DA member / ICC member / Staff of DA sponsors?";
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

// -------- Custom questions --------
// Admin-written questions added per event, on top of the standard set above.
// Answers are stored in the registration's `answers` JSON under
// `CUSTOM_ANSWER_PREFIX + label`, so the question text is snapshotted with each
// answer even if the event's question is later edited or removed.

export type CustomQuestionType = "short" | "long" | "yesno" | "choice";

export type CustomQuestion = {
  id: string;
  label: string;
  type: CustomQuestionType;
  required: boolean;
  options?: string[];   // "choice" only: the drop-down answers
  allowOther?: boolean; // "choice" only: add an "Other" option with a text box
};

export const OTHER_OPTION = "Other";
export const MAX_CHOICE_OPTIONS = 20;

export const CUSTOM_QUESTION_TYPES: { value: CustomQuestionType; label: string }[] = [
  { value: "short", label: "Short answer" },
  { value: "long",  label: "Paragraph" },
  { value: "yesno", label: "Yes / No" },
  { value: "choice", label: "Drop-down choice" },
];

export const CUSTOM_ANSWER_PREFIX = "q:";
export const MAX_CUSTOM_QUESTIONS = 10;

/** Clean an untrusted list of custom questions: drop blanks, clamp sizes, dedupe ids. */
export function sanitizeCustomQuestions(input: unknown): CustomQuestion[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const seenLabels = new Set<string>();
  const out: CustomQuestion[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const q = raw as Record<string, unknown>;
    let label = String(q.label ?? "").trim().slice(0, 200);
    if (!label) continue;
    // Answers are stored keyed by label (q:<label>), so two questions sharing a
    // label would overwrite each other's answers. Keep labels unique by
    // suffixing " (n)" on a repeat.
    if (seenLabels.has(label)) {
      let n = 2;
      while (seenLabels.has(`${label} (${n})`)) n++;
      label = `${label} (${n})`;
    }
    seenLabels.add(label);
    let id = String(q.id ?? "").trim().slice(0, 40) || `cq-${out.length}-${label.length}`;
    while (seen.has(id)) id = `${id}-x`;
    seen.add(id);
    const type: CustomQuestionType = q.type === "long" || q.type === "yesno" || q.type === "choice" ? q.type : "short";
    if (type === "choice") {
      const options = Array.from(new Set(
        (Array.isArray(q.options) ? q.options : []).map((o) => String(o ?? "").trim().slice(0, 120)).filter(Boolean),
      )).slice(0, MAX_CHOICE_OPTIONS);
      const allowOther = !!q.allowOther;
      if (options.length === 0 && !allowOther) continue; // a drop-down with nothing to pick is useless
      out.push({ id, label, type, required: !!q.required, options, allowOther });
    } else {
      out.push({ id, label, type, required: !!q.required });
    }
    if (out.length >= MAX_CUSTOM_QUESTIONS) break;
  }
  return out;
}
