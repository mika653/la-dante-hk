export type CEFRLevel =
  | "A1.1" | "A1.2" | "A1.3"
  | "A2.1" | "A2.2" | "A2.3" | "A2.4"
  | "B1.1" | "B1.2" | "B1.3" | "B1.4" | "B1.5"
  | "B2.1" | "B2.2" | "B2.3" | "B2.4" | "B2.5"
  | "C1.1" | "C1.2" | "C1.3" | "C1.4" | "C1.5"
  | "C2.1" | "C2.2" | "C2.3" | "C2.4" | "C2.5";
export type CourseType = "adult-group" | "kids" | "private" | "corporate" | "online" | "latin-group" | "special";
export type Language = "italian" | "latin";

export type Course = {
  id: string;
  language: Language;
  type: CourseType;
  level: CEFRLevel | "Beginner" | "Intermediate" | "Advanced";
  title: string;
  dayLabel: string; // "Wed 6:30pm – 9:30pm"
  startISO: string;
  endISO: string;
  hours: number;
  location: "Wanchai" | "Online" | "Corporate";
  teacher: string;
  priceHKD: number;
  seats: number;
  enrolled: number;
  status: "Published" | "Draft";
  // --- course-schedule / continuation fields (all optional; legacy courses derive from dayLabel/dates) ---
  courseCode?: string;        // e.g. "ITA-A1.1-WED"
  weekday?: number;           // 0=Sun … 6=Sat (the weekly class day)
  startTime?: string;         // "18:30"
  endTime?: string;           // "21:30"
  lessons?: number;           // number of weekly lessons (the course "duration" in weeks)
  earlyBirdDueISO?: string;   // early-bird deadline
  earlyBirdFeeHKD?: number;   // discounted early-bird fee
  archived?: boolean;         // hidden from the public site (auto once it has started)
  continuationOf?: string;    // id of the course this one continues from
};

