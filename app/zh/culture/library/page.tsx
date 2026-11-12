import Link from "next/link";
import { BookOpen, Users, Feather, ArrowRight, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const OFFERINGS = [
  {
    id: "borrow",
    Icon: BookOpen,
    kicker: "借閱服務",
    title: "借書",
    lead:
      "我們位於灣仔的書架上收藏了超過 1,400 本意大利文書籍 — 小說與詩歌、兒童繪本、漫畫、分級讀物,以及不斷增加的意大利電影 DVD。會員可免費借閱。",
    points: [
      "1,400+ 本意大利文書籍及 DVD 可供借閱",
      "由入門 (A1) 至母語程度,各程度俱備",
      "下次到校時即可翻閱及借閱",
    ],
    cta: { label: "成為會員", href: "/zh/membership" },
  },
  {
    id: "bookclub",
    Icon: Users,
    kicker: "讀書會",
    title: "Il Salotto di Dante",
    lead:
      "社群、書本,偶爾還有一瓶美酒。我們的讀書會以意大利文共讀一本書(輔以適度英文支援),然後像羅馬 salotto 裡的老朋友一樣聚首暢談。",
    points: [
      "以意大利文導讀,輔以英文支援",
      "輕鬆的晚間聚會 — 日期請參閱活動日曆",
      "歡迎會員及有興趣的非會員參加",
    ],
    cta: { label: "查看即將舉行的聚會", href: "/zh/culture" },
  },
  {
    id: "presidio",
    Icon: Feather,
    kicker: "但丁學會計劃",
    title: "Presidio Letterario",
    lead:
      "Presidio Letterario 是但丁學會的閱讀計劃 —「文學據點」,推廣優秀文學作品並凝聚讀者。作為全球但丁網絡的一員,香港但丁學會把這份精神帶到香港。",
    points: [
      "全球但丁學會計劃的一部分",
      "頌揚新舊意大利文學",
      "全年舉辦朗讀會及作家活動",
    ],
    cta: { label: "查詢如何參加", href: "/zh/contact" },
  },
];

export default function Library() {
  return (
    <>
      <PageHeader
        eyebrow="文化 · 圖書館"
        title="在但丁閱讀。"
        subtitle="課堂以外,圖書館是我們社群閱讀、借書、暢談小說、分享美酒的地方。三種參與方式,任君選擇。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "文化", href: "/zh/culture" }, { label: "圖書館" }]}
        tone="sole-soft"
      />

      <section className="bg-white py-12 md:py-14 border-b border-line">
        <div className="container-xl">
          <div className="flex flex-wrap gap-2.5">
            {OFFERINGS.map((o) => (
              <a key={o.id} href={`#${o.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-line text-sm font-medium hover:border-ink transition-colors">
                <o.Icon size={15} className="text-azzurro-deep" />
                {o.kicker}
              </a>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
            <MapPin size={15} className="text-azzurro-deep shrink-0" />
            <span>藏書位於灣仔校址。<span className="text-ink-soft">開放時間及借閱條款待定。</span></span>
          </div>
        </div>
      </section>

      {OFFERINGS.map((o, i) => {
        const reversed = i % 2 === 1;
        const band = reversed ? "bg-paper" : "bg-white";
        return (
          <section key={o.id} id={o.id} className={`${band} py-16 md:py-24 border-t border-line scroll-mt-24`}>
            <div className="container-xl">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className={reversed ? "lg:order-2" : ""}>
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sole text-ink mb-5">
                    <o.Icon size={22} strokeWidth={1.75} />
                  </span>
                  <p className="eyebrow">{o.kicker}</p>
                  <h2 className="mt-3 text-3xl md:text-5xl text-balance">{o.title}</h2>
                  <p className="mt-5 text-ink-muted max-w-xl">{o.lead}</p>
                  <ul className="mt-6 space-y-2.5">
                    {o.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <span aria-hidden className="mt-2 w-1.5 h-1.5 rounded-full bg-azzurro-deep shrink-0" />
                        <span className="text-[15px]">{p}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={o.cta.href} className="btn btn-primary mt-8">{o.cta.label} <ArrowRight size={16} /></Link>
                </div>
                <div className={reversed ? "lg:order-1" : ""}>
                  <div className="aspect-[4/3] rounded-frame bg-azzurro-soft/60 border border-line" aria-hidden />
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
