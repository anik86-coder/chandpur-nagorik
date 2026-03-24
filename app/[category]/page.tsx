import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/sidebar"; 

// ক্যাশ বন্ধ করার জন্য লাইনগুলো একবারই থাকবে
export const dynamic = "force-dynamic";
//export const revalidate = 0;

const categoryTitleMap: { [key: string]: string } = {
  national: "সারাদেশ ও জাতীয়", 
  chandpur: "চাঁদপুর",
  politics: "রাজনীতি",
  economy: "অর্থনীতি",
  sports: "ক্রীড়া",
  international: "আন্তর্জাতিক",
  technology: "টেকনোলজি",
  entertainment: "বিনোদন",
  education: "শিক্ষা",
  health: "স্বাস্থ্য",
  religion: "ধর্ম",
  probash: "প্রবাস",
  lifestyle: "লাইফস্টাইল",
  opinion: "মতামত",
};

// বাংলা নাম থেকে ইংরেজি লিংক চেক করার ম্যাপ
const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national",
  "জাতীয়": "national", 
  "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics",
  "অর্থনীতি": "economy",
  "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international",
  "টেকনোলজি": "technology",
  "বিনোদন": "entertainment",
  "শিক্ষা": "education",
  "স্বাস্থ্য": "health",
  "ধর্ম": "religion",
  "প্রবাস": "probash",
  "লাইফস্টাইল": "lifestyle",
  "মতামত": "opinion",
};

// ==========================================
// সাইডবারের নতুন আপডেট করা ফাংশন
// ==========================================
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
      date: data.date || "2026-01-01" 
    };
  });

  const latestNews = [...allNews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // আপনার নতুন ফোল্ডারের আসল নামগুলো দেওয়া হলো
  const popularFileNames = [
    "2531478593", 
    "chandpur-road",
    "launch-terminal",
    "2531478593",
    "chandpur-road"
  ]; 
  
  const popularNews = popularFileNames
    .map((name) => allNews.find((news) => news.slug === name))
    .filter(Boolean);

  return { popularNews, latestNews };
}

export default async function CategoryPage({ params }: any) {
  const { category } = await params; 
  const banglaTitle = categoryTitleMap[category] || category;
  const { popularNews, latestNews } = getSidebarNews();

  const postsDirectory = path.join(process.cwd(), "content", "news");
  let categoryNews: any[] = [];

  if (fs.existsSync(postsDirectory)) {
    const fileNames = fs.readdirSync(postsDirectory);
    const allNews = fileNames.map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || "শিরোনাম নেই",
        category: data.category || "অন্যান্য",
        categorySlug: reverseCategoryMap[data.category as string] || "national", 
        date: data.date || "2026-01-01",
        image: data.image || "/logo-1.png", 
      };
    });

    categoryNews = allNews
      .filter((news) => news.categorySlug === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-6 font-[Kalpurush]">
      
      <div className="border-b-2 border-red-600 mb-6 pb-2 inline-block">
        <h1 className="text-3xl font-bold text-gray-800">{banglaTitle}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 flex flex-col gap-6">
          {categoryNews.length > 0 ? (
            categoryNews.map((news, index) => (
              <Link 
                href={`/${news.categorySlug}/${news.slug}`} 
                key={index} 
                className="flex gap-4 group items-center border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="w-32 h-24 sm:w-40 sm:h-28 flex-shrink-0 overflow-hidden rounded-md relative bg-gray-100">
                  <Image 
                    src={news.image} 
                    alt={news.title} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
                    {news.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">{news.date}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-lg">এই ক্যাটাগরিতে এখনো কোনো খবর প্রকাশিত হয়নি।</p>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Sidebar popularNews={popularNews as any} latestNews={latestNews as any} />
          </div>
        </div>

      </div>
    </main>
  );
}