import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Sidebar from "@/components/sidebar"; 
import ShareButtons from "@/components/ShareButtons"; 

export const dynamic = "force-dynamic";
export const revalidate = 0;

// বাংলা নাম থেকে ইংরেজি লিংক চেক করার ম্যাপ (সাইডবারের লিংকের জন্য)
const reverseCategoryMap: { [key: string]: string } = {
  "সারাদেশ": "national",
  "জাতীয়": "national", 
  "চাঁদপুর": "chandpur",
  "রাজনীতি": "politics",
  "অর্থনীতি": "economy",
  "ক্রীড়া": "sports",
  "আন্তর্জাতিক": "international",
  "টেকনোলজি": "technology",
  "বিনোদন": "entertainment",
  "শিক্ষা": "education",
  "স্বাস্থ্য": "health",
  "ধর্ম": "religion",
  "প্রবাস": "probash",
  "লাইফস্টাইল": "lifestyle",
  "মতামত": "opinion",
};

// সাইডবারের ডাটা আনার আপডেট করা ফাংশন
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

  // লেটেস্ট খবর (সবসময় নতুন ৫টি দেখাবে)
  const latestNews = [...allNews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // জনপ্রিয় খবরের লিস্ট (এখানে আপনি আপনার পছন্দমতো ফাইলের নাম দিতে পারেন)
  const popularFileNames = [
    "national-888888",
    "politics-855514",
    "chandpur-road"
  ]; 

  let popularNews = popularFileNames
    .map((name) => allNews.find((news) => news.slug === name))
    .filter(Boolean) as any[];

  // ম্যাজিক ট্রিক: যদি ৫টি জনপ্রিয় খবর না পাওয়া যায়, তবে অন্য খবর দিয়ে অটোমেটিক ৫টি পূরণ করে দেবে!
  if (popularNews.length < 5) {
    const extraNews = allNews.filter(n => !popularNews.includes(n));
    popularNews = [...popularNews, ...extraNews].slice(0, 5);
  }

  return { popularNews, latestNews };
}

// বাংলা কনভার্টার
const convertToBangla = (str: string) => {
  if (!str) return "";
  const banglaNumbers: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  let converted = str.replace(/[0-9]/g, (match) => banglaNumbers[match]);
  return converted.replace(/AM/i, "এএম").replace(/PM/i, "পিএম");
};

// ============================================================================
// [আপডেট]: SEO (গুগল সার্চ ও ফেসবুক শেয়ারের জন্য Metadata জেনারেট করা হচ্ছে)
// ============================================================================
export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "content", "news", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return { title: "খবর পাওয়া যায়নি | চাঁদপুর নাগরিক" };
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContent);

  // ট্যাগগুলোকে কমা দিয়ে একটি স্ট্রিং বানানো হচ্ছে (SEO Keywords এর জন্য)
  const metaKeywords = data.tags ? data.tags.join(", ") : "চাঁদপুর নাগরিক, সংবাদ, খবর, বাংলাদেশ";

  return {
    title: `${data.title} | চাঁদপুর নাগরিক`,
    description: data.title, // গুগলে ডেসক্রিপশন হিসেবে দেখাবে
    keywords: metaKeywords, // গুগল সার্চের কি-ওয়ার্ড
    openGraph: {
      title: data.title,
      description: data.title,
      images: data.image ? [data.image] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.title,
      images: data.image ? [data.image] : [],
    },
  };
}
// ============================================================================

export default async function NewsDetailsPage({ params }: any) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), "content", "news", `${slug}.md`);
  
  // ডাটা অবজেক্টে tags যুক্ত করা হয়েছে
  let data = { title: "", category: "", date: "", time: "", author: "", image: "", tags: [] };
  let contentHtml = "<p>খবরটি পাওয়া যায়নি।</p>";

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsed = matter(fileContent);
    data = parsed.data as any;
    
    const processedContent = await remark().use(html).process(parsed.content);
    contentHtml = processedContent.toString();
  }

  const banglaDate = convertToBangla(data.date);
  const banglaTime = convertToBangla(data.time);
  const reporter = data.author || "নিজস্ব প্রতিবেদক";
  const { popularNews, latestNews } = getSidebarNews();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-[Kalpurush] grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* বাম পাশ: মূল নিউজ */}
      <article className="lg:col-span-2">
        <div className="mb-4">
          <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold tracking-wide">
            {data.category || "সংবাদ"}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-black">
          {data.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-200 pb-3">
          <div className="flex flex-wrap items-center text-gray-700 text-base font-medium">
            <span className="text-gray-900 font-bold mr-2">{reporter}</span>
            <span className="text-gray-400 mx-2">|</span>
            <span>{banglaDate}</span>
            {banglaTime && <><span className="text-gray-400 mx-2">|</span><span>{banglaTime}</span></>}
          </div>
          <div>
            <ShareButtons />
          </div>
        </div>

        {data.image && (
          <img src={data.image} alt={data.title} className="w-full object-cover rounded-lg mb-6 shadow-sm" />
        )}

        <div 
          className="text-lg text-gray-800 leading-relaxed prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: contentHtml }} 
        />

        {/* ===================================================================== */}
        {/* ট্যাগ সেকশন (হালকা অ্যাশ ব্যাকগ্রাউন্ড, কালো টেক্সট) */}
        {/* ===================================================================== */}
        {data.tags && data.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl"></span>
              <h3 className="text-lg font-bold text-gray-800">ট্যাগসমূহ:</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {data.tags.map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-800 px-3.5 py-1.5 rounded-md text-[15px] font-bold border border-gray-200 cursor-default select-none hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </article>

      {/* ডান পাশ: সাইডবার */}
      <aside className="lg:col-span-1">
         <div className="sticky top-6"> 
            <Sidebar popularNews={popularNews as any} latestNews={latestNews as any} />
         </div>
      </aside>

    </div>
  );
}