
import type { MetadataRoute } from "next";

const baseUrl = "https://chandpurnagorik.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    {
      path: "",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      path: "/sheba",
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      path: "/sheba/blood-bank",
      changeFrequency: "daily" as const,
      priority: 0.95,
    },
    {
      path: "/sheba/blood-bank/register",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      path: "/sheba/health",
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      path: "/sheba/health/hospitals",
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      path: "/sheba/health/doctors",
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      path: "/sheba/health/diagnostic",
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      path: "/sheba/health/ambulance",
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page.path || "/"}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
