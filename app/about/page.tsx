import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Sidebar from "@/components/sidebar"; 

// বাংলা নাম থেকে ইংরেজি লিংক চেক করার ম্যাপ (সাইডবারের জন্য)
const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national", "জাতীয়": "national", "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics", "অর্থনীতি": "economy", "ক্রীড়া": "sports",
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
          <div className="border-b-2 border-[#116cb4] mb-6 pb-2 inline-block">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">আমাদের সম্পর্কে</h1>
          </div>
          
          <div className="text-gray-700 text-[17px] md:text-lg leading-relaxed space-y-5 text-justify">
            <p>
              <strong>চাঁদপুর নাগরিক</strong> শুধুমাত্র একটি গতানুগতিক নিউজ পোর্টাল নয়, বরং এটি বৃহত্তর চাঁদপুর জেলার আপামর মানুষের একটি উন্মুক্ত ডিজিটাল মুখপত্র ও বিশ্বস্ত কমিউনিটি প্ল্যাটফর্ম।
            </p>
            <p>
              আমাদের লক্ষ্য শুধু খবর পরিবেশন করা নয়। চাঁদপুর জেলাসহ সারাদেশের রাজনীতি, অর্থনীতি ও সমসাময়িক খবরের পাশাপাশি সমাজের নানা অসঙ্গতি তুলে ধরা, নাগরিক অধিকার নিয়ে কথা বলা এবং সামাজিক সচেতনতা বৃদ্ধি করা আমাদের অন্যতম প্রধান উদ্দেশ্য। আমরা বস্তুনিষ্ঠ সাংবাদিকতায় বিশ্বাসী এবং যেকোনো ধরনের বানোয়াট তথ্য বা গুজব ছড়ানো থেকে সম্পূর্ণ বিরত থাকি।
            </p>
            <p>
              একটি দায়িত্বশীল কমিউনিটি হিসেবে মানুষের বিপদে পাশে দাঁড়ানো, জরুরি রক্তের সন্ধান বা ব্লাড ব্যাংকের তথ্য সরবরাহ করা, স্থানীয় বিভিন্ন জনকল্যাণমূলক উদ্যোগের প্রসার ঘটানো এবং প্রশাসন ও সাধারণ মানুষের মাঝে একটি শক্তিশালী সেতুবন্ধন তৈরিতে "চাঁদপুর নাগরিক" প্রতিনিয়ত কাজ করে যাচ্ছে।
            </p>
            <p>
              একদল তরুণ, সাহসী ও উদ্যমী স্বেচ্ছাসেবক এবং সংবাদকর্মীর নিরলস পরিশ্রমে আমাদের এই প্ল্যাটফর্মটি আজ মানুষের আস্থার একটি বড় জায়গা হয়ে উঠেছে। আপনাদের ভালোবাসা, গঠনমূলক সমালোচনা ও সমর্থনই আমাদের সামনের দিকে এগিয়ে চলার সবচেয়ে বড় অনুপ্রেরণা।
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