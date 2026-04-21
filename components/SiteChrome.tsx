"use client";
import { usePathname } from "next/navigation";
import ChatBot from "./ChatBot";
import EntryPopup from "./EntryPopup";

// Everything here is rendered once in the root layout but suppressed on /admin pages.
export default function SiteChrome() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <EntryPopup />
      <ChatBot />
    </>
  );
}
