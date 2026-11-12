import PageHeader from "@/components/PageHeader";
import KidsClient from "@/app/courses/italian/kids/KidsClient";

export default function KidsPage() {
  return (
    <>
      <PageHeader
        eyebrow="意大利文 · 兒童及青少年"
        title="Piccoli & Ragazzi Dante."
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "意大利文" }, { label: "兒童及青少年" }]}
        tone="sole-soft"
      />
      <section className="bg-white py-14 md:py-16">
        <div className="container-xl max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-muted">
          <p>我們提供沉浸式而充滿樂趣的課程,專為不同年齡的孩子而設,讓學習意大利文成為一場愉快的冒險。</p>
          <p>我們為 3 至 6 歲幼兒而設的 Playgroup 課程寓學習於遊戲,而為 7 至 10 歲兒童而設的精彩兒童組課程,則把語言能力提升至另一層次。兩個課程都透過歌曲、音樂、故事、手工、互動活動及遊戲,讓孩子沉浸於意大利及其語言的奇妙世界 🎊。</p>
          <p>課程著重以有趣而有系統的方式,為孩子在說、讀、寫、聽各方面打下穩固的基礎。</p>
        </div>
      </section>

      <section className="bg-cream py-12 md:py-16">
        <div className="container-xl max-w-4xl">
          <p className="eyebrow">兒童及青少年課程</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-heading font-semibold">按程度尋找課程。</h2>
          <p className="mt-2 text-ink-muted text-[15px]">按程度篩選,查看本學期開辦的班級。</p>
          <div className="mt-6">
            <KidsClient />
          </div>
        </div>
      </section>
    </>
  );
}
