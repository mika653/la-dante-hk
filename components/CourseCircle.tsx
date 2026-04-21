import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Props = {
  label: string;
  tag: string;
  href: string;
  tone: "yellow" | "blue" | "cream" | "white";
  icon: React.ReactNode;
};

const toneBg = {
  yellow: "bg-sole text-ink",
  blue:   "bg-ink text-cream",
  cream:  "bg-azzurro text-ink",
  white:  "bg-white text-ink border border-line",
};

export default function CourseCircle({ label, tag, href, tone, icon }: Props) {
  return (
    <Link href={href} className="group flex flex-col items-center text-center">
      <div className={`w-32 h-32 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full ${toneBg[tone]} shadow-[var(--shadow-card)] group-hover:shadow-[var(--shadow-pop)] transition-all duration-300 flex items-center justify-center group-hover:scale-[1.04]`}>
        <div className="w-16 h-16 md:w-20 md:h-20">{icon}</div>
      </div>
      <p className="eyebrow mt-4 !text-ink-muted group-hover:!text-ink">{tag}</p>
      <h3 className="mt-1.5 text-lg md:text-xl font-semibold inline-flex items-center gap-1.5 group-hover:text-azzurro-deep">
        {label} <ArrowUpRight size={16} className="opacity-60" aria-hidden />
      </h3>
    </Link>
  );
}
