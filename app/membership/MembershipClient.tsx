"use client";
import { useState } from "react";
import { formatHKD } from "@/lib/utils";
import { Check, ArrowLeft, ArrowRight, Sparkles, Star } from "lucide-react";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4;
type PlanId = "individual" | "student";

type Plan = {
  id: PlanId;
  name: string;
  priceHKD: number;
  cadence: string; // shown after the price, e.g. "first year" / "one-time"
  renewal?: string; // optional second line, e.g. "then HKD 600 / year"
  blurb: string;
  perks: string[];
  highlight?: boolean;
  badge?: string;
};

// Membership fees per Giulia. Individual is the headline plan; the student rate
// is a one-time fee. Sponsorship tiers live in the SponsorshipSection below.
const membershipPlans: Plan[] = [
  {
    id: "individual",
    name: "Individual",
    priceHKD: 800,
    cadence: "first year",
    renewal: `then ${formatHKD(600)} / year`,
    blurb: "Full access to Dante life in Hong Kong.",
    perks: ["Course discounts", "Library & bookclub", "Cultural events", "50+ member perks across HK", "PLIDA exam discount"],
    highlight: true,
    badge: "Most popular",
  },
  {
    id: "student",
    name: "Student",
    priceHKD: 150,
    cadence: "one-time",
    blurb: "Under 25, or with a full-time student ID.",
    perks: ["Course discounts", "Library & bookclub", "Student-only events", "50+ member perks across HK"],
    badge: "One-time fee",
  },
];

const interestOptions = ["Adult courses", "Latin", "Kids & teens", "Culture events", "Wine & food", "Cinema", "PLIDA", "Bookclub"];
const heardOptions = ["Instagram", "Friend referral", "Google search", "Work / colleague", "Italian Consulate", "Other"];

