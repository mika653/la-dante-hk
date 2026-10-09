"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";
import PhotoMosaic from "@/components/PhotoMosaic";

// "Il Salotto di Dante" — the library & book-club section, styled to the team's
// mockup: a tilted photo collage beside a yellow panel with a bold title,
// subtitle and a black pill CTA.
export default function LibraryTrio() {
  const { t, locale } = useT();
  const links = [
    { label: t.library.bookclub, href: "/culture#bookclub" },
    { label: t.library.libraryLink, href: "/culture#library" },
    { label: t.library.events, href: "/membership" },
  ];

  return (
    <section className="relative overflow-hidden bg-sole">
      <div className="container-xl py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content on the yellow */}
          <div className="order-1 lg:order-2 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
            <h2 className="font-heading font-bold text-ink leading-[0.95] text-4xl sm:text-5xl lg:text-6xl text-balance">
              {t.library.name}
            </h2>
            <p className="mt-4 text-lg md:text-2xl text-ink/70">{t.library.subtitle}</p>

            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-sm font-medium text-ink">
              {links.map((l) => (
                <Link key={l.label} href={localizePath(l.href, locale)} className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                  {l.label}
                </Link>
              ))}
            </div>

            <Link href={localizePath("/culture", locale)} className="btn btn-primary mt-8">
              {t.library.cta} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Tilted photo mosaic */}
          <div className="order-2 lg:order-1 relative h-[360px] sm:h-[440px] lg:h-[560px] overflow-hidden rounded-3xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <PhotoMosaic />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
