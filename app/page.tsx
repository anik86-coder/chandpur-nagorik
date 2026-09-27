import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

/* =========================
   SEO Metadata
========================= */

export const metadata: Metadata = {
  title: "চাঁদপুর নাগরিক | Chandpur Nagorik",

  description:
    "চাঁদপুরের নাগরিকদের জন্য প্রয়োজনীয় নাগরিক সেবা ও তথ্যের নির্ভরযোগ্য প্ল্যাটফর্ম। ব্লাড ব্যাংক, হাসপাতাল, ডাক্তার, ডায়াগনস্টিক সেন্টার ও অন্যান্য নাগরিক সেবা এক জায়গায়।",

  keywords: [
    "চাঁদপুর নাগরিক",
    "Chandpur Nagorik",
    "চাঁদপুর",
    "Chandpur",
    "চাঁদপুর নাগরিক সেবা",
    "Chandpur Citizen Services",
    "চাঁদপুর ব্লাড ব্যাংক",
    "চাঁদপুর হাসপাতাল",
    "চাঁদপুর ডাক্তার",
    "চাঁদপুর ডায়াগনস্টিক",
  ],

  metadataBase: new URL("https://chandpurnagorik.com"),

  alternates: {
    canonical: "https://chandpurnagorik.com/",
  },

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
    title: "চাঁদপুর নাগরিক | Chandpur Nagorik",

    description:
      "চাঁদপুরের নাগরিকদের জন্য প্রয়োজনীয় নাগরিক সেবা ও তথ্যের নির্ভরযোগ্য প্ল্যাটফর্ম।",

    url: "https://chandpurnagorik.com/",

    siteName: "চাঁদপুর নাগরিক",

    locale: "bn_BD",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "চাঁদপুর নাগরিক | Chandpur Nagorik",

    description:
      "চাঁদপুরের নাগরিকদের জন্য প্রয়োজনীয় নাগরিক সেবা ও তথ্যের নির্ভরযোগ্য প্ল্যাটফর্ম।",
  },
};

/* =========================
   Organization Structured Data
========================= */

const organizationSchema = {
  "@context": "https://schema.org",

  "@type": "Organization",

  name: "Chandpur Nagorik",

  alternateName: "চাঁদপুর নাগরিক",

  url: "https://chandpurnagorik.com/",

  description:
    "চাঁদপুরের নাগরিকদের জন্য প্রয়োজনীয় নাগরিক সেবা ও তথ্যের নির্ভরযোগ্য প্ল্যাটফর্ম।",

  areaServed: {
    "@type": "City",
    name: "Chandpur",
  },
};

/* =========================
   WebSite Structured Data
========================= */

const websiteSchema = {
  "@context": "https://schema.org",

  "@type": "WebSite",

  name: "Chandpur Nagorik",

  alternateName: "চাঁদপুর নাগরিক",

  url: "https://chandpurnagorik.com/",
};

/* =========================
   Home Page
========================= */

