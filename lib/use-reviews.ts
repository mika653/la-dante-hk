"use client";
import { useEffect, useState } from "react";
import { testimonials as seedReviews } from "@/lib/data";

export type Review = {
  id: string;
  quote: string;
  name: string;
  level: string;
  year: number;
  published: boolean;
};

const KEY = "ladante-reviews";

function withIds(list: { quote: string; name: string; level: string; year: number }[]): Review[] {
  return list.map((r, i) => ({ ...r, id: `seed-r-${i}`, published: true }));
}

function readAll(): Review[] {
  if (typeof window === "undefined") return withIds(seedReviews);
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return withIds(seedReviews);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : withIds(seedReviews);
  } catch { return withIds(seedReviews); }
}
function writeAll(list: Review[]) {
  if (typeof window !== "undefined") { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} }
}

export function getReviews(): Review[] { return readAll(); }
export function addReview(r: Omit<Review, "id">): Review {
  const review: Review = { ...r, id: `r-${Date.now()}` };
  writeAll([review, ...readAll()]);
  return review;
}
export function updateReview(id: string, patch: Partial<Review>) {
  writeAll(readAll().map((r) => (r.id === id ? { ...r, ...patch } : r)));
}
export function removeReview(id: string) {
  writeAll(readAll().filter((r) => r.id !== id));
}
export function resetReviews() { if (typeof window !== "undefined") localStorage.removeItem(KEY); }

export function useReviews(publishedOnly = false): Review[] {
  const [list, setList] = useState<Review[]>(withIds(seedReviews));
  useEffect(() => {
    const load = () => setList(readAll());
    load();
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) load(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return publishedOnly ? list.filter((r) => r.published) : list;
}
