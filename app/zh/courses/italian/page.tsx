import PageHeader from "@/components/PageHeader";
import ReasonsBubbles from "./ReasonsBubblesZh";

export default function ItalianPage() {
  return (
    <>
      <PageHeader
        eyebrow="意大利文課程"
        title="為什麽學習意大利文？"
        subtitle="認識另一種文化能開闊你的視野,並以深刻的方式改變你。意大利的語言與文化也不例外,學習它們能豐富你在個人、專業與文化層面的體驗。立即看看你應該踏上這段精彩學習旅程的七大理由。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "意大利文" }]}
        tone="sole-soft"
      />

      <section className="bg-white py-14 md:py-16">
        <div className="container-xl">
          <ReasonsBubbles />
        </div>
      </section>

      <section className="bg-cream py-14 md:py-16 border-t border-line">
        <div className="container-xl max-w-3xl">
          <p className="eyebrow">為何在 La Dante 學習意大利文？</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-heading font-bold">Dante Alighieri Society Hong Kong</h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-muted">
            <p>Dante Alighieri Society — 自 1934 年起,意大利語言與文化在香港的家。</p>
            <p>在最具規模、與各機構連繫最緊密的意大利文中心學習意大利文與拉丁文 — 這裏是享譽全球、總部設於羅馬的 Società Dante Alighieri 的一員,於全球超過 80 個國家設有中心。</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16 border-t border-line">
        <div className="container-xl max-w-3xl">
          <p className="eyebrow">我們的教學方法</p>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed">
            <p>溝通式教學法的理念在於:成功學習語言源自真正地傳達意義。當學員投入真實的溝通時,便會自然運用其語言習得策略,從而學會運用這門語言。</p>
            <p className="font-medium text-ink">📚 告別沉悶而冗長的文法課。在 La Dante,我們讓學習意大利文成為一場富啟發性而有趣的體驗 — 在輕鬆的環境中,學習自然水到渠成。📚</p>
          </div>
        </div>
      </section>

      {/* Our community — student demographics */}
      <section className="bg-azzurro-deep text-cream py-16 md:py-20">
        <div className="container-xl">
          <p className="eyebrow text-cream/70!">我們的社群</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-balance max-w-2xl text-cream!">一個宛如香港的社群。</h2>
          <p className="mt-3 text-cream/80 max-w-xl">由充滿好奇的三歲孩童,到年過六十五的終身學習者 — 我們的課室匯聚本地學員與來自世界各地的朋友。</p>
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {[
              { stat: "~80%", label: "本地香港學員", sub: "其餘則來自世界各地" },
              { stat: "35", label: "平均年齡", sub: "我們歡迎 3 歲至 65 歲以上的學員" },
              { stat: "6–10%", label: "兒童及青少年", sub: "其餘為各年齡與階段的成人學員" },
            ].map((s) => (
              <div key={s.label} className="rounded-3xl bg-cream/10 p-7">
                <p className="font-heading font-extrabold text-5xl md:text-6xl text-sole">{s.stat}</p>
                <p className="mt-3 font-semibold text-lg">{s.label}</p>
                <p className="mt-1 text-sm text-cream/70 leading-relaxed">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
