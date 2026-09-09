import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-6 font-[Kalpurush]">

      {/* ======================================================= */}
      {/* মূল Homepage */}
      {/* ======================================================= */}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===================================================== */}
        {/* Welcome Section */}
        {/* ===================================================== */}

        <div className="lg:col-span-2">

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">

            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                চাঁদপুর নাগরিক
              </h1>

              <p className="text-gray-600 text-lg mt-3 leading-relaxed">
                চাঁদপুর জেলার নাগরিকদের জন্য প্রয়োজনীয় তথ্য ও নাগরিক সেবা
                এক জায়গায়।
              </p>
            </div>

            <Link
              href="/sheba"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#116cb4] text-white font-bold text-lg hover:bg-[#0d5a96] transition-colors shadow-md"
            >
              নাগরিক সেবা দেখুন
            </Link>

          </div>

        </div>

        {/* ===================================================== */}
        {/* নাগরিক সেবা */}
        {/* ===================================================== */}

        <div className="lg:col-span-1">

          <div className="bg-[#f4f5f7] border border-gray-200 rounded-2xl overflow-hidden">

            <div className="bg-[#116cb4] text-white text-center py-3 px-4">
              <h2 className="text-xl md:text-2xl font-bold">
                নাগরিক সেবা
              </h2>
            </div>

            <div className="p-4">

              <Link
                href="/sheba"
                className="block bg-white border border-gray-200 rounded-xl p-4 mb-3 hover:shadow-md hover:border-[#116cb4] transition-all"
              >
                <h3 className="font-bold text-lg text-gray-800">
                  সকল নাগরিক সেবা
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  প্রয়োজনীয় নাগরিক সেবাগুলো দেখুন
                </p>
              </Link>

              <Link
                href="/sheba/blood-bank"
                className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-red-500 transition-all"
              >
                <h3 className="font-bold text-lg text-gray-800">
                  🩸 ব্লাড ব্যাংক
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  রক্তদাতা খুঁজুন এবং রক্তের প্রয়োজনীয় তথ্য দেখুন
                </p>
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================= */}
      {/* গুরুত্বপূর্ণ সেবা */}
      {/* ======================================================= */}

      <section className="mt-8">

        <div className="mb-6 border-b border-gray-300 pb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-l-4 border-[#116cb4] pl-3">
            গুরুত্বপূর্ণ নাগরিক সেবা
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Blood Bank */}
          <Link
            href="/sheba/blood-bank"
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-red-400 transition-all"
          >
            <div className="text-3xl mb-3">
              🩸
            </div>

            <h3 className="font-bold text-lg text-gray-800 group-hover:text-red-600 transition-colors">
              ব্লাড ব্যাংক
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              প্রয়োজনীয় রক্তের গ্রুপের রক্তদাতা খুঁজুন।
            </p>
          </Link>

          {/* নাগরিক সেবা */}
          <Link
            href="/sheba"
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[#116cb4] transition-all"
          >
            <div className="text-3xl mb-3">
              🏛️
            </div>

            <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#116cb4] transition-colors">
              নাগরিক সেবা
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              বিভিন্ন প্রয়োজনীয় নাগরিক সেবা এক জায়গায়।
            </p>
          </Link>

          {/* তথ্য */}
          <Link
            href="/"
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[#116cb4] transition-all"
          >
            <div className="text-3xl mb-3">
              ℹ️
            </div>

            <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#116cb4] transition-colors">
              প্রয়োজনীয় তথ্য
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              চাঁদপুরের নাগরিকদের প্রয়োজনীয় তথ্য ও নির্দেশনা।
            </p>
          </Link>

          {/* যোগাযোগ */}
          <Link
            href="/"
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[#116cb4] transition-all"
          >
            <div className="text-3xl mb-3">
              📞
            </div>

            <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#116cb4] transition-colors">
              যোগাযোগ
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              প্রয়োজনীয় যোগাযোগের তথ্য খুঁজে নিন।
            </p>
          </Link>

        </div>

      </section>

      {/* ======================================================= */}
      {/* Call To Action */}
      {/* ======================================================= */}

      <section className="mt-8">

        <div className="bg-[#116cb4] rounded-2xl p-6 md:p-8 text-white text-center shadow-md">

          <h2 className="text-2xl md:text-3xl font-bold">
            চাঁদপুর নাগরিক সেবায় স্বাগতম
          </h2>

          <p className="mt-3 text-white/90 text-base md:text-lg">
            নাগরিকদের প্রয়োজনীয় সেবা ও তথ্য সহজে পাওয়ার জন্য আমাদের
            প্ল্যাটফর্ম ব্যবহার করুন।
          </p>

          <Link
            href="/sheba"
            className="inline-flex mt-6 bg-white text-[#116cb4] px-7 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            নাগরিক সেবা দেখুন
          </Link>

        </div>

      </section>

    </main>
  );
}