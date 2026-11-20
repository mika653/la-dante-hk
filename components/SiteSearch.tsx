"use client";
// Site-wide search box in the top nav. Searches a static index of the main pages
// plus the live course catalogue (so "B1", "kids", a teacher's name, "PLIDA" all
// land somewhere useful). Pure client + in-memory match — no backend, instant.
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, BookOpen, FileText, CornerDownLeft } from "lucide-react";
import { useCourses } from "@/lib/use-courses";
import { localizePath, type Locale } from "@/lib/locale";
import { formatDateRange } from "@/lib/utils";
import type { Course } from "@/lib/data";

type Page = { label: string; labelZh: string; href: string; group: string; groupZh: string; keywords?: string };

// The destinations a visitor actually searches for. Labels mirror the nav; the
// keywords catch the words people type that aren't in the label.
const PAGES: Page[] = [
  { label: "Adult Italian courses", labelZh: "成人意大利文課程", href: "/courses/italian/adult-groups", group: "Courses", groupZh: "課程", keywords: "group evening a1 a2 b1 b2 c1 c2 beginner intermediate advanced" },
  { label: "Kids & Teens", labelZh: "兒童及青少年", href: "/courses/italian/kids", group: "Courses", groupZh: "課程", keywords: "children playgroup teenager young" },
  { label: "Private lessons", labelZh: "私人課堂", href: "/courses/italian/private", group: "Courses", groupZh: "課程", keywords: "one to one tailored flexible" },
  { label: "Corporate courses", labelZh: "企業課程", href: "/courses/italian/corporate", group: "Courses", groupZh: "課程", keywords: "business company team on-site" },
  { label: "Online courses", labelZh: "網上課程", href: "/courses/italian/online", group: "Courses", groupZh: "課程", keywords: "zoom remote virtual" },
  { label: "Special courses", labelZh: "特別課程", href: "/courses/italian/special", group: "Courses", groupZh: "課程", keywords: "conversation grammar workshop short" },
  { label: "Level progression", labelZh: "程度進階", href: "/courses/italian/level-progression", group: "Courses", groupZh: "課程", keywords: "cefr path syllabus what next" },
  { label: "Latin — group courses", labelZh: "拉丁文小組課程", href: "/courses/latin/groups", group: "Courses", groupZh: "課程", keywords: "latino cicero" },
  { label: "Latin — private lessons", labelZh: "拉丁文私人課堂", href: "/courses/latin/private", group: "Courses", groupZh: "課程", keywords: "latino one to one" },
  { label: "Study in Italy", labelZh: "到意大利升學", href: "/courses/study-in-italy", group: "Courses", groupZh: "課程", keywords: "abroad university scholarship" },
  { label: "Teachers' training", labelZh: "師資培訓", href: "/courses/teacher-training", group: "Courses", groupZh: "課程", keywords: "ditals certification teach" },
  { label: "Test your level", labelZh: "測試你的程度", href: "/placement-test", group: "Courses", groupZh: "課程", keywords: "placement quiz cefr assessment find level" },
  { label: "Special offers", labelZh: "特別優惠", href: "/special-offers", group: "Courses", groupZh: "課程", keywords: "discount early bird promo gift card deal" },
  { label: "Events", labelZh: "活動", href: "/culture", group: "Culture", groupZh: "文化", keywords: "cultural aperitivo cinema talk" },
  { label: "Workshops", labelZh: "工作坊", href: "/culture#workshops", group: "Culture", groupZh: "文化", keywords: "wine cooking pizza bookclub" },
  { label: "PLIDA exam", labelZh: "PLIDA 考試", href: "/plida", group: "PLIDA", groupZh: "PLIDA", keywords: "certificate certification sessions application a1 a2 b1 b2 c1 c2 citizenship" },
  { label: "Membership", labelZh: "會員", href: "/membership", group: "Join Us", groupZh: "加入我們", keywords: "member perks privileges join benefits" },
  { label: "Donate", labelZh: "捐助", href: "/donate", group: "Join Us", groupZh: "加入我們", keywords: "support contribution" },
  { label: "Interpreting & Translations", labelZh: "傳譯及翻譯", href: "/services/translation", group: "Translation", groupZh: "翻譯服務", keywords: "translate interpreter certified document" },
  { label: "History", labelZh: "歷史", href: "/about", group: "About", groupZh: "關於我們", keywords: "who we are society dante alighieri" },
  { label: "Our team", labelZh: "我們的團隊", href: "/about#team", group: "About", groupZh: "關於我們", keywords: "staff teachers director giulia" },
  { label: "Scuola Semplice", labelZh: "Scuola Semplice", href: "/about/scuola-semplice", group: "About", groupZh: "關於我們", keywords: "student portal enrolment login" },
  { label: "Contact", labelZh: "聯絡我們", href: "/contact", group: "About", groupZh: "關於我們", keywords: "address wanchai email phone enquiry gift card" },
];

