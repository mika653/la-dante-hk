// Curated icon library for the dashboard: the line icons an admin can pick for
// course circles and the site's "feature" points. Keys are what gets stored, so
// never rename one — add a new key (or an alias below) instead.
import {
  // Learning
  GraduationCap, BookOpen, BookOpenText, Library, Pencil, NotebookPen, Presentation, ClipboardCheck,
  Languages, Brain, Lightbulb, School, Backpack,
  // Italy & culture
  Landmark, Church, Castle, Palette, Drama, Music, Film, Scroll, Feather, Mic,
  // Food & wine
  Wine, Grape, ChefHat, Pizza, UtensilsCrossed, Coffee, CakeSlice,
  // People & community
  User, UserRound, Users, Users2, UserCheck, Baby, Handshake, HeartHandshake, MessagesSquare, Smile,
  // Time & calendar
  CalendarDays, Clock, Timer, Hourglass,
  // Online & devices
  Laptop2, Monitor, Smartphone, Video, Headphones, Globe,
  // Awards & trust
  Award, Trophy, Medal, Star, BadgeCheck, ShieldCheck, Shield, Crown, Sparkles,
  // Places & travel
  MapPin, Map, Building2, Plane, Mountain, Sun, Compass, Briefcase,
  // Offers & extras
  Gift, Ticket, Tag, Percent, IdCard, Heart, Target, Rocket,
  type LucideIcon,
} from "lucide-react";

export type IconCategory =
  | "Learning" | "Italy & culture" | "Food & wine" | "People" | "Time"
  | "Online" | "Awards & trust" | "Places & travel" | "Offers & extras";

export const ICON_CATEGORIES: IconCategory[] = [
  "Learning", "Italy & culture", "Food & wine", "People", "Time",
  "Online", "Awards & trust", "Places & travel", "Offers & extras",
];

export type LibraryIcon = { key: string; Icon: LucideIcon; label: string; category: IconCategory; tags?: string };

