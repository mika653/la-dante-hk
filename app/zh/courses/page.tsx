import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const paths = [
  { href: "/zh/courses/italian/adult-groups", tag: "意大利文 · 成人",  title: "小組課程",  blurb: "我們的旗艦課程 — CEFR A1 至 C1,灣仔小班及網上授課。", tone: "blue" },
  { href: "/zh/courses/italian/private",      tag: "意大利文 · 一對一",  title: "私人課程",blurb: "完全彈性、度身訂造的課程。任何程度,任何時間。",       tone: "cream" },
  { href: "/zh/courses/italian/kids",         tag: "意大利文 · 7–15 歲",    title: "兒童及青少年",   blurb: "Piccoli Dante 與 Ragazzi Dante — 寓學於樂,以故事帶動,適合週六上課。", tone: "yellow" },
  { href: "/zh/courses/italian/corporate",    tag: "意大利文 · 團隊",   title: "企業培訓",       blurb: "到場團隊課程,並附文化簡介。",             tone: "white"  },
  { href: "/zh/courses/italian/special",      tag: "意大利文 · 專題",  title: "特色課程", blurb: "按主題開辦的短期課程 — 會話、文法、PLIDA 備試、創意寫作。", tone: "yellow" },
  { href: "/zh/courses/italian/online",       tag: "意大利文 · 網上",  title: "網上課程",          blurb: "透過 Zoom 進行的實時小組課堂,設有香港時區時段。",         tone: "blue" },
  { href: "/zh/courses/latin/groups",         tag: "拉丁文",             title: "拉丁文",           blurb: "古典拉丁文,由初階詞形變化到閱讀 Cicero 原著。",       tone: "yellow" },
  { href: "/zh/courses/study-in-italy",       tag: "海外",            title: "留學意大利",  blurb: "暑期課程、大學升學準備,以及學生簽證指引。",        tone: "cream" },
  { href: "/zh/courses/teacher-training",     tag: "專業進修",      title: "師資培訓",blurb: "為有志成為意大利文教師者提供 CEDILS 及 DITALS 培訓。",          tone: "white"  },
  { href: "/zh/placement-test",               tag: "免費 · 5 分鐘",      title: "分級測驗",  blurb: "透過 15 條自適應題目找出你的程度。",                          tone: "blue"   },
  { href: "/zh/courses/italian/level-progression", tag: "參考",    title: "程度進階", blurb: "了解 A1 至 C2 如何對應我們的課程與教材。",          tone: "cream"  },
];

const toneClass: Record<string, string> = {
  blue:  "bg-ink text-cream",
  yellow:"bg-sole-soft text-ink",
  cream: "bg-cream-2 text-ink border border-line",
  white: "bg-white text-ink border border-line",
};

export default function CoursesIndex() {
  return (
    <>
      <PageHeader
        eyebrow="所有課程"
        title="選擇你的路徑。"
        subtitle="十一條通往意大利文(及拉丁文)的途徑。我們所有小組課程均符合 CEFR 標準,並由具認證資格的母語教師任教。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程" }]}
      />
      <section className="bg-cream py-16 md:py-20">
        <div className="container-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((p) => (
            <Link key={p.href} href={p.href} className={`group frame p-8 min-h-[220px] flex flex-col justify-between ${toneClass[p.tone]}`}>
              <div>
                <p className={`eyebrow ${p.tone === "blue" ? "!text-sole" : ""}`}>{p.tag}</p>
                <h3 className="mt-3 text-2xl font-semibold">{p.title}</h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${p.tone === "blue" ? "text-cream/85" : "text-ink-muted"}`}>{p.blurb}</p>
              </div>
              <span className={`mt-5 inline-flex items-center gap-2 text-sm font-medium ${p.tone === "blue" ? "text-sole" : "text-azzurro-deep"}`}>
                了解更多 <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
