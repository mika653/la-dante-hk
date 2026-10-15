import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = { title: "預約試堂 — La Dante HK" };

export default function BookTrialPage() {
  return (
    <>
      <PageHeader
        eyebrow="免費 · 無需承諾"
        title="預約試堂。"
        subtitle="不知道從何開始?歡迎來試上一堂。留下你的資料,辦公室將為你安排合適的時間。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "預約試堂" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="trial" />
        </div>
      </section>
    </>
  );
}
