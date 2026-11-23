"use client";
// English / 中文 switch for admin forms. In 中文 mode the translatable fields
// show (and edit) the manual Chinese translation; blank Chinese fields fall
// back to English on the public site.
import { Languages } from "lucide-react";

export type Lang = "en" | "zh";

export default function LangToggle({ lang, onChange, missing = 0 }: { lang: Lang; onChange: (l: Lang) => void; missing?: number }) {
  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium inline-flex items-center gap-1.5"><Languages size={15} className="text-azzurro-deep" aria-hidden /> Language</span>
        <div role="tablist" aria-label="Content language" className="inline-flex rounded-full bg-cream-2 p-1">
          {(["en", "zh"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={lang === l}
              onClick={() => onChange(l)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${lang === l ? "bg-ink text-white" : "text-ink-muted hover:text-ink"}`}
            >
              {l === "en" ? "English" : "中文"}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        {lang === "en"
          ? <>Editing the English text.{missing > 0 && <> Switch to <b>中文</b> to add the Chinese translation ({missing} field{missing === 1 ? "" : "s"} not translated yet).</>}</>
          : <>Editing the Traditional Chinese text for the 中文 site. The English is shown greyed out as a guide; anything left blank shows in English.</>}
      </p>
    </div>
  );
}
