import AboutView from "./AboutView";
import { getAboutContent } from "@/lib/about-content-actions";

// Content is edited in Admin → Content → About page; saving re-renders this
// page. The hourly revalidate is a safety net (e.g. a build without DB access).
export const revalidate = 3600;

export default async function About() {
  const content = await getAboutContent();
  return <AboutView content={content} locale="en" />;
}
