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

const SITE_NAME = "Società Dante Alighieri Hong Kong";
const DESCRIPTION =
  "The Dante Alighieri Society of Hong Kong — Italian and Latin language courses, cultural events, PLIDA certification, and membership in the heart of Wanchai since 1935.";
const OG_IMAGE = { url: "/mural.png", width: 2400, height: 1347, alt: "La Dante HK — where Hong Kong meets Italy" };

export const metadata: Metadata = {
  // Pages already set their own full titles (with the brand), so no template here
  // — this default just covers the home page and anything untitled.
  title: "La Dante HK — Italian & Latin in Hong Kong since 1935",
  description: DESCRIPTION,
  applicationName: "La Dante HK",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  // Until the site is flagged live, tell search engines not to index it.
  robots: SITE_LIVE ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "La Dante HK — Italian & Latin in Hong Kong since 1935",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_HK",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Dante HK — Italian & Latin in Hong Kong",
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

// schema.org structured data — one EducationalOrganization / LocalBusiness record.
// Helps Google show the school with its logo, address, hours, and social links
// (a "knowledge panel") rather than just a blue link.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  name: SITE_NAME,
  alternateName: "La Dante HK",
  description: DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/mural.png`,
  foundingDate: "1935",
  email: "dantealighieri@ladante.cc",
  telephone: "+852 2832 9799",
  areaServed: "Hong Kong",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Room 702, 7/F, Hong Kong Arts Centre, 2 Harbour Road",
    addressLocality: "Wan Chai",
    addressRegion: "Hong Kong",
    addressCountry: "HK",
  },
  sameAs: ["https://instagram.com/ladantehk"],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:30", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "17:00" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ConditionalNav />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
        <SiteChrome />
      </body>
    </html>
  );
}
