"use client";

import { useRouter } from "next/navigation";

type Ambulance = {
  name: string;
  phone: string;
  address: string;
  type: string;
};

const ambulances: Ambulance[] = [
  {
    name: "চাঁদপুর সদর হাসপাতাল অ্যাম্বুলেন্স",
    phone: "01700000000",
    address: "চাঁদপুর সদর, চাঁদপুর",
    type: "হাসপাতাল অ্যাম্বুলেন্স",
  },
  {
    name: "চাঁদপুর প্রাইভেট অ্যাম্বুলেন্স সার্ভিস",
    phone: "01800000000",
    address: "চাঁদপুর সদর, চাঁদপুর",
    type: "প্রাইভেট অ্যাম্বুলেন্স",
  },
  {
    name: "জরুরি অ্যাম্বুলেন্স সার্ভিস",
    phone: "01900000000",
    address: "চাঁদপুর সদর, চাঁদপুর",
    type: "২৪ ঘণ্টা",
  },
  {
    name: "লাইফ সাপোর্ট অ্যাম্বুলেন্স সার্ভিস",
    phone: "01600000000",
    address: "চাঁদপুর সদর, চাঁদপুর",
    type: "লাইফ সাপোর্ট",
  },
];

export default function AmbulancePage() {
  const router = useRouter();

  const ambulanceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "চাঁদপুর অ্যাম্বুলেন্স সেবা",
    alternateName: "Chandpur Ambulance Service",
    url: "https://chandpurnagorik.com/sheba/health/ambulance",
    description:
      "চাঁদপুরের অ্যাম্বুলেন্স সেবার তালিকা, ফোন নম্বর, ঠিকানা ও সেবার ধরন।",
    numberOfItems: ambulances.length,
    itemListElement: ambulances.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "EmergencyService",
        name: item.name,
        telephone: item.phone,
        description: item.type,
        address: {
          "@type": "PostalAddress",
          streetAddress: item.address,
          addressLocality: "Chandpur",
          addressRegion: "Chandpur",
          addressCountry: "BD",
        },
        areaServed: {
          "@type": "City",
          name: "Chandpur",
        },
      },
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
        name: "অ্যাম্বুলেন্স সেবা",
        item: "https://chandpurnagorik.com/sheba/health/ambulance",
      },
    ],
  };

  return (
    <>
      {/* Ambulance Structured Data */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ambulanceSchema),
        }}
      />

      {/* Breadcrumb Structured Data */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main className="min-h-screen bg-[#f8f9fa] font-[Kalpurush]">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <section
          className="relative overflow-hidden bg-[#d91e2b] text-white"
          aria-labelledby="ambulance-page-title"
        >
          {/* Background glow */}

          <div
            className="
              absolute
              -right-20 -top-24
              w-72 h-72
              rounded-full
              bg-white/[0.06]
              blur-[1px]
            "
            aria-hidden="true"
          />

          <div
            className="
              absolute
              -left-24 -bottom-36
              w-80 h-80
              rounded-full
              bg-black/[0.07]
            "
            aria-hidden="true"
          />

          {/* Diagonal graphic structure */}

          <div
            className="
              absolute
              right-[15%] -top-20
              w-32 h-[280px]
              rotate-[28deg]
              bg-white/[0.035]
            "
            aria-hidden="true"
          />

          <div
            className="
              absolute
              right-[27%] -top-16
              w-10 h-[250px]
              rotate-[28deg]
              bg-white/[0.025]
            "
            aria-hidden="true"
          />

          <div
            className="
              absolute
              left-[18%] -bottom-24
              w-24 h-[220px]
              rotate-[28deg]
              bg-black/[0.025]
            "
            aria-hidden="true"
          />

          {/* Small medical pattern */}

          <div
            className="absolute right-5 bottom-3 opacity-[0.07] select-none"
            aria-hidden="true"
          >
            <div className="text-[90px] md:text-[120px] font-black leading-none">
              +
            </div>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 py-5 md:py-6">

            {/* Back button */}

            <button
              type="button"
              onClick={() => router.back()}
              className="
                absolute
                left-4 top-1/2
                -translate-y-1/2
                flex items-center gap-1.5
                text-white/90
                text-xs md:text-sm
                font-bold
                hover:text-white
                transition
                z-10
              "
              aria-label="আগের পেজে ফিরে যান"
            >
              <span className="text-base">←</span>
              <span>ফিরে যান</span>
            </button>

            {/* Heading */}

            <div className="flex flex-col items-center text-center">

              <div className="flex items-center justify-center gap-2.5">

                <span
                  className="text-2xl md:text-3xl drop-shadow-sm"
                  aria-hidden="true"
                >
                  🚑
                </span>

                <h1
                  id="ambulance-page-title"
                  className="text-lg md:text-xl font-extrabold tracking-tight"
                >
                  চাঁদপুর অ্যাম্বুলেন্স সেবা
                </h1>

              </div>

              <p className="mt-1 text-xs md:text-sm text-white/80">
                জরুরি প্রয়োজনে অ্যাম্বুলেন্সের যোগাযোগ নম্বর
              </p>

              {/* Emergency line */}

              <div className="flex items-center gap-2 mt-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                  aria-hidden="true"
                />

                <span className="text-[10px] md:text-[11px] font-bold tracking-wide text-white/75">
                  জরুরি পরিবহন সেবা
                </span>

                <span
                  className="w-1.5 h-1.5 rounded-full bg-white/50"
                  aria-hidden="true"
                />
              </div>

            </div>
          </div>

          {/* Bottom graphic line */}

          <div className="relative h-[3px] bg-black/10">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-white/20" />
            <div className="absolute right-0 top-0 h-full w-1/5 bg-black/10" />
          </div>
        </section>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <section
          className="max-w-5xl mx-auto px-4 py-5 md:py-7"
          aria-labelledby="ambulance-list-title"
        >

          {/* Section heading */}

          <div className="mb-3">

            <p className="text-[10px] md:text-[11px] font-bold text-[#d91e2b]">
              EMERGENCY TRANSPORT
            </p>

            <div className="flex items-center justify-between mt-0.5">

              <h2
                id="ambulance-list-title"
                className="text-base md:text-lg font-extrabold text-gray-800"
              >
                অ্যাম্বুলেন্স তালিকা
              </h2>

              <span className="text-[11px] md:text-xs font-bold text-gray-400">
                {ambulances.length}টি সেবা
              </span>

            </div>
          </div>

          {/* =====================================================
              LIST
          ====================================================== */}

          <div
            className="
              bg-white
              border border-gray-200
              rounded-2xl
              overflow-hidden
              shadow-sm
            "
          >
            {ambulances.map((item, index) => (
              <article
                key={`${item.phone}-${index}`}
                className={`
                  relative
                  px-4 md:px-6
                  py-4 md:py-5
                  hover:bg-red-50/40
                  transition-colors
                  ${
                    index !== ambulances.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                `}
              >

                {/* Red indicator */}

                <div
                  className="
                    absolute
                    left-0 top-0 bottom-0
                    w-1
                    bg-[#d91e2b]
                  "
                  aria-hidden="true"
                />

                <div
                  className="
                    flex flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-3
                  "
                >

                  {/* LEFT */}

                  <div className="min-w-0">

                    <div className="flex items-start gap-3">

                      {/* Ambulance icon */}

                      <div
                        className="
                          shrink-0
                          w-9 h-9
                          rounded-lg
                          bg-red-50
                          border border-red-100
                          flex items-center justify-center
                          text-lg
                        "
                        aria-hidden="true"
                      >
                        🚑
                      </div>

                      {/* Name */}

                      <div className="min-w-0">

                        <h3
                          className="
                            text-sm md:text-base
                            font-extrabold
                            text-gray-800
                            leading-5
                          "
                        >
                          {item.name}
                        </h3>

                        {/* Type */}

                        <span
                          className="
                            inline-flex
                            mt-1
                            px-2 py-0.5
                            rounded-md
                            bg-red-50
                            text-[#d91e2b]
                            text-[10px]
                            font-bold
                          "
                        >
                          {item.type}
                        </span>

                      </div>
                    </div>

                    {/* Details */}

                    <div
                      className="
                        mt-2.5
                        ml-0 md:ml-[48px]
                        flex flex-col
                        sm:flex-row
                        sm:flex-wrap
                        gap-x-5
                        gap-y-1
                        text-xs md:text-sm
                        text-gray-500
                      "
                    >
                      <span>
                        <span className="text-gray-400" aria-hidden="true">
                          📍
                        </span>{" "}
                        {item.address}
                      </span>

                      <span>
                        <span className="text-gray-400" aria-hidden="true">
                          📞
                        </span>{" "}
                        {item.phone}
                      </span>
                    </div>

                  </div>

                  {/* CALL BUTTON */}

                  <a
                    href={`tel:${item.phone}`}
                    className="
                      shrink-0
                      h-10
                      px-5
                      rounded-xl
                      bg-[#116cb4]
                      text-white
                      flex items-center justify-center
                      gap-2
                      text-sm
                      font-extrabold
                      shadow-sm
                      hover:bg-[#0d5d9d]
                      hover:shadow-md
                      active:scale-[0.98]
                      transition-all
                    "
                    aria-label={`${item.name}-এ ${item.phone} নম্বরে কল করুন`}
                  >
                    <span
                      className="text-base"
                      aria-hidden="true"
                    >
                      📞
                    </span>

                    <span>কল করুন</span>
                  </a>

                </div>
              </article>
            ))}
          </div>

          {/* =====================================================
              NOTICE
          ====================================================== */}

          <div
            className="
              mt-4
              rounded-xl
              border border-red-100
              bg-red-50
              px-4 py-3
            "
          >
            <div className="flex items-start gap-2.5">

              <div
                className="
                  shrink-0
                  w-7 h-7
                  rounded-lg
                  bg-white
                  flex items-center justify-center
                  shadow-sm
                  text-sm
                "
                aria-hidden="true"
              >
                ⚠️
              </div>

              <div>

                <p className="text-xs font-extrabold text-[#b91c2a]">
                  জরুরি প্রয়োজনে
                </p>

                <p className="text-xs md:text-sm text-red-800/70 leading-5 mt-0.5">
                  অ্যাম্বুলেন্সের অবস্থান, ভাড়া ও সেবা পাওয়ার বিষয়টি
                  ফোন করে নিশ্চিত করে নিন।
                </p>

              </div>

            </div>
          </div>

        </section>
      </main>
    </>
  );
}