import Link from "next/link";
import { ArrowRight, Timer, GraduationCap, IdCard, Gift, Tag } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = { title: "Special offers — La Dante HK" };

// Landing page for the announcement-bar "See all offers" link (per Giulia).
// Copy mirrors the offers advertised in the top banner; exact rates/terms are
// confirmed by the office, so no numbers are invented here beyond the banner's.
const OFFERS = [
  {
    Icon: Timer,
    tag: "New term",
    title: "Early-bird discount",
    body: "Enrol early for the new term and save on your group course. Ask the office for this term's early-bird rate and deadline.",
    href: "/courses/italian/adult-groups",
    cta: "See group courses",
  },
  {
    Icon: GraduationCap,
    tag: "10% off",
    title: "University students & seniors",
    body: "10% off our courses for full-time university students and seniors. Bring a valid student or senior ID when you enrol.",
    href: "/courses",
    cta: "Browse all courses",
  },
  {
    Icon: IdCard,
    tag: "Members",
    title: "Member discounts & perks",
    body: "Your Dante membership card unlocks discounts on selected cultural activities and short courses, plus offers at partner restaurants, wine shops and more.",
    href: "/membership#perks",
    cta: "See member perks",
  },
  {
    Icon: Gift,
    tag: "Gift",
    title: "Give Italian",
    body: "Gift a course or a membership to someone who loves Italy.",
    href: "/gift",
    cta: "Gift options",
  },
];

export default function SpecialOffersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Special offers"
        title="Offerte speciali."
        subtitle="Current discounts on courses, memberships and cultural activities at the Dante Alighieri Society of Hong Kong."
        crumbs={[{ label: "Home", href: "/" }, { label: "Special offers" }]}
      />

      <section className="bg-white py-14 md:py-20">
        <div className="container-xl grid sm:grid-cols-2 gap-6">
          {OFFERS.map(({ Icon, tag, title, body, href, cta }) => (
            <div key={title} className="frame bg-white p-7 md:p-8 flex flex-col">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-full bg-sole inline-flex items-center justify-center shrink-0"><Icon size={22} aria-hidden /></span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper text-xs font-semibold uppercase tracking-wider text-azzurro-deep">
                  <Tag size={11} aria-hidden /> {tag}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-heading font-bold">{title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted flex-1">{body}</p>
              <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-azzurro-deep hover:underline">
                {cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
        <p className="container-xl mt-8 text-[13px] text-ink-muted">
          Offers can&apos;t be combined unless stated, and are subject to availability. Contact the office for full terms.
        </p>
      </section>

      <section id="enquire" className="bg-paper py-14 md:py-20 scroll-mt-24">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="general" />
        </div>
      </section>
    </>
  );
}
