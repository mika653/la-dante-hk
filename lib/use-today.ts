"use client";
import { useSyncExternalStore } from "react";
import { todayISO } from "@/lib/course-schedule";

// Today's date (ISO) as seen in the visitor's browser. Pages are prerendered, so
// a date computed during server render would freeze at build time; this keeps
// "next exam" style highlights current without a rebuild. Returns null on the
// server / during hydration, then the real date.
const noopSubscribe = () => () => {};
export function useToday(): string | null {
  return useSyncExternalStore(noopSubscribe, todayISO, () => null);
}
