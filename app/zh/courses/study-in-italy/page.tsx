import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function StudyInItaly() {
  return (
    <>
      <PageHeader
        eyebrow="海外"
        title="留學意大利。"
        subtitle="暑期課程、大學升學準備,以及學生簽證指引。我們與羅馬、米蘭、佛羅倫斯及佩魯賈的院校合作。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "留學意大利" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center frame p-10 bg-white max-w-2xl mx-auto">
          <p className="eyebrow">即將推出</p>
          <h2 className="mt-3 text-2xl">課程詳情將於五月公布。</h2>
          <p className="mt-3 text-ink-muted">登記你的興趣,我們將第一時間通知你。</p>
          <div className="mt-6"><Link href="/zh/contact" className="btn btn-primary">我有興趣</Link></div>
        </div>
      </section>
    </>
  );
}
