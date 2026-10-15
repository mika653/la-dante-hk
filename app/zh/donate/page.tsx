import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "捐款 · La Dante HK" };

export default function Donate() {
  return (
    <>
      <PageHeader
        eyebrow="加入我們"
        title="支持 La Dante。"
        subtitle="我們是香港註冊慈善團體(檔案編號 91/16155),自 1934 年起推廣意大利語言與文化。你的支持,讓這份使命得以延續。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "加入我們", href: "/zh/membership" }, { label: "捐款" }]}
      />
      <section className="bg-cream py-16 md:py-24">
        <div className="container-xl max-w-2xl">
          <div className="frame bg-white p-8 md:p-10 text-center">
            <span className="w-14 h-14 rounded-2xl bg-sole inline-flex items-center justify-center"><Heart size={26} className="text-ink" aria-hidden /></span>
            <h2 className="mt-5 text-2xl md:text-3xl font-heading font-bold">你的支持,讓意大利文化在香港延續。</h2>
            <p className="mt-3 text-ink-muted">Dante Alighieri Society Limited 於 2019 年在香港註冊為慈善團體(檔案編號 91/16155),透過面向公眾、由 A1 至 C2 級的小組課程推廣意大利語言與文化的學習。2021 年,我們遷入香港藝術中心 — 全城多元藝術與文化的樞紐。</p>
            <p className="mt-3 text-ink-muted">你慷慨的捐款,支持教育的推展以及協會的文化使命。你所捐的每一分一毫,我們都衷心感激,並善加運用。</p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link href="/zh/contact" className="btn btn-primary">聯絡我們捐款 <ArrowRight size={16} /></Link>
              <Link href="/zh/membership" className="btn btn-ghost">成為會員</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
