import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Sidebar from "@/components/sidebar"; 

const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national", "জাতীয়": "national", "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics", "অর্থনীতি": "economy", "ক্রীড়া": "sports",
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
          <div className="border-b-2 border-[#116cb4] mb-6 pb-2 inline-block">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">গোপনীয়তা নীতি (Privacy Policy)</h1>
          </div>
          
          <div className="text-gray-700 text-[17px] leading-relaxed space-y-6 text-justify">
            <p>
              <strong>চাঁদপুর নাগরিক (Chandpur Nagorik)</strong>-এ আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। আমাদের ওয়েবসাইটে ভিজিট করার সময় আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি, তা এই নীতিমালায় বিস্তারিত বর্ণনা করা হয়েছে। 
            </p>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">১. লগ ফাইল এবং তথ্য সংগ্রহ (Log Files)</h2>
              <p>অন্যান্য পেশাদার ওয়েবসাইটের মতো 'চাঁদপুর নাগরিক' লগ ফাইল ব্যবহার করে। এই ফাইলগুলো ওয়েবসাইটে আসা ভিজিটরদের সাধারণ তথ্য সংগ্রহ করে, যার মধ্যে রয়েছে— ইন্টারনেট প্রোটোকল (IP) ঠিকানা, ব্রাউজারের ধরন, ইন্টারনেট সার্ভিস প্রোভাইডার (ISP), তারিখ ও সময়, এবং ক্লিকের সংখ্যা। এই তথ্যগুলো সম্পূর্ণ ব্যক্তিগত পরিচয়বিহীন এবং সাইটের মান উন্নয়নে ব্যবহৃত হয়।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">২. কুকিজ এবং ওয়েব বীকন (Cookies and Web Beacons)</h2>
              <p>আপনাকে আরও ভালো এবং কাস্টমাইজড অভিজ্ঞতা দেওয়ার জন্য আমরা 'কুকিজ' ব্যবহার করি। কুকিজ ব্যবহার করে আমরা ভিজিটরের পছন্দ এবং ওয়েবসাইটের কোন পেজগুলো তারা বেশি দেখছেন তা সংরক্ষণ করি। এর ফলে আমরা পাঠকের রুচি অনুযায়ী আমাদের কন্টেন্ট সাজাতে পারি।</p>
            </div>

            {/* অ্যাডসেন্স এপ্রুভালের জন্য সবচেয়ে গুরুত্বপূর্ণ সেকশন */}
            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৩. গুগল অ্যাডসেন্স এবং ডাবলক্লিক ডার্ট কুকি (Google DoubleClick DART Cookie)</h2>
              <p>গুগল, আমাদের সাইটের অন্যতম তৃতীয় পক্ষের বিক্রেতা (Third-party vendor) হিসেবে, বিজ্ঞাপন পরিবেশন করতে কুকিজ ব্যবহার করে। গুগল DART কুকি ব্যবহারের মাধ্যমে আমাদের ভিজিটরদের পূর্ববর্তী ইন্টারনেট ব্রাউজিং ইতিহাসের ওপর ভিত্তি করে প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শন করে।</p>
              <p className="mt-2">
                ভিজিটররা চাইলে গুগলের অ্যাড ও কন্টেন্ট নেটওয়ার্কের প্রাইভেসি পলিসি পেজে (Google Ad and Content Network Privacy Policy) গিয়ে অথবা <a href="https://www.aboutads.info" target="_blank" rel="nofollow noreferrer" className="text-blue-600 underline">www.aboutads.info</a> ওয়েবসাইট ভিজিট করে পার্সোনালাইজড বিজ্ঞাপন (Personalized advertising) দেখা থেকে নিজেদের অপ্ট-আউট (opt-out) বা বিরত রাখতে পারবেন।
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৪. তৃতীয় পক্ষের গোপনীয়তা নীতি (Third Party Privacy Policies)</h2>
              <p>'চাঁদপুর নাগরিক'-এর গোপনীয়তা নীতি অন্য কোনো বিজ্ঞাপনদাতা বা ওয়েবসাইটের ক্ষেত্রে প্রযোজ্য নয়। থার্ড-পার্টি অ্যাড সার্ভার বা বিজ্ঞাপন নেটওয়ার্কগুলো তাদের বিজ্ঞাপনে নিজস্ব প্রযুক্তি (যেমন- কুকিজ, জাভাস্ক্রিপ্ট বা ওয়েব বীকন) ব্যবহার করে, যা সরাসরি আপনার ব্রাউজারে প্রেরিত হয়। আমরা আপনাকে পরামর্শ দেব সেসব থার্ড-পার্টি বিজ্ঞাপনদাতার নিজস্ব গোপনীয়তা নীতিগুলো পড়ে দেখার জন্য। আপনি চাইলে আপনার ব্রাউজারের সেটিংস থেকে কুকিজ নিষ্ক্রিয় (Disable) করতে পারেন।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৫. শিশুদের তথ্যের গোপনীয়তা (Children's Information)</h2>
              <p>ইন্টারনেট ব্যবহারের সময় শিশুদের নিরাপত্তা নিশ্চিত করা আমাদের অন্যতম অগ্রাধিকার। 'চাঁদপুর নাগরিক' জেনেশুনে ১৩ বছরের কম বয়সী শিশুদের কোনো ব্যক্তিগত তথ্য সংগ্রহ করে না। যদি আপনার মনে হয় যে আপনার শিশু আমাদের ওয়েবসাইটে কোনো ধরনের ব্যক্তিগত তথ্য প্রদান করেছে, তবে অনুগ্রহ করে আমাদের সাথে তাৎক্ষণিকভাবে যোগাযোগ করুন। আমরা দ্রুততম সময়ের মধ্যে আমাদের রেকর্ড থেকে সেই তথ্য মুছে ফেলার ব্যবস্থা করব।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৬. আপনার সম্মতি (Consent)</h2>
              <p>আমাদের ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি আমাদের গোপনীয়তা নীতির (Privacy Policy) প্রতি আপনার সম্মতি জ্ঞাপন করছেন এবং এর শর্তাবলীতে একমত হচ্ছেন।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৭. যোগাযোগ (Contact Us)</h2>
              <p>আমাদের গোপনীয়তা নীতি সম্পর্কে আপনার যদি কোনো প্রশ্ন বা পরামর্শ থাকে, তবে নির্দ্বিধায় আমাদের সাথে যোগাযোগ করুন।<br/>
              <strong>ইমেইল:</strong> <a href="mailto:info@chandpurnagorik.com" className="text-blue-600 font-medium">info@chandpurnagorik.com</a></p>
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