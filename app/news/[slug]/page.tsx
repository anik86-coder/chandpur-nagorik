import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ../ এর বদলে @/ ব্যবহার করা হলো (এটি Next.js এর ডিফল্ট এবং সবচেয়ে ভালো নিয়ম)
import FeaturedNews from "@/components/featurednews";
import BigNewsCard from "@/components/bignewscard";
import NewsCard from "@/components/newscard";
import Sidebar from "@/components/sidebar";
// ডেমো কার্ডগুলোর জন্য নতুন ডাটা সেট করা হলো
const demoPost = {
  slug: "2531478593", 
  categorySlug: "national", // কার্ডের লিংকের জন্য
  title: "একাত্তরের গণহত্যার স্বীকৃতির দাবিতে যুক্তরাষ্ট্রের কংগ্রেসে প্রস্তাব",
  date: "2026-03-23",
  image: "https://res.cloudinary.com/dfzirugge/image/upload/v1774201294/Untitled-1_jcltqc.png",
};

// বাংলা নাম থেকে ইংরেজি লিংক বের করার ম্যাপ
const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national",
  "জাতীয়": "national", 
  "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics",
  "অর্থনীতি": "economy",
  "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international",
  "টেকনোলজি": "technology",
};

function getSidebarNews() {
  const postsDirectory = path.join(process.cwd(), "content", "news"); 
  
  if (!fs.existsSync(postsDirectory)) return { popularNews: [], latestNews: [] };

  const fileNames = fs.readdirSync(postsDirectory);
  const allNews = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || "শিরোনাম নেই",
      category: data.category || "সংবাদ",
      categorySlug: reverseCategoryMap[data.category as string] || "national",
      date: data.date || "2026-01-01",
    };
  });

  const latestNews = [...allNews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const popularFileNames = [
    "2531478593", 
    "chandpur-road",
    "launch-terminal",
    "2531478593",
    "chandpur-road"
  ];

  const popularNews = popularFileNames
    .map((name) => allNews.find((news) => news.slug === name))
    .filter((news) => news !== undefined) as any[]; 

  return { popularNews, latestNews };
}

export default function Home() {
  const { popularNews, latestNews } = getSidebarNews();

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="grid grid-cols-4 gap-6">
        
        {/* LEFT CONTENT */}
        <div className="col-span-3">
          
          <FeaturedNews />

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <BigNewsCard />
            <BigNewsCard />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 border-t border-gray-300 pt-6">
            <NewsCard post={demoPost} />
            <NewsCard post={demoPost} />
            <NewsCard post={demoPost} />
            <NewsCard post={demoPost} />
            <NewsCard post={demoPost} />
            <NewsCard post={demoPost} />
            <NewsCard post={demoPost} />
            <NewsCard post={demoPost} />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="col-span-1">
          <Sidebar popularNews={popularNews as any} latestNews={latestNews as any} />
        </div>

      </div>
    </main>
  );
}