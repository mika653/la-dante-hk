export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1";
export type Section = "grammar" | "vocabulary" | "reading" | "listening";
// How the student answers a question. Defaults to "choice" when unset (so older
// saved questions keep working). "multi" = a question with several sub-blanks,
// each a mini multiple-choice; it is correct only when EVERY part is correct.
export type QType = "choice" | "fill" | "truefalse" | "multi";

// One sub-blank of a multi-part question. `label` is the blank marker shown to
// the student (e.g. "(1)" for a cloze, or the left phrase in a matching item).
export type QPart = { label?: string; choices: string[]; correctIndex: number };

export type Question = {
  id: string;
  level: CEFR;
  section: Section;
  type?: QType;          // "choice" (default) | "fill" | "truefalse" | "multi"
  prompt: string;
  sub?: string;
  choices: string[];     // used by "choice"; "truefalse" uses Vero/Falso
  correctIndex: number;  // index of the correct choice (0 = Vero for true/false)
  answer?: string;       // "fill": accepted answer(s), "|"-separated alternatives
  parts?: QPart[];       // "multi": the sub-blanks, each scored; all must be right
};

// True/False always offers these two options, in this order (0 = Vero).
export const TF_CHOICES = ["Vero", "Falso"];

// Normalise a typed answer for comparison: trim, lowercase, collapse whitespace.
// (Accents are kept — they're meaningful in Italian.)
function normAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

// Whether a student's response is correct, for any question type.
// For "multi", `response` is an array of selected indices (one per part) and the
// question counts as correct only when every part matches.
export function isAnswerCorrect(q: Question, response: number | string | number[] | null | undefined): boolean {
  if (response === null || response === undefined || response === "") return false;
  if (q.parts && q.parts.length > 0) {
    if (!Array.isArray(response)) return false;
    return q.parts.every((p, i) => Number(response[i]) === p.correctIndex);
  }
  if ((q.type ?? "choice") === "fill") {
    if (typeof response !== "string") return false;
    const given = normAnswer(response);
    return given.length > 0 && (q.answer ?? "").split("|").map(normAnswer).filter(Boolean).includes(given);
  }
  return Number(response) === q.correctIndex; // "choice" and "truefalse"
}

// How many individual answer-blanks a student got right in one question. A
// single-choice / fill / true-false question is one blank; a multi-part question
// is one blank per sub-part. Giulia's sectioned scoring counts blanks, not whole
// questions, so a part-right cloze still earns the points it got.
export function countCorrectBlanks(q: Question, response: number | string | number[] | null | undefined): number {
  if (q.parts && q.parts.length > 0) {
    const arr = Array.isArray(response) ? response : [];
    return q.parts.reduce((n, p, i) => n + (Number(arr[i]) === p.correctIndex ? 1 : 0), 0);
  }
  return isAnswerCorrect(q, response) ? 1 : 0;
}

// Shared option banks for the two "pick from a list" cloze questions (44, 45).
const PREP_BANK = ["a", "allo", "da", "dall'", "dei", "di", "in", "nell'", "sul"];
const VERB_BANK = ["avessi letto", "avevo letto", "buttare", "chieda", "chiedessi", "compri", "hai visto", "ho buttato", "interessava", "lascia", "preferirei", "volevo"];
// helper: a cloze part that picks from a shared bank
const bank = (choices: string[], label: string, correctIndex: number): QPart => ({ label, choices, correctIndex });

