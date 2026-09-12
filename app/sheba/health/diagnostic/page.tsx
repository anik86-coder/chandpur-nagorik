"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Diagnostic = {
  name: string;
  slug: string;
  address: string;
  phone?: string;
  hours: string;
  services: string[];
};

const diagnostics: Diagnostic[] = [
  {
    name: "New Life Diagnostic Center Chandpur",
    slug: "new-life-diagnostic-center",
    address: "259 Cumilla Road, Chandpur",
    phone: "01924800145",
    hours: "সকাল ৯টা – রাত ৮টা",
    services: ["প্যাথলজি", "রক্ত পরীক্ষা", "ইমেজিং", "স্বাস্থ্য পরীক্ষা"],
  },
  {
    name: "Green Diagnostic Center",
    slug: "green-diagnostic-center",
    address: "Shahid Muktijoddha Road, Chandpur",
    phone: "01621018697",
    hours: "সকাল ৯টা – রাত ৮:৩০টা",
    services: ["প্যাথলজি", "রক্ত পরীক্ষা", "ইমেজিং"],
  },
  {
    name: "Chandpur Metropolitan Diagnostic Centre",
    slug: "chandpur-metropolitan-diagnostic-centre",
    address: "12 Stadium Road, Chandpur",
    phone: "01711621450",
    hours: "সকাল ৮:৩০টা – রাত ১১টা",
    services: ["প্যাথলজি", "ইমেজিং", "ডায়াগনস্টিক টেস্ট"],
  },
  {
    name: "NOVA AID DIAGNOSTIC CENTER",
    slug: "nova-aid-diagnostic-center",
    address: "Stadium Road, Chandpur",
    phone: "01717226200",
    hours: "সকাল ৯টা – রাত ১০টা",
    services: ["প্যাথলজি", "রক্ত পরীক্ষা", "ইমেজিং"],
  },
  {
    name: "Chandpur Digital Diagnostic Center",
    slug: "chandpur-digital-diagnostic-center",
    address: "Chandpur",
    phone: "01841206757",
    hours: "সকাল ১০টা – রাত ৯টা",
    services: ["ডিজিটাল ডায়াগনস্টিক", "প্যাথলজি", "ইমেজিং"],
  },
  {
    name: "Chandpur CT Scan & Imaging Center",
    slug: "chandpur-ct-scan-imaging-center",
    address: "29 Mission Road, Chandpur",
    phone: "01790233555",
    hours: "সকাল ৭টা – রাত ১১টা",
    services: ["CT Scan", "Imaging", "ডায়াগনস্টিক"],
  },
  {
    name: "City Aid Diagnostic & Consultation Center",
    slug: "city-aid-diagnostic-consultation-center",
    address: "Main City Road, Chandpur",
    hours: "সকাল ৮টা – রাত ১০টা",
    services: ["ডায়াগনস্টিক", "প্যাথলজি", "কনসালটেশন"],
  },
  {
    name: "Adhunic Diagnostic Centre",
    slug: "adhunic-diagnostic-centre",
    address: "Madrasha Gate, Stadium Road, Chandpur",
    phone: "01716441903",
    hours: "২৪ ঘণ্টা",
    services: ["প্যাথলজি", "ডায়াগনস্টিক", "ইমেজিং"],
  },
  {
    name: "Mohona Diagnostic Centre",
    slug: "mohona-diagnostic-centre",
    address: "Chandpur",
    phone: "01826502426",
    hours: "সকাল ৯টা – সন্ধ্যা ৭টা",
    services: ["প্যাথলজি", "ডায়াগনস্টিক টেস্ট"],
  },
  {
    name: "ডাক্তার বাড়ী ডায়াগনস্টিক সেন্টার",
    slug: "doctor-bari-diagnostic-center",
    address: "Haji Mohsin Road, Chandpur",
    phone: "01804141666",
    hours: "সকাল ৭টা – রাত ১১টা",
    services: ["প্যাথলজি", "রক্ত পরীক্ষা", "ডায়াগনস্টিক"],
  },
  {
    name: "National Diagnostic Centre",
    slug: "national-diagnostic-centre",
    address: "Main City Road, Chandpur",
    hours: "২৪ ঘণ্টা",
    services: ["প্যাথলজি", "ডায়াগনস্টিক"],
  },
  {
    name: "Smart Medical & Diagnostic Center",
    slug: "smart-medical-diagnostic-center",
    address: "Soudia City, Chandpur",
    hours: "সকাল ৯টা – বিকাল ৫টা",
    services: ["Medical Imaging", "Diagnostic"],
  },
  {
    name: "KAWSAR SHUVO DIAGNOSTIC CENTER",
    slug: "kawsar-shuvo-diagnostic-center",
    address:
      "326, Premier Tower, 2nd Floor, Hazi Mohsin Road, Alimpara, Chandpur Sadar",
    phone: "01334962946",
    hours: "সেবা সময় সেন্টারের সাথে যোগাযোগ করে নিশ্চিত করুন",
    services: [
      "Pathology",
      "Blood Test",
      "Urine Test",
      "Specialized Diagnostic",
    ],
  },
  {
    name: "Labaid Diagnostic Chandpur",
    slug: "labaid-diagnostic-chandpur",
    address: "House-789, Haji Mohsin Road, Chandpur 3600",
    phone: "01766660525",
    hours: "সেন্টারের সাথে যোগাযোগ করে নিশ্চিত করুন",
    services: ["Pathology", "Radiology", "Wellness Packages"],
  },
];

