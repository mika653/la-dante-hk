// Editable membership + sponsorship prices. Stored in the shared site_config
// table (key "pricing"); defaults match what the site shipped with, so nothing
// changes on screen until the office edits a number. Pure/storage-agnostic.

export type Pricing = {
  individualFirstYear: number; // Individual membership, first year
  individualRenewal: number;   // Individual membership, yearly renewal
  sponsorSilver: number;
  sponsorGold: number;
  sponsorDiamond: number;
};

export const defaultPricing: Pricing = {
  individualFirstYear: 800,
  individualRenewal: 600,
  sponsorSilver: 7500,
  sponsorGold: 35000,
  sponsorDiamond: 55000,
};

export function normalisePricing(parsed: unknown): Pricing {
  const p = (parsed ?? {}) as Partial<Record<keyof Pricing, unknown>>;
  const num = (v: unknown, fallback: number) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  return {
    individualFirstYear: num(p.individualFirstYear, defaultPricing.individualFirstYear),
    individualRenewal: num(p.individualRenewal, defaultPricing.individualRenewal),
    sponsorSilver: num(p.sponsorSilver, defaultPricing.sponsorSilver),
    sponsorGold: num(p.sponsorGold, defaultPricing.sponsorGold),
    sponsorDiamond: num(p.sponsorDiamond, defaultPricing.sponsorDiamond),
  };
}
