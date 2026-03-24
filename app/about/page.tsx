import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Sidebar from "@/components/sidebar"; 

// বাংলা নাম থেকে ইংরেজি লিংক চেক করার ম্যাপ (সাইডবারের জন্য)
const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national", "জাতীয়": "national", "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics", "অর্থনীতি": "economy", "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international", "টেকনোলজি": "technology",
  "বিনোদন": "entertainment", "শিক্ষা": "education", "স্বাস্থ্য": "health",
  "ধর্ম": "religion", "প্রবাস": "probash", "লাইফস্টাইল": "lifestyle", "মতামত": "opinion",
};

// সাইডবারের ডাটা আনার ফাংশন
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
      date: data.date || "2026-01-01" 
    };
  });

  const latestNews = [...allNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const popularFileNames = ["2531478593", "chandpur-road", "launch-terminal"]; 
  const popularNews = popularFileNames.map((name) => allNews.find((news) => news.slug === name)).filter(Boolean);

  return { popularNews, latestNews };
}

export default function AboutPage() {
  const { popularNews, latestNews } = getSidebarNews();

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-[Kalpurush]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* মূল কন্টেন্ট (বাম পাশ) */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b-2 border-red-600 mb-6 pb-2 inline-block">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">আমাদের সম্পর্কে</h1>
          </div>
          
          <div className="text-gray-700 text-lg leading-relaxed space-y-5 text-justify">
            <p>
              <strong>চাঁদপুর নাগরিক</strong> হলো বৃহত্তর চাঁদপুর জেলার অন্যতম জনপ্রিয় এবং বিশ্বস্ত অনলাইন নিউজ পোর্টাল। "সত্য প্রকাশে আপোষহীন"—এই মূলমন্ত্রকে ধারণ করে আমরা প্রতিনিয়ত কাজ করে যাচ্ছি।
            </p>
            <p>
              আমাদের লক্ষ্য হলো চাঁদপুর জেলাসহ সারাদেশের এবং আন্তর্জাতিক পরিমণ্ডলের সর্বশেষ খবর, রাজনীতি, অর্থনীতি, খেলাধুলা ও বিনোদনের সকল তথ্য সবার আগে পাঠকের কাছে পৌঁছে দেওয়া। আমরা বস্তুনিষ্ঠ সাংবাদিকতায় বিশ্বাসী এবং কোনো ধরনের মিথ্যা বা বানোয়াট সংবাদ পরিবেশন থেকে বিরত থাকি।
            </p>
            <p>
              একদল তরুণ, সাহসী ও উদ্যমী সংবাদকর্মীর নিরলস পরিশ্রমে চাঁদপুর নাগরিক আজ এই অবস্থানে পৌঁছেছে। আপনাদের ভালোবাসা ও সমর্থনই আমাদের পথচলার প্রধান অনুপ্রেরণা।
            </p>
          </div>
        </div>

        {/* ডান পাশের সাইডবার */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Sidebar popularNews={popularNews as any} latestNews={latestNews as any} />
          </div>
        </div>

      </div>
    </main>
  );
}