import {
  Wine, ChefHat, BookOpen, Film, Music, Palette, Pencil, Coffee, Drama, Landmark, Mic, Sparkles,
  type LucideIcon,
} from "lucide-react";

// Line icons for workshop cards, replacing the emojis. The workshop's `image`
// field now stores one of these keys; a legacy emoji still resolves to an icon
// so old rows keep rendering.
export type WorkshopIconKey =
  | "wine" | "food" | "book" | "film" | "music" | "art" | "writing" | "cafe" | "theatre" | "culture" | "talk" | "other";

export const WORKSHOP_ICONS: { key: WorkshopIconKey; Icon: LucideIcon; label: string }[] = [
  { key: "wine", Icon: Wine, label: "Wine" },
  { key: "food", Icon: ChefHat, label: "Food" },
  { key: "book", Icon: BookOpen, label: "Book club" },
  { key: "film", Icon: Film, label: "Film" },
  { key: "music", Icon: Music, label: "Music" },
  { key: "art", Icon: Palette, label: "Art" },
  { key: "writing", Icon: Pencil, label: "Writing" },
  { key: "cafe", Icon: Coffee, label: "Aperitivo" },
  { key: "theatre", Icon: Drama, label: "Theatre" },
  { key: "culture", Icon: Landmark, label: "Culture" },
  { key: "talk", Icon: Mic, label: "Talk" },
  { key: "other", Icon: Sparkles, label: "Other" },
];

const BY_KEY: Record<string, LucideIcon> = Object.fromEntries(WORKSHOP_ICONS.map((i) => [i.key, i.Icon]));

// Legacy emoji → key, so workshops seeded/saved with an emoji still show an icon.
const EMOJI_TO_KEY: Record<string, WorkshopIconKey> = {
  "🍷": "wine", "🍇": "wine",
  "🍕": "food", "🍝": "food", "🧑‍🍳": "food",
  "📖": "book", "📚": "book",
  "🎬": "film", "🎥": "film",
  "🎶": "music", "🎵": "music",
  "🎨": "art",
  "✏️": "writing", "✍️": "writing",
  "☕": "cafe",
  "🎭": "theatre",
  "🏛️": "culture",
  "🎤": "talk",
};

export function workshopIcon(value: string | undefined | null): LucideIcon {
  if (!value) return Sparkles;
  if (BY_KEY[value]) return BY_KEY[value];
  if (EMOJI_TO_KEY[value]) return BY_KEY[EMOJI_TO_KEY[value]];
  return Sparkles;
}
