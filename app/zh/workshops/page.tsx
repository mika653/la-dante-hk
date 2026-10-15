import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";
import WorkshopsList from "../../workshops/WorkshopsList";

export const metadata = { title: "工作坊與特別課程 — La Dante HK" };

export default function WorkshopsPage() {
  return (
    <>
      <PageHeader
        eyebrow="課室以外"
        title="工作坊與特別課程。"
        subtitle="烹飪、電影、葡萄酒、歌劇、會話 — 讓意大利語活起來的短期文化課程。部分已排期開辦;其餘的,待足夠多人感興趣時便會開班。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "工作坊" }]}
        tone="sole-soft"
      />

      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl">
          <WorkshopsList />
        </div>
      </section>

      <section id="enquire" className="bg-white py-14 md:py-20 border-t border-line scroll-mt-24">
        <div className="container-xl max-w-2xl">
          <EnquiryForm type="workshop" />
        </div>
      </section>
    </>
  );
}
