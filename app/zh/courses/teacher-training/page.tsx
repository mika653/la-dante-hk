import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function TeacherTraining() {
  return (
    <>
      <PageHeader
        eyebrow="專業進修"
        title="師資培訓。"
        subtitle="為有志投身意大利文對外教學的教師,提供 CEDILS 及 DITALS 認證支援。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "師資培訓" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center"><Link href="/zh/contact" className="btn btn-primary">查詢培訓詳情</Link></div>
      </section>
    </>
  );
}
