import PageHeader from "@/components/PageHeader";
import WorkshopsGrid from "@/components/WorkshopsGrid";
import CultureEventsClient from "./CultureEventsClient";

export default function Culture() {
  return (
    <>
      <PageHeader
        eyebrow="Culture"
        title="Events, workshops, library."
        subtitle="Italy beyond the textbook. Screenings, aperitivi, bookclubs, and workshops — open to members and non-members."
        crumbs={[{ label: "Home", href: "/" }, { label: "Culture" }]}
      />
      <CultureEventsClient />
      <WorkshopsGrid />
    </>
  );
}
