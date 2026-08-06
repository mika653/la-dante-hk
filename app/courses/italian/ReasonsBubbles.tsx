"use client";
import { useState } from "react";

const REASONS = [
  {
    key: "cultural",
    label: "Cultural Appreciation",
    body: "Italy is one of the world's most beautiful and historically rich countries. According to UNESCO, over 60% of the world's art treasures are in Italy. You can find Italian influence in all major areas of life and culture: from painting arts to architecture, from literature to music, from design to food and wine.",
  },
  {
    key: "career",
    label: "Career Opportunities",
    body: "Italy is among the strongest economies in the world and is home to many international companies. Proficiency in Italian can be an asset in fields like fashion, automotive, design, and hospitality.",
  },
  {
    key: "heritage",
    label: "Connection with Heritage",
    body: "For those of Italian descent, learning the language can foster a connection with their roots and family history.",
  },
  {
    key: "structure",
    label: "Language Structure",
    body: "Italian is known for its phonetic nature, making it relatively easier to learn for English speakers. It also serves as a gateway to learning other Romance languages, like Spanish, French, and Portuguese.",
  },
  {
    key: "community",
    label: "Community",
    body: "There are vibrant Italian-speaking communities worldwide, providing opportunities for social interaction and cultural exchange.",
  },
  {
    key: "travel",
    label: "Travel",
    body: "Italy has it all: from cities and small towns of incomparable value to magnificent countryside, from beautiful mountains to pristine beaches, from still active volcanos to colourful islands. Although joining a tour might be enough to enjoy such beauties, we think that there is only one way to truly penetrate it: speaking a bit of the local language to be able to communicate with the locals and immerse yourself in the places that they know and love.",
  },
  {
    key: "cognitive",
    label: "Cognitive Benefits",
    body: "As widely proven, learning a new language improves cognitive functions, such as problem-solving skills, memory, and multitasking abilities.",
  },
];

// A gentle vertical stagger on larger screens, purely cosmetic — echoes the
// scattered-bubble reference layout without resorting to fragile absolute positioning.
const OFFSET: Record<string, string> = {
  career: "sm:mt-8",
  travel: "sm:mt-10",
  cognitive: "sm:mt-4",
};

export default function ReasonsBubbles() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
      {REASONS.map((r) => {
        const isOpen = openKey === r.key;
        return (
          <button
            key={r.key}
            type="button"
            onClick={() => setOpenKey(isOpen ? null : r.key)}
            aria-expanded={isOpen}
            className={`flex items-center justify-center text-center p-4 md:p-5 transition-all duration-200 ${OFFSET[r.key] ?? ""} ${
              isOpen
                ? "rounded-3xl bg-azzurro-deep text-cream min-h-[9rem] shadow-lg"
                : "rounded-full aspect-square bg-azzurro text-ink hover:bg-azzurro-deep hover:text-cream"
            }`}
          >
            {isOpen ? (
              <span className="text-[12px] md:text-[13px] leading-relaxed font-normal">{r.body}</span>
            ) : (
              <span className="text-[13px] md:text-sm font-semibold leading-tight">{r.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
