import PageHeader from "@/components/PageHeader";

export default function Merch() {
  return (
    <>
      <PageHeader
        eyebrow="商店"
        title="商品與書籍。"
        subtitle="教科書、帆布袋,偶爾還有但丁主題的咖啡杯。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "商店" }]}
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center frame p-10 bg-white max-w-xl mx-auto">
          <p className="eyebrow">即將推出</p>
          <h2 className="mt-2 text-2xl">但丁商店將於今年稍後開幕。</h2>
        </div>
      </section>
    </>
  );
}
