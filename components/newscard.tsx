import Link from "next/link";

export default function NewsCard({ post }: any) {
  return (
    <div className="border p-4 rounded-lg bg-white">

      <Link href={`/news/${post.slug}`}>
        <h2 className="text-xl font-semibold">
          {post.title}
        </h2>
      </Link>

      <p className="text-sm text-gray-500">
        {post.date}
      </p>

      <img
        src={post.image}
        alt={post.title}
        className="mt-3 rounded"
      />

    </div>
  );
}