export const ICON_LIBRARY: LibraryIcon[] = [
  // Learning
  { key: "graduation", Icon: GraduationCap, label: "Graduation cap", category: "Learning", tags: "teacher cefr qualified study" },
  { key: "book", Icon: BookOpen, label: "Open book", category: "Learning", tags: "reading course book club" },
  { key: "book-text", Icon: BookOpenText, label: "Textbook", category: "Learning", tags: "reading lesson" },
  { key: "library", Icon: Library, label: "Library", category: "Learning", tags: "books shelf" },
  { key: "writing", Icon: Pencil, label: "Pencil", category: "Learning", tags: "write homework" },
  { key: "notebook", Icon: NotebookPen, label: "Notebook", category: "Learning", tags: "notes write" },
  { key: "presentation", Icon: Presentation, label: "Presentation", category: "Learning", tags: "class lesson board corporate" },
  { key: "exam", Icon: ClipboardCheck, label: "Exam / test", category: "Learning", tags: "plida placement certificate" },
  { key: "languages", Icon: Languages, label: "Languages", category: "Learning", tags: "translate speak" },
  { key: "brain", Icon: Brain, label: "Brain", category: "Learning", tags: "mind cognitive" },
  { key: "idea", Icon: Lightbulb, label: "Idea", category: "Learning", tags: "lightbulb tip" },
  { key: "school", Icon: School, label: "School", category: "Learning", tags: "building class" },
  { key: "backpack", Icon: Backpack, label: "Backpack", category: "Learning", tags: "kids student" },

  // Italy & culture
  { key: "culture", Icon: Landmark, label: "Landmark", category: "Italy & culture", tags: "history heritage museum years" },
  { key: "church", Icon: Church, label: "Church", category: "Italy & culture", tags: "duomo architecture" },
  { key: "castle", Icon: Castle, label: "Castle", category: "Italy & culture", tags: "history" },
  { key: "art", Icon: Palette, label: "Art", category: "Italy & culture", tags: "painting palette" },
  { key: "theatre", Icon: Drama, label: "Theatre", category: "Italy & culture", tags: "opera masks drama" },
  { key: "music", Icon: Music, label: "Music", category: "Italy & culture", tags: "song opera" },
  { key: "film", Icon: Film, label: "Film", category: "Italy & culture", tags: "cinema movie" },
  { key: "scroll", Icon: Scroll, label: "Scroll", category: "Italy & culture", tags: "literature dante poetry" },
  { key: "feather", Icon: Feather, label: "Quill", category: "Italy & culture", tags: "poetry literature writing" },
  { key: "talk", Icon: Mic, label: "Talk", category: "Italy & culture", tags: "microphone speaker lecture" },

  // Food & wine
  { key: "wine", Icon: Wine, label: "Wine", category: "Food & wine", tags: "tasting aperitivo" },
  { key: "grape", Icon: Grape, label: "Grapes", category: "Food & wine", tags: "wine vineyard" },
  { key: "food", Icon: ChefHat, label: "Chef", category: "Food & wine", tags: "cooking cuisine" },
  { key: "pizza", Icon: Pizza, label: "Pizza", category: "Food & wine", tags: "food" },
  { key: "dining", Icon: UtensilsCrossed, label: "Dining", category: "Food & wine", tags: "restaurant cutlery" },
  { key: "cafe", Icon: Coffee, label: "Coffee", category: "Food & wine", tags: "espresso aperitivo cafe" },
  { key: "cake", Icon: CakeSlice, label: "Dessert", category: "Food & wine", tags: "cake tiramisu" },

  // People
  { key: "person", Icon: User, label: "Person", category: "People", tags: "private one-to-one" },
  { key: "person-round", Icon: UserRound, label: "Person (round)", category: "People", tags: "private" },
  { key: "people", Icon: Users, label: "People", category: "People", tags: "group community" },
  { key: "group", Icon: Users2, label: "Group", category: "People", tags: "class small" },
  { key: "teacher", Icon: UserCheck, label: "Teacher", category: "People", tags: "native qualified" },
  { key: "kids", Icon: Baby, label: "Kids", category: "People", tags: "children baby" },
  { key: "handshake", Icon: Handshake, label: "Handshake", category: "People", tags: "corporate partner business" },
  { key: "heritage", Icon: HeartHandshake, label: "Care", category: "People", tags: "heritage family support" },
  { key: "conversation", Icon: MessagesSquare, label: "Conversation", category: "People", tags: "chat speaking" },
  { key: "smile", Icon: Smile, label: "Smile", category: "People", tags: "happy friendly" },

  // Time
  { key: "calendar", Icon: CalendarDays, label: "Calendar", category: "Time", tags: "term weeks schedule date" },
  { key: "clock", Icon: Clock, label: "Clock", category: "Time", tags: "hours time" },
  { key: "timer", Icon: Timer, label: "Timer", category: "Time", tags: "early bird deadline" },
  { key: "hourglass", Icon: Hourglass, label: "Hourglass", category: "Time", tags: "duration" },

  // Online
  { key: "laptop", Icon: Laptop2, label: "Laptop", category: "Online", tags: "online computer remote" },
  { key: "monitor", Icon: Monitor, label: "Screen", category: "Online", tags: "online desktop" },
  { key: "phone", Icon: Smartphone, label: "Phone", category: "Online", tags: "mobile app" },
  { key: "video", Icon: Video, label: "Video call", category: "Online", tags: "zoom online camera" },
  { key: "headphones", Icon: Headphones, label: "Headphones", category: "Online", tags: "listening audio" },
  { key: "globe", Icon: Globe, label: "Globe", category: "Online", tags: "world international web" },

  // Awards & trust
  { key: "award", Icon: Award, label: "Award", category: "Awards & trust", tags: "rosette quality" },
  { key: "trophy", Icon: Trophy, label: "Trophy", category: "Awards & trust", tags: "winner" },
  { key: "medal", Icon: Medal, label: "Medal", category: "Awards & trust", tags: "achievement" },
  { key: "star", Icon: Star, label: "Star", category: "Awards & trust", tags: "special favourite" },
  { key: "badge", Icon: BadgeCheck, label: "Verified badge", category: "Awards & trust", tags: "certified official" },
  { key: "shield-check", Icon: ShieldCheck, label: "Shield (check)", category: "Awards & trust", tags: "official plida trusted" },
  { key: "shield", Icon: Shield, label: "Shield", category: "Awards & trust", tags: "secure trusted" },
  { key: "crown", Icon: Crown, label: "Crown", category: "Awards & trust", tags: "premium vip" },
  { key: "sparkles", Icon: Sparkles, label: "Sparkles", category: "Awards & trust", tags: "special new other" },

  // Places & travel
  { key: "pin", Icon: MapPin, label: "Location", category: "Places & travel", tags: "address map visit" },
  { key: "map", Icon: Map, label: "Map", category: "Places & travel", tags: "travel italy" },
  { key: "building", Icon: Building2, label: "Office", category: "Places & travel", tags: "corporate company business" },
  { key: "plane", Icon: Plane, label: "Plane", category: "Places & travel", tags: "travel trip" },
  { key: "mountain", Icon: Mountain, label: "Mountains", category: "Places & travel", tags: "alps landscape" },
  { key: "sun", Icon: Sun, label: "Sun", category: "Places & travel", tags: "summer holiday" },
  { key: "compass", Icon: Compass, label: "Compass", category: "Places & travel", tags: "explore discover" },
  { key: "briefcase", Icon: Briefcase, label: "Briefcase", category: "Places & travel", tags: "career business work corporate" },

  // Offers & extras
  { key: "gift", Icon: Gift, label: "Gift", category: "Offers & extras", tags: "present voucher" },
  { key: "ticket", Icon: Ticket, label: "Ticket", category: "Offers & extras", tags: "event entry" },
  { key: "tag", Icon: Tag, label: "Tag", category: "Offers & extras", tags: "price offer" },
  { key: "percent", Icon: Percent, label: "Percent", category: "Offers & extras", tags: "discount sale" },
  { key: "id", Icon: IdCard, label: "Member card", category: "Offers & extras", tags: "membership id card" },
  { key: "heart", Icon: Heart, label: "Heart", category: "Offers & extras", tags: "love favourite" },
  { key: "target", Icon: Target, label: "Target", category: "Offers & extras", tags: "goal aim" },
  { key: "rocket", Icon: Rocket, label: "Rocket", category: "Offers & extras", tags: "fast intensive launch" },
];

// Keys used elsewhere before the library existed (workshop + offer icons), so
// any value stored under those names still resolves here.
const ALIASES: Record<string, string> = { other: "sparkles" };

const BY_KEY: Record<string, LibraryIcon> = Object.fromEntries(ICON_LIBRARY.map((i) => [i.key, i]));

export function libraryIcon(key: string | null | undefined): LibraryIcon | null {
  if (!key) return null;
  return BY_KEY[key] ?? BY_KEY[ALIASES[key] ?? ""] ?? null;
}

export function isIconKey(key: unknown): key is string {
  return typeof key === "string" && libraryIcon(key) !== null;
}

export function iconFor(key: string | null | undefined, fallback: LucideIcon = Sparkles): LucideIcon {
  return libraryIcon(key)?.Icon ?? fallback;
}
