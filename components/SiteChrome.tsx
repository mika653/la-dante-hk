"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import WhatsAppButton from "./WhatsAppButton";
import EntryPopup from "./EntryPopup";
import ViewSwitcher from "./ViewSwitcher";

// Renders on every public page, but:
//   - suppressed under /admin
//   - suppressed when loaded inside the preview iframe (?preview=1)
export default function SiteChrome() {
  const pathname = usePathname() || "";
  const [isPreview, setIsPreview] = useState(false);
  // The device-preview tool is DFB-internal — hidden from visitors, opened with
  // ?tools=1 for demos, so it never shows up as "PREVIEW" chrome on the real site.
  const [showTools, setShowTools] = useState(false);

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      setIsPreview(q.get("preview") === "1");
      setShowTools(q.get("tools") === "1");
    } catch {
      setIsPreview(false);
    }
  }, []);

  const staff = ["/admin", "/student", "/onboarding", "/leave", "/login", "/account"];
  if (staff.some((r) => pathname === r || pathname.startsWith(r + "/"))) return null;
  if (isPreview) return null;

  return (
    <>
      <EntryPopup />
      <WhatsAppButton />
      {showTools && <ViewSwitcher />}
    </>
  );
}
