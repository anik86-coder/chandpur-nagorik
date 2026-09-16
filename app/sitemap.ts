import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chandpurnagorik.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    // নাগরিক সেবা
    {
      url: `${baseUrl}/sheba`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Blood Bank
    {
      url: `${baseUrl}/sheba/blood-bank`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/sheba/blood-bank/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Health
    {
      url: `${baseUrl}/sheba/health`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Hospitals
    {
      url: `${baseUrl}/sheba/health/hospitals`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Doctors
    {
      url: `${baseUrl}/sheba/health/doctors`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // Diagnostic
    {
      url: `${baseUrl}/sheba/health/diagnostic`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },

    // Ambulance
    {
      url: `${baseUrl}/sheba/health/ambulance`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}