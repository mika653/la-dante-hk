"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";
import { useSiteContent, pickLocale } from "@/lib/site-content";

export default function EntryPopup() {
  const { locale } = useT();
  const content = useSiteContent();
  const p = content.popup;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!p?.enabled) return;
    const seen = sessionStorage.getItem("ladante-popup");
    if (seen) return;
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, [p?.enabled]);

  function close() {
    setShow(false);
    try { sessionStorage.setItem("ladante-popup", "1"); } catch {}
  }

  if (!show || !p?.enabled) return null;

  const eyebrow = pickLocale(p.eyebrow, locale);
  const title = pickLocale(p.title, locale);
  const bullets = p.bullets.map((b) => pickLocale(b, locale)).filter(Boolean);
  const cta1 = pickLocale(p.cta1.label, locale);
  const cta2 = pickLocale(p.cta2.label, locale);

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-ink/40 animate-in" role="dialog" aria-labelledby="popup-title">
      <div className="relative frame bg-cream max-w-md w-full overflow-hidden">
        <button type="button" onClick={close} aria-label="Close" className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-ink/10 inline-flex items-center justify-center z-10">
          <X size={16} />
        </button>

        {/* Top: yellow header with Dante brand circles */}
        <div className="bg-sole p-6 pb-8 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-azzurro/15" aria-hidden />
          <div className="absolute bottom-2 left-4 w-3 h-3 rounded-full bg-azzurro" aria-hidden />
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id="popup-title" className="mt-2 text-2xl font-heading font-extrabold">{title}</h2>
        </div>

        <div className="p-6">
          <ul className="space-y-2.5 text-[15px]">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-2"><Sparkles size={16} className="text-azzurro-deep mt-1 shrink-0" aria-hidden /><span>{b}</span></li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2">
            {cta1 && <Link href={localizePath(p.cta1.href, locale)} onClick={close} className="btn btn-primary flex-1">{cta1}</Link>}
            {cta2 && <Link href={localizePath(p.cta2.href, locale)} onClick={close} className="btn btn-ghost">{cta2}</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
