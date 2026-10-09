"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";
import { useSiteContent } from "@/lib/site-content";
import PhotoMosaic from "@/components/PhotoMosaic";

// "Il Salotto di Dante" — the library & book-club section. The tilted photo
// collage bleeds off the left edge and spans the full height of the yellow
// section; the title, subtitle and pill CTA sit on the yellow to the right.
export default function LibraryTrio() {
  const { t, locale } = useT();
  const { sectionPhotos } = useSiteContent();
  const links = [
    { label: t.library.bookclub, href: "/culture#bookclub" },
    { label: t.library.libraryLink, href: "/culture#library" },
    { label: t.library.events, href: "/membership" },
  ];

  return (
    <section className="relative overflow-hidden bg-sole lg:min-h-[560px]">
      {/* Desktop: collage bleeds to the left edge, full top-to-bottom height */}
      <div className="hidden lg:block absolute inset-y-0 left-0 w-[56%] overflow-hidden" aria-hidden>
        <div className="absolute inset-0 flex items-center justify-start">
          <PhotoMosaic images={sectionPhotos.mosaic} tile={190} />
        </div>
        {/* Fade the collage into the yellow so the text reads cleanly */}
        <div className="absolute inset-y-0 right-0 w-56 bg-gradient-to-l from-sole to-transparent" />
      </div>

      {/* Content on the yellow (right half on desktop) */}
      <div className="container-xl relative z-10 py-16 md:py-24 lg:min-h-[560px] flex items-center">
        <div className="lg:ml-[52%] lg:pl-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
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
      </div>

      {/* Mobile: full-bleed collage band under the content (no rounded box) */}
      <div className="lg:hidden relative h-[300px] overflow-hidden" aria-hidden>
        <div className="absolute inset-0 flex items-center justify-center">
          <PhotoMosaic images={sectionPhotos.mosaic} />
        </div>
      </div>
    </section>
  );
}
