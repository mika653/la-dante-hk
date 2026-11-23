"use server";
// Event registration — the in-house replacement for the Google Form.
// registerForEvent is public (anyone can sign up); listRegistrations is admin.

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { eventRegistrations, events, type EventRegistrationRow } from "@/lib/db/schema";
import { requireAdminFresh, requireOwnerFresh } from "@/lib/auth-guards";
import { activeRegFields, sanitizeCustomQuestions, CUSTOM_ANSWER_PREFIX, OTHER_OPTION, type CustomQuestion } from "@/lib/event-registration";

export type RegisterState = { ok?: boolean; error?: string };

const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

export async function registerForEvent(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  // Honeypot — bots fill every field, people can't see this one.
  if (String(formData.get("company") ?? "").trim() !== "") return { ok: true };

  const eventId = clip(formData.get("eventId"), 80);
  const eventTitle = clip(formData.get("eventTitle"), 200);
  const eventDate = clip(formData.get("eventDate"), 10) || null;
  const firstName = clip(formData.get("firstName"), 80);
  const surname = clip(formData.get("surname"), 80);
  const email = clip(formData.get("email"), 200);
  const phone = clip(formData.get("phone"), 40);
  let source = clip(formData.get("source"), 120);
  const sourceOther = clip(formData.get("sourceOther"), 120);
  if (source === "Other") source = sourceOther || "Other";
  const memberRaw = clip(formData.get("member"), 10);
  const newsletter = String(formData.get("newsletter") ?? "") === "yes";
  const consent = String(formData.get("consent") ?? "") === "yes";
  const name = [firstName, surname].filter(Boolean).join(" ").trim();

  if (!eventId || !eventTitle) return { error: "Something's off with this event — please refresh and try again." };
  if (name.length < 2) return { error: "Please tell us your first name and surname." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "That email doesn't look right." };

  // Trusted check of which questions this event requires (don't rely on the form).
  let keys = activeRegFields(undefined);
  let custom: CustomQuestion[] = [];
  try {
    const [ev] = await db.select({ regFields: events.regFields, customQuestions: events.customQuestions }).from(events).where(eq(events.id, eventId));
    keys = activeRegFields(ev?.regFields);
    custom = sanitizeCustomQuestions(ev?.customQuestions);
  } catch { /* fall back to the default set */ }
  const has = (k: string) => keys.includes(k as never);
  if (has("phone") && phone.length < 6) return { error: "Please give us your phone number." };
  if (has("source") && !source) return { error: "Please tell us how you found out about the event." };
  if (has("source") && source === "Other") return { error: "Please tell us where you heard about the event (Other)." };
  if (has("member") && !/^(yes|no)$/i.test(memberRaw)) return { error: "Please tell us if you're a member." };
  if (has("consent") && !consent) return { error: "Please tick the privacy consent to register." };

  // Custom questions — read by question id, stored under the question text.
  const customAnswers: Record<string, string> = {};
  for (const q of custom) {
    let v = clip(formData.get(`cq_${q.id}`), q.type === "long" ? 2000 : 300);
    if (q.type === "yesno") v = /^yes$/i.test(v) ? "Yes" : /^no$/i.test(v) ? "No" : "";
    if (q.type === "choice") {
      // Only accept a listed option; "Other" takes the typed text instead.
      if (q.allowOther && v === OTHER_OPTION) {
        const other = clip(formData.get(`cq_${q.id}_other`), 200);
        if (!other) return { error: `Please specify your answer to: "${q.label}"` };
        v = `Other: ${other}`;
      } else if (!(q.options ?? []).includes(v)) {
        v = "";
      }
    }
    if (q.required && !v) return { error: `Please answer: "${q.label}"` };
    if (v) customAnswers[CUSTOM_ANSWER_PREFIX + q.label] = v;
  }

  const answers: Record<string, string> = {};
  if (has("firstName")) answers.firstName = firstName;
  if (has("surname")) answers.surname = surname;
  if (has("source") && source) answers.source = source;
  if (has("member") && memberRaw) answers.member = /^yes$/i.test(memberRaw) ? "Yes" : "No";
  if (has("newsletter")) answers.newsletter = newsletter ? "Yes" : "No";
  if (has("consent")) answers.consent = consent ? "Yes" : "No";
  Object.assign(answers, customAnswers);

  try {
    await db.insert(eventRegistrations).values({
      eventId, eventTitle, eventDate,
      name, email,
      phone: phone || null,
      answers,
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
