import Image from "next/image";

// Decorative tilted photo collage — the signature look from the design mockup.
// Columns of rounded portrait tiles, staggered vertically and rotated as a group
// so they cascade diagonally; the parent clips the overflow. Purely decorative
// (aria-hidden). Tiles live in /public/mosaic and are PLACEHOLDERS — the office
// swaps in real event / book-club / cultural photos later.
const TILES = [
  "/mosaic/1.jpg", "/mosaic/2.jpg", "/mosaic/3.jpg", "/mosaic/4.jpg", "/mosaic/5.jpg",
  "/mosaic/6.jpg", "/mosaic/7.jpg", "/mosaic/8.jpg", "/mosaic/9.jpg", "/mosaic/10.jpg",
];

// Four columns, each given a vertical offset so the grid reads as a diagonal mosaic.
const COLUMNS: { tiles: number[]; offset: number }[] = [
  { tiles: [0, 4, 8], offset: 0 },
  { tiles: [1, 5, 9], offset: -48 },
  { tiles: [2, 6, 3], offset: 24 },
  { tiles: [7, 9, 1], offset: -24 },
];

export default function PhotoMosaic({
  className = "",
  rotate = -11,
  tile = 176,
}: { className?: string; rotate?: number; tile?: number }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <div
        className="flex gap-3 md:gap-4"
        style={{ transform: `rotate(${rotate}deg) scale(1.12)`, transformOrigin: "center" }}
      >
        {COLUMNS.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-3 md:gap-4" style={{ marginTop: col.offset }}>
            {col.tiles.map((idx, ti) => (
              <div
                key={ti}
                className="relative overflow-hidden rounded-2xl bg-ink/5 shadow-sm shrink-0"
                style={{ width: tile, aspectRatio: "3 / 4" }}
              >
                <Image src={TILES[idx]} alt="" fill sizes="200px" className="object-cover" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
