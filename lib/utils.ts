import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatHKD(amount: number) {
  return new Intl.NumberFormat("en-HK", { style: "currency", currency: "HKD", maximumFractionDigits: 0 }).format(amount);
}

// DD/MM/YYYY (the office's preferred format). Parsed from the ISO parts directly
// so it's deterministic and timezone-safe (no hydration mismatch).
export function formatDMY(iso: string): string {
  const [y, m, d] = String(iso ?? "").split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

export function formatDateRange(startISO: string, endISO: string) {
  return `${formatDMY(startISO)} – ${formatDMY(endISO)}`;
}
