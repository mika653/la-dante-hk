// A soft SVG wave divider between two section colours.
// `from` is the section ABOVE the wave, `to` is the section BELOW.
type Tone = "cream" | "white" | "sole-soft" | "azzurro" | "azzurro-deep";

const toneHex: Record<Tone, string> = {
  "cream": "#FFFBF0",
  "white": "#FFFFFF",
  "sole-soft": "#FEF3C7",
  "azzurro": "#1E40AF",
  "azzurro-deep": "#1E3A8A",
};

export default function WaveDivider({ from, to, flip = false }: { from: Tone; to: Tone; flip?: boolean }) {
  // The SVG paints a wave in `to` colour on a `from` background.
  return (
    <div className="relative w-full -my-px" aria-hidden>
      <svg viewBox="0 0 1440 96" className="block w-full h-16 md:h-20" preserveAspectRatio="none" style={{ background: toneHex[from], transform: flip ? "scaleY(-1)" : undefined }}>
        <path
          d="M0,64 C240,96 480,32 720,48 C960,64 1200,96 1440,56 L1440,96 L0,96 Z"
          fill={toneHex[to]}
        />
      </svg>
    </div>
  );
}