export const courses: Course[] = [
  { id: "c1",  language: "italian", type: "adult-group", level: "A1.1", title: "A1.1 Beginner — Wednesday Evening", dayLabel: "Wed 18:30–21:30", startISO: "2026-09-09", endISO: "2026-11-18", hours: 30, location: "Wanchai", teacher: "Giulia Marchetti", priceHKD: 4800, seats: 8, enrolled: 6, status: "Published" },
  { id: "c2",  language: "italian", type: "adult-group", level: "A1.1", title: "A1.1 Beginner — Friday Morning",   dayLabel: "Fri 09:30–12:30", startISO: "2026-09-11", endISO: "2026-11-20", hours: 30, location: "Wanchai", teacher: "Marco Rossi",      priceHKD: 4800, seats: 8, enrolled: 8, status: "Published" },
  { id: "c3",  language: "italian", type: "adult-group", level: "A1.2", title: "A1.2 Beginner+ — Tuesday Evening",  dayLabel: "Tue 19:00–22:00", startISO: "2026-09-08", endISO: "2026-11-17", hours: 30, location: "Online",  teacher: "Sofia Bianchi",    priceHKD: 4200, seats: 10, enrolled: 5, status: "Published" },
  { id: "c4",  language: "italian", type: "adult-group", level: "A2.1", title: "A2.1 Elementary — Thursday Evening",dayLabel: "Thu 18:30–21:30", startISO: "2026-09-10", endISO: "2026-11-19", hours: 30, location: "Wanchai", teacher: "Giulia Marchetti", priceHKD: 4800, seats: 8, enrolled: 4, status: "Published" },
  { id: "c5",  language: "italian", type: "adult-group", level: "B1.1", title: "B1.1 Intermediate — Mon Evening",   dayLabel: "Mon 18:30–21:30", startISO: "2026-09-07", endISO: "2026-11-16", hours: 30, location: "Wanchai", teacher: "Elena Conti",      priceHKD: 4800, seats: 8, enrolled: 7, status: "Published" },
  { id: "c6",  language: "italian", type: "adult-group", level: "B1.2", title: "B1.2 Intermediate — Wed Evening",   dayLabel: "Wed 18:30–21:30", startISO: "2026-09-09", endISO: "2026-11-18", hours: 30, location: "Wanchai", teacher: "Marco Rossi",      priceHKD: 4800, seats: 8, enrolled: 5, status: "Published" },
  { id: "c7",  language: "italian", type: "adult-group", level: "B2.1", title: "B2.1 Upper-Intermediate — Sat AM",  dayLabel: "Sat 10:00–13:00", startISO: "2026-09-12", endISO: "2026-11-21", hours: 30, location: "Wanchai", teacher: "Elena Conti",      priceHKD: 4800, seats: 6, enrolled: 3, status: "Published" },
  { id: "c8",  language: "italian", type: "adult-group", level: "C1.1", title: "C1.1 Advanced Conversation",         dayLabel: "Tue 19:00–21:00", startISO: "2026-09-08", endISO: "2026-11-17", hours: 20, location: "Wanchai", teacher: "Sofia Bianchi",    priceHKD: 3600, seats: 6, enrolled: 2, status: "Published" },
  { id: "c9",  language: "italian", type: "kids",        level: "Beginner",    title: "Piccoli Dante — Kids 7–10 yrs", dayLabel: "Sat 11:00–12:30", startISO: "2026-09-12", endISO: "2026-11-21", hours: 15, location: "Wanchai", teacher: "Anna De Luca",     priceHKD: 2800, seats: 10, enrolled: 7, status: "Published" },
  { id: "c10", language: "italian", type: "kids",        level: "Intermediate",title: "Ragazzi Dante — Teens 11–15",    dayLabel: "Sat 14:00–15:30", startISO: "2026-09-12", endISO: "2026-11-21", hours: 15, location: "Wanchai", teacher: "Anna De Luca",     priceHKD: 2800, seats: 10, enrolled: 4, status: "Published" },
  { id: "c11", language: "italian", type: "private",     level: "A1.1", title: "Private Italian — Flexible",         dayLabel: "By appointment",  startISO: "2026-09-07", endISO: "2026-12-04", hours: 10, location: "Wanchai", teacher: "Any teacher",      priceHKD: 7500, seats: 1, enrolled: 0, status: "Published" },
  { id: "c12", language: "italian", type: "corporate",   level: "Beginner",    title: "Corporate Italian — Team Package", dayLabel: "Custom schedule", startISO: "2026-09-07", endISO: "2026-12-04", hours: 20, location: "Corporate", teacher: "Certified team",  priceHKD: 28000, seats: 10, enrolled: 0, status: "Published" },
  { id: "c13", language: "latin",   type: "latin-group", level: "Beginner",    title: "Latin Beginner — Tuesday",        dayLabel: "Tue 18:30–20:30", startISO: "2026-09-08", endISO: "2026-11-17", hours: 20, location: "Wanchai", teacher: "Dr. Paolo Venturi", priceHKD: 3800, seats: 8, enrolled: 5, status: "Published" },
  { id: "c14", language: "latin",   type: "latin-group", level: "Intermediate",title: "Latin Intermediate — Reading Cicero", dayLabel: "Thu 18:30–20:30", startISO: "2026-09-10", endISO: "2026-11-19", hours: 20, location: "Wanchai", teacher: "Dr. Paolo Venturi", priceHKD: 3800, seats: 8, enrolled: 3, status: "Published" },
  { id: "c15", language: "italian", type: "special",     level: "B1.1", title: "Conversation Boost — 6 weeks",       dayLabel: "Wed 19:00–20:30", startISO: "2026-09-09", endISO: "2026-10-14", hours: 9,  location: "Wanchai", teacher: "Elena Conti",      priceHKD: 1800, seats: 10, enrolled: 4, status: "Published" },
  { id: "c16", language: "italian", type: "special",     level: "A2.1", title: "Grammar Revision Clinic",            dayLabel: "Sat 09:30–11:00", startISO: "2026-09-12", endISO: "2026-10-17", hours: 9,  location: "Wanchai", teacher: "Marco Rossi",      priceHKD: 1800, seats: 10, enrolled: 6, status: "Published" },
  { id: "c17", language: "italian", type: "special",     level: "B2.1", title: "PLIDA Exam Preparation",             dayLabel: "Tue 18:30–20:00", startISO: "2026-09-08", endISO: "2026-10-27", hours: 12, location: "Online",  teacher: "Sofia Bianchi",    priceHKD: 2400, seats: 8,  enrolled: 3, status: "Published" },
  { id: "c18", language: "italian", type: "special",     level: "C1.1", title: "Creative Writing Workshop",          dayLabel: "Thu 19:00–20:30", startISO: "2026-09-10", endISO: "2026-10-15", hours: 9,  location: "Wanchai", teacher: "Giulia Marchetti", priceHKD: 1800, seats: 8,  enrolled: 2, status: "Published" },
];

