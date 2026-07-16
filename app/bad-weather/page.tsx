import PageHeader from "@/components/PageHeader";
import { Wind, CloudRain, Info } from "lucide-react";

export const metadata = { title: "Bad weather arrangement — La Dante HK" };

export default function BadWeather() {
  return (
    <>
      <PageHeader
        eyebrow="Typhoon & severe weather"
        title="Bad weather arrangement."
        subtitle="What happens to your class, private lesson or exam when the Observatory raises a typhoon or rainstorm signal. This is a general guideline applicable to courses, private lessons and exams."
        crumbs={[{ label: "Home", href: "/" }, { label: "Bad weather" }]}
      />

      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl max-w-3xl space-y-6">
          {/* Legend */}
          <div className="frame bg-white p-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Class continues</span>
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rosso" /> Class is suspended (or moved online if the situation permits)</span>
          </div>

          {/* Typhoon */}
          <div className="frame bg-white p-7 md:p-8">
            <h2 className="text-xl md:text-2xl font-heading font-bold inline-flex items-center gap-2"><Wind size={20} className="text-azzurro-deep" /> Typhoon signals</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              When the Pre-No. 8 Special Announcement, or Typhoon Signal No. 8 or above, is issued, classes and exams are <b className="text-ink">suspended</b> (or moved online where the situation permits).
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">Classes resume if the signal is lowered to No. 1, or when all typhoon signals are cancelled:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1.5 text-[15px] text-ink-muted marker:text-azzurro-deep">
              <li><b className="text-ink">3 hours</b> before the class for playgroup, children and teenager courses;</li>
              <li><b className="text-ink">2 hours</b> before the class or exam for adult courses, exams and private lessons.</li>
            </ul>
          </div>

          {/* Rainstorm */}
          <div className="frame bg-white p-7 md:p-8">
            <h2 className="text-xl md:text-2xl font-heading font-bold inline-flex items-center gap-2"><CloudRain size={20} className="text-azzurro-deep" /> Rainstorm signals</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              When the Red or Black rainstorm warning is issued before a class, classes and exams are <b className="text-ink">suspended</b> (or moved online where the situation permits).
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">Classes resume if the signal is replaced by amber, or when all rainstorm signals are cancelled:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1.5 text-[15px] text-ink-muted marker:text-azzurro-deep">
              <li><b className="text-ink">3 hours</b> before the class for playgroup, children and teenager courses;</li>
              <li><b className="text-ink">2 hours</b> before the class or exam for adult courses, exams and private lessons.</li>
            </ul>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              When the Red or Black rainstorm signal comes into force <b className="text-ink">during</b> a class or exam, that class or exam continues until the end of the session.
            </p>
          </div>

          {/* Notes */}
          <div className="frame bg-azzurro-soft border border-azzurro-deep/20 p-6">
            <p className="eyebrow !text-azzurro-deep inline-flex items-center gap-1.5"><Info size={14} /> Please note</p>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[15px] text-ink-muted marker:text-azzurro-deep">
              <li>For playgroup, children, teenager and adult courses, no make-up class or refund will be arranged for a lesson cancelled due to bad weather.</li>
              <li>Students will be notified by email if a class is moved online or cancelled.</li>
              <li>The booking of private lessons will be rearranged if cancelled due to bad weather.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