// The real La Dante placement test (46 questions, A1 → C1/C2), supplied by the
// school. Compound questions use `parts`; the test is scored on the number of
// whole questions answered correctly (see SCORE_BANDS). Ordered easy → hard.
export const questionBank: Question[] = [
  // ============================ A1 ============================
  { id: "q1", level: "A1", section: "grammar", prompt: "Arianna _____ in un ufficio.", choices: ["lavora", "lavorano", "lavorate"], correctIndex: 0 },
  { id: "q2", level: "A1", section: "grammar", prompt: "Lei _____ la segretaria?", choices: ["fai", "fa'", "fa"], correctIndex: 2 },
  { id: "q3", level: "A1", section: "grammar", prompt: "Voi _____ di Milano?", choices: ["siete", "sono", "siete stati"], correctIndex: 0 },
  { id: "q4", level: "A1", section: "grammar", prompt: "Tu quanti anni _____?", choices: ["hai", "sei", "fai"], correctIndex: 0 },
  { id: "q5", level: "A1", section: "grammar", type: "multi", prompt: "Vorrei (1) _____ aperitivo, (2) _____ toast e poi (3) _____ aranciata.", parts: [
    { label: "(1)", choices: ["uno", "un'", "un"], correctIndex: 2 },
    { label: "(2)", choices: ["uno", "un'", "un"], correctIndex: 2 },
    { label: "(3)", choices: ["un", "un'", "uno"], correctIndex: 1 },
  ], choices: [], correctIndex: 0 },
  { id: "q6", level: "A1", section: "grammar", type: "multi", prompt: "Preferisci (1) _____ tortellini o (2) _____ lasagne? (3) _____ spaghetti o (4) _____ tagliatelle?", parts: [
    { label: "(1)", choices: ["gli", "i", "le"], correctIndex: 1 },
    { label: "(2)", choices: ["gli", "i", "le"], correctIndex: 2 },
    { label: "(3)", choices: ["Gli", "I", "Le"], correctIndex: 0 },
    { label: "(4)", choices: ["gli", "i", "le"], correctIndex: 2 },
  ], choices: [], correctIndex: 0 },
  { id: "q7", level: "A1", section: "grammar", type: "multi", prompt: "A: Voi cosa (1) _____ nel tempo libero? B: Di solito (2) _____ sport: (3) _____ spesso in palestra. E tu? A: Io invece (4) _____ quasi sempre a casa.", parts: [
    { label: "(1)", choices: ["fa", "fate", "facciamo"], correctIndex: 1 },
    { label: "(2)", choices: ["facciamo", "fanno", "fa"], correctIndex: 0 },
    { label: "(3)", choices: ["vanno", "andiamo", "andate"], correctIndex: 1 },
    { label: "(4)", choices: ["stiamo", "sta", "sto"], correctIndex: 2 },
  ], choices: [], correctIndex: 0 },
  { id: "q8", level: "A1", section: "grammar", type: "multi", prompt: "(1) _____ febbraio affitto appartamento situato (2) _____ zona centrale, (3) _____ ogni comfort e vicino (4) _____ mare.", parts: [
    { label: "(1)", choices: ["A", "In", "Da"], correctIndex: 1 },
    { label: "(2)", choices: ["in", "a", "da"], correctIndex: 0 },
    { label: "(3)", choices: ["di", "con", "per"], correctIndex: 1 },
    { label: "(4)", choices: ["a", "in", "al"], correctIndex: 2 },
  ], choices: [], correctIndex: 0 },

  // ============================ A2 ============================
  { id: "q9", level: "A2", section: "grammar", type: "multi", prompt: "La signora Vanzetta conosce bene Bologna e (1) _____ va spesso, perché ha (2) _____ clienti lì. In questa città (3) _____ tante cose da vedere: delle (4) _____ chiese, (5) _____ musei interessanti e spesso delle mostre.", parts: [
    { label: "(1)", choices: ["ci", "ne", "la"], correctIndex: 0 },
    { label: "(2)", choices: ["degli", "delle", "dei"], correctIndex: 2 },
    { label: "(3)", choices: ["c'è", "ci sono", "sono"], correctIndex: 1 },
    { label: "(4)", choices: ["belli", "belle", "bello"], correctIndex: 1 },
    { label: "(5)", choices: ["dei", "degli", "i"], correctIndex: 0 },
  ], choices: [], correctIndex: 0 },
  { id: "q10", level: "A2", section: "grammar", type: "multi", prompt: "A: C'è una libreria qui vicino? B: Sì, dunque Lei adesso (1) _____ dall'albergo, poi gira subito (2) _____ e lì, (3) _____ il supermercato e la banca, c'è la libreria Artigianelli.", parts: [
    { label: "(1)", choices: ["esci", "uscite", "esce"], correctIndex: 2 },
    { label: "(2)", choices: ["a destra", "diritto", "indietro"], correctIndex: 0 },
    { label: "(3)", choices: ["in", "fra", "da"], correctIndex: 1 },
  ], choices: [], correctIndex: 0 },
  { id: "q11", level: "A2", section: "grammar", type: "multi", prompt: "A: Scusi, sa (1) _____ l'hotel Lux? B: No, (2) _____, non sono di qui.", parts: [
    { label: "(1)", choices: ["che cosa è", "dov'è", "chi è"], correctIndex: 1 },
    { label: "(2)", choices: ["prego", "grazie", "mi dispiace"], correctIndex: 2 },
  ], choices: [], correctIndex: 0 },
  { id: "q12", level: "A2", section: "grammar", type: "multi", prompt: "Carlo e Anna (1) _____ due belle giornate. Ieri (2) _____ in un museo e poi (3) _____ in un ristorante tipico. Oggi (4) _____ una mostra insieme e la sera Anna (5) _____ anche al cinema.", parts: [
    { label: "(1)", choices: ["sono passati", "hanno passato", "passavano"], correctIndex: 1 },
    { label: "(2)", choices: ["sono stati", "hanno stato", "erano"], correctIndex: 0 },
    { label: "(3)", choices: ["sono pranzati", "pranzavano", "hanno pranzato"], correctIndex: 2 },
    { label: "(4)", choices: ["hanno visitato", "sono visitati", "visitavano"], correctIndex: 0 },
    { label: "(5)", choices: ["ha andato", "è andata", "andava"], correctIndex: 1 },
  ], choices: [], correctIndex: 0 },
  { id: "q13", level: "A2", section: "grammar", type: "multi", prompt: "La signora Cusimano va in un negozio di alimentari e prende due etti di mortadella, ma (1) _____ vuole affettata molto sottile. Desidera anche del formaggio, (2) _____ vuole stagionato e (3) _____ prende tre etti. Poi compra anche delle olive: (4) _____ vuole nere e grosse.", parts: [
    { label: "(1)", choices: ["la", "le", "lo"], correctIndex: 0 },
    { label: "(2)", choices: ["la", "lo", "li"], correctIndex: 1 },
    { label: "(3)", choices: ["ne", "lo", "li"], correctIndex: 0 },
    { label: "(4)", choices: ["li", "lo", "le"], correctIndex: 2 },
  ], choices: [], correctIndex: 0 },
  { id: "q14", level: "A2", section: "reading", prompt: "Ti alzi presto la mattina?", choices: ["Sì, verso le sei.", "Sì, in via Roma.", "No, non la prendo."], correctIndex: 0 },
  { id: "q15", level: "A2", section: "reading", prompt: "Che taglia porta?", choices: ["La 52.", "Il 42.", "Nero."], correctIndex: 0 },

  // ============================ B1 ============================
  { id: "q16", level: "B1", section: "grammar", type: "multi", prompt: "Il signor Ferri va con la moglie in un negozio di scarpe. Vede dei mocassini che (1) _____ piacciono molto, ma sono troppo cari. La moglie vede delle scarpe (2) _____ care che (3) _____ sembrano pure comode. Il marito (4) _____ prova, piacciono anche (5) _____ e allora (6) _____ compra.", parts: [
    { label: "(1)", choices: ["lo", "le", "gli"], correctIndex: 2 },
    { label: "(2)", choices: ["più", "meno", "tanto"], correctIndex: 1 },
    { label: "(3)", choices: ["gli", "le", "si"], correctIndex: 1 },
    { label: "(4)", choices: ["la", "li", "le"], correctIndex: 2 },
    { label: "(5)", choices: ["a lui", "a lei", "da lui"], correctIndex: 0 },
    { label: "(6)", choices: ["la", "li", "le"], correctIndex: 2 },
  ], choices: [], correctIndex: 0 },
  { id: "q17", level: "B1", section: "grammar", type: "multi", prompt: "Io ho due fratelli e una sorella. (1) _____ sorella è più grande e (2) _____ fratelli sono più piccoli. Abitiamo insieme a Ferrara, dove studiamo. (3) _____, invece, vivono in un paesino qua vicino.", parts: [
    { label: "(1)", choices: ["Mia", "La mia", "La sua"], correctIndex: 0 },
    { label: "(2)", choices: ["Miei", "I miei", "Li miei"], correctIndex: 1 },
    { label: "(3)", choices: ["I miei", "Miei", "I suoi"], correctIndex: 0 },
  ], choices: [], correctIndex: 0 },
  { id: "q18", level: "B1", section: "grammar", type: "multi", prompt: "Completa le frasi.", parts: [
    { label: "(1) Silvia _____ in fisica.", choices: ["si è laureata", "è laureata", "ha laureato"], correctIndex: 0 },
    { label: "(2) Io e Paolo _____ in questa città da meno di due anni.", choices: ["abbiamo trasferito", "ci siamo trasferiti", "siamo trasferiti"], correctIndex: 1 },
    { label: "(3) Mio nonno _____ per anni al giardinaggio.", choices: ["si è dedicato", "ha dedicato", "è dedicato"], correctIndex: 0 },
  ], choices: [], correctIndex: 0 },
  { id: "q19", level: "B1", section: "grammar", type: "multi", prompt: "Quando io (1) _____ piccolo, (2) _____ in campagna e (3) _____ molti animali. Normalmente l'estate noi (4) _____ le vacanze al mare, ma una volta (5) _____ in montagna.", parts: [
    { label: "(1)", choices: ["sono stato", "ero", "fui"], correctIndex: 1 },
    { label: "(2)", choices: ["vivevo", "ho vissuto", "vissi"], correctIndex: 0 },
    { label: "(3)", choices: ["ho avuto", "ebbi", "avevo"], correctIndex: 2 },
    { label: "(4)", choices: ["passavamo", "abbiamo passato", "passammo"], correctIndex: 0 },
    { label: "(5)", choices: ["andavamo", "siamo andati", "andammo"], correctIndex: 1 },
  ], choices: [], correctIndex: 0 },
  { id: "q20", level: "B1", section: "grammar", prompt: "Marco è _____ alto di Carlo.", choices: ["tanto", "meno", "molto"], correctIndex: 1 },
  { id: "q21", level: "B1", section: "grammar", prompt: "È una città _____ siamo già stati.", choices: ["in cui", "che", "di cui"], correctIndex: 0 },
  { id: "q22", level: "B1", section: "grammar", prompt: "Le vacanze _____.", choices: ["sono finite", "hanno finito", "sono finiti"], correctIndex: 0 },
  { id: "q23", level: "B1", section: "grammar", prompt: "Scusa il ritardo, ma non _____ la strada.", choices: ["ho conosciuto", "conoscevo", "conobbi"], correctIndex: 1 },
  { id: "q24", level: "B1", section: "grammar", prompt: "Per arrivare a Firenze _____ tre ore.", choices: ["ci vogliono", "ci vuole", "ci mettono"], correctIndex: 0 },
  { id: "q25", level: "B1", section: "grammar", prompt: "Lo chiamo o gli scrivo?", choices: ["Scrivigli una mail!", "Scrivile una mail!", "Scrivila una mail!"], correctIndex: 0 },
  { id: "q26", level: "B1", section: "grammar", prompt: "La cosa _____ è andare in vacanza.", choices: ["meglio", "migliore", "più bene"], correctIndex: 1 },
  { id: "q27", level: "B1", section: "grammar", type: "multi", prompt: "Se va al mare, (1) _____ le ore molto calde e (2) _____ sempre un cappello!", parts: [
    { label: "(1)", choices: ["evita", "eviti", "eviterà"], correctIndex: 1 },
    { label: "(2)", choices: ["metta", "metti", "mettesse"], correctIndex: 0 },
  ], choices: [], correctIndex: 0 },

  // ============================ B2 ============================
  { id: "q28", level: "B2", section: "grammar", type: "multi", prompt: "Scegli dalla lista (ogni opzione va usata una volta): a. andrò · b. sia · c. ci vuole · d. bisogna · e. ho deciso · f. ho cercato · g. penso.", sub: "(1) _____ che oggi non (2) _____ facile trovare un buon impiego. (3) _____ essere flessibili, avere dei buoni contatti e (4) _____ anche un po' di fortuna. Io (5) _____ a lungo, ma finora senza risultati, quindi (6) _____ che prima o poi (7) _____ a vivere all'estero.", parts: [
    bank(["andrò", "sia", "ci vuole", "bisogna", "ho deciso", "ho cercato", "penso"], "(1)", 6),
    bank(["andrò", "sia", "ci vuole", "bisogna", "ho deciso", "ho cercato", "penso"], "(2)", 1),
    bank(["andrò", "sia", "ci vuole", "bisogna", "ho deciso", "ho cercato", "penso"], "(3)", 3),
    bank(["andrò", "sia", "ci vuole", "bisogna", "ho deciso", "ho cercato", "penso"], "(4)", 2),
    bank(["andrò", "sia", "ci vuole", "bisogna", "ho deciso", "ho cercato", "penso"], "(5)", 5),
    bank(["andrò", "sia", "ci vuole", "bisogna", "ho deciso", "ho cercato", "penso"], "(6)", 4),
    bank(["andrò", "sia", "ci vuole", "bisogna", "ho deciso", "ho cercato", "penso"], "(7)", 0),
  ], choices: [], correctIndex: 0 },
  { id: "q29", level: "B2", section: "grammar", type: "multi", prompt: "Secondo me scambiare la propria casa quando si va in vacanza non (1) _____ una buona idea. Una mia amica, invece, non è d'accordo con me. Lei pensa che questa (2) _____ un'ottima cosa, senza dubbio più conveniente che (3) _____ una casa. Lei crede poi che vivere in un appartamento di altre persone (4) _____ essere più interessante che stare in uno anonimo in affitto.", parts: [
    { label: "(1)", choices: ["sia", "possa", "è", "affittare"], correctIndex: 2 },
    { label: "(2)", choices: ["sia", "possa", "è", "affittare"], correctIndex: 0 },
    { label: "(3)", choices: ["sia", "possa", "è", "affittare"], correctIndex: 3 },
    { label: "(4)", choices: ["sia", "possa", "è", "affittare"], correctIndex: 1 },
  ], choices: [], correctIndex: 0 },
  { id: "q30", level: "B2", section: "grammar", prompt: "È entrata mentre _____ il giornale.", choices: ["leggevo", "ho letto", "lessi"], correctIndex: 0 },
  { id: "q31", level: "B2", section: "grammar", prompt: "L'ho conosciuto _____ un viaggio.", choices: ["mentre", "durante", "per"], correctIndex: 1 },
  { id: "q32", level: "B2", section: "grammar", prompt: "Quando sei arrivato, stavo proprio per _____.", choices: ["andarsene", "andarmene via", "andarmene"], correctIndex: 2 },
  { id: "q33", level: "B2", section: "grammar", prompt: "Non ha voluto niente perché _____ mangiato prima.", choices: ["aveva già", "ha già", "già aveva"], correctIndex: 0 },
  { id: "q34", level: "B2", section: "grammar", prompt: "A: Non gli hai detto niente? B: Ma certo che _____ ho parlato.", choices: ["ce ne", "gliene", "glielo"], correctIndex: 1 },
  { id: "q35", level: "B2", section: "grammar", prompt: "Al suo posto _____ più gentile.", choices: ["sarei", "fossi", "sarei stata"], correctIndex: 2 },
  { id: "q36", level: "B2", section: "grammar", prompt: "Prestami la tua bicicletta. _____ si è rotta.", choices: ["Mia", "La mia", "Quella mia"], correctIndex: 1 },
  { id: "q37", level: "B2", section: "grammar", type: "multi", prompt: "Non credo che (1) _____ ancora insieme; (2) _____ che (3) _____ qualche tempo fa.", parts: [
    { label: "(1)", choices: ["stanno", "stiano", "stessero"], correctIndex: 1 },
    { label: "(2)", choices: ["penso", "crederei", "saprei"], correctIndex: 0 },
    { label: "(3)", choices: ["si sono lasciati", "si siano lasciati", "si lasciassero"], correctIndex: 1 },
  ], choices: [], correctIndex: 0 },
  { id: "q38", level: "B2", section: "grammar", type: "multi", prompt: "«Cosa farete dopo che (1) _____ l'esame?» «Mah, io (2) _____ di sicuro a casa.» «Io, invece, (3) _____ un bel viaggetto.»", parts: [
    { label: "(1)", choices: ["avrete superato", "supererete", "avete superato"], correctIndex: 0 },
    { label: "(2)", choices: ["riposo", "mi riposerò", "riposerò"], correctIndex: 1 },
    { label: "(3)", choices: ["farò", "farebbe", "avessi fatto"], correctIndex: 0 },
  ], choices: [], correctIndex: 0 },
  { id: "q39", level: "B2", section: "grammar", type: "multi", prompt: "Ma quanto tempo ci (1) _____? Il treno (2) _____ per partire! Avevo paura che tu non (3) _____ in tempo!", parts: [
    { label: "(1)", choices: ["avevi messo", "metteresti", "hai messo"], correctIndex: 2 },
    { label: "(2)", choices: ["è stato", "stava", "starebbe"], correctIndex: 1 },
    { label: "(3)", choices: ["arrivassi", "arrivi", "sia arrivato"], correctIndex: 0 },
  ], choices: [], correctIndex: 0 },
  { id: "q40", level: "B2", section: "grammar", type: "multi", prompt: "Sì, certo, Venezia è una delle più belle città che io (1) _____; è però anche molto turistica e (2) _____ da migliaia di persone. A me sembra che tu (3) _____ gusti diversi dai miei. A patto che tu non (4) _____ cambiato, beh, chiaro, puoi sempre (5) _____.", parts: [
    { label: "(1)", choices: ["ho mai visto", "vedessi", "abbia mai visto"], correctIndex: 2 },
    { label: "(2)", choices: ["è visitando", "viene visitata", "visiti"], correctIndex: 1 },
    { label: "(3)", choices: ["abbia", "hai", "avessi"], correctIndex: 0 },
    { label: "(4)", choices: ["sia", "sei", "fossi"], correctIndex: 0 },
    { label: "(5)", choices: ["andarvi", "andarci lì", "andarci"], correctIndex: 2 },
  ], choices: [], correctIndex: 0 },

  // ========================== C1 / C2 ==========================
  { id: "q41", level: "C1", section: "grammar", type: "multi", prompt: "In quali di queste frasi la parte indicata può essere sostituita con il gerundio «andando»? Scegli Sì o No per ciascuna.", parts: [
    { label: "a. Mentre andava a casa, Ada ha incontrato il figlio.", choices: ["Sì", "No"], correctIndex: 0 },
    { label: "b. Mentre Ada andava a casa, il figlio ha incontrato Gianni.", choices: ["Sì", "No"], correctIndex: 1 },
    { label: "c. Quando vado a casa, incontro sempre Ada.", choices: ["Sì", "No"], correctIndex: 0 },
    { label: "d. Dopo esser andata a casa, ha incontrato Ada.", choices: ["Sì", "No"], correctIndex: 1 },
    { label: "e. Prima di andare a casa, ha incontrato Ada.", choices: ["Sì", "No"], correctIndex: 1 },
  ], choices: [], correctIndex: 0 },
  { id: "q42", level: "C1", section: "grammar", type: "multi", prompt: "Collega le parti delle frasi ipotetiche: scegli il seguito giusto per ciascun inizio.", parts: [
    { label: "a. Se nevicasse,", choices: ["oggi avrei meno problemi.", "vengo a trovarti questo pomeriggio.", "te lo presterei volentieri.", "andrei a sciare.", "sarebbe stato promosso.", "il tuo lavoro sarebbe più preciso."], correctIndex: 3 },
    { label: "b. Se questo libro ti piacesse,", choices: ["oggi avrei meno problemi.", "vengo a trovarti questo pomeriggio.", "te lo presterei volentieri.", "andrei a sciare.", "sarebbe stato promosso.", "il tuo lavoro sarebbe più preciso."], correctIndex: 2 },
    { label: "c. Se tu lavorassi con più calma,", choices: ["oggi avrei meno problemi.", "vengo a trovarti questo pomeriggio.", "te lo presterei volentieri.", "andrei a sciare.", "sarebbe stato promosso.", "il tuo lavoro sarebbe più preciso."], correctIndex: 5 },
    { label: "d. Se avesse studiato un po' di più,", choices: ["oggi avrei meno problemi.", "vengo a trovarti questo pomeriggio.", "te lo presterei volentieri.", "andrei a sciare.", "sarebbe stato promosso.", "il tuo lavoro sarebbe più preciso."], correctIndex: 4 },
    { label: "e. Se vuoi,", choices: ["oggi avrei meno problemi.", "vengo a trovarti questo pomeriggio.", "te lo presterei volentieri.", "andrei a sciare.", "sarebbe stato promosso.", "il tuo lavoro sarebbe più preciso."], correctIndex: 1 },
    { label: "f. Se in passato avessi lavorato di più,", choices: ["oggi avrei meno problemi.", "vengo a trovarti questo pomeriggio.", "te lo presterei volentieri.", "andrei a sciare.", "sarebbe stato promosso.", "il tuo lavoro sarebbe più preciso."], correctIndex: 0 },
  ], choices: [], correctIndex: 0 },
  { id: "q43", level: "C1", section: "grammar", type: "multi", prompt: "Scegli la particella o il pronome corretto.", parts: [
    { label: "(1) E col pallone, come va? – Beh, _____ gioco ancora quasi tutte le domeniche.", choices: ["ne", "vi", "lo", "ci"], correctIndex: 3 },
    { label: "(2) Dopo un duro lavoro _____ riposa volentieri.", choices: ["si", "se ne", "ci si", "vi si"], correctIndex: 2 },
    { label: "(3) Di questo problema _____ parla spesso anche in TV.", choices: ["se ne", "ci si", "lo si", "se lo"], correctIndex: 0 },
    { label: "(4) Regalando_____ voleva farti una sorpresa.", choices: ["te ne", "telo", "te lo", "glielo"], correctIndex: 1 },
  ], choices: [], correctIndex: 0 },
  { id: "q44", level: "C1", section: "grammar", type: "multi", prompt: "Inserisci la preposizione corretta (dalla lista: a · allo · da · dall' · dei · di · in · nell' · sul): «È noto ormai che uno dei problemi più gravi è oggi quello (1) _____ cambiamenti climatici. Anche lo scenario disegnato (2) _____ ONU, un aumento di 2-3 gradi (3) _____ temperatura, è allarmante, perché farebbe anticipare lo scioglimento della neve (4) _____ quasi un mese. Per la gente è dunque un problema prendere (5) _____ considerazione l'ipotesi delle vacanze, sia in montagna (dove si assiste (6) _____ un aumento di incidenti legati (7) _____ smottamento dei versanti alpini), sia al mare, dove (8) _____ governare il tempo saranno sempre più gli «eventi estremi». (9) _____ arco di un anno, cioè, avremo la stessa quantità d'acqua, ma in forma molto più violenta. Insomma, c'è (10) _____ preoccuparsi (11) _____ serio!»", parts: [
    bank(PREP_BANK, "(1)", 4),
    bank(PREP_BANK, "(2)", 3),
    bank(PREP_BANK, "(3)", 5),
    bank(PREP_BANK, "(4)", 5),
    bank(PREP_BANK, "(5)", 6),
    bank(PREP_BANK, "(6)", 0),
    bank(PREP_BANK, "(7)", 1),
    bank(PREP_BANK, "(8)", 0),
    bank(PREP_BANK, "(9)", 7),
    bank(PREP_BANK, "(10)", 2),
    bank(PREP_BANK, "(11)", 8),
  ], choices: [], correctIndex: 0 },
  { id: "q45", level: "C1", section: "grammar", type: "multi", prompt: "Inserisci i verbi mancanti (dalla lista: avessi letto · avevo letto · buttare · chieda · chiedessi · compri · hai visto · ho buttato · interessava · lascia · preferirei · volevo): ■ «Senti, (1) _____ per caso Il Corriere?» ◆ «Sì, ma l' (2) _____ via. Credevo che l' (3) _____!» ■ «E infatti l' (4) _____, solo che c'era un articolo che mi (5) _____ e che (6) _____ conservare.» ◆ «Mi dispiace. Vuoi che (7) _____ a mia sorella? Penso che lo (8) _____ anche lei.» ■ «No, no, (9) _____ perdere, però per favore la prossima volta, prima di (10) _____ via qualcosa (11) _____ che me lo (12) _____.»", parts: [
    bank(VERB_BANK, "(1)", 6),
    bank(VERB_BANK, "(2)", 7),
    bank(VERB_BANK, "(3)", 0),
    bank(VERB_BANK, "(4)", 1),
    bank(VERB_BANK, "(5)", 8),
    bank(VERB_BANK, "(6)", 11),
    bank(VERB_BANK, "(7)", 3),
    bank(VERB_BANK, "(8)", 5),
    bank(VERB_BANK, "(9)", 9),
    bank(VERB_BANK, "(10)", 2),
    bank(VERB_BANK, "(11)", 10),
    bank(VERB_BANK, "(12)", 4),
  ], choices: [], correctIndex: 0 },
  { id: "q46", level: "C1", section: "grammar", type: "multi", prompt: "Trasforma al discorso indiretto («Lui disse che…»): scegli la forma corretta.", parts: [
    { label: "1. «Qui mi trovo bene.»", choices: ["lì si trovava bene.", "lì si trovi bene.", "qui si era trovato bene."], correctIndex: 0 },
    { label: "2. «Penso che vada bene.»", choices: ["pensava che andasse bene.", "pensa che vada bene.", "pensava che andava bene."], correctIndex: 0 },
    { label: "3. «Dovrei uscire alle 7.»", choices: ["dovesse uscire alle 7.", "dovrebbe uscire alle 7.", "sarebbe dovuto uscire alle 7."], correctIndex: 2 },
    { label: "4. «Esci subito dalla classe!»", choices: ["uscirebbe subito dalla classe.", "uscisse subito dalla classe.", "esca subito dalla classe."], correctIndex: 1 },
    { label: "5. «Dovrò cambiarmi.»", choices: ["dovrà cambiarsi.", "avrebbe dovuto cambiarsi.", "dovesse cambiarsi."], correctIndex: 1 },
    { label: "6. «È arrivato.»", choices: ["è arrivato.", "arrivava.", "era arrivato."], correctIndex: 2 },
    { label: "7. «Avevo paura.»", choices: ["aveva paura.", "avrebbe avuto paura.", "abbia avuto paura."], correctIndex: 0 },
    { label: "8. «Mangiando si ingrassa.»", choices: ["mangiando si fosse ingrassato.", "mangiando si ingrassa.", "mangiando si ingrassava."], correctIndex: 1 },
    { label: "9. «Sarei dovuto uscire.»", choices: ["fosse dovuto uscire.", "era dovuto uscire.", "sarebbe dovuto uscire."], correctIndex: 2 },
    { label: "10. «Se avessi mangiato saresti ingrassato.»", choices: ["se avesse mangiato sarebbe ingrassato.", "se mangiasse ingrasserebbe.", "se avesse mangiato fosse ingrassato."], correctIndex: 0 },
  ], choices: [], correctIndex: 0 },
];

