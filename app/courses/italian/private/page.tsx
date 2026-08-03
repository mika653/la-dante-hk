import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";

export default function PrivatePage() {
  return (
    <>
      <PageHeader
        eyebrow="Italian · Private"
        title="One student. One teacher. One goal."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian" }, { label: "Private" }]}
        tone="sole-soft"
      />

      <section className="bg-white py-14 md:py-16 border-b border-line">
        <div className="container-xl max-w-3xl space-y-6 text-[15px] leading-relaxed">
          <div className="space-y-3">
            <p>Unlock your Italian journey with our flexible lessons! Choose from private and semi-private sessions tailored just for you and your needs. Whether you&apos;re:</p>
            <ul className="space-y-1.5 pl-1">
              <li className="flex gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-azzurro shrink-0" aria-hidden />A busy traveller needing on-site or off-site courses that fit your schedule.</li>
              <li className="flex gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-azzurro shrink-0" aria-hidden />Looking to polish your Italian skills before joining a class.</li>
              <li className="flex gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-azzurro shrink-0" aria-hidden />A student aiming for specific goals, with courses designed to meet your precise needs.</li>
              <li className="flex gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-azzurro shrink-0" aria-hidden />Preparing for an Italian exam, with personalized guidance from our experienced instructors.</li>
            </ul>
          </div>

          <div className="space-y-1.5 text-[13px] text-ink-soft">
            <p>通過我們的高彈性課程來開啟你的意大利文之旅！我們為你提供獨家的量身定制課程，你可選擇一對一私人課程，或與朋友一起參加私人小組課程。無論你是：</p>
            <ul className="space-y-1">
              <li>－因旅途繁忙，需要能符合你時間安排的實體或遠程課程。</li>
              <li>－希望在參加其他課程前提升你的意大利文技巧。</li>
              <li>－作為一名學生，有明確的目標，需要能滿足你具體需求的課程。</li>
              <li>－正在準備意大利文考試，需要經驗豐富的講師進行專人輔導。</li>
            </ul>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-line">
            <p><span className="font-medium text-ink">Where:</span> In presence or online via Zoom.</p>
            <p><span className="font-medium text-ink">When:</span> Flexible time and schedule. Monday to Saturday.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 -mt-4 text-[13px] text-ink-soft">
            <p>地點：你可選擇親臨但丁協會，或選擇方便你的地點，或通過網上授課(Zoom)</p>
            <p>時間：可根據你的日程安排進行規劃。星期一至星期六。</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-line">
            <p>All our teachers are qualified native Italian speakers with extensive experience, ensuring engaging lessons in a friendly atmosphere. Discover easy, adaptable learning today!</p>
            <p>Rescheduling of the booking is possible with a 24-hour prior notice.</p>
            <p>For further details of the package and quotation, please complete the below enquiry form or call us at <a href="tel:+85228329799" className="text-azzurro-deep underline">2832 9799</a>.</p>
          </div>
          <div className="space-y-1.5 text-[13px] text-ink-soft">
            <p>但丁協會所有的講師均為意大利母語人士，並已通過教學資格認證，具有豐富的教學經驗，能夠確保您在友好的氛圍享受課堂。現在開始探索輕鬆愉快的學習方式！</p>
            <p>如需更改上課時間或地點，請提前24小時通知我們。</p>
            <p>如欲了解更多課程資訊，請填寫以下表格，或致電 2832 9799 聯絡我們。</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20 border-t border-line">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="private" />
        </div>
      </section>
    </>
  );
}
