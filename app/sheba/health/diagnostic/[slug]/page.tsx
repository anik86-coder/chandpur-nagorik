import Link from "next/link";
import { notFound } from "next/navigation";

const diagnostics = [
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

export async function generateStaticParams() {
  return diagnostics.map((item) => ({
    slug: item.slug,
  }));
}

export default async function DiagnosticProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const diagnostic = diagnostics.find(
    (item) => item.slug === slug
  );

  if (!diagnostic) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 font-[Kalpurush]">
      {/* TOP */}
      <section className="bg-[#116cb4] text-white">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <Link
            href="/sheba/health/diagnostic"
            className="text-sm text-white/80 hover:text-white transition"
          >
            ← সব ডায়াগনস্টিক সেন্টার
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* BLUE TOP */}
          <div className="h-3 bg-[#116cb4]" />

          <div className="p-5 md:p-8">
            {/* TITLE */}
            <div className="flex items-start gap-4">
              <div
                className="
                  w-16 h-16 md:w-20 md:h-20
                  shrink-0 rounded-2xl
                  bg-blue-50
                  flex items-center justify-center
                  text-3xl md:text-4xl
                "
              >
                🔬
              </div>

              <div className="min-w-0">
                <h1 className="text-xl md:text-3xl font-extrabold text-gray-800 leading-snug">
                  {diagnostic.name}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  ডায়াগনস্টিক ও স্বাস্থ্য পরীক্ষা কেন্দ্র
                </p>
              </div>
            </div>

            {/* INFO */}
            <div className="grid md:grid-cols-2 gap-3 mt-7">
              {/* ADDRESS */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold text-gray-400 mb-1">
                  ঠিকানা
                </p>

                <p className="text-sm font-bold text-gray-700 leading-6">
                  📍 {diagnostic.address}
                </p>
              </div>

              {/* HOURS */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold text-gray-400 mb-1">
                  সেবা সময়
                </p>

                <p className="text-sm font-bold text-gray-700 leading-6">
                  🕐 {diagnostic.hours}
                </p>
              </div>
            </div>

            {/* PHONE */}
            <div className="mt-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold text-gray-400 mb-1">
                  ফোন নম্বর
                </p>

                {diagnostic.phone ? (
                  <p className="text-sm font-bold text-gray-700">
                    📞 {diagnostic.phone}
                  </p>
                ) : (
                  <p className="text-sm font-bold text-gray-400">
                    ফোন নম্বর যুক্ত হয়নি
                  </p>
                )}
              </div>
            </div>

            {/* SERVICES */}
            <div className="mt-7">
              <h2 className="text-lg font-extrabold text-gray-800">
                প্রধান সেবাসমূহ
              </h2>

              <div className="flex flex-wrap gap-2 mt-3">
                {diagnostic.services.map((service) => (
                  <span
                    key={service}
                    className="
                      px-3 py-2
                      rounded-xl
                      bg-blue-50
                      text-[#116cb4]
                      text-sm font-bold
                    "
                  >
                    🔬 {service}
                  </span>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              {diagnostic.phone ? (
                <a
                  href={`tel:${diagnostic.phone}`}
                  className="
                    h-12 rounded-xl
                    bg-[#116cb4]
                    text-white
                    flex items-center justify-center gap-2
                    font-bold
                    hover:bg-[#0d5d9d]
                    transition
                  "
                >
                  📞 ফোন করুন
                </a>
              ) : (
                <div
                  className="
                    h-12 rounded-xl
                    bg-gray-100 text-gray-400
                    flex items-center justify-center
                    font-bold
                  "
                >
                  📞 ফোন নম্বর নেই
                </div>
              )}

              <Link
                href="/sheba/health/diagnostic"
                className="
                  h-12 rounded-xl
                  border border-gray-200
                  text-gray-700
                  flex items-center justify-center
                  font-bold
                  hover:bg-gray-50
                  transition
                "
              >
                ← ফিরে যান
              </Link>
            </div>

            {/* NOTICE */}
            <div
              className="
                mt-6 rounded-xl
                bg-blue-50 border border-blue-100
                p-4
              "
            >
              <p className="text-xs md:text-sm text-blue-800 leading-6">
                ℹ️ ডায়াগনস্টিক সেন্টারের সেবা, সময় ও ফোন নম্বর পরিবর্তিত
                হতে পারে। যাওয়ার আগে ফোন করে তথ্য নিশ্চিত করে নিন।
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}