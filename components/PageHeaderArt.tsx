"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PhotoMosaic from "@/components/PhotoMosaic";
import {
  useSiteContent, COLLAGE_BANNER_PAGES, PLAIN_BANNER_PAGES, defaultPageHeaderPhoto,
} from "@/lib/site-content";

// The right-hand art on the standard yellow landing-page banner (per Giulia):
//   • Italian Courses, Events, About → the homepage's tilted photo collage
//   • legal pages → nothing
//   • every other landing page → a circle picture frame with a page photo,
//     editable in Admin → Content → Section photos (placeholder until then).
export function bannerKind(path: string): "collage" | "circle" | "none" {
  if (COLLAGE_BANNER_PAGES.includes(path)) return "collage";
  if (PLAIN_BANNER_PAGES.includes(path)) return "none";
  return "circle";
}

export function englishPath(pathname: string): string {
  const p = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  return p.length > 1 ? p.replace(/\/$/, "") : p;
}

export default function PageHeaderArt() {
  const path = englishPath(usePathname() || "/");
  const { sectionPhotos, pageHeaders } = useSiteContent();
  const kind = bannerKind(path);

  if (kind === "none") return null;

  if (kind === "collage") {
    return (
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[46%] overflow-hidden" aria-hidden>
        <div className="absolute inset-0 flex items-center justify-end -mr-10">
          <PhotoMosaic rotate={-11} tile={150} images={sectionPhotos.mosaic} />
        </div>
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-sole to-transparent" />
      </div>
    );
  }

  const src = pageHeaders[path] || defaultPageHeaderPhoto(path);
  return (
    <div className="hidden lg:block absolute right-[6%] xl:right-[9%] top-1/2 -translate-y-1/2" aria-hidden>
      <div className="relative">
        <span className="absolute -top-3 -left-6 w-14 h-14 rounded-full bg-azzurro" />
        <span className="absolute -bottom-2 -right-3 w-8 h-8 rounded-full bg-white" />
        <div className="relative w-60 h-60 xl:w-72 xl:h-72 rounded-full overflow-hidden border-[6px] border-white shadow-[var(--shadow-pop)] bg-paper">
          <Image src={src} alt="" fill sizes="288px" unoptimized={src.startsWith("http")} className="object-cover" />
        </div>
      </div>
    </div>
  );
}
