import Link from "next/link";

export default function NewsCard({ post }: any) {

  if (!post) return null;

  return (
    <div className="pb-4 border-b border-gray-200">

      <Link href={`/news/${post.slug}`}>
        <div className="flex gap-3">

          {/* Title */}
          <h3 className="text-sm font-semibold leading-snug hover:text-red-600 transition flex-1">
            {post.title}
          </h3>

          {/* Image */}
          <img
            src={post.image}
            alt={post.title}
            className="w-24 h-16 object-cover rounded"
          />

        </div>
      </Link>

    </div>
  );
}