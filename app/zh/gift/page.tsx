import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function Gift() {
  return (
    <>
      <PageHeader
        eyebrow="禮物"
        title="一整年的意大利。"
        subtitle="送贈會籍、送贈課程,或讓對方自選。精美設計的電子禮券,即時送達。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "禮物" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center"><Link href="/zh/membership" className="btn btn-primary">選擇禮物計劃</Link></div>
      </section>
    </>
  );
}
