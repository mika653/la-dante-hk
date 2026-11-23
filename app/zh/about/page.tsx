import AboutView from "@/app/about/AboutView";
import { getAboutContent } from "@/lib/about-content-actions";

// Content is edited in Admin → Content → About page (繁中 fields); saving
// re-renders this page. The hourly revalidate is a safety net.
export const revalidate = 3600;

export default async function AboutZh() {
  const content = await getAboutContent();
  return <AboutView content={content} locale="zh" />;
}
