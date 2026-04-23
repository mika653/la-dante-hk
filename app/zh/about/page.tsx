import PageHeader from "@/components/PageHeader";
import Image from "next/image";

export default function AboutZh() {
  return (
    <>
      <PageHeader
        eyebrow="關於我們"
        title="意大利文化在香港,自 1935 年。"
        subtitle="香港但丁.阿利吉耶里協會 是一間非牟利文化機構,秉持 90 年的使命 — 與我們深愛的城市分享意大利的語言、文化與社群。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "關於" }]}
      />

      {/* Mural storytelling band */}
      <section className="relative bg-cream py-16 md:py-24">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow">我們的壁畫</p>
              <h2 className="mt-3 text-3xl md:text-5xl">一封畫成的情書。</h2>
              <p className="mt-5 text-ink-muted">
                香港的天際線與意大利地標交織 — ICC 旁邊站著比薩斜塔,國金二期毗鄰 Mole Antonelliana,羅馬鬥獸場從中銀大廈與怡和大廈之間升起。每座建築都承載著一個意大利詞語,與我們的課程呼應 — <em>inclusione(包容)、poesia(詩意)、intersezioni(交匯)、espressione(表達)、comunità(社群)</em>。
              </p>
              <p className="mt-4 text-ink-muted">
                那些黃色與藍色圓點並非裝飾,而是我們的旗幟、我們的品牌,也是提醒 — 意大利並非遙遠之地,每一天都在香港,就在你身邊。
              </p>
            </div>
            <div className="relative aspect-[4/3] frame bg-white">
              <Image src="/mural.png" alt="La Dante 壁畫" fill className="object-cover rounded-3xl" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      <section id="90-years" className="bg-white py-16 md:py-24 border-t border-line">
        <div className="container-xl">
          <p className="eyebrow">九十年</p>
          <h2 className="mt-3 text-3xl md:text-5xl max-w-2xl">小小的協會,長長的記憶。</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {[
              { year: "1935", title: "成立",              body: "一群在港意大利僑民與香港愛好者於私人寓所教授意大利文。" },
              { year: "1975", title: "遷入灣仔",          body: "於香港藝術中心開設常設教室 — 至今仍在。" },
              { year: "2010s", title: "PLIDA 認證",        body: "成為香港官方 PLIDA 考試中心,提供 A1–C2 認證。" },
              { year: "2020", title: "網上教學",          body: "疫情期間迅速轉型至網上直播課程,觸及全亞洲學員。" },
              { year: "2024", title: "1,500+ 學員",       body: "里程碑的一年 — 學員數目創下歷史新高。" },
              { year: "2026", title: "全新網站",          body: "您正在瀏覽的就是它。全新的數碼家園,延續九十年的精神。" },
            ].map((m) => (
              <div key={m.year} className="frame p-6 bg-cream-2/50">
                <p className="font-heading font-extrabold text-3xl text-azzurro-deep">{m.year}</p>
                <h3 className="mt-1 font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="bg-sole-soft py-16 md:py-24">
        <div className="container-xl">
          <p className="eyebrow">團隊與董事會</p>
          <h2 className="mt-3 text-3xl md:text-5xl">你將會遇見的面孔。</h2>
          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Giulia Marchetti", role: "總監" },
              { name: "Marco Rossi",      role: "首席導師" },
              { name: "Sofia Bianchi",    role: "PLIDA 統籌" },
              { name: "Elena Conti",      role: "文化項目" },
            ].map((p) => (
              <div key={p.name} className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full bg-ink text-cream font-heading font-extrabold text-5xl inline-flex items-center justify-center">{p.name.split(" ").map((x) => x[0]).join("")}</div>
                <p className="mt-4 font-semibold">{p.name}</p>
                <p className="text-sm text-ink-muted">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