export const levelInfo: Record<CEFR, { name: string; blurb: string }> = {
  A1: { name: "Beginner",            blurb: "You can introduce yourself, order food, and handle very basic everyday situations." },
  A2: { name: "Elementary",          blurb: "You can handle routine exchanges on familiar topics — shopping, travel, short conversations." },
  B1: { name: "Intermediate",        blurb: "You can hold a conversation, understand the main points of clear standard Italian, and navigate most travel situations." },
  B2: { name: "Upper-Intermediate",  blurb: "You discuss abstract topics, understand films, and can work or study in Italian with minimal barriers." },
  C1: { name: "Proficient",          blurb: "You express yourself fluently on any topic — academic, professional, literary. Dante's Italy is yours." },
};

// -------------------- Scoring (Giulia's placement rubric) --------------------
// The placement test runs as a single ordered list of 46 questions in increasing
// difficulty. The score (x) is the number of whole questions answered correctly;
// a compound question counts only when every blank is right. x maps to a
// sub-level below.
//
// PROVISIONAL — GIULIA TO CONFIRM. Her "Results rules" sheet is written as
// overlapping question blocks with thresholds that reset and are non-monotonic
// (e.g. x<14, then x<20, then x<12…), so it cannot be applied verbatim. The
// ladder below is a clean ascending normalisation of it for a 46-question test.
// To adjust, just change the `minCorrect` numbers — nothing else needs touching.
export type ScoreBand = { minCorrect: number; label: string; cefr: CEFR };

