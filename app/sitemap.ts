import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/about",
    "/branches",
    "/branches/mutare",
    "/branches/chipinge",
    "/rooms",
    "/gallery",
    "/contact",
    "/booking",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
