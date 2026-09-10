import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-6 font-[Kalpurush]">

      <section className="mt-4">
        <div className="bg-[#116cb4] rounded-2xl p-6 md:p-10 text-white text-center shadow-md">

          <h1 className="text-2xl md:text-3xl font-bold">
            চাঁদপুর নাগরিক সেবায় স্বাগতম
          </h1>

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