export const SCORE_BANDS: ScoreBand[] = [
  { minCorrect: 0,  label: "A1.1",      cefr: "A1" },
  { minCorrect: 14, label: "A1.2",      cefr: "A1" },
  { minCorrect: 17, label: "A1.3",      cefr: "A1" },
  { minCorrect: 20, label: "A2.1",      cefr: "A2" },
  { minCorrect: 23, label: "A2.1–A2.2", cefr: "A2" },
  { minCorrect: 25, label: "A2.3",      cefr: "A2" },
  { minCorrect: 27, label: "A2.3–A2.4", cefr: "A2" },
  { minCorrect: 29, label: "B1.1",      cefr: "B1" },
  { minCorrect: 31, label: "B1.1–B1.2", cefr: "B1" },
  { minCorrect: 33, label: "B1.3",      cefr: "B1" },
  { minCorrect: 35, label: "B1.3–B1.4", cefr: "B1" },
  { minCorrect: 37, label: "B2.1",      cefr: "B2" },
  { minCorrect: 41, label: "C1–C2",     cefr: "C1" },
];

// The highest band whose threshold the score meets.
export function scoreToSubLevel(correct: number): { label: string; cefr: CEFR } {
  let band: ScoreBand = SCORE_BANDS[0];
  for (const b of SCORE_BANDS) if (correct >= b.minCorrect) band = b;
  return { label: band.label, cefr: band.cefr };
}

