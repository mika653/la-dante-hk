"use client";
// Logo/image size guideline for admin upload fields. Always shows the
// recommended size; once an image is chosen it reads the real pixel size and
// warns when the source is too small (small files render tiny or blurry on the
// site) — the most common cause of "my logo looks tiny".
import { useEffect, useState } from "react";
import { Info, AlertTriangle } from "lucide-react";

type Props = {
  src?: string | null;
  /** Minimum natural width in px before we warn. */
  minWidth: number;
  /** Optional minimum natural height in px. */
  minHeight?: number;
  /** Human guideline, e.g. "PNG or SVG, at least 600 × 200 px". */
  guideline: string;
  className?: string;
};

export default function ImageSizeHint({ src, minWidth, minHeight = 0, guideline, className = "" }: Props) {
  const [dims, setDims] = useState<{ w: number; h: number; src: string } | null>(null);

  useEffect(() => {
    if (!src) return;
    let alive = true;
    const img = new window.Image();
    img.onload = () => { if (alive) setDims({ w: img.naturalWidth, h: img.naturalHeight, src }); };
    img.onerror = () => { if (alive) setDims(null); };
    img.src = src;
    return () => { alive = false; };
  }, [src]);

  // Only trust measurements for the image currently selected. SVGs report their
  // viewBox size, which is fine — they scale without blurring anyway.
  const current = dims && src && dims.src === src ? dims : null;
  const isSvg = !!src && /\.svg(\?|$)|^data:image\/svg/i.test(src);
  const tooSmall = !!current && !isSvg && (current.w < minWidth || current.h < minHeight);

  return (
    <div className={`text-xs ${className}`}>
      <p className="text-ink-muted inline-flex items-start gap-1.5">
        <Info size={13} className="shrink-0 mt-px" aria-hidden />
        <span>{guideline} Crop away empty space around the logo, or it will look small.</span>
      </p>
      {current && (
        tooSmall ? (
          <p className="mt-1 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 inline-flex items-start gap-1.5">
            <AlertTriangle size={13} className="shrink-0 mt-px" aria-hidden />
            <span>This image is only <b>{current.w} × {current.h} px</b>, so it will look tiny or blurry. Please upload a larger file (at least {minWidth}{minHeight ? ` × ${minHeight}` : ""} px).</span>
          </p>
        ) : (
          <p className="mt-1 text-ink-soft">Current image: {current.w} × {current.h} px ✓</p>
        )
      )}
    </div>
  );
}
