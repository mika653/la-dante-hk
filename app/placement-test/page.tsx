import PageHeader from "@/components/PageHeader";
import TestClient from "./TestClient";

export const metadata = { title: "Placement test — La Dante HK" };

export default function PlacementTestPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free · 5 minutes · CEFR-aligned"
        title="Find your Italian level."
        subtitle="30 adaptive questions covering grammar, vocabulary, and reading. See your CEFR level instantly, with a recommended class to match."
        crumbs={[{ label: "Home", href: "/" }, { label: "Placement test" }]}
        tone="sole-soft"
      />
      <TestClient />
    </>
  );
}
