import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/news");

export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory);

  const posts = files.map((file) => {
    const slug = file.replace(".md", "");

    const fullPath = path.join(postsDirectory, file);
    const fileContent = fs.readFileSync(fullPath, "utf8");

    const { data } = matter(fileContent);

    return {
      slug,
      ...data,
    };
  });

  return posts;
}