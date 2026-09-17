import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "নাগরিক সেবা | চাঁদপুর নাগরিক",

  description:
    "চাঁদপুর জেলার প্রয়োজনীয় নাগরিক সেবা এক জায়গায়। ব্লাড ব্যাংক, জরুরি সেবা, জেলা তথ্য, হাসপাতাল ও স্বাস্থ্যসেবা, পুলিশ ও থানা, বিদ্যুৎ অফিস, পৌরসভা ও ডিসি অফিস এবং অনুদানের তথ্য।",

  keywords: [
    "চাঁদপুর নাগরিক সেবা",
    "চাঁদপুর সেবা",
    "Chandpur Citizen Services",
    "Chandpur Nagorik",
    "চাঁদপুর ব্লাড ব্যাংক",
    "চাঁদপুর জরুরি সেবা",
    "চাঁদপুর জেলা তথ্য",
    "চাঁদপুর হাসপাতাল",
    "চাঁদপুর স্বাস্থ্যসেবা",
    "চাঁদপুর পুলিশ",
    "চাঁদপুর থানা",
    "চাঁদপুর বিদ্যুৎ অফিস",
    "চাঁদপুর পৌরসভা",
    "চাঁদপুর ডিসি অফিস",
  ],

  alternates: {
    canonical: "https://chandpurnagorik.com/sheba",
  },

  openGraph: {
    title: "নাগরিক সেবা | চাঁদপুর নাগরিক",

    description:
      "চাঁদপুর জেলার প্রয়োজনীয় নাগরিক সেবাগুলো এক জায়গায়।",

    url: "https://chandpurnagorik.com/sheba",

    siteName: "চাঁদপুর নাগরিক",

    locale: "bn_BD",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "নাগরিক সেবা | চাঁদপুর নাগরিক",

    description:
      "চাঁদপুর জেলার প্রয়োজনীয় নাগরিক সেবাগুলো এক জায়গায়।",
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

export default function ServicesPage() {
  const services = [
    {
      title: "ব্লাড ব্যাংক",
      icon: "🩸",
      link: "/sheba/blood-bank",
    },
    {
      title: "জরুরি সেবা (৯৯৯)",
      icon: "🚨",
      link: "/sheba/emergency",
    },
    {
      title: "জেলা তথ্য",
      icon: "🗺️",
      link: "/sheba/zilla-info",
    },
    {
      title: "হাসপাতাল ও স্বাস্থ্যসেবা",
      icon: "🏥",
      link: "/sheba/health",
    },
    {
      title: "পুলিশ ও থানা",
      icon: "🚓",
      link: "/sheba/police",
      comingSoon: true,
    },
    {
      title: "বিদ্যুৎ অফিস",
      icon: "⚡",
      link: "/sheba/electricity",
      comingSoon: true,
    },
    {
      title: "পৌরসভা ও ডিসি অফিস",
      icon: "🏢",
      link: "/sheba/municipality",
      comingSoon: true,
    },
    {
      title: "অনুদান",
      icon: "🤝",
      link: "/donation",
    },
  ];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12 font-[Kalpurush] min-h-[60vh]">
      {/* Page Header */}

      <header className="text-center mb-12 border-b border-gray-200 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          নাগরিক সেবা
        </h1>

        <p className="text-gray-600 text-[17px]">
          চাঁদপুরের মানুষের প্রয়োজনীয় নাগরিক সেবাগুলো এক জায়গায়।
        </p>
      </header>

      {/* Services */}

      <section aria-labelledby="services-heading">
        <h2 id="services-heading" className="sr-only">
          চাঁদপুরের নাগরিক সেবার তালিকা
        </h2>

        <nav aria-label="চাঁদপুর নাগরিক সেবা">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {services.map((service) => {
              // যেসব সেবা এখনো চালু হয়নি
              if (service.comingSoon) {
                return (
                  <div
                    key={service.link}
                    className="relative group bg-white border border-gray-200 rounded-xl p-5 md:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-[#116cb4] transition-all cursor-not-allowed h-[150px] md:h-[160px]"
                  >
                    <span
                      className="text-4xl mb-3 group-hover:scale-110 transition-transform block"
                      aria-hidden="true"
                    >
                      {service.icon}
                    </span>

                    <h2 className="text-[16px] md:text-[17px] font-bold text-gray-800 leading-tight">
                      {service.title}
                    </h2>

                    {/* Hover message */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-sm md:text-base font-bold text-[#116cb4] px-3">
                        শীঘ্রই চালু হবে
                      </span>
                    </div>
                  </div>
                );
              }

              // চালু থাকা সেবাগুলো আগের মতোই কাজ করবে
              return (
                <Link
                  href={service.link}
                  key={service.link}
                  aria-label={`${service.title} সেবা দেখুন`}
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-[#116cb4] transition-all cursor-pointer group h-[150px] md:h-[160px]">
                    <span
                      className="text-4xl mb-3 group-hover:scale-110 transition-transform block"
                      aria-hidden="true"
                    >
                      {service.icon}
                    </span>

                    <h2 className="text-[16px] md:text-[17px] font-bold text-gray-800 group-hover:text-[#116cb4] transition-colors leading-tight">
                      {service.title}
                    </h2>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </section>
    </main>
  );
}