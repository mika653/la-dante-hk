import SubLessonDetailClient from "./SubLessonDetailClient";

export default async function SubLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubLessonDetailClient id={id} />;
}
