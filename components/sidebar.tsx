import Link from "next/link";

interface NewsItem {
  slug: string;
  title: string;
  category?: string;
  categorySlug?: string; // নতুন যোগ করা হয়েছে লিংকের জন্য
  date?: string;
}

interface SidebarProps {
  popularNews?: NewsItem[];
  latestNews?: NewsItem[];
}

export default function Sidebar({ popularNews = [], latestNews = [] }: SidebarProps) {
  return (
    <div className="space-y-8 bg-white">
      
      {/* ১. জনপ্রিয় সংবাদ সেকশন */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-red-600 rounded-full"></div>
          <h3 className="font-bold text-xl text-gray-800">জনপ্রিয় সংবাদ</h3>
        </div>

        <ul className="space-y-4">
          {popularNews.map((news, index) => (
            <li key={index} className="group cursor-pointer">
              {/* লিংকটি ডায়নামিক করা হয়েছে */}
              <Link href={`/${news.categorySlug || 'national'}/${news.slug}`} className="flex items-start gap-3">
                <span className="text-2xl font-bold text-gray-200 group-hover:text-red-600 transition-colors">
                  {index === 0 ? '১' : index === 1 ? '২' : index === 2 ? '৩' : index === 3 ? '৪' : '৫'}
                </span>
                <p className="text-sm font-bold text-gray-800 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
                  {news.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

    

      {/* ৩. সর্বশেষ সংবাদ সেকশন */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <h3 className="font-bold text-xl text-gray-800">সর্বশেষ সংবাদ</h3>
        </div>

        <ul className="space-y-5">
          {latestNews.map((news, index) => (
            <li key={index} className="cursor-pointer group">
              {/* লিংকটি ডায়নামিক করা হয়েছে */}
              <Link href={`/${news.categorySlug || 'national'}/${news.slug}`}>
                <div className="text-xs text-blue-600 mb-1 font-semibold">{news.category}</div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                  {news.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ৪. ফেসবুক পেজ উইজেট */}
      <div className="p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-sm font-bold text-blue-800 mb-2">আমাদের ফেসবুক পেজ</p>
        <a 
          href="https://facebook.com/chandpurnagorik" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-[#1877F2] text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors w-full"
        >
          ফলো করুন
        </a>
      </div>

    </div>
  );
}