"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot, User as UserIcon } from "lucide-react";

type Msg = { role: "bot" | "user"; text: string; cta?: { label: string; href: string }[] };

const greetings = [
  "Ciao! I&apos;m Dantina, the Dante HK chat helper. Ask me about courses, prices, PLIDA, or membership.",
];

// Very small rule-based responder — Phase 2 would swap this for an LLM with our knowledge base.
function respond(input: string): Msg {
  const q = input.toLowerCase();
  if (/level|placement|which class|beginner|advanced/.test(q)) {
    return { role: "bot", text: "The fastest way to find your level is our 5-minute placement test. Free, no sign-up.", cta: [{ label: "Take placement test", href: "/placement-test" }] };
  }
  if (/price|cost|fee|how much/.test(q)) {
    return { role: "bot", text: "Group Italian courses are HK$4,800 for 30 hours. Members get 10% off. Private is HK$750/hour in packages of 10.", cta: [{ label: "See all courses", href: "/courses" }] };
  }
  if (/plida|exam|certificate|certification/.test(q)) {
    return { role: "bot", text: "We&apos;re the official PLIDA centre for Hong Kong. Next exam: 14 June. Registration closes 10 May.", cta: [{ label: "PLIDA info", href: "/plida" }] };
  }
  if (/member|membership|perk|discount/.test(q)) {
    return { role: "bot", text: "Ordinary membership is HK$600/year — includes course discounts, library access, and 50+ partner perks across HK.", cta: [{ label: "Become a member", href: "/membership" }] };
  }
  if (/schedule|when|time|start|term/.test(q)) {
    return { role: "bot", text: "Our September–December term starts 7 September 2026. We also have January and May intakes. See available slots on the courses page.", cta: [{ label: "See schedule", href: "/courses/italian/adult-groups" }] };
  }
  if (/kid|child|teen|young/.test(q)) {
    return { role: "bot", text: "Piccoli Dante (7–10 yrs) and Ragazzi Dante (11–15 yrs) run Saturdays in Wanchai.", cta: [{ label: "Kids & teens", href: "/courses/italian/kids" }] };
  }
  if (/online|remote|zoom/.test(q)) {
    return { role: "bot", text: "Yes, we run live small-group Zoom classes in HK time zones with the same teachers and curriculum.", cta: [{ label: "Online courses", href: "/courses/italian/online" }] };
  }
  if (/private|1.on.1|tutor/.test(q)) {
    return { role: "bot", text: "Private lessons are fully flexible — your pace, your goals. Most students start with a 10-hour package.", cta: [{ label: "Private options", href: "/courses/italian/private" }] };
  }
  if (/corporate|team|company|business|office/.test(q)) {
    return { role: "bot", text: "We run bespoke corporate Italian packages with cultural briefing included. Send us your brief.", cta: [{ label: "Corporate details", href: "/courses/italian/corporate" }] };
  }
  if (/typhoon|rain|weather/.test(q)) {
    return { role: "bot", text: "T8 or Red rain = online or cancelled. You&apos;ll get an email + WhatsApp before class.", cta: [{ label: "Typhoon policy", href: "/bad-weather" }] };
  }
  if (/contact|email|phone|visit/.test(q)) {
    return { role: "bot", text: "We&apos;re at TC2, TCF, HK Arts Centre, 2 Harbour Road, Wan Chai. +852 2852 9788 · info@ladante.cc", cta: [{ label: "Contact us", href: "/contact" }] };
  }
  if (/ciao|hi|hello|hey/.test(q)) {
    return { role: "bot", text: "Ciao! How can I help — courses, prices, PLIDA, or membership?" };
  }
  return {
    role: "bot",
    text: "I&apos;m still learning. For the fastest answer, email info@ladante.cc or send a message from the contact page — a real human replies in under 24 hours.",
    cta: [{ label: "Contact us", href: "/contact" }, { label: "See courses", href: "/courses" }],
  };
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: greetings[0] }]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, open]);

  function send() {
    if (!input.trim()) return;
    const userMsg: Msg = { role: "user", text: input };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, respond(userMsg.text)]), 500);
  }

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-ink text-cream shadow-[var(--shadow-pop)] hover:scale-105 transition-transform flex items-center justify-center"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-sole border-2 border-cream" aria-hidden />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[380px] h-[500px] frame bg-white flex flex-col overflow-hidden animate-in">
          <header className="bg-ink text-cream p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-sole text-ink inline-flex items-center justify-center"><Bot size={18} aria-hidden /></span>
            <div>
              <p className="font-semibold leading-tight">Dantina</p>
              <p className="text-xs text-cream/80">Usually replies instantly · Demo bot</p>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center shrink-0 ${m.role === "bot" ? "bg-ink text-cream" : "bg-sole text-ink"}`}>
                  {m.role === "bot" ? <Bot size={14} aria-hidden /> : <UserIcon size={14} aria-hidden />}
                </span>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "bot" ? "bg-white border border-line" : "bg-ink text-cream"}`}>
                  <p dangerouslySetInnerHTML={{ __html: m.text }} />
                  {m.cta && m.cta.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.cta.map((c) => (
                        <a key={c.href} href={c.href} className="inline-block px-2.5 py-1 rounded-full bg-sole text-ink text-xs font-medium hover:bg-sole/80">{c.label}</a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-line flex gap-2 bg-white">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about courses, prices, PLIDA..." className="flex-1 h-11 px-4 rounded-full border border-line bg-white focus:outline-none focus:border-ink text-sm" />
            <button type="submit" aria-label="Send" className="w-11 h-11 rounded-full bg-ink text-cream inline-flex items-center justify-center disabled:opacity-40" disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
