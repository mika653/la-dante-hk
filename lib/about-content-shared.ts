// About page content (/about and /zh/about): types, defaults and the
// normaliser, shared by the public pages, the admin editor and the server
// actions. Stored in site_config under the "about-content" key.
// No "use client" / "use server" directive.
import type { Bilingual } from "@/lib/site-content-shared";

export type { Bilingual };

export type AboutMilestone = { id: string; year: string; title: Bilingual; body: Bilingual };
export type AboutPerson = { id: string; name: string; role: Bilingual; email?: string };
export type AboutTeamGroup = { heading: Bilingual; subheading: Bilingual; members: AboutPerson[] };

export type AboutContent = {
  header: { eyebrow: Bilingual; title: Bilingual; subtitle: Bilingual };
  mural: {
    eyebrow: Bilingual;
    title: Bilingual;
    paragraphs: Bilingual[]; // supports line breaks + **bold** / *italic*
    image: string;
    imageAlt: Bilingual;
  };
  history: { eyebrow: Bilingual; title: Bilingual; milestones: AboutMilestone[] };
  team: {
    eyebrow: Bilingual;
    title: Bilingual;
    intro: Bilingual; // the Chinese page shows it only when the 繁中 is filled in
    board: AboutTeamGroup;
    staff: AboutTeamGroup; // members carry an email (English page)
    teachers: AboutTeamGroup;
    // The Chinese page has always shown only the management team. Turn this on
    // to also list the board and the teachers there.
    showBoardAndTeachersOnZh: boolean;
  };
};

const bi = (en: string, zh = ""): Bilingual => ({ en, zh });

