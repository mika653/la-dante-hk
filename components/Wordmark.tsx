import Link from "next/link";

export default function Wordmark({ className = "", color = "ink" }: { className?: string; color?: "ink" | "cream" }) {
  const tone = color === "cream" ? "text-cream" : "text-ink";
  const accent = color === "cream" ? "text-sole" : "text-azzurro";
  return (
    <Link href="/" aria-label="La Dante HK — home" className={`inline-flex items-baseline font-heading font-extrabold tracking-tight text-2xl md:text-3xl ${tone} ${className}`}>
      <span>D</span>
      <svg viewBox="0 0 12 20" aria-hidden className={`w-[0.55em] h-[0.9em] mx-[1px] ${accent}`}>
        <path d="M2 18 C 4 12, 8 8, 10 2" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </svg>
      <span>ante HK</span>
    </Link>
  );
}
