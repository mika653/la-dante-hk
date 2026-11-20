"use client";
// Loads the shared membership/sponsorship prices once for the public components.
// Starts from the built-in defaults (so the first paint matches what shipped),
// then swaps in the saved values if the office has changed any.
import { useEffect, useState } from "react";
import { getPricing } from "@/lib/pricing-actions";
import { defaultPricing, type Pricing } from "@/lib/pricing-shared";

export function usePricing(): Pricing {
  const [pricing, setPricing] = useState<Pricing>(defaultPricing);
  useEffect(() => { getPricing().then(setPricing).catch(() => { /* keep defaults */ }); }, []);
  return pricing;
}