export const levelOutcomes: Record<string, {
  label: string;
  tier: string;
  stage: string;
  labelZh: string;
  outcomes: string[];
  outcomesZh: string[];
  grammar: string;
  grammarZh: string;
}> = {
  A1: {
    label: "Beginner",
    tier: "Beginner",
    stage: "Discovery",
    labelZh: "初學階段 A1（入門級）",
    outcomes: [
      "Introduce yourself and order food & drinks",
      "Understand menus, signs, and simple emails",
      "Chat about family, hobbies, and daily routine",
      "Navigate a café in Rome without switching to English",
    ],
    outcomesZh: [
      "自我介紹，並點餐飲食",
      "看懂餐牌、告示和簡單電郵",
      "談論家庭、興趣和日常生活",
      "在羅馬的咖啡店應付自如，無需轉用英文",
    ],
    grammar: "Alphabet, numbers, present tense of regular and common irregular verbs, articles, basic prepositions.",
    grammarZh: "字母、數字、規則及常見不規則動詞的現在時、冠詞、基本前置詞。",
  },
  A2: {
    label: "Elementary",
    tier: "Beginner",
    stage: "Confidence",
    labelZh: "初學階段 A2（初級）",
    outcomes: [
      "Describe past experiences and travel plans",
      "Book a hotel, rent a car, shop at a market",
      "Understand short newspaper articles with help",
      "Handle most typical travel situations",
    ],
    outcomesZh: [
      "描述過去的經歷和旅遊計劃",
      "預訂酒店、租車、在市場購物",
      "在協助下看懂簡短報章文章",
      "應付大部分常見的旅遊情況",
    ],
    grammar: "Passato prossimo and imperfetto, comparatives and superlatives, direct and indirect object pronouns.",
    grammarZh: "近過去時和未完成過去時、比較級和最高級、直接和間接代詞。",
  },
  B1: {
    label: "Intermediate",
    tier: "Intermediate",
    stage: "Independence",
    labelZh: "獨立階段 B1（中級）",
    outcomes: [
      "Hold a 30-minute conversation on familiar topics",
      "Write short stories, reports, and structured emails",
      "Understand most films and TV with subtitles",
      "Pass the PLIDA B1 exam for Italian citizenship",
    ],
    outcomesZh: [
      "就熟悉的話題進行30分鐘對話",
      "撰寫短篇故事、報告和結構化電郵",
      "憑字幕看懂大部分電影和電視節目",
      "通過意大利公民入籍所需的PLIDA B1考試",
    ],
    grammar: "Congiuntivo presente, condizionale, relative clauses, futuro semplice.",
    grammarZh: "現在虛擬式、條件式、關係從句、簡單未來時。",
  },
  B2: {
    label: "Upper-Intermediate",
    tier: "Intermediate",
    stage: "Progress",
    labelZh: "獨立階段 B2（中高級）",
    outcomes: [
      "Discuss abstract topics: politics, art, philosophy",
      "Read novels and newspapers with ease",
      "Write essays and professional documents",
      "Study or work in Italy without language barriers",
    ],
    outcomesZh: [
      "討論政治、藝術、哲學等抽象議題",
      "輕鬆閱讀小說和報章",
      "撰寫文章和專業文件",
      "在意大利學習或工作，沒有語言障礙",
    ],
    grammar: "Congiuntivo passato and imperfetto, passive voice, complex hypothetical sentences.",
    grammarZh: "過去及未完成虛擬式、被動語態、複雜假設句。",
  },
  C1: {
    label: "Proficient",
    tier: "Advanced",
    stage: "Efficacy",
    labelZh: "精通階段 C1（高級）",
    outcomes: [
      "Express yourself fluently and spontaneously",
      "Read and analyse literary texts and Dante himself",
      "Use Italian professionally and academically",
      "Pass PLIDA C1 for university admission in Italy",
    ],
    outcomesZh: [
      "流暢自然地表達自己",
      "閱讀和分析文學作品，包括但丁本人的著作",
      "在專業和學術場合使用意大利文",
      "通過意大利大學入學所需的PLIDA C1考試",
    ],
    grammar: "Full mastery of all tenses and moods, idiomatic expressions, register and style variation.",
    grammarZh: "全面掌握所有時態和語式、慣用語表達、語域和文體變化。",
  },
  C2: {
    label: "Mastery",
    tier: "Advanced",
    stage: "Mastery",
    labelZh: "精通階段 C2（精通級）",
    outcomes: [
      "Understand virtually everything heard or read in Italian",
      "Express yourself precisely in the most complex situations",
      "Distinguish fine shades of meaning and cultural nuance",
      "Operate at a near-native level, professionally and socially",
    ],
    outcomesZh: [
      "幾乎能理解所有聽到或讀到的意大利文內容",
      "在最複雜的情況下精準表達自己",
      "分辨細微的含義差異和文化細節",
      "以接近母語的水平，應對專業和社交場合",
    ],
    grammar: "Refinement of style, register, and idiom — the grammar of a native speaker's instinct.",
    grammarZh: "風格、語域和慣用語的精煉——如母語者般的語感。",
  },
};

