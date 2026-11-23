// Which library icon is used where on the site. Stored in site_config under
// "icon-choices" as { [slotId]: iconKey }. A slot left at its default renders
// exactly what shipped; course circles default to "" = the original custom
// illustration, until an admin picks a library icon.
import type { LucideIcon } from "lucide-react";
import { iconFor, isIconKey } from "@/lib/icon-library";

export const ICON_CHOICES_KEY = "icon-choices";

export type IconSlot = {
  id: string;
  label: string;
  /** Library key shipped with the site, or "" for a custom illustration. */
  default: string;
};

export type IconSlotGroup = {
  id: string;
  title: string;
  blurb: string;
  /** Public page where the icons appear (for the "View" link). */
  where: string;
  /** True when the default is a bespoke drawing rather than a library icon. */
  customDefault?: boolean;
  slots: IconSlot[];
};

export const ICON_SLOT_GROUPS: IconSlotGroup[] = [
  {
    id: "course",
    title: "Course circles",
    blurb: "The six circles in “Find Your Course” on the homepage. By default each shows its own custom illustration.",
    where: "/",
    customDefault: true,
    slots: [
      { id: "course.groups", label: "Adult groups", default: "" },
      { id: "course.private", label: "Private lessons", default: "" },
      { id: "course.kids", label: "Kids & teens", default: "" },
      { id: "course.online", label: "Online", default: "" },
      { id: "course.corporate", label: "Corporate", default: "" },
      { id: "course.special", label: "Special courses", default: "" },
    ],
  },
  {
    id: "why",
    title: "Why Dante HK",
    blurb: "The five feature points in the dark-blue strip under the course circles on the homepage.",
    where: "/",
    slots: [
      { id: "why.years", label: "90+ Years", default: "culture" },
      { id: "why.teachers", label: "Native Italian Teachers", default: "graduation" },
      { id: "why.cefr", label: "CEFR-Aligned Courses", default: "book" },
      { id: "why.plida", label: "Official PLIDA Centre", default: "shield-check" },
      { id: "why.online", label: "In-Person & Online", default: "laptop" },
    ],
  },
  {
    id: "reasons",
    title: "Why study Italian",
    blurb: "The seven reason bubbles on the Italian courses page.",
    where: "/courses/italian",
    slots: [
      { id: "reasons.cultural", label: "Cultural Appreciation", default: "culture" },
      { id: "reasons.career", label: "Career Opportunities", default: "briefcase" },
      { id: "reasons.heritage", label: "Connection with Heritage", default: "heritage" },
      { id: "reasons.structure", label: "Language Structure", default: "languages" },
      { id: "reasons.community", label: "Community", default: "people" },
      { id: "reasons.travel", label: "Travel", default: "plane" },
      { id: "reasons.cognitive", label: "Cognitive Benefits", default: "brain" },
    ],
  },
  {
    id: "upcoming",
    title: "Upcoming courses features",
    blurb: "The small feature line under the “Upcoming Courses” table (12 weeks per term, small class size…).",
    where: "/",
    slots: [
      { id: "upcoming.weeks", label: "12 weeks per term", default: "calendar" },
      { id: "upcoming.class", label: "Small class size", default: "group" },
      { id: "upcoming.cefr", label: "CEFR-aligned", default: "graduation" },
      { id: "upcoming.teachers", label: "Native Italian teachers", default: "teacher" },
    ],
  },
];

const SLOTS: Record<string, IconSlot> = Object.fromEntries(
  ICON_SLOT_GROUPS.flatMap((g) => g.slots.map((s) => [s.id, s])),
);

export type IconChoices = Record<string, string>;

export const defaultIconChoices: IconChoices = Object.fromEntries(
  Object.values(SLOTS).map((s) => [s.id, s.default]),
);

// Keeps only known slots with a valid library key ("" allowed where the default
// is a custom illustration); anything else falls back to the slot default.
export function normaliseIconChoices(input: unknown): IconChoices {
  const raw = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const out: IconChoices = { ...defaultIconChoices };
  for (const s of Object.values(SLOTS)) {
    const v = raw[s.id];
    if (isIconKey(v)) out[s.id] = v;
    else if (v === "" && s.default === "") out[s.id] = "";
  }
  return out;
}

/** Library icon chosen for a slot, or null when it should keep its custom drawing. */
export function slotIcon(choices: IconChoices, slotId: string): LucideIcon | null {
  const key = choices[slotId] ?? SLOTS[slotId]?.default ?? "";
  return key ? iconFor(key) : null;
}

/** Like slotIcon, for slots that always render a library icon. */
export function slotIconOr(choices: IconChoices, slotId: string, fallback: LucideIcon): LucideIcon {
  return slotIcon(choices, slotId) ?? fallback;
}
