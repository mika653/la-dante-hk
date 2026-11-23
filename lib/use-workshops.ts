"use client";
import { useEffect, useState } from "react";
import { workshops as seedWorkshops, type Workshop } from "@/lib/data";
import { listAllWorkshops, createWorkshop, patchWorkshop, deleteWorkshop, reorderWorkshops, getWorkshopSettings, saveWorkshopSettings } from "@/lib/workshop-actions";
import { DEFAULT_WORKSHOP_SETTINGS, type WorkshopSettings } from "@/lib/workshop-settings";

export type { Workshop };

// -------- admin store (database-backed via role-gated server actions) --------
export async function getWorkshops(): Promise<Workshop[]> { return listAllWorkshops(); }
export async function addWorkshop(w: Omit<Workshop, "id">): Promise<Workshop> { return createWorkshop(w); }
export async function updateWorkshop(id: string, patch: Partial<Workshop>): Promise<void> { return patchWorkshop(id, patch); }
export async function removeWorkshop(id: string): Promise<void> { return deleteWorkshop(id); }
export async function setWorkshopOrder(ids: string[]): Promise<void> { return reorderWorkshops(ids); }
export async function loadWorkshopSettings(): Promise<WorkshopSettings> { return getWorkshopSettings(); }
export async function storeWorkshopSettings(s: WorkshopSettings): Promise<void> { return saveWorkshopSettings(s); }

// -------- public read hook --------
// Reads workshops from /api/workshops so an admin's edits show to everyone,
// plus the homepage cap set in the dashboard. Starts from the bundled seed.
export function useWorkshopsFeed(): { workshops: Workshop[]; homeLimit: number } {
  const [feed, setFeed] = useState<{ workshops: Workshop[]; homeLimit: number }>({
    workshops: seedWorkshops,
    homeLimit: DEFAULT_WORKSHOP_SETTINGS.homeLimit,
  });
  useEffect(() => {
    let alive = true;
    fetch("/api/workshops", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive || !data || !Array.isArray(data.workshops)) return;
        setFeed({
          workshops: data.workshops as Workshop[],
          homeLimit: Number(data.homeLimit) > 0 ? Number(data.homeLimit) : DEFAULT_WORKSHOP_SETTINGS.homeLimit,
        });
      })
      .catch(() => { /* keep the seed */ });
    return () => { alive = false; };
  }, []);
  return feed;
}

export function useWorkshops(): Workshop[] {
  return useWorkshopsFeed().workshops;
}
