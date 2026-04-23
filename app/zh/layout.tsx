import type { Metadata } from "next";
import ZhPreviewBanner from "@/components/ZhPreviewBanner";

export const metadata: Metadata = {
  title: "但丁.阿利吉耶里協會 — 香港 · 1935",
  description: "香港但丁.阿利吉耶里協會。意大利文、拉丁文語言、文化與社群,始於 1935 年。",
};

export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ZhPreviewBanner />
      {children}
    </>
  );
}
