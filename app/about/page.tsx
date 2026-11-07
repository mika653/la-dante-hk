import PageHeader from "@/components/PageHeader";
import Image from "next/image";

export default function About() {
  // --- Team section data (Giulia's structure: Board → Management → Teachers) ---
  const initials = (name: string) =>
    name
      .replace(/^(?:Dr|Prof)\.?\s+/i, "")
      .split(/[\s-]+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const avatarColors = [
    "bg-ink text-cream",
    "bg-azzurro-deep text-cream",
    "bg-azzurro text-ink",
  ];

  const board = [
    { name: "Bruno Feltracco", role: "President" },
    { name: "Alessandra Cocchi-Joynt", role: "Vice President" },
    { name: "Francesco Rinaldi", role: "Treasurer" },
    { name: "Manoj Kumar Motwani", role: "Board Member" },
    { name: "Anna Romagnoli", role: "Board Member" },
    { name: "Averardo Borghini Baldovinetti", role: "Board Member" },
    { name: "Francesca Biroli", role: "Board Member" },
    { name: "Giuseppe Randazzo", role: "Board Member" },
    { name: "Giovanni Angelini", role: "Board Member" },
    { name: "Dr. Richard Lee", role: "Patron" },
    { name: "Andrea Croci", role: "Honorary Member" },
  ];

  const staff = [
    { name: "Giulia Capasso", role: "School Coordinator", email: "giulia@ladante.cc" },
    { name: "Alice Agostini", role: "Office Manager", email: "alice@ladante.cc" },
    { name: "Bill Chen", role: "Administrative & IT", email: "bill@ladante.cc" },
    { name: "Johnny Yuen", role: "Marketing Officer", email: "johnny@ladante.cc" },
  ];

  const teachers = [
    "Francesca Coppeta",
    "Clelia Marinucci",
    "Giorgia Zecchinato",
    "Raffaella Iaconeta",
    "Jacopo Gorini",
  ];

  const everyone = [...board, ...staff, ...teachers.map((name) => ({ name }))];

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Italian in Hong Kong since 1934."
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
              { year: "1934", title: "Founded", body: "A small circle of Italian expats and Hong Kong enthusiasts gather to teach Italian in private homes." },
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

      <section id="team" className="bg-sole py-16 md:py-24">
        <div className="container-xl">
          <p className="eyebrow">Our team</p>
          <h2 className="mt-3 text-3xl md:text-5xl text-balance">Faces you&apos;ll meet.</h2>
          <p className="mt-4 max-w-2xl text-ink-muted">
            A board of directors, a small management team, and the teachers who bring
            Italian to life every day &mdash; the people behind La&nbsp;Dante.
          </p>

          {/* Collage — a montage of monogram avatars for the whole team */}
          <div
            aria-hidden="true"
            className="mt-10 flex flex-wrap justify-center gap-y-3"
          >
            {everyone.map((p, i) => (
              <div
                key={`collage-${p.name}`}
                title={p.name}
                className={`-ml-3 first:ml-0 w-14 h-14 md:w-16 md:h-16 rounded-full ring-4 ring-sole ${avatarColors[i % avatarColors.length]} font-heading font-extrabold text-base md:text-lg inline-flex items-center justify-center`}
              >
                {initials(p.name)}
              </div>
            ))}
          </div>

          {/* 1. Board of Directors */}
          <div className="mt-16 pt-12 border-t border-ink/10">
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-balance">Board of Directors</h3>
            <p className="mt-2 text-sm text-ink-muted">Governance, patrons &amp; honorary members.</p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {board.map((p) => (
                <div key={p.name} className="text-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full bg-ink text-cream font-heading font-extrabold text-2xl md:text-3xl inline-flex items-center justify-center">{initials(p.name)}</div>
                  <p className="mt-4 font-semibold leading-tight text-balance">{p.name}</p>
                  <p className="text-sm text-ink-muted">{p.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Management & Administration */}
          <div className="mt-16 pt-12 border-t border-ink/10">
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-balance">Management &amp; Administration</h3>
            <p className="mt-2 text-sm text-ink-muted">The team running the school day to day.</p>
            <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {staff.map((p) => (
                <div key={p.name} className="text-center">
                  <div className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full bg-azzurro-deep text-cream font-heading font-extrabold text-3xl md:text-4xl inline-flex items-center justify-center">{initials(p.name)}</div>
                  <p className="mt-4 font-semibold">{p.name}</p>
                  <p className="text-sm text-ink-muted">{p.role}</p>
                  <a href={`mailto:${p.email}`} className="text-xs text-azzurro-deep hover:underline break-all">{p.email}</a>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Teachers */}
          <div className="mt-16 pt-12 border-t border-ink/10">
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-balance">Teachers</h3>
            <p className="mt-2 text-sm text-ink-muted">Our Italian teachers, A1 to C2.</p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
              {teachers.map((name) => (
                <div key={name} className="text-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full bg-azzurro text-ink font-heading font-extrabold text-2xl md:text-3xl inline-flex items-center justify-center">{initials(name)}</div>
                  <p className="mt-3 font-semibold text-sm">{name}</p>
                  <p className="text-xs text-ink-muted">Italian teacher</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
