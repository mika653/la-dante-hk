// "Word / phrase of the day" for the landing page.
//
// The item is chosen from the date, so the box refreshes itself every morning
// with nobody touching it — no backend, no API cost. The list cycles: with N
// entries an item reappears every N days, and the year's leftover days shift
// the starting point so the order isn't identical each year.
//
// TEACHERS: this is a starter set — please review and extend it. The English
// and 繁中 glosses in particular should be checked by a native speaker before
// this is treated as teaching material.

export type DailyItem = {
  kind: "word" | "phrase";
  it: string;                 // the Italian itself
  en: string;                 // English meaning
  zh: string;                 // Traditional Chinese meaning
  literal?: string;           // literal reading, where the idiom is fun
  example?: { it: string; en: string; zh: string };
};

export const DAILY_ITEMS: DailyItem[] = [
  {
    kind: "phrase", it: "In bocca al lupo", en: "Good luck", zh: "祝你好運",
    literal: "Literally: “into the wolf’s mouth.” The reply is “crepi!” — may it die.",
    example: { it: "Domani ho l’esame. — In bocca al lupo!", en: "I have my exam tomorrow. — Good luck!", zh: "我明天考試。—— 祝你好運！" },
  },
  {
    kind: "word", it: "Abbiocco", en: "The drowsiness that follows a big meal", zh: "飯後睏意",
    literal: "Wonderfully specific: Italian has a single word for it.",
    example: { it: "Dopo pranzo mi viene sempre l’abbiocco.", en: "After lunch I always get sleepy.", zh: "午飯後我總是很睏。" },
  },
  {
    kind: "phrase", it: "Piano piano", en: "Little by little; slowly does it", zh: "慢慢來",
    example: { it: "Piano piano, imparerai l’italiano.", en: "Little by little, you’ll learn Italian.", zh: "慢慢來，你會學會意大利文的。" },
  },
  {
    kind: "word", it: "Magari", en: "Maybe — or “if only!”", zh: "也許；但願如此",
    literal: "Tone decides the meaning: a shrug, or a wish.",
    example: { it: "Vieni in Italia con noi? — Magari!", en: "Coming to Italy with us? — If only!", zh: "跟我們去意大利嗎？—— 但願如此！" },
  },
  {
    kind: "phrase", it: "Non vedo l’ora", en: "I can’t wait", zh: "我等不及了",
    literal: "Literally: “I don’t see the hour.”",
    example: { it: "Non vedo l’ora di rivederti.", en: "I can’t wait to see you again.", zh: "我等不及要再見到你。" },
  },
  {
    kind: "word", it: "Allora", en: "So…; well then", zh: "那麼",
    literal: "The word Italians reach for while deciding what to say next.",
    example: { it: "Allora, cominciamo!", en: "Right then, let’s begin!", zh: "那麼，我們開始吧！" },
  },
  {
    kind: "word", it: "Meriggiare", en: "To rest at noon in the shade", zh: "午後在樹蔭下休息",
    literal: "Rare and poetic — Montale built a famous poem on it.",
    example: { it: "Meriggiare pallido e assorto.", en: "To rest at noon, pale and absorbed.", zh: "蒼白而沉思地在午後休憩。" },
  },
  {
    kind: "phrase", it: "Tutto a posto", en: "All good; everything’s fine", zh: "一切都好",
    example: { it: "Tutto a posto? — Sì, tutto bene.", en: "All good? — Yes, all fine.", zh: "一切都好嗎？—— 是的，都好。" },
  },
  {
    kind: "word", it: "Biblioteca", en: "Library", zh: "圖書館",
    literal: "A false friend: it is not a bookshop (that’s “libreria”).",
    example: { it: "La biblioteca della Dante è aperta a tutti i soci.", en: "The Dante library is open to all members.", zh: "但丁協會的圖書館向所有會員開放。" },
  },
  {
    kind: "phrase", it: "Che bello!", en: "How lovely!", zh: "太好了！",
    example: { it: "Che bello rivederti!", en: "How lovely to see you again!", zh: "再見到你真好！" },
  },
  {
    kind: "word", it: "Sprezzatura", en: "Studied effortlessness; making the hard look easy", zh: "舉重若輕的優雅",
    literal: "Coined in 1528 by Castiglione, and still the heart of Italian style.",
    example: { it: "Veste con sprezzatura.", en: "He dresses with effortless ease.", zh: "他穿得毫不費力卻很優雅。" },
  },
  {
    kind: "phrase", it: "Buon appetito", en: "Enjoy your meal", zh: "用餐愉快",
    literal: "Said before every meal — leaving it out feels abrupt.",
    example: { it: "A tavola! Buon appetito.", en: "Come to the table! Enjoy your meal.", zh: "開飯了！用餐愉快。" },
  },
  {
    kind: "word", it: "Passeggiata", en: "A slow evening stroll, for its own sake", zh: "傍晚散步",
    literal: "Less a walk than a daily ritual of seeing and being seen.",
    example: { it: "Facciamo una passeggiata dopo cena?", en: "Shall we take a stroll after dinner?", zh: "晚飯後去散步好嗎？" },
  },
  {
    kind: "phrase", it: "Come stai?", en: "How are you?", zh: "你好嗎？",
    literal: "Informal. With strangers, use “come sta?”",
    example: { it: "Ciao Marco, come stai?", en: "Hi Marco, how are you?", zh: "你好馬可，你好嗎？" },
  },
  {
    kind: "word", it: "Dolcevita", en: "A turtleneck — and “the sweet life”", zh: "高領毛衣；甜美生活",
    literal: "One word, two icons: the jumper and the Fellini film.",
    example: { it: "Porta sempre un dolcevita nero.", en: "He always wears a black turtleneck.", zh: "他總是穿黑色高領毛衣。" },
  },
  {
    kind: "phrase", it: "Ci vediamo!", en: "See you!", zh: "再見！",
    literal: "Literally: “we see each other.”",
    example: { it: "Ci vediamo domani in classe.", en: "See you in class tomorrow.", zh: "明天課堂見。" },
  },
  {
    kind: "word", it: "Amicizia", en: "Friendship", zh: "友誼",
    example: { it: "Un’amicizia nata in classe.", en: "A friendship born in class.", zh: "在課堂上結下的友誼。" },
  },
  {
    kind: "phrase", it: "Fa niente", en: "Never mind; it’s nothing", zh: "沒關係",
    example: { it: "Scusa il ritardo! — Fa niente.", en: "Sorry I’m late! — Never mind.", zh: "抱歉我遲到了！—— 沒關係。" },
  },
  {
    kind: "word", it: "Chiacchierare", en: "To chat, to natter", zh: "閒聊",
    example: { it: "Abbiamo chiacchierato per ore.", en: "We chatted for hours.", zh: "我們聊了幾個小時。" },
  },
  {
    kind: "phrase", it: "A domani", en: "Until tomorrow", zh: "明天見",
    example: { it: "Buonanotte, a domani!", en: "Goodnight, until tomorrow!", zh: "晚安，明天見！" },
  },
];

/** Day of the year, 1–366. Expects "YYYY-MM-DD". */
export function dayOfYear(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return 1;
  return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86_400_000);
}

/** The item for a given date. Same date in, same item out — always. */
export function pickForDate(iso: string, items: DailyItem[] = DAILY_ITEMS): DailyItem {
  if (!items.length) throw new Error("DAILY_ITEMS is empty");
  const [y] = iso.split("-").map(Number);
  // Offset by the year so the cycle doesn't line up identically every January.
  const i = (dayOfYear(iso) + (y || 0)) % items.length;
  return items[i];
}
