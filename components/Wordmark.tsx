"use client";
import Link from "next/link";
import Image from "next/image";
import { useBranding } from "@/lib/use-branding";

// Official Dante Alighieri Society Hong Kong logo — black wordmark with sky-blue circle.
// The logo image is admin-editable (Branding settings); it falls back to the
// bundled /logo.png until the saved value loads. On dark surfaces we wrap it in a
// cream "plaque" so it renders in its correct brand colors (no distorting filters).
export default function Wordmark({
  className = "",
  color = "ink",
  size = 32,
}: {
  className?: string;
  color?: "ink" | "cream";
  size?: number;
}) {
  const { logo } = useBranding();
  const inner = (
    <span className="relative block" style={{ height: size, width: size * 3.2 }}>
      <Image
        src={logo || "/logo.png"}
        alt="Società Dante Alighieri Hong Kong"
        fill
        priority
        sizes="240px"
        unoptimized={/^https?:\/\//.test(logo) && !logo.includes("/_next/")}
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
