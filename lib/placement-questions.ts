export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1";
export type Section = "grammar" | "vocabulary" | "reading" | "listening";

export type Question = {
  id: string;
  level: CEFR;
  section: Section;
  prompt: string;
  sub?: string;
  choices: string[];
  correctIndex: number;
};

// A hand-written pool. Real version would be 120+; for demo we have ~32 across A1–C1.
export const questionBank: Question[] = [
  // --- A1 ---
  { id: "a1-1",  level: "A1", section: "grammar",    prompt: "Complete: Mi chiamo Maria, ___ di Milano.",              choices: ["sono", "ho", "è", "ha"], correctIndex: 0 },
  { id: "a1-2",  level: "A1", section: "vocabulary", prompt: "Qual è l'ora?",                                           sub: "Choose the right way to say '3:00 PM'", choices: ["Sono le tre del pomeriggio", "Sono tre ore", "È tre", "Tre pomeriggio"], correctIndex: 0 },
  { id: "a1-3",  level: "A1", section: "grammar",    prompt: "Choose the correct article: ___ casa è grande.",         choices: ["Il", "La", "Lo", "L'"], correctIndex: 1 },
  { id: "a1-4",  level: "A1", section: "reading",    prompt: "What does 'Buongiorno' mean?",                            choices: ["Goodbye", "Good morning/day", "Good night", "Thank you"], correctIndex: 1 },
  { id: "a1-5",  level: "A1", section: "vocabulary", prompt: "How do you say 'I'd like a coffee' politely?",            choices: ["Voglio un caffè", "Dammi un caffè", "Vorrei un caffè", "Ho un caffè"], correctIndex: 2 },
  { id: "a1-6",  level: "A1", section: "grammar",    prompt: "Plural of 'il libro':",                                   choices: ["i libri", "le libre", "gli libri", "il libri"], correctIndex: 0 },
  { id: "a1-7",  level: "A1", section: "grammar",    prompt: "Choose: ___ anni hai?",                                  choices: ["Come", "Quale", "Quanti", "Perché"], correctIndex: 2 },

  // --- A2 ---
  { id: "a2-1", level: "A2", section: "grammar",    prompt: "Past tense: 'Ieri ___ al mercato.'",                    choices: ["vado", "sono andato", "ho andato", "andavo"], correctIndex: 1 },
  { id: "a2-2", level: "A2", section: "vocabulary", prompt: "Opposite of 'caldo':",                                 choices: ["secco", "freddo", "chiuso", "lontano"], correctIndex: 1 },
  { id: "a2-3", level: "A2", section: "grammar",    prompt: "'I was working' in Italian:",                           choices: ["Ho lavorato", "Stavo lavorando", "Lavoro", "Lavorerò"], correctIndex: 1 },
  { id: "a2-4", level: "A2", section: "reading",    prompt: "'Un biglietto di sola andata' means:",                  choices: ["A return ticket", "A season pass", "A one-way ticket", "A daily ticket"], correctIndex: 2 },
  { id: "a2-5", level: "A2", section: "grammar",    prompt: "Indirect pronoun: 'Maria, ___ telefono stasera.'",     choices: ["ti", "tu", "te", "la"], correctIndex: 0 },
  { id: "a2-6", level: "A2", section: "vocabulary", prompt: "'Posso pagare con la carta?' asks about:",              choices: ["A map", "A card payment", "A letter", "A credit score"], correctIndex: 1 },

  // --- B1 ---
  { id: "b1-1", level: "B1", section: "grammar",    prompt: "Subjunctive: 'Penso che lui ___ giusto.'",             choices: ["ha", "ha avuto", "abbia", "avrebbe"], correctIndex: 2 },
  { id: "b1-2", level: "B1", section: "reading",    prompt: "'Essere al verde' idiomatically means:",                choices: ["To be green-eyed", "To be broke", "To be an environmentalist", "To be tired"], correctIndex: 1 },
  { id: "b1-3", level: "B1", section: "grammar",    prompt: "Conditional: 'Se avessi tempo, ___ in Italia.'",       choices: ["vado", "andrei", "andavo", "andrò"], correctIndex: 1 },
  { id: "b1-4", level: "B1", section: "vocabulary", prompt: "Formal 'you' when writing to a client:",               choices: ["tu", "Lei", "voi", "noi"], correctIndex: 1 },
  { id: "b1-5", level: "B1", section: "grammar",    prompt: "'Tutti i miei amici' — choose the right form:",        choices: ["Tutti i mii amici", "Tutti i miei amici", "Tutti miei amici", "Tutti amici miei"], correctIndex: 1 },
  { id: "b1-6", level: "B1", section: "reading",    prompt: "'Meno male!' expresses:",                              choices: ["Anger", "Relief", "Apology", "Surprise at bad news"], correctIndex: 1 },
  { id: "b1-7", level: "B1", section: "grammar",    prompt: "Passive voice: 'Il libro ___ letto da molti.'",        choices: ["è", "ha", "è stato", "fu"], correctIndex: 2 },

  // --- B2 ---
  { id: "b2-1", level: "B2", section: "grammar",    prompt: "'Se avessi studiato, ___ l'esame.'",                    choices: ["passavo", "avrei passato", "ho passato", "passerei"], correctIndex: 1 },
  { id: "b2-2", level: "B2", section: "reading",    prompt: "'In bocca al lupo!' is said to someone who:",           choices: ["Has bad breath", "Is about to take an exam", "Eats too much", "Is late"], correctIndex: 1 },
  { id: "b2-3", level: "B2", section: "vocabulary", prompt: "Best translation of 'bureaucracy':",                   choices: ["la burocrazia", "l'amministrazione", "il governo", "la burocratia"], correctIndex: 0 },
  { id: "b2-4", level: "B2", section: "grammar",    prompt: "'Dopo aver mangiato, ___ a dormire.'",                 choices: ["sono andato", "andavo", "vado", "andrei"], correctIndex: 0 },
  { id: "b2-5", level: "B2", section: "reading",    prompt: "'Fare il furbo' means to:",                            choices: ["Act smartly (sneakily)", "Do the right thing", "Be furious", "Be friendly"], correctIndex: 0 },
  { id: "b2-6", level: "B2", section: "grammar",    prompt: "Gerund: 'Sto ___ un articolo.'",                       choices: ["leggere", "leggendo", "letto", "lettura"], correctIndex: 1 },

  // --- C1 ---
  { id: "c1-1", level: "C1", section: "vocabulary", prompt: "'Inciampare in un ostacolo burocratico' means:",       choices: ["To solve red tape", "To trip over bureaucratic hurdles", "To accept a regulation", "To bribe an official"], correctIndex: 1 },
  { id: "c1-2", level: "C1", section: "grammar",    prompt: "'Qualora tu ___ bisogno, chiamami.'",                  choices: ["hai", "abbia", "avessi", "avresti"], correctIndex: 2 },
  { id: "c1-3", level: "C1", section: "reading",    prompt: "Manzoni's 'I Promessi Sposi' is set in:",              choices: ["Renaissance Florence", "17th-century Lombardy", "Venice in the 1800s", "Rome under Mussolini"], correctIndex: 1 },
  { id: "c1-4", level: "C1", section: "grammar",    prompt: "'Avrebbe dovuto telefonare' expresses:",               choices: ["A future possibility", "A past obligation unfulfilled", "A present duty", "A habit"], correctIndex: 1 },
  { id: "c1-5", level: "C1", section: "vocabulary", prompt: "'Sbrigarsi' is a synonym of:",                         choices: ["annoiarsi", "affrettarsi", "arrabbiarsi", "addormentarsi"], correctIndex: 1 },
];

export const levelInfo: Record<CEFR, { name: string; blurb: string }> = {
  A1: { name: "Beginner",            blurb: "You can introduce yourself, order food, and handle very basic everyday situations." },
  A2: { name: "Elementary",          blurb: "You can handle routine exchanges on familiar topics — shopping, travel, short conversations." },
  B1: { name: "Intermediate",        blurb: "You can hold a conversation, understand the main points of clear standard Italian, and navigate most travel situations." },
  B2: { name: "Upper-Intermediate",  blurb: "You discuss abstract topics, understand films, and can work or study in Italian with minimal barriers." },
  C1: { name: "Proficient",          blurb: "You express yourself fluently on any topic — academic, professional, literary. Dante's Italy is yours." },
};
