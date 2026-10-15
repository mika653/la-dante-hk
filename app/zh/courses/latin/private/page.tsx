import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";

export default function LatinPrivate() {
  return (
    <>
      <PageHeader
        eyebrow="拉丁文 · 私人課程"
        title="拉丁文私人課程。"
        subtitle="一對一拉丁文課程 — A-Level 備試、古典語文學,或純粹享受閱讀。告訴我們你的目標,我們會為你配對合適的古典學者。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "拉丁文", href: "/zh/courses/latin" }, { label: "私人課程" }]}
        tone="cream"
      />

      <section className="bg-white py-14 md:py-20">
        <div className="container-xl max-w-2xl">
          <div className="mb-8 space-y-1.5 text-[15px] leading-relaxed">
            <p>上課時間與日程均可彈性安排,你可選擇親臨本會,或透過 Zoom 網上授課。</p>
            <p>預約如需更改,請於 24 小時前以書面通知我們。</p>
            <p>如欲了解課程套餐及報價詳情,請填寫以下表格,或致電 <a href="tel:+85228329799" className="text-azzurro-deep underline">2832 9799</a> 與我們聯絡。</p>
          </div>
          <EnquiryForm type="private" />
        </div>
      </section>
    </>
  );
}