// ---------------- Sectioned scoring (Giulia's "Results rules") ----------------
// The real rubric is a SECTIONED test: the student works through blocks of
// questions in order; in each block we count correct ANSWER-BLANKS (not whole
// questions) and compare to a pass mark. Below the mark places them at that
// block's level and stops; at or above, they move up and continue to the next
// block. The final block has a three-way split.
//
// PROVISIONAL — GIULIA TO CONFIRM. The question ranges are taken verbatim from
// her sheet and OVERLAP (1–18 then 9–16, which sits inside it); they most likely
// need to be corrected to consecutive ranges. The pass marks are hers. To adjust,
// change the numbers below — nothing else needs touching.
export type PlacementSection = { from: number; to: number; pass: number; below: string; above: string };
export const PLACEMENT_SECTIONS: PlacementSection[] = [
  { from: 1,  to: 18, pass: 14, below: "A1.1",      above: "A1.2" },
  { from: 9,  to: 16, pass: 20, below: "A1.3",      above: "A2.1" },
  { from: 17, to: 24, pass: 12, below: "A2.1–A2.2", above: "A2.3" },
  { from: 25, to: 32, pass: 13, below: "A2.3–A2.4", above: "B1.1" },
  { from: 33, to: 40, pass: 13, below: "B1.1–B1.2", above: "B1.3" },
];
// Final block Q41–46: below 13 → B1.3–B1.4, 13–34 → B2.1, 35+ → C1–C2.
// (Giulia's sheet left 30–34 undefined; folded into B2.1 here — confirm with her.)
export const PLACEMENT_FINAL = {
  from: 41,
  to: 46,
  bands: [ { min: 0, label: "B1.3–B1.4" }, { min: 13, label: "B2.1" }, { min: 35, label: "C1–C2" } ],
};

