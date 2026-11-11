"use client";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { pickForDate } from "@/lib/daily-word";
import { useToday } from "@/lib/use-today";
import { useT, localizePath } from "@/lib/locale";

// "Word / phrase of the week" — now sits INSIDE the hero slideshow, under the
// CTAs (per Giulia: the old floating box covered important content). It's part
// of the page flow, so it never overlaps anything. Dismissal lasts the session.
export default function WordOfTheWeekCard() {
  const { t, locale } = useT();
  const isZh = locale === "zh";
  const today = useToday();
  // Dismissal is remembered for the session; hidden on the server render.
  const storedClosed = useSyncExternalStore(
    () => () => {},
    () => { try { return sessionStorage.getItem("ladante-wotw") === "closed"; } catch { return false; } },
    () => true,
  );
  const [closedNow, setClosedNow] = useState(false);

  function close() {
    setClosedNow(true);
    try { sessionStorage.setItem("ladante-wotw", "closed"); } catch {}
  }

  const item = today && !storedClosed && !closedNow ? pickForDate(today) : null;
  if (!item) return null;
  const label = item.kind === "phrase" ? t.daily.phrase : t.daily.word;

  return (
    <aside aria-label={label} className="relative mt-8 w-full max-w-[340px] rounded-2xl bg-white/90 backdrop-blur border border-line p-4 pr-9 shadow-[var(--shadow-card)] animate-in">
      <button type="button" onClick={close} aria-label={isZh ? "關閉" : "Close"} className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-ink/10 inline-flex items-center justify-center text-ink-muted">
        <X size={14} />
      </button>
      <p className="eyebrow inline-flex items-center gap-1.5 text-[10px]">
        <Sparkles size={12} className="text-azzurro-deep" aria-hidden />
        {label}
      </p>
      <div className="mt-1 flex items-baseline gap-x-3 gap-y-0.5 flex-wrap">
        <p className="font-heading font-extrabold text-xl leading-tight">{item.it}</p>
        <p className="text-[13px] text-ink-muted">{isZh ? item.zh : item.en}</p>
      </div>
      <Link href={localizePath("/courses/italian/adult-groups", locale)} className="mt-1.5 inline-block text-[12px] font-medium text-azzurro-deep hover:underline">
        {isZh ? "來上課 →" : "Learn with us →"}
      </Link>
    </aside>
  );
}
