"use client";
import { useEffect, useState } from "react";
import { seedReviews, type Review } from "@/lib/reviews-shared";
import { listAllReviews, createReview, patchReview, deleteReview } from "@/lib/review-actions";

export type { Review };

// -------- admin store (database-backed via role-gated server actions) --------
export async function getReviews(): Promise<Review[]> { return listAllReviews(); }
export async function addReview(r: Omit<Review, "id">): Promise<Review> { return createReview(r); }
export async function updateReview(id: string, patch: Partial<Review>): Promise<void> { return patchReview(id, patch); }
export async function removeReview(id: string): Promise<void> { return deleteReview(id); }

// -------- public read hook --------
// Reads published reviews from /api/reviews so an admin's edits show to everyone.
export function useReviews(publishedOnly = false): Review[] {
  const [list, setList] = useState<Review[]>(publishedOnly ? seedReviews.filter((r) => r.published) : seedReviews);
  useEffect(() => {
    let alive = true;
    fetch("/api/reviews", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (alive && data && Array.isArray(data.reviews) && data.reviews.length > 0) setList(data.reviews as Review[]); })
      .catch(() => { /* keep the seed */ });
    return () => { alive = false; };
  }, []);
  return publishedOnly ? list.filter((r) => r.published) : list;
}
