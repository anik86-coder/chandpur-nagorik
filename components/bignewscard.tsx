import Link from "next/link";

export default function BigNewsCard({ post }: any) {
  if (!post) return null;

  return (
    <div className="group cursor-pointer h-full">
      <Link href={`/${post.urlCategory || 'national'}/${post.slug}`}>
        <div className="grid grid-cols-2 gap-4 h-full">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[120px] md:h-[150px] object-cover rounded"
          />
          {/* flex এবং flex-col ব্যবহার করা হয়েছে যাতে তারিখ নিচে থাকে */}
          <div className="flex flex-col">
            <h2 className="font-semibold text-lg group-hover:text-red-600 transition leading-tight">
              {post.title}
            </h2>
            
            {/* নতুন যুক্ত করা খবরের বিবরণ (Excerpt) */}
            {post.excerpt && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2 md:line-clamp-3">
                {post.excerpt}
              </p>
            )}
            
            {/* mt-auto দেওয়ার কারণে তারিখটি সবসময় একদম নিচে সুন্দর করে বসে থাকবে */}
            <p className="text-sm text-gray-500 mt-auto pt-2">
              {post.date}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}