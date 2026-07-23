import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { FileText, Shield, Cookie, CloudRain } from "lucide-react";

export const metadata = { title: "Terms & conditions — La Dante HK" };

const policies = [
  { href: "/privacy", icon: Shield, title: "Privacy policy", blurb: "How we collect, use and protect your personal data under the PDPO." },
  { href: "/cookie-policy", icon: Cookie, title: "Cookie policy", blurb: "The cookies we use and how to manage them." },
  { href: "/bad-weather", icon: CloudRain, title: "Bad weather arrangement", blurb: "What happens to classes and exams during a typhoon or rainstorm." },
];

export default function Terms() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & conditions."
        subtitle="The agreement between you and the Dante Alighieri Society of Hong Kong when you enrol, attend, or use this site."
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
      />
      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl max-w-3xl space-y-6">
          <div className="frame bg-white p-7 md:p-8">
            <FileText size={22} className="text-azzurro-deep" aria-hidden />
            <h2 className="mt-3 text-xl font-heading font-bold">Full terms available on request</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              Our complete terms and conditions — covering enrolment, fees, cancellations and refunds, membership,
              and use of our premises and services — are being finalised for publication. In the meantime, the
              office will provide the current terms on request. Email{" "}
              <a href="mailto:dantealighieri@ladante.cc" className="text-azzurro-deep underline">dantealighieri@ladante.cc</a>{" "}
              or call <a href="tel:+85228329799" className="text-azzurro-deep underline">+852 2832 9799</a>.
            </p>
          </div>

          <div>
            <p className="eyebrow">Related policies</p>
            <div className="mt-3 grid sm:grid-cols-3 gap-3">
              {policies.map((p) => (
                <Link key={p.href} href={p.href} className="frame bg-white p-5 hover:border-ink-muted transition-colors">
                  <p.icon size={18} className="text-azzurro-deep" aria-hidden />
                  <h3 className="mt-2 font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{p.blurb}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
