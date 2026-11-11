import { IdCard, Store, Ticket, Library, Landmark, CalendarRange, type LucideIcon } from "lucide-react";

// Membership card · member benefits · card administration — Giulia's copy.
const BENEFITS: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: Store,    title: "Partner offers",     body: "Special offers and discounts at selected restaurants, fashion brands, home-living shops and other participating businesses." },
  { Icon: Ticket,   title: "Culture for less",   body: "Discounts on selected cultural activities and short courses organised by the Dante Alighieri Society in Hong Kong." },
  { Icon: Library,  title: "The Dante Library",  body: "Free access to the Dante Library — more than 1,400 Italian books and DVDs." },
  { Icon: Landmark, title: "Rome privileges",    body: "Privileges offered by the Società Dante Alighieri in Rome, Italy." },
];

export default function MembershipInfo() {
  return (
    <section className="bg-white py-14 md:py-20 border-b border-line">
      <div className="container-xl grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-14 items-start">
        <div>
          <p className="eyebrow !text-azzurro-deep">Membership card</p>
          <h2 className="mt-2 text-3xl md:text-4xl text-balance">Your DA membership card.</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Membership is compulsory for all private and group-course students. On presentation of their DA membership
            card, members can access a range of special offers, discounts and cultural benefits.
          </p>

          <div className="mt-8 frame bg-paper p-6">
            <p className="flex items-center gap-2 font-semibold"><CalendarRange size={18} className="text-azzurro-deep" aria-hidden /> Card administration</p>
            <ul className="mt-3 space-y-2 text-[14px] text-ink-muted leading-relaxed">
              <li>The membership-card fee is added to your course invoice at enrolment.</li>
              <li>Each member is assigned a card number and receives the sticker for the current year.</li>
              <li>The card is valid from <strong className="text-ink">January to December</strong>, whichever month you join — it always expires in December.</li>
            </ul>
          </div>
        </div>

        <div>
          <p className="eyebrow !text-azzurro-deep flex items-center gap-2"><IdCard size={14} aria-hidden /> Member benefits</p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            {BENEFITS.map(({ Icon, title, body }) => (
              <li key={title} className="frame bg-white p-6">
                <span className="w-11 h-11 rounded-full bg-sole inline-flex items-center justify-center"><Icon size={20} aria-hidden /></span>
                <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{body}</p>
              </li>
            ))}
          </ul>
          <a href="#perks" className="mt-5 inline-block text-sm font-medium text-azzurro-deep hover:underline">See all partner offers →</a>
        </div>
      </div>
    </section>
  );
}
