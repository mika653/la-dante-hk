"use client";
import { useState } from "react";
import { Check } from "lucide-react";

export default function ContactForm() {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div className="frame p-8 bg-sole-soft text-center">
        <span className="w-10 h-10 rounded-full bg-azzurro text-cream inline-flex items-center justify-center"><Check size={16} /></span>
        <h3 className="mt-3 text-xl font-semibold">多謝您，我們會盡快聯絡您。</h3>
        <p className="mt-2 text-sm text-ink-muted">示範模式 — 您的訊息並未真正發送。</p>
      </div>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="frame p-6 md:p-8 bg-white space-y-4">
      <h2 className="text-2xl font-semibold">給我們留言</h2>
      <label className="block text-sm font-medium">姓名<input required className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
      <label className="block text-sm font-medium">電郵<input required type="email" className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
      <label className="block text-sm font-medium">主題<select className="mt-1 w-full h-12 px-4 rounded-xl border border-line bg-white"><option>課程查詢</option><option>私人課堂</option><option>企業培訓</option><option>PLIDA 考試</option><option>會員</option><option>其他</option></select></label>
      <label className="block text-sm font-medium">訊息<textarea required rows={5} className="mt-1 w-full p-4 rounded-xl border border-line bg-white focus:outline-none focus:border-ink" /></label>
      <button type="submit" className="btn btn-primary w-full">發送訊息</button>
    </form>
  );
}
