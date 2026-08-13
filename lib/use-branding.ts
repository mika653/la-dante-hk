"use client";
import { useEffect, useState } from "react";
import { defaultBranding, type Branding } from "@/lib/branding-shared";

// Module-level cache so the logo isn't refetched for every Wordmark on the page.
let cached: Branding | null = null;

export function useBranding(): Branding {
  const [branding, setBranding] = useState<Branding>(cached ?? defaultBranding);
  useEffect(() => {
    if (cached) return;
    fetch("/api/branding")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) { cached = d as Branding; setBranding(cached); } })
      .catch(() => { /* keep defaults */ });
  }, []);
  return branding;
}
