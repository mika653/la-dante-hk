import type { Metadata } from "next";
import { League_Spartan, Poppins } from "next/font/google";
import "./globals.css";
import { ConditionalNav, ConditionalFooter } from "@/components/ConditionalChrome";
import SiteChrome from "@/components/SiteChrome";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Base URL and search indexing are env-driven so staging stays out of Google.
// At go-live on the real domain, set NEXT_PUBLIC_SITE_URL=https://ladante.cc and
// NEXT_PUBLIC_SITE_LIVE=true in Vercel — nothing else needs to change.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://la-dante-hk.vercel.app";
export const SITE_LIVE = process.env.NEXT_PUBLIC_SITE_LIVE === "true";

export const metadata: Metadata = {
  title: "La Dante HK — Italian & Latin in Hong Kong since 1935",
  description:
    "Dante Alighieri Society of Hong Kong. Italian and Latin language courses, cultural events, PLIDA certification, and membership in the heart of Wanchai.",
  metadataBase: new URL(SITE_URL),
  // Until the site is flagged live, tell search engines not to index it.
  robots: SITE_LIVE ? undefined : { index: false, follow: false },
  openGraph: {
    title: "La Dante HK",
    description: "Italian & Latin in Hong Kong since 1935.",
    images: ["/mural.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <ConditionalNav />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
        <SiteChrome />
      </body>
    </html>
  );
}
