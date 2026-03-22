// lib/news.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const newsDirectory = path.join(process.cwd(), "content", "news");

export function getSortedNewsData() {
  // ফোল্ডার থেকে ফাইলগুলোর নাম নেওয়া
  const fileNames = fs.readdirSync(newsDirectory);
  
  const allNewsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(newsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      ...(data as { date: string; title: string; category: string; author: string }),
    };
  });

  // তারিখ অনুযায়ী নিউজগুলো সাজানো (সবচেয়ে নতুনটা আগে)
  return allNewsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}