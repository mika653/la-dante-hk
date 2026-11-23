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
import { requireAdminFresh, requireOwnerFresh } from "@/lib/auth-guards";
import { readSmtpStored, sendMail } from "@/lib/mailer";

export type EnquiryType = "course" | "private" | "plida" | "workshop" | "trial" | "placement" | "newsletter" | "general" | "special" | "training" | "event";
const TYPES: EnquiryType[] = ["course", "private", "plida", "workshop", "trial", "placement", "newsletter", "general", "special", "training", "event"];
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

  // Placement test finished → tell the office straight away (best effort; a
  // missing SMTP setup or a send failure never affects the visitor).
  if (type === "placement") {
    await notifyPlacement({ name, email, phone, level, message }).catch(() => {});
  }
  return { ok: true };
}

const escHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function notifyPlacement(p: { name: string; email: string; phone: string; level: string; message: string }) {
  const smtp = await readSmtpStored();
  const to = (smtp?.notifyTo ?? "")
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter((s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s));
  if (to.length === 0) return;
  const when = new Date().toLocaleString("en-GB", { timeZone: "Asia/Hong_Kong", dateStyle: "medium", timeStyle: "short" });
  const rows: [string, string][] = [
    ["Name", p.name], ["Email", p.email], ["Phone", p.phone || "—"],
    ["Suggested level", p.level || "—"], ["Result", p.message || "—"], ["Completed", `${when} (HKT)`],
  ];
  await sendMail({
    to: to.join(", "),
    subject: `Placement test completed: ${p.name}${p.level ? ` (${p.level})` : ""}`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n") + "\n\nAlso saved in Admin → Enquiries.",
    html:
      `<p>Someone just finished the placement test on the website.</p>` +
      `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
      rows.map(([k, v]) => `<tr><td style="color:#5f5e5e">${escHtml(k)}</td><td><strong>${escHtml(v)}</strong></td></tr>`).join("") +
      `</table><p style="color:#5f5e5e;font-size:13px">Also saved in Admin → Enquiries.</p>`,
  });
}

// -------- admin --------

export async function listEnquiries(): Promise<EnquiryRow[]> {
  await requireAdminFresh();
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
}

export async function setEnquiryStatus(id: string, status: EnquiryStatus): Promise<{ ok: boolean; error?: string }> {
  try { await requireAdminFresh(); } catch { return { ok: false, error: "Not authorised" }; }
  if (!STATUSES.includes(status)) return { ok: false, error: "Unknown status" };
  await db.update(enquiries).set({ status }).where(eq(enquiries.id, id));
  revalidatePath("/admin/enquiries");
  return { ok: true };
}

// Permanent deletion — for honouring a data-erasure request (PDPO). Owner only,
// since it destroys a record rather than just closing it.
export async function deleteEnquiry(id: string): Promise<{ ok: boolean; error?: string }> {
  try { await requireOwnerFresh(); } catch { return { ok: false, error: "Only the owner can delete an enquiry." }; }
  await db.delete(enquiries).where(eq(enquiries.id, id));
  revalidatePath("/admin/enquiries");
  return { ok: true };
}
