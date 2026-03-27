import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national", "জাতীয়": "national", "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics", "অর্থনীতি": "economy", "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international", "টেকনোলজি": "technology",
  "বিনোদন": "entertainment", "শিক্ষা": "education", "স্বাস্থ্য": "health",
  "ধর্ম": "religion", "প্রবাস": "probash", "লাইফস্টাইল": "lifestyle", "মতামত": "opinion",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chandpurnagorik.com";

  // ১. ওয়েবসাইটের স্ট্যাটিক পেজগুলো
  const staticRoutes = [
    "",
    "/about",
    "/privacy",
    "/terms",
    "/opinion",
    "/donation"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // ২. ডাইনামিক খবরের পেজগুলো (.md ফাইল থেকে)
  const postsDirectory = path.join(process.cwd(), "content", "news");
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  if (fs.existsSync(postsDirectory)) {
    const fileNames = fs.readdirSync(postsDirectory);
    dynamicRoutes = fileNames.map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fileContents = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
      const { data } = matter(fileContents);
      
      const category = data.category || "সারাদেশ";
      const urlCategory = reverseCategoryMap[category] || "national";

      return {
        url: `${baseUrl}/${urlCategory}/${slug}`,
        // খবরের ডেট থাকলে সেটা নেবে, না থাকলে আজকের ডেট
        lastModified: data.date ? new Date(data.date) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      };
    });
  }

  // স্ট্যাটিক এবং ডাইনামিক রাউট একসাথে রিটার্ন করা
  return [...staticRoutes, ...dynamicRoutes];
}