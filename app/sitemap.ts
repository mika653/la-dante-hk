import type { MetadataRoute } from "next";

import { SITE_URL } from "./layout";
const BASE = SITE_URL;

const pages = [
  "/", "/courses",
  "/courses/italian/adult-groups", "/courses/italian/private", "/courses/italian/kids", "/courses/italian/corporate", "/courses/italian/online",
  "/courses/latin", "/courses/latin/private", "/courses/latin/kids",
  "/courses/study-in-italy", "/courses/teacher-training",
  "/placement-test", "/membership", "/plida", "/culture", "/about", "/contact",
  "/services/translation", "/services/sponsorship",
  "/gift", "/merch", "/bad-weather", "/privacy", "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "/" ? "weekly" : "monthly",
    priority: p === "/" ? 1 : p.startsWith("/courses") ? 0.8 : 0.5,
  }));
}
