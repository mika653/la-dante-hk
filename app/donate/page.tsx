import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Donate · La Dante HK" };

export default function Donate() {
  return (
    <>
      <PageHeader
        eyebrow="Join Us"
        title="Support La Dante."
        subtitle="As a non-profit promoting Italian language and culture in Hong Kong since 1934, we rely on members and friends who share our mission."
        crumbs={[{ label: "Home", href: "/" }, { label: "Join Us", href: "/membership" }, { label: "Donate" }]}
      />
      <section className="bg-cream py-16 md:py-24">
        <div className="container-xl max-w-2xl">
          <div className="frame bg-white p-8 md:p-10 text-center">
            <span className="w-14 h-14 rounded-2xl bg-sole inline-flex items-center justify-center"><Heart size={26} className="text-ink" aria-hidden /></span>
            <h2 className="mt-5 text-2xl md:text-3xl font-heading font-bold">Your support keeps Italian culture alive in Hong Kong.</h2>
            <p className="mt-3 text-ink-muted">Donations help fund scholarships, cultural events, and our Italian library. To make a contribution or discuss sponsorship, please get in touch — we&apos;d love to hear from you.</p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="btn btn-primary">Contact us to donate <ArrowRight size={16} /></Link>
              <Link href="/membership" className="btn btn-ghost">Become a member</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
