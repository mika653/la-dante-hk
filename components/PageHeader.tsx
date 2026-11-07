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
  // Per Giulia: a standard yellow banner on every landing page. The `tone` prop is
  // kept for backwards-compatibility but no longer changes the banner colour.
  void tone;
  const sub = "text-ink/70";
  const eb = "";
  return (
    <section className={`bg-sole text-ink pt-12 pb-16 md:pt-20 md:pb-24 border-b border-ink/10`}>
      <div className="container-xl">
        {crumbs && (
          <nav aria-label="Breadcrumb" className={`text-[13px] ${sub} flex items-center gap-1.5 mb-4 flex-wrap`}>
            {crumbs.map((c, i) => (
              <span key={c.label} className="inline-flex items-center gap-1.5">
                {c.href ? <Link href={c.href} className="hover:text-azzurro-deep">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
                {i < crumbs.length - 1 && <ChevronRight size={13} className="opacity-50" aria-hidden />}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className={`eyebrow ${eb}`}>{eyebrow}</p>}
        <h1 className="mt-3 text-4xl md:text-6xl max-w-3xl text-ink">{title}</h1>
        {subtitle && <p className={`mt-5 max-w-2xl text-lg ${sub}`}>{subtitle}</p>}
      </div>
    </section>
  );
}
