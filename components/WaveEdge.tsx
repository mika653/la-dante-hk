import { toneHex, type Tone } from "./WaveDivider";

// A wave drawn ON TOP of a section's edge, in the colour of the neighbouring
// section. Unlike WaveDivider (a separate solid strip), the section's own
// background — e.g. a photo collage — shows through right up to the curve, so
// the collage lines up with the wave line (per Giulia). Same curve as WaveDivider.
//   edge="top":    `tone` = colour of the section ABOVE
//   edge="bottom": `tone` = colour of the section BELOW
export default function WaveEdge({ edge, tone }: { edge: "top" | "bottom"; tone: Tone }) {
  const d =
    edge === "top"
      ? "M0,0 L1440,0 L1440,56 C1200,96 960,64 720,48 C480,32 240,96 0,64 Z"
      : "M0,64 C240,96 480,32 720,48 C960,64 1200,96 1440,56 L1440,96 L0,96 Z";
  return (
    <div className={`pointer-events-none absolute inset-x-0 z-20 ${edge === "top" ? "top-0 -mt-px" : "bottom-0 -mb-px"}`} aria-hidden>
      <svg viewBox="0 0 1440 96" className="block w-full h-16 md:h-20" preserveAspectRatio="none">
        <path d={d} fill={toneHex[tone]} />
      </svg>
    </div>
  );
}
