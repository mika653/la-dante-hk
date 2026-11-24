"use server";
// Event catalogue writes (distinct from event-actions.ts, which handles
// registrations). These change what every visitor sees, so — like courses —
// only a signed-in owner/manager may call them, re-checked here on the server.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { events, type EventRow } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import type { EventItem } from "@/lib/events-shared";
import { sanitizeCustomQuestions } from "@/lib/event-registration";
import { sanitizeZh, EVENT_ZH_FIELDS } from "@/lib/content-i18n";

function rowToEvent(r: EventRow): EventItem {
  return {
    id: r.id, date: r.date, title: r.title,
    kind: r.kind as EventItem["kind"], location: r.location,
    description: r.description ?? undefined,
    bookingUrl: r.bookingUrl ?? undefined,
    image: r.image ?? undefined,
    published: r.published,
    ...(Array.isArray(r.regFields) && r.regFields.length > 0 ? { regFields: r.regFields } : {}),
    ...(Array.isArray(r.customQuestions) && r.customQuestions.length > 0 ? { customQuestions: r.customQuestions } : {}),
    ...(r.zh ? { zh: r.zh } : {}),
  };
}

const requireAdmin = requireAdminFresh;

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

// Result types so validation messages reach the admin UI — thrown Error
// messages are stripped in production, returned values survive.
export type EventWriteResult = { ok: true; event: EventItem } | { ok: false; error: string };
export type EventPatchResult = { ok: true } | { ok: false; error: string };

// Every event needs a real "YYYY-MM-DD" date and a title — a blank row breaks
// the calendar/date rendering on the admin and public pages.
function dateError(date: unknown): string | null {
  return typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date))
    ? "Please pick a valid date for the event." : null;
}
function titleError(title: unknown): string | null {
  return typeof title !== "string" || !title.trim() ? "Please give the event a title." : null;
}

function customOrNull(input: unknown) {
  const qs = sanitizeCustomQuestions(input);
  return qs.length > 0 ? qs : null;
}

export async function createEvent(e: Omit<EventItem, "id">): Promise<EventWriteResult> {
  await requireAdmin();
  const err = dateError(e.date) ?? titleError(e.title);
  if (err) return { ok: false, error: err };
  const id = `e-${Date.now()}`;
  await db.insert(events).values({
    id, date: e.date, title: e.title, kind: e.kind, location: e.location,
    description: e.description ?? null, bookingUrl: e.bookingUrl ?? null,
    image: e.image ?? null,
    published: e.published,
    regFields: Array.isArray(e.regFields) && e.regFields.length > 0 ? e.regFields : null,
    customQuestions: customOrNull(e.customQuestions),
    zh: sanitizeZh(e.zh, EVENT_ZH_FIELDS),
  });
  refresh();
  return { ok: true, event: { ...e, id } };
}

export async function patchEvent(id: string, patch: Partial<EventItem>): Promise<EventPatchResult> {
  await requireAdmin();
  const set: Partial<EventRow> = {};
  if (patch.date !== undefined) { const err = dateError(patch.date); if (err) return { ok: false, error: err }; set.date = patch.date; }
  if (patch.title !== undefined) { const err = titleError(patch.title); if (err) return { ok: false, error: err }; set.title = patch.title.trim(); }
  if (patch.kind !== undefined) set.kind = String(patch.kind);
  if (patch.location !== undefined) set.location = String(patch.location);
  if (patch.description !== undefined) set.description = patch.description || null;
  if (patch.bookingUrl !== undefined) set.bookingUrl = patch.bookingUrl || null;
  if (patch.image !== undefined) set.image = patch.image || null;
  if (patch.published !== undefined) set.published = !!patch.published;
  if (patch.regFields !== undefined) set.regFields = Array.isArray(patch.regFields) && patch.regFields.length > 0 ? patch.regFields : null;
  if (patch.customQuestions !== undefined) set.customQuestions = customOrNull(patch.customQuestions);
  if (patch.zh !== undefined) set.zh = sanitizeZh(patch.zh, EVENT_ZH_FIELDS);
  if (Object.keys(set).length === 0) return { ok: true };
  set.updatedAt = new Date();
  await db.update(events).set(set).where(eq(events.id, id));
  refresh();
  return { ok: true };
}

export async function deleteEvent(id: string): Promise<void> {
  await requireAdmin();
  await db.delete(events).where(eq(events.id, id));
  refresh();
}
