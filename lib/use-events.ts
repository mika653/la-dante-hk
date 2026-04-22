"use client";
import { useEffect, useState } from "react";

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

const seedEvents: EventItem[] = [
  { id: "e-1", date: "2026-05-15", title: "Italian Wine & Language",                       kind: "Workshop", location: "Wanchai",              description: "Five regions, five grapes, five conversations — all in Italian with a sommelier.", published: true },
  { id: "e-2", date: "2026-06-22", title: "Dante's Inferno Reading Club — Session 1",      kind: "Bookclub", location: "Wanchai",              description: "Four sessions, four circles of hell. Original text with guided English support.", published: true },
  { id: "e-3", date: "2026-07-05", title: "Italian Cinema Night: La Dolce Vita",          kind: "Film",     location: "HK Arts Centre",        description: "Fellini's 1960 classic with intro + discussion.", published: true },
  { id: "e-4", date: "2026-07-19", title: "Aperitivo & Chiacchiere",                       kind: "Aperitivo", location: "Wanchai",              description: "Members-only drinks, cheese, and conversation.", published: true },
  { id: "e-5", date: "2026-08-02", title: "Regional Italy: Sicilian Food Tasting",         kind: "Culture",  location: "Wanchai",              description: "Chef-led tasting with a mini language lesson on regional dialects.", published: true },
];

const KEY = "ladante-events";

function readAll(): EventItem[] {
  if (typeof window === "undefined") return seedEvents;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedEvents;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedEvents;
  } catch { return seedEvents; }
}
function writeAll(list: EventItem[]) {
  if (typeof window !== "undefined") { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} }
}

export function getEvents(): EventItem[] { return readAll(); }
export function addEvent(e: Omit<EventItem, "id">): EventItem {
  const ev: EventItem = { ...e, id: `e-${Date.now()}` };
  writeAll([ev, ...readAll()]);
  return ev;
}
export function updateEvent(id: string, patch: Partial<EventItem>) {
  writeAll(readAll().map((e) => (e.id === id ? { ...e, ...patch } : e)));
}
export function removeEvent(id: string) {
  writeAll(readAll().filter((e) => e.id !== id));
}
export function resetEvents() { if (typeof window !== "undefined") localStorage.removeItem(KEY); }

export function useEvents(publishedOnly = false): EventItem[] {
  const [list, setList] = useState<EventItem[]>(seedEvents);
  useEffect(() => {
    const load = () => setList(readAll());
    load();
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) load(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const list2 = publishedOnly ? list.filter((e) => e.published) : list;
  return list2.slice().sort((a, b) => a.date.localeCompare(b.date));
}
