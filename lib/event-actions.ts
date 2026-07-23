"use server";
// Event registration — the in-house replacement for the Google Form.
// registerForEvent is public (anyone can sign up); listRegistrations is admin.

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { eventRegistrations, type EventRegistrationRow } from "@/lib/db/schema";
import { requireAdminFresh, requireOwnerFresh } from "@/lib/auth-guards";
import { AGE_GROUPS } from "@/lib/event-constants";

export type RegisterState = { ok?: boolean; error?: string };

const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

export async function registerForEvent(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  // Honeypot — bots fill every field, people can't see this one.
  if (String(formData.get("company") ?? "").trim() !== "") return { ok: true };

  const eventId = clip(formData.get("eventId"), 80);
  const eventTitle = clip(formData.get("eventTitle"), 200);
  const eventDate = clip(formData.get("eventDate"), 10) || null;
  const name = clip(formData.get("name"), 120);
  const email = clip(formData.get("email"), 200);
  const phone = clip(formData.get("phone"), 40);
  const ageRaw = clip(formData.get("ageGroup"), 20);
  const ageGroup = (AGE_GROUPS as readonly string[]).includes(ageRaw) ? ageRaw : null;
  const isStudent = String(formData.get("isStudent") ?? "") === "yes";

  if (!eventId || !eventTitle) return { error: "Something's off with this event — please refresh and try again." };
  if (name.length < 2) return { error: "Please tell us your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "That email doesn't look right." };

  try {
    await db.insert(eventRegistrations).values({
      eventId, eventTitle, eventDate,
      name, email,
      phone: phone || null,
      ageGroup,
      isStudent,
    });
  } catch {
    return { error: "We couldn't save that — please try again, or email dantealighieri@ladante.cc." };
  }

  revalidatePath("/admin/registrations");
  return { ok: true };
}

export async function listRegistrations(): Promise<EventRegistrationRow[]> {
  await requireAdminFresh();
  return db.select().from(eventRegistrations).orderBy(desc(eventRegistrations.createdAt));
}

// Permanent deletion — for a data-erasure request (PDPO). Owner only.
export async function deleteRegistration(id: string): Promise<{ ok: boolean; error?: string }> {
  try { await requireOwnerFresh(); } catch { return { ok: false, error: "Only the owner can delete a registration." }; }
  await db.delete(eventRegistrations).where(eq(eventRegistrations.id, id));
  revalidatePath("/admin/registrations");
  return { ok: true };
}
