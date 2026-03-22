import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import ShareButtons from "@/components/ShareButtons"; // আপনার লোকেশন অনুযায়ী ঠিক করে নিন
import Sidebar from "@/components/sidebar"; // আপনার Sidebar-এর লোকেশন অনুযায়ী ইমপোর্ট করুন

// ইংরেজি সংখ্যা এবং সময়কে বাংলায় রূপান্তর করার ফাংশন
const convertToBangla = (str: string) => {
  if (!str) return "";
  
  const banglaNumbers: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  let converted = str.replace(/[0-9]/g, (match) => banglaNumbers[match]);
  converted = converted.replace(/AM/i, "এএম").replace(/PM/i, "পিএম");
  return converted;
};

export default async function NewsPage({ params }: any) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), "content", "news", `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  const banglaDate = convertToBangla(data.date);
  const banglaTime = convertToBangla(data.time);
  const reporter = data.author || "নিজস্ব প্রতিবেদক";

  return (
    // মেইন কন্টেইনার: গ্রিড লেআউট (বামে ২ কলাম, ডানে ১ কলাম)
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-[Kalpurush] grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* ================= বাম পাশ: মূল নিউজ সেকশন (lg:col-span-2) ================= */}
      <article className="lg:col-span-2">
        
        {/* ক্যাটাগরি */}
        <div className="mb-4">
          <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm md:text-base font-semibold tracking-wide">
            {data.category || "জাতীয়"}
          </span>
        </div>

        {/* মেইন হেডলাইন */}
        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-black">
          {data.title}
        </h1>

        {/* প্রতিবেদক, তারিখ, সময় এবং শেয়ার অপশন */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-200 pb-3">
          <div className="flex flex-wrap items-center text-gray-700 text-base font-medium">
            <span className="text-gray-900 font-bold mr-2">{reporter}</span>
            <span className="text-gray-400 mx-2">|</span>
            <span>{banglaDate}</span>
            <span className="text-gray-400 mx-2">|</span>
            <span>{banglaTime}</span>
          </div>
          <div>
             <ShareButtons />
          </div>
        </div>

        {/* ইমেজ */}
        {data.image && (
          <img
            src={data.image}
            alt={data.title}
            className="w-full object-cover rounded-lg mb-6 shadow-sm"
          />
        )}

        {/* মূল নিউজ কন্টেন্ট */}
        <div 
          className="text-lg text-gray-800 leading-relaxed prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }} 
        />

      </article>

      {/* ================= ডান পাশ: আপনার আসল সাইডবার (lg:col-span-1) ================= */}
      <aside className="lg:col-span-1">
         {/* sticky top-6 রাখার কারণে আপনার সাইডবারটি স্ক্রল করলেও স্ক্রিনের সাথে লেগে থাকবে */}
         <div className="sticky top-6"> 
            
            {/* এখানে আপনার অরিজিনাল Sidebar কম্পোনেন্ট কল করা হয়েছে */}
            <Sidebar />

         </div>
      </aside>

    </div>
  );
}