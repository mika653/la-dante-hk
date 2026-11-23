"use client";
// Public hook: the admin-chosen icons. Starts from the defaults (so the first
// paint matches what shipped), then swaps in the saved choices. One request is
// shared by every component on the page.
import { useEffect, useState } from "react";
import { defaultIconChoices, normaliseIconChoices, type IconChoices } from "@/lib/icon-choices-shared";

let pending: Promise<IconChoices> | null = null;

function load(): Promise<IconChoices> {
  if (!pending) {
    pending = fetch("/api/icon-choices")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => normaliseIconChoices(data?.choices))
      .catch(() => { pending = null; return defaultIconChoices; });
  }
  return pending;
}

export function useIconChoices(): IconChoices {
  const [choices, setChoices] = useState<IconChoices>(defaultIconChoices);
  useEffect(() => {
    let alive = true;
    load().then((c) => { if (alive) setChoices(c); });
    return () => { alive = false; };
  }, []);
  return choices;
}

/** Drop the cached choices (the admin editor calls this after saving). */
export function resetIconChoicesCache() { pending = null; }
