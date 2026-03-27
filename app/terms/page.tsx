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

export default function TermsAndConditionsPage() {
  const { popularNews, latestNews } = getSidebarNews();

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-[Kalpurush]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* মূল কন্টেন্ট (বাম পাশ) */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b-2 border-[#116cb4] mb-6 pb-2 inline-block">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">ব্যবহারের শর্তাবলী (Terms & Conditions)</h1>
          </div>
          
          <div className="text-gray-700 text-[17px] leading-relaxed space-y-7 text-justify">
            <p>
              <strong>চাঁদপুর নাগরিক (Chandpur Nagorik)</strong>-এ আপনাকে স্বাগতম। এটি বৃহত্তর চাঁদপুর জেলার আপামর মানুষের একটি বিশ্বস্ত নিউজ পোর্টাল এবং ডিজিটাল কমিউনিটি প্ল্যাটফর্ম। আমাদের ওয়েবসাইট ও এর যেকোনো সেবা ব্যবহার করার অর্থ হলো আপনি নিচের শর্তাবলীর সাথে সম্পূর্ণভাবে একমত পোষণ করছেন। 
            </p>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">১. নিজস্ব কনটেন্ট এবং কপিরাইট</h2>
              <p>চাঁদপুর নাগরিক-এর নিজস্ব প্রতিবেদক ও কন্ট্রিবিউটরদের তৈরি করা এক্সক্লুসিভ সংবাদ, ফিচার, বিশেষ প্রতিবেদন, নিজস্ব ছবি এবং লোগো সম্পূর্ণভাবে আমাদের নিজস্ব সম্পদ। কর্তৃপক্ষের পূর্বানুমতি ছাড়া আমাদের কোনো নিজস্ব কনটেন্ট বাণিজ্যিক উদ্দেশ্যে হুবহু কপি করা আইনত দণ্ডনীয় অপরাধ। তবে খবরের লিংক বা সারাংশ সামাজিক যোগাযোগ মাধ্যমে শেয়ার করতে কোনো বাধা নেই।</p>
            </div>

            {/* ফেয়ার ইউজ পলিসি - নতুন যুক্ত করা হয়েছে */}
            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">২. থার্ড-পার্টি কনটেন্ট এবং 'ফেয়ার ইউজ' (Fair Use) নীতি</h2>
              <p>একটি সার্বিক নিউজ পোর্টাল হিসেবে 'চাঁদপুর নাগরিক' দেশ-বিদেশের বিভিন্ন সংবাদমাধ্যম, নিউজ এজেন্সি, সোশ্যাল মিডিয়া এবং অন্যান্য উন্মুক্ত সোর্স থেকে তথ্য সংগ্রহ (News Aggregation) করে থাকে। সাংবাদিকতা, সংবাদ পর্যালোচনা এবং জনসচেতনতা বৃদ্ধির লক্ষ্যে আমরা আন্তর্জাতিক <strong>'ফেয়ার ইউজ' (Fair Use)</strong> এবং <strong>'এডিটোরিয়াল ইউজ' (Editorial Use)</strong> নীতির আওতায় বিভিন্ন ছবি, খবরের অংশবিশেষ বা উদ্ধৃতি ব্যবহার করে থাকি।</p>
              <p className="mt-2">এসব ক্ষেত্রে আমরা সর্বদা মূল সূত্র বা ক্রেডিট উল্লেখ করার সর্বোচ্চ চেষ্টা করি। যদি কোনো নির্দিষ্ট ছবি বা কনটেন্টের মূল স্বত্বাধিকারী (Copyright Holder) তাদের কনটেন্ট আমাদের সাইটে প্রদর্শনের বিষয়ে আপত্তি জানান, তবে প্রমাণসহ আমাদের সাথে যোগাযোগ করার অনুরোধ করা হলো। আমরা দ্রুততম সময়ের মধ্যে সেটি পরিবর্তন বা অপসারণ করার ব্যবস্থা গ্রহণ করব।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৩. কমিউনিটি গাইডলাইন ও ব্যবহারকারীর দায়িত্ব</h2>
              <p>আমাদের প্ল্যাটফর্মে ব্যবহারকারীরা বিভিন্ন জনকল্যাণমূলক তথ্য (যেমন: রক্তের সন্ধান বা নাগরিক সমস্যা) প্রদান করতে পারেন এবং খবরে মন্তব্য করতে পারেন। কোনো ব্যক্তি, গোষ্ঠী, ধর্ম বা রাষ্ট্রের প্রতি মানহানিকর, উসকানিমূলক, অশালীন বা আইনবিরোধী কোনো তথ্য প্রদান বা মন্তব্য করা সম্পূর্ণ নিষেধ। এ ধরনের কাজের জন্য মন্তব্যকারী নিজেই ব্যক্তিগত ও আইনগতভাবে দায়ী থাকবেন এবং কর্তৃপক্ষ যেকোনো সময় নোটিশ ছাড়াই এ ধরনের কনটেন্ট মুছে ফেলার অধিকার রাখে।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৪. তথ্যের সঠিকতা ও দায়মুক্তি (Disclaimer)</h2>
              <p>আমরা সবসময় নির্ভুল এবং সত্য সংবাদ প্রকাশের সর্বোচ্চ চেষ্টা করি। তবে জরুরি সেবা, ব্লাড ব্যাংক বা অন্যান্য কমিউনিটি-ভিত্তিক অনেক তথ্য সাধারণ মানুষের দেওয়া তথ্যের ওপর ভিত্তি করে প্রচারিত হতে পারে। এসব তথ্যের শতভাগ সঠিকতার আইনি নিশ্চয়তা চাঁদপুর নাগরিক দিতে পারে না। যেকোনো খবরের ভিত্তিতে জরুরি বা আইনি সিদ্ধান্ত নেওয়ার আগে নিজ দায়িত্বে তথ্য যাচাই করার জন্য পাঠকদের বিশেষভাবে অনুরোধ করা হলো।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৫. এক্সটার্নাল বা বহিঃস্থ লিংক</h2>
              <p>আমাদের ওয়েবসাইটে অন্য কোনো ওয়েবসাইটের লিংক (External Link) থাকতে পারে (যেমন- বিজ্ঞাপনের লিংক বা রেফারেন্স লিংক)। সেসব ওয়েবসাইটের কনটেন্ট, নিরাপত্তা বা প্রাইভেসি পলিসির ওপর আমাদের কোনো নিয়ন্ত্রণ নেই এবং এর কোনো দায়ভার 'চাঁদপুর নাগরিক' বহন করবে না।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৬. স্প্যামিং এবং প্ল্যাটফর্মের অপব্যবহার</h2>
              <p>ওয়েবসাইটের কোনো টেকনিক্যাল ক্ষতি সাধন করা, স্প্যামিং করা, ভুয়া খবর ছড়ানো বা ভুয়া সেবার তথ্য দিয়ে সাধারণ মানুষকে বিভ্রান্ত করার চেষ্টা করলে কর্তৃপক্ষ বিনা নোটিশে সংশ্লিষ্ট ব্যবহারকারীকে বা আইপি (IP Address) ব্লক করার অধিকার রাখে। প্রয়োজনে বাংলাদেশ সরকারের সাইবার নিরাপত্তা আইন অনুযায়ী আইনি ব্যবস্থা গ্রহণ করা হতে পারে।</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#116cb4] mb-2">৭. শর্তাবলী সংশোধন ও আইন</h2>
              <p>প্ল্যাটফর্মের সুষ্ঠু পরিচালনার স্বার্থে 'চাঁদপুর নাগরিক' কর্তৃপক্ষ যেকোনো সময় এই শর্তাবলীতে পরিবর্তন, সংযোজন বা বিয়োজন করার ক্ষমতা রাখে। এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রচলিত আইন অনুযায়ী পরিচালিত হবে।</p>
            </div>

            <div className="bg-gray-50 p-5 border-l-4 border-[#116cb4] mt-8 rounded shadow-sm">
              <p className="font-semibold text-gray-800">
                এই শর্তাবলী বা কপিরাইট সংক্রান্ত কোনো বিষয়ে আপনার প্রশ্ন, অভিযোগ বা মতামত থাকলে সরাসরি আমাদের সাথে যোগাযোগ করুন:<br/>
                <a href="mailto:info@chandpurnagorik.com" className="text-red-600 hover:underline mt-1 inline-block text-lg">info@chandpurnagorik.com</a>
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