import { sponsors } from "@/lib/data";

export default function SponsorsStrip() {
  return (
    <section className="bg-cream py-16 md:py-24 border-t border-line">
      <div className="container-xl text-center">
        <p className="eyebrow">Classroom sponsors · A–G</p>
        <h2 className="mt-3 text-3xl md:text-4xl">Proudly supported by.</h2>

        <div className="mt-10">
          <p className="eyebrow text-sole">Gold sponsor</p>
          <div className="mt-4 flex justify-center">
            {sponsors.gold.map((s) => (
              <div key={s.name} className="px-8 py-6 frame bg-white">
                <span className="font-heading font-extrabold text-2xl md:text-3xl tracking-wider">{s.logo}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="eyebrow">Silver sponsors</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-6 items-center">
            {sponsors.silver.map((s) => (
              <div key={s.name} className="font-heading font-bold tracking-wider text-[11px] sm:text-sm md:text-base text-ink-muted hover:text-ink transition-colors text-center break-words">
                {s.logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
