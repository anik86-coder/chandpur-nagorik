import fs from "fs";
import path from "path";
import matter from "gray-matter";
import FeaturedNews from "../components/featurednews";
import BigNewsCard from "../components/bignewscard";
import NewsCard from "../components/newscard";
import Sidebar from "../components/sidebar";

export const dynamic = "force-dynamic";

// ১৫টি ক্যাটাগরির লিংক ম্যাপ
const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national", "জাতীয়": "national", "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics", "অর্থনীতি": "economy", "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international", "টেকনোলজি": "technology",
  "বিনোদন": "entertainment", "শিক্ষা": "education", "স্বাস্থ্য": "health",
  "ধর্ম": "religion", "প্রবাস": "probash", "লাইফস্টাইল": "lifestyle", "মতামত": "opinion",
};

// ফোল্ডার থেকে ডাটা রিড করার মাস্টার ফাংশন
function getAllNewsData() {
  const postsDirectory = path.join(process.cwd(), "content", "news"); 
  
  if (!fs.existsSync(postsDirectory)) return { allNews: [], popularNews: [], latestNews: [] };

  const fileNames = fs.readdirSync(postsDirectory);
  const allNews = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // 🔥 এখানে 150 এর বদলে 450 করা হলো যাতে বড় খবরের জন্য পর্যাপ্ত টেক্সট আসে 🔥
    const excerptText = data.excerpt || content.replace(/(<([^>]+)>)/gi, "").substring(0, 450) + "...";

    return {
      slug,
      title: data.title || "শিরোনাম নেই",
      category: data.category || "সংবাদ",
      urlCategory: reverseCategoryMap[data.category as string] || "national",
      date: data.date || "2026-01-01",
      image: data.image || "https://res.cloudinary.com/dfzirugge/image/upload/v1774201294/Untitled-1_jcltqc.png",
      excerpt: excerptText
    };
  });

  // তারিখ অনুযায়ী সাজানো
  const sortedNews = [...allNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const latestNews = sortedNews.slice(0, 5);
  const popularNews = sortedNews.slice(0, 5); // আপাতত লেটেস্টগুলোকেই সাইডবারে পপুলার হিসেবে দেখাচ্ছি

  return { allNews: sortedNews, popularNews, latestNews };
}

export default function Home() {
  const { allNews, popularNews, latestNews } = getAllNewsData();

  // নাম দিয়ে খবর খোঁজার ফাংশন 
  const getPost = (fileName: string) => {
    return allNews.find(post => post.slug === fileName) || allNews[0];
  };

  // =========================================================================
  // 🔥 অনিক, আপনি শুধু এই জায়গাটিতে আপনার .md ফাইলের নামগুলো বসাবেন 🔥
  // =========================================================================

  // ১. সবচেয়ে বড় খবর (Featured - ১টি)
  const featuredFile = "2531478593"; 

  // ২. মাঝারি বড় খবর (Big News - ২টি)
  const bigNewsFile1 = "national-100002";
  const bigNewsFile2 = "politics-100003";

  // ৩. ছোট খবরের কার্ড (News Card - ৮টি)
  const newsCardFiles = [
    "economy-100004",
    "sports-100005",
    "international-100006",
    "technology-100007",
    "entertainment-100008",
    "education-100009",
    "health-100010",
    "chandpur-100001"
  ];

  // =========================================================================

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-6 font-[Kalpurush]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT CONTENT */}
        <div className="lg:col-span-3 flex flex-col">
          
          {/* Featured News */}
          <div>
            <FeaturedNews post={getPost(featuredFile)} />
          </div>

          {/* Big News */}
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <BigNewsCard post={getPost(bigNewsFile1)} />
            <BigNewsCard post={getPost(bigNewsFile2)} />
          </div>

          {/* News Card Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 border-t border-gray-300 pt-6">
            {newsCardFiles.map((fileName, index) => (
              <NewsCard key={`grid-news-${index}`} post={getPost(fileName)} />
            ))}
          </div>
          
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
             <Sidebar popularNews={popularNews as any} latestNews={latestNews as any} />
          </div>
        </div>

      </div>
    </main>
  );
}