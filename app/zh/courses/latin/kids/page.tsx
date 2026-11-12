import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function LatinKids() {
  return (
    <>
      <PageHeader
        eyebrow="拉丁文 · 兒童及青少年"
        title="為年輕心靈而設的拉丁文。"
        subtitle="以故事帶領、循序漸進的拉丁文入門課程,適合 10 至 16 歲,為 IB 及 A-Level 作好準備。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "拉丁文", href: "/zh/courses/latin" }, { label: "兒童及青少年" }]}
        tone="sole-soft"
      />
      <section className="bg-cream py-14">
        <div className="container-xl text-center">
          <Link href="/zh/contact" className="btn btn-primary">表達興趣</Link>
        </div>
      </section>
    </>
  );
}
