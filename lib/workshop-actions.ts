"use server";
// Workshops — role-gated CRUD. Previously double-disconnected: the public pages
// read a static seed while admin edits went to localStorage, so admin changes
// showed nowhere. Now there's one shared source.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { workshopsTable, type WorkshopRow } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import type { Workshop } from "@/lib/data";

const rowToWorkshop = (r: WorkshopRow): Workshop => ({
  id: r.id, title: r.title, description: r.description,
  status: r.status as Workshop["status"],
  dateLabel: r.dateLabel ?? undefined,
  interested: r.interested ?? undefined,
  image: r.image,
});

function refresh() {
  revalidatePath("/api/workshops");
  revalidatePath("/", "layout");
  revalidatePath("/workshops");
}

export async function listAllWorkshops(): Promise<Workshop[]> {
  await requireAdminFresh();
  const rows = await db.select().from(workshopsTable).orderBy(workshopsTable.updatedAt);
  return rows.map(rowToWorkshop);
}

export async function createWorkshop(w: Omit<Workshop, "id">): Promise<Workshop> {
  await requireAdminFresh();
  const id = `w-${Date.now()}`;
  await db.insert(workshopsTable).values({
    id, title: w.title, description: w.description, status: w.status,
    dateLabel: w.dateLabel ?? null, interested: w.interested ?? null, image: w.image,
  });
  refresh();
  return { ...w, id };
}

export async function patchWorkshop(id: string, patch: Partial<Workshop>): Promise<void> {
  await requireAdminFresh();
  const set: Partial<WorkshopRow> = {};
  if (patch.title !== undefined) set.title = String(patch.title);
  if (patch.description !== undefined) set.description = String(patch.description);
  if (patch.status !== undefined) set.status = patch.status;
  if (patch.dateLabel !== undefined) set.dateLabel = patch.dateLabel || null;
  if (patch.interested !== undefined) set.interested = patch.interested ?? null;
  if (patch.image !== undefined) set.image = String(patch.image);
  if (Object.keys(set).length === 0) return;
  set.updatedAt = new Date();
  await db.update(workshopsTable).set(set).where(eq(workshopsTable.id, id));
  refresh();
}

export async function deleteWorkshop(id: string): Promise<void> {
  await requireAdminFresh();
  await db.delete(workshopsTable).where(eq(workshopsTable.id, id));
  refresh();
}
