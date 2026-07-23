// Event types + seed data, shared by the client hook, the admin store, and the
// server actions. No "use client" / "use server" so anything can import it.

export type EventKind = "Bookclub" | "Film" | "Aperitivo" | "Workshop" | "Culture" | "Trip" | "Other";

export type EventItem = {
  id: string;
  date: string;      // ISO yyyy-mm-dd
  title: string;
  kind: EventKind;
  location: string;
  description?: string;
  bookingUrl?: string;
  published: boolean;
};

// Fallback shown for an instant first paint and if the API is briefly down; also
// what the database is seeded from.
export const seedEvents: EventItem[] = [
  { id: "e-1", date: "2026-05-15", title: "Italian Wine & Language",                  kind: "Workshop",  location: "Wanchai",        description: "Five regions, five grapes, five conversations — all in Italian with a sommelier.", published: true },
  { id: "e-2", date: "2026-06-22", title: "Dante's Inferno Reading Club — Session 1", kind: "Bookclub",  location: "Wanchai",        description: "Four sessions, four circles of hell. Original text with guided English support.", published: true },
  { id: "e-3", date: "2026-07-05", title: "Italian Cinema Night: La Dolce Vita",       kind: "Film",      location: "HK Arts Centre", description: "Fellini's 1960 classic with intro + discussion.", published: true },
  { id: "e-4", date: "2026-07-19", title: "Aperitivo & Chiacchiere",                   kind: "Aperitivo", location: "Wanchai",        description: "Members-only drinks, cheese, and conversation.", published: true },
  { id: "e-5", date: "2026-08-02", title: "Regional Italy: Sicilian Food Tasting",     kind: "Culture",   location: "Wanchai",        description: "Chef-led tasting with a mini language lesson on regional dialects.", published: true },
];
