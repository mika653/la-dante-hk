import PageHeader from "@/components/PageHeader";
import { levelOutcomes } from "@/lib/data";
import { SUB_LEVELS } from "@/lib/adult-groups-syllabus";

const CARD_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

const CARD_COLOR: Record<string, string> = {
  A1: "#7FE3CB",
  A2: "#35C4B0",
  B1: "#3BB6E8",
  B2: "#2E8FD1",
  C1: "#1E5FA6",
  C2: "#2A2470",
};

const TEXTBOOK: Record<string, string> = {
  A1: "Nuovo Espresso Plus 1",
  A2: "Nuovo Espresso 2",
  B1: "Nuovo Espresso 3",
  B2: "Nuovo Espresso 4",
  C1: "Nuovo Espresso 5",
  C2: "Nuovo Espresso 6",
};

const CEFR_GROUPS = [
  {
    tier: "Basic User", tierZh: "初學階段",
    levels: [
      {
        code: "A1",
        en: [
          "Can understand and use familiar everyday expressions and basic phrases meant to meet specific needs of a concrete type.",
          "Can introduce him/herself and others and can ask and answer questions about personal information such as where he/she lives, people he/she knows and things he/she has.",
          "Can interact in a simple way provided the other person talks slowly and clearly and is willing to help.",
        ],
        zh: [
          "能夠理解並運用常見的日常表達方式和基本短語，符合具體類型的特定要求。",
          "能夠介紹自己或他人，能夠詢問及回答相關的個人信息，例如住所，人際關係和私人物品。",
          "對於他人緩慢且清晰的談話，能夠以簡單的方式互動。",
        ],
      },
      {
        code: "A2",
        en: [
          "Can understand sentences and frequently used expressions related to areas of most immediate importance (e.g. simple personal and family information, shopping, local geography, employment).",
          "Can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar and routine matters.",
          "Can describe in simple terms aspects of his/her background, immediate environment and issues in areas of immediate need.",
        ],
        zh: [
          "在最貼近自己的場景或領域中，能夠理解常用的表達方式和語句，例如簡單的家庭和個人信息，購物，當地地理，以及就業。",
          "能夠與他人溝通簡單的例行事務，只需對熟悉的日常事務掌握簡單明瞭的信息。",
          "能夠以簡單的方式描述自身背景，以及最貼近自己環境中的事物。",
        ],
      },
    ],
  },
  {
    tier: "Independent User", tierZh: "獨立階段",
    levels: [
      {
        code: "B1",
        en: [
          "Can understand the main points of clear standard language on familiar matters regularly encountered in work, school, leisure, etc.",
          "Can deal with most situations that may occur while travelling in an area where the language is spoken.",
          "Can produce simple connected text on topics which are familiar or of personal interest. Can describe experiences and events, dreams, ambitions and briefly give reasons and explanations for opinions and plans.",
        ],
        zh: [
          "對於工作，學業和休閑生活等場景中常見的事物，能夠理解該語言清晰而標準的表述。",
          "能夠在使用該語言的地區旅游時應對大部分情況。",
          "能夠對熟悉或感興趣的主題進行簡單的表達。能夠描述經歷、事件、夢想和志向，并對意見和計劃給出簡要的理由和解釋。",
        ],
      },
      {
        code: "B2",
        en: [
          "Can understand the key aspects of complex text on both concrete and abstract topics, including technical discussions in his/her field of specialisation.",
          "Can interact with a level of fluency and spontaneity that makes regular interaction with native speakers quite possible without difficulty.",
          "Can produce clear, detailed text on a wide range of topics and explain a perspective on a topical issue giving the advantages and disadvantages of various options.",
        ],
        zh: [
          "能夠理解具體和抽象主題下複雜文章的主旨，其中包括技術性地探討自己的專業領域。",
          "能在一定程度上與該語言的母語人士進行自然流暢的正常交流。",
          "能夠針對廣泛的主題表達清晰詳細的闡述，並針對時事解釋其中的不同觀點及其利弊關係。",
        ],
      },
    ],
  },
  {
    tier: "Proficient User", tierZh: "精通階段",
    levels: [
      {
        code: "C1",
        en: [
          "Can understand a wide range of demanding, longer texts, and recognise implicit meaning.",
          "Can express him/herself fluently and spontaneously without significant hesitation in finding the right expressions.",
          "Can use language flexibly and effectively for social, academic and professional purposes.",
          "Can produce clear, well-structured, detailed text on complex subjects, showing controlled use of organisational structures, linking words and cohesive elements.",
        ],
        zh: [
          "能夠理解各種難度較高，篇幅較長的文章，並辨識其中的隱含意義。",
          "可以毫不猶豫且自然流暢地表達自己的想法，不會出現明顯的詞窮。",
          "能夠將該語言靈活且有效地運用在社交、學術及專業目的之上。",
          "能夠針對複雜的主題撰寫清晰詳細的文本，同時合理運用組織結構和銜接詞組，令到文本的起承轉合掌控得宜。",
        ],
      },
      {
        code: "C2",
        en: [
          "Can understand with ease virtually everything heard or read.",
          "Can summarise information from different spoken and written sources, reconstructing reasons and explanations in a coherent way.",
          "Can express him/herself spontaneously, in a very fluent and precise way, differentiating shades of meaning in more complex situations.",
        ],
        zh: [
          "幾乎可以輕鬆理解所有聽到或讀到的內容。",
          "能夠從不同的口語和書面來源中總結概要，并有條理地重新組織其中的觀點和緣由。",
          "能夠以非常自然流暢且嚴謹的方式表達自己，在極其複雜的情景中也能辨識該語言用詞裏的細微含義。",
        ],
      },
    ],
  },
];

