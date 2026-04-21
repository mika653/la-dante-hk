import Link from "next/link";
import { IconInstagram } from "./SocialIcons";

// Placeholder "posts" for the demo — swap with real IG Graph API feed in Phase 2.
const demoPosts = [
  { title: "Espresso masterclass",           tone: "bg-sole"           },
  { title: "Dante's Inferno bookclub",       tone: "bg-azzurro"        },
  { title: "Cooking with Nonna Maria",       tone: "bg-cream-2 border border-line" },
  { title: "A2 graduation day",              tone: "bg-azzurro-soft text-ink" },
  { title: "Wanchai aperitivo night",        tone: "bg-ink text-cream" },
  { title: "Venice trip with members",       tone: "bg-sole-soft"      },
];

export default function InstagramStrip() {
  return (
    <section className="bg-sole-soft py-16 md:py-24">
      <div className="container-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow inline-flex items-center gap-2"><IconInstagram size={14} /> @ladantehk</p>
            <h2 className="mt-3 text-3xl md:text-5xl">Italy, this week in HK.</h2>
          </div>
          <Link href="https://instagram.com/ladantehk" target="_blank" rel="noopener" className="btn btn-ghost self-start md:self-auto">Follow on Instagram</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {demoPosts.map((p, i) => (
            <div key={i} className={`aspect-square rounded-2xl ${p.tone} p-4 flex flex-col justify-between overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer`}>
              <span className="text-[11px] uppercase tracking-wider font-medium opacity-80">{i + 1} day{i === 0 ? "" : "s"} ago</span>
              <span className="text-sm font-medium leading-tight">{p.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
