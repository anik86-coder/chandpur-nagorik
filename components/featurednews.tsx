import Link from "next/link"; // এটি ফাইলের একদম উপরে ইমপোর্ট করবেন

export default function FeaturedNews() {
  const newsSlug = "national123456"; // আপনার .md ফাইলের নাম (ভবিষ্যতে এটি ডাইনামিক হবে)

  return (
    <div className="grid md:grid-cols-2 md:gap-x-6 gap-y-4 mb-0"> 

      <div className="border-l-4 border-[#116cb4] pl-4 py-1 flex flex-col justify-between h-[250px] md:h-[300px]">

        {/* টাইটেলের চারপাশে Link দেওয়া হলো */}
        <Link href={`/news/${newsSlug}`}>
          <h1 className="text-3xl font-bold text-black-600 leading-tight hover:text-[#116cb4] transition-colors cursor-pointer">
            একাত্তরের গণহত্যার স্বীকৃতির দাবিতে যুক্তরাষ্ট্রের কংগ্রেসে প্রস্তাব
          </h1>
        </Link>

        <div className="mt-3 flex-1 overflow-hidden">
          <p className="text-gray-600 text-sm md:text-base line-clamp-4 md:line-clamp-5">
            যুক্তরাষ্ট্রের পার্লামেন্টে মার্কিন কংগ্রেসে ১৯৭১ সালে বাংলাদেশে
            পাকিস্তানি সেনাবাহিনীর চালানো গণহত্যার আন্তর্জাতিক স্বীকৃতির দাবি তুলে
            নতুন একটি প্রস্তাব তোলা হয়েছে। এই প্রস্তাবটি উত্থাপন করেছেন দুই
            প্রভাবশালী কংগ্রেসম্যান। প্রস্তাবে ১৯৭১ সালের ২৬শে মার্চ থেকে ১৬ই
            ডিসেম্বর পর্যন্ত সংঘটিত নৃশংসতাকে 'গণহত্যা' হিসেবে স্বীকৃতি দিতে দাবি জানানো হয়... 
          </p>
        </div>

        <div className="mt-2">
          <button className="bg-gray-200 px-4 py-1 rounded text-sm">
            পাকিস্তান
          </button>
        </div>

      </div>

      <div className="w-full">
        {/* ইমেজের চারপাশে Link দেওয়া হলো */}
        <Link href={`/news/${newsSlug}`}>
          <img
            src="https://res.cloudinary.com/dfzirugge/image/upload/v1774201294/Untitled-1_jcltqc.png"
            className="w-full h-[250px] md:h-[300px] object-cover rounded cursor-pointer"
            alt="News Image"
          />
        </Link>
      </div>

    </div>
  );
}