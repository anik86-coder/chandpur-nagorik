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

export default function TermsAndConditionsPage() {
  const { popularNews, latestNews } = getSidebarNews();

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-[Kalpurush]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* মূল কন্টেন্ট (বাম পাশ) */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b-2 border-red-600 mb-6 pb-2 inline-block">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">ব্যবহারের শর্তাবলী (Terms & Conditions)</h1>
          </div>
          
          <div className="text-gray-700 text-[17px] leading-relaxed space-y-6 text-justify">
            <p>
              <strong>চাঁদপুর নাগরিক</strong> নিউজ পোর্টালে আপনাকে স্বাগতম। আমাদের ওয়েবসাইট ব্যবহার করার অর্থ হলো আপনি নিচের শর্তাবলীর সাথে সম্পূর্ণভাবে একমত পোষণ করছেন। যদি কোনো শর্তের সাথে আপনি একমত না হন, তবে অনুগ্রহ করে আমাদের সাইট ব্যবহার থেকে বিরত থাকুন।
            </p>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">১. কপিরাইট এবং কনটেন্ট ব্যবহার</h2>
              <p>চাঁদপুর নাগরিক-এ প্রকাশিত সকল সংবাদ, ছবি, ভিডিও, লোগো এবং গ্রাফিক্স সম্পূর্ণভাবে আমাদের নিজস্ব অথবা লাইসেন্সকৃত সম্পদ। কর্তৃপক্ষের পূর্বানুমতি ছাড়া এখানকার কোনো সংবাদ বা কনটেন্ট অন্য কোনো পত্রিকা, ওয়েবসাইট বা বাণিজ্যিক উদ্দেশ্যে হুবহু কপি করা দণ্ডনীয় অপরাধ। তবে সামাজিক যোগাযোগ মাধ্যমে খবরের লিংক শেয়ার করতে কোনো বাধা নেই।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">২. পাঠকের মন্তব্য (Comments)</h2>
              <p>খবরের নিচে পাঠকদের গঠনমূলক মন্তব্যকে আমরা স্বাগত জানাই। তবে কোনো ব্যক্তি, গোষ্ঠী, ধর্ম বা রাষ্ট্রের প্রতি মানহানিকর, উসকানিমূলক, অশালীন বা আইনবিরোধী মন্তব্য করা সম্পূর্ণ নিষেধ। এ ধরনের মন্তব্যের জন্য মন্তব্যকারী নিজেই দায়ী থাকবেন এবং কর্তৃপক্ষ যেকোনো সময় নোটিশ ছাড়াই এ ধরনের মন্তব্য মুছে ফেলার অধিকার রাখে।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৩. তথ্যের সঠিকতা</h2>
              <p>আমরা সবসময় নির্ভুল এবং সত্য সংবাদ প্রকাশের চেষ্টা করি। তবুও অনাকাঙ্ক্ষিত কোনো ভুল-ভ্রান্তি বা ত্রুটির জন্য চাঁদপুর নাগরিক আইনগতভাবে দায়ী থাকবে না। পাঠকদের কোনো তথ্যের ওপর ভিত্তি করে সিদ্ধান্ত নেওয়ার আগে নিজের বিবেক-বুদ্ধি প্রয়োগ করার অনুরোধ করা হলো।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৪. শর্তাবলী সংশোধন</h2>
              <p>ওয়েবসাইটের সুষ্ঠু পরিচালনার স্বার্থে চাঁদপুর নাগরিক যেকোনো সময় এই শর্তাবলীতে পরিবর্তন, সংযোজন বা বিয়োজন করার ক্ষমতা রাখে। সংশোধিত শর্তাবলী ওয়েবসাইটে প্রকাশের সাথে সাথেই কার্যকর বলে গণ্য হবে।</p>
            </div>

            <div className="bg-gray-50 p-4 border-l-4 border-red-600 mt-6 rounded">
              <p className="font-semibold text-gray-800">
                এই শর্তাবলী সম্পর্কে আপনার কোনো প্রশ্ন বা মতামত থাকলে আমাদের 'যোগাযোগ' পেজের মাধ্যমে ইমেইল করতে পারেন।
              </p>
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