"use client";
import Link from "next/link";
import { ArrowRight, BookMarked, Library, Users } from "lucide-react";

const items = [
  { icon: BookMarked, title: "Bookclub", blurb: "Monthly Italian-language book discussions over wine. Open to all members, all levels.", href: "/culture#bookclub", tone: "yellow" },
  { icon: Library,    title: "Italian Library", blurb: "Hong Kong&apos;s largest Italian-language library. 5,000+ titles, free for members.", href: "/culture#library",   tone: "white"  },
  { icon: Users,      title: "Members-only events", blurb: "Aperitivi, film screenings, regional food tastings, and Dante lectures.", href: "/membership",         tone: "blue"   },
] as const;

const toneClass: Record<"yellow" | "white" | "blue", string> = {
  yellow: "bg-sole-soft text-ink",
  white:  "bg-white text-ink border border-line",
  blue:   "bg-ink text-cream",
};

import { useT } from "@/lib/locale";

export default function LibraryTrio() {
  const { t } = useT();
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-xl">
        <div className="text-center mb-12">
          <p className="eyebrow">{t.library.eyebrow}</p>
          <h2 className="mt-3 text-3xl md:text-5xl">{t.library.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, blurb, href, tone }) => (
            <Link key={title} href={href} className={`group frame p-8 ${toneClass[tone]} flex flex-col`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tone === "blue" ? "bg-cream/15" : "bg-white"}`}>
                <Icon size={22} className={tone === "blue" ? "text-cream" : "text-azzurro-deep"} aria-hidden />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
              <p className={`mt-3 text-[15px] leading-relaxed flex-1 ${tone === "blue" ? "text-cream/85" : "text-ink-muted"}`} dangerouslySetInnerHTML={{ __html: blurb }} />
              <span className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${tone === "blue" ? "text-sole" : "text-azzurro-deep"}`}>
                Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
