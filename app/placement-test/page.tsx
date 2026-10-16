import PageHeader from "@/components/PageHeader";
import TestClient from "./TestClient";

export const metadata = { title: "Placement test — La Dante HK" };

export default function PlacementTestPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free · ~10 minutes · CEFR-aligned"
        title="Find your Italian level."
        subtitle="Answer questions that get progressively harder — stop when they feel too tough and submit. You'll get your level instantly, with a class to match."
        crumbs={[{ label: "Home", href: "/" }, { label: "Placement test" }]}
        tone="sole-soft"
      />
      <TestClient />
    </>
  );
}
