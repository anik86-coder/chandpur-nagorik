import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Sidebar from "@/components/sidebar"; // অথবা "../components/sidebar" যদি পাথ কাজ না করে

export const dynamic = "force-dynamic";

// ক্যাটাগরি লিংকের ম্যাপ
const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national", "জাতীয়": "national", "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics", "অর্থনীতি": "economy", "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international", "টেকনোলজি": "technology",
  "বিনোদন": "entertainment", "শিক্ষা": "education", "স্বাস্থ্য": "health",
  "ধর্ম": "religion", "প্রবাস": "probash", "লাইফস্টাইল": "lifestyle", "ম মতামত": "opinion",
};

// ফোল্ডার থেকে সব খবর এবং সাইডবারের ডাটা আনার ফাংশন
function getAllNewsData() {
  const postsDirectory = path.join(process.cwd(), "content", "news");
  if (!fs.existsSync(postsDirectory)) return { allNews: [], latestNews: [], popularNews: [] };

  const fileNames = fs.readdirSync(postsDirectory);
  const allNews = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fileContents = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
    const { data, content } = matter(fileContents);

    // বিস্তারিত থেকে প্রথম ১৫০টি অক্ষর কেটে নেওয়া (Description এর জন্য)
    const excerptText = data.excerpt || content.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "...";

    return {
      slug,
      title: data.title || "শিরোনাম নেই",
      category: data.category || "সংবাদ",
      urlCategory: reverseCategoryMap[data.category as string] || "national",
      date: data.date || "2026-01-01",
      image: data.image || "https://res.cloudinary.com/dfzirugge/image/upload/v1774201294/Untitled-1_jcltqc.png",
      excerpt: excerptText,
    };
  });

  // তারিখ অনুযায়ী নতুন থেকে পুরোনো সিরিয়ালে সাজানো
  const sortedNews = allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // সাইডবারের জন্য লেটেস্ট ৫টি খবর
  const latestNews = sortedNews.slice(0, 5);
  const popularNews = sortedNews.slice(0, 5);

  return { allNews: sortedNews, latestNews, popularNews };
}

// পেজিনেশনের জন্য searchParams রিসিভ করা হচ্ছে
export default async function AllNewsPage({ searchParams }: any) {
  const params = await searchParams; // Next.js এর নতুন রুলস অনুযায়ী
  const currentPage = parseInt(params?.page || "1", 10);
  const ITEMS_PER_PAGE = 20;

  const { allNews, latestNews, popularNews } = getAllNewsData();

  // পেজিনেশনের হিসাব
  const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNews = allNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-[Kalpurush]">
      
      {/* পেজের হেডিং */}
      <div className="mb-6 border-b-2 border-[#116cb4] pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-[#116cb4]">সকল খবর</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT CONTENT (খবরের লিস্ট) */}
        <div className="lg:col-span-3">
          {currentNews.length === 0 ? (
            <p className="text-center py-10 text-gray-500 text-lg">কোনো খবর পাওয়া যায়নি।</p>
          ) : (
            <div className="flex flex-col gap-6">
              {currentNews.map((post, index) => (
                // প্রতিটি খবরের নিচে হালকা বর্ডার (border-b)
                <div key={index} className="flex flex-col md:flex-row gap-4 border-b border-gray-200 pb-6 mb-2 group">
                  
                  {/* বামে ছবি */}
                  <Link href={`/${post.urlCategory}/${post.slug}`} className="md:w-1/3 shrink-0 overflow-hidden rounded">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-40 md:h-32 object-cover group-hover:scale-105 transition duration-300" 
                    />
                  </Link>

                  {/* ডানে হেডলাইন এবং বিস্তারিত */}
                  <div className="md:w-2/3 flex flex-col justify-start">
                    <Link href={`/${post.urlCategory}/${post.slug}`}>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-[#116cb4] transition-colors leading-snug">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mt-2 text-sm md:text-base line-clamp-2 md:line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-semibold">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-400">{post.date}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Pagination Buttons (শুধু আগের এবং পরের পেজ) */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-10 border-t pt-6">
              {currentPage > 1 ? (
                <Link 
                  href={`/all?page=${currentPage - 1}`} 
                  className="px-5 py-2 bg-gray-800 text-white rounded hover:bg-[#116cb4] transition font-medium"
                >
                  ← আগের পেজ
                </Link>
              ) : (
                <div></div> // ফাকা জায়গা রাখার জন্য
              )}

              {currentPage < totalPages ? (
                <Link 
                  href={`/all?page=${currentPage + 1}`} 
                  className="px-5 py-2 bg-gray-800 text-white rounded hover:bg-[#116cb4] transition font-medium"
                >
                  পরের পেজ →
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT CONTENT (সাইডবার) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Sidebar popularNews={popularNews as any} latestNews={latestNews as any} />
          </div>
        </div>

      </div>
    </main>
  );
}