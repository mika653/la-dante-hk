"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";

// Small dismissible cookie notice in the bottom-left corner (per Giulia).
// Consent is remembered in localStorage, so it shows once and stays gone.
export const COOKIE_CONSENT_KEY = "ladante-cookie-consent";

export default function CookieNotice() {
  const { locale } = useT();
  const isZh = locale === "zh";
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { if (localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted") return; } catch {}
    const tm = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(tm);
  }, []);

  function accept() {
    setShow(false);
    try { localStorage.setItem(COOKIE_CONSENT_KEY, "accepted"); } catch {}
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-[300px] sm:w-[330px] animate-in" role="dialog" aria-label={isZh ? "Cookie 通知" : "Cookie notice"}>
      <div className="relative frame bg-white p-4 pr-8 shadow-[var(--shadow-pop)]">
        <button type="button" onClick={accept} aria-label={isZh ? "關閉" : "Close"} className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-ink/10 inline-flex items-center justify-center text-ink-muted">
          <X size={14} />
        </button>
        <p className="flex items-start gap-2 text-[13px] text-ink-muted leading-relaxed">
          <Cookie size={16} className="text-azzurro-deep shrink-0 mt-0.5" aria-hidden />
          <span>
            {isZh ? (
              <>本網站使用 Cookie 以提供更佳的瀏覽體驗。詳情請參閱我們的{" "}
                <Link href={localizePath("/cookie-policy", locale)} className="text-azzurro-deep underline hover:no-underline">Cookie 政策</Link>。</>
            ) : (
              <>We use cookies to give you a better browsing experience. See our{" "}
                <Link href={localizePath("/cookie-policy", locale)} className="text-azzurro-deep underline hover:no-underline">Cookie Policy</Link>.</>
            )}
          </span>
        </p>
        <div className="mt-3 flex justify-end">
          <button type="button" onClick={accept} className="btn btn-primary text-xs py-1.5!">
            {isZh ? "接受" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}
