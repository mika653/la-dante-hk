"use client";
import { useEffect, useState } from "react";
import { seedEvents, type EventItem, type EventKind } from "@/lib/events-shared";
import { listAllEvents, createEvent, patchEvent, deleteEvent } from "@/lib/event-catalog-actions";

export type { EventItem, EventKind };

// -------- admin store (database-backed via role-gated server actions) --------
export async function getEvents(): Promise<EventItem[]> { return listAllEvents(); }
export async function addEvent(e: Omit<EventItem, "id">): Promise<EventItem> { return createEvent(e); }
export async function updateEvent(id: string, patch: Partial<EventItem>): Promise<void> { return patchEvent(id, patch); }
export async function removeEvent(id: string): Promise<void> { return deleteEvent(id); }

// -------- public read hook --------
// Reads published events from /api/events so an admin's change is seen by every
// visitor. Starts from the bundled seed for an instant paint, then swaps in the
// live list; keeps the seed if the fetch fails.
export function useEvents(publishedOnly = false): EventItem[] {
  const [list, setList] = useState<EventItem[]>(seedEvents);
  useEffect(() => {
    let alive = true;
    fetch("/api/events", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data && Array.isArray(data.events) && data.events.length > 0) {
          setList(data.events as EventItem[]);
        }
      })
      .catch(() => { /* keep the seed */ });
    return () => { alive = false; };
  }, []);
  const filtered = publishedOnly ? list.filter((e) => e.published) : list;
  return filtered.slice().sort((a, b) => a.date.localeCompare(b.date));
}
