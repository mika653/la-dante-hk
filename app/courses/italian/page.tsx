import PageHeader from "@/components/PageHeader";
import ReasonsBubbles from "./ReasonsBubbles";

export default function ItalianPage() {
  return (
    <>
      <PageHeader
        eyebrow="Italian · 意大利文課程"
        title="Why study Italian?"
        subtitle="Knowledge of another culture broadens your horizons and changes you in a profound way. Italian language and culture are not exceptions and learning them can enrich your personal, professional, and cultural experiences. Check out the seven reasons why you should embark on such an amazing learning experience."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian" }]}
        tone="sole-soft"
      />

      <section className="bg-white py-14 md:py-16">
        <div className="container-xl">
          <ReasonsBubbles />
        </div>
      </section>

      <section className="bg-cream py-14 md:py-16 border-t border-line">
        <div className="container-xl max-w-3xl">
          <p className="eyebrow">Why learn Italian at La Dante?</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-heading font-bold">Dante Alighieri Society Hong Kong</h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-muted">
            <p>Dante Alighieri Society, your home for Italian language and culture in Hong Kong since 1934.</p>
            <p>Learn Italian and Latin with the most established and institutionally connected Italian centre, part of the globally recognised Società Dante Alighieri in Rome, with centres in more than 80 countries worldwide.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16 border-t border-line">
        <div className="container-xl max-w-3xl">
          <p className="eyebrow">Our approach</p>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed">
            <p>The communicative approach is based on the idea that learning language successfully comes through having to communicate real meaning. When learners are involved in real communication, their natural strategies for language acquisition will be used, and this will allow them to learn to use the language.</p>
            <p className="font-medium text-ink">📚 Forget about boring and endless grammar classes. At La Dante, we make learning Italian a stimulating and fun experience in a relaxed environment where learning is naturally enhanced. 📚</p>
          </div>
        </div>
      </section>

      {/* Our community — student demographics */}
      <section className="bg-azzurro-deep text-cream py-16 md:py-20">
        <div className="container-xl">
          <p className="eyebrow text-cream/70!">Our community</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-balance max-w-2xl text-cream!">A community that looks like&nbsp;Hong&nbsp;Kong.</h2>
          <p className="mt-3 text-cream/80 max-w-xl">From curious three-year-olds to lifelong learners over sixty-five — our classrooms bring together locals and friends from around the world.</p>
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {[
              { stat: "~80%", label: "local to Hong Kong", sub: "the rest joining us from around the world" },
              { stat: "35", label: "average age", sub: "we welcome learners from 3 to 65+" },
              { stat: "6–10%", label: "kids & teens", sub: "the rest, adults of every age and stage" },
            ].map((s) => (
              <div key={s.label} className="rounded-3xl bg-cream/10 p-7">
                <p className="font-heading font-extrabold text-5xl md:text-6xl text-sole">{s.stat}</p>
                <p className="mt-3 font-semibold text-lg">{s.label}</p>
                <p className="mt-1 text-sm text-cream/70 leading-relaxed">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
