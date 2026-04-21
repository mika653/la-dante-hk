import PageHeader from "@/components/PageHeader";
import Image from "next/image";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Italian in Hong Kong since 1935."
        subtitle="The Dante Alighieri Society of Hong Kong is a non-profit cultural institution with a 90-year mission — to share the Italian language, culture, and community with the city we call home."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Mural storytelling band */}
      <section className="relative bg-cream py-16 md:py-24">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow">Our mural</p>
              <h2 className="mt-3 text-3xl md:text-5xl">A love letter, in paint.</h2>
              <p className="mt-5 text-ink-muted">
                Hong Kong&apos;s skyline meets Italian landmarks — ICC stands beside the Torre di Pisa, Two IFC alongside the Mole Antonelliana, the Colosseum rising between Bank of China and Jardine House. Each building carries an Italian word that connects it to our curriculum — <em>inclusione, poesia, intersezioni, espressione, comunità</em>.
              </p>
              <p className="mt-4 text-ink-muted">
                The yellow and blue dots aren&apos;t decoration. They&apos;re our flag, our brand, and our reminder that Italy isn&apos;t somewhere else — it&apos;s here, in Hong Kong, every single day.
              </p>
            </div>
            <div className="relative aspect-[4/3] frame bg-white">
              <Image src="/mural.png" alt="La Dante mural" fill className="object-cover rounded-3xl" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      <section id="90-years" className="bg-white py-16 md:py-24 border-t border-line">
        <div className="container-xl">
          <p className="eyebrow">90 years</p>
          <h2 className="mt-3 text-3xl md:text-5xl max-w-2xl">A small society. A long memory.</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {[
              { year: "1935", title: "Founded", body: "A small circle of Italian expats and Hong Kong enthusiasts gather to teach Italian in private homes." },
              { year: "1975", title: "Moved to Wanchai", body: "A permanent classroom opens at the Hong Kong Arts Centre — where we still are today." },
              { year: "2010s", title: "PLIDA accreditation", body: "We become an official PLIDA examination centre for Hong Kong, offering A1–C2 certification." },
              { year: "2020", title: "Online", body: "Rapid shift to live online classes during the pandemic expands our reach across Asia." },
              { year: "2024", title: "1,500+ students", body: "A milestone year — reaching more learners than at any time in our history." },
              { year: "2026", title: "Website reborn", body: "You&apos;re looking at it. New digital home, same 90-year spirit." },
            ].map((m) => (
              <div key={m.year} className="frame p-6 bg-cream-2/50">
                <p className="font-heading font-extrabold text-3xl text-azzurro-deep">{m.year}</p>
                <h3 className="mt-1 font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-ink-muted" dangerouslySetInnerHTML={{ __html: m.body }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="bg-sole-soft py-16 md:py-24">
        <div className="container-xl">
          <p className="eyebrow">Team & board</p>
          <h2 className="mt-3 text-3xl md:text-5xl">Faces you&apos;ll meet.</h2>
          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Giulia Marchetti", role: "Director" },
              { name: "Marco Rossi",      role: "Lead teacher" },
              { name: "Sofia Bianchi",    role: "PLIDA coordinator" },
              { name: "Elena Conti",      role: "Culture programme" },
            ].map((p) => (
              <div key={p.name} className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full bg-ink text-cream font-heading font-extrabold text-5xl inline-flex items-center justify-center">{p.name.split(" ").map((x) => x[0]).join("")}</div>
                <p className="mt-4 font-semibold">{p.name}</p>
                <p className="text-sm text-ink-muted">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
