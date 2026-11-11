// Course defaults the office edits in Admin → Courses → Course defaults:
//   • the default fee per course type (pre-fills the price on a NEW course),
//   • the teacher list for the course teacher picker,
//   • the "Auto-fill description" text per level.
// Shared by the server actions and the admin forms (no directive).
import { levelOutcomes, type Course, type CourseType } from "@/lib/data";

export const COURSE_TYPE_LABELS: { type: CourseType; label: string }[] = [
  { type: "adult-group", label: "Adult group" },
  { type: "kids", label: "Kids & teens" },
  { type: "private", label: "Private" },
  { type: "corporate", label: "Corporate" },
  { type: "online", label: "Online" },
  { type: "latin-group", label: "Latin group" },
  { type: "special", label: "Special course" },
];

// One editable description per CEFR band, plus one for Latin courses.
export const DESCRIPTION_KEYS = ["A1", "A2", "B1", "B2", "C1", "C2", "Latin"] as const;
export type DescriptionKey = (typeof DESCRIPTION_KEYS)[number];

export type CourseDefaults = {
  feeByType: Partial<Record<CourseType, number>>;   // missing = no default, price must be typed
  teachers: string[];
  descriptions: Partial<Record<DescriptionKey, string>>; // missing = built-in text
};

// The five teachers that used to be hard-coded in the new-course form.
export const SEED_TEACHERS = ["Francesca Coppeta", "Clelia Marinucci", "Giorgia Zecchinato", "Raffaella Iaconeta", "Jacopo Gorini"];

// No default fees until the office sets them — a wrong default (the old fixed
// HK$4,800) is worse than an empty field the admin has to fill in.
export const DEFAULT_COURSE_DEFAULTS: CourseDefaults = { feeByType: {}, teachers: SEED_TEACHERS, descriptions: {} };

/** Built-in auto-fill text (used when the office hasn't written its own). */
export function builtInDescription(key: DescriptionKey): string {
  if (key === "Latin") {
    return "Classical Latin with a specialist teacher: grammar, vocabulary and guided reading of original texts, at a pace that suits the group.";
  }
  const info = levelOutcomes[key];
  if (!info) return "";
  return `After this course you will be able to:\n${info.outcomes.map((o) => `• ${o}`).join("\n")}`;
}

/** Which description applies to a course: its CEFR band, or "Latin". */
export function descriptionKeyFor(language: Course["language"], level: Course["level"]): DescriptionKey | null {
  if (language === "latin") return "Latin";
  const band = String(level).slice(0, 2).toUpperCase();
  return (DESCRIPTION_KEYS as readonly string[]).includes(band) ? (band as DescriptionKey) : null;
}

export function descriptionFor(d: CourseDefaults, language: Course["language"], level: Course["level"]): string {
  const key = descriptionKeyFor(language, level);
  if (!key) return "";
  return d.descriptions[key]?.trim() || builtInDescription(key);
}

export function normaliseCourseDefaults(raw: unknown): CourseDefaults {
  const p = (raw ?? {}) as Partial<CourseDefaults>;
  const feeByType: Partial<Record<CourseType, number>> = {};
  for (const { type } of COURSE_TYPE_LABELS) {
    const v = Number((p.feeByType as Record<string, unknown> | undefined)?.[type]);
    if (Number.isFinite(v) && v > 0) feeByType[type] = Math.trunc(v);
  }
  const teachers = Array.isArray(p.teachers)
    ? Array.from(new Set(p.teachers.map((t) => String(t ?? "").trim()).filter(Boolean)))
    : SEED_TEACHERS;
  const descriptions: Partial<Record<DescriptionKey, string>> = {};
  for (const k of DESCRIPTION_KEYS) {
    const v = (p.descriptions as Record<string, unknown> | undefined)?.[k];
    if (typeof v === "string" && v.trim()) descriptions[k] = v;
  }
  return { feeByType, teachers, descriptions };
}

/** Merge teacher names from every source, de-duplicated case-insensitively, A–Z. */
export function mergeTeacherNames(...lists: Array<Array<string | null | undefined>>): string[] {
  const seen = new Map<string, string>();
  for (const list of lists) for (const raw of list) {
    const n = String(raw ?? "").trim();
    if (n && !seen.has(n.toLowerCase())) seen.set(n.toLowerCase(), n);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}
