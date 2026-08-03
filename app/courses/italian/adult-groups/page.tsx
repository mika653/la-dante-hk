import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LevelAccordions from "./LevelAccordions";
import EnquiryForm from "@/components/EnquiryForm";

export default function AdultGroupsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Italian · Adult Groups"
        title="From 'ciao' to 'cin cin'."
        subtitle="CEFR-aligned group courses, certified native teachers, small classes in Wanchai and online. Our flagship programme since 1935."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian", href: "/courses/italian/adult-groups" }, { label: "Adult Groups" }]}
        tone="sole-soft"
      />

      {/* Course options + placement test / syllabus CTAs */}
      <section className="bg-white py-14 md:py-20 border-b border-line">
        <div className="container-xl">
          <p className="eyebrow">Adult Courses · 成人班級</p>
        </div>
        <div className="container-xl mt-8 grid md:grid-cols-[1fr_360px] gap-10 md:gap-14">
          <div>
            <p className="eyebrow">Course options · 課程選擇</p>
            <ul className="mt-4 space-y-4 text-[15px] leading-relaxed">
              <li>
                <span className="font-medium text-ink">Regular course:</span> 2 hours class once a week for 15 weeks (30h)
                <span className="block text-[13px] text-ink-soft mt-0.5">常規課程：每星期授課一堂，每堂 2 小時，共 15 星期（30 小時）</span>
              </li>
              <li>
                <span className="font-medium text-ink">Saturday course:</span> 3 hours class once a week for 10 weeks, or 2 hours class once a week for 15 weeks (30h)
                <span className="block text-[13px] text-ink-soft mt-0.5">星期六課程：每星期六授課一堂，每堂 3 小時，共 10 星期（30 小時）</span>
              </li>
              <li>
                <span className="font-medium text-ink">Intensive course:</span> 2 hours, twice a week for 15 lessons (30h)
                <span className="block text-[13px] text-ink-soft mt-0.5">速成課程：每星期授課兩堂，每堂 2 小時，共 15 節課（30 小時）</span>
              </li>
            </ul>
            <p className="mt-6 text-[15px] leading-relaxed">
              <span className="font-medium text-ink">Where:</span> In presence, with blended mode available upon request. Specific courses may be entirely online. Check our upcoming courses below! 📚
            </p>
          </div>

          <div className="space-y-5">
            <div className="frame p-6 bg-cream-2">
              <p className="font-semibold text-ink">Already studied Italian?</p>
              <p className="text-[14px] text-ink-muted mt-1">Try our placement test.</p>
              <Link href="/placement-test" className="btn btn-primary mt-4 text-sm h-11">Placement test</Link>
            </div>
            <div className="frame p-6 bg-cream-2">
              <p className="text-[14px] text-ink-muted leading-relaxed">
                Group classes are held Monday to Saturday, ranging from A1 to C2. We offer courses in presence, online, and blended mode. Check the syllabus.
              </p>
              <Link href="#A1" className="btn btn-yellow mt-4 text-sm h-11">Syllabus</Link>
            </div>
          </div>
        </div>
      </section>

      <LevelAccordions />

      {/* Placement test band */}
      <section className="bg-sole py-14 md:py-16">
        <div className="container-xl grid md:grid-cols-[1fr_auto] items-center gap-6">
          <div>
            <p className="eyebrow">Not sure which level?</p>
            <h2 className="mt-2 text-3xl md:text-4xl max-w-xl">Take our free placement test. Five minutes, CEFR-aligned.</h2>
          </div>
          <Link href="/placement-test" className="btn btn-primary">Start the test <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* Enrol / can't-find-a-class → capture the request */}
      <section id="enquire" className="bg-cream py-14 md:py-20 scroll-mt-24">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="course" />
        </div>
      </section>
    </>
  );
}
