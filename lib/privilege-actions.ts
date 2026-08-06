"use server";
// Member privileges — the partner directory shown on /membership.
//
// The public read (listActivePrivileges) is used to render the membership page and
// never touches auth; it degrades to [] if the table/DB isn't there yet so the page
// still renders. Every write is role-gated to a signed-in owner or manager.

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { privileges, type PrivilegeRow, type Social } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";

const clip = (v: FormDataEntryValue | null | undefined, max: number) =>
  String(v ?? "").trim().slice(0, max);

// Logos are stored inline as data URLs; a small partner logo is well under this.
const MAX_LOGO_CHARS = 1_500_000; // ~1 MB image once base64-encoded

// Parse the JSON the admin form serialises for the social-links list. Keep only
// well-formed { platform, url } pairs so a malformed payload can never poison a row.
function parseSocials(raw: FormDataEntryValue | null): Social[] {
  try {
    const arr = JSON.parse(String(raw ?? "[]"));
    if (!Array.isArray(arr)) return [];
    return arr
      .map((s) => ({ platform: clip(s?.platform, 40), url: clip(s?.url, 300) }))
      .filter((s) => s.platform && s.url)
      .slice(0, 12);
  } catch {
    return [];
  }
}

// -------- public (site) --------

export async function listActivePrivileges(): Promise<PrivilegeRow[]> {
  try {
    return await db
      .select()
      .from(privileges)
      .where(eq(privileges.active, true))
      .orderBy(asc(privileges.sortOrder), asc(privileges.brand));
  } catch {
    // Table not migrated yet / DB unreachable — let the page fall back gracefully.
    return [];
  }
}

// -------- admin --------

export async function listPrivileges(): Promise<PrivilegeRow[]> {
  await requireAdminFresh();
  return db.select().from(privileges).orderBy(asc(privileges.sortOrder), asc(privileges.brand));
}

export type SaveState = { ok?: boolean; error?: string };

export async function createPrivilege(_prev: SaveState, formData: FormData): Promise<SaveState> {
  try { await requireAdminFresh(); }
  catch { return { error: "You need to be signed in as an owner or manager to add a privilege." }; }

  const brand = clip(formData.get("brand"), 160);
  const category = clip(formData.get("category"), 60) || "Dining";
  const discount = clip(formData.get("discount"), 400);

  if (brand.length < 2) return { error: "Please enter the brand name." };
  if (discount.length < 2) return { error: "Please enter the discount details." };

  try {
    await db.insert(privileges).values({
      brand,
      category,
      discount,
      note: clip(formData.get("note"), 400) || null,
      logo: clip(formData.get("logo"), MAX_LOGO_CHARS) || null,
      address: clip(formData.get("address"), 300) || null,
      phone: clip(formData.get("phone"), 60) || null,
      website: clip(formData.get("website"), 300) || null,
      socials: parseSocials(formData.get("socials")),
    });
  } catch {
    return { error: "Couldn't save that. If this is the first privilege, run `npm run db:push` to create the table." };
  }

  revalidatePath("/admin/privileges");
  revalidatePath("/membership");
  return { ok: true };
}

export async function deletePrivilege(id: string): Promise<SaveState> {
  try { await requireAdminFresh(); } catch { return { error: "Not authorised" }; }
  await db.delete(privileges).where(eq(privileges.id, id));
  revalidatePath("/admin/privileges");
  revalidatePath("/membership");
  return { ok: true };
}
