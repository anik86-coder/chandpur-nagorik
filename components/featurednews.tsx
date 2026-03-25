import Link from "next/link";

export default function FeaturedNews({ post }: any) {
  if (!post) return null;

  return (
    <div className="group cursor-pointer mb-4 mt-2">
      <Link href={`/${post.urlCategory || 'national'}/${post.slug}`} className="flex flex-col md:flex-row gap-5 md:gap-8 items-center">
        
        <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col justify-center order-2 md:order-1">
          <span className="bg-[#116cb4] text-white px-3 py-1 rounded text-[13px] mb-3 inline-block font-semibold self-start">
            {post.category}
          </span>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 md:line-clamp-3 mb-3">
            {post.title}
          </h2>
          
          <p className="text-gray-600 text-[15px] md:text-[17px] leading-relaxed line-clamp-3 text-justify">
            {post.excerpt}
          </p>
          
          <p className="text-sm text-gray-500 mt-4 font-medium">
            {post.date}
          </p>
        </div>

        <div className="w-full md:w-[50%] lg:w-[55%] order-1 md:order-2">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] object-cover rounded shadow-md"
          />
        </div>
        
      </Link>
    </div>
  );
}