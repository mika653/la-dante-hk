"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChatBot from "./ChatBot";
import EntryPopup from "./EntryPopup";
import ViewSwitcher from "./ViewSwitcher";

// Renders on every public page, but:
//   - suppressed under /admin
//   - suppressed when loaded inside the preview iframe (?preview=1)
export default function SiteChrome() {
  const pathname = usePathname() || "";
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    try {
      setIsPreview(new URLSearchParams(window.location.search).get("preview") === "1");
    } catch {
      setIsPreview(false);
    }
  }, []);

  const staff = ["/admin", "/student", "/onboarding", "/leave", "/login"];
  if (staff.some((r) => pathname === r || pathname.startsWith(r + "/"))) return null;
  if (isPreview) return null;

  return (
    <>
      <EntryPopup />
      <ChatBot />
      <ViewSwitcher />
    </>
  );
}
