"use server";
// Media Library — upload/list/delete images stored in Vercel Blob.
// Every action is gated to a signed-in owner or manager via requireAdminFresh.
// The blob store is public (images render on the site); the DB row lets staff
// browse and reuse them and gives del() the pathname it needs to remove them.

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";
import { media, type MediaRow } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";

export type MediaSaveState = { ok?: boolean; error?: string; url?: string };

const MAX_BYTES = 10_000_000; // 10 MB
const OK_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "image/avif"];

export async function listMedia(): Promise<MediaRow[]> {
  await requireAdminFresh();
  return db.select().from(media).orderBy(desc(media.createdAt));
}

export async function uploadMedia(_prev: MediaSaveState, formData: FormData): Promise<MediaSaveState> {
  let user;
  try {
    user = await requireAdminFresh();
  } catch {
    return { error: "You need to be signed in as an owner or manager to upload." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image to upload." };
  if (!OK_TYPES.includes(file.type)) return { error: "Only images are allowed (PNG, JPG, WEBP, GIF, SVG, AVIF)." };
  if (file.size > MAX_BYTES) return { error: "That image is too large — keep it under 10 MB." };

  const alt = String(formData.get("alt") ?? "").trim().slice(0, 300);

  let url: string;
  try {
    // addRandomSuffix keeps two files with the same name from colliding.
    const blob = await put(file.name, file, { access: "public", addRandomSuffix: true });
    url = blob.url;
    await db.insert(media).values({
      url: blob.url,
      pathname: blob.pathname,
      filename: file.name.slice(0, 300),
      alt,
      contentType: file.type,
      size: file.size,
      uploadedBy: user.name || user.email || "",
    });
  } catch {
    return { error: "Upload failed — please try again." };
  }

  revalidatePath("/admin/media");
  return { ok: true, url };
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