export type Workshop = {
  id: string;
  title: string;
  description: string;
  status: "planned" | "interest";
  dateLabel?: string;
  interested?: number;
  image: string;
};

export const workshops: Workshop[] = [
  { id: "w1", title: "Italian Wine & Language",         description: "Five regions, five grapes, five conversations — all in Italian with a sommelier.", status: "planned",  dateLabel: "15 May · 7pm", image: "wine" },
  { id: "w2", title: "Sketchnoting in Italian",          description: "Draw your way into Italian vocabulary with a visual-thinking coach.",                 status: "interest", interested: 12, image: "writing" },
  { id: "w3", title: "Dante's Inferno — Reading Club",   description: "Four sessions, four circles of hell. Original text with guided English support.",     status: "planned",  dateLabel: "Starts 22 Jun",  image: "book" },
  { id: "w4", title: "Homemade Pizza Napoletana",        description: "Learn the dough, the lexicon, and the attitude. Tasting included.",                   status: "interest", interested: 18, image: "food" },
];

export type Testimonial = {
  quote: string;
  name: string;
  level: string;
  year: number;
};

export const testimonials: Testimonial[] = [
  { quote: "I joined 'just for fun' and now I dream in Italian. The teachers are incredible and the community feels like a real Italian piazza.", name: "Clara Chan", level: "B1 student", year: 2024 },
  { quote: "After one term at Dante, I ordered coffee in Rome without switching to English. That's all I wanted.", name: "Wei Lam", level: "A1 graduate", year: 2024 },
  { quote: "The placement test was scarily accurate. They put me exactly where I needed to be — saved me six months of wrong-level frustration.", name: "Priya Menon", level: "B2 student", year: 2025 },
  { quote: "As an Italian businessman, I was surprised by the quality. This is a serious institution with a warm heart.", name: "Alessandro G.", level: "Corporate client", year: 2024 },
];

export type Sponsor = { name: string; logo: string };
export type ClassroomSponsor = Sponsor & { room: string };

// One sponsor per classroom, A–G. Order comes from the client's "Sponsor logos/
// Classroom" folder, where each file is named for the room it belongs to.
export const classroomSponsors: ClassroomSponsor[] = [
  { room: "A", name: "Eligio Oggionni", logo: "/sponsors/eligio-oggionni.png" },
  { room: "B", name: "Generali (Life) Hong Kong Limited", logo: "/sponsors/generali-life-hk.png" },
  { room: "C", name: "OM LOG (ASIA) LTD", logo: "/sponsors/om-log-asia.png" },
  { room: "D", name: "International Atelier Ltd", logo: "/sponsors/international-atelier.png" },
  { room: "E", name: "Sugi International Limited", logo: "/sponsors/sugi-international.png" },
  { room: "F", name: "Nirotech Limited", logo: "/sponsors/nirotech.png" },
  { room: "G", name: "Prof. Alice T. H. W. Chiu", logo: "/sponsors/prof-alice-chiu.png" },
];

