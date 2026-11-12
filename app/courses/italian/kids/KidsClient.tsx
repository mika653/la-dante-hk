"use client";
import { useMemo, useState } from "react";
import CourseListView from "@/components/CourseListView";
import { useCourses } from "@/lib/use-courses";
import { useT } from "@/lib/locale";

// Kids & teens courses use mixed level labels — some CEFR (A1.2, A1.3), some
// plain (Beginner / Intermediate / Advanced). Group each into a filter bucket:
// a CEFR level collapses to its band (A1.2 → "A1"); a plain level stays as-is.
// The pills are built from whatever the office has actually published, so the
// filter never shows an empty or hard-coded level.
function levelBand(level: string): string {
  const s = String(level ?? "").trim();
  return /^[ABC][12]/.test(s) ? s.slice(0, 2) : (s || "Other");
}

const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];
function bandRank(b: string): number {
  const i = CEFR_ORDER.indexOf(b);
  return i >= 0 ? i : 100 + b.charCodeAt(0); // CEFR bands first, then plain levels A→Z
}

export default function KidsClient() {
  const { locale } = useT();
  const zh = locale === "zh";
  const all = useCourses();
  const kids = useMemo(() => all.filter((c) => c.language === "italian" && c.type === "kids"), [all]);
  const [active, setActive] = useState<string>("All");

  const bands = useMemo(() => {
    const set = new Set<string>();
    for (const c of kids) set.add(levelBand(c.level));
    return [...set].sort((a, b) => bandRank(a) - bandRank(b));
  }, [kids]);

  const counts = useMemo(() => {
    const base: Record<string, number> = { All: kids.length };
    for (const b of bands) base[b] = kids.filter((c) => levelBand(c.level) === b).length;
    return base;
  }, [kids, bands]);

  const filtered = active === "All" ? kids : kids.filter((c) => levelBand(c.level) === active);
  const tabs = ["All", ...bands];
  const tabLabel = (t: string) => (t === "All" ? (zh ? "全部" : "All") : t);
  const contactHref = zh ? "/zh/contact" : "/contact";

  const emptyMessage =
    active === "All"
      ? zh
        ? "目前未有兒童及青少年課程 — 請聯絡辦公室,新一期開班時我們會通知您。"
        : "No kids & teens classes are scheduled right now — contact the office and we'll let you know as soon as the next one opens."
      : zh
        ? `暫時未有 ${active} 班級 — 請告訴辦公室您有興趣,有足夠人數時我們便會開班。`
        : `No ${active} class starting just yet — tell the office you're interested and we'll open one when there's demand.`;

  // Nothing published yet: keep the page's description, skip an empty filter.
  if (kids.length === 0) {
    return (
      <p className="text-[15px] text-ink-muted">
        {zh ? "新一期課程時間表正在編排中 — " : "Class schedules for the new term are being finalised — "}
        <a href={contactHref} className="text-azzurro-deep underline">{zh ? "聯絡辦公室" : "contact the office"}</a>
        {zh ? " 查詢最新的兒童及青少年開班日期。" : " for the latest kids & teens dates."}
      </p>
    );
  }

  return (
    <div>
      <div role="group" aria-label="Filter kids & teens courses by level" className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const on = active === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-pressed={on}
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azzurro-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                on ? "bg-azzurro-deep text-cream border-azzurro-deep" : "bg-white text-ink border-line hover:border-ink"
              }`}
            >
              {tabLabel(t)}
              <span className={`text-xs font-mono ${on ? "text-cream/70" : "text-ink-muted"}`}>{counts[t]}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[13px] text-ink-muted" aria-live="polite">
        {zh
          ? `顯示 ${filtered.length} 個課程${active !== "All" ? `(${active})` : ""}`
          : `Showing ${filtered.length} ${filtered.length === 1 ? "class" : "classes"}${active !== "All" ? ` at ${active}` : ""}.`}
      </p>

      <div className="mt-5">
        <CourseListView courses={filtered} emptyMessage={emptyMessage} />
      </div>
    </div>
  );
}
