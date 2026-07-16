import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";
import { workshops } from "@/lib/data";
import { Users } from "lucide-react";

export const metadata = { title: "Workshops & special courses — La Dante HK" };

export default function WorkshopsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Beyond the classroom"
        title="Workshops & special courses."
        subtitle="Cooking, cinema, wine, opera, conversation — short cultural courses that bring Italian to life. Some are planned; others we open once enough of you want them."
        crumbs={[{ label: "Home", href: "/" }, { label: "Workshops" }]}
        tone="sole-soft"
      />

      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workshops.map((w) => (
              <article key={w.id} className="frame p-6 bg-white flex flex-col">
                <div className="text-3xl" aria-hidden>{w.image}</div>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  {w.status === "planned" ? (
                    <span className="px-2.5 py-1 rounded-full bg-azzurro/10 text-azzurro-deep font-medium uppercase tracking-wider">Planned · {w.dateLabel}</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-sole text-ink font-medium uppercase tracking-wider inline-flex items-center gap-1">
                      <Users size={12} /> {w.interested} interested
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{w.title}</h3>
                <p className="mt-2 text-[14px] text-ink-muted leading-relaxed flex-1">{w.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="bg-white py-14 md:py-20 border-t border-line scroll-mt-24">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="workshop" />
        </div>
      </section>
    </>
  );
}
