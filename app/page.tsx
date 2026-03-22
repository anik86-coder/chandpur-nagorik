import { getAllPosts } from "../lib/post";
import NewsCard from "../components/newscard";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="max-w-screen-xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        চাদপুর নাগরিক নিউজে আপনাকে স্বাগতম!
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <NewsCard key={post.slug} post={post} />
        ))}
      </div>

    </main>
  );
}