import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import FeaturedNews from "../components/featurednews";
import BigNewsCard from "../components/bignewscard";
import NewsCard from "../components/newscard";
import Sidebar from "../components/sidebar";

export const dynamic = "force-dynamic";

const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national", "জাতীয়": "national", "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics", "অর্থনীতি": "economy", "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international", "টেকনোলজি": "technology",
  "বিনোদন": "entertainment", "শিক্ষা": "education", "স্বাস্থ্য": "health",
  "ধর্ম": "religion", "প্রবাস": "probash", "লাইফস্টাইল": "lifestyle", "মতামত": "opinion",
};

function getAllNewsData() {
  const postsDirectory = path.join(process.cwd(), "content", "news"); 
  if (!fs.existsSync(postsDirectory)) return { allNews: [], popularNews: [], latestNews: [] };

  const fileNames = fs.readdirSync(postsDirectory);
  const allNews = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const { data, content } = matter(fs.readFileSync(path.join(postsDirectory, fileName), "utf8"));
    return {
      slug,
      title: data.title || "শিরোনাম নেই",
      category: data.category || "সংবাদ",
      urlCategory: reverseCategoryMap[data.category as string] || "national",
      date: data.date || "2026-01-01",
      image: data.image || "https://res.cloudinary.com/dfzirugge/image/upload/v1774201294/Untitled-1_jcltqc.png",
      excerpt: data.excerpt || content.replace(/(<([^>]+)>)/gi, "").substring(0, 450) + "..."
    };
  });

  const sorted = [...allNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { allNews: sorted, latestNews: sorted.slice(0, 5), popularNews: sorted.slice(0, 5) };
}

export default function Home() {
  const { allNews, popularNews, latestNews } = getAllNewsData();
  const getPost = (fileName: string) => allNews.find(p => p.slug === fileName) || allNews[0];

  const featuredFile = "2531478593"; 
  const bigNewsFiles = ["national-100002", "politics-100003"];
  const newsCardFiles = ["economy-100004", "sports-100005", "international-100006", "technology-100007", "entertainment-100008", "education-100009"];
  
  // =====================================================================
  // আপনার ম্যানুয়াল ৫টি শীর্ষ সংবাদের লিস্ট (এখানে নামগুলো পরিবর্তন করবেন)
  // =====================================================================
  const topHighlightFiles = [
    "2531478593",       // ১ নম্বর খবর
    "chandpur-road",    // ২ নম্বর খবর 
    "launch-terminal",  // ৩ নম্বর খবর
    "2531478593",       // ৪ নম্বর খবর (৫টা পূরণের জন্য ডেমো দিলাম, আসল নাম বসাবেন)
    "technology-100007"     // ৫ নম্বর খবর (৫টা পূরণের জন্য ডেমো দিলাম, আসল নাম বসাবেন)
  ];
  
  // ফাইলগুলো খুঁজে বের করা হচ্ছে
  const topHighlightNews = topHighlightFiles
    .map(fileName => allNews.find(post => post.slug === fileName))
    .filter(Boolean) as any[]; // ভুল নাম দিলে সাইট ক্র্যাশ করবে না
    
  const nationalNews = allNews.filter(post => post.urlCategory === "national").slice(0, 5);

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-6 font-[Kalpurush]">
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* ===================================================================== */}
        {/* বাম দিকের কন্টেন্ট (Span 3) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-3 flex flex-col">
          
          <FeaturedNews post={getPost(featuredFile)} />
          
          <div className="grid md:grid-cols-2 mt-8 mb-4 border-y border-gray-300 py-6">
            <div className="relative md:pr-6 mb-6 md:mb-0">
              <BigNewsCard post={getPost(bigNewsFiles[0])} />
              <div className="hidden md:block absolute right-0 top-2 bottom-2 w-px bg-gray-200"></div>
            </div>
            <div className="md:pl-6"><BigNewsCard post={getPost(bigNewsFiles[1])} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {newsCardFiles.map((f, i) => (
              <div key={i} className={`relative px-2 py-5 md:px-5 ${i < 3 ? "border-b border-gray-200" : ""}`}>
                <NewsCard post={getPost(f)} />
                {(i + 1) % 3 !== 0 && <div className="hidden md:block absolute right-0 top-3 bottom-3 w-px bg-gray-200"></div>}
              </div>
            ))}
          </div>

          {/* ===================================================================== */}
          {/* ২. নতুন শীর্ষ সংবাদ সেকশন (ম্যানুয়াল ডাটা) */}
          {/* ===================================================================== */}
          {topHighlightNews.length > 0 && (
            <div className="mt-4 mb-0 bg-[#f4f5f7] border border-gray-200">
              <div className="bg-[#116cb4] text-white text-center py-2 px-4 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold">শীর্ষ সংবাদ</h2>
              </div>
              <div className="p-4 flex overflow-x-auto lg:grid lg:grid-cols-5 gap-4 sm:gap-6 [&::-webkit-scrollbar]:hidden">
                {topHighlightNews.map((post, i) => (
                  <Link 
                    href={`/${post.urlCategory}/${post.slug}`} 
                    key={i} 
                    className="flex flex-col group min-w-[160px] lg:min-w-0"
                  >
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-[100px] md:h-[110px] object-cover mb-2 border border-gray-300" 
                    />
                    <span className="text-[#116cb4] text-[13px] font-bold mb-1">{post.category}</span>
                    <h3 className="text-gray-900 font-bold text-[15px] leading-snug group-hover:text-red-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* ৩. সারাদেশ ও জাতীয় সেকশন */}
          {/* ===================================================================== */}
          {nationalNews.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-300">
              <div className="mb-6 border-b border-gray-300 pb-2">
                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-[#116cb4] pl-3">
                  সারাদেশ ও জাতীয়
                </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-8 group cursor-pointer items-stretch">
                <div className="w-full md:w-[55%]">
                  <Link href={`/${nationalNews[0].urlCategory}/${nationalNews[0].slug}`}>
                    <img 
                      src={nationalNews[0].image} 
                      alt={nationalNews[0].title} 
                      className="w-full h-[220px] md:h-[280px] object-cover rounded shadow-sm" 
                    />
                  </Link>
                </div>
                <div className="w-full md:w-[45%] flex flex-col py-1">
                  <Link href={`/${nationalNews[0].urlCategory}/${nationalNews[0].slug}`}>
                    <h3 className="text-xl md:text-2xl font-bold group-hover:text-red-600 transition leading-tight">
                      {nationalNews[0].title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mt-3 line-clamp-3 md:line-clamp-4 text-[16px] leading-relaxed text-justify">
                    {nationalNews[0].excerpt}
                  </p>
                  <p className="text-sm text-gray-500 mt-auto pt-4 font-medium">
                    {nationalNews[0].date}
                  </p>
                </div>
              </div>

              {nationalNews.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-t border-gray-200 pt-6">
                  {nationalNews.slice(1, 5).map((post, i) => (
                    <div key={i} className="group cursor-pointer">
                      <Link href={`/${post.urlCategory}/${post.slug}`}>
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-[120px] md:h-[140px] object-cover rounded mb-3 shadow-sm" 
                        />
                        <h4 className="font-semibold text-[15px] md:text-base group-hover:text-red-600 transition leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* ===================================================================== */}
        {/* ডান দিকের কন্টেন্ট (Span 1 - Sidebar) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
             <Sidebar popularNews={popularNews} latestNews={latestNews} />
          </div>
        </div>

      </div>
    </main>
  );
}