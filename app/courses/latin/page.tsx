import PageHeader from "@/components/PageHeader";

export default function LatinPage() {
  return (
    <>
      <PageHeader
        eyebrow="Latin · 拉丁文課程"
        title="Why study Latin?"
        subtitle="Unlock the secrets of history and enhance your intellectual prowess by studying Latin! This ancient language is the key to understanding the roots and grammar of modern romance languages, such as Italian and French, expanding your vocabulary, and mastering scientific terminology."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Latin" }]}
        tone="sole-soft"
      />

      <section className="bg-white py-14 md:py-16">
        <div className="container-xl max-w-3xl space-y-4">
          <p className="text-[15px] leading-relaxed">
            Whether you&apos;re curious about the origin of words, you&apos;ll dive into the rich tapestry of literature, law, and philosophy that shapes our modern world, all while sharpening your analytical skills. Plus, impress your friends with your newfound ability to decode timeless texts and elevate your understanding of culture. Embrace Latin—where ancient wisdom meets modern relevance!
          </p>
          <p className="text-[13px] text-ink-soft leading-relaxed">
            想要揭開歷史的秘密，變得更加學識淵博？和我們一起學習拉丁文吧！這個古老的語言是理解很多現代羅曼語族語言（例如意大利文和法文）的關鍵，它能幫助你理解這些現代羅曼語族語言的根源和文法，擴展你的詞匯，並掌握術語學的技巧。除了字詞的起源之外，你還可以沉浸在各種現代藝術中：文學，法律，哲學，在學習拉丁文的同時提升你的分析能力。除此之外，拉丁文讓你能夠破譯永恆不久的文本，提高對文化的認識，讓你的朋友對你刮目相看。擁抱拉丁文——讓古老智慧與現代文化交融！
          </p>
        </div>
      </section>

      <section className="bg-cream py-14 md:py-16 border-t border-line">
        <div className="container-xl max-w-3xl">
          <p className="eyebrow">Why learning Latin at La Dante?</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-heading font-bold">Dante Alighieri Society Hong Kong</h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-muted">
            <p>Dante Alighieri Society, your home for Italian language and culture in Hong Kong since 1935.</p>
            <p>Learn Latin with the most established and institutionally connected Italian centre, part of the globally recognised Società Dante Alighieri in Rome, with centres in more than 80 countries worldwide.</p>
          </div>
        </div>
      </section>
    </>
  );
}
