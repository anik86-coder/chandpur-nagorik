import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Sidebar from "@/components/sidebar"; // আপনার পাথ অনুযায়ী "@/components/sidebar" বা "../components/sidebar" দিন

export const dynamic = "force-dynamic";

const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national", "জাতীয়": "national", "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics", "অর্থনীতি": "economy", "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international", "টেকনোলজি": "technology",
  "বিনোদন": "entertainment", "শিক্ষা": "education", "স্বাস্থ্য": "health",
  "ধর্ম": "religion", "প্রবাস": "probash", "লাইফস্টাইল": "lifestyle", "মতামত": "opinion",
};

function getOpinionPageData() {
  const postsDirectory = path.join(process.cwd(), "content", "news"); 
  if (!fs.existsSync(postsDirectory)) return { opinions: [], popularNews: [], latestNews: [] };

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
      author: data.author || "অতিথি লেখক",
      image: data.image || "https://res.cloudinary.com/dfzirugge/image/upload/v1774201294/Untitled-1_jcltqc.png",
      excerpt: data.excerpt || content.replace(/(<([^>]+)>)/gi, "").substring(0, 350) + "..."
    };
  });

  const sorted = [...allNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // শুধুমাত্র "মতামত" ক্যাটাগরির খবর ফিল্টার করা
  const opinions = sorted.filter(post => post.urlCategory === "opinion");
  
  return { 
    opinions, 
    latestNews: sorted.slice(0, 5), 
    popularNews: sorted.slice(0, 5) 
  };
}

export default function OpinionPage() {
  const { opinions, popularNews, latestNews } = getOpinionPageData();

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-[Kalpurush]">
      
      {/* পেজ হেডার */}
      <div className="mb-8 border-b-2 border-gray-900 pb-3 flex items-center gap-3">
        <span className="w-4 h-4 bg-[#116cb4] rounded-full inline-block"></span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">মতামত ও বিশ্লেষণ</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ===================================================================== */}
        {/* বাম দিকের কন্টেন্ট (Span 3) - মতামত লিস্ট */}
        {/* ===================================================================== */}
        <div className="lg:col-span-3 flex flex-col">
          
          {opinions.length > 0 ? (
            <>
              {/* ১. প্রধান মতামত (Top Featured Opinion) */}
              <div className="mb-10 bg-[#f8f9fa] border border-gray-200 p-5 md:p-8 rounded-sm relative overflow-hidden group cursor-pointer">
                {/* ডেকোরেশন কোট আইকন */}
                <div className="absolute -top-6 -right-2 text-[120px] text-gray-200 font-serif leading-none opacity-50 select-none">
                  "
                </div>
                
                <Link href={`/opinion/${opinions[0].slug}`} className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                  <div className="w-full md:w-[45%]">
                    <img 
                      src={opinions[0].image} 
                      alt={opinions[0].title} 
                      className="w-full aspect-[4/3] object-cover rounded shadow-md group-hover:shadow-lg transition-shadow" 
                    />
                  </div>
                  <div className="w-full md:w-[55%] flex flex-col">
                    <span className="text-red-600 font-bold text-lg mb-2">
                      {opinions[0].author}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold leading-snug text-gray-900 group-hover:text-[#116cb4] transition-colors mb-4">
                      {opinions[0].title}
                    </h2>
                    <p className="text-gray-700 text-[16px] md:text-[18px] leading-relaxed line-clamp-4 text-justify mb-4">
                      {opinions[0].excerpt}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {opinions[0].date}
                    </p>
                  </div>
                </Link>
              </div>

              {/* ২. অন্যান্য মতামত (Grid View) */}
              {opinions.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {opinions.slice(1).map((post, i) => (
                    <div key={i} className="group cursor-pointer border-t border-gray-300 pt-5">
                      <Link href={`/opinion/${post.slug}`} className="flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-10 h-10 bg-[#116cb4] rounded-full flex items-center justify-center text-white font-bold text-xl">
                             {post.author.charAt(0)}
                           </div>
                           <div>
                             <p className="font-bold text-gray-900 text-[15px]">{post.author}</p>
                             <p className="text-xs text-gray-500">{post.date}</p>
                           </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-[16px] leading-relaxed line-clamp-3 text-justify">
                          {post.excerpt}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* খালি অবস্থা (Empty State) */
            <div className="bg-gray-50 border border-gray-200 p-12 text-center rounded">
              <span className="text-4xl block mb-3">✍️</span>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">কোনো মতামত পাওয়া যায়নি</h3>
              <p className="text-gray-500">খুব শিগগিরই নতুন কলাম ও বিশ্লেষণ আপডেট করা হবে।</p>
            </div>
          )}

        </div>

        {/* ===================================================================== */}
        {/* ডান দিকের কন্টেন্ট (Span 1 - Sidebar) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
             <Sidebar popularNews={popularNews} latestNews={latestNews} />
          </div>
        </div>

      </div>
    </main>
  );
}