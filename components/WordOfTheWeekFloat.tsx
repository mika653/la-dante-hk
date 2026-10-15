"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { pickForDate, type DailyItem } from "@/lib/daily-word";
import { todayISO } from "@/lib/course-schedule";
import { useT, localizePath } from "@/lib/locale";

// Small dismissible "Word of the week" box that floats at the bottom-left of the
// landing page (clear of the chat bubble on the right). Dismissal is remembered
// for the session.
export default function WordOfTheWeekFloat() {
  const { t, locale } = useT();
  const isZh = locale === "zh";
  const [item, setItem] = useState<DailyItem | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { if (sessionStorage.getItem("ladante-wotw") === "closed") return; } catch {}
    setItem(pickForDate(todayISO()));
    const tm = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(tm);
  }, []);

  function close() {
    setShow(false);
    try { sessionStorage.setItem("ladante-wotw", "closed"); } catch {}
  }

  if (!show || !item) return null;
  const label = item.kind === "phrase" ? t.daily.phrase : t.daily.word;

  return (
    <div className="fixed bottom-4 left-4 z-40 w-[260px] sm:w-[280px] animate-in" role="complementary" aria-label={label}>
      <div className="relative frame bg-white p-4 pr-8 shadow-[var(--shadow-pop)]">
        <button type="button" onClick={close} aria-label="Close" className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-ink/10 inline-flex items-center justify-center text-ink-muted">
          <X size={14} />
        </button>
        <p className="eyebrow inline-flex items-center gap-1.5 text-[10px]">
          <Sparkles size={12} className="text-azzurro-deep" aria-hidden />
          {label}
        </p>
        <p className="mt-1.5 font-heading font-extrabold text-xl leading-tight">{item.it}</p>
        <p className="mt-0.5 text-[13px] text-ink-muted">{isZh ? item.zh : item.en}</p>
        <Link href={localizePath("/courses/italian/adult-groups", locale)} className="mt-2 inline-block text-[12px] font-medium text-azzurro-deep hover:underline">
          {isZh ? "來上課 →" : "Learn with us →"}
        </Link>
      </div>
    </div>
  );
}
