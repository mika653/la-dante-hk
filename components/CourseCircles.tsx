import CourseCircle from "./CourseCircle";

// Inline SVG "mini-scenes" evocative of each course type — no raster assets needed.
const iconGroup = (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <circle cx="26" cy="32" r="10" fill="currentColor" />
    <circle cx="54" cy="32" r="10" fill="currentColor" opacity="0.7" />
    <path d="M8 66 Q 26 50 40 58 Q 54 66 72 54 L 72 72 L 8 72 Z" fill="currentColor" opacity="0.85" />
  </svg>
);
const iconPrivate = (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <circle cx="40" cy="30" r="12" fill="currentColor" />
    <path d="M18 68 Q 40 50 62 68 L 62 72 L 18 72 Z" fill="currentColor" opacity="0.85" />
    <circle cx="62" cy="20" r="4" fill="currentColor" opacity="0.8" />
  </svg>
);
const iconLatin = (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <rect x="16" y="18" width="48" height="44" rx="4" fill="currentColor" opacity="0.9" />
    <path d="M22 30 h36 M22 40 h32 M22 50 h28" stroke="var(--color-cream)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.6" />
  </svg>
);
const iconCorporate = (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <rect x="12" y="28" width="18" height="36" fill="currentColor" opacity="0.85" />
    <rect x="34" y="18" width="18" height="46" fill="currentColor" />
    <rect x="56" y="34" width="16" height="30" fill="currentColor" opacity="0.75" />
    <circle cx="21" cy="22" r="3" fill="currentColor" opacity="0.6" />
  </svg>
);

export default function CourseCircles() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-xl text-center">
        <p className="eyebrow">Four ways to learn</p>
        <h2 className="mt-3 text-3xl md:text-5xl max-w-xl mx-auto">
          <span className="circle-accent-center">Find</span> your course.
        </h2>
        <p className="mt-4 text-ink-muted max-w-xl mx-auto">
          Whether you&apos;re starting from scratch or reading Dante in the original, there&apos;s a seat for you.
        </p>

        <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 max-w-5xl mx-auto">
          <CourseCircle tag="Most popular" label="Groups"   href="/courses/italian/adult-groups" tone="blue"   icon={iconGroup} />
          <CourseCircle tag="Flexible"     label="Private"  href="/courses/italian/private"      tone="cream"  icon={iconPrivate} />
          <CourseCircle tag="Classical"    label="Latin"    href="/courses/latin"                tone="yellow" icon={iconLatin} />
          <CourseCircle tag="For teams"    label="Corporate"href="/courses/italian/corporate"    tone="white"  icon={iconCorporate} />
        </div>
      </div>
    </section>
  );
}
