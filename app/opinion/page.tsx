import Link from "next/link";

export default function OpinionPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8 font-[Kalpurush]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
          
          <div className="border-b-2 border-[#116cb4] mb-6 pb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              নাগরিক মতামত
            </h1>
          </div>

          <div className="text-gray-700 text-[17px] md:text-lg leading-relaxed space-y-5">
            <p>
              চাঁদপুর নাগরিক প্ল্যাটফর্মে আপনার মূল্যবান মতামত,
              পরামর্শ ও নাগরিক সেবার বিষয়ে অভিজ্ঞতা আমাদের জানান।
            </p>

            <p>
              আপনাদের মতামতের মাধ্যমে আমরা নাগরিক সেবাগুলো আরও
              সহজ, কার্যকর ও ব্যবহারবান্ধব করার চেষ্টা করব।
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link
              href="/contact"
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">💬</div>

              <h2 className="text-xl font-bold text-gray-900">
                আপনার মতামত জানান
              </h2>

              <p className="text-gray-600 mt-2">
                আমাদের প্ল্যাটফর্ম ও নাগরিক সেবা সম্পর্কে আপনার
                পরামর্শ পাঠান।
              </p>

              <span className="inline-block mt-4 text-[#116cb4] font-semibold">
                যোগাযোগ করুন →
              </span>
            </Link>

            <Link
              href="/sheba"
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">🏛️</div>

              <h2 className="text-xl font-bold text-gray-900">
                নাগরিক সেবা দেখুন
              </h2>

              <p className="text-gray-600 mt-2">
                বিভিন্ন নাগরিক সেবা সম্পর্কে জানতে ও ব্যবহার করতে
                সেবা বিভাগে যান।
              </p>

              <span className="inline-block mt-4 text-[#116cb4] font-semibold">
                সেবা দেখুন →
              </span>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}