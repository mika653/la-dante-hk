"use client";
import { useEffect, useState } from "react";
import { workshops as seedWorkshops, type Workshop } from "@/lib/data";
import { listAllWorkshops, createWorkshop, patchWorkshop, deleteWorkshop } from "@/lib/workshop-actions";

export type { Workshop };

// -------- admin store (database-backed via role-gated server actions) --------
export async function getWorkshops(): Promise<Workshop[]> { return listAllWorkshops(); }
export async function addWorkshop(w: Omit<Workshop, "id">): Promise<Workshop> { return createWorkshop(w); }
export async function updateWorkshop(id: string, patch: Partial<Workshop>): Promise<void> { return patchWorkshop(id, patch); }
export async function removeWorkshop(id: string): Promise<void> { return deleteWorkshop(id); }

// -------- public read hook --------
// Reads workshops from /api/workshops so an admin's edits show to everyone.
export function useWorkshops(): Workshop[] {
  const [list, setList] = useState<Workshop[]>(seedWorkshops);
  useEffect(() => {
    let alive = true;
    fetch("/api/workshops", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (alive && data && Array.isArray(data.workshops) && data.workshops.length > 0) setList(data.workshops as Workshop[]); })
      .catch(() => { /* keep the seed */ });
    return () => { alive = false; };
  }, []);
  return list;
}
