"use client";
import { IdCard, CalendarRange } from "lucide-react";
import { RichText } from "@/components/RichText";
import { useT } from "@/lib/locale";
import { pickLocale } from "@/lib/site-content-shared";
import { useMembershipContent } from "@/lib/use-membership-content";
import { MEMBERSHIP_ICON } from "@/lib/membership-icons";

// Membership card · member benefits · card administration — Giulia's copy,
// editable at /admin/content/membership.
export default function MembershipInfo() {
  const { locale } = useT();
  const { card } = useMembershipContent();
  const L = (b: Parameters<typeof pickLocale>[0]) => pickLocale(b, locale);

  return (
    <section className="bg-white py-14 md:py-20 border-b border-line">
      <div className="container-xl grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-14 items-start">
        <div>
          <p className="eyebrow !text-azzurro-deep">Membership card</p>
          <h2 className="mt-2 text-3xl md:text-4xl text-balance">{L(card.title)}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            <RichText text={L(card.intro)} />
          </p>

          {card.admin.length > 0 && (
            <div className="mt-8 frame bg-paper p-6">
              <p className="flex items-center gap-2 font-semibold"><CalendarRange size={18} className="text-azzurro-deep" aria-hidden /> {L(card.adminTitle)}</p>
              <ul className="mt-3 space-y-2 text-[14px] text-ink-muted leading-relaxed [&_strong]:text-ink">
                {card.admin.map((line, i) => (
                  <li key={i}><RichText text={L(line)} /></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow !text-azzurro-deep flex items-center gap-2"><IdCard size={14} aria-hidden /> Member benefits</p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            {card.benefits.map((b, i) => {
              const Icon = MEMBERSHIP_ICON[b.icon] ?? MEMBERSHIP_ICON.star;
              return (
                <li key={i} className="frame bg-white p-6">
                  <span className="w-11 h-11 rounded-full bg-sole inline-flex items-center justify-center"><Icon size={20} aria-hidden /></span>
                  <h3 className="mt-4 font-semibold text-lg">{L(b.title)}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted leading-relaxed"><RichText text={L(b.body)} /></p>
                </li>
              );
            })}
          </ul>
          <a href="#perks" className="mt-5 inline-block text-sm font-medium text-azzurro-deep hover:underline">See all partner offers →</a>
        </div>
      </div>
    </section>
  );
}
