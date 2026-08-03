// Sourced from the Adult Groups Italian syllabus content supplied for the
// courses/italian/adult-groups page rebuild. Each CEFR macro level (A1–C2)
// breaks down into its own set of sub-levels (A1.1, A1.2, …) with outcomes
// and grammar notes in English and Traditional Chinese.

export const SUB_LEVELS: Record<string, string[]> = {
  A1: ["A1.1", "A1.2", "A1.3"],
  A2: ["A2.1", "A2.2", "A2.3", "A2.4"],
  B1: ["B1.1", "B1.2", "B1.3", "B1.4", "B1.5"],
  B2: ["B2.1", "B2.2", "B2.3", "B2.4", "B2.5"],
  C1: ["C1.1", "C1.2", "C1.3", "C1.4", "C1.5"],
  C2: ["C2.1", "C2.2", "C2.3", "C2.4", "C2.5"],
};

export type SubLevelInfo = {
  outcomes: string[];
  outcomesZh: string[];
  grammar: string;
  grammarZh: string;
};

export const subLevelSyllabus: Record<string, SubLevelInfo> = {
  "A1.1": {
    outcomes: [
      `Greet and introduce yourself and the others in formal and informal contexts`,
      `Order in a restaurant`,
      `Talk about activities and hobbies`,
    ],
    outcomesZh: [
      `在正式和非正式場合問候他人並介紹自己`,
      `在餐廳點單`,
      `談論一般活動和興趣愛好`,
    ],
    grammar: `alphabet, numbers and days, formal and informal communication, indicativo presente for regular and some irregular verbs, adverbs of frequency.`,
    grammarZh: `字母表，數字和星期，正式和非正式用語，規則動詞和不規則動詞的indicativo presente(陳述式現在時用法)，頻率副詞`,
  },
  "A1.2": {
    outcomes: [
      `Describe places and rooms`,
      `Talk about the daily routine and usual actions`,
      `Ask for and give directions`,
    ],
    outcomesZh: [
      `描述地點和房間`,
      `問路及指引方向`,
      `談論日常行程及活動`,
    ],
    grammar: `adjectives, compound prepositions, c'è / ci sono, prepositions of place, reflexive verbs`,
    grammarZh: `形容詞，複合介詞， c'è / ci sono (有)，地點的介詞搭配, reflexive verbs（反身動詞）`,
  },
  "A1.3": {
    outcomes: [
      `Talk about past events`,
      `Do grocery shopping, talk about food and traditional recipes`,
      `Describe your family and relatives`,
    ],
    outcomesZh: [
      `談論過去的事件`,
      `超級市場購物，食物以及傳統食譜`,
      `描述你的家庭和親屬`,
    ],
    grammar: `passato prossimo, direct pronouns, passato prossimo of reflexive verbs, impersonal form, possessive adjectives`,
    grammarZh: `passato prossimo（近過去式），direct pronouns（直接代詞），impersonal form（無人稱形式），possessive adjectives（所有格形容詞）`,
  },
  "A2.1": {
    outcomes: [
      `Do shopping: describe and buy clothes`,
      `Talk about your likes and preferences`,
      `Talk about your memories and describe past events`,
    ],
    outcomesZh: [
      `描述衣物特徵，學習購物指南`,
      `談論你的喜愛與偏好`,
      `談論你的回憶，描述過去的事件`,
    ],
    grammar: `indirect pronouns, imperfetto, imperfetto vs. passato prossimo (I)`,
    grammarZh: `indirect pronouns（間接代詞），imperfetto（未完成過去時），imperfetto vs. passato prossimo (I)`,
  },
  "A2.2": {
    outcomes: [
      `Give advice`,
      `Describe someone (physical appearance and personality)`,
      `Invite, accept and refuse`,
    ],
    outcomesZh: [
      `提出建議`,
      `描述他人的外貌特徵及性格特點`,
      `發出邀請，接受和拒絕提議`,
    ],
    grammar: `condizionale presente, stare + gerundio, relative pronouns`,
    grammarZh: `condizionale presente（條件式現在時）, stare + gerundio（正在），relative pronouns（關係代名詞）`,
  },
  "A2.3": {
    outcomes: [
      `Make polite requests`,
      `Express surprise, needs and opinions`,
      `Talk about health problems and suggest healthy lifestyle tips`,
    ],
    outcomesZh: [
      `提出禮貌的請求`,
      `表達驚喜，需求和意見`,
      `談論健康問題，提出健康生活小貼士`,
    ],
    grammar: `imperfetto vs. passato prossimo (II), informal and formal imperative form`,
    grammarZh: `imperfetto vs. passato prossimo (II), informal and formal imperative form（正式及非正式祈使句）`,
  },
  "A2.4": {
    outcomes: [
      `Talk about jobs, careers, and skills`,
      `Talk about the future`,
      `Describe a house`,
    ],
    outcomesZh: [
      `談論工作，職業以及專業技能`,
      `談論未來`,
      `描述房間擺設與佈置`,
    ],
    grammar: `future tense, hypothetical sentence (I), stare per, congiuntivo presente, conjunctions`,
    grammarZh: `future tense（將來式），hypothetical sentence (I)（假設句），stare per（將要/準備），congiuntivo presente（虛擬現在時），conjunctions（連詞）`,
  },
  "B1.1": {
    outcomes: [
      `Ask and express opinions`,
      `Make analogies`,
      `Complain`,
      `Express wishes and preferences`,
    ],
    outcomesZh: [
      `尋求並表達意見`,
      `學習類比的寫作手法`,
      `表達不滿與提出訴求`,
      `表達願望和偏好`,
    ],
    grammar: `trapassato prossimo, combined pronouns, past conditional, pronominal verbs`,
    grammarZh: `trapassato prossimo（近愈過去式），combined pronouns（複合代名詞），past conditional（過去條件式），pronominal verbs（反身動詞）`,
  },
  "B1.2": {
    outcomes: [
      `Describe a product`,
      `Debate and raise a complain about a service`,
      `Apologise`,
      `Make comparisons`,
      `Make phone calls`,
    ],
    outcomesZh: [
      `描述一件產品`,
      `對一項服務進行辯論並提出投訴`,
      `學習如何道歉`,
      `學習如何作比較`,
      `學習電話用語`,
    ],
    grammar: `Past subjunctive, adverbs ending with -mente, imperfetto subjunctive, reported speech (I)`,
    grammarZh: `Past subjunctive（過去時虛擬式），adverbs ending with -mente（以 -mente 結尾的副詞）, imperfetto subjunctive（過去未完成虛擬式），reported speech (I)（間接引語）`,
  },
  "B1.3": {
    outcomes: [
      `Express disagreement`,
      `Talk about books`,
      `Give advice`,
      `Express pro and cons and talk about statistics`,
    ],
    outcomesZh: [
      `表達不同於他人的意見`,
      `談論書籍`,
      `提出建議`,
      `表達優點和缺點並談論數據`,
    ],
    grammar: `Passive form with the verb essere and venire; Passato Remoto, Subjunctive with sebbene, nonostante, malgrado, benché`,
    grammarZh: `Passive form with the verb essere and venire（動詞essere和venire的被動語態），Passato Remoto（遠過去式），Subjunctive with sebbene, nonostante, malgrado, benché（儘管的虛擬式用法）`,
  },
  "B1.4": {
    outcomes: [
      `Learn Italian ironic expression`,
      `Talk about a trip`,
      `Express surprise`,
      `Talk about ourselves in specific situations`,
    ],
    outcomesZh: [
      `學習意大利文諷刺表達`,
      `討論旅游`,
      `學習如何表達驚喜`,
      `學習如何在特定場景談論我們自己`,
    ],
    grammar: `gerundio, Past conditional to express future in the past, hypothetical sentence (II)`,
    grammarZh: `gerundio（動名詞），Past conditional to express future in the past（使用條件過去式來表達對應過去的未來），hypothetical sentence (II)（假設句）`,
  },
  "B1.5": {
    outcomes: [
      `Ask information about places`,
      `Ask/provide explanation and information`,
      `Talk about your language learning experience`,
      `Make hypothesis in the past`,
    ],
    outcomesZh: [
      `詢問有關地點的信息`,
      `詢問/提供解釋和信息`,
      `談論你的語言學習經歷`,
      `提出關於過去的假設`,
    ],
    grammar: `indirect questions and reported speech in the past (II), passive form with the verb andare, Trapassato Subjunctive, Gerundio and infinito in the past, fixed expressions`,
    grammarZh: `indirect questions and reported speech in the past (II)（間接問句和間接引語），passive form with the verb andare（動詞andare的被動語態），Trapassato Subjunctive（虛擬式愈過去時），Gerundio and infinito in the past（有關過去的動名詞和不定詞），fixed expressions（固定搭配）`,
  },
  "B2.1": {
    outcomes: [
      `Talk about memories`,
      `Express preferences`,
      `Describe procedures and give instructions`,
    ],
    outcomesZh: [
      `談論往事回憶`,
      `表達喜愛偏好`,
      `描述步驟並提出指引`,
    ],
    grammar: `passato prossimo with double auxiliary, pronominal verbs, double relative pronouns, futuro anteriore, indefinite pronouns`,
    grammarZh: `passato prossimo with double auxiliary（雙重助動詞的近過去式用法），pronominal verbs（反身動詞），double relative pronouns（雙重關係代名詞），futuro anteriore（先未來式），indefinite pronouns（不定代名詞）`,
  },
  "B2.2": {
    outcomes: [
      `Give information and make formal request`,
      `Make statistics`,
      `Report a past event`,
      `Talk about your job`,
    ],
    outcomesZh: [
      `提供資訊並作出正式請求`,
      `進行統計`,
      `匯報過去的事件`,
      `談論你的工作`,
    ],
    grammar: `time expressions, reported speech (III), conditional to express uncertain facts, relative superlative with congiuntivo, gerundio to express the cause and hypothesis`,
    grammarZh: `時間表達，reported speech (III)（間接引語），conditional to express uncertain facts（使用conditional表達不確定性），relative superlative with congiuntivo（最高級的虛擬式用法），gerundio to express the cause and hypothesis（使用動名詞表達原因和假設）`,
  },
  "B2.3": {
    outcomes: [
      `Express your feelings`,
      `Talk about yourself and describe physical characteristics`,
      `Write a movie review`,
      `Criticize`,
    ],
    outcomesZh: [
      `表達你的感受`,
      `介紹你自己以及描述你的身體特徵`,
      `對事物作出評論`,
      `對事物進行評判`,
    ],
    grammar: `pronominal verbs, contrary of nouns and adjectives, Purché/ Come se/ Senza che + congiuntivo, Fare + infinito`,
    grammarZh: `pronominal verbs（反身動詞）， contrary of nouns and adjectives（名詞和形容詞的反義詞），Purché/ Come se/ Senza che + congiuntivo（Purché/ Come se/ Senza che的虛擬式用法）, Fare + infinito（動詞Fare和其他不定詞的搭配）`,
  },
  "B2.4": {
    outcomes: [
      `Describe a picture/a painting`,
      `Make wishes`,
      `Make evaluations and proposals`,
    ],
    outcomesZh: [
      `描述一張照片/一幅畫`,
      `許下願望`,
      `作出評估和提議`,
    ],
    grammar: `relative pronouns, adverbs and pronouns position, more functions of future tenses`,
    grammarZh: `relative pronouns（關係代名詞），adverbs and pronouns position（副詞和代詞的語序），more functions of future tenses（將來時的更多用途）`,
  },
  "B2.5": {
    outcomes: [
      `Express doubts`,
      `Talk about cultural events`,
      `Make compliments`,
      `Arguing`,
    ],
    outcomesZh: [
      `表達疑惑`,
      `談論文化活動`,
      `對他人表達讚賞`,
      `學習如何爭辯`,
    ],
    grammar: `gerundio (present and past), expressions like a dirla tutta, sbrigarsela da soli, arrampicarsi sugli specchi, homonyms, subjunctive and comparatives, in modo che/far sì che + congiuntivo, comparative of equality, colloquial expressions`,
    grammarZh: `gerundio (present and past)（動名詞的現在時和過去時）， expressions like a dirla tutta, sbrigarsela da soli, arrampicarsi sugli specchi（各種特定表達），homonyms（同音異義詞）, subjunctive and comparatives（虛擬式和比較級），in modo che/far sì che + congiuntivo（in modo che/far sì che的虛擬式用法），comparative of equality（比較相等分量），colloquial expressions（口語表達）`,
  },
  "C1.1": {
    outcomes: [
      `Communicate with a colloquial register`,
      `Express complex opinions`,
      `Understand Latin expressions still in use`,
      `Make contradictions`,
      `Understand contemporary literature`,
    ],
    outcomesZh: [
      `以口語語域進行交流`,
      `表達複雜的意見`,
      `了解仍在使用的拉丁文表達方式`,
      `學習如何反對`,
      `了解當代文學`,
    ],
    grammar: `the superlative with arci-, stra-, super-, iper-, consolidation of future tenses, dislocation and subjunctive, cleft sentence, trapassato remoto`,
    grammarZh: `the superlative with arci-, stra-, super-, iper-（以 arci-, stra-, super-, iper- 開頭的最高級），consolidation of future tenses（將來時鞏固學習），dislocation and subjunctive（錯位和虛擬語氣），cleft sentence（分裂句），trapassato remoto（遠愈過去時）`,
  },
  "C1.2": {
    outcomes: [
      `Talk about sports`,
      `Recognize regional variants of the Italian language`,
      `Use sophisticated adjectives to describe persons, places, or things`,
    ],
    outcomesZh: [
      `談論體育`,
      `學習意大利不同地區的語言差異`,
      `使用高級的形容詞描述人事物`,
    ],
    grammar: `verbi difettivi, regional uses of essere, stare, avere, tenere, consolidation of present and past participle`,
    grammarZh: `verbi difettivi（不完全變化動詞），regional uses of essere, stare, avere, tenere（essere, stare, avere, tenere在不同地區的使用），consolidation of present and past participle（現在分詞和過去分詞的鞏固學習）`,
  },
  "C1.3": {
    outcomes: [
      `Better express regrets, make complains about past, present and future events`,
      `Learn incorrect forms used in the everyday Italian language`,
      `Use wordplays`,
    ],
    outcomesZh: [
      `學習如何更好地表達後悔，以及對過去，現在和未來的事抱怨`,
      `學習日常用語中常見的錯誤用法`,
      `學習文字游戲`,
    ],
    grammar: `express posteriority with futuro and condizionale, "che" polivalente, double relative pronouns chi e quanto, false hypothetical sentences`,
    grammarZh: `express posteriority with futuro and condizionale（用futuro和condizionale表達後驗性），"che" polivalente（"che"的多種用途），double relative pronouns chi e quanto（雙重關係代名詞"chi" 和"quanto"），false hypothetical sentences（非現實性假設句）`,
  },
  "C1.4": {
    outcomes: [
      `Enrich the speech with idiomatic expressions`,
      `Describe people`,
      `Describe music genre`,
      `Emphasize`,
    ],
    outcomesZh: [
      `學習慣用表達來豐富你的説話能力`,
      `描述他人`,
      `描述音樂種類`,
      `學習如何强調和突出你的想法`,
    ],
    grammar: `consolidation of gerundio and infinito, the adverb addirittura`,
    grammarZh: `consolidation of gerundio and infinito（gerundio 和 infinito 的鞏固學習），副詞addirittura`,
  },
  "C1.5": {
    outcomes: [
      `Be redundant`,
      `Comment statistics`,
      `Use neologisms`,
      `Talk about your language learning`,
    ],
    outcomesZh: [
      `認識語言冗餘`,
      `進行數據評論`,
      `使用新詞新語`,
      `談論你的語言學習經歷`,
    ],
    grammar: `"non" pleonastico, expressions like non so…ma anche, Non è che…però, superlatives and idioms, imperative and reported speech`,
    grammarZh: `"non" pleonastico（"non"的贅用情況），expressions like non so…ma anche, Non è che…però（常用表達方式如non so…ma anche, Non è che…però），superlatives and idioms（最高級和慣用語），imperative and reported speech（祈使語氣和間接引語）`,
  },
  "C2.1": {
    outcomes: [
      `Talk about the relation between your own country and the rest of the world`,
      `Learn new idiomatic expression`,
      `Summarize`,
      `Talk about science`,
      `Switch from oral to written texts`,
    ],
    outcomesZh: [
      `談論自己國家與世界其他國家的關係`,
      `學習新的慣用表達方式`,
      `學習如何歸納總結`,
      `談論科學`,
      `從口語轉換到書面語`,
    ],
    grammar: `foreign loans, suffix -filia /prefix pseudo-, the false negation, analogies`,
    grammarZh: `借詞，後綴-filia / 前綴pseudo-，the false negation, analogies（類比）`,
  },
  "C2.2": {
    outcomes: [
      `Recognize a fake news`,
      `Learn how to read newspaper and social media language`,
      `Talk about literature`,
    ],
    outcomesZh: [
      `識別虛假新聞`,
      `學習閲讀報紙，以及社交媒體術語`,
      `談論文學作品`,
    ],
    grammar: `polysemy, other uses of condizionale, imperfetto for storytelling, web Neologisms`,
    grammarZh: `一詞多義，condizionale的其他用法，用imperfetto講故事，網絡新詞`,
  },
  "C2.3": {
    outcomes: [
      `Understand different senses of humour`,
      `Understand figurative meanings`,
      `Take notes`,
    ],
    outcomesZh: [
      `理解不同的幽默感`,
      `學習比喻句`,
      `學習如何做筆記`,
    ],
    grammar: `adverbs: pure, anzi, linkers, adjectives' intensification`,
    grammarZh: `副詞pure和anzi，linkers，adjectives' intensification（强調成分-形容詞）`,
  },
  "C2.4": {
    outcomes: [
      `Tell stories`,
      `Understand legal texts`,
    ],
    outcomesZh: [
      `學習如何講故事`,
      `理解法律文本`,
    ],
    grammar: `nouns replication, la frase incidentale, conjunctions: nonostante and malgrado, subordinate implicite, vowels pronunciation`,
    grammarZh: `nouns replication，la frase incidentale，連詞 nonostante 和 malgrado，subordinate implicite（隱性從句），vowels pronunciation（元音發音）`,
  },
  "C2.5": {
    outcomes: [
      `Use euphemisms`,
      `Understand medical prescriptions`,
      `Describe your lifestyle and food habits`,
      `Understand different Italian regional accents`,
    ],
    outcomesZh: [
      `學習如何使用委婉語`,
      `理解醫生處方`,
      `描述你的生活方式和飲食習慣`,
      `理解意大利不同地區的口音`,
    ],
    grammar: `italian phrasal verbs, double negation, litotes, the suffix -fobia, Greek and Latin prefixes, geo synonyms`,
    grammarZh: `Italian phrasal verbs（片語動詞），double negation（雙重否定句），litotes（反叙法），後綴 -fobia，Greek and Latin prefixes（希臘文和拉丁文的前綴），geo synonyms`,
  },
};
