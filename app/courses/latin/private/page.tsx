import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";

export default function LatinPrivate() {
  return (
    <>
      <PageHeader
        eyebrow="Latin · Private"
        title="Private Latin tuition."
        subtitle="One-on-one Latin lessons — A-Level prep, classical philology, or reading-for-pleasure. Let us know your goal and we&apos;ll match you with the right classicist."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Latin", href: "/courses/latin" }, { label: "Private" }]}
        tone="cream"
      />

      <section className="bg-white py-14 md:py-20">
        <div className="container-xl max-w-2xl">
          <div className="mb-8 space-y-1.5 text-[15px] leading-relaxed">
            <p>Choose flexible time and schedule, in presence or online via Zoom.</p>
            <p>Rescheduling of the booking is possible with a 24-hour prior written notice.</p>
            <p>For further details of the package and quotation, please complete the below enquiry form or call us at <a href="tel:+85228329799" className="text-azzurro-deep underline">2832 9799</a>.</p>
            <p className="pt-2 text-[13px] text-ink-soft">私人課堂：可根據你的日程安排進行規劃。你可選擇親臨但丁協會，或通過網上授課(Zoom)。如需更改上課時間或地點，請提前24小時通知我們。</p>
            <p className="text-[13px] text-ink-soft">如欲了解更多課程資訊，請填寫以下表格，或致電 2832 9799 聯絡我們。</p>
          </div>
          <EnquiryForm type="private" />
        </div>
      </section>
    </>
  );
}
