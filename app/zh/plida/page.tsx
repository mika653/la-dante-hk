import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { Award, Calendar, FileText, ArrowRight } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export default function PLIDA() {
  const sessions = [
    { date: "14 June 2026", deadline: "10 May 2026", levels: "A1 · A2 · B1 · B2 · C1 · C2" },
    { date: "15 November 2026", deadline: "10 October 2026", levels: "A1 · A2 · B1 · B2 · C1 · C2" },
  ];
  return (
    <>
      <PageHeader
        eyebrow="PLIDA"
        title="意大利語能力證書。"
        subtitle="PLIDA 是意大利政府官方認可的語言能力認證,適用於意大利的升學、入籍及工作。La Dante HK 是香港的官方考試中心。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "PLIDA" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award,    title: "官方認證",      body: "由 Società Dante Alighieri 根據與意大利外交部的協議頒發。" },
              { icon: FileText, title: "CEFR A1–C2",    body: "歐洲共同語言參考標準的全部六個級別。選擇你需要的級別,或從 A1 開始。" },
              { icon: Calendar, title: "每年兩次考試",  body: "六月及十一月。報名於每次考試前五週截止。" },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="frame p-6 md:p-8 bg-white">
                <Icon size={22} className="text-azzurro-deep" aria-hidden />
                <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                <p className="mt-2 text-sm text-ink-muted" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl">即將舉行的考試。</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-5">
              {sessions.map((s) => (
                <div key={s.date} className="frame p-6 bg-white">
                  <p className="eyebrow">考試日期</p>
                  <p className="mt-2 text-2xl font-heading font-bold">{s.date}</p>
                  <p className="mt-2 text-sm text-ink-muted">報名截止日期:<strong>{s.deadline}</strong></p>
                  <p className="mt-1 text-sm text-ink-muted">級別:{s.levels}</p>
                  <Link href="/zh/contact" className="btn btn-primary mt-4">報名 <ArrowRight size={16} /></Link>
                </div>
              ))}
            </div>
          </div>

          <div id="faq" className="mt-16">
            <h2 className="text-2xl md:text-3xl">常見問題。</h2>
            <div className="mt-6 space-y-3">
              {[
                { q: "PLIDA 考試費用是多少?", a: "A1 級 HK$1,200,至 C2 級 HK$2,400。會員可享九折優惠。" },
                { q: "我需要先報讀你們的課程才能應考嗎?", a: "不需要 — PLIDA 考試開放予所有人。不過我們建議報讀備考工作坊。" },
                { q: "考試形式是怎樣的?", a: "四項技能:閱讀、寫作、聆聽、口語。視乎級別,全程約 2.5 小時。" },
                { q: "可以跟你們一起備考嗎?", a: "可以 — 我們在每次考試前六週開辦專門的 PLIDA 備考工作坊。" },
              ].map((f) => (
                <details key={f.q} className="frame bg-white p-5">
                  <summary className="cursor-pointer font-medium">{f.q}</summary>
                  <p className="mt-3 text-sm text-ink-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div id="prepare" className="mt-16 frame p-8 md:p-10 bg-paper text-ink relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-azzurro opacity-50 blur-[2px]" aria-hidden />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-sole/40" aria-hidden />
            <p className="eyebrow !text-azzurro-deep relative">備考</p>
            <h2 className="mt-3 text-3xl max-w-xl">PLIDA 備考工作坊。</h2>
            <p className="mt-3 max-w-xl text-ink-muted">六週的密集備考,涵蓋歷屆試題、計時練習,以及來自認證 PLIDA 考官的回饋。會員及非會員均歡迎參加。</p>
            <a href="#plida-enquiry" className="btn btn-primary mt-5">登記興趣 <ArrowRight size={16} /></a>
          </div>

          <div id="plida-enquiry" className="mt-14 max-w-2xl mx-auto scroll-mt-24">
            <EnquiryForm type="plida" />
          </div>
        </div>
      </section>
    </>
  );
}
