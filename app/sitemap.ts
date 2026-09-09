import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chandpurnagorik.com";

  const routes = [
    {
      path: "",
      priority: 1.0,
    },
    {
      path: "/sheba",
      priority: 1.0,
    },
    {
      path: "/sheba/blood-bank",
      priority: 1.0,
    },
    {
      path: "/sheba/emergency",
      priority: 0.9,
    },
    {
      path: "/sheba/zilla-info",
      priority: 0.9,
    },
    {
      path: "/donation",
      priority: 0.9,
    },
    {
      path: "/about",
      priority: 0.7,
    },
    {
      path: "/contact",
      priority: 0.7,
    },
    {
      path: "/opinion",
      priority: 0.6,
    },
    {
      path: "/privacy",
      priority: 0.5,
    },
    {
      path: "/terms",
      priority: 0.5,
    },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  }));
}