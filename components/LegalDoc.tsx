import Link from "next/link";
import type { LegalSection } from "@/lib/legal-content";

// Renders a legal document (privacy / cookie policy) from structured data.
// `links` maps a phrase to an internal href so cross-references stay live.
export default function LegalDoc({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="bg-cream py-14 md:py-20">
      <div className="container-xl max-w-3xl">
        <div className="frame bg-white p-7 md:p-10 space-y-8">
          {sections.map((s, i) => (
            <div key={i} className="space-y-3">
              {s.heading && <h2 className="text-xl md:text-2xl font-heading font-bold">{s.heading}</h2>}
              {s.blocks.map((b, j) =>
                "list" in b ? (
                  <ul key={j} className="list-disc pl-5 space-y-1.5 text-[15px] text-ink-muted marker:text-azzurro-deep">
                    {b.list.map((li, k) => <li key={k}>{withLinks(li)}</li>)}
                  </ul>
                ) : (
                  <p key={j} className="text-[15px] leading-relaxed text-ink-muted">{withLinks(b.p)}</p>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Turn known cross-references and the contact email into real links, keeping the
// legal wording intact.
function withLinks(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const rules: { re: RegExp; render: (m: string, key: string) => React.ReactNode }[] = [
    { re: /Cookie Policy/g, render: (m, key) => <Link key={key} href="/cookie-policy" className="text-azzurro-deep underline underline-offset-2">{m}</Link> },
    { re: /Privacy Policy/g, render: (m, key) => <Link key={key} href="/privacy" className="text-azzurro-deep underline underline-offset-2">{m}</Link> },
    { re: /dantealighieri@ladante\.cc/g, render: (m, key) => <a key={key} href={`mailto:${m}`} className="text-azzurro-deep underline underline-offset-2">{m}</a> },
  ];
  // Tokenise: find the earliest match across all rules, repeatedly.
  let rest = text;
  let guard = 0;
  while (rest && guard++ < 100) {
    let best: { idx: number; len: number; node: React.ReactNode } | null = null;
    for (const { re, render } of rules) {
      re.lastIndex = 0;
      const m = re.exec(rest);
      if (m && (best === null || m.index < best.idx)) {
        best = { idx: m.index, len: m[0].length, node: render(m[0], `${guard}-${m.index}`) };
      }
    }
    if (!best) { parts.push(rest); break; }
    if (best.idx > 0) parts.push(rest.slice(0, best.idx));
    parts.push(best.node);
    rest = rest.slice(best.idx + best.len);
  }
  return parts;
}
