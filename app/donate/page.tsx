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
        subtitle="A registered Hong Kong charity (file no. 91/16155) promoting Italian language and culture since 1934. Your support helps us keep it alive."
        crumbs={[{ label: "Home", href: "/" }, { label: "Join Us", href: "/membership" }, { label: "Donate" }]}
      />
      <section className="bg-cream py-16 md:py-24">
        <div className="container-xl max-w-2xl">
          <div className="frame bg-white p-8 md:p-10 text-center">
            <span className="w-14 h-14 rounded-2xl bg-sole inline-flex items-center justify-center"><Heart size={26} className="text-ink" aria-hidden /></span>
            <h2 className="mt-5 text-2xl md:text-3xl font-heading font-bold">Your support keeps Italian culture alive in Hong Kong.</h2>
            <p className="mt-3 text-ink-muted">Dante Alighieri Society Limited was registered in Hong Kong as a charity (file no. 91/16155) in 2019, promoting the study of the Italian language and culture through group courses from A1 to C2 for the general public. In 2021 we relocated to the Hong Kong Arts Centre, the city&apos;s hub for multi-arts and culture.</p>
            <p className="mt-3 text-ink-muted">Your generous donation supports the advancement of education and the cultural mission of the Society. We fully appreciate and make good use of every dollar you give.</p>
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
