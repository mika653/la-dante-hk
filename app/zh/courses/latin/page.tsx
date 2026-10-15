import PageHeader from "@/components/PageHeader";

export default function LatinPage() {
  return (
    <>
      <PageHeader
        eyebrow="拉丁文課程"
        title="為什麽學習拉丁文？"
        subtitle="想要揭開歷史的秘密，變得更加學識淵博？和我們一起學習拉丁文吧！這個古老的語言是理解很多現代羅曼語族語言（例如意大利文和法文）的關鍵，它能幫助你理解這些現代羅曼語族語言的根源和文法，擴展你的詞匯，並掌握術語學的技巧。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "拉丁文" }]}
        tone="sole-soft"
      />

      <section className="bg-white py-14 md:py-16">
        <div className="container-xl max-w-3xl space-y-4">
          <p className="text-[15px] leading-relaxed">
            除了字詞的起源之外，你還可以沉浸在各種現代藝術中：文學，法律，哲學，在學習拉丁文的同時提升你的分析能力。除此之外，拉丁文讓你能夠破譯永恆不久的文本，提高對文化的認識，讓你的朋友對你刮目相看。
          </p>
          <p className="text-[13px] text-ink-muted leading-relaxed">
            擁抱拉丁文——讓古老智慧與現代文化交融！
          </p>
        </div>
      </section>

      <section className="bg-cream py-14 md:py-16 border-t border-line">
        <div className="container-xl max-w-3xl">
          <p className="eyebrow">為何選擇 La Dante 學習拉丁文？</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-heading font-bold">香港但丁.阿利吉耶里協會</h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-muted">
            <p>但丁.阿利吉耶里協會,自 1934 年起便是意大利語言與文化在香港的家。</p>
            <p>在全港歷史最悠久、機構聯繫最廣的意大利文化中心學習拉丁文 — 我們是享譽全球、總部位於羅馬的 Società Dante Alighieri 的成員,在全球 80 多個國家設有分會。</p>
          </div>
        </div>
      </section>
    </>
  );
}
