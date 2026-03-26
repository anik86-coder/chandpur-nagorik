import Link from "next/link";

export default function NewsCard({ post }: any) {
  if (!post) return null;

  return (
    <div className="h-full group cursor-pointer">
      <Link href={`/${post.urlCategory || 'national'}/${post.slug}`}>
        {/* items-start দেওয়া হয়েছে যাতে লেখা একদম উপর থেকে শুরু হয় */}
        <div className="flex gap-3 md:gap-4 items-start py-1">
          
          {/* বাম দিকের লেখার অংশ */}
          <div className="flex-1 flex flex-col justify-start">
            <h3 className="text-[16px] md:text-[17px] font-bold text-gray-900 leading-snug group-hover:text-[#116cb4] transition-colors line-clamp-2 md:line-clamp-3">
              {post.title}
            </h3>
            
            {/* ক্যাটাগরি ব্যাজ (কালো ব্যাকগ্রাউন্ড, সাদা টেক্সট) */}
            <span className="mt-2 inline-block bg-gray-900 text-white text-[11px] px-2 py-0.5 rounded shadow-sm w-max font-medium tracking-wide">
              {post.category}
            </span>
          </div>
          
          {/* ডান দিকের ছবি */}
          <img
            src={post.image}
            alt={post.title}
            className="w-[100px] h-[70px] md:w-[110px] md:h-[80px] object-cover rounded shadow-sm shrink-0"
          />
          
        </div>
      </Link>
    </div>
  );
}