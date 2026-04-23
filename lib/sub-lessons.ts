"use client";
import { useEffect, useState } from "react";

// -------------- Types --------------
export type LessonLevel = "A1.1" | "A1.2" | "A1.3" | "A2" | "B1" | "B1.2" | "B2" | "C1" | "Beginner" | "Intermediate";
export type LessonLanguage = "italian" | "latin";
export type ActivityType = "warmup" | "vocabulary" | "grammar" | "speaking" | "listening" | "reading" | "writing" | "game" | "culture" | "review" | "break";

export const activityColors: Record<ActivityType, string> = {
  warmup:     "bg-sole/30 text-ink",
  vocabulary: "bg-azzurro-soft text-azzurro-deep",
  grammar:    "bg-azzurro-soft text-azzurro-deep",
  speaking:   "bg-sole-soft text-ink",
  listening:  "bg-cream-2 text-ink",
  reading:    "bg-cream-2 text-ink",
  writing:    "bg-cream-2 text-ink",
  game:       "bg-sole/30 text-ink",
  culture:    "bg-sole-soft text-ink",
  review:     "bg-azzurro-soft text-azzurro-deep",
  break:      "bg-paper text-ink-muted",
};

export type Activity = {
  title: string;
  type: ActivityType;
  minutes: number;
  instructions: string;   // step-by-step, verbatim for the sub
  boardWrite?: string;    // what to write on the board
  materials?: string;
  example?: string;       // Italian example(s) to use
  answerKey?: string;     // for quiz-type activities
};

export type SubLesson = {
  id: string;
  title: string;
  subtitle: string;       // one-line pitch
  level: LessonLevel;
  language: LessonLanguage;
  totalMinutes: number;
  topic: string;
  objectives: string[];
  materials: string[];    // what the sub needs to bring / print
  activities: Activity[];
  authorNote?: string;    // from the regular teacher
  authoredBy: string;
  tags: string[];
};