export default function LevelProgressionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Italian · Level Progression"
        title="Six levels. One journey."
        crumbs={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Italian" }, { label: "Level Progression" }]}
        tone="sole-soft"
      />

      <section className="bg-white py-14 md:py-16 border-b border-line">
        <div className="container-xl">
          <p className="max-w-3xl text-[15px] leading-relaxed">
            Our Italian courses are based on the levels of the Common European Framework of Reference for Languages.
          </p>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
            <div className="flex items-center gap-2.5"><span className="w-9 h-2.5 rounded-sm bg-sole" aria-hidden /><span className="font-medium">Course Levels at DanteHK (Adults)</span></div>
            <div className="flex items-center gap-2.5"><span className="w-9 h-2.5 rounded-sm" style={{ background: "linear-gradient(to right, #7FE3CB, #2A2470)" }} aria-hidden /><span className="font-medium">CEFR Language Levels</span></div>
            <div className="flex items-center gap-2.5"><span className="w-9 h-2.5 rounded-sm bg-line" aria-hidden /><span className="font-medium">Textbook</span></div>
          </div>

          {/* Level funnel card */}
          <div className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-3">
            {CARD_ORDER.map((key) => {
              const sub = SUB_LEVELS[key] ?? [];
              const subRange = sub.length > 1 ? `${sub[0]} – ${sub[sub.length - 1]}` : sub[0] ?? "";
              const color = CARD_COLOR[key];
              return (
                <div key={key} className="flex flex-col">
                  <div
                    className="h-12 md:h-14 flex items-center justify-center text-white font-heading font-extrabold text-base md:text-lg"
                    style={{ backgroundColor: color, clipPath: "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%, 16% 50%)" }}
                  >
                    {key}
                  </div>
                  <div className="bg-sole text-ink text-center text-[10px] md:text-xs font-bold py-1.5 px-1 leading-tight">
                    {subRange}
                  </div>
                  <div className="flex-1 flex items-center justify-center text-center px-2 py-8 md:py-12" style={{ backgroundColor: color }}>
                    <span className="text-white font-heading font-bold text-sm md:text-xl">{levelOutcomes[key]?.stage}</span>
                  </div>
                  <div className="bg-line/60 text-ink text-center text-[11px] md:text-xs font-semibold py-3 px-1 leading-tight">
                    {TEXTBOOK[key]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CEFR global scale descriptors */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl space-y-8">
          {CEFR_GROUPS.map((g) => (
            <div key={g.tier} className="frame bg-white p-6 md:p-8">
              <p className="eyebrow">{g.tier} <span className="text-ink-muted font-normal">{g.tierZh}</span></p>
              <div className="mt-4 divide-y divide-line">
                {g.levels.map((l) => (
                  <div key={l.code} className="grid md:grid-cols-[80px_1fr] gap-4 md:gap-6 py-6 first:pt-4">
                    <div className="text-2xl font-heading font-extrabold text-azzurro-deep">{l.code}</div>
                    <div className="space-y-4">
                      <ul className="space-y-1.5 text-[15px] leading-relaxed">
                        {l.en.map((o) => (
                          <li key={o} className="flex gap-2">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-azzurro shrink-0" aria-hidden />{o}
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-1 text-[13px] text-ink-muted leading-relaxed">
                        {l.zh.map((o) => (
                          <li key={o} className="flex gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-ink-soft shrink-0" aria-hidden />{o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
