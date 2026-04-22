import PersonDetailClient from "./PersonDetailClient";

export default async function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PersonDetailClient id={id} />;
}
