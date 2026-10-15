"use client";
import { useEffect, useState } from "react";
import { questionBank, type Question } from "@/lib/placement-questions";

// Public hook: loads the placement question bank from /api/placement so an
// admin's edits reach every visitor. Starts from the bundled seed for an instant
// start, then swaps in the live bank; keeps the seed if the fetch fails or the
// stored bank is empty.
export function usePlacementQuestions(): Question[] {
  const [bank, setBank] = useState<Question[]>(questionBank);
  useEffect(() => {
    let alive = true;
    fetch("/api/placement", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data && Array.isArray(data.questions) && data.questions.length > 0) {
          setBank(data.questions as Question[]);
        }
      })
      .catch(() => { /* keep the seed */ });
    return () => { alive = false; };
  }, []);
  return bank;
}
