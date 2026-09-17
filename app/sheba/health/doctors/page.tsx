"use client";

import { useState } from "react";
import Link from "next/link";

const departments = [
  "সব ডাক্তার",
  "মেডিসিন",
  "গাইনি ও প্রসূতি",
  "শিশু",
  "চক্ষু",
  "চর্ম ও যৌন",
  "কার্ডিওলজি",
  "ENT",
  "অর্থোপেডিক্স",
  "নিউরোলজি",
  "নেফ্রোলজি",
  "ইউরোলজি",
  "গ্যাস্ট্রোএন্টেরোলজি",
  "সার্জারি",
  "ডেন্টাল",
  "মানসিক রোগ",
  "ফিজিওথেরাপি",
  "কিডনি",
  "লিভার",
  "অন্যান্য",
];

type Chamber = {
  name: string;
  slug: string;
};

type Doctor = {
  name: string;
  specialty: string;
  department: string;
  degree: string;
  hospital?: string;
  address?: string;
  chambers: Chamber[];
  image: string;
  verified: boolean;
};

const doctors: Doctor[] = [
  {
    name: "ডা. মোঃ সাইফুল ইসলাম",
    specialty: "মেডিসিন বিশেষজ্ঞ",
    department: "মেডিসিন",
    degree: "MBBS, FCPS (Medicine)",
    hospital: "চাঁদপুর জেনারেল হাসপাতাল",
    address: "চাঁদপুর সদর, চাঁদপুর",
    chambers: [
      {
        name: "চাঁদপুর জেনারেল হাসপাতাল",
        slug: "chandpur-general-hospital-private",
      },
      {
        name: "চাঁদপুর মেডিকেল সেন্টার",
        slug: "chandpur-medical-center",
      },
    ],
    image: "/profile/anik-pic.svg",
    verified: true,
  },

  {
    name: "ডা. ফারজানা আক্তার",
    specialty: "গাইনি ও প্রসূতি বিশেষজ্ঞ",
    department: "গাইনি ও প্রসূতি",
    degree: "MBBS, FCPS (Gynae)",
    hospital: "চাঁদপুর মেডিকেল সেন্টার",
    address: "হাজী মহসিন রোড, চাঁদপুর",
    chambers: [
      {
        name: "চাঁদপুর মেডিকেল সেন্টার",
        slug: "chandpur-medical-center",
      },
      {
        name: "চাঁদপুর জেনারেল হাসপাতাল",
        slug: "chandpur-general-hospital-private",
      },
    ],
    image: "/profile/anik-pic.svg",
    verified: true,
  },

  {
    name: "ডা. তানভীর আহমেদ",
    specialty: "শিশু রোগ বিশেষজ্ঞ",
    department: "শিশু",
    degree: "MBBS, DCH",
    hospital: "চাঁদপুর ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল",
    address: "শহীদ মুক্তিযোদ্ধা রোড, চাঁদপুর",
    chambers: [
      {
        name: "চাঁদপুর ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল",
        slug: "chandpur-250-bed-general-hospital",
      },
    ],
    image: "/profile/anik-pic.svg",
    verified: false,
  },

  {
    name: "ডা. মাহবুবুর রহমান",
    specialty: "চক্ষু বিশেষজ্ঞ",
    department: "চক্ষু",
    degree: "MBBS, DO",
    hospital: "চাঁদপুর আই কেয়ার হাসপাতাল",
    address: "মিশন রোড, চাঁদপুর",
    chambers: [
      {
        name: "চাঁদপুর আই কেয়ার হাসপাতাল",
        slug: "chandpur-eye-care-hospital",
      },
      {
        name: "চাঁদপুর মেডিকেল সেন্টার",
        slug: "chandpur-medical-center",
      },
    ],
    image: "/profile/anik-pic.svg",
    verified: false,
  },

  {
    name: "ডা. নুসরাত জাহান",
    specialty: "চর্ম ও যৌন রোগ বিশেষজ্ঞ",
    department: "চর্ম ও যৌন",
    degree: "MBBS, DDV",
    hospital: "চাঁদপুর ডায়াগনস্টিক কমপ্লেক্স",
    address: "হাজী মহসিন রোড, চাঁদপুর",
    chambers: [
      {
        name: "চাঁদপুর ডায়াগনস্টিক কমপ্লেক্স",
        slug: "chandpur-diagnostic-complex",
      },
    ],
    image: "/profile/anik-pic.svg",
    verified: true,
  },

  {
    name: "ডা. আরিফুল ইসলাম",
    specialty: "হাড় ও জোড় বিশেষজ্ঞ",
    department: "অর্থোপেডিক্স",
    degree: "MBBS, MS (Ortho)",
    hospital: "চাঁদপুর অর্থোপেডিক হাসপাতাল",
    address: "চাঁদপুর সদর, চাঁদপুর",
    chambers: [
      {
        name: "চাঁদপুর অর্থোপেডিক হাসপাতাল",
        slug: "chandpur-orthopedic-hospital",
      },
      {
        name: "চাঁদপুর জেনারেল হাসপাতাল",
        slug: "chandpur-general-hospital-private",
      },
    ],
    image: "/profile/anik-pic.svg",
    verified: false,
  },

  {
    name: "ডা. কামরুল হাসান",
    specialty: "হৃদরোগ বিশেষজ্ঞ",
    department: "কার্ডিওলজি",
    degree: "MBBS, MD (Cardiology)",
    hospital: "চাঁদপুর হার্ট কেয়ার সেন্টার",
    address: "স্টেডিয়াম রোড, চাঁদপুর",
    chambers: [
      {
        name: "চাঁদপুর হার্ট কেয়ার সেন্টার",
        slug: "chandpur-heart-care-center",
      },
      {
        name: "চাঁদপুর জেনারেল হাসপাতাল",
        slug: "chandpur-general-hospital-private",
      },
      {
        name: "চাঁদপুর মেডিকেল সেন্টার",
        slug: "chandpur-medical-center",
      },
    ],
    image: "/profile/anik-pic.svg",
    verified: true,
  },

  {
    name: "ডা. সামিয়া রহমান",
    specialty: "নাক, কান ও গলা বিশেষজ্ঞ",
    department: "ENT",
    degree: "MBBS, FCPS (ENT)",
    hospital: "চাঁদপুর জেনারেল হাসপাতাল",
    address: "চাঁদপুর শহর, চাঁদপুর",
    chambers: [
      {
        name: "চাঁদপুর জেনারেল হাসপাতাল",
        slug: "chandpur-general-hospital-private",
      },
    ],
    image: "/profile/anik-pic.svg",
    verified: false,
  },
];

