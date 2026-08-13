// Branding config (logo, favicon, site title, tagline) — shared types + defaults.
// No "use client" / "use server" directive so it can be imported anywhere.

export type Branding = {
  logo: string;      // URL for the header/footer logo image
  favicon: string;   // URL for the browser-tab icon ("" = use the built-in default)
  siteTitle: string; // brand name shown in the browser tab
  tagline: string;   // short phrase appended after the title
};

export const defaultBranding: Branding = {
  logo: "/logo.png",
  favicon: "",
  siteTitle: "La Dante HK",
  tagline: "Italian & Latin in Hong Kong since 1935",
};

// Merge stored/partial values over the defaults so a missing field never blanks
// the brand, and clamp lengths so a bad value can't break the <head> or layout.
export function normaliseBranding(parsed: unknown): Branding {
  const p = (parsed ?? {}) as Partial<Branding>;
  const s = (v: unknown, max: number, fallback = "") =>
    (typeof v === "string" ? v : fallback).trim().slice(0, max);
  return {
    logo: s(p.logo, 800, defaultBranding.logo) || defaultBranding.logo,
    favicon: s(p.favicon, 800, ""),
    siteTitle: s(p.siteTitle, 120, defaultBranding.siteTitle) || defaultBranding.siteTitle,
    tagline: s(p.tagline, 200, defaultBranding.tagline),
  };
}
