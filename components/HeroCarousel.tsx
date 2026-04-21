"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Full-bleed background photo carousel.
// Curated Unsplash IDs of people + cityscapes (swappable by admin later).
type Slide = { src: string; alt: string; caption: string };

const slides: Slide[] = [
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=2000&q=80&auto=format&fit=crop",
    alt: "A group of friends seen from behind walking together.",
    caption: "Students at Dante · 2024",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000&q=80&auto=format&fit=crop",
    alt: "A group of people studying together around a table.",
    caption: "A1 Beginner class · Wanchai",
  },
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=2000&q=80&auto=format&fit=crop",
    alt: "Students working together in a modern classroom environment.",
    caption: "B1 conversation practice",
  },
  {
    src: "/mural.png",
    alt: "The La Dante mural — Hong Kong skyline merged with Italian landmarks.",
    caption: "Il nostro murales — where Hong Kong meets Italy",
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {slides.map((s, idx) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.alt}
          priority={idx === 0}
          fill
          unoptimized={s.src.startsWith("http")}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Slide caption — small, bottom-right, cream on dark */}
      <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink/40 backdrop-blur-md text-cream text-[12px] font-mono uppercase tracking-wider">
        <span>{slides[i].caption}</span>
        <span className="opacity-60">· {i + 1}/{slides.length}</span>
      </div>

      {/* Dot nav */}
      <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 z-20 flex items-center gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "bg-sole w-10" : "bg-cream/60 hover:bg-cream w-2"}`}
          />
        ))}
      </div>
    </>
  );
}
