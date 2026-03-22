import FeaturedNews from "../components/featurednews";
import BigNewsCard from "../components/bignewscard";
import NewsCard from "../components/newscard";
import Sidebar from "../components/sidebar";

const demoPost = {
  slug: "chandpur-road",
  title: "চাঁদপুরে নতুন সড়ক উদ্বোধন",
  date: "2026-03-21",
  image:
    "https://res.cloudinary.com/dfzirugge/image/upload/v1774084245/3_u1xeqx.png",
};

export default function Home() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-6">

      <div className="grid grid-cols-4 gap-6">

        {/* LEFT CONTENT */}
        <div className="col-span-3">

          {/* Featured */}
          <FeaturedNews />

          {/* Big News */}
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <BigNewsCard />
            <BigNewsCard />
          </div>

          {/* News Grid */}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 border-t border-gray-300 pt-6">

  <NewsCard post={demoPost} />
  <NewsCard post={demoPost} />
  <NewsCard post={demoPost} />
  <NewsCard post={demoPost} />

  <NewsCard post={demoPost} />
  <NewsCard post={demoPost} />
  <NewsCard post={demoPost} />
  <NewsCard post={demoPost} />

</div>

        </div>

        {/* SIDEBAR */}
        <div className="col-span-1">
          <Sidebar />
        </div>

      </div>

    </main>
  );
}