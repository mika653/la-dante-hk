"use client";
import CourseListView from "./CourseListView";
import { useCourses } from "@/lib/use-courses";
import type { Language, CourseType, Course } from "@/lib/data";

type Props = {
  language?: Language;
  type?: CourseType;
  location?: Course["location"];
  emptyMessage?: string;
};

export default function CourseListClient({ language, type, location, emptyMessage }: Props) {
  const all = useCourses();
  const filtered = all.filter((c) => {
    if (language && c.language !== language) return false;
    if (type && c.type !== type) return false;
    if (location && c.location !== location) return false;
    return true;
  });
  return <CourseListView courses={filtered} emptyMessage={emptyMessage} />;
}
