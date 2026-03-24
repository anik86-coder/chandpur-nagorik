import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Sidebar from "@/components/sidebar"; 

const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national", "জাতীয়": "national", "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics", "অর্থনীতি": "economy", "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international", "টেকনোলজি": "technology",
  "বিনোদন": "entertainment", "শিক্ষা": "education", "স্বাস্থ্য": "health",
  "ধর্ম": "religion", "প্রবাস": "probash", "লাইফস্টাইল": "lifestyle", "মতামত": "opinion",
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
    return { slug, title: data.title || "শিরোনাম নেই", category: data.category || "সংবাদ", categorySlug: reverseCategoryMap[data.category as string] || "national", date: data.date || "2026-01-01" };
  });

  const latestNews = [...allNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const popularFileNames = ["2531478593", "chandpur-road", "launch-terminal"]; 
  const popularNews = popularFileNames.map((name) => allNews.find((news) => news.slug === name)).filter(Boolean);

  return { popularNews, latestNews };
}

export default function PrivacyPolicyPage() {
  const { popularNews, latestNews } = getSidebarNews();

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-[Kalpurush]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* মূল কন্টেন্ট (বাম পাশ) */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b-2 border-red-600 mb-6 pb-2 inline-block">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">গোপনীয়তা নীতি (Privacy Policy)</h1>
          </div>
          
          <div className="text-gray-700 text-[17px] leading-relaxed space-y-6 text-justify">
            <p>
              <strong>চাঁদপুর নাগরিক</strong>-এ আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। আমাদের ওয়েবসাইটে ভিজিট করার সময় আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি, তা এই নীতিমালায় বিস্তারিত বর্ণনা করা হয়েছে।
            </p>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">১. আমরা কী ধরনের তথ্য সংগ্রহ করি?</h2>
              <p>আপনি যখন আমাদের সাইট ভিজিট করেন, তখন আমরা কিছু সাধারণ তথ্য স্বয়ংক্রিয়ভাবে সংগ্রহ করতে পারি, যেমন—আপনার আইপি অ্যাড্রেস (IP Address), ব্রাউজারের ধরন, ডিভাইসের তথ্য এবং আপনি কোন পেজগুলো পড়ছেন। এছাড়া আপনি যদি আমাদের সাথে যোগাযোগ করেন বা মন্তব্য (Comment) করেন, তবে আপনার নাম এবং ইমেইল অ্যাড্রেস সংগ্রহ করা হতে পারে।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">২. কুকিজ (Cookies) এর ব্যবহার</h2>
              <p>আপনাকে আরও ভালো এবং দ্রুততর অভিজ্ঞতা দেওয়ার জন্য আমরা 'কুকিজ' ব্যবহার করে থাকি। কুকিজ হলো ছোট ডাটা ফাইল যা আপনার ব্রাউজারে সেভ থাকে। এর মাধ্যমে আমরা বুঝতে পারি আপনি কোন ধরনের খবর পড়তে পছন্দ করেন। আপনি চাইলে যেকোনো সময় আপনার ব্রাউজারের সেটিংস থেকে কুকিজ বন্ধ করে দিতে পারেন।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৩. থার্ড-পার্টি লিংক ও বিজ্ঞাপন</h2>
              <p>আমাদের ওয়েবসাইটে গুগল অ্যাডসেন্স (Google AdSense) বা অন্যান্য থার্ড-পার্টি বিজ্ঞাপন থাকতে পারে। এসব বিজ্ঞাপনদাতা তাদের নিজস্ব কুকিজ ব্যবহার করে বিজ্ঞাপন দেখাতে পারে। এছাড়া আমাদের খবরে অন্য কোনো ওয়েবসাইটের লিংক থাকলে, সেই সাইটের গোপনীয়তা নীতির দায়ভার আমাদের নয়।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৪. তথ্য সুরক্ষা</h2>
              <p>আপনার প্রদান করা কোনো ব্যক্তিগত তথ্য (যেমন- ইমেইল বা ফোন নম্বর) আমরা কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করি না। আপনার তথ্য সুরক্ষিত রাখতে আমরা সর্বোচ্চ প্রযুক্তিগত নিরাপত্তা ব্যবস্থা গ্রহণ করে থাকি।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৫. নীতিমালার পরিবর্তন</h2>
              <p>চাঁদপুর নাগরিক কর্তৃপক্ষ যেকোনো সময় এই গোপনীয়তা নীতি পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করে। যেকোনো বড় পরিবর্তনের ক্ষেত্রে আমরা ওয়েবসাইটে নোটিশের মাধ্যমে পাঠকদের জানিয়ে দেব।</p>
            </div>
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