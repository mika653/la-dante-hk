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
            <p>Dante Alighieri Society, your home for Italian language and culture in Hong Kong since 1935.</p>
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
    </>
  );
}
