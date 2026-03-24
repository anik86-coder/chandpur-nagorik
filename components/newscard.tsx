import Link from "next/link";

export default function NewsCard({ post }: any) {
  if (!post) return null;

  return (
    <div className="h-full group cursor-pointer">
      <Link href={`/${post.urlCategory || 'national'}/${post.slug}`}>
        <div className="flex gap-3 items-center">
          <h3 className="text-sm font-semibold leading-snug group-hover:text-red-600 transition flex-1">
            {post.title}
          </h3>
          <img
            src={post.image}
            alt={post.title}
            className="w-20 h-14 md:w-24 md:h-16 object-cover rounded shadow-sm"
          />
        </div>
      </Link>
    </div>
  );
}