// CEFR band (A1/A2/B1/B2/C1) behind a sub-level label like "A2.1–A2.2" or "C1–C2".
function cefrOf(label: string): CEFR {
  const b = label.slice(0, 2);
  return (["A1", "A2", "B1", "B2", "C1"] as string[]).includes(b) ? (b as CEFR) : "C1";
}

// Walk the sections in order, counting correct blanks. Stop at the first block
// the student scores below its pass mark (their level is that block's "below").
// Clearing a block moves them up and on; a student who stops early is placed by
// the last block they answered. The final block uses its three-way bands.
export function scoreSectioned(
  bank: Question[],
  answers: Record<string, number | string | number[]>,
): { label: string; cefr: CEFR } {
  const byId = new Map(bank.map((q) => [q.id, q]));
  const answeredIn = (from: number, to: number) => {
    for (let i = from; i <= to; i++) if (answers[`q${i}`] !== undefined) return true;
    return false;
  };
  const blanksIn = (from: number, to: number) => {
    let n = 0;
    for (let i = from; i <= to; i++) {
      const q = byId.get(`q${i}`);
      if (q) n += countCorrectBlanks(q, answers[q.id]);
    }
    return n;
  };
  let result: { label: string; cefr: CEFR } = { label: "A1.1", cefr: "A1" };
  for (const s of PLACEMENT_SECTIONS) {
    if (!answeredIn(s.from, s.to)) return result;                   // stopped before this block
    if (blanksIn(s.from, s.to) < s.pass) return { label: s.below, cefr: cefrOf(s.below) };
    result = { label: s.above, cefr: cefrOf(s.above) };            // cleared this block; carry on
  }
  if (answeredIn(PLACEMENT_FINAL.from, PLACEMENT_FINAL.to)) {
    const score = blanksIn(PLACEMENT_FINAL.from, PLACEMENT_FINAL.to);
    let band = PLACEMENT_FINAL.bands[0];
    for (const b of PLACEMENT_FINAL.bands) if (score >= b.min) band = b;
    result = { label: band.label, cefr: cefrOf(band.label) };
  }
  return result;
}
