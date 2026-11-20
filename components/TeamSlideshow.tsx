"use client";
import { useEffect, useState } from "react";
import { useSiteContent } from "@/lib/site-content";

// Top of the About "Our team" section. When the office has uploaded team photos
// (Admin → Content → Section photos → Team slideshow) it shows them as a simple
// auto-advancing slideshow; otherwise it falls back to the monogram circles.
const AVATAR_COLORS = ["bg-ink text-cream", "bg-azzurro-deep text-cream", "bg-azzurro text-ink"];
const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export default function TeamSlideshow({ names }: { names: string[] }) {
  const { sectionPhotos } = useSiteContent();
  const photos = sectionPhotos.teamSlideshow ?? [];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % photos.length), 4500);
    return () => clearInterval(id);
  }, [photos.length]);

  if (photos.length === 0) {
    if (names.length === 0) return null; // no photos and no fallback → render nothing
    return (
      <div aria-hidden="true" className="mt-10 flex flex-wrap justify-center gap-y-3">
        {names.map((n, idx) => (
          <div
            key={`collage-${n}`}
            title={n}
            className={`-ml-3 first:ml-0 w-14 h-14 md:w-16 md:h-16 rounded-full ring-4 ring-sole ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} font-heading font-extrabold text-base md:text-lg inline-flex items-center justify-center`}
          >
            {initials(n)}
          </div>
        ))}
      </div>
    );
  }

  const idx = i % photos.length;
  return (
    <div className="mt-10 mx-auto max-w-3xl">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-ink/10 bg-paper shadow-[0_18px_40px_-24px_rgb(0_0_0_/_0.4)]">
        {photos.map((src, n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={n}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${n === idx ? "opacity-100" : "opacity-0"}`}
            loading={n === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {photos.map((_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show photo ${n + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${n === idx ? "bg-ink" : "bg-ink/25 hover:bg-ink/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
