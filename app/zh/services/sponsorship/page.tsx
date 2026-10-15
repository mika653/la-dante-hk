import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function SponsorshipZh() {
  return (
    <>
      <PageHeader
        eyebrow="服務"
        title="成為贊助商。"
        subtitle="與香港九十年的意大利文化同行。設有課室、銀會員及金會員等不同贊助級別。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "服務" }, { label: "贊助" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center"><Link href="/zh/contact" className="btn btn-primary">成為贊助商</Link></div>
      </section>
    </>
  );
}
