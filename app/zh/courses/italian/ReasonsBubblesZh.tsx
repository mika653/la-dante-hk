"use client";
import { useState } from "react";

const REASONS = [
  {
    key: "cultural",
    label: "文化欣賞",
    body: "意大利是世界上最美麗、歷史最豐富的國家之一。根據 UNESCO 資料,全球超過 60% 的藝術瑰寶都在意大利。從繪畫到建築,從文學到音樂,從設計到美食與美酒,生活與文化的各大領域都能找到意大利的影響。",
  },
  {
    key: "career",
    label: "事業機遇",
    body: "意大利是全球最強勁的經濟體之一,也是眾多國際企業的所在地。精通意大利文,在時尚、汽車、設計及款待等行業都是一大優勢。",
  },
  {
    key: "heritage",
    label: "連繫根源",
    body: "對擁有意大利血統的人而言,學習這門語言有助連繫自己的根源與家族歷史。",
  },
  {
    key: "structure",
    label: "語言結構",
    body: "意大利文以拼讀規律見稱,對英語使用者而言相對容易入門。它亦是通往其他羅曼語族語言（如西班牙文、法文及葡萄牙文）的門徑。",
  },
  {
    key: "community",
    label: "社群",
    body: "世界各地都有充滿活力的意大利文社群,為社交互動與文化交流提供機會。",
  },
  {
    key: "travel",
    label: "旅遊",
    body: "意大利應有盡有 — 由價值無可比擬的城市與小鎮,到壯麗的鄉郊,由秀麗的群山到純淨的海灘,由仍然活躍的火山到色彩繽紛的島嶼。參加旅行團或許已足以欣賞這些美景,但我們相信,真正融入其中只有一個方法:懂一點當地語言,便能與當地人交流,沉浸於他們熟悉而深愛的地方。",
  },
  {
    key: "cognitive",
    label: "認知益處",
    body: "正如大量研究所證實,學習一門新語言能提升認知能力,例如解難能力、記憶力,以及同時處理多項任務的能力。",
  },
];

// A gentle vertical stagger on larger screens, purely cosmetic — echoes the
// scattered-bubble reference layout without resorting to fragile absolute positioning.
const OFFSET: Record<string, string> = {
  career: "sm:mt-8",
  travel: "sm:mt-10",
  cognitive: "sm:mt-4",
};

export default function ReasonsBubblesZh() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
      {REASONS.map((r) => {
        const isOpen = openKey === r.key;
        return (
          <button
            key={r.key}
            type="button"
            onClick={() => setOpenKey(isOpen ? null : r.key)}
            aria-expanded={isOpen}
            className={`flex items-center justify-center text-center p-4 md:p-5 transition-all duration-200 ${OFFSET[r.key] ?? ""} ${
              isOpen
                ? "rounded-3xl bg-azzurro-deep text-cream min-h-[9rem] shadow-lg"
                : "rounded-full aspect-square bg-azzurro text-ink hover:bg-azzurro-deep hover:text-cream"
            }`}
          >
            {isOpen ? (
              <span className="text-[12px] md:text-[13px] leading-relaxed font-normal">{r.body}</span>
            ) : (
              <span className="text-[13px] md:text-sm font-semibold leading-tight">{r.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
