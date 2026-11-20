"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Landmark, Briefcase, HeartHandshake, Languages, Users, Plane, Brain, type LucideIcon } from "lucide-react";

// "Why study Italian?" — a friendly espresso-cup mascot with seven colourful
// reason-bubbles orbiting it (desktop) / clustered below it (mobile). Click a
// bubble to pop the full reason in a dialog. Built to the UX spec: 4-colour
// rotation (no adjacent repeats), defined bubble edges on a soft panel, gentle
// desynced float, one dialog at a time with focus handling + reduced-motion.

type Reason = {
  key: string;
  short: string;          // punchy word on the bubble
  title: string;          // full title (dialog heading; also the accessible name)
  body: string;
  bg: string;             // bubble background class
  text: string;           // bubble label colour class
  light: boolean;         // light bubble → needs an edge ring + ink focus ring
  hex: string;            // bubble colour (dialog accent)
  Icon: LucideIcon;
  pos: { left: number; top: number }; // desktop orbit position (%)
  bob: string;            // float keyframe class
  delay: string;          // animation-delay
};

const REASONS: Reason[] = [
  { key: "cultural",  short: "Culture",       title: "Cultural Appreciation",   bg: "bg-sole",         text: "text-ink",   light: true,  hex: "#ffed4e", Icon: Landmark,      pos: { left: 50.0, top: 13.9 }, bob: "rb-a", delay: "0s",
    body: "Italy is one of the world's most beautiful and historically rich countries. According to UNESCO, over 60% of the world's art treasures are in Italy. You can find Italian influence in all major areas of life and culture: from painting arts to architecture, from literature to music, from design to food and wine." },
  { key: "career",    short: "Careers",       title: "Career Opportunities",    bg: "bg-rosso",        text: "text-cream", light: false, hex: "#dc2626", Icon: Briefcase,     pos: { left: 78.2, top: 27.5 }, bob: "rb-b", delay: "-0.9s",
    body: "Italy is among the strongest economies in the world and is home to many international companies. Proficiency in Italian can be an asset in fields like fashion, automotive, design, and hospitality." },
  { key: "heritage",  short: "Heritage",      title: "Connection with Heritage", bg: "bg-azzurro",     text: "text-ink",   light: true,  hex: "#a6e4f8", Icon: HeartHandshake, pos: { left: 85.2, top: 58.0 }, bob: "rb-c", delay: "-1.8s",
    body: "For those of Italian descent, learning the language can foster a connection with their roots and family history." },
  { key: "structure", short: "Easy to learn", title: "Language Structure",      bg: "bg-azzurro-deep", text: "text-cream", light: false, hex: "#075985", Icon: Languages,     pos: { left: 65.7, top: 82.5 }, bob: "rb-a", delay: "-2.7s",
    body: "Italian is known for its phonetic nature, making it relatively easier to learn for English speakers. It also serves as a gateway to learning other Romance languages, like Spanish, French, and Portuguese." },
  { key: "community", short: "Community",     title: "Community",                     bg: "bg-sole",        text: "text-ink",   light: true,  hex: "#ffed4e", Icon: Users,         pos: { left: 34.3, top: 82.5 }, bob: "rb-b", delay: "-1.2s",
    body: "There are vibrant Italian-speaking communities worldwide, providing opportunities for social interaction and cultural exchange." },
  { key: "travel",    short: "Travel",        title: "Travel",                        bg: "bg-rosso",       text: "text-cream", light: false, hex: "#dc2626", Icon: Plane,         pos: { left: 14.8, top: 58.0 }, bob: "rb-c", delay: "-2.1s",
    body: "Italy has it all: from cities and small towns of incomparable value to magnificent countryside, from beautiful mountains to pristine beaches, from still active volcanos to colourful islands. Although joining a tour might be enough to enjoy such beauties, we think that there is only one way to truly penetrate it: speaking a bit of the local language to communicate with the locals and immerse yourself in the places that they know and love." },
  { key: "cognitive", short: "Brain boost",   title: "Cognitive Benefits",      bg: "bg-azzurro",     text: "text-ink",   light: true,  hex: "#a6e4f8", Icon: Brain,         pos: { left: 21.8, top: 27.5 }, bob: "rb-a", delay: "-0.4s" ,
    body: "As widely proven, learning a new language improves cognitive functions, such as problem-solving skills, memory, and multitasking abilities." },
];

function EspressoMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="A friendly Italian espresso cup">
      <g className="rb-float">
        {/* saucer */}
        <ellipse cx="120" cy="206" rx="80" ry="14" fill="#ffed4e" stroke="#191919" strokeWidth="3" />
        {/* cup body */}
        <path d="M64,120 L176,120 L166,196 Q166,202 150,202 L90,202 Q74,202 74,196 Z" fill="#fafafa" stroke="#191919" strokeWidth="4" strokeLinejoin="round" />
        {/* handle */}
        <path d="M176,142 Q208,144 208,166 Q208,188 176,186" fill="none" stroke="#191919" strokeWidth="8" strokeLinecap="round" />
        {/* coffee surface */}
        <ellipse cx="120" cy="120" rx="56" ry="12" fill="#191919" />
        <ellipse cx="120" cy="120" rx="56" ry="12" fill="none" stroke="#a6e4f8" strokeWidth="3" />
        {/* steam */}
        <g className="rb-steam" stroke="#075985" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7">
          <path d="M104,112 q-9,-12 0,-24 q9,-12 0,-24" />
          <path d="M136,112 q9,-12 0,-24 q-9,-12 0,-24" />
        </g>
        {/* face */}
        <circle cx="90" cy="164" r="7" fill="#dc2626" opacity="0.7" />
        <circle cx="150" cy="164" r="7" fill="#dc2626" opacity="0.7" />
        <circle cx="104" cy="150" r="6" fill="#191919" />
        <circle cx="136" cy="150" r="6" fill="#191919" />
        <path d="M104,166 Q120,180 136,166" fill="none" stroke="#191919" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function ReasonsBubbles() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const active = useMemo(() => REASONS.find((r) => r.key === openKey) ?? null, [openKey]);

  // Focus the dialog on open; Esc closes; return focus to the bubble on close.
  useEffect(() => {
    if (!openKey) return;
    const prev = openKey;
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenKey(null); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      triggers.current[prev]?.focus();
    };
  }, [openKey]);

  const bubbleClass = (r: Reason, extra = "") =>
    `rb-bubble group inline-flex flex-col items-center justify-center text-center rounded-full ${r.bg} ${r.text} ${r.light ? "ring-1 ring-ink/12" : ""} shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-pop)] transition-transform duration-200 hover:scale-[1.06] focus-visible:outline-none ${r.light ? "focus-visible:ring-[3px] focus-visible:ring-ink" : "focus-visible:ring-[3px] focus-visible:ring-cream"} ${extra}`;

  const BubbleInner = ({ r, size }: { r: Reason; size: number }) => (
    <>
      <r.Icon size={size} aria-hidden className="mb-1 opacity-90" />
      <span className="font-body font-semibold leading-tight px-2" style={{ fontSize: 14 }}>{r.short}</span>
    </>
  );

  return (
    <section role="group" aria-label="Seven reasons to study Italian">
      <h2 className="sr-only">Seven reasons to study Italian</h2>

      {/* keyframes + reduced-motion handling, scoped by class name */}
      <style>{`
        @keyframes rb-a { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes rb-b { 0%,100% { transform: translateY(0); } 50% { transform: translateY(7px); } }
        @keyframes rb-c { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .rb-a { animation: rb-a 6s ease-in-out infinite; }
        .rb-b { animation: rb-b 7.2s ease-in-out infinite; }
        .rb-c { animation: rb-c 6.6s ease-in-out infinite; }
        /* pause the float while the bubble is hovered/focused so it holds still to click */
        .rb-floater:hover, .rb-floater:has(:focus-visible) { animation-play-state: paused; }
        .rb-float { animation: rb-a 6s ease-in-out infinite; }
        .rb-steam { animation: rb-c 3.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rb-a, .rb-b, .rb-c, .rb-float, .rb-steam { animation: none !important; transform: none !important; }
        }
      `}</style>

      <div className="rounded-frame bg-azzurro-soft/50 border border-azzurro/30 p-6 md:p-10">
        {/* Desktop: orbit */}
        <div className="relative hidden lg:block mx-auto aspect-square w-full max-w-[720px]">
          <svg viewBox="0 0 720 720" className="absolute inset-0 w-full h-full" aria-hidden>
            <circle cx="360" cy="360" r="260" fill="none" stroke="#a6e4f8" strokeOpacity="0.6" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] z-10">
            <EspressoMascot className="w-full h-auto" />
          </div>
          {REASONS.map((r) => (
            // 3 layers so the centering transform and the float transform don't fight:
            // wrapper = absolute position + centre; floater = bob (translateY); button = hover scale.
            <div key={r.key} className="absolute z-20" style={{ left: `${r.pos.left}%`, top: `${r.pos.top}%`, transform: "translate(-50%, -50%)" }}>
              <div className={`rb-floater ${r.bob}`} style={{ animationDelay: r.delay }}>
                <button
                  ref={(el) => { triggers.current[r.key] = el; }}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={openKey === r.key}
                  aria-label={r.title.replace(/ /g, " ")}
                  onClick={() => setOpenKey(r.key)}
                  className={bubbleClass(r, "w-32 h-32")}
                >
                  <BubbleInner r={r} size={26} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / tablet: figure + flex-wrap cluster */}
        <div className="lg:hidden">
          <div className="mx-auto w-40"><EspressoMascot className="w-full h-auto" /></div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {REASONS.map((r) => (
              <button
                key={r.key}
                ref={(el) => { triggers.current[r.key] = el; }}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={openKey === r.key}
                aria-label={r.title.replace(/ /g, " ")}
                onClick={() => setOpenKey(r.key)}
                className={bubbleClass(r, "w-28 h-28")}
              >
                <BubbleInner r={r} size={24} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {active && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/35" role="presentation" onClick={() => setOpenKey(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reason-title"
            aria-describedby="reason-body"
            onClick={(e) => e.stopPropagation()}
            className="rb-pop relative w-full max-w-[460px] rounded-frame bg-white shadow-[var(--shadow-pop)] overflow-hidden"
          >
            <div className="h-2" style={{ background: active.hex }} />
            <div className="p-6 md:p-7">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full inline-flex items-center justify-center shrink-0" style={{ background: active.hex, color: active.light ? "#191919" : "#fafafa" }}>
                    <active.Icon size={18} aria-hidden />
                  </span>
                  <h3 id="reason-title" className="text-xl font-heading font-bold text-balance">{active.title}</h3>
                </div>
                <button ref={closeRef} type="button" onClick={() => setOpenKey(null)} aria-label="Close" className="w-9 h-9 -mr-1 -mt-1 rounded-full hover:bg-ink/10 inline-flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
                  <X size={18} />
                </button>
              </div>
              <p id="reason-body" className="mt-4 text-[15px] leading-relaxed text-ink-muted">{active.body}</p>
            </div>
          </div>
        </div>,
        document.body,
      )}

      <style>{`
        @keyframes rb-pop { 0% { opacity: 0; transform: scale(0.92); } 100% { opacity: 1; transform: scale(1); } }
        .rb-pop { animation: rb-pop 200ms ease-out; }
        @media (prefers-reduced-motion: reduce) { .rb-pop { animation: none !important; } }
      `}</style>
    </section>
  );
}
