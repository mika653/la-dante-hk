import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CorporatePage() {
  return (
    <>
      <PageHeader
        eyebrow="意大利文 · 企業課程"
        title="為您的團隊而設的意大利文。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "課程", href: "/zh/courses" }, { label: "意大利文" }, { label: "企業課程" }]}
        tone="sole-soft"
      />

      <section className="bg-white py-14 md:py-16">
        <div className="container-xl max-w-3xl space-y-8 text-[15px] leading-relaxed">
          <div className="space-y-1.5">
            <p>計劃提升貴公司的企業價值？希望通過意大利語和客戶及同事溝通？在但丁協會,我們為您提供量身定制的培訓計劃,無論是實體或網上課程,都能夠貼合您對員工和公司的需求。</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">我們的教學方法</h2>
            <p className="mt-2">我們針對貴公司自身的語言需求,透過新穎且高效的教學方法為您量身定制每一節課堂。我們的講師均為擁有教學認證的意大利母語者,具有豐富的商務意大利語教學經驗,確保貴公司能夠獲得一流的指導。</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">我們的企業課程</h2>
            <p className="mt-2">在掌握意大利文的基本文法和結構後,您可以選擇更多專業課程,包括但不限於:商務意大利文,意大利的時尚與設計行業,意大利的商務文化及禮儀。</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">會員權益</h2>
            <p className="mt-2">
              除此之外,鑽石會員、金會員以及銀會員還可以享受額外的獨家福利,成為我們的贊助商並獲取你的特殊優惠及贈送課堂。{" "}
              <Link href="/zh/services/sponsorship" className="text-azzurro-deep underline">了解更多贊助詳情 →</Link>
            </p>
          </div>

          <div className="pt-2 border-t border-line">
            <p className="font-medium text-ink">聯絡我們,將您團隊的語言能力轉化為競爭優勢！</p>
            <p className="mt-1 text-[13px] text-ink-muted">(課程時長及日程安排可根據貴公司的需求進行規劃)</p>
            <Link href="/zh/contact" className="btn btn-primary mt-5">索取課程建議書 <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
