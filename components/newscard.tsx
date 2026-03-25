import Link from "next/link";

export default function NewsCard({ post }: any) {
  if (!post) return null;

  return (
    <div className="h-full group cursor-pointer">
      <Link href={`/${post.urlCategory || 'national'}/${post.slug}`}>
        <div className="flex gap-4 items-center py-1">
          
          {/* লেখার অংশ: সাইজ বড় করা হয়েছে (16px থেকে 18px) এবং কালার ডার্ক করা হয়েছে */}
          <h3 className="text-[16px] md:text-[18px] font-semibold text-gray-800 leading-snug group-hover:text-red-600 transition-colors flex-1 line-clamp-3">
            {post.title}
          </h3>
          
          {/* ছবির অংশ: লেখার সাথে মিল রেখে ছবির সাইজ কিছুটা বাড়ানো হয়েছে এবং shrink-0 দেওয়া হয়েছে যাতে ছবি চ্যাপ্টা না হয় */}
          <img
            src={post.image}
            alt={post.title}
            className="w-[90px] h-[65px] md:w-[110px] md:h-[75px] object-cover rounded shadow-sm shrink-0"
          />
          
        </div>
      </Link>
    </div>
  );
}