// Logos live in /public/sponsors, trimmed of transparent padding so they
// render at a consistent optical size. `name` doubles as the image alt text.
export const sponsors: { gold: Sponsor[]; silver: Sponsor[] } = {
  gold: [{ name: "OM LOG (ASIA) LTD", logo: "/sponsors/om-log-asia.png" }],
  silver: [
    { name: "Cheese Meets Wine Limited", logo: "/sponsors/cheese-meets-wine.png" },
    { name: "DB Group China Ltd", logo: "/sponsors/db-group-china.png" },
    { name: "Eligio Oggionni", logo: "/sponsors/eligio-oggionni.png" },
    { name: "Generali (Life) Hong Kong Limited", logo: "/sponsors/generali-life-hk.png" },
    { name: "International Atelier Ltd", logo: "/sponsors/international-atelier.png" },
    { name: "Intesa Sanpaolo SpA Hong Kong Branch", logo: "/sponsors/intesa-sanpaolo-hk.png" },
    { name: "Nirotech Limited", logo: "/sponsors/nirotech.png" },
    { name: "Sugi International Limited", logo: "/sponsors/sugi-international.png" },
    { name: "Venchi HK Limited", logo: "/sponsors/venchi-hk.png" },
  ],
};

export type MembershipPlan = {
  id: "ordinary" | "student" | "corporate" | "gift";
  name: string;
  priceHKD: number | null;
  blurb: string;
  perks: string[];
  highlight?: boolean;
};

export const membershipPlans: MembershipPlan[] = [
  { id: "ordinary",  name: "Ordinary",  priceHKD: 600, blurb: "Full access to Dante life in Hong Kong.",   perks: ["Course discounts (10%)", "Library & bookclub", "Cultural events", "50+ member perks across HK", "PLIDA exam discount"], highlight: true },
  { id: "student",   name: "Student",   priceHKD: 300, blurb: "Under 25 or full-time university ID.",       perks: ["Course discounts (15%)", "Library & bookclub", "Student-only events", "50+ member perks across HK"] },
  { id: "corporate", name: "Corporate", priceHKD: null, blurb: "Team benefits, tailored to your company.", perks: ["Up to 10 seats", "On-site Italian lessons", "Event hosting at our Wanchai centre", "Cultural brand partnership"] },
  { id: "gift",      name: "Gift",      priceHKD: 600, blurb: "Send a year of Italy to someone you love.",  perks: ["Beautifully presented certificate", "Recipient chooses their plan", "Personal message", "Instant digital delivery"] },
];

export const memberPerks = [
  { category: "Food & drinks",   items: [{ name: "Grissini Trattoria", perk: "10% off à la carte" }, { name: "illy Wanchai", perk: "1 free cappuccino per visit" }, { name: "Grappa's Cellar", perk: "20% off wines by the glass" }] },
  { category: "Shopping",         items: [{ name: "Giorgio Armani", perk: "15% off selected collections" }, { name: "Zegna", perk: "10% off alterations" }, { name: "Harmony Wine", perk: "10% off purchases over $1,000" }] },
  { category: "Culture & travel", items: [{ name: "Italian Chamber of Commerce", perk: "Access to business events" }, { name: "Alitalia HK desk", perk: "Waived booking fees on Italy routes" }] },
  { category: "Services",         items: [{ name: "Generali Insurance", perk: "Dedicated member consultation" }, { name: "Intesa Sanpaolo", perk: "Italian-language banking support" }] },
];

export const featuredCards = [
  { eyebrow: "NEW TERM",   title: "September–December 2026 courses",     body: "Early-bird 10% off until 14 August. Uni students −20% year-round.", href: "/courses/italian/adult-groups", cta: "See courses" },
  { eyebrow: "PLIDA EXAM", title: "Next session: 15 November",  body: "The official Italian language certificate. A1–C2. Register by 10 October.", href: "/plida", cta: "Register" },
  { eyebrow: "5-MIN TEST", title: "Find your level",           body: "15 adaptive questions, CEFR-aligned. See your level instantly.",       href: "/placement-test",                cta: "Start test" },
  { eyebrow: "CULTURE",    title: "Dante's Inferno Bookclub",  body: "4 Saturdays, 4 circles. Guided reading in Italian with English support.", href: "/culture",                    cta: "Learn more" },
  { eyebrow: "MEMBERSHIP", title: "50+ member perks in HK",    body: "Restaurants, shops, culture, services — unlocked for a year of Italy.",  href: "/membership",                 cta: "Become a member" },
];
