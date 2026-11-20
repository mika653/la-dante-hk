// Maps the stored offer icon keys to lucide icons, shared by the public Special
// Offers list and the admin editor.
import { Timer, GraduationCap, IdCard, Gift, Percent, Sparkles, Star, BookOpen, Ticket, Tag, type LucideIcon } from "lucide-react";
import type { OfferIcon } from "@/lib/offers-shared";

export const OFFER_ICON: Record<OfferIcon, LucideIcon> = {
  timer: Timer,
  graduation: GraduationCap,
  id: IdCard,
  gift: Gift,
  percent: Percent,
  sparkles: Sparkles,
  star: Star,
  book: BookOpen,
  ticket: Ticket,
  tag: Tag,
};