// Where a matched course sends you (courses have no individual public page —
// they live on their category listing).
function courseHref(c: Course): string {
  if (c.language === "latin") return c.type === "private" ? "/courses/latin/private" : "/courses/latin/groups";
  switch (c.type) {
    case "kids": return "/courses/italian/kids";
    case "private": return "/courses/italian/private";
    case "corporate": return "/courses/italian/corporate";
    case "online": return "/courses/italian/online";
    case "special": return "/courses/italian/special";
    default: return "/courses/italian/adult-groups";
  }
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
// AND-match: every typed word must appear somewhere in the haystack.
function matches(haystack: string, tokens: string[]) {
  const h = norm(haystack);
  return tokens.every((t) => h.includes(t));
}

type Hit = { href: string; title: string; subtitle: string; kind: "page" | "course" };

export default function SiteSearchOverlay({
  open, onClose, locale,
}: { open: boolean; onClose: () => void; locale: Locale }) {
  const zh = locale === "zh";
  const courses = useCourses();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  // Reset + focus whenever the box opens. (The body scroll lock is owned by Nav,
  // which locks on mobileOpen || searchOpen — see Nav.tsx — so we don't touch
  // document.body.style.overflow here and can't fight that effect.)
  useEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const hits = useMemo<Hit[]>(() => {
    const query = q.trim();
    const tokens = norm(query).split(/\s+/).filter(Boolean);

    if (tokens.length === 0) {
      // Empty box → a few sensible shortcuts.
      const quick = ["/placement-test", "/courses/italian/adult-groups", "/plida", "/special-offers", "/contact"];
      return quick
        .map((href) => PAGES.find((p) => p.href === href))
        .filter((p): p is Page => !!p)
        .map((p) => ({ href: p.href, title: zh ? p.labelZh : p.label, subtitle: zh ? p.groupZh : p.group, kind: "page" as const }));
    }

    const pageHits: Hit[] = PAGES
      .filter((p) => matches([p.label, p.labelZh, p.group, p.keywords ?? "", p.href].join(" "), tokens))
      .slice(0, 8)
      .map((p) => ({ href: p.href, title: zh ? p.labelZh : p.label, subtitle: zh ? p.groupZh : p.group, kind: "page" as const }));

    const courseHits: Hit[] = courses
      .filter((c) => matches([c.title, String(c.level), c.teacher, c.language, c.type, c.location].join(" "), tokens))
      .slice(0, 8)
      .map((c) => ({
        href: courseHref(c),
        title: c.title,
        subtitle: `${String(c.level)} · ${c.dayLabel} · ${formatDateRange(c.startISO, c.endISO)}`,
        kind: "course" as const,
      }));

    return [...pageHits, ...courseHits];
  }, [q, courses, zh]);

  useEffect(() => { setActive(0); }, [q]);

  if (!open) return null;

  const go = (i: number) => itemRefs.current[i]?.click();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
    if (hits.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); go(active); }
  };

  const noResults = q.trim().length > 0 && hits.length === 0;

  if (typeof document === "undefined") return null;
  // Portal to <body>: the sticky nav header has a backdrop-filter, which makes it
  // the containing block for fixed children — so a fixed overlay rendered inside
  // the header would be sized to the header box, not the viewport.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center" role="dialog" aria-modal="true" aria-label={zh ? "搜尋" : "Search"}>
      <button type="button" aria-label={zh ? "關閉" : "Close"} onClick={onClose} className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div className="relative mt-[10vh] mx-4 w-full max-w-xl frame bg-white overflow-hidden" style={{ boxShadow: "0 24px 64px -24px rgb(0 0 0 / 0.35)" }}>
        {/* input row */}
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <Search size={18} className="text-ink-muted shrink-0" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            type="text"
            placeholder={zh ? "搜尋課程、考試、活動…" : "Search courses, exams, pages…"}
            className="flex-1 py-4 bg-transparent outline-none text-[15px] text-ink placeholder:text-ink-muted/70"
            aria-label={zh ? "搜尋" : "Search"}
          />
          <button type="button" onClick={onClose} className="p-1.5 -mr-1.5 text-ink-muted hover:text-ink rounded-lg" aria-label={zh ? "關閉" : "Close"}>
            <X size={18} aria-hidden />
          </button>
        </div>

        {/* results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {noResults ? (
            <p className="px-4 py-8 text-center text-sm text-ink-muted">
              {zh ? "沒有相符的結果。" : "No matches."}{" "}
              <Link href={localizePath("/contact", locale)} onClick={onClose} className="text-azzurro-deep underline">
                {zh ? "聯絡我們" : "Contact us"}
              </Link>
            </p>
          ) : (
            <>
              {q.trim().length === 0 && (
                <p className="px-4 pt-1 pb-2 eyebrow">{zh ? "快速連結" : "Quick links"}</p>
              )}
              <ul>
                {hits.map((h, i) => (
                  <li key={`${h.kind}-${h.href}-${i}`}>
                    <Link
                      href={localizePath(h.href, locale)}
                      ref={(el) => { itemRefs.current[i] = el; }}
                      onClick={onClose}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-left ${i === active ? "bg-azzurro-soft" : "hover:bg-azzurro-soft/60"}`}
                    >
                      <span className={`shrink-0 grid place-items-center w-8 h-8 rounded-lg ${h.kind === "course" ? "bg-azzurro-deep/10 text-azzurro-deep" : "bg-ink/5 text-ink-muted"}`}>
                        {h.kind === "course" ? <BookOpen size={15} aria-hidden /> : <FileText size={15} aria-hidden />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-medium text-ink truncate">{h.title}</span>
                        <span className="block text-[12px] text-ink-muted truncate">{h.subtitle}</span>
                      </span>
                      {i === active && <CornerDownLeft size={14} className="shrink-0 text-ink-muted" aria-hidden />}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
