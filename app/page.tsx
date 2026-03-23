import fs from "fs";
import path from "path";
import matter from "gray-matter";
import FeaturedNews from "../components/featurednews";
import BigNewsCard from "../components/bignewscard";
import NewsCard from "../components/newscard";
import Sidebar from "../components/sidebar";

// ক্যাশ বন্ধ করার জন্য এই লাইনটি যুক্ত করা হয়েছে
export const dynamic = "force-dynamic";

const demoPost = {
  slug: "chandpur-road",
  title: "চাঁদপুরে নতুন সড়ক উদ্বোধন",
  date: "2026-03-21",
  image: "https://res.cloudinary.com/dfzirugge/image/upload/v1774084245/3_u1xeqx.png",
};

// বাংলা নাম থেকে ইংরেজি লিংক বের করার ম্যাপ (লিংক ঠিক রাখার জন্য)
const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national",
  "জাতীয়": "national", 
  "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics",
  "অর্থনীতি": "economy",
  "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international",
  "টেকনোলজি": "technology",
};

// .md ফাইল থেকে ডাটা রিড করার ফাংশন
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
      categorySlug: reverseCategoryMap[data.category as string] || "national", // সাইডবারের লিংকের জন্য
      date: data.date || "2026-01-01",
    };
  });

  const latestNews = [...allNews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // আপনার নতুন ফোল্ডারের আসল নামগুলো দেওয়া হলো (গোপন নম্বরসহ)
  const popularFileNames = [
    "2531478593", 
    "chandpur-road",
    "launch-terminal",
    "2531478593",
    "chandpur-road"
  ];

  // ডাটা ফিল্টার করা
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