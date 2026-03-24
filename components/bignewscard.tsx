import Link from "next/link";

export default function BigNewsCard({ post }: any) {
  if (!post) return null;

  return (
    <div className="border-t border-gray-300 pt-4">
      <Link href={`/${post.urlCategory || 'national'}/${post.slug}`}>
        <div className="grid grid-cols-2 gap-4 cursor-pointer group">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[120px] md:h-[150px] object-cover rounded"
          />
          <div>
            <h2 className="font-semibold text-lg group-hover:text-red-600 transition leading-tight">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {post.date}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}