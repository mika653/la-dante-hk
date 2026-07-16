import PageHeader from "@/components/PageHeader";
import LegalDoc from "@/components/LegalDoc";
import { privacySections } from "@/lib/legal-content";

export const metadata = { title: "Privacy policy — La Dante HK" };

export default function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy."
        subtitle="How the Dante Alighieri Society of Hong Kong collects, uses and protects your personal data under the PDPO."
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
      />
      <LegalDoc sections={privacySections} />
    </>
  );
}