export const defaultAboutContent: AboutContent = {
  header: {
    eyebrow: bi("About", "關於我們"),
    title: bi("Italian in Hong Kong since 1934.", "意大利文化在香港,自 1934 年。"),
    subtitle: bi(
      "The Dante Alighieri Society of Hong Kong is a non-profit cultural institution with a 90-year mission — to share the Italian language, culture, and community with the city we call home.",
      "香港但丁.阿利吉耶里協會 是一間非牟利文化機構,秉持 90 年的使命 — 與我們深愛的城市分享意大利的語言、文化與社群。",
    ),
  },
  mural: {
    eyebrow: bi("Our mural", "我們的壁畫"),
    title: bi("A love letter, in paint.", "一封畫成的情書。"),
    paragraphs: [
      bi(
        "Hong Kong's skyline meets Italian landmarks — ICC stands beside the Torre di Pisa, Two IFC alongside the Mole Antonelliana, the Colosseum rising between Bank of China and Jardine House. Each building carries an Italian word that connects it to our curriculum — *inclusione, poesia, intersezioni, espressione, comunità*.",
        "香港的天際線與意大利地標交織 — ICC 旁邊站著比薩斜塔,國金二期毗鄰 Mole Antonelliana,羅馬鬥獸場從中銀大廈與怡和大廈之間升起。每座建築都承載著一個意大利詞語,與我們的課程呼應 — *inclusione(包容)、poesia(詩意)、intersezioni(交匯)、espressione(表達)、comunità(社群)*。",
      ),
      bi(
        "The yellow and blue dots aren't decoration. They're our flag, our brand, and our reminder that Italy isn't somewhere else — it's here, in Hong Kong, every single day.",
        "那些黃色與藍色圓點並非裝飾,而是我們的旗幟、我們的品牌,也是提醒 — 意大利並非遙遠之地,每一天都在香港,就在你身邊。",
      ),
    ],
    image: "/mural.png",
    imageAlt: bi("La Dante mural", "La Dante 壁畫"),
  },
  history: {
    eyebrow: bi("90 years", "九十年"),
    title: bi("A small society. A long memory.", "小小的協會,長長的記憶。"),
    milestones: [
      { id: "m1934", year: "1934", title: bi("Founded", "成立"), body: bi("A small circle of Italian expats and Hong Kong enthusiasts gather to teach Italian in private homes.", "一群在港意大利僑民與香港愛好者於私人寓所教授意大利文。") },
      { id: "m1975", year: "1975", title: bi("Moved to Wanchai", "遷入灣仔"), body: bi("A permanent classroom opens at the Hong Kong Arts Centre — where we still are today.", "於香港藝術中心開設常設教室 — 至今仍在。") },
      { id: "m2010s", year: "2010s", title: bi("PLIDA accreditation", "PLIDA 認證"), body: bi("We become an official PLIDA examination centre for Hong Kong, offering A1–C2 certification.", "成為香港官方 PLIDA 考試中心,提供 A1–C2 認證。") },
      { id: "m2020", year: "2020", title: bi("Online", "網上教學"), body: bi("Rapid shift to live online classes during the pandemic expands our reach across Asia.", "疫情期間迅速轉型至網上直播課程,觸及全亞洲學員。") },
      { id: "m2024", year: "2024", title: bi("1,500+ students", "1,500+ 學員"), body: bi("A milestone year — reaching more learners than at any time in our history.", "里程碑的一年 — 學員數目創下歷史新高。") },
      { id: "m2026", year: "2026", title: bi("Website reborn", "全新網站"), body: bi("You're looking at it. New digital home, same 90-year spirit.", "您正在瀏覽的就是它。全新的數碼家園,延續九十年的精神。") },
    ],
  },
  team: {
    eyebrow: bi("Our team", "團隊與董事會"),
    title: bi("Faces you'll meet.", "你將會遇見的面孔。"),
    intro: bi("A board of directors, a small management team, and the teachers who bring Italian to life every day — the people behind La Dante."),
    board: {
      heading: bi("Board of Directors"),
      subheading: bi("Governance, patrons & honorary members."),
      members: [
        { id: "b1", name: "Bruno Feltracco", role: bi("President") },
        { id: "b2", name: "Alessandra Cocchi-Joynt", role: bi("Vice President") },
        { id: "b3", name: "Francesco Rinaldi", role: bi("Treasurer") },
        { id: "b4", name: "Manoj Kumar Motwani", role: bi("Board Member") },
        { id: "b5", name: "Anna Romagnoli", role: bi("Board Member") },
        { id: "b6", name: "Averardo Borghini Baldovinetti", role: bi("Board Member") },
        { id: "b7", name: "Francesca Biroli", role: bi("Board Member") },
        { id: "b8", name: "Giuseppe Randazzo", role: bi("Board Member") },
        { id: "b9", name: "Giovanni Angelini", role: bi("Board Member") },
        { id: "b10", name: "Dr. Richard Lee", role: bi("Patron") },
        { id: "b11", name: "Andrea Croci", role: bi("Honorary Member") },
      ],
    },
    staff: {
      heading: bi("Management & Administration"),
      subheading: bi("The team running the school day to day."),
      members: [
        { id: "s1", name: "Giulia Capasso", role: bi("School Coordinator", "校務統籌"), email: "giulia@ladante.cc" },
        { id: "s2", name: "Alice Agostini", role: bi("Office Manager", "辦公室經理"), email: "alice@ladante.cc" },
        { id: "s3", name: "Bill Chen", role: bi("Administrative & IT", "行政及資訊科技"), email: "bill@ladante.cc" },
        { id: "s4", name: "Johnny Yuen", role: bi("Marketing Officer", "市場推廣主任"), email: "johnny@ladante.cc" },
      ],
    },
    teachers: {
      heading: bi("Teachers"),
      subheading: bi("Our Italian teachers, A1 to C2."),
      members: [
        { id: "t1", name: "Francesca Coppeta", role: bi("Italian teacher") },
        { id: "t2", name: "Clelia Marinucci", role: bi("Italian teacher") },
        { id: "t3", name: "Giorgia Zecchinato", role: bi("Italian teacher") },
        { id: "t4", name: "Raffaella Iaconeta", role: bi("Italian teacher") },
        { id: "t5", name: "Jacopo Gorini", role: bi("Italian teacher") },
      ],
    },
    showBoardAndTeachersOnZh: false,
  },
};

