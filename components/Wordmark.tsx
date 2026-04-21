import Link from "next/link";
import Image from "next/image";

// Official Dante Alighieri Society Hong Kong logo — black wordmark with sky-blue circle.
// On dark backgrounds we invert to a cream/white variant via CSS filter.
export default function Wordmark({
  className = "",
  color = "ink",
  size = 36,
}: {
  className?: string;
  color?: "ink" | "cream";
  size?: number;
}) {
  return (
    <Link href="/" aria-label="Società Dante Alighieri Hong Kong — home" className={`inline-flex items-center ${className}`}>
      <span className="relative block" style={{ height: size, width: size * 3.2 }}>
        <Image
          src="/logo.png"
          alt="Società Dante Alighieri Hong Kong"
          fill
          priority
          sizes="240px"
          className={`object-contain object-left ${color === "cream" ? "invert brightness-0 [filter:invert(98%)_sepia(5%)_saturate(300%)_hue-rotate(2deg)_brightness(105%)]" : ""}`}
        />
      </span>
    </Link>
  );
}
