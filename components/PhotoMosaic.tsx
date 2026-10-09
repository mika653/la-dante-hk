import Image from "next/image";

// Decorative tilted photo collage — the signature look from the design mockup.
// Columns of rounded portrait tiles, staggered vertically and rotated as a group
// so they cascade diagonally; the parent clips the overflow. Purely decorative
// (aria-hidden). Images come from the shared site content (Media Library) via the
// `images` prop; the defaults in /public/mosaic are PLACEHOLDERS.
const DEFAULT_TILES = [
  "/mosaic/1.jpg", "/mosaic/2.jpg", "/mosaic/3.jpg", "/mosaic/4.jpg", "/mosaic/5.jpg",
  "/mosaic/6.jpg", "/mosaic/7.jpg", "/mosaic/8.jpg", "/mosaic/9.jpg", "/mosaic/10.jpg",
];

const COL_COUNT = 4;
const OFFSETS = [0, -48, 24, -24];

export default function PhotoMosaic({
  className = "",
  rotate = -11,
  tile = 176,
  images,
}: { className?: string; rotate?: number; tile?: number; images?: string[] }) {
  const tiles = images && images.length > 0 ? images : DEFAULT_TILES;
  // Distribute the tiles round-robin into columns so any count looks balanced.
  const columns: string[][] = Array.from({ length: COL_COUNT }, () => []);
  tiles.forEach((src, i) => columns[i % COL_COUNT].push(src));

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <div className="flex gap-3 md:gap-4" style={{ transform: `rotate(${rotate}deg) scale(1.12)`, transformOrigin: "center" }}>
        {columns.map((col, ci) =>
          col.length === 0 ? null : (
            <div key={ci} className="flex flex-col gap-3 md:gap-4" style={{ marginTop: OFFSETS[ci] }}>
              {col.map((src, ti) => (
                <div key={ti} className="relative overflow-hidden rounded-2xl bg-ink/5 shadow-sm shrink-0" style={{ width: tile, aspectRatio: "3 / 4" }}>
                  <Image src={src} alt="" fill sizes="200px" unoptimized={src.startsWith("http")} className="object-cover" />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