export default function Home() {
  return (
    <>
      {/* =========================
          SEO Structured Data
      ========================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <main className="max-w-screen-xl mx-auto px-4 py-6 font-[Kalpurush]">

        {/* =========================
            Main Hero
        ========================= */}

        <section className="mt-4">
          <div className="bg-[#116cb4] rounded-2xl p-6 md:p-10 text-white text-center shadow-md">

            <h1 className="text-2xl md:text-3xl font-bold">
              চাঁদপুর নাগরিক সেবায় স্বাগতম
            </h1>

            <p className="mt-3 text-white/90 text-base md:text-lg">
              নাগরিকদের প্রয়োজনীয় সেবা ও তথ্য সহজে পাওয়ার জন্য আমাদের
              প্ল্যাটফর্ম ব্যবহার করুন।
            </p>

            {/* =========================
                Main CTA Button
            ========================= */}

            <Link
              href="/sheba"
              className="
                group
                relative
                inline-flex
                items-center
                justify-center
                gap-2
                mt-6
                overflow-hidden
                rounded-xl
                bg-white
                px-7
                py-3
                font-bold
                text-[#116cb4]
                shadow-[0_6px_20px_rgba(0,0,0,0.18)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:scale-[1.03]
                hover:bg-blue-50
                hover:shadow-[0_10px_28px_rgba(0,0,0,0.25)]
                active:translate-y-0
                active:scale-[0.98]
              "
            >
              {/* Shimmer Effect */}

              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-blue-100/70
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />

              <span className="relative z-10">
                নাগরিক সেবা দেখুন
              </span>

              <span
                className="
                  relative
                  z-10
                  text-lg
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </Link>

          </div>
        </section>

        {/* =========================
            Service Cards
            Non-clickable
        ========================= */}

        <section
          className="mt-7"
          aria-labelledby="service-flow"
        >
          <h2
            id="service-flow"
            className="sr-only"
          >
            চাঁদপুর নাগরিকের সেবাসমূহ
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* =========================
                Blood Bank
            ========================= */}

            <div
              className="
                group
                rounded-2xl
                border
                border-red-200/80
                bg-gradient-to-br
                from-red-50/90
                via-white/75
                to-rose-100/80
                p-5
                text-center
                shadow-[0_8px_25px_rgba(239,68,68,0.12)]
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_14px_30px_rgba(239,68,68,0.18)]
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-red-200
                  bg-red-100/80
                  text-3xl
                  shadow-sm
                  transition-transform
                  duration-300
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

            {/* =========================
                Hospital
            ========================= */}

            <div
              className="
                group
                rounded-2xl
                border
                border-blue-200/80
                bg-gradient-to-br
                from-blue-50/90
                via-white/75
                to-sky-100/80
                p-5
                text-center
                shadow-[0_8px_25px_rgba(37,99,235,0.12)]
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_14px_30px_rgba(37,99,235,0.18)]
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-blue-200
                  bg-blue-100/80
                  text-3xl
                  shadow-sm
                  transition-transform
                  duration-300
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

            {/* =========================
                Coming Soon
            ========================= */}

            <div
              className="
                group
                rounded-2xl
                border
                border-purple-200/80
                bg-gradient-to-br
                from-purple-50/90
                via-white/75
                to-indigo-100/80
                p-5
                text-center
                shadow-[0_8px_25px_rgba(124,58,237,0.12)]
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_14px_30px_rgba(124,58,237,0.18)]
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-purple-200
                  bg-purple-100/80
                  text-3xl
                  shadow-sm
                  transition-transform
                  duration-300
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

        {/* =========================
            Important Services
            SEO Internal Links
        ========================= */}

        <section
          className="mt-8"
          aria-labelledby="important-services"
        >
          <h2
            id="important-services"
            className="sr-only"
          >
            চাঁদপুর নাগরিকের গুরুত্বপূর্ণ সেবা
          </h2>

          <nav
            aria-label="গুরুত্বপূর্ণ নাগরিক সেবা"
            className="flex flex-wrap justify-center gap-2"
          >
            <Link
              href="/sheba/blood-bank"
              className="sr-only"
            >
              চাঁদপুর ব্লাড ব্যাংক
            </Link>

            <Link
              href="/sheba/health/hospitals"
              className="sr-only"
            >
              চাঁদপুর হাসপাতাল
            </Link>

            <Link
              href="/sheba/health/doctors"
              className="sr-only"
            >
              চাঁদপুর ডাক্তার পয়েন্ট
            </Link>

            <Link
              href="/sheba/health/diagnostic"
              className="sr-only"
            >
              চাঁদপুর ডায়াগনস্টিক সেন্টার
            </Link>

            <Link
              href="/sheba/health/ambulance"
              className="sr-only"
            >
              চাঁদপুর অ্যাম্বুলেন্স সেবা
            </Link>
          </nav>
        </section>

      </main>
    </>
  );
}