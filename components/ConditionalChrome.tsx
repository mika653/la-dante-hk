"use client";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";

export function ConditionalNav() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <AnnouncementBar />
      <Nav />
    </>
  );
}

export function ConditionalFooter() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin")) return null;
  return <Footer />;
}
