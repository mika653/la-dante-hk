"use client";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";

const STAFF_ROUTES = ["/admin", "/student", "/onboarding", "/leave", "/login", "/account"];
const isStaffRoute = (p: string) => STAFF_ROUTES.some((r) => p === r || p.startsWith(r + "/"));

export function ConditionalNav() {
  const pathname = usePathname() || "";
  if (isStaffRoute(pathname)) return null;
  return (
    <>
      <AnnouncementBar />
      <Nav />
    </>
  );
}

export function ConditionalFooter() {
  const pathname = usePathname() || "";
  if (isStaffRoute(pathname)) return null;
  return <Footer />;
}
