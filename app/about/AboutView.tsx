// Shared renderer for the About page (/about and /zh/about). All copy and the
// mural image come from the editable About content (Admin → Content → About page).
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import TeamSlideshow from "@/components/TeamSlideshow";
import { RichText } from "@/components/RichText";
import { pickLocale } from "@/lib/site-content-shared";
import type { AboutContent, AboutTeamGroup, Bilingual } from "@/lib/about-content-shared";

type Locale = "en" | "zh";

const initials = (name: string) =>
  name
    .replace(/^(?:Dr|Prof)\.?\s+/i, "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function GroupIntro({ group, locale }: { group: AboutTeamGroup; locale: Locale }) {
  const heading = pickLocale(group.heading, locale);
  const sub = pickLocale(group.subheading, locale);
  return (
    <>
      {heading && <h3 className="font-heading font-bold text-2xl md:text-3xl text-balance">{heading}</h3>}
      {sub && <p className="mt-2 text-sm text-ink-muted">{sub}</p>}
    </>
  );
}

export default function AboutView({ content, locale }: { content: AboutContent; locale: Locale }) {
  const t = (b: Bilingual) => pickLocale(b, locale);
  const zh = locale === "zh";
  const { header, mural, history, team } = content;
  const showBoardAndTeachers = !zh || team.showBoardAndTeachersOnZh;
  // The Chinese page has no intro paragraph unless the office writes one in 繁中.
  const intro = zh ? team.intro.zh.trim() : team.intro.en;
  const everyone = [...team.board.members, ...team.staff.members, ...team.teachers.members].map((p) => p.name);

  return (
    <>
      <PageHeader
        eyebrow={t(header.eyebrow)}
        title={t(header.title)}
        subtitle={t(header.subtitle)}
        crumbs={zh ? [{ label: "主頁", href: "/zh" }, { label: "關於" }] : [{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Mural storytelling band */}
      <section className="relative bg-cream py-16 md:py-24">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow">{t(mural.eyebrow)}</p>
              <h2 className="mt-3 text-3xl md:text-5xl">{t(mural.title)}</h2>
              {mural.paragraphs.map((p, i) => (
                <p key={i} className={`${i === 0 ? "mt-5" : "mt-4"} text-ink-muted`}>
                  <RichText text={t(p)} />
                </p>
              ))}
            </div>
            {mural.image && (
              <div className="relative aspect-4/3 frame bg-white">
                <Image
                  src={mural.image}
                  alt={t(mural.imageAlt)}
                  fill
                  className="object-cover rounded-3xl"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  unoptimized={!mural.image.startsWith("/")}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="90-years" className="bg-white py-16 md:py-24 border-t border-line">
        <div className="container-xl">
          <p className="eyebrow">{t(history.eyebrow)}</p>
          <h2 className="mt-3 text-3xl md:text-5xl max-w-2xl">{t(history.title)}</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {history.milestones.map((m) => (
              <div key={m.id} className="frame p-6 bg-cream-2/50">
                <p className="font-heading font-extrabold text-3xl text-azzurro-deep">{m.year}</p>
                <h3 className="mt-1 font-semibold">{t(m.title)}</h3>
                <p className="mt-2 text-sm text-ink-muted"><RichText text={t(m.body)} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="bg-sole py-16 md:py-24">
        <div className="container-xl">
          <p className="eyebrow">{t(team.eyebrow)}</p>
          <h2 className={`mt-3 text-3xl md:text-5xl${zh ? "" : " text-balance"}`}>{t(team.title)}</h2>
          {intro && <p className="mt-4 max-w-2xl text-ink-muted">{intro}</p>}

          {/* Team photo slideshow (Admin → Content → Section photos); falls back to monogram circles. */}
          <TeamSlideshow names={zh ? [] : everyone} />

          {zh && !showBoardAndTeachers ? (
            // The Chinese page's original compact management grid.
            team.staff.members.length > 0 && (
              <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {team.staff.members.map((p) => (
                  <div key={p.id} className="text-center">
                    <div className="w-40 h-40 mx-auto rounded-full bg-ink text-cream font-heading font-extrabold text-5xl inline-flex items-center justify-center">{initials(p.name)}</div>
                    <p className="mt-4 font-semibold">{p.name}</p>
                    <p className="text-sm text-ink-muted">{t(p.role)}</p>
                  </div>
                ))}
              </div>
            )
          ) : (
            <>
              {/* 1. Board of Directors */}
              {team.board.members.length > 0 && (
                <div className="mt-16 pt-12 border-t border-ink/10">
                  <GroupIntro group={team.board} locale={locale} />
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {team.board.members.map((p) => (
                      <div key={p.id} className="text-center">
                        <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full bg-ink text-cream font-heading font-extrabold text-2xl md:text-3xl inline-flex items-center justify-center">{initials(p.name)}</div>
                        <p className="mt-4 font-semibold leading-tight text-balance">{p.name}</p>
                        <p className="text-sm text-ink-muted">{t(p.role)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Management & Administration */}
              {team.staff.members.length > 0 && (
                <div className="mt-16 pt-12 border-t border-ink/10">
                  <GroupIntro group={team.staff} locale={locale} />
                  <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                    {team.staff.members.map((p) => (
                      <div key={p.id} className="text-center">
                        <div className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full bg-azzurro-deep text-cream font-heading font-extrabold text-3xl md:text-4xl inline-flex items-center justify-center">{initials(p.name)}</div>
                        <p className="mt-4 font-semibold">{p.name}</p>
                        <p className="text-sm text-ink-muted">{t(p.role)}</p>
                        {p.email && <a href={`mailto:${p.email}`} className="text-xs text-azzurro-deep hover:underline break-all">{p.email}</a>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Teachers */}
              {team.teachers.members.length > 0 && (
                <div className="mt-16 pt-12 border-t border-ink/10">
                  <GroupIntro group={team.teachers} locale={locale} />
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
                    {team.teachers.members.map((p) => (
                      <div key={p.id} className="text-center">
                        <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full bg-azzurro text-ink font-heading font-extrabold text-2xl md:text-3xl inline-flex items-center justify-center">{initials(p.name)}</div>
                        <p className="mt-3 font-semibold text-sm">{p.name}</p>
                        <p className="text-xs text-ink-muted">{t(p.role)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
