"use server";
// Workshops — role-gated CRUD. Previously double-disconnected: the public pages
// read a static seed while admin edits went to localStorage, so admin changes
// showed nowhere. Now there's one shared source.

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteConfig, workshopsTable, type WorkshopRow } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import type { Workshop } from "@/lib/data";
import { sanitizeZh, WORKSHOP_ZH_FIELDS } from "@/lib/content-i18n";
import { WORKSHOP_SETTINGS_KEY, DEFAULT_WORKSHOP_SETTINGS, type WorkshopSettings } from "@/lib/workshop-settings";

const rowToWorkshop = (r: WorkshopRow): Workshop => ({
  id: r.id, title: r.title, description: r.description,
  status: r.status as Workshop["status"],
  dateLabel: r.dateLabel ?? undefined,
  interested: r.interested ?? undefined,
  image: r.image,
  timeLabel: r.timeLabel ?? undefined,
  fee: r.fee ?? undefined,
  published: r.published,
  sortOrder: r.sortOrder,
  zh: r.zh ?? null,
});

function refresh() {
  revalidatePath("/api/workshops");
  revalidatePath("/", "layout");
  revalidatePath("/workshops");
}

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function listAllWorkshops(): Promise<Workshop[]> {
  await requireAdminFresh();
  const rows = await db.select().from(workshopsTable).orderBy(asc(workshopsTable.sortOrder), asc(workshopsTable.id));
  return rows.map(rowToWorkshop);
}

export async function createWorkshop(w: Omit<Workshop, "id">): Promise<Workshop> {
  await requireAdminFresh();
  const title = clip(w.title, 200);
  if (!title) throw new Error("Please give the workshop a title.");
  const id = `w-${Date.now()}`;
  // New workshops go to the end of the list.
  const all = await db.select({ o: workshopsTable.sortOrder }).from(workshopsTable);
  const sortOrder = all.reduce((m, r) => Math.max(m, r.o), -1) + 1;
  await db.insert(workshopsTable).values({
    id, title, description: clip(w.description, 4000), status: w.status === "interest" ? "interest" : "planned",
    dateLabel: clip(w.dateLabel, 120) || null, interested: w.interested ?? null, image: clip(w.image, 2000),
    timeLabel: clip(w.timeLabel, 120) || null, fee: clip(w.fee, 200) || null,
    published: w.published ?? true, sortOrder,
    zh: sanitizeZh(w.zh, WORKSHOP_ZH_FIELDS),
  });
  refresh();
  return { ...w, id, title, sortOrder };
}

export async function patchWorkshop(id: string, patch: Partial<Workshop>): Promise<void> {
  await requireAdminFresh();
  const set: Partial<WorkshopRow> = {};
  if (patch.title !== undefined) {
    const t = clip(patch.title, 200);
    if (!t) throw new Error("Please give the workshop a title.");
    set.title = t;
  }
  if (patch.description !== undefined) set.description = clip(patch.description, 4000);
  if (patch.status !== undefined) set.status = patch.status === "interest" ? "interest" : "planned";
  if (patch.dateLabel !== undefined) set.dateLabel = clip(patch.dateLabel, 120) || null;
  if (patch.interested !== undefined) set.interested = patch.interested ?? null;
  if (patch.image !== undefined) set.image = clip(patch.image, 2000);
  if (patch.timeLabel !== undefined) set.timeLabel = clip(patch.timeLabel, 120) || null;
  if (patch.fee !== undefined) set.fee = clip(patch.fee, 200) || null;
  if (patch.published !== undefined) set.published = !!patch.published;
  if (patch.zh !== undefined) set.zh = sanitizeZh(patch.zh, WORKSHOP_ZH_FIELDS);
  if (Object.keys(set).length === 0) return;
  set.updatedAt = new Date();
  await db.update(workshopsTable).set(set).where(eq(workshopsTable.id, id));
  refresh();
}

/** Persist a new display order (the homepage shows the first N published). */
export async function reorderWorkshops(ids: string[]): Promise<void> {
  await requireAdminFresh();
  if (!Array.isArray(ids)) return;
  for (let i = 0; i < ids.length; i++) {
    await db.update(workshopsTable).set({ sortOrder: i }).where(eq(workshopsTable.id, String(ids[i])));
  }
  refresh();
}

export async function deleteWorkshop(id: string): Promise<void> {
  await requireAdminFresh();
  await db.delete(workshopsTable).where(eq(workshopsTable.id, id));
  refresh();
}

// -------- Settings (homepage cap) --------
export async function getWorkshopSettings(): Promise<WorkshopSettings> {
  try {
    const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, WORKSHOP_SETTINGS_KEY));
    return { ...DEFAULT_WORKSHOP_SETTINGS, ...((row?.data as Partial<WorkshopSettings>) ?? {}) };
  } catch {
    return DEFAULT_WORKSHOP_SETTINGS;
  }
}

export async function saveWorkshopSettings(s: WorkshopSettings): Promise<void> {
  await requireAdminFresh();
  const homeLimit = Math.max(1, Math.min(12, Math.round(Number(s.homeLimit) || DEFAULT_WORKSHOP_SETTINGS.homeLimit)));
  const data = { homeLimit };
  await db.insert(siteConfig).values({ key: WORKSHOP_SETTINGS_KEY, data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteConfig.key, set: { data, updatedAt: new Date() } });
  refresh();
}
