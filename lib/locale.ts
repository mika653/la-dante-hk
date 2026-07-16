"use client";
import { usePathname } from "next/navigation";

export type Locale = "en" | "zh";

const en = {
  announce: {
    parts: [
      "Early-bird 10% off May–July term",
      "University students −20% year-round",
    ],
    cta: "See courses →",
  },
  nav: {
    courses: "Courses",
    culture: "Culture",
    plida: "PLIDA",
    membership: "Membership",
    more: "More",
    studentLogin: "Student log-in",
    placementTest: "Placement test",
    enrol: "Enrol →",
  },
  hero: {
    eyebrow: "Italiano · Latino · Hong Kong · 1935",
    line1: "Impara",
    line2: "l'italiano",
    line3: "a Hong Kong",
    subhead: "Certified native teachers, CEFR-aligned courses, and a 90-year tradition of Italian culture in the heart of Wanchai.",
    cta1: "Take the placement test",
    cta2: "See May–July courses",
    trust: ["4.9 rating", "1,500+ students", "Wanchai & online", "PLIDA certified"],
  },
  trustBand: [
    { label: "Official PLIDA centre", detail: "For A1–C2 certification" },
    { label: "Italian Consulate",      detail: "Recognised cultural society" },
    { label: "CEFR-aligned",           detail: "All adult group courses" },
    { label: "1,500+ students",        detail: "Hong Kong's largest" },
  ],
  courses: {
    eyebrow: "Four ways to learn",
    titleLead: "",
    titleHighlight: "Find",
    titleTail: " your course.",
    subtitle: "Whether you're starting from scratch or reading Dante in the original, there's a seat for you.",
    circles: {
      groups:    { tag: "Most popular", label: "Groups" },
      private:   { tag: "Flexible",     label: "Private" },
      latin:     { tag: "Classical",    label: "Latin" },
      corporate: { tag: "For teams",    label: "Corporate" },
    },
  },
  membership: {
    eyebrow: "Dante membership",
    titleLead: "Join the ",
    titleAccent: "comunità",
    titleTail: ".",
    subhead: "Course discounts, library access, 50+ curated Italian perks across Hong Kong, and the warmest Italian community in the city.",
    cta1: "Become a member",
    cta2: "See all perks",
    stats: [
      { n: "1,500+",   l: "Members" },
      { n: "90 years", l: "In Hong Kong" },
      { n: "50+",      l: "Member perks" },
    ],
  },
  workshops: {
    eyebrow: "Beyond the classroom",
    titleHighlight: "Our",
    titleTail: " workshops.",
    subtitle: "Planned sessions you can book — plus ideas we're gauging interest for. Tap I'm interested and we'll open the class when enough of you want it.",
    seeAll: "All workshops →",
    planned: "Planned",
    interested: "interested",
    book: "Book a seat",
    imInterested: "I'm interested",
  },
  library: {
    eyebrow: "Italy, every day",
    title: "Community, books, and bottles of wine.",
  },
  instagram: {
    eyebrow: "@ladantehk",
    titleHighlight: "Italy,",
    titleTail: " this week in HK.",
    follow: "Follow on Instagram",
  },
  sponsors: {
    eyebrow: "Our sponsors",
    title: "Proudly supported by.",
    classroom: "Classroom sponsors · A–G",
    gold: "Gold sponsor",
    silver: "Silver sponsors",
  },
  featured: {
    eyebrow: "Happening at Dante",
    title: "What's on",
    seeAll: "See everything →",
  },
  newsletter: {
    eyebrow: "Stay in touch",
    titleHighlight: "Join",
    titleTail: " us for news & updates.",
    subtitle: "New terms, workshops, cultural events, and the occasional Italian joke.",
    firstName: "First name",
    email: "you@email.com",
    subscribe: "Subscribe",
    thanks: (email: string) => `Grazie! We'll be in touch at ${email}.`,
    small: "We'll never share your email. Unsubscribe anytime.",
  },
  footer: {
    blurb: "The Dante Alighieri Society of Hong Kong. Italian and Latin language, culture, and community — since 1935.",
    learn: "Learn",
    italianGroups: "Italian groups",
    latin: "Latin",
    kidsTeens: "Kids & teens",
    private: "Private",
    placementTest: "Placement test",
    society: "Society",
    membership: "Membership",
    culture: "Culture",
    plida: "PLIDA",
    aboutUs: "About us",
    studentPortal: "Student portal",
    gift: "Gift a year",
    visit: "Visit us",
    address: "TC2, TCF, HK Arts Centre, 2 Harbour Road, Wan Chai, Hong Kong",
    hours: "Mon–Fri 10:00–19:00 · Sat 10:00–14:00",
    allRights: "All rights reserved",
    privacy: "Privacy",
    terms: "Terms",
    typhoon: "Typhoon policy",
  },
  banner: "Traditional Chinese translations are preview-grade. Help us polish — email info@ladante.cc.",
  switcher: { label: "中", title: "繁體中文" },
};

