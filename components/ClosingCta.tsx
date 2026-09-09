"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useT, localizePath } from "@/lib/locale";

export default function ClosingCta() {
  const { t, locale } = useT();
  return (
    <section className="bg-ink text-cream py-12 md:py-14">
      <div className="container-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-heading font-bold">{locale === "zh" ? "你的意大利文之旅由此開始。" : "Your Italian journey starts here."}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={localizePath("/courses/italian/adult-groups", locale)} className="btn btn-primary">
            {t.hero.cta2} <ArrowRight size={16} />
          </Link>
          <Link href={localizePath("/placement-test", locale)} className="btn btn-outline-white">
            {t.hero.cta1}
          </Link>
        </div>
      </div>
    </section>
  );
}
