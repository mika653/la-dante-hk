"use server";
// Reviews (testimonials) — role-gated CRUD, so an admin's edits show to everyone.

import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { reviews, type ReviewRow } from "@/lib/db/schema";
import { requireAdminFresh } from "@/lib/auth-guards";
import type { Review } from "@/lib/reviews-shared";

const rowToReview = (r: ReviewRow): Review => ({
  id: r.id, quote: r.quote, name: r.name, level: r.level, year: r.year, published: r.published,
});

function refresh() {
  revalidatePath("/api/reviews");
  revalidatePath("/", "layout");
}

export async function listAllReviews(): Promise<Review[]> {
  await requireAdminFresh();
  const rows = await db.select().from(reviews).orderBy(desc(reviews.year));
  return rows.map(rowToReview);
}

export async function createReview(r: Omit<Review, "id">): Promise<Review> {
  await requireAdminFresh();
  const id = `r-${Date.now()}`;
  await db.insert(reviews).values({
    id, quote: r.quote, name: r.name, level: r.level, year: r.year, published: r.published,
  });
  refresh();
  return { ...r, id };
}

export async function patchReview(id: string, patch: Partial<Review>): Promise<void> {
  await requireAdminFresh();
  const set: Partial<ReviewRow> = {};
  if (patch.quote !== undefined) set.quote = String(patch.quote);
  if (patch.name !== undefined) set.name = String(patch.name);
  if (patch.level !== undefined) set.level = String(patch.level);
  if (patch.year !== undefined) set.year = Math.trunc(Number(patch.year) || 0);
  if (patch.published !== undefined) set.published = !!patch.published;
  if (Object.keys(set).length === 0) return;
  set.updatedAt = new Date();
  await db.update(reviews).set(set).where(eq(reviews.id, id));
  refresh();
}

export async function deleteReview(id: string): Promise<void> {
  await requireAdminFresh();
  await db.delete(reviews).where(eq(reviews.id, id));
  refresh();
}
