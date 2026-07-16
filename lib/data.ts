export type CEFRLevel = "A1.1" | "A1.2" | "A1.3" | "A2.1" | "A2.2" | "A2.3" | "B1.1" | "B1.2" | "B1.3" | "B2" | "C1" | "C2";
export type CourseType = "adult-group" | "kids" | "private" | "corporate" | "online" | "latin-group";
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
  { id: "c1",  language: "italian", type: "adult-group", level: "A1.1", title: "A1.1 Beginner — Wednesday Evening", dayLabel: "Wed 18:30–21:30", startISO: "2026-05-06", endISO: "2026-07-15", hours: 30, location: "Wanchai", teacher: "Giulia Marchetti", priceHKD: 4800, seats: 8, enrolled: 6, status: "Published" },
  { id: "c2",  language: "italian", type: "adult-group", level: "A1.1", title: "A1.1 Beginner — Friday Morning",   dayLabel: "Fri 09:30–12:30", startISO: "2026-05-08", endISO: "2026-07-17", hours: 30, location: "Wanchai", teacher: "Marco Rossi",      priceHKD: 4800, seats: 8, enrolled: 8, status: "Published" },
  { id: "c3",  language: "italian", type: "adult-group", level: "A1.2", title: "A1.2 Beginner+ — Tuesday Evening",  dayLabel: "Tue 19:00–22:00", startISO: "2026-05-05", endISO: "2026-07-14", hours: 30, location: "Online",  teacher: "Sofia Bianchi",    priceHKD: 4200, seats: 10, enrolled: 5, status: "Published" },
  { id: "c4",  language: "italian", type: "adult-group", level: "A2.1", title: "A2.1 Elementary — Thursday Evening",dayLabel: "Thu 18:30–21:30", startISO: "2026-05-07", endISO: "2026-07-16", hours: 30, location: "Wanchai", teacher: "Giulia Marchetti", priceHKD: 4800, seats: 8, enrolled: 4, status: "Published" },
  { id: "c5",  language: "italian", type: "adult-group", level: "B1.1", title: "B1.1 Intermediate — Mon Evening",   dayLabel: "Mon 18:30–21:30", startISO: "2026-05-04", endISO: "2026-07-13", hours: 30, location: "Wanchai", teacher: "Elena Conti",      priceHKD: 4800, seats: 8, enrolled: 7, status: "Published" },
  { id: "c6",  language: "italian", type: "adult-group", level: "B1.2", title: "B1.2 Intermediate — Wed Evening",   dayLabel: "Wed 18:30–21:30", startISO: "2026-05-06", endISO: "2026-07-15", hours: 30, location: "Wanchai", teacher: "Marco Rossi",      priceHKD: 4800, seats: 8, enrolled: 5, status: "Published" },
  { id: "c7",  language: "italian", type: "adult-group", level: "B2",   title: "B2 Upper-Intermediate — Sat AM",    dayLabel: "Sat 10:00–13:00", startISO: "2026-05-09", endISO: "2026-07-18", hours: 30, location: "Wanchai", teacher: "Elena Conti",      priceHKD: 4800, seats: 6, enrolled: 3, status: "Published" },
  { id: "c8",  language: "italian", type: "adult-group", level: "C1",   title: "C1 Advanced Conversation",           dayLabel: "Tue 19:00–21:00", startISO: "2026-05-05", endISO: "2026-07-14", hours: 20, location: "Wanchai", teacher: "Sofia Bianchi",    priceHKD: 3600, seats: 6, enrolled: 2, status: "Published" },
  { id: "c9",  language: "italian", type: "kids",        level: "Beginner",    title: "Piccoli Dante — Kids 7–10 yrs", dayLabel: "Sat 11:00–12:30", startISO: "2026-05-09", endISO: "2026-07-18", hours: 15, location: "Wanchai", teacher: "Anna De Luca",     priceHKD: 2800, seats: 10, enrolled: 7, status: "Published" },
  { id: "c10", language: "italian", type: "kids",        level: "Intermediate",title: "Ragazzi Dante — Teens 11–15",    dayLabel: "Sat 14:00–15:30", startISO: "2026-05-09", endISO: "2026-07-18", hours: 15, location: "Wanchai", teacher: "Anna De Luca",     priceHKD: 2800, seats: 10, enrolled: 4, status: "Published" },
  { id: "c11", language: "italian", type: "private",     level: "A1.1", title: "Private Italian — Flexible",         dayLabel: "By appointment",  startISO: "2026-05-04", endISO: "2026-07-31", hours: 10, location: "Wanchai", teacher: "Any teacher",      priceHKD: 7500, seats: 1, enrolled: 0, status: "Published" },
  { id: "c12", language: "italian", type: "corporate",   level: "Beginner",    title: "Corporate Italian — Team Package", dayLabel: "Custom schedule", startISO: "2026-05-04", endISO: "2026-07-31", hours: 20, location: "Corporate", teacher: "Certified team",  priceHKD: 28000, seats: 10, enrolled: 0, status: "Published" },
  { id: "c13", language: "latin",   type: "latin-group", level: "Beginner",    title: "Latin Beginner — Tuesday",        dayLabel: "Tue 18:30–20:30", startISO: "2026-05-05", endISO: "2026-07-14", hours: 20, location: "Wanchai", teacher: "Dr. Paolo Venturi", priceHKD: 3800, seats: 8, enrolled: 5, status: "Published" },
  { id: "c14", language: "latin",   type: "latin-group", level: "Intermediate",title: "Latin Intermediate — Reading Cicero", dayLabel: "Thu 18:30–20:30", startISO: "2026-05-07", endISO: "2026-07-16", hours: 20, location: "Wanchai", teacher: "Dr. Paolo Venturi", priceHKD: 3800, seats: 8, enrolled: 3, status: "Published" },
];

