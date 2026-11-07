import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import WorkshopsGrid from "@/components/WorkshopsGrid";
import CultureEventsClient from "./CultureEventsClient";

export default function Culture() {
  return (
    <>
      <PageHeader
        eyebrow="Culture"
        title="Events, workshops, library."
        subtitle="Italy beyond the textbook. Screenings, aperitivi, bookclubs, and workshops — open to members and non-members."
        crumbs={[{ label: "Home", href: "/" }, { label: "Culture" }]}
      />
      <CultureEventsClient />
      <WorkshopsGrid />

      {/* Library teaser — links through to the dedicated Library landing page */}
      <section className="bg-sole py-14 md:py-16">
        <div className="container-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="eyebrow inline-flex items-center gap-2">
              <BookOpen size={15} /> The Library
            </p>
            <h2 className="mt-3 text-2xl md:text-4xl text-balance">
              1,400+ books, a book club, and Presidio&nbsp;Letterario.
            </h2>
            <p className="mt-3 text-ink/70 max-w-xl">
              Borrow Italian books and DVDs, join Il Salotto di Dante, and dive
              into our literary programme.
            </p>
          </div>
          <Link href="/culture/library" className="btn btn-primary shrink-0">
            Explore the Library <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
