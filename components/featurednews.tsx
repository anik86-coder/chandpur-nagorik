import Link from "next/link";

// `{ post }: any` যুক্ত করা হলো যাতে সে page.tsx থেকে .md ফাইলের ডাটা রিসিভ করতে পারে
export default function FeaturedNews({ post }: any) {
  
  // যদি কোনো কারণে .md ফাইল না পায়, তবে ওয়েবসাইট যেন ভেঙে না যায়
  if (!post) return null;

  // ডাইনামিক লিংক তৈরি করা হলো (যেমন: /national/2531478593)
  const newsLink = `/${post.urlCategory || 'national'}/${post.slug}`;

  return (
    <div className="grid md:grid-cols-2 md:gap-x-6 gap-y-4 mb-0"> 

      <div className="border-l-4 border-[#116cb4] pl-4 py-1 flex flex-col justify-between h-[250px] md:h-[300px]">

        {/* ডাইনামিক টাইটেল */}
        <Link href={newsLink}>
          <h1 className="text-3xl font-bold text-black-600 leading-tight hover:text-[#116cb4] transition-colors cursor-pointer">
            {post.title}
          </h1>
        </Link>

        {/* ডাইনামিক বিস্তারিত (Excerpt) */}
        <div className="mt-3 flex-1 overflow-hidden">
          <p className="text-gray-600 text-sm md:text-base line-clamp-4 md:line-clamp-5">
            {post.excerpt || "বিস্তারিত জানতে খবরটিতে ক্লিক করুন..."}
          </p>
        </div>

        {/* ডাইনামিক ক্যাটাগরি বাটন */}
        <div className="mt-2">
          <Link href={`/${post.urlCategory || 'national'}`}>
            <button className="bg-gray-200 px-4 py-1 rounded text-sm hover:bg-gray-300 transition">
              {post.category}
            </button>
          </Link>
        </div>

      </div>

      <div className="w-full">
        {/* ডাইনামিক ইমেজ */}
        <Link href={newsLink}>
          <img
            src={post.image}
            className="w-full h-[250px] md:h-[300px] object-cover rounded cursor-pointer hover:opacity-95 transition"
            alt={post.title}
          />
        </Link>
      </div>

    </div>
  );
}