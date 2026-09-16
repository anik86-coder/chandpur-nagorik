import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "চাঁদপুর হাসপাতাল তালিকা | Hospitals in Chandpur",

  description:
    "চাঁদপুরের হাসপাতালের তালিকা, ফোন নম্বর, ঠিকানা এবং হাসপাতালের প্রোফাইল দেখুন। চাঁদপুরের সরকারি ও বেসরকারি হাসপাতালের প্রয়োজনীয় তথ্য এক জায়গায়।",

  keywords: [
    "চাঁদপুর হাসপাতাল",
    "চাঁদপুর হাসপাতাল তালিকা",
    "Chandpur Hospital",
    "Hospitals in Chandpur",
    "চাঁদপুরের হাসপাতাল",
    "চাঁদপুর সরকারি হাসপাতাল",
    "চাঁদপুর বেসরকারি হাসপাতাল",
    "Chandpur Hospital List",
    "চাঁদপুর হাসপাতাল ফোন নম্বর",
  ],

  alternates: {
    canonical: "https://chandpurnagorik.com/sheba/health/hospitals",
  },

  openGraph: {
    title: "চাঁদপুর হাসপাতাল তালিকা | Hospitals in Chandpur",

    description:
      "চাঁদপুরের হাসপাতালের নাম, ফোন নম্বর, ঠিকানা ও প্রোফাইল তথ্য।",

    url: "https://chandpurnagorik.com/sheba/health/hospitals",

    siteName: "চাঁদপুর নাগরিক",

    locale: "bn_BD",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "চাঁদপুর হাসপাতাল তালিকা | Hospitals in Chandpur",

    description:
      "চাঁদপুরের হাসপাতালের নাম, ফোন নম্বর ও ঠিকানা।",
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
};

const hospitals = [
  {
    name: "চাঁদপুর ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল",
    slug: "chandpur-250-bed-general-hospital",
    phone: "01701248196",
    address: "চাঁদপুর সদর, চাঁদপুর",
  },
  {
    name: "চাঁদপুর জেনারেল হাসপাতাল (প্রাঃ)",
    slug: "chandpur-general-hospital-private",
    phone: "01711033702",
    address: "স্টেডিয়াম রোড, চাঁদপুর",
  },
  {
    name: "মিডল্যান্ড হাসপাতাল প্রাইভেট লিমিটেড",
    slug: "midland-hospital-private-limited",
    phone: "01712633457",
    address: "হাজী মহসিন রোড, চাঁদপুর",
  },
  {
    name: "ক্রিসেন্ট হাসপাতাল",
    slug: "crescent-hospital",
    phone: "01628735142",
    address: "শহীদ মুক্তিযোদ্ধা রোড, চাঁদপুর",
  },
  {
    name: "কর্ণফুলী হাসপাতাল",
    slug: "karnaphuli-hospital",
    phone: "01869708139",
    address: "পাটোয়ারী রোড, চাঁদপুর",
  },
  {
    name: "রেইনবো হাসপাতাল",
    slug: "rainbow-hospital",
    phone: "01715511833",
    address: "মিশন রোড, চাঁদপুর",
  },
  {
    name: "বেলভিউ হাসপাতাল",
    slug: "bellview-hospital",
    phone: "01676977758",
    address: "বঙ্গবন্ধু সরক, চাঁদপুর",
  },
  {
    name: "প্রিমিয়ার হাসপাতাল ও ডায়াগনস্টিক সেন্টার",
    slug: "premier-hospital-diagnostic-center",
    phone: "01963911451",
    address: "হাজী মহসিন রোড, চাঁদপুর",
  },
  {
    name: "ফ্যামিলি কেয়ার হাসপাতাল ও ডায়াগনস্টিক সেন্টার",
    slug: "family-care-hospital-diagnostic-center",
    phone: "01722110394",
    address: "হাজী মহসিন রোড, চাঁদপুর",
  },
  {
    name: "চাঁদপুর মেডিকেল কলেজ হাসপাতাল",
    slug: "chandpur-medical-college-hospital",
    phone: "01612968241",
    address: "কবি নজরুল রোড, চাঁদপুর",
  },
];

const hospitalListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",

  name: "চাঁদপুর হাসপাতাল তালিকা",

  description:
    "চাঁদপুরের হাসপাতালের নাম, ফোন নম্বর ও ঠিকানার তালিকা।",

  url: "https://chandpurnagorik.com/sheba/health/hospitals",

  itemListElement: hospitals.map((hospital, index) => ({
    "@type": "ListItem",

    position: index + 1,

    name: hospital.name,

    url: `https://chandpurnagorik.com/sheba/health/hospitals/${hospital.slug}`,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",

  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "চাঁদপুর নাগরিক",
      item: "https://chandpurnagorik.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "স্বাস্থ্যসেবা",
      item: "https://chandpurnagorik.com/sheba/health",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "হাসপাতাল",
      item: "https://chandpurnagorik.com/sheba/health/hospitals",
    },
  ],
};

export default function HospitalsPage() {
  return (
    <>
      {/* SEO Structured Data */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hospitalListSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main className="min-h-[calc(100vh-75px)] sm:min-h-[calc(100vh-85px)] bg-gray-50 font-[Kalpurush]">
        <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-10">

          {/* Header */}

          <section
            className="bg-[#116cb4] rounded-2xl p-6 md:p-8 text-white text-center shadow-md"
            aria-labelledby="hospital-page-title"
          >
            <div
              className="text-4xl md:text-5xl mb-2"
              aria-hidden="true"
            >
              🏥
            </div>

            <h1
              id="hospital-page-title"
              className="text-2xl md:text-3xl font-bold"
            >
              হাসপাতাল
            </h1>

            <p className="mt-2 text-white/90 text-sm md:text-base">
              চাঁদপুরের হাসপাতালের তালিকা
            </p>
          </section>

          {/* Hospital List */}

          <section
            className="mt-6 md:mt-8 space-y-3"
            aria-labelledby="hospital-list-title"
          >
            <h2
              id="hospital-list-title"
              className="sr-only"
            >
              চাঁদপুরের হাসপাতালের তালিকা
            </h2>

            {hospitals.map((hospital, index) => (
              <Link
                key={hospital.name}
                href={`/sheba/health/hospitals/${hospital.slug}`}
                className="block group"
                aria-label={`${hospital.name} এর প্রোফাইল দেখুন`}
              >
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 md:px-5 md:py-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200 transition-all duration-200">

                  <div className="flex items-start gap-3 md:gap-4">

                    {/* Serial */}

                    <div
                      className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-blue-50 text-[#116cb4] flex items-center justify-center font-bold text-base md:text-lg group-hover:bg-[#116cb4] group-hover:text-white transition-colors"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </div>

                    {/* Information */}

                    <div className="min-w-0 flex-1">

                      {/* Hospital Name */}

                      <h2 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-[#116cb4] transition-colors">
                        {hospital.name}
                      </h2>

                      {/* Phone */}

                      <p className="mt-1 text-sm md:text-base text-[#116cb4] font-semibold">
                        📞 {hospital.phone}
                      </p>

                      {/* Address */}

                      <p className="mt-1 text-sm md:text-base text-gray-600">
                        📍 {hospital.address}
                      </p>

                      {/* Profile */}

                      <div className="mt-2">
                        <span className="text-xs md:text-sm font-bold text-[#116cb4]">
                          হাসপাতালের প্রোফাইল দেখুন →
                        </span>
                      </div>

                    </div>

                  </div>

                </div>
              </Link>
            ))}

          </section>

          {/* Back */}

          <div className="mt-6 text-center">
            <Link
              href="/sheba/health"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              ← স্বাস্থ্যসেবায় ফিরে যান
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}