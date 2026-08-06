"use client";
import Link from "next/link";
import { IconInstagram } from "./SocialIcons";
import { useT } from "@/lib/locale";

const IG_URL = "https://instagram.com/ladantehk";

// A honest preview of the *kinds* of moments we share — not fabricated posts.
// Each tile links out to the real profile. Swap for a live IG Graph API feed in Phase 2.
const tones = [
  "bg-sole",
  "bg-azzurro",
  "bg-cream-2 border border-line",
  "bg-azzurro-soft text-ink",
  "bg-ink text-cream",
  "bg-sole-soft",
];

export default function InstagramStrip() {
  const { t } = useT();
  const themes: string[] = t.instagram.themes;
  return (
    <section className="bg-sole-soft py-16 md:py-24">
      <div className="container-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <p className="eyebrow inline-flex items-center gap-2"><IconInstagram size={14} /> {t.instagram.eyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-5xl"><span className="circle-accent-sm circle-accent">{t.instagram.titleHighlight}</span>{t.instagram.titleTail}</h2>
          </div>
          <Link href={IG_URL} target="_blank" rel="noopener" className="btn btn-ghost self-start md:self-auto">{t.instagram.follow}</Link>
        </div>
        <p className="text-ink-muted mb-10 max-w-xl">{t.instagram.peek}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {themes.map((theme, i) => (
            <Link
              key={i}
              href={IG_URL}
              target="_blank"
              rel="noopener"
              aria-label={`${theme} — on our Instagram`}
              className={`aspect-square rounded-2xl ${tones[i % tones.length]} p-4 flex flex-col justify-between overflow-hidden transition-transform hover:scale-[1.02]`}
            >
              <IconInstagram size={16} className="opacity-70" />
              <span className="text-sm font-medium leading-tight">{theme}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
