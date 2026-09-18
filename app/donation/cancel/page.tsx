import Link from "next/link";

export default function DonationCancelPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-[Kalpurush]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-lg w-full text-center">
        <div
          className="text-5xl mb-4"
          aria-hidden="true"
        >
          ↩️
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          পেমেন্ট বাতিল করা হয়েছে
        </h1>

        <p className="text-gray-600 leading-7 mb-6">
          আপনি পেমেন্ট সম্পন্ন না করে ফিরে এসেছেন।
          <br />
          চাইলে আবার অনুদান দিতে পারেন।
        </p>

        <Link
          href="/donation"
          className="inline-flex bg-[#116cb4] hover:bg-[#0d5c9b] text-white px-5 py-3 rounded-xl font-bold transition"
        >
          আবার অনুদান দিন
        </Link>
      </div>
    </main>
  );
}