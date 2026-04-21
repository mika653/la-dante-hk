"use client";
import { useEffect, useState } from "react";
import { testimonials } from "@/lib/data";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function ReviewsCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);
  const t = testimonials[i];

  return (
    <section className="bg-paper text-ink py-20 md:py-28 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-azzurro opacity-50 blur-[2px]" aria-hidden />
      <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-sole/30" aria-hidden />
      <div className="container-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <Quote size={32} className="mx-auto text-azzurro-deep" aria-hidden />
          <blockquote className="mt-6 text-2xl md:text-3xl font-heading font-semibold leading-[1.2] text-ink">
            “{t.quote}”
          </blockquote>
          <p className="mt-6 text-[15px] text-ink-muted">
            <span className="font-medium text-ink">{t.name}</span> · {t.level} · {t.year}
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <button type="button" onClick={() => setI((v) => (v - 1 + testimonials.length) % testimonials.length)} className="w-10 h-10 rounded-full border border-ink/25 hover:bg-ink hover:text-cream hover:border-ink inline-flex items-center justify-center transition-colors" aria-label="Previous">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, idx) => (
                <button key={idx} type="button" onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`} className={`h-2 rounded-full transition-all ${idx === i ? "bg-ink w-6" : "bg-ink/25 w-2"}`} />
              ))}
            </div>
            <button type="button" onClick={() => setI((v) => (v + 1) % testimonials.length)} className="w-10 h-10 rounded-full border border-ink/25 hover:bg-ink hover:text-cream hover:border-ink inline-flex items-center justify-center transition-colors" aria-label="Next">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
