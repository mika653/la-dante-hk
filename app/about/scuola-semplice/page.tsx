import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Scuola Semplice · La Dante HK" };

export default function ScuolaSemplice() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Scuola Semplice."
        subtitle="Our student platform for enrolments, schedules and course materials."
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Scuola Semplice" }]}
      />
      <section className="bg-cream py-16 md:py-24">
        <div className="container-xl max-w-2xl">
          <div className="frame bg-white p-8 md:p-10 text-center">
            <span className="w-14 h-14 rounded-2xl bg-azzurro inline-flex items-center justify-center"><GraduationCap size={26} className="text-azzurro-deep" aria-hidden /></span>
            <h2 className="mt-5 text-2xl md:text-3xl font-heading font-bold">Student guides coming soon.</h2>
            <p className="mt-3 text-ink-muted">This is where we&apos;ll publish step-by-step guides for using Scuola Semplice — logging in, viewing your schedule, and accessing course materials. Check back shortly.</p>
            <div className="mt-7">
              <Link href="/contact" className="btn btn-ghost">Need help now? Contact us <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
