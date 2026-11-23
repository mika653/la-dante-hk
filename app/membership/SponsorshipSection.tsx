"use client";
import { useState } from "react";
import { formatHKD } from "@/lib/utils";
import { Check, Mail, Gem, Award, Medal, type LucideIcon } from "lucide-react";
import { usePricing } from "@/lib/use-pricing";
import { useMembershipContent } from "@/lib/use-membership-content";
import { fillTokens, TIER_IDS, type TierId } from "@/lib/membership-content-shared";
import { MEMBERSHIP_ICON } from "@/lib/membership-icons";
import { pickLocale } from "@/lib/site-content-shared";
import { useT } from "@/lib/locale";
import { RichText } from "@/components/RichText";

const CONTACT = "dantealighieri@ladante.cc";

// Sponsorship tiers per Giulia. Prices are editable at /admin/content/pricing;
// names, taglines, badges and benefit lists at /admin/content/membership.
const TIER_ICON: Record<TierId, LucideIcon> = { silver: Medal, gold: Award, diamond: Gem };

export default function SponsorshipSection() {
  const [selected, setSelected] = useState<TierId | null>(null);
  const pricing = usePricing();
  const { sponsorship: copy } = useMembershipContent();
  const { locale } = useT();
  const L = (b: Parameters<typeof pickLocale>[0]) => pickLocale(b, locale);
  const tokens = {
    silver: formatHKD(pricing.sponsorSilver),
    gold: formatHKD(pricing.sponsorGold),
    diamond: formatHKD(pricing.sponsorDiamond),
    firstYear: formatHKD(pricing.individualFirstYear),
    renewal: formatHKD(pricing.individualRenewal),
  };
  const T = (b: Parameters<typeof pickLocale>[0]) => fillTokens(L(b), tokens);
  // Office-editable copy + tier prices.
  const tierList = TIER_IDS.map((id) => {
    const t = copy.tiers[id];
    return {
      id,
      name: L(t.name),
      tagline: T(t.tagline),
      badge: L(t.badge),
      benefits: t.benefits.map(T),
      Icon: TIER_ICON[id],
      priceHKD: id === "silver" ? pricing.sponsorSilver : id === "gold" ? pricing.sponsorGold : pricing.sponsorDiamond,
    };
  });
  const chosen = tierList.find((t) => t.id === selected);

  const subject = chosen ? `Sponsorship enquiry — ${chosen.name} (${formatHKD(chosen.priceHKD)})` : "Sponsorship enquiry";
  const mailHref = `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}`;

  return (
    <section id="sponsorship" className="bg-azzurro-deep text-cream py-16 md:py-24 scroll-mt-24">
      <div className="container-xl">
        <div className="max-w-2xl">
          <p className="eyebrow text-cream/70!">Corporate sponsorship</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-heading font-bold text-balance text-cream!">{L(copy.title)}</h2>
          <p className="mt-4 text-cream/80">
            <RichText text={T(copy.intro)} />
          </p>
        </div>

        {/* Tiers */}
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {tierList.map((t) => {
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
                <p className="mt-1 text-sm text-ink-muted"><RichText text={t.tagline} /></p>
                <p className="mt-4 text-3xl font-heading font-extrabold">
                  {formatHKD(t.priceHKD)}<span className="text-sm font-medium text-ink-muted"> / year</span>
                </p>

                <ul className="mt-5 space-y-2 text-sm">
                  {t.benefits.map((b, i) => (
                    <li key={i} className="flex gap-2"><Check size={14} className="text-azzurro-deep mt-1 shrink-0" aria-hidden /><span><RichText text={b} /></span></li>
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
              <h3 className="mt-3 text-2xl md:text-3xl font-heading font-bold text-cream!">{L(copy.classroom.title)}</h3>
              <p className="mt-3 text-cream/80 max-w-md">
                <RichText text={T(copy.classroom.body)} />
              </p>
              <a href={`mailto:${CONTACT}?subject=${encodeURIComponent("Classroom sponsorship enquiry")}`} className="btn btn-outline-white mt-6">
                <Mail size={16} aria-hidden /> Sponsor a classroom
              </a>
            </div>
            <ul className="space-y-3">
              {copy.classroom.perks.map((p, i) => {
                const Icon = MEMBERSHIP_ICON[p.icon] ?? MEMBERSHIP_ICON.star;
                return (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="w-9 h-9 rounded-full bg-sole text-ink inline-flex items-center justify-center shrink-0"><Icon size={18} aria-hidden /></span>
                    <span className="text-cream/90 text-sm leading-relaxed pt-1.5"><RichText text={T(p.label)} /></span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