export const levelOutcomes: Record<string, { label: string; outcomes: string[] }> = {
  A1: {
    label: "Beginner",
    outcomes: [
      "Introduce yourself and order food & drinks",
      "Understand menus, signs, and simple emails",
      "Chat about family, hobbies, and daily routine",
      "Navigate a café in Rome without switching to English",
    ],
  },
  A2: {
    label: "Elementary",
    outcomes: [
      "Describe past experiences and travel plans",
      "Book a hotel, rent a car, shop at a market",
      "Understand short newspaper articles with help",
      "Handle most typical travel situations",
    ],
  },
  B1: {
    label: "Intermediate",
    outcomes: [
      "Hold a 30-minute conversation on familiar topics",
      "Write short stories, reports, and structured emails",
      "Understand most films and TV with subtitles",
      "Pass the PLIDA B1 exam for Italian citizenship",
    ],
  },
  B2: {
    label: "Upper-Intermediate",
    outcomes: [
      "Discuss abstract topics: politics, art, philosophy",
      "Read novels and newspapers with ease",
      "Write essays and professional documents",
      "Study or work in Italy without language barriers",
    ],
  },
  C1: {
    label: "Proficient",
    outcomes: [
      "Express yourself fluently and spontaneously",
      "Read and analyse literary texts and Dante himself",
      "Use Italian professionally and academically",
      "Pass PLIDA C1 for university admission in Italy",
    ],
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
  { id: "w1", title: "Italian Wine & Language",         description: "Five regions, five grapes, five conversations — all in Italian with a sommelier.", status: "planned",  dateLabel: "15 May · 7pm", image: "🍷" },
  { id: "w2", title: "Sketchnoting in Italian",          description: "Draw your way into Italian vocabulary with a visual-thinking coach.",                 status: "interest", interested: 12, image: "✏️" },
  { id: "w3", title: "Dante's Inferno — Reading Club",   description: "Four sessions, four circles of hell. Original text with guided English support.",     status: "planned",  dateLabel: "Starts 22 Jun",  image: "📖" },
  { id: "w4", title: "Homemade Pizza Napoletana",        description: "Learn the dough, the lexicon, and the attitude. Tasting included.",                   status: "interest", interested: 18, image: "🍕" },
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
  { eyebrow: "NEW TERM",   title: "May–July 2026 courses",     body: "Early-bird 10% off until 10 April. Uni students −20% year-round.", href: "/courses/italian/adult-groups", cta: "See courses" },
  { eyebrow: "PLIDA EXAM", title: "Next session: 14 June",     body: "The official Italian language certificate. A1–C2. Register by 10 May.", href: "/plida", cta: "Register" },
  { eyebrow: "5-MIN TEST", title: "Find your level",           body: "30 adaptive questions, CEFR-aligned. Your result emailed to you.",      href: "/placement-test",                cta: "Start test" },
  { eyebrow: "CULTURE",    title: "Dante's Inferno Bookclub",  body: "4 Saturdays, 4 circles. Guided reading in Italian with English support.", href: "/culture",                    cta: "Learn more" },
  { eyebrow: "MEMBERSHIP", title: "50+ member perks in HK",    body: "Restaurants, shops, culture, services — unlocked for a year of Italy.",  href: "/membership",                 cta: "Become a member" },
];
