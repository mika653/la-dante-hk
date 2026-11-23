// Maps the stored membership/sponsorship icon keys to lucide icons, shared by
// the public membership components and the admin editor.
import {
  Store, Ticket, Library, Landmark, Star, Gift, BookOpen, Sparkles, IdCard, Percent,
  DoorOpen, Megaphone, BookImage, Users, Wine, CalendarRange, type LucideIcon,
} from "lucide-react";
import type { MembershipIcon } from "@/lib/membership-content-shared";

export const MEMBERSHIP_ICON: Record<MembershipIcon, LucideIcon> = {
  store: Store,
  ticket: Ticket,
  library: Library,
  landmark: Landmark,
  star: Star,
  gift: Gift,
  book: BookOpen,
  sparkles: Sparkles,
  id: IdCard,
  percent: Percent,
  door: DoorOpen,
  megaphone: Megaphone,
  brochure: BookImage,
  users: Users,
  wine: Wine,
  calendar: CalendarRange,
};
