import EditCourseClient from "./EditCourseClient";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditCourseClient id={id} />;
}
