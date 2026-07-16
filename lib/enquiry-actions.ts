"use server";
// Enquiry form handling.
//
// submitEnquiry is public — anyone can send one, it's a contact form. It writes
// only on submit (never on page view), so it costs the database nothing at rest.
// The admin reads/updates are role-gated.

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { enquiries, type EnquiryRow } from "@/lib/db/schema";
import { getSession, isAdmin } from "@/lib/auth";

export type EnquiryType = "course" | "private" | "plida" | "workshop" | "trial" | "general";
const TYPES: EnquiryType[] = ["course", "private", "plida", "workshop", "trial", "general"];
const STATUSES = ["new", "contacted", "closed"] as const;
export type EnquiryStatus = (typeof STATUSES)[number];

export type SubmitState = { ok?: boolean; error?: string };

const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

export async function submitEnquiry(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  // Honeypot: a hidden field real people never fill. Bots that fill everything
  // trip it. We answer 200-OK so the bot thinks it worked and doesn't retry.
  if (String(formData.get("company") ?? "").trim() !== "") return { ok: true };

  const rawType = String(formData.get("type") ?? "general");
  const type = (TYPES.includes(rawType as EnquiryType) ? rawType : "general") as EnquiryType;

  const name = clip(formData.get("name"), 120);
  const email = clip(formData.get("email"), 200);
  const phone = clip(formData.get("phone"), 40);
  const level = clip(formData.get("level"), 60);
  const timing = clip(formData.get("timing"), 200);
  const message = clip(formData.get("message"), 2000);
  const sourcePath = clip(formData.get("sourcePath"), 200);

  if (name.length < 2) return { error: "Please tell us your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "That email doesn't look right." };

  try {
    await db.insert(enquiries).values({
      type, name, email,
      phone: phone || null,
      level: level || null,
      timing: timing || null,
      message: message || null,
      sourcePath: sourcePath || null,
    });
  } catch {
    return { error: "Something went wrong sending that — please try again, or email dantealighieri@ladante.cc." };
  }

  revalidatePath("/admin/enquiries");
  return { ok: true };
}

// -------- admin --------

export async function listEnquiries(): Promise<EnquiryRow[]> {
  const s = await getSession();
  if (!s || !isAdmin(s.role)) throw new Error("Not authorised");
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
}

export async function setEnquiryStatus(id: string, status: EnquiryStatus): Promise<{ ok: boolean; error?: string }> {
  const s = await getSession();
  if (!s || !isAdmin(s.role)) return { ok: false, error: "Not authorised" };
  if (!STATUSES.includes(status)) return { ok: false, error: "Unknown status" };
  await db.update(enquiries).set({ status }).where(eq(enquiries.id, id));
  revalidatePath("/admin/enquiries");
  return { ok: true };
}
