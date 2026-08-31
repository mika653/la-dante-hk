"use server";
// Reads + writes for the shared closures list (public holidays / school breaks /
// PLIDA exam days). Reads are open (the dates aren't sensitive and the scheduler
// needs them); writes are gated to a signed-in owner or manager, checked here on
// the server, exactly like the course writes.

import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { closures } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import { HK_HOLIDAYS_SEED, PLIDA_DATES_SEED, type Holiday, type PlidaDate } from "@/lib/closures-shared";

export type Closures = { holidays: Holiday[]; plida: PlidaDate[] };

/** The whole shared list, split into holidays/closures and PLIDA exam days. */
export async function getClosures(): Promise<Closures> {
  const rows = await db.select().from(closures).orderBy(asc(closures.date));
  const holidays: Holiday[] = rows
    .filter((r) => r.kind === "holiday")
    .map((r) => ({ id: r.id, date: r.date, name: r.name, ...(r.endDate ? { endDate: r.endDate } : {}) }));
  const plida: PlidaDate[] = rows
    .filter((r) => r.kind === "plida")
    .map((r) => ({ id: r.id, date: r.date, name: r.name }));
  return { holidays, plida };
}

/** Add a holiday/closure (optional endDate for a multi-day break). Admin only. */
export async function addHoliday(input: { date: string; endDate?: string; name: string }): Promise<Closures> {
  await requireAdminFresh();
  const date = String(input.date);
  const name = String(input.name).trim();
  if (!date || !name) throw new Error("A date and a name are required.");
  const endDate = input.endDate && input.endDate >= date ? input.endDate : null;
  await db.insert(closures).values({ kind: "holiday", date, endDate, name });
  return getClosures();
}

/** Add a PLIDA exam day. Admin only. */
export async function addPlidaDate(input: { date: string; name: string }): Promise<Closures> {
  await requireAdminFresh();
  const date = String(input.date);
  const name = String(input.name).trim();
  if (!date || !name) throw new Error("A date and a name are required.");
  await db.insert(closures).values({ kind: "plida", date, name });
  return getClosures();
}

/** Remove one entry (holiday or PLIDA) by id. Admin only. */
export async function removeClosure(id: string): Promise<Closures> {
  await requireAdminFresh();
  await db.delete(closures).where(eq(closures.id, id));
  return getClosures();
}

/** Replace all holidays with the built-in Hong Kong list. Admin only. */
export async function resetHolidays(): Promise<Closures> {
  await requireAdminFresh();
  await db.delete(closures).where(eq(closures.kind, "holiday"));
  await db.insert(closures).values(HK_HOLIDAYS_SEED.map((h) => ({ kind: "holiday", date: h.date, endDate: h.endDate ?? null, name: h.name })));
  return getClosures();
}

/** Replace all PLIDA dates with the default sittings. Admin only. */
export async function resetPlidaDates(): Promise<Closures> {
  await requireAdminFresh();
  await db.delete(closures).where(eq(closures.kind, "plida"));
  await db.insert(closures).values(PLIDA_DATES_SEED.map((p) => ({ kind: "plida", date: p.date, name: p.name })));
  return getClosures();
}
