import PageHeader from "@/components/PageHeader";
import { Wind, CloudRain, Info } from "lucide-react";

export const metadata = { title: "惡劣天氣安排 — La Dante HK" };

export default function BadWeather() {
  return (
    <>
      <PageHeader
        eyebrow="颱風及惡劣天氣"
        title="惡劣天氣安排。"
        subtitle="當天文台發出颱風或暴雨警告信號時,你的課堂、私人課堂或考試會如何安排。本指引一般適用於課程、私人課堂及考試。"
        crumbs={[{ label: "主頁", href: "/zh" }, { label: "惡劣天氣" }]}
      />

      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl max-w-3xl space-y-6">
          {/* Legend */}
          <div className="frame bg-white p-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> 課堂照常</span>
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rosso" /> 課堂暫停(或在情況許可下轉為網上進行)</span>
          </div>

          {/* Typhoon */}
          <div className="frame bg-white p-7 md:p-8">
            <h2 className="text-xl md:text-2xl font-heading font-bold inline-flex items-center gap-2"><Wind size={20} className="text-azzurro-deep" /> 熱帶氣旋警告信號</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              當天文台發出八號風球預警特別報告,或八號或以上熱帶氣旋警告信號時,課堂及考試將會<b className="text-ink">暫停</b>(在情況許可下轉為網上進行)。
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">當信號降至一號,或所有熱帶氣旋警告信號取消後,課堂將於以下時間恢復:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1.5 text-[15px] text-ink-muted marker:text-azzurro-deep">
              <li>親子班、兒童及青少年課程:課堂開始前 <b className="text-ink">3 小時</b>;</li>
              <li>成人課程、考試及私人課堂:課堂或考試開始前 <b className="text-ink">2 小時</b>。</li>
            </ul>
          </div>

          {/* Rainstorm */}
          <div className="frame bg-white p-7 md:p-8">
            <h2 className="text-xl md:text-2xl font-heading font-bold inline-flex items-center gap-2"><CloudRain size={20} className="text-azzurro-deep" /> 暴雨警告信號</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              當課堂開始前發出紅色或黑色暴雨警告信號,課堂及考試將會<b className="text-ink">暫停</b>(在情況許可下轉為網上進行)。
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">當信號改為黃色,或所有暴雨警告信號取消後,課堂將於以下時間恢復:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1.5 text-[15px] text-ink-muted marker:text-azzurro-deep">
              <li>親子班、兒童及青少年課程:課堂開始前 <b className="text-ink">3 小時</b>;</li>
              <li>成人課程、考試及私人課堂:課堂或考試開始前 <b className="text-ink">2 小時</b>。</li>
            </ul>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              若紅色或黑色暴雨警告信號於課堂或考試<b className="text-ink">進行期間</b>生效,該節課堂或考試將繼續至該節結束。
            </p>
          </div>

          {/* Notes */}
          <div className="frame bg-azzurro-soft border border-azzurro-deep/20 p-6">
            <p className="eyebrow !text-azzurro-deep inline-flex items-center gap-1.5"><Info size={14} /> 請注意</p>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[15px] text-ink-muted marker:text-azzurro-deep">
              <li>親子班、兒童、青少年及成人課程因惡劣天氣取消的課堂,恕不安排補課或退款。</li>
              <li>如課堂轉為網上進行或取消,學員將收到電郵通知。</li>
              <li>私人課堂如因惡劣天氣取消,將會重新安排預約。</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
