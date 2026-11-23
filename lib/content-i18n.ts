// Manual Traditional-Chinese translations for admin-written content (events,
// workshops). Each item stores its English fields as usual plus an optional
// `zh` object with the translated text; on the Chinese site we show the zh text
// and fall back to English for any field left blank. Pure / shared.

export type EventZh = { title?: string; description?: string; location?: string; kind?: string };
export type WorkshopZh = { title?: string; description?: string; dateLabel?: string; timeLabel?: string; fee?: string };

export const EVENT_ZH_FIELDS = ["title", "kind", "location", "description"] as const;
export const WORKSHOP_ZH_FIELDS = ["title", "dateLabel", "timeLabel", "fee", "description"] as const;

const LIMITS: Record<string, number> = { title: 200, kind: 60, location: 200, dateLabel: 120, timeLabel: 120, fee: 200, description: 4000 };

/** Clean an untrusted zh object down to the allowed, non-blank fields (null when empty). */
export function sanitizeZh<K extends string>(input: unknown, fields: readonly K[]): Partial<Record<K, string>> | null {
  if (!input || typeof input !== "object") return null;
  const src = input as Record<string, unknown>;
  const out: Partial<Record<K, string>> = {};
  for (const f of fields) {
    const v = typeof src[f] === "string" ? (src[f] as string).trim().slice(0, LIMITS[f] ?? 500) : "";
    if (v) out[f] = v;
  }
  return Object.keys(out).length > 0 ? out : null;
}

/** Overlay the zh translation onto an item when the site is in Chinese. */
export function localizeItem<T extends { zh?: Partial<Record<string, string>> | null }>(item: T, locale: "en" | "zh"): T {
  if (locale !== "zh" || !item.zh) return item;
  const next = { ...item } as Record<string, unknown>;
  for (const [k, v] of Object.entries(item.zh)) if (typeof v === "string" && v.trim()) next[k] = v;
  return next as T;
}
