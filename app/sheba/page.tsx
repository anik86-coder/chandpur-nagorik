
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
    description: "চাঁদপুর জেলার প্রয়োজনীয় নাগরিক সেবাগুলো এক জায়গায়।",
    url: "https://chandpurnagorik.com/sheba",
    siteName: "চাঁদপুর নাগরিক",
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "নাগরিক সেবা | চাঁদপুর নাগরিক",
    description: "চাঁদপুর জেলার প্রয়োজনীয় নাগরিক সেবাগুলো এক জায়গায়।",
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
    title: "অনুদান",
    icon: "🤝",
    link: "/donation",
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
  },
  {
    title: "বিদ্যুৎ অফিস",
    icon: "⚡",
    link: "/sheba/electricity",
  },
  {
    title: "পৌরসভা ও ডিসি অফিস",
    icon: "🏢",
    link: "/sheba/municipality",
  },
];

const activeServices = [
  "/sheba/blood-bank",
  "/sheba/emergency",
  "/donation",
];

export default function ServicesPage() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-screen-xl px-4 py-12 font-[Kalpurush]">
      <header className="mb-12 border-b border-gray-200 pb-6 text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
          নাগরিক সেবা
        </h1>

        <p className="text-[17px] text-gray-600">
          চাঁদপুরের মানুষের প্রয়োজনীয় নাগরিক সেবাগুলো এক জায়গায়।
        </p>
      </header>

      <section aria-labelledby="services-heading">
        <h2 id="services-heading" className="sr-only">
          চাঁদপুরের নাগরিক সেবার তালিকা
        </h2>

        <nav aria-label="চাঁদপুর নাগরিক সেবা">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {services.map((service) => {
              const isActive = activeServices.includes(service.link);

              const card = (
                <div
                  className={`relative flex h-[150px] flex-col items-center justify-center rounded-xl border p-5 text-center transition-all duration-300 md:h-[160px] md:p-6 ${
                    isActive
                      ? "border-gray-200 bg-white shadow-sm hover:-translate-y-1 hover:border-[#116cb4] hover:shadow-md"
                      : "border-gray-300 bg-gray-100 opacity-75 grayscale-[25%] cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`mb-3 block text-4xl transition-transform ${
                      isActive ? "group-hover:scale-110" : ""
                    }`}
                    aria-hidden="true"
                  >
                    {service.icon}
                  </span>

                  <h3
                    className={`text-[16px] font-bold leading-tight md:text-[17px] ${
                      isActive
                        ? "text-gray-800 group-hover:text-[#116cb4] transition-colors"
                        : "text-gray-700"
                    }`}
                  >
                    {service.title}
                  </h3>

                  {!isActive && (
                    
<div className="absolute inset-0 flex items-end justify-center rounded-xl bg-white/20 pb-4">
  <span className="rounded-full border border-gray-200 bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm md:text-sm">
    শীঘ্রই চালু হবে
  </span>
</div>

                  )}
                </div>
              );

              if (!isActive) {
                return (
                  <div
                    key={service.link}
                    aria-disabled="true"
                    className="cursor-not-allowed"
                  >
                    {card}
                  </div>
                );
              }

              return (
                <Link
                  href={service.link}
                  key={service.link}
                  aria-label={`${service.title} সেবা দেখুন`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#116cb4] focus-visible:ring-offset-2"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </nav>
      </section>
    </main>
  );
}
