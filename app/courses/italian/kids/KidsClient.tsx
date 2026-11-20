"use client";
import { useMemo } from "react";
import CourseListView from "@/components/CourseListView";
import { useCourses } from "@/lib/use-courses";
import { useT } from "@/lib/locale";
import { formatHKD } from "@/lib/utils";
import type { Course } from "@/lib/data";

// Kids & teens are organised by AGE GROUP (per Giulia), not CEFR level:
// Playgroup (3–6), Children (7–13), Teenagers (14+). A clickable strip jumps to
// each section — mirroring the adult "Your Journey" level strip.
type CatKey = "playgroup" | "children" | "teenagers";

const CATEGORIES: Array<{
  key: CatKey; label: string; labelZh: string; age: string; ageZh: string;
  price: number; blurb: string; blurbZh: string;
}> = [
  { key: "playgroup", label: "Playgroup", labelZh: "幼兒班", age: "Ages 3–6", ageZh: "3–6 歲",
    price: 2990, blurb: "Play-based first steps into Italian — songs, stories, crafts and games.",
    blurbZh: "以遊戲為本的意大利文入門 — 歌曲、故事、手工與遊戲。" },
  { key: "children", label: "Children", labelZh: "兒童班", age: "Ages 7–13", ageZh: "7–13 歲",
    price: 2400, blurb: "A structured group course building speaking, reading, writing and listening.",
    blurbZh: "有系統的小組課程,建立說、讀、寫、聽的能力。" },
  { key: "teenagers", label: "Teenagers", labelZh: "青少年班", age: "Ages 14+", ageZh: "14 歲以上",
    price: 2800, blurb: "Group classes that take language skills further, with projects and conversation.",
    blurbZh: "進階小組課程,透過專題與會話進一步提升語言能力。" },
];

// Sort a kids/teens course into an age group from its title/level keywords, so
// it lands in the right section however the office named it. Defaults to Children.
function kidsCategory(c: Course): CatKey {
  const t = `${c.title} ${String(c.level)}`.toLowerCase();
  if (/playgroup|piccol|toddler|pre-?school|幼兒|3\s*[–-]\s*6/.test(t)) return "playgroup";
  // Word-boundary "teen" so it doesn't match thirteen/fourteen/fifteen/canteen.
  if (/teenager|teenage|\bteens?\b|ragazzi|adolescent|giovani|青少年/.test(t)) return "teenagers";
  return "children";
}

export default function KidsClient() {
  const { locale } = useT();
  const zh = locale === "zh";
  const all = useCourses();
  const kids = useMemo(() => all.filter((c) => c.language === "italian" && c.type === "kids"), [all]);
  const byCat = useMemo(() => {
    const m: Record<CatKey, Course[]> = { playgroup: [], children: [], teenagers: [] };
    for (const c of kids) m[kidsCategory(c)].push(c);
    return m;
  }, [kids]);

  const jump = (key: CatKey) => document.getElementById(`kids-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const enquireHref = zh ? "/zh/contact" : "/contact";

  return (
    <div>
      {/* Jump strip — click a group to scroll to it (mirrors the adult journey strip). */}
      <div role="group" aria-label={zh ? "按年齡組別瀏覽" : "Jump to an age group"} className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => jump(cat.key)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium border bg-white text-ink border-line hover:border-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azzurro-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            {zh ? cat.labelZh : cat.label}
            <span className="text-xs text-ink-muted">{byCat[cat.key].length}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-8">
        {CATEGORIES.map((cat) => {
          const list = byCat[cat.key];
          return (
            <section key={cat.key} id={`kids-${cat.key}`} className="scroll-mt-28">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-xl md:text-2xl font-heading font-semibold">
                  {zh ? cat.labelZh : cat.label}
                  <span className="ml-2 text-sm font-body font-normal text-ink-muted">{zh ? cat.ageZh : cat.age}</span>
                </h3>
                <p className="text-sm text-ink-muted">
                  {zh ? "費用由 " : "From "}<span className="font-heading font-bold text-ink">{formatHKD(cat.price)}</span>
                </p>
              </div>
              <p className="mt-1 text-[14px] text-ink-muted">{zh ? cat.blurbZh : cat.blurb}</p>
              <div className="mt-4">
                <CourseListView
                  courses={list}
                  emptyMessage={
                    zh
                      ? `暫時未開辦${cat.labelZh} — 請在下方留下聯絡方式,開班時我們會通知您。`
                      : `No ${cat.label.toLowerCase()} classes scheduled right now — leave your details below and we'll let you know when the next one opens.`
                  }
                />
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        {zh ? "想了解更多或報名下一期?" : "Want details, or to join the next intake? "}
        <a href={enquireHref} className="text-azzurro-deep underline">{zh ? "聯絡辦公室" : "Contact the office"}</a>
        {zh ? "。" : "."}
      </p>
    </div>
  );
}
