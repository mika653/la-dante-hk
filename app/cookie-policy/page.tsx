import PageHeader from "@/components/PageHeader";
import LegalDoc from "@/components/LegalDoc";
import { cookieSections } from "@/lib/legal-content";

export const metadata = { title: "Cookie policy — La Dante HK" };

export default function CookiePolicy() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Cookie policy."
        subtitle="The cookies and similar technologies we use on this site, and how to manage them."
        crumbs={[{ label: "Home", href: "/" }, { label: "Cookie policy" }]}
      />
      <LegalDoc sections={cookieSections} />
    </>
  );
}
