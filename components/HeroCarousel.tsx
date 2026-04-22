"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSiteContent } from "@/lib/site-content";

export default function HeroCarousel() {
  const { carousel: slides } = useSiteContent();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  // Clamp index when admin removes a slide while the page is open
  const safeI = Math.min(i, Math.max(slides.length - 1, 0));
  const slide = slides[safeI];
  if (!slide) return null;

  return (
    <>
      {slides.map((s, idx) => (
        <Image
          key={s.id ?? s.src}
          src={s.src}
          alt={s.alt}
          priority={idx === 0}
          fill
          unoptimized={s.src.startsWith("http")}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ${idx === safeI ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Caption chip */}
      <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink/40 backdrop-blur-md text-cream text-[12px] font-mono uppercase tracking-wider">
        <span>{slide.caption}</span>
        <span className="opacity-60">· {safeI + 1}/{slides.length}</span>
      </div>

      {/* Dot nav */}
      <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 z-20 flex items-center gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === safeI ? "bg-sole w-10" : "bg-cream/60 hover:bg-cream w-2"}`}
          />
        ))}
      </div>
    </>
  );
}
