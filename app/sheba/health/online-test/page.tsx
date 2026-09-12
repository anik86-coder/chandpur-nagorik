import Link from "next/link";

export default function OnlineTestPage() {
  return (
    <main className="min-h-screen bg-gray-50 font-[Kalpurush]">
      {/* HEADER */}
      <section className="relative overflow-hidden bg-[#116cb4] text-white">
        {/* Decorative shapes */}
        <div className="absolute -right-20 -top-24 w-64 h-64 rounded-full bg-white/[0.06]" />

        <div className="absolute -left-24 -bottom-32 w-72 h-72 rounded-full bg-black/[0.05]" />

        <div className="absolute right-[18%] -top-20 w-20 h-64 rotate-[28deg] bg-white/[0.035]" />

        <div className="relative max-w-5xl mx-auto px-4 py-5 md:py-6">
          <Link
            href="/sheba/health"
            className="
              inline-flex items-center gap-1.5
              text-xs md:text-sm
              font-bold
              text-white/85
              hover:text-white
              transition
            "
          >
            ← ফিরে যান
          </Link>

          <div className="text-center mt-3">
            <div className="text-3xl md:text-4xl mb-1">
              🧪
            </div>

            <h1 className="text-lg md:text-xl font-extrabold">
              অনলাইন টেস্ট
            </h1>

            <p className="mt-1 text-xs md:text-sm text-white/75">
              অনলাইনে স্বাস্থ্য পরীক্ষা ও রিপোর্ট সংক্রান্ত সেবা
            </p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <div
          className="
            bg-white
            border border-gray-200
            rounded-2xl
            shadow-sm
            overflow-hidden
          "
        >
          {/* Top accent */}
          <div className="h-1.5 bg-[#116cb4]" />

          <div className="px-5 py-10 md:px-10 md:py-14 text-center">
            {/* Icon */}
            <div
              className="
                mx-auto
                w-20 h-20 md:w-24 md:h-24
                rounded-full
                bg-blue-50
                flex items-center justify-center
                text-4xl md:text-5xl
              "
            >
              🧪
            </div>

            {/* Status */}
            <div
              className="
                inline-flex items-center gap-2
                mt-6
                px-3.5 py-1.5
                rounded-full
                bg-amber-50
                border border-amber-100
                text-amber-700
                text-xs
                font-extrabold
              "
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              শীঘ্রই চালু হবে
            </div>

            {/* Heading */}
            <h2
              className="
                mt-5
                text-xl md:text-2xl
                font-extrabold
                text-gray-800
              "
            >
              অনলাইন টেস্ট সেবা এখনও চালু হয়নি
            </h2>

            {/* Description */}
            <p
              className="
                max-w-xl
                mx-auto
                mt-3
                text-sm md:text-base
                leading-7
                text-gray-500
              "
            >
              চাঁদপুর নাগরিক-এর মাধ্যমে অনলাইনে স্বাস্থ্য পরীক্ষা ও
              রিপোর্ট সংক্রান্ত সেবা চালুর কাজ চলছে। সেবাটি চালু হলে
              এখান থেকেই প্রয়োজনীয় তথ্য ও সুবিধা পাওয়া যাবে।
            </p>

            {/* Feature preview */}
            <div
              className="
                mt-8
                grid grid-cols-1 sm:grid-cols-3
                gap-3
                text-left
              "
            >
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <div className="text-xl mb-2">🧪</div>

                <p className="text-sm font-extrabold text-gray-700">
                  অনলাইন টেস্ট
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  সহজে টেস্টের তথ্য
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <div className="text-xl mb-2">📄</div>

                <p className="text-sm font-extrabold text-gray-700">
                  রিপোর্ট
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  রিপোর্ট দেখার সুবিধা
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <div className="text-xl mb-2">📱</div>

                <p className="text-sm font-extrabold text-gray-700">
                  অনলাইন সেবা
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  সহজ ও দ্রুত ব্যবহার
                </p>
              </div>
            </div>

            {/* Back button */}
            <Link
              href="/sheba/health"
              className="
                inline-flex items-center justify-center
                mt-8
                h-10
                px-5
                rounded-xl
                bg-[#116cb4]
                text-white
                text-sm
                font-extrabold
                hover:bg-[#0d5d9d]
                transition
              "
            >
              ← স্বাস্থ্য সেবায় ফিরে যান
            </Link>
          </div>
        </div>

        {/* Bottom notice */}
        <p className="text-center text-xs text-gray-400 mt-5">
          সেবাটি চালু হলে এই পেজ থেকেই বিস্তারিত জানানো হবে।
        </p>
      </section>
    </main>
  );
}