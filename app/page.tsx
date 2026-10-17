
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

const siteUrl = "https://chandpurnagorik.com";

const siteTitle = "চাঁদপুর নাগরিক | Chandpur Nagorik";

const siteDescription =
  "চাঁদপুরের নাগরিকদের জন্য প্রয়োজনীয় নাগরিক সেবা ও তথ্যের নির্ভরযোগ্য প্ল্যাটফর্ম। ব্লাড ব্যাংক, হাসপাতাল, ডাক্তার, ডায়াগনস্টিক সেন্টার এবং স্থানীয় নাগরিক সেবা সম্পর্কে জানুন.";

/* =========================
   Homepage SEO Metadata
========================= */

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,

  alternates: {
    canonical: "/",
  },

  keywords: [
    "চাঁদপুর নাগরিক",
    "Chandpur Nagorik",
    "চাঁদপুর",
    "Chandpur",
    "চাঁদপুর নাগরিক সেবা",
    "Chandpur Citizen Services",
    "চাঁদপুর ব্লাড ব্যাংক",
    "চাঁদপুর রক্তদাতা",
    "চাঁদপুর হাসপাতাল",
    "চাঁদপুর ডাক্তার",
    "চাঁদপুর ডাক্তার তালিকা",
    "চাঁদপুর ডায়াগনস্টিক",
    "চাঁদপুর স্বাস্থ্যসেবা",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: siteUrl,
    siteName: "চাঁদপুর নাগরিক",
    title: siteTitle,
    description: siteDescription,
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

/* =========================
   Homepage
========================= */

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6 font-[Kalpurush]">
      {/* Main Hero */}

      <section className="mt-4" aria-labelledby="home-heading">
        <div className="rounded-2xl bg-[#116cb4] p-6 text-center text-white shadow-md md:p-10">
          <h1
            id="home-heading"
            className="text-2xl font-bold md:text-3xl"
          >
            চাঁদপুর নাগরিক সেবায় স্বাগতম
          </h1>

          <p className="mt-3 text-base text-white/90 md:text-lg">
            চাঁদপুরের নাগরিকদের প্রয়োজনীয় সেবা ও তথ্য সহজে পাওয়ার
            জন্য আমাদের প্ল্যাটফর্ম ব্যবহার করুন।
          </p>

          {/* Main CTA Button with Live Motion */}
  
          <div className="cta-float mt-6 inline-block">
            <Link
              href="/sheba"
              aria-label="চাঁদপুর নাগরিকের সকল সেবা দেখুন"
              className="
                group relative inline-flex
                items-center justify-center gap-2
                overflow-hidden rounded-xl bg-white
                px-7 py-3 font-bold text-[#116cb4]
                shadow-[0_6px_20px_rgba(0,0,0,0.18)]
                transition-all duration-300
                hover:-translate-y-1 hover:scale-[1.03]
                hover:bg-blue-50
                hover:shadow-[0_10px_28px_rgba(0,0,0,0.25)]
                active:translate-y-0 active:scale-[0.98]
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-white
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#116cb4]
              "
            >
              {/* Shimmer Effect */}

              <span
                aria-hidden="true"
                className="
                  absolute inset-0 -translate-x-full
                  bg-gradient-to-r from-transparent
                  via-blue-100/70 to-transparent
                  transition-transform duration-700
                  group-hover:translate-x-full
                "
              />

              <span className="relative z-10">
                নাগরিক সেবা দেখুন
              </span>

              <span
                aria-hidden="true"
                className="
                  relative z-10 text-lg
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Cards */}

      <section
        className="mt-7"
        aria-labelledby="service-flow"
      >
        <h2 id="service-flow" className="sr-only">
          চাঁদপুর নাগরিকের সেবাসমূহ
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Blood Bank */}

          <div
            className="
              group rounded-2xl border border-red-200/80
              bg-gradient-to-br from-red-50/90
              via-white/75 to-rose-100/80 p-5
              text-center
              shadow-[0_8px_25px_rgba(239,68,68,0.12)]
              backdrop-blur-xl transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[0_14px_30px_rgba(239,68,68,0.18)]
            "
          >
            <div
              aria-hidden="true"
              className="
                mx-auto flex h-14 w-14 items-center
                justify-center rounded-full border
                border-red-200 bg-red-100/80 text-3xl
                shadow-sm transition-transform duration-300
                group-hover:scale-110
              "
            >
              🩸
            </div>

            <h3 className="mt-3 text-base font-bold text-red-700">
              ব্লাড ব্যাংক
            </h3>

            <p className="mt-1 text-xs text-red-600/70">
              রক্তের ডোনার খুঁজুন
            </p>
          </div>

          {/* Hospital */}

          <div
            className="
              group rounded-2xl border border-blue-200/80
              bg-gradient-to-br from-blue-50/90
              via-white/75 to-sky-100/80 p-5
              text-center
              shadow-[0_8px_25px_rgba(37,99,235,0.12)]
              backdrop-blur-xl transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[0_14px_30px_rgba(37,99,235,0.18)]
            "
          >
            <div
              aria-hidden="true"
              className="
                mx-auto flex h-14 w-14 items-center
                justify-center rounded-full border
                border-blue-200 bg-blue-100/80 text-3xl
                shadow-sm transition-transform duration-300
                group-hover:scale-110
              "
            >
              🏥
            </div>

            <h3 className="mt-3 text-base font-bold text-blue-700">
              হাসপাতাল
            </h3>

            <p className="mt-1 text-xs text-blue-600/70">
              হাসপাতালের তথ্য
            </p>
          </div>

          {/* Coming Soon */}

          <div
            className="
              group rounded-2xl border border-purple-200/80
              bg-gradient-to-br from-purple-50/90
              via-white/75 to-indigo-100/80 p-5
              text-center
              shadow-[0_8px_25px_rgba(124,58,237,0.12)]
              backdrop-blur-xl transition-all duration-300
              hover:-translate-y-1
              hover:shadow-[0_14px_30px_rgba(124,58,237,0.18)]
            "
          >
            <div
              aria-hidden="true"
              className="
                mx-auto flex h-14 w-14 items-center
                justify-center rounded-full border
                border-purple-200 bg-purple-100/80 text-3xl
                shadow-sm transition-transform duration-300
                group-hover:scale-110
              "
            >
              ✨
            </div>

            <h3 className="mt-3 text-base font-bold text-purple-700">
              আরও সেবা আসছে
            </h3>

            <p className="mt-1 text-xs text-purple-600/70">
              নতুন সেবা খুব শীঘ্রই
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