export default function MembershipClient() {
  const [step, setStep] = useState<Step>(1);
  const [planId, setPlanId] = useState<PlanId | null>("individual");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [heard, setHeard] = useState("");
  const [interests, setInterests] = useState<string[]>(["Adult courses"]);
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [done, setDone] = useState(false);

  const plan = membershipPlans.find((p) => p.id === planId);

  function toggleInterest(i: string) {
    setInterests((list) => (list.includes(i) ? list.filter((x) => x !== i) : [...list, i]));
  }

  function submit() { setDone(true); setStep(4); }

  if (done) {
    return (
      <section className="bg-cream py-16 md:py-24">
        <div className="container-xl max-w-xl">
          <div className="frame p-10 md:p-14 bg-white text-center">
            <div className="w-16 h-16 rounded-full bg-sole mx-auto inline-flex items-center justify-center"><Sparkles size={26} aria-hidden /></div>
            <h2 className="mt-6 text-3xl md:text-4xl">Benvenuto, {first || "friend"}.</h2>
            <p className="mt-4 text-ink-muted max-w-md mx-auto">
              We&apos;ve received your membership request. Giulia will email you at <strong>{email}</strong> within 24 hours with payment details and your digital member card.
            </p>
            <p className="mt-6 text-xs text-ink-muted italic">Demo mode: no payment was processed.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/courses/italian/adult-groups" className="btn btn-primary">Browse courses</Link>
              <Link href="/culture" className="btn btn-ghost">See events</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream py-12 md:py-20">
      <div className="container-xl max-w-4xl">
        {/* Stepper */}
        <ol className="flex items-center gap-2 md:gap-3 mb-10 text-xs md:text-sm">
          {["Plan", "You", "Review", "Done"].map((label, i) => {
            const n = (i + 1) as Step;
            const active = n === step;
            const past = n < step;
            return (
              <li key={label} className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center font-heading font-bold shrink-0 ${active ? "bg-ink text-cream" : past ? "bg-sole text-ink" : "border border-line text-ink-muted"}`}>{past ? <Check size={14} /> : n}</span>
                <span className={`font-medium hidden sm:inline ${active ? "text-ink" : "text-ink-muted"}`}>{label}</span>
                {i < 3 && <span className="flex-1 h-px bg-line min-w-[12px]" aria-hidden />}
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <div>
            <h2 className="text-2xl md:text-3xl text-balance">Choose your membership.</h2>
            <p className="mt-2 text-ink-muted">Join as an individual, or at the student rate. Looking to partner as a company? <a href="#sponsorship" className="underline hover:text-azzurro-deep">See sponsorship</a>.</p>
            <div className="mt-8 grid sm:grid-cols-2 gap-5 max-w-3xl">
              {membershipPlans.map((p) => {
                const selected = planId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPlanId(p.id)}
                    className={`relative text-left frame p-6 transition-all ${selected ? "ring-2 ring-azzurro-deep bg-white -translate-y-1" : "bg-white hover:-translate-y-0.5"}`}
                  >
                    {/* Selected check badge */}
                    <span
                      aria-hidden
                      className={`absolute top-4 right-4 w-7 h-7 rounded-full inline-flex items-center justify-center transition-all ${selected ? "bg-azzurro-deep text-cream scale-100" : "bg-transparent border border-line text-transparent scale-90"}`}
                    >
                      <Check size={15} />
                    </span>
                    {p.badge && (
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${p.highlight ? "bg-sole text-ink" : "bg-sole-soft text-ink-muted"}`}>
                        {p.highlight && <Star size={10} className="inline -mt-0.5 mr-1" />}{p.badge}
                      </span>
                    )}
                    <h3 className="mt-3 text-xl font-heading font-bold">{p.name}</h3>
                    <p className="mt-2 text-ink-muted text-sm">{p.blurb}</p>
                    <div className="mt-4">
                      <p className="text-3xl font-heading font-extrabold">
                        {formatHKD(p.priceHKD)}<span className="text-sm font-medium text-ink-muted"> {p.cadence}</span>
                      </p>
                      {p.renewal && <p className="text-xs text-ink-muted mt-1">{p.renewal}</p>}
                    </div>
                    <ul className="mt-4 space-y-1.5 text-sm">
                      {p.perks.map((x) => (
                        <li key={x} className="flex gap-2"><Check size={14} className="text-azzurro-deep mt-1 shrink-0" />{x}</li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button type="button" onClick={() => setStep(2)} disabled={!planId} className="btn btn-primary disabled:opacity-40">Continue <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl md:text-3xl">About you.</h2>
            <p className="mt-2 text-ink-muted">We keep this safe. No spam — ever.</p>
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="mt-8 grid md:grid-cols-2 gap-4">
              <label className="text-sm font-medium">First name<input required value={first} onChange={(e) => setFirst(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
              <label className="text-sm font-medium">Last name<input required value={last} onChange={(e) => setLast(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
              <label className="text-sm font-medium">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
              <label className="text-sm font-medium">Phone<input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+852 ..." className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
              <label className="text-sm font-medium">Date of birth<input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
              <label className="text-sm font-medium">Nationality<input value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="e.g. Hong Kong" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
              <label className="text-sm font-medium md:col-span-2">How did you hear about us?
                <select value={heard} onChange={(e) => setHeard(e.target.value)} className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink">
                  <option value="">Please choose</option>
                  {heardOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
              <div className="md:col-span-2">
                <p className="text-sm font-medium mb-2">What interests you? (select all that apply)</p>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((i) => {
                    const on = interests.includes(i);
                    return (
                      <button key={i} type="button" onClick={() => toggleInterest(i)} className={`px-4 py-2 rounded-full border text-sm transition-colors ${on ? "bg-azzurro text-cream border-azzurro-deep" : "border-line hover:border-ink-muted"}`}>
                        {i}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="md:col-span-2 flex items-center justify-between mt-4">
                <button type="button" onClick={() => setStep(1)} className="btn btn-ghost"><ArrowLeft size={16} /> Back</button>
                <button type="submit" className="btn btn-primary">Review <ArrowRight size={16} /></button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && plan && (
          <div>
            <h2 className="text-2xl md:text-3xl">Quick review.</h2>
            <p className="mt-2 text-ink-muted">Confirm and we&apos;ll send next steps to your email.</p>
            <div className="mt-8 grid md:grid-cols-[2fr_1fr] gap-6">
              <div className="frame p-6 bg-white">
                <p className="eyebrow">Membership</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <span className="text-lg font-heading font-bold text-right">{formatHKD(plan.priceHKD)} <span className="text-sm font-medium text-ink-muted">{plan.cadence}</span></span>
                </div>
                {plan.renewal && <p className="text-xs text-ink-muted text-right">{plan.renewal}</p>}
                <ul className="mt-4 grid grid-cols-2 gap-y-1.5 text-sm">
                  {plan.perks.map((p) => <li key={p} className="flex gap-2"><Check size={13} className="text-azzurro-deep mt-1 shrink-0" />{p}</li>)}
                </ul>

                <hr className="my-6 border-line" />
                <p className="eyebrow">Member</p>
                <p className="mt-2 text-sm">{first} {last} · {email}</p>
                {phone && <p className="text-sm text-ink-muted">{phone}</p>}
                <p className="mt-2 text-sm text-ink-muted">Interests: {interests.join(", ") || "None"}</p>
              </div>
              <div className="frame p-6 bg-sole-soft">
                <p className="eyebrow">Total today</p>
                <p className="mt-2 text-3xl font-heading font-extrabold">{formatHKD(plan.priceHKD)}</p>
                <p className="text-xs text-ink-muted">{plan.renewal ?? `${plan.cadence} fee`}</p>
                <label className="flex items-start gap-2 mt-5 text-sm cursor-pointer">
                  <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 accent-azzurro" />
                  <span>I agree to the <Link className="underline" href="/terms">Terms</Link> and <Link className="underline" href="/privacy">Privacy policy</Link>.</span>
                </label>
                <label className="flex items-start gap-2 mt-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-1 accent-azzurro" />
                  <span>Send me news, courses, and events.</span>
                </label>
                <p className="mt-4 text-xs text-ink-muted italic">Demo mode: no payment is processed. We&apos;ll email payment details within 24 hours.</p>
                <button type="button" onClick={submit} disabled={!terms} className="btn btn-primary w-full mt-5 disabled:opacity-40">Confirm membership</button>
                <button type="button" onClick={() => setStep(2)} className="btn btn-ghost w-full mt-2"><ArrowLeft size={16} /> Edit details</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