// -------------- Seed lessons --------------
export const seedLessons: SubLesson[] = [
  // ---- A1.1 — 2 hour ----
  {
    id: "sl-a11-intro",
    title: "Ciao, sono… — Introductions & greetings",
    subtitle: "Week-1 Italian: meet-and-greet essentials for absolute beginners.",
    level: "A1.1",
    language: "italian",
    totalMinutes: 120,
    topic: "Introducing yourself, greetings, verb 'essere'",
    objectives: [
      "Greet and introduce themselves in Italian",
      "Ask and answer 'Come ti chiami?' and 'Di dove sei?'",
      "Use the present tense of the verb 'essere' in all six forms",
      "Recognise common Italian names and countries",
    ],
    materials: [
      "Whiteboard + markers (2 colours)",
      "Printed handout A (verb essere table) — 1 per student",
      "Ball or soft toy for the warm-up",
      "Timer or phone",
    ],
    activities: [
      { title: "Welcome & seating", type: "warmup", minutes: 5,
        instructions: "Greet students at the door in Italian. Once everyone is seated, introduce yourself: 'Buongiorno! Io sono [your name]. Oggi sostituisco la vostra insegnante.'" },
      { title: "Ball toss introductions", type: "warmup", minutes: 15,
        instructions: "Everyone stands in a circle. Toss the ball to a student and say 'Ciao, sono Giulia'. They catch it, repeat with their own name, then toss to someone else. Second round: add 'e tu?' — the receiver answers 'Sono [name]'. Keep going until the circle is quick and confident.",
        materials: "Soft ball / toy", example: "Ciao, sono Marco. E tu?" },
      { title: "Greetings vocabulary", type: "vocabulary", minutes: 15,
        instructions: "Write the five greetings on the board. Read aloud; students repeat chorally twice, then in pairs. Finally call individuals.",
        boardWrite: "Buongiorno = Good morning · Buon pomeriggio = Good afternoon · Buonasera = Good evening · Buonanotte = Good night · Ciao = Hi / Bye (informal)" },
      { title: "Verb 'essere' mini-lesson", type: "grammar", minutes: 25,
        instructions: "Hand out the 'essere' table. Read it aloud: io sono, tu sei, lui/lei è, noi siamo, voi siete, loro sono. Drill chorally. Then pairs practise by saying sentences about themselves.",
        boardWrite: "essere (to be) — io sono · tu sei · lui/lei è · noi siamo · voi siete · loro sono",
        example: "Io sono di Hong Kong. Tu sei studente?" },
      { title: "Pause ☕", type: "break", minutes: 10,
        instructions: "Ten-minute break. Remind them to come back on time." },
      { title: "Partner interviews", type: "speaking", minutes: 25,
        instructions: "Pair students up. They ask each other four questions (write on board). Rotate pairs twice so everyone speaks to three different partners.",
        boardWrite: "Come ti chiami? · Di dove sei? · Di che nazionalità sei? · Come stai?" },
      { title: "Write your first Italian email", type: "writing", minutes: 15,
        instructions: "Students write a 4-line self-introduction email to an imaginary Italian pen-pal. Walk around, help with spelling. Collect at end for the regular teacher to review next lesson.",
        example: "Ciao! Mi chiamo Clara, sono di Hong Kong. Sono studentessa. E tu?" },
      { title: "Wrap-up circle", type: "review", minutes: 10,
        instructions: "Stand in a circle. Each student says one new word or phrase they learned today. Finish with a collective 'Arrivederci!'" },
    ],
    authorNote: "Giulia's note: These students are shy the first three weeks — keep your energy high and celebrate every attempt. If they finish the writing early, try the 'numbers 1–20' song from Coffee Break Italian on YouTube (5 min).",
    authoredBy: "Giulia Marchetti",
    tags: ["essentials", "speaking", "grammar", "essere", "introductions"],
  },
  // ---- A1.2 — 2 hour ----
  {
    id: "sl-a12-ristorante",
    title: "Al ristorante — Ordering food",
    subtitle: "Functional language for cafés and restaurants, plus 'vorrei' and partitives.",
    level: "A1.2",
    language: "italian",
    totalMinutes: 120,
    topic: "Restaurant language, modal 'vorrei', partitives (del, dello, della…)",
    objectives: [
      "Order food and drink politely in Italian",
      "Use 'vorrei' (I would like) for polite requests",
      "Recognise partitive articles with food items",
      "Read a short Italian menu and ask about dishes",
    ],
    materials: [
      "Printed Italian menu (bar + trattoria) — 1 per pair",
      "Whiteboard + markers",
      "Menu role-play cards — 1 set per pair",
    ],
    activities: [
      { title: "Warmup — food vocabulary bingo", type: "warmup", minutes: 15,
        instructions: "Write 20 food items in Italian on the board. Each student draws a 4×4 grid and fills it with 16 of them. Call items in random order (use English, they mark the Italian). First 'BINGO!' wins.",
        example: "caffè, cornetto, pasta, pizza, insalata, acqua, vino rosso, vino bianco, birra, pane, formaggio…" },
      { title: "'Vorrei' introduction", type: "grammar", minutes: 20,
        instructions: "Introduce the verb and its magic: 'voglio' = I want (direct), 'vorrei' = I'd like (polite). Drill: students take turns saying what they'd like right now. Keep it quick and playful.",
        boardWrite: "Voglio un caffè ✗ (too direct)\nVorrei un caffè ✓ (polite)\nVorrei + noun / verb",
        example: "Vorrei un cappuccino. Vorrei della pasta. Vorrei prenotare un tavolo." },
      { title: "Partitives mini-lesson", type: "grammar", minutes: 20,
        instructions: "Teach 'some of something': del pane, della pasta, dello zucchero, dell'acqua, dei panini, delle paste. Use the same rule-pattern as 'il/la/lo/l'/i/le' + di = del/della/…",
        boardWrite: "del (m) · dello (m, s+cons) · della (f) · dell' (before vowel) · dei (m pl) · degli (m pl, s+cons/vowel) · delle (f pl)" },
      { title: "Pause ☕", type: "break", minutes: 10,
        instructions: "Ten-minute break. Ask someone to order you a Vorrei un caffè in Italian as practice." },
      { title: "Menu reading", type: "reading", minutes: 20,
        instructions: "Hand out the menu. In pairs, students highlight 3 things they'd like and 1 they wouldn't know what to order. Share with the class.",
        materials: "Printed menu" },
      { title: "Restaurant role-play", type: "speaking", minutes: 25,
        instructions: "Split into pairs: one is the waiter (cameriere/a), one is the customer. Give them role-cards. Swap after 10 minutes. Model a conversation first on the board.",
        boardWrite: "Buongiorno, prego? · Vorrei un tavolo per due. · Vorrei il menù, per favore. · Che cosa consiglia? · Il conto, per favore." },
      { title: "Wrap-up — would you rather", type: "review", minutes: 10,
        instructions: "Quick game. Two options in Italian: 'Vorrei un espresso o un cappuccino?' Students vote by standing on one side of the room. Five rounds." },
    ],
    authorNote: "The role-play cards are in the shared Google Drive → Teachers → A1.2 → 'Ristorante cards.pdf'. Print double-sided so each pair gets a waiter and a customer card.",
    authoredBy: "Marco Rossi",
    tags: ["vorrei", "restaurant", "vocabulary", "partitives", "role-play"],
  },
  // ---- A2 — 3 hour ----
  {
    id: "sl-a2-passato",
    title: "Il passato prossimo — Review & practice",
    subtitle: "Three-hour deep dive into Italian's most common past tense.",
    level: "A2",
    language: "italian",
    totalMinutes: 180,
    topic: "Passato prossimo with essere/avere, irregular participles, agreement",
    objectives: [
      "Form the passato prossimo correctly with avere and essere",
      "Choose the right auxiliary for common verbs",
      "Recognise and use 10 common irregular past participles",
      "Apply subject-past-participle agreement with 'essere' auxiliary",
    ],
    materials: [
      "Whiteboard + 3 colour markers",
      "Handout B — 30 sentences fill-in-the-blank (in drive)",
      "Short newspaper article from Corriere (print 1 copy per student)",
      "Sticky notes",
    ],
    activities: [
      { title: "Warm-up: 'Ieri…' chain", type: "warmup", minutes: 15,
        instructions: "Stand in a circle. Each student says one thing they did yesterday in Italian. Start easy: 'Ieri ho mangiato la pizza', 'Ieri sono andato al cinema'. Write each sentence on the board as they say it — you'll use this list as data for the rule later." },
      { title: "Rule review: avere vs essere", type: "grammar", minutes: 30,
        instructions: "Split the board into two columns: AVERE (red) and ESSERE (blue). From yesterday's chain, ask students which auxiliary each verb takes. Guide them to the pattern: movement/change = essere; action with object = avere. Add reflexive verbs (si sono lavati).",
        boardWrite: "AVERE → ho mangiato, ho letto, ho lavorato\nESSERE → sono andato/a, sono uscito/a, sono nato/a, mi sono alzato/a",
        example: "Mangiare → ho mangiato | Andare → sono andato/a | Arrivare → sono arrivato/a" },
      { title: "Irregular past participles", type: "vocabulary", minutes: 25,
        instructions: "Write the 10 most common irregulars. Drill aloud three times. Then students quiz each other in pairs using sticky notes (verb on front, participle on back).",
        boardWrite: "fare → fatto · dire → detto · vedere → visto · prendere → preso · leggere → letto · scrivere → scritto · aprire → aperto · chiudere → chiuso · mettere → messo · venire → venuto" },
      { title: "Pause ☕", type: "break", minutes: 15,
        instructions: "Fifteen-minute break." },
      { title: "Fill-in-the-blank sprint", type: "grammar", minutes: 25,
        instructions: "Hand out handout B (30 sentences). Students have 15 minutes alone, then 10 minutes comparing with a partner. Go over tricky ones together.",
        materials: "Handout B",
        answerKey: "Answer key at the bottom of handout B, or check drive → Teachers → A2 → 'passato-answers.pdf'" },
      { title: "Newspaper scavenger hunt", type: "reading", minutes: 25,
        instructions: "Hand out the Corriere article. Students underline every passato prossimo they can find and note the auxiliary. Competition: who finds the most in 10 minutes?",
        materials: "Printed Corriere article" },
      { title: "Personal narrative", type: "writing", minutes: 25,
        instructions: "Each student writes 8–10 sentences about their last weekend in the passato prossimo. Walk around, correct on the spot. Volunteer reads at the end." },
      { title: "Closing circle — one highlight", type: "review", minutes: 20,
        instructions: "Each student shares one sentence about something they did this past week using the passato prossimo. Others ask one follow-up question in Italian. End with a group 'Alla prossima!'" },
    ],
    authorNote: "A2 students love this lesson because they finally 'get' the past tense. If they're struggling with agreement (io sono andato vs io sono andata), spend an extra 10 minutes on it — cut the scavenger hunt if you need the time.",
    authoredBy: "Sofia Bianchi",
    tags: ["passato prossimo", "grammar", "avere", "essere", "irregular verbs", "3-hour"],
  },
  // ---- B1 — 90 min ----
  {
    id: "sl-b1-cinema",
    title: "Italian cinema — Guided discussion",
    subtitle: "Ninety-minute conversation class around a classic film clip.",
    level: "B1",
    language: "italian",
    totalMinutes: 90,
    topic: "Film vocabulary, opinion expressions, 'secondo me' and the subjunctive",
    objectives: [
      "Discuss a short film clip in Italian using present tense",
      "Express opinions with 'secondo me', 'credo che', 'penso che'",
      "Recognise the subjunctive in 'credo che + congiuntivo' constructions",
      "Use 10 new cinema vocabulary items",
    ],
    materials: [
      "Laptop / classroom screen with internet access",
      "YouTube link: 'La vita è bella' — typewriter scene (2:40)",
      "Handout C — vocabulary matching + discussion questions",
    ],
    activities: [
      { title: "Cinema word cloud", type: "warmup", minutes: 10,
        instructions: "Ask: 'Quando pensate al cinema italiano, cosa vi viene in mente?' Build a word cloud on the board in Italian. Add 5 key terms if they don't come up: regista, sceneggiatura, trama, personaggio, colonna sonora.",
        boardWrite: "regista (director) · sceneggiatura (screenplay) · trama (plot) · personaggio (character) · colonna sonora (soundtrack)" },
      { title: "Watch the clip", type: "listening", minutes: 10,
        instructions: "Show the typewriter scene from 'La vita è bella' (~2:40). Watch once without subtitles. Then watch again with Italian subtitles if available." },
      { title: "First impressions — in pairs", type: "speaking", minutes: 15,
        instructions: "In Italian: 'Che cosa avete capito?' and 'Chi sono i personaggi?' Pairs discuss for 5 min, then share with class. Don't correct too much — encourage flow." },
      { title: "Opinion language — mini-lesson", type: "grammar", minutes: 15,
        instructions: "Board: 'Secondo me' + indicativo vs 'Credo che / Penso che' + congiuntivo. Show the difference. Drill by calling on students: 'Secondo te, il padre è coraggioso?' → 'Sì, secondo me è coraggioso' / 'Sì, credo che sia coraggioso'.",
        boardWrite: "Secondo me + indicativo → Secondo me il padre è coraggioso.\nCredo che / Penso che + congiuntivo → Credo che il padre sia coraggioso." },
      { title: "Deep-dive discussion", type: "speaking", minutes: 30,
        instructions: "Small groups of 3–4. Hand out handout C. Students discuss 5 questions for 25 minutes. Walk between groups, help with vocabulary. Final 5 minutes: each group shares their favourite insight with the class.",
        materials: "Handout C" },
      { title: "Homework preview + closing", type: "review", minutes: 10,
        instructions: "Assign: Watch the full film (1h 56m) before next class and write 10 sentences using opinion language. End with 'Buona visione!'" },
    ],
    authorNote: "This class loves to debate — I usually can't shut them up for homework preview, which is a good problem. If the technology fails, pivot to 'your favourite Italian film' discussion instead. The vocabulary list works either way.",
    authoredBy: "Elena Conti",
    tags: ["conversation", "cinema", "opinions", "congiuntivo", "short"],
  },
  // ---- B1.2 — 3 hour ----
  {
    id: "sl-b12-congiuntivo",
    title: "Il congiuntivo presente — Introduction",
    subtitle: "The first proper lesson on Italian's feared (and beloved) subjunctive.",
    level: "B1.2",
    language: "italian",
    totalMinutes: 180,
    topic: "Present subjunctive: forms, triggers, and common phrases",
    objectives: [
      "Form the present subjunctive for regular -are, -ere, -ire verbs",
      "Recognise the main triggers (credo che, penso che, voglio che, è importante che…)",
      "Use 5 irregular subjunctives (sia, abbia, faccia, vada, voglia)",
      "Produce 10 complete sentences in the subjunctive",
    ],
    materials: [
      "Whiteboard + markers",
      "Handout D — trigger phrases list (print 1 per student)",
      "Handout E — conjugation drill sheet",
      "Three short Italian tweets/news headlines that use congiuntivo (find on corriere.it the morning of)",
    ],
    activities: [
      { title: "'Spero che…' warm-up", type: "warmup", minutes: 15,
        instructions: "Ask students what they hope for: 'Spero che…' — they'll naturally use the subjunctive (or fail and produce gold for the lesson). Write their attempts on the board; don't correct yet, just gather data. Circle the verb forms for later." },
      { title: "Forming the subjunctive — regular", type: "grammar", minutes: 30,
        instructions: "Return to the board data. Introduce the rule: drop the -o from 'io' form, add subjunctive endings. Demonstrate with parlare (parli, parli, parli, parliamo, parliate, parlino), prendere (prenda…), partire (parta…). Drill chorally.",
        boardWrite: "PARLARE → che io parli, che tu parli, che lui parli, che noi parliamo, che voi parliate, che loro parlino\n(Note: first three forms are identical!)" },
      { title: "Five essential irregulars", type: "grammar", minutes: 25,
        instructions: "Teach these by heart — they're 80% of real usage: essere → sia, avere → abbia, fare → faccia, andare → vada, volere → voglia. Students chant them as you point.",
        boardWrite: "ESSERE → sia · AVERE → abbia · FARE → faccia · ANDARE → vada · VOLERE → voglia" },
      { title: "Pause ☕", type: "break", minutes: 15,
        instructions: "Fifteen-minute break. Tell them: when they come back we'll do the 'fun' part." },
      { title: "Trigger phrases", type: "vocabulary", minutes: 20,
        instructions: "Hand out Handout D. Read through the triggers aloud. Students highlight the 3 they most want to use. Share in pairs — why those three?",
        boardWrite: "Triggers → credo che · penso che · spero che · è importante che · bisogna che · voglio che · mi sembra che · prima che · benché",
        materials: "Handout D" },
      { title: "Drill sprint", type: "grammar", minutes: 25,
        instructions: "Hand out Handout E (20 fill-in-the-blanks). Fifteen minutes solo, then ten minutes comparing with a partner. Review the 3 trickiest on the board together.",
        materials: "Handout E" },
      { title: "Tweet analysis", type: "reading", minutes: 15,
        instructions: "Show the 3 real tweets you pulled this morning. Students identify the subjunctive verbs and explain what triggered them. This is where the penny drops for most of them." },
      { title: "Production — 'Secondo me, Dante…'", type: "writing", minutes: 25,
        instructions: "Students write 8–10 sentences using 'secondo me', 'credo che', 'spero che' about topics of their choice (Italy, Hong Kong, family, cinema…). Read 2 sentences each to the class." },
      { title: "Closing — one commitment", type: "review", minutes: 10,
        instructions: "Each student shares one sentence with 'Spero che [qualcosa] succeda questa settimana' — something they hope happens this week. End warmly with 'Ci vediamo!'" },
    ],
    authorNote: "This is THE lesson where B1.2 students either fall in love with Italian or panic. Lean into the panic — crack jokes about how Italians themselves mess it up. Show them they're entering the 'cool kids' level.",
    authoredBy: "Giulia Marchetti",
    tags: ["congiuntivo", "subjunctive", "grammar", "triggers", "B1.2"],
  },
];

// -------------- Store (localStorage) --------------
const KEY = "ladante-sub-lessons";

function readAll(): SubLesson[] {
  if (typeof window === "undefined") return seedLessons;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedLessons;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedLessons;
  } catch { return seedLessons; }
}

export function getSubLessons(): SubLesson[] { return readAll(); }
export function getSubLessonById(id: string): SubLesson | undefined { return readAll().find((l) => l.id === id); }

export function useSubLessons(): SubLesson[] {
  const [list, setList] = useState<SubLesson[]>(seedLessons);
  useEffect(() => { setList(readAll()); }, []);
  return list;
}