export default function DoctorsPage() {
  const [selectedDepartment, setSelectedDepartment] =
    useState("সব ডাক্তার");

  const [verifyingDoctor, setVerifyingDoctor] =
    useState<string | null>(null);

  const filteredDoctors =
    selectedDepartment === "সব ডাক্তার"
      ? doctors
      : doctors.filter(
          (doctor) => doctor.department === selectedDepartment
        );

  const handleVerify = (doctorName: string) => {
    setVerifyingDoctor(doctorName);

    setTimeout(() => {
      setVerifyingDoctor(null);
    }, 2000);
  };

  const doctorsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "চাঁদপুর ডাক্তার পয়েন্ট",
    description:
      "চাঁদপুরের বিভিন্ন চিকিৎসা বিভাগের ডাক্তারদের তালিকা, বিশেষজ্ঞতা, ডিগ্রি, হাসপাতাল ও চেম্বারের তথ্য।",
    url: "https://chandpurnagorik.com/sheba/health/doctors",
    numberOfItems: doctors.length,
    itemListElement: doctors.map((doctor, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Physician",
        name: doctor.name,
        medicalSpecialty: doctor.specialty,
        description: `${doctor.name} - ${doctor.specialty}. ${doctor.degree}`,
        worksFor: doctor.hospital
          ? {
              "@type": "MedicalOrganization",
              name: doctor.hospital,
            }
          : undefined,
        address: doctor.address
          ? {
              "@type": "PostalAddress",
              addressLocality: "Chandpur",
              addressRegion: "Chandpur",
              addressCountry: "BD",
              streetAddress: doctor.address,
            }
          : undefined,
        image: `https://chandpurnagorik.com${doctor.image}`,
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
        name: "ডাক্তার পয়েন্ট",
        item: "https://chandpurnagorik.com/sheba/health/doctors",
      },
    ],
  };

  return (
    <>
      {/* Doctor Structured Data */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(doctorsSchema),
        }}
      />

      {/* Breadcrumb Structured Data */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main className="min-h-[calc(100vh-75px)] sm:min-h-[calc(100vh-85px)] bg-gray-50 font-[Kalpurush]">
        <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-10">

          {/* =====================================================
              DEPARTMENT COVER
          ====================================================== */}

          <section
            className="bg-[#116cb4] rounded-2xl p-4 md:p-6 text-white shadow-md"
            aria-labelledby="doctor-department-title"
          >
            {/* Department Heading */}

            <div className="text-center mb-4 md:mb-5">
              <h1
                id="doctor-department-title"
                className="text-lg md:text-xl font-extrabold"
              >
                চাঁদপুর ডাক্তার পয়েন্ট
              </h1>

              <p className="mt-1 text-xs md:text-sm text-white/75">
                আপনার প্রয়োজনীয় চিকিৎসা বিভাগের ডাক্তার খুঁজুন
              </p>
            </div>

            {/* Department Buttons */}

            <div
              className="flex flex-wrap justify-center gap-2 md:gap-3"
              aria-label="চিকিৎসা বিভাগ নির্বাচন"
            >
              {departments.map((department) => {
                const active =
                  selectedDepartment === department;

                return (
                  <button
                    key={department}
                    type="button"
                    onClick={() =>
                      setSelectedDepartment(department)
                    }
                    aria-pressed={active}
                    className={`
                      px-3.5 md:px-5
                      py-2 md:py-2.5
                      rounded-xl
                      text-xs md:text-sm
                      font-bold
                      border
                      transition-all
                      duration-200
                      ${
                        active
                          ? "bg-white text-[#116cb4] border-white shadow-md scale-[1.02]"
                          : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40"
                      }
                    `}
                  >
                    {department}
                  </button>
                );
              })}
            </div>
          </section>

          {/* =====================================================
              RESULT HEADER
          ====================================================== */}

          <div className="mt-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                {selectedDepartment}
              </h2>

              <p className="mt-1 text-xs md:text-sm text-gray-500">
                {filteredDoctors.length} জন ডাক্তার পাওয়া গেছে
              </p>
            </div>

            {selectedDepartment !== "সব ডাক্তার" && (
              <button
                type="button"
                onClick={() =>
                  setSelectedDepartment("সব ডাক্তার")
                }
                className="
                  text-xs
                  md:text-sm
                  font-bold
                  text-[#116cb4]
                  hover:underline
                "
              >
                সব ডাক্তার দেখুন
              </button>
            )}
          </div>

          {/* =====================================================
              DOCTOR CARDS
          ====================================================== */}

          <section
            className="mt-4 md:mt-5"
            aria-labelledby="doctor-list-title"
          >
            <h2
              id="doctor-list-title"
              className="sr-only"
            >
              চাঁদপুরের ডাক্তারদের তালিকা
            </h2>

            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {filteredDoctors.map((doctor) => (
                  <article
                    key={doctor.name}
                    className="
                      group
                      relative
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      p-4
                      shadow-sm
                      hover:-translate-y-1
                      hover:shadow-lg
                      hover:border-blue-200
                      transition-all
                      duration-200
                      flex
                      flex-col
                    "
                  >
                    {/* =================================================
                        DOCTOR IMAGE
                    ================================================== */}

                    <div
                      className="
                        relative
                        w-full
                        aspect-[4/3]
                        rounded-xl
                        overflow-hidden
                        bg-blue-50
                        border
                        border-blue-100
                      "
                    >
                      <img
                        src={doctor.image}
                        alt={`${doctor.name} - ${doctor.specialty}`}
                        loading="lazy"
                        className="
                          w-full
                          h-full
                          object-cover
                          group-hover:scale-[1.02]
                          transition-transform
                          duration-200
                        "
                      />

                      {/* Image Overlay */}

                      <div className="absolute inset-0 bg-black/[0.03] pointer-events-none" />

                      {/* Main Watermark */}

                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                        <span className="text-white/35 text-xl md:text-2xl font-black tracking-widest whitespace-nowrap rotate-[-25deg] drop-shadow-sm">
                          চাঁদপুর নাগরিক
                        </span>
                      </div>

                      {/* Bottom Watermark */}

                      <div className="absolute bottom-2 right-2 z-10 pointer-events-none select-none">
                        <span className="bg-black/20 backdrop-blur-[1px] rounded px-2 py-1 text-[10px] md:text-xs font-bold text-white/70">
                          চাঁদপুর নাগরিক
                        </span>
                      </div>
                    </div>

                    {/* =================================================
                        DOCTOR INFORMATION
                    ================================================== */}

                    <div className="pt-4 flex flex-col flex-1">

                      {/* NAME + VERIFIED */}

                      <div className="relative">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base md:text-lg font-bold text-gray-800 leading-7">
                            {doctor.name}
                          </h3>

                          {/* Verified Badge */}

                          {doctor.verified && (
                            <button
                              type="button"
                              onClick={() =>
                                handleVerify(doctor.name)
                              }
                              aria-label={`${doctor.name} যাচাই করুন`}
                              className="
                                relative
                                shrink-0
                                w-3.5
                                h-3.5
                                md:w-4
                                md:h-4
                                hover:scale-110
                                transition-transform
                                duration-200
                              "
                            >
                              <img
                                src="/check.png"
                                alt="Verified"
                                className="w-full h-full object-contain"
                              />
                            </button>
                          )}
                        </div>

                        {/* VERIFICATION POPUP */}

                        {verifyingDoctor === doctor.name && (
                          <div className="absolute left-0 top-full mt-2 z-50 whitespace-nowrap">
                            <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-lg px-3 py-2 shadow-lg">
                              <img
                                src="/check.png"
                                alt=""
                                className="w-3 h-3 object-contain"
                              />

                              <span className="text-xs font-bold text-gray-700">
                                চাঁদপুর নাগরিক কর্তৃক যাচাইকৃত
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* DEGREE */}

                      <div
                        className="
                          mt-2
                          inline-flex
                          max-w-full
                          w-fit
                          rounded-lg
                          bg-blue-50
                          border
                          border-blue-100
                          px-3
                          py-1.5
                        "
                      >
                        <span
                          className="
                            text-xs
                            md:text-sm
                            font-extrabold
                            text-[#116cb4]
                            truncate
                          "
                        >
                          {doctor.degree}
                        </span>
                      </div>

                      {/* SPECIALTY */}

                      <p
                        className="
                          mt-1.5
                          text-sm
                          md:text-[15px]
                          font-bold
                          text-[#116cb4]
                          leading-5
                        "
                      >
                        {doctor.specialty}
                      </p>

                      {/* CURRENT HOSPITAL + ADDRESS */}

                      {(doctor.hospital || doctor.address) && (
                        <div className="mt-0.5">
                          {doctor.hospital && (
                            <p
                              className="
                                text-[15px]
                                md:text-base
                                font-extrabold
                                text-gray-700
                                leading-6
                              "
                            >
                              {doctor.hospital}
                            </p>
                          )}

                          {doctor.address && (
                            <p
                              className="
                                text-sm
                                text-gray-500
                                leading-5
                              "
                            >
                              📍 {doctor.address}
                            </p>
                          )}
                        </div>
                      )}

                      {/* CHAMBERS */}

                      {doctor.chambers.length > 0 && (
                        <div
                          className="
                            mt-2.5
                            pt-2.5
                            border-t
                            border-gray-100
                          "
                        >
                          <p
                            className="
                              text-[11px]
                              font-bold
                              text-gray-400
                              mb-1.5
                            "
                          >
                            চেম্বার
                          </p>

                          <div className="flex flex-col gap-1">
                            {doctor.chambers.map(
                              (chamber, index) => (
                                <Link
                                  key={`${chamber.slug}-${index}`}
                                  href={`/sheba/health/hospitals/${chamber.slug}`}
                                  aria-label={`${chamber.name} হাসপাতালের তথ্য দেখুন`}
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-2
                                    rounded-lg
                                    px-2
                                    py-1
                                    -mx-2
                                    text-sm
                                    font-bold
                                    text-gray-700
                                    hover:bg-blue-50
                                    hover:text-[#116cb4]
                                    transition-all
                                    duration-200
                                    group/chamber
                                  "
                                >
                                  {/* Hospital Name */}

                                  <div
                                    className="
                                      flex
                                      items-center
                                      gap-1.5
                                      min-w-0
                                    "
                                  >
                                    <span
                                      className="
                                        shrink-0
                                        w-5
                                        h-5
                                        rounded-full
                                        bg-blue-50
                                        flex
                                        items-center
                                        justify-center
                                        text-[11px]
                                        group-hover/chamber:bg-[#116cb4]
                                        group-hover/chamber:text-white
                                        transition-colors
                                      "
                                      aria-hidden="true"
                                    >
                                      🏥
                                    </span>

                                    <span
                                      className="
                                        truncate
                                        underline-offset-2
                                        group-hover/chamber:underline
                                      "
                                    >
                                      {chamber.name}
                                    </span>
                                  </div>

                                  {/* Click Indicator */}

                                  <span
                                    className="
                                      shrink-0
                                      flex
                                      items-center
                                      gap-1
                                      text-[10px]
                                      font-bold
                                      text-gray-400
                                      group-hover/chamber:text-[#116cb4]
                                      transition-colors
                                    "
                                  >
                                    দেখুন

                                    <span className="text-[12px]">
                                      →
                                    </span>
                                  </span>
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* APPOINTMENT */}

                      <div className="mt-auto pt-3">
                        <button
                          type="button"
                          className="
                            w-full
                            h-10
                            rounded-lg
                            bg-[#116cb4]
                            border
                            border-[#116cb4]
                            text-white
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-bold
                            text-sm
                            hover:bg-gray-400
                            hover:border-gray-400
                            transition-all
                            duration-200
                            cursor-pointer
                          "
                        >
                          <span>📅</span>

                          <span>
                            অ্যাপয়েন্টমেন্ট
                          </span>

                          <span
                            className="
                              text-[10px]
                              font-bold
                              opacity-80
                            "
                          >
                            (শীঘ্রই চালু হবে)
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* =====================================================
                 NO DOCTOR
              ====================================================== */

              <div
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  p-10
                  text-center
                  shadow-sm
                "
              >
                <div
                  className="text-4xl mb-3"
                  aria-hidden="true"
                >
                  👨‍⚕️
                </div>

                <h3 className="text-lg font-bold text-gray-800">
                  এই বিভাগে এখনো কোনো ডাক্তার যোগ করা হয়নি
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  অন্য বিভাগ নির্বাচন করে ডাক্তার দেখতে পারেন।
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedDepartment("সব ডাক্তার")
                  }
                  className="
                    mt-5
                    bg-[#116cb4]
                    text-white
                    px-5
                    py-2.5
                    rounded-xl
                    font-bold
                    text-sm
                    hover:bg-[#0d5b99]
                    transition-colors
                  "
                >
                  সব ডাক্তার দেখুন
                </button>
              </div>
            )}
          </section>

          {/* =====================================================
              NOTICE
          ====================================================== */}

          <section
            className="
              mt-6
              bg-white
              border
              border-blue-100
              rounded-xl
              p-4
              text-center
              shadow-sm
            "
          >
            <p className="text-sm text-gray-600 leading-6">
              <span className="font-bold text-gray-800">
                নোট:
              </span>{" "}
              ডাক্তারদের তথ্য যাচাই করে নিয়মিত আপডেট করা হবে।
            </p>
          </section>

          {/* =====================================================
              BACK TO HEALTH
          ====================================================== */}

          <div className="mt-6 text-center">
            <Link
              href="/sheba/health"
              className="
                inline-flex
                items-center
                gap-2
                bg-white
                border
                border-gray-200
                text-gray-700
                px-5
                py-2.5
                rounded-xl
                font-bold
                hover:bg-gray-100
                transition-colors
              "
            >
              ← স্বাস্থ্যসেবায় ফিরে যান
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}