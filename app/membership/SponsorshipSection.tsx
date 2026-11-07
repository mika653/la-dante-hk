"use client";
import { useState } from "react";
import { formatHKD } from "@/lib/utils";
import { Check, Mail, Gem, Award, Medal, DoorOpen, Megaphone, BookImage, type LucideIcon } from "lucide-react";

const CONTACT = "dantealighieri@ladante.cc";

type TierId = "silver" | "gold" | "diamond";

type Tier = {
  id: TierId;
  name: string;
  priceHKD: number;
  nominees: number; // membership cards for nominees
  tagline: string;
  badge?: string;
  Icon: LucideIcon;
};

// Sponsorship tiers & fees per Giulia. Nominee counts are the client's figures;
// the other allowances (lesson hours, hall rental, discounts) scale with the
// tier and are quoted when we talk — so they're described, not numbered here.
const tiers: Tier[] = [
  { id: "silver", name: "Silver", priceHKD: 7500, nominees: 5, Icon: Medal, tagline: "An entry-level partnership with real brand visibility." },
  { id: "gold", name: "Gold", priceHKD: 35000, nominees: 10, Icon: Award, badge: "Most popular", tagline: "Our most popular corporate partnership." },
  { id: "diamond", name: "Diamond", priceHKD: 55000, nominees: 15, Icon: Gem, tagline: "Our flagship tier, with the most generous allowances." },
];

function benefits(nominees: number): string[] {
  return [
    "Your logo across our Wan Chai centre & materials",
    "Discounts on corporate courses & team-building",
    "Private & group lesson hours",
    "A discount on translation services",
    `${nominees} membership cards for your nominees`,
    "Free hall-rental hours",
    "Library access for your team",
    "Discounts on our cultural events",
    "Invitation to the annual Dante dinner",
  ];
}

const classroomPerks: { Icon: LucideIcon; label: string }[] = [
  { Icon: DoorOpen, label: "Your logo at the centre entrance and on a classroom door" },
  { Icon: Megaphone, label: "Promotional materials displayed at our reception" },
  { Icon: BookImage, label: "Your logo featured in our brochure and events calendar" },
];

export default function SponsorshipSection() {
  const [selected, setSelected] = useState<TierId | null>(null);
  const chosen = tiers.find((t) => t.id === selected);

  const subject = chosen ? `Sponsorship enquiry — ${chosen.name} (${formatHKD(chosen.priceHKD)})` : "Sponsorship enquiry";
  const mailHref = `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}`;

  return (
    <section id="sponsorship" className="bg-azzurro-deep text-cream py-16 md:py-24 scroll-mt-24">
      <div className="container-xl">
        <div className="max-w-2xl">
          <p className="eyebrow text-cream/70!">Corporate sponsorship</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-heading font-bold text-balance text-cream!">Put your brand behind Italian&nbsp;culture.</h2>
          <p className="mt-4 text-cream/80">
            Three annual partnership tiers from {formatHKD(7500)} to {formatHKD(55000)} — each with logo placement, course and team-building discounts, lesson hours, member cards for your team, and an invitation to our annual Dante&nbsp;dinner.
          </p>
        </div>

        {/* Tiers */}
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {tiers.map((t) => {
            const isSel = selected === t.id;
            const Icon = t.Icon;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={isSel}
                onClick={() => setSelected(t.id)}
                className={`relative text-left frame p-6 bg-cream text-ink transition-all ${isSel ? "ring-4 ring-sole -translate-y-1" : "hover:-translate-y-0.5"}`}
              >
                {/* Selected check badge */}
                <span
                  aria-hidden
                  className={`absolute top-4 right-4 w-7 h-7 rounded-full inline-flex items-center justify-center transition-all ${isSel ? "bg-azzurro-deep text-cream scale-100" : "bg-transparent border border-line text-transparent scale-90"}`}
                >
                  <Check size={15} />
                </span>

                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-azzurro-deep/10 inline-flex items-center justify-center text-azzurro-deep"><Icon size={18} aria-hidden /></span>
                  {t.badge && <span className="inline-block px-2.5 py-1 rounded-full bg-sole text-ink text-xs font-medium uppercase tracking-wider">{t.badge}</span>}
                </div>

                <h3 className="mt-4 text-2xl font-heading font-bold">{t.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{t.tagline}</p>
                <p className="mt-4 text-3xl font-heading font-extrabold">
                  {formatHKD(t.priceHKD)}<span className="text-sm font-medium text-ink-muted"> / year</span>
                </p>

                <ul className="mt-5 space-y-2 text-sm">
                  {benefits(t.nominees).map((b) => (
                    <li key={b} className="flex gap-2"><Check size={14} className="text-azzurro-deep mt-1 shrink-0" aria-hidden />{b}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* CTA row reflecting the selected tier */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <a href={mailHref} className="btn btn-yellow">
            <Mail size={16} aria-hidden /> {chosen ? `Enquire about ${chosen.name}` : "Enquire about sponsorship"}
          </a>
          <p className="text-sm text-cream/70">
            {chosen ? <>You selected <strong className="text-cream">{chosen.name}</strong>. </> : <>Select a tier above, or </>}
            email us at <a href={`mailto:${CONTACT}`} className="underline hover:text-sole">{CONTACT}</a>.
          </p>
        </div>

        {/* Classroom sponsorship add-on */}
        <div className="mt-12 rounded-3xl bg-cream/10 p-8 md:p-10">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
            <div>
              <p className="eyebrow text-cream/70!">Add-on</p>
              <h3 className="mt-3 text-2xl md:text-3xl font-heading font-bold text-cream!">Classroom sponsorship.</h3>
              <p className="mt-3 text-cream/80 max-w-md">
                An affordable way to support Italian culture in Hong Kong and put your brand in front of our community — on its own, or alongside any tier above.
              </p>
              <a href={`mailto:${CONTACT}?subject=${encodeURIComponent("Classroom sponsorship enquiry")}`} className="btn btn-outline-white mt-6">
                <Mail size={16} aria-hidden /> Sponsor a classroom
              </a>
            </div>
            <ul className="space-y-3">
              {classroomPerks.map(({ Icon, label }) => (
                <li key={label} className="flex gap-3 items-start">
                  <span className="w-9 h-9 rounded-full bg-sole text-ink inline-flex items-center justify-center shrink-0"><Icon size={18} aria-hidden /></span>
                  <span className="text-cream/90 text-sm leading-relaxed pt-1.5">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
