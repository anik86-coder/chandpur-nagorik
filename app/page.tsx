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

export default function Home() {
  return (
    <>
      {/* SEO Structured Data */}

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

        {/* Main Hero */}

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

        {/* Important Services
            Design intentionally kept minimal.
            Direct internal links help search engines
            discover important sections of the website.
        */}

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