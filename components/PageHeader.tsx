import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
  tone = "cream",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  tone?: "cream" | "sole-soft" | "azzurro";
}) {
  const bg = tone === "azzurro" ? "bg-azzurro text-cream" : tone === "sole-soft" ? "bg-sole-soft" : "bg-cream";
  const sub = tone === "azzurro" ? "text-cream/80" : "text-ink-muted";
  const eb = tone === "azzurro" ? "!text-sole" : "";
  return (
    <section className={`${bg} pt-12 pb-16 md:pt-20 md:pb-24 border-b border-line/50`}>
      <div className="container-xl">
        {crumbs && (
          <nav aria-label="Breadcrumb" className={`text-[13px] ${sub} flex items-center gap-1.5 mb-4 flex-wrap`}>
            {crumbs.map((c, i) => (
              <span key={c.label} className="inline-flex items-center gap-1.5">
                {c.href ? <Link href={c.href} className="hover:text-azzurro">{c.label}</Link> : <span className={tone === "azzurro" ? "text-cream" : "text-ink"}>{c.label}</span>}
                {i < crumbs.length - 1 && <ChevronRight size={13} className="opacity-50" aria-hidden />}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className={`eyebrow ${eb}`}>{eyebrow}</p>}
        <h1 className={`mt-3 text-4xl md:text-6xl max-w-3xl ${tone === "azzurro" ? "text-cream" : ""}`}>{title}</h1>
        {subtitle && <p className={`mt-5 max-w-2xl text-lg ${sub}`}>{subtitle}</p>}
      </div>
    </section>
  );
}
