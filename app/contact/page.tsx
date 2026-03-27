import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Sidebar from "@/components/sidebar"; 
import ContactForm from "@/components/contactform"; // নতুন ফর্ম ইমপোর্ট করা হলো

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

export default function ContactPage() {
  const { popularNews, latestNews } = getSidebarNews();

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-[Kalpurush]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b-2 border-red-600 mb-6 pb-2 inline-block">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">যোগাযোগ করুন</h1>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-[#116cb4]">প্রধান কার্যালয়</h3>
              <p className="text-gray-700 leading-relaxed">
                চাঁদপুর নাগরিক<br/>
                হাসান আলী সরকারি উচ্চ বিদ্যালয় রোড,<br/>
                চাঁদপুর সদর, চাঁদপুর-৩৬০০।
              </p>
              <div className="mt-4 text-gray-700">

                <p><strong>ইমেইল:</strong> info@chandpurnagorik.com</p>
              </div>
            </div>

            {/* এখানে নতুন ক্লায়েন্ট ফর্মটি বসানো হয়েছে */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Sidebar popularNews={popularNews as any} latestNews={latestNews as any} />
          </div>
        </div>

      </div>
    </main>
  );
}