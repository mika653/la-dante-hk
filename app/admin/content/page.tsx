"use client";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Megaphone, Newspaper, PaintBucket, Sparkles, Type } from "lucide-react";

const sections = [
  { href: "/admin/content/hero",      icon: Type,        title: "Hero section",         blurb: "Headline, subhead, CTAs, and the trust strip on the homepage." },
  { href: "/admin/content/carousel",  icon: ImageIcon,   title: "Hero carousel",        blurb: "Add, remove, and reorder the slides behind the hero." },
  { href: "/admin/settings",          icon: Megaphone,   title: "Announcement & pop-up", blurb: "Top banner text and the entry pop-up on first visit." },
  { href: "/admin/content/featured",  icon: Sparkles,    title: "Featured cards",       blurb: "The five “Happening at Dante” cards (coming soon)", disabled: true },
  { href: "/admin/content/sponsors",  icon: PaintBucket, title: "Sponsors",             blurb: "Gold & Silver sponsor logos and order (coming soon)", disabled: true },
  { href: "/admin/content/team",      icon: Newspaper,   title: "Team & history",        blurb: "About-page staff photos, bios, and the 90-years timeline (coming soon)", disabled: true },
];

export default function ContentHub() {
  return (
    <div className="max-w-5xl">
      <p className="eyebrow">Admin · Content</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Edit the website.</h1>
      <p className="mt-3 text-ink-muted max-w-xl">Update copy, images, and homepage sections without touching code. Changes go live instantly on <code className="font-mono text-xs bg-cream-2 px-1.5 py-0.5 rounded">ladante.cc</code>.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {sections.map((s) => {
          const card = (
            <>
              <s.icon size={22} className="text-azzurro-deep" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{s.blurb}</p>
              {!s.disabled && (
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-azzurro-deep">
                  Edit <ArrowRight size={14} />
                </span>
              )}
            </>
          );
          return s.disabled ? (
            <div key={s.href} className="frame p-6 bg-cream-2/50 opacity-60">{card}</div>
          ) : (
            <Link key={s.href} href={s.href} className="frame p-6 bg-white hover:-translate-y-1 transition-transform">{card}</Link>
          );
        })}
      </div>
    </div>
  );
}
