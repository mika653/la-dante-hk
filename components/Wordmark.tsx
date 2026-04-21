import Link from "next/link";
import Image from "next/image";

// Official Dante Alighieri Society Hong Kong logo — black wordmark with sky-blue circle.
// The logo is designed for light surfaces. On dark surfaces we wrap it in a cream
// "plaque" so it renders in its correct brand colors (no filters that distort the blue).
export default function Wordmark({
  className = "",
  color = "ink",
  size = 32,
}: {
  className?: string;
  color?: "ink" | "cream";
  size?: number;
}) {
  const inner = (
    <span className="relative block" style={{ height: size, width: size * 3.2 }}>
      <Image
        src="/logo.png"
        alt="Società Dante Alighieri Hong Kong"
        fill
        priority
        sizes="240px"
        className="object-contain object-left"
      />
    </span>
  );

  // On dark backgrounds: wrap in a cream plaque so the logo keeps its blue circle
  if (color === "cream") {
    return (
      <Link
        href="/"
        aria-label="Società Dante Alighieri Hong Kong — home"
        className={`inline-flex items-center bg-cream rounded-xl px-3 py-2 ${className}`}
      >
        {inner}
      </Link>
    );
  }

  // On light backgrounds: logo as-is
  return (
    <Link
      href="/"
      aria-label="Società Dante Alighieri Hong Kong — home"
      className={`inline-flex items-center ${className}`}
    >
      {inner}
    </Link>
  );
}
