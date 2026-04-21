import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatHKD(amount: number) {
  return new Intl.NumberFormat("en-HK", { style: "currency", currency: "HKD", maximumFractionDigits: 0 }).format(amount);
}

export function formatDateRange(startISO: string, endISO: string) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const sameYear = s.getFullYear() === e.getFullYear();
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const sFmt = new Intl.DateTimeFormat("en-GB", opts).format(s);
  const eFmt = new Intl.DateTimeFormat("en-GB", sameMonth ? { day: "numeric" } : opts).format(e);
  const year = sameYear ? s.getFullYear() : `${s.getFullYear()}–${e.getFullYear()}`;
  return `${sFmt} – ${eFmt} ${year}`;
}