// ---------- normalising stored data ----------

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});

function cleanBi(v: unknown, fallback: Bilingual): Bilingual {
  if (v == null || typeof v !== "object") return { ...fallback };
  const o = v as Partial<Bilingual>;
  return { en: str(o.en, fallback.en), zh: str(o.zh, fallback.zh) };
}
const biFilled = (b: Bilingual) => b.en.trim() !== "" || b.zh.trim() !== "";

let idCounter = 0;
const fallbackId = (prefix: string) => `${prefix}-${++idCounter}`;

function cleanPeople(v: unknown, fallback: AboutPerson[], withEmail: boolean): AboutPerson[] {
  if (!Array.isArray(v)) return fallback;
  return v
    .map((raw): AboutPerson => {
      const p = obj(raw);
      const person: AboutPerson = { id: str(p.id) || fallbackId("p"), name: str(p.name).trim(), role: cleanBi(p.role, { en: "", zh: "" }) };
      if (withEmail) person.email = str(p.email).trim();
      return person;
    })
    .filter((p) => p.name !== "");
}

function cleanGroup(v: unknown, fallback: AboutTeamGroup, withEmail: boolean): AboutTeamGroup {
  const g = obj(v);
  return {
    heading: cleanBi(g.heading, fallback.heading),
    subheading: cleanBi(g.subheading, fallback.subheading),
    members: cleanPeople(g.members, fallback.members, withEmail),
  };
}

export function normaliseAboutContent(v: unknown): AboutContent {
  const d = defaultAboutContent;
  const c = obj(v);
  const header = obj(c.header);
  const mural = obj(c.mural);
  const history = obj(c.history);
  const team = obj(c.team);

  const paragraphs = Array.isArray(mural.paragraphs)
    ? mural.paragraphs.map((p) => cleanBi(p, { en: "", zh: "" })).filter(biFilled)
    : d.mural.paragraphs;

  const milestones = Array.isArray(history.milestones)
    ? history.milestones
        .map((raw): AboutMilestone => {
          const m = obj(raw);
          return {
            id: str(m.id) || fallbackId("m"),
            year: str(m.year).trim(),
            title: cleanBi(m.title, { en: "", zh: "" }),
            body: cleanBi(m.body, { en: "", zh: "" }),
          };
        })
        .filter((m) => m.year !== "" || biFilled(m.title) || biFilled(m.body))
    : d.history.milestones;

  return {
    header: {
      eyebrow: cleanBi(header.eyebrow, d.header.eyebrow),
      title: cleanBi(header.title, d.header.title),
      subtitle: cleanBi(header.subtitle, d.header.subtitle),
    },
    mural: {
      eyebrow: cleanBi(mural.eyebrow, d.mural.eyebrow),
      title: cleanBi(mural.title, d.mural.title),
      paragraphs,
      image: str(mural.image, d.mural.image).trim(),
      imageAlt: cleanBi(mural.imageAlt, d.mural.imageAlt),
    },
    history: {
      eyebrow: cleanBi(history.eyebrow, d.history.eyebrow),
      title: cleanBi(history.title, d.history.title),
      milestones,
    },
    team: {
      eyebrow: cleanBi(team.eyebrow, d.team.eyebrow),
      title: cleanBi(team.title, d.team.title),
      intro: cleanBi(team.intro, d.team.intro),
      board: cleanGroup(team.board, d.team.board, false),
      staff: cleanGroup(team.staff, d.team.staff, true),
      teachers: cleanGroup(team.teachers, d.team.teachers, false),
      showBoardAndTeachersOnZh: typeof team.showBoardAndTeachersOnZh === "boolean" ? team.showBoardAndTeachersOnZh : d.team.showBoardAndTeachersOnZh,
    },
  };
}
