import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Scuola Semplice · La Dante HK" };

export default function ScuolaSemplice() {
  return (
    <>
      <PageHeader
        eyebrow="關於"
        title="Scuola Semplice."
        subtitle="我們的學生平台，用於報名、課程時間表及教材。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "關於", href: "/zh/about" }, { label: "Scuola Semplice" }]}
      />
      <section className="bg-cream py-16 md:py-24">
        <div className="container-xl max-w-2xl">
          <div className="frame bg-white p-8 md:p-10 text-center">
            <span className="w-14 h-14 rounded-2xl bg-azzurro inline-flex items-center justify-center"><GraduationCap size={26} className="text-azzurro-deep" aria-hidden /></span>
            <h2 className="mt-5 text-2xl md:text-3xl font-heading font-bold">學生指南即將推出。</h2>
            <p className="mt-3 text-ink-muted">我們將在此發佈使用 Scuola Semplice 的逐步指南 — 包括登入、查看課程時間表，以及取用教材。請稍後再回來查看。</p>
            <div className="mt-7">
              <Link href="/zh/contact" className="btn btn-ghost">需要即時協助？聯絡我們 <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