const zh: typeof en = {
  announce: {
    parts: [
      "5–7 月課程早鳥 9 折優惠",
      "大學生全年 8 折",
    ],
    cta: "查看課程 →",
  },
  nav: {
    courses: "課程",
    culture: "文化",
    plida: "PLIDA",
    membership: "會員",
    more: "更多",
    studentLogin: "學員登入",
    placementTest: "分班測試",
    enrol: "立即報名 →",
  },
  hero: {
    eyebrow: "意大利文 · 拉丁文 · 香港 · 1935",
    line1: "Impara",
    line2: "l'italiano",
    line3: "於香港",
    subhead: "認證意大利籍導師、CEFR 標準課程,以及紮根灣仔、傳承九十年的意大利文化。",
    cta1: "做分班測試",
    cta2: "查看 5–7 月課程",
    trust: ["4.9 評分", "1,500+ 學員", "灣仔及網上授課", "PLIDA 認證中心"],
  },
  trustBand: [
    { label: "官方 PLIDA 考試中心", detail: "A1–C2 全級別認證" },
    { label: "意大利領事館",          detail: "認可文化機構" },
    { label: "CEFR 標準",            detail: "所有成人小組課程" },
    { label: "1,500+ 學員",          detail: "全港最大意大利文學習社群" },
  ],
  courses: {
    eyebrow: "四種學習方式",
    titleLead: "",
    titleHighlight: "選擇",
    titleTail: "你的課程。",
    subtitle: "不論你是零基礎,還是已在閱讀但丁原著,這裡都有適合你的位置。",
    circles: {
      groups:    { tag: "最受歡迎", label: "小組班" },
      private:   { tag: "時間靈活", label: "私人課" },
      latin:     { tag: "古典文化", label: "拉丁文" },
      corporate: { tag: "企業團隊", label: "企業課" },
    },
  },
  membership: {
    eyebrow: "但丁會員",
    titleLead: "加入 ",
    titleAccent: "comunità",
    titleTail: " 大家庭。",
    subhead: "課程優惠、圖書館使用權、全港 50+ 個意大利精選會員禮遇,以及全城最溫暖的意大利人社群。",
    cta1: "成為會員",
    cta2: "查看所有禮遇",
    stats: [
      { n: "1,500+",  l: "會員" },
      { n: "九十年",  l: "紮根香港" },
      { n: "50+",     l: "會員禮遇" },
    ],
  },
  workshops: {
    eyebrow: "課室以外",
    titleHighlight: "我們",
    titleTail: "的工作坊。",
    subtitle: "已排期工作坊與正在收集興趣的主題 — 按「我有興趣」,人數足夠即會開班。",
    seeAll: "所有工作坊 →",
    planned: "已排期",
    interested: "人有興趣",
    book: "立即報名",
    imInterested: "我有興趣",
  },
  library: {
    eyebrow: "每一天的意大利",
    title: "社群、書籍,與一瓶瓶葡萄酒。",
  },
  instagram: {
    eyebrow: "@ladantehk",
    titleHighlight: "本週",
    titleTail: "香港的意大利日常。",
    follow: "追蹤 Instagram",
  },
  sponsors: {
    eyebrow: "贊助夥伴",
    title: "感謝我們的贊助夥伴。",
    classroom: "教室贊助 · A–G",
    gold: "金級贊助",
    silver: "銀級贊助",
  },
  featured: {
    eyebrow: "但丁的新動態",
    title: "近期活動",
    seeAll: "查看全部 →",
  },
  newsletter: {
    eyebrow: "保持聯繫",
    titleHighlight: "訂閱",
    titleTail: "最新資訊。",
    subtitle: "新一季課程、工作坊、文化活動,偶爾再來一則意大利笑話。",
    firstName: "姓名",
    email: "你的電郵地址",
    subscribe: "訂閱",
    thanks: (email: string) => `多謝!我們會透過 ${email} 聯絡你。`,
    small: "我們不會分享你的電郵。可隨時取消訂閱。",
  },
  footer: {
    blurb: "香港但丁.阿利吉耶里協會。意大利文、拉丁文語言、文化與社群 — 始於 1935 年。",
    learn: "學習",
    italianGroups: "意大利文小組班",
    latin: "拉丁文",
    kidsTeens: "兒童與青少年",
    private: "私人課",
    placementTest: "分班測試",
    society: "協會",
    membership: "會員",
    culture: "文化",
    plida: "PLIDA",
    aboutUs: "關於我們",
    studentPortal: "學員專頁",
    gift: "送一年禮物",
    visit: "聯絡我們",
    address: "香港灣仔港灣道 2 號香港藝術中心 TC2 TCF",
    hours: "週一至週五 10:00–19:00 · 週六 10:00–14:00",
    allRights: "版權所有",
    privacy: "私隱政策",
    terms: "條款",
    typhoon: "颱風安排",
  },
  banner: "此頁為繁體中文預覽版本 · 如有錯漏,請電郵 info@ladante.cc 告知我們。",
  switcher: { label: "EN", title: "English" },
};

export const dict = { en, zh };

export function getLocaleFromPath(pathname: string | null | undefined): Locale {
  return (pathname ?? "").startsWith("/zh") ? "zh" : "en";
}

export function useT(): { t: typeof en; locale: Locale } {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  return { t: dict[locale], locale };
}

export function localizePath(path: string, locale: Locale): string {
  if (locale === "en") return path;
  if (path === "/") return "/zh";
  return `/zh${path}`;
}
