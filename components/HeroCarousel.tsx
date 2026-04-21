"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Curated Unsplash photos — "people with backs to camera, Hong Kong / cityscapes".
// Swappable from admin in Phase 2. `/mural.png` acts as a safe local fallback slide.
type Slide = { src: string; alt: string; caption: string; credit?: string };

const slides: Slide[] = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format&fit=crop",
    alt: "A couple looks out at a dense Asian city skyline at dusk.",
    caption: "Students at our Wanchai rooftop · 2024",
    credit: "Photo placeholder",
  },
  {
    src: "https://images.unsplash.com/photo-1517486430290-35657bdcef51?w=1600&auto=format&fit=crop",
    alt: "A small group stands together looking out over a city harbor.",
    caption: "End-of-term aperitivo overlooking Victoria Harbour",
    credit: "Photo placeholder",
  },
  {
    src: "https://images.unsplash.com/photo-1533619239233-6280475a633a?w=1600&auto=format&fit=crop",
    alt: "Hong Kong Central district at dusk from above.",
    caption: "Our home · Central & Wanchai",
    credit: "Photo placeholder",
  },
  {
    src: "/mural.png",
    alt: "The La Dante mural — HK skyline merged with Italian landmarks.",
    caption: "Il nostro murales — where Hong Kong meets Italy",
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const slide = slides[i];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Soft brand-blue circle behind the frame */}
      <div className="absolute -top-6 -right-6 w-48 h-48 md:w-64 md:h-64 rounded-full bg-azzurro opacity-55 blur-[2px]" aria-hidden />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-sole opacity-70" aria-hidden />

      <figure className="relative frame bg-white p-3 md:p-4">
        <div className="relative aspect-[4/3] md:aspect-[16/11] rounded-2xl overflow-hidden bg-paper">
          {slides.map((s, idx) => (
            <Image
              key={s.src}
              src={s.src}
              alt={s.alt}
              priority={idx === 0}
              fill
              unoptimized={s.src.startsWith("http")}
              sizes="(max-width: 1024px) 90vw, 560px"
              className={`object-cover object-center transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
            />
          ))}

          {/* Dot nav */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "bg-white w-8" : "bg-white/60 hover:bg-white/80 w-2"}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <button type="button" onClick={() => setI((v) => (v - 1 + slides.length) % slides.length)} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-ink hover:bg-white inline-flex items-center justify-center shadow-md">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={() => setI((v) => (v + 1) % slides.length)} aria-label="Next slide" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-ink hover:bg-white inline-flex items-center justify-center shadow-md">
            <ChevronRight size={16} />
          </button>
        </div>
        <figcaption className="mt-3 flex items-center justify-between gap-3 px-2">
          <p className="text-[13px] text-ink-muted leading-snug truncate">
            <span className="font-medium text-ink">{slide.caption}</span>
            {slide.credit && <span className="ml-1.5 text-ink-soft">· {slide.credit}</span>}
          </p>
          <span className="text-[11px] font-mono text-ink-soft uppercase tracking-wider shrink-0">{i + 1}/{slides.length}</span>
        </figcaption>
      </figure>
    </div>
  );
}
