import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  Feather,
  Film,
  MapPin,
  ImageIcon,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "The Italian Library — La Dante HK" };

// Library landing page. Giulia asked for the Library to live on its own page,
// covering the three offerings: "Borrow a book", the "Il Salotto di Dante" book
// club, and "Presidio Letterario". Copy is adapted from the shared LibraryTrio
// section (components/LibraryTrio.tsx) and the homepage culture copy — that
// shared component is intentionally left untouched.

type Offering = {
  id: string;
  Icon: typeof BookOpen;
  kicker: string;
  title: string; // final two words bound with &nbsp; to avoid a heading widow
  lead: string;
  points: string[];
  cta: { label: string; href: string };
  // Caption shown inside the clearly-marked image placeholder.
  imageLabel: string;
};

const OFFERINGS: Offering[] = [
  {
    id: "borrow",
    Icon: BookOpen,
    kicker: "Lending library",
    title: "Borrow a book",
    lead:
      "Over 1,400 Italian titles live on our shelves in Wanchai — novels and poetry, children's picture books, graphic novels, language readers and a growing collection of Italian cinema on DVD. Members can borrow them free of charge.",
    points: [
      "1,400+ Italian books & DVDs to take home",
      "Every level, from first words (A1) to mother-tongue",
      "Browse and borrow on your next visit to the school",
    ],
    cta: { label: "Become a member", href: "/membership" },
    imageLabel: "Library shelves",
  },
  {
    id: "bookclub",
    Icon: Users,
    kicker: "Book club",
    title: "Il Salotto di Dante",
    lead:
      "Community, books, and the occasional bottle of wine. Our book club gathers to read a title together in Italian — with gentle English support — then meets to talk it over like old friends in a Roman salotto.",
    points: [
      "Guided reading in Italian, with English support",
      "Relaxed evening sessions — see the events calendar for dates",
      "Open to members and curious non-members alike",
    ],
    cta: { label: "See upcoming sessions", href: "/culture" },
    imageLabel: "Book club evening",
  },
  {
    id: "presidio",
    Icon: Feather,
    kicker: "Dante Alighieri Society programme",
    title: "Presidio Letterario",
    lead:
      "Presidio Letterario is the Dante Alighieri Society's reading initiative — “literary garrisons” that champion great writing and bring readers together around it. As part of the worldwide Dante network, La Dante HK carries that spirit to Hong Kong.",
    points: [
      "Part of the global Dante Alighieri Society programme",
      "Celebrating Italian literature, old and new",
      "Readings and author moments throughout the year",
    ],
    cta: { label: "Ask about joining", href: "/contact" },
    imageLabel: "Readings & authors",
  },
];

// A clearly-marked placeholder for imagery the client will supply.
function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      title="Image placeholder — to be supplied by the client"
      className="relative aspect-[4/3] frame bg-sole-soft border border-dashed border-ink/20 flex flex-col items-center justify-center gap-3 text-ink-soft"
    >
      <ImageIcon size={40} strokeWidth={1.5} />
      <span className="font-heading font-semibold text-sm uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[11px] uppercase tracking-widest text-ink-soft/80">
        Image placeholder
      </span>
    </div>
  );
}

export default function Library() {
  return (
    <>
      <PageHeader
        eyebrow="Culture · Library"
        title={"The Italian Library."}
        subtitle={
          "1,400+ Italian books and DVDs to borrow, a book club that feels like a salotto, and Presidio Letterario — the Dante Society's love letter to great writing."
        }
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Culture", href: "/culture" },
          { label: "Library" },
        ]}
      />

      {/* Intro — the heart of community, with quick jumps to each offering */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-xl">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <p className="eyebrow">Il Salotto di Dante</p>
              <h2 className="mt-3 text-3xl md:text-5xl text-balance">
                The heart of Dante&nbsp;life.
              </h2>
              <p className="mt-5 text-ink-muted max-w-xl">
                Beyond the classroom, the library is where our community reads,
                borrows, argues happily about novels and shares a glass of wine.
                Three ways in — pick yours.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {OFFERINGS.map((o) => (
                  <a
                    key={o.id}
                    href={`#${o.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-line text-sm font-medium hover:border-ink transition-colors"
                  >
                    <o.Icon size={15} className="text-azzurro-deep" />
                    {o.kicker}
                  </a>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
                <MapPin size={15} className="text-azzurro-deep shrink-0" />
                <span>
                  On the shelves at the school in Wanchai.{" "}
                  <span className="text-ink-soft">
                    {/* PLACEHOLDER: client to confirm library opening hours & loan terms */}
                    Opening hours &amp; borrowing terms to be confirmed.
                  </span>
                </span>
              </div>
            </div>
            <ImagePlaceholder label="The Salotto" />
          </div>
        </div>
      </section>

      {/* The three offerings — alternating feature rows */}
      {OFFERINGS.map((o, i) => {
        const reversed = i % 2 === 1;
        const band = i % 2 === 1 ? "bg-paper" : "bg-white";
        return (
          <section
            key={o.id}
            id={o.id}
            className={`${band} py-16 md:py-24 border-t border-line scroll-mt-24`}
          >
            <div className="container-xl">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className={reversed ? "lg:order-2" : ""}>
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sole text-ink mb-5">
                    <o.Icon size={22} strokeWidth={1.75} />
                  </span>
                  <p className="eyebrow">{o.kicker}</p>
                  <h2 className="mt-3 text-3xl md:text-5xl text-balance">
                    {o.title}
                  </h2>
                  <p className="mt-5 text-ink-muted max-w-xl">{o.lead}</p>
                  <ul className="mt-6 space-y-2.5">
                    {o.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-2 w-1.5 h-1.5 rounded-full bg-azzurro-deep shrink-0"
                        />
                        <span className="text-[15px]">{p}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={o.cta.href} className="btn btn-primary mt-8">
                    {o.cta.label} <ArrowRight size={16} />
                  </Link>
                </div>
                <div className={reversed ? "lg:order-1" : ""}>
                  <ImagePlaceholder label={o.imageLabel} />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* On-the-shelves strip — a light taste of the collection */}
      <section className="bg-azzurro-soft py-16 md:py-20 border-t border-line">
        <div className="container-xl">
          <p className="eyebrow">On the shelves</p>
          <h2 className="mt-3 text-3xl md:text-4xl text-balance">
            A little bit of everything&nbsp;Italian.
          </h2>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { Icon: BookOpen, label: "Novels & poetry" },
              { Icon: Feather, label: "Classics" },
              { Icon: BookOpen, label: "Children's books" },
              { Icon: BookOpen, label: "Graphic novels" },
              { Icon: BookOpen, label: "Language readers" },
              { Icon: Film, label: "Italian cinema (DVD)" },
            ].map((c) => (
              <div
                key={c.label}
                className="frame bg-white p-5 flex flex-col items-center text-center gap-3"
              >
                <c.Icon size={24} className="text-azzurro-deep" aria-hidden />
                <span className="text-sm font-medium leading-snug">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-muted">
            {/* PLACEHOLDER: client to confirm the full catalogue breakdown */}
            Categories shown are indicative — the full catalogue is on the
            shelves at the school.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink py-14 md:py-16">
        <div className="container-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-cream! text-2xl md:text-3xl font-heading font-bold text-balance">
              Italy, one book at a&nbsp;time.
            </h2>
            <p className="mt-2 text-cream/70 max-w-xl">
              Library and book club access comes with every La Dante
              membership.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/membership" className="btn btn-yellow">
              Become a member <ArrowRight size={16} />
            </Link>
            <Link href="/culture" className="btn btn-outline-white">
              Back to Culture
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
