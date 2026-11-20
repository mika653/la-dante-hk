"use client";
// Loads the editable Special Offers content once for the public page. Starts
// from the built-in defaults (so the first paint matches what shipped), then
// swaps in the saved content if the office has edited it.
import { useEffect, useState } from "react";
import { getOffers } from "@/lib/offers-actions";
import { defaultOffers, type OffersContent } from "@/lib/offers-shared";

export function useOffers(): OffersContent {
  const [offers, setOffers] = useState<OffersContent>(defaultOffers);
  useEffect(() => { getOffers().then(setOffers).catch(() => { /* keep defaults */ }); }, []);
  return offers;
}
