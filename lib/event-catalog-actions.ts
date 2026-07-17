"use server";
// Event catalogue writes (distinct from event-actions.ts, which handles
// registrations). These change what every visitor sees, so — like courses —
// only a signed-in owner/manager may call them, re-checked here on the server.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { events, type EventRow } from "@/lib/db/schema";
import { getSession, isAdmin } from "@/lib/auth";
import type { EventItem } from "@/lib/events-shared";

function rowToEvent(r: EventRow): EventItem {
  return {
    id: r.id, date: r.date, title: r.title,
    kind: r.kind as EventItem["kind"], location: r.location,
    description: r.description ?? undefined,
    bookingUrl: r.bookingUrl ?? undefined,
    published: r.published,
  };
}

async function requireAdmin() {
  const s = await getSession();
  if (!s || !isAdmin(s.role)) throw new Error("Not authorised");
  return s;
}

function refresh() {
  revalidatePath("/api/events");
  revalidatePath("/", "layout");
}

/** Admin read — all events, unpublished included. */
export async function listAllEvents(): Promise<EventItem[]> {
  await requireAdmin();
  const rows = await db.select().from(events).orderBy(events.date);
  return rows.map(rowToEvent);
}

export async function createEvent(e: Omit<EventItem, "id">): Promise<EventItem> {
  await requireAdmin();
  const id = `e-${Date.now()}`;
  await db.insert(events).values({
    id, date: e.date, title: e.title, kind: e.kind, location: e.location,
    description: e.description ?? null, bookingUrl: e.bookingUrl ?? null,
    published: e.published,
  });
  refresh();
  return { ...e, id };
}

export async function patchEvent(id: string, patch: Partial<EventItem>): Promise<void> {
  await requireAdmin();
  const set: Partial<EventRow> = {};
  if (patch.date !== undefined) set.date = String(patch.date);
  if (patch.title !== undefined) set.title = String(patch.title);
  if (patch.kind !== undefined) set.kind = String(patch.kind);
  if (patch.location !== undefined) set.location = String(patch.location);
  if (patch.description !== undefined) set.description = patch.description || null;
  if (patch.bookingUrl !== undefined) set.bookingUrl = patch.bookingUrl || null;
  if (patch.published !== undefined) set.published = !!patch.published;
  if (Object.keys(set).length === 0) return;
  set.updatedAt = new Date();
  await db.update(events).set(set).where(eq(events.id, id));
  refresh();
}

export async function deleteEvent(id: string): Promise<void> {
  await requireAdmin();
  await db.delete(events).where(eq(events.id, id));
  refresh();
}