export default function DiagnosticPage() {
  const [search, setSearch] = useState("");

  const filteredDiagnostics = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return diagnostics;

    return diagnostics.filter((item) =>
      [item.name, item.address, item.services.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-gray-50 font-[Kalpurush]">
      {/* TOP COVER */}
      <section className="bg-[#116cb4] text-white">
        <div className="max-w-7xl mx-auto px-4 py-7 md:py-9">
          <div className="text-center">
            <div className="text-4xl mb-2">🔬</div>

            <h1 className="text-2xl md:text-3xl font-extrabold">
              ডায়াগনস্টিক সেন্টার
            </h1>

            <p className="mt-2 text-sm md:text-base text-white/80">
              চাঁদপুরের ডায়াগনস্টিক ও পরীক্ষা কেন্দ্রসমূহ
            </p>
          </div>

          {/* SEARCH */}
          <div className="max-w-2xl mx-auto mt-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ডায়াগনস্টিক সেন্টারের নাম বা ঠিকানা লিখুন..."
                className="
                  w-full h-12 rounded-xl
                  bg-white text-gray-800
                  pl-11 pr-4
                  outline-none
                  shadow-lg
                  placeholder:text-gray-400
                  text-sm md:text-base
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* RESULT COUNT */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-gray-800">
              ডায়াগনস্টিক সেন্টার
            </h2>

            <p className="text-xs md:text-sm text-gray-500 mt-1">
              মোট {filteredDiagnostics.length}টি প্রতিষ্ঠান
            </p>
          </div>
        </div>

        {/* EMPTY */}
        {filteredDiagnostics.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="text-4xl mb-3">🔍</div>

            <h3 className="font-bold text-gray-700">
              কোনো ডায়াগনস্টিক সেন্টার পাওয়া যায়নি
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              অন্য নাম বা ঠিকানা দিয়ে খুঁজে দেখুন।
            </p>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredDiagnostics.map((item) => (
            <Link
              key={item.slug}
              href={`/sheba/health/diagnostic/${item.slug}`}
              className="
                group bg-white rounded-2xl
                border border-gray-100
                shadow-sm hover:shadow-lg
                hover:-translate-y-0.5
                transition-all duration-200
                overflow-hidden
              "
            >
              {/* BLUE TOP */}
              <div className="h-2 bg-[#116cb4]" />

              <div className="p-4 md:p-5">
                {/* NAME */}
                <div className="flex items-start gap-3">
                  <div
                    className="
                      shrink-0 w-11 h-11 rounded-xl
                      bg-blue-50
                      flex items-center justify-center
                      text-xl
                    "
                  >
                    🔬
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        text-base md:text-lg
                        font-extrabold
                        text-gray-800
                        leading-snug
                        group-hover:text-[#116cb4]
                        transition-colors
                      "
                    >
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="mt-4 flex gap-2 text-sm text-gray-600">
                  <span className="shrink-0">📍</span>
                  <span>{item.address}</span>
                </div>

                {/* HOURS */}
                <div className="mt-2 flex gap-2 text-sm text-gray-600">
                  <span className="shrink-0">🕐</span>
                  <span>{item.hours}</span>
                </div>

                {/* SERVICES */}
                <div className="mt-4">
                  <p className="text-[11px] font-bold text-gray-400 mb-2">
                    সেবাসমূহ
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {item.services.slice(0, 4).map((service) => (
                      <span
                        key={service}
                        className="
                          px-2.5 py-1 rounded-full
                          bg-blue-50 text-[#116cb4]
                          text-[11px] font-bold
                        "
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BOTTOM */}
                <div
                  className="
                    mt-5 pt-3
                    border-t border-gray-100
                    flex items-center justify-between
                    gap-3
                  "
                >
                  {item.phone ? (
                    <span className="text-sm font-bold text-gray-700 truncate">
                      📞 {item.phone}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      ফোন নম্বর যুক্ত হয়নি
                    </span>
                  )}

                  <span
                    className="
                      shrink-0
                      text-xs font-bold text-[#116cb4]
                      group-hover:translate-x-1
                      transition-transform
                    "
                  >
                    বিস্তারিত →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}