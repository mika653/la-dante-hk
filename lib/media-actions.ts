"use server";
// Media Library — list/record/delete images & documents stored in Vercel Blob.
// Uploads happen client-side straight to Blob (see /api/media/upload) so large
// PDFs work; recordMedia() then writes the DB row. Every action is gated to a
// signed-in owner or manager via requireAdminFresh.

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { del } from "@vercel/blob";
import { db } from "@/lib/db";
import { media, type MediaRow } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";

export type MediaSaveState = { ok?: boolean; error?: string; url?: string };

export async function listMedia(): Promise<MediaRow[]> {
  await requireAdminFresh();
  return db.select().from(media).orderBy(desc(media.createdAt));
}

// Write the DB row after a successful client-side Blob upload.
export async function recordMedia(input: {
  url: string;
  pathname: string;
  filename: string;
  alt?: string;
  contentType: string;
  size: number;
}): Promise<MediaSaveState> {
  let user;
  try {
    user = await requireAdminFresh();
  } catch {
    return { error: "You need to be signed in as an owner or manager to upload." };
  }
  if (!input?.url || !input?.pathname) return { error: "Missing upload details." };

  try {
    await db.insert(media).values({
      url: input.url,
      pathname: input.pathname,
      filename: (input.filename || "file").slice(0, 300),
      alt: (input.alt || "").trim().slice(0, 300),
      contentType: input.contentType || "",
      size: input.size || 0,
      uploadedBy: user.name || user.email || "",
    });
  } catch {
    return { error: "Couldn't save that file. Please try again." };
  }
  revalidatePath("/admin/media");
  return { ok: true, url: input.url };
}

export async function updateMediaAlt(id: string, alt: string): Promise<MediaSaveState> {
  try {
    await requireAdminFresh();
  } catch {
    return { error: "Not authorised" };
  }
  await db.update(media).set({ alt: alt.trim().slice(0, 300) }).where(eq(media.id, id));
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function deleteMedia(id: string): Promise<MediaSaveState> {
  try {
    await requireAdminFresh();
  } catch {
    return { error: "Not authorised" };
  }
  const [row] = await db.select().from(media).where(eq(media.id, id));
  if (row) {
    try {
      await del(row.url); // best-effort: remove from Blob storage
    } catch {
      /* if the blob is already gone, still drop the DB row */
    }
    await db.delete(media).where(eq(media.id, id));
  }
  revalidatePath("/admin/media");
  return { ok: true };
}
