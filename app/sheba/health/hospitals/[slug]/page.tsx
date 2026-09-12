import Link from "next/link";
import { notFound } from "next/navigation";

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

export async function generateStaticParams() {
  return hospitals.map((hospital) => ({
    slug: hospital.slug,
  }));
}

export default async function HospitalProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const hospital = hospitals.find(
    (item) => item.slug === slug
  );

  if (!hospital) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-75px)] sm:min-h-[calc(100vh-85px)] bg-gray-50 font-[Kalpurush]">
      <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-10">

        {/* Header */}
        <section className="bg-[#116cb4] rounded-2xl p-6 md:p-10 text-white text-center shadow-md">

          <div className="text-5xl md:text-6xl mb-3">
            🏥
          </div>

          <h1 className="text-xl md:text-3xl font-bold leading-8">
            {hospital.name}
          </h1>

          <p className="mt-2 text-white/90 text-sm md:text-base">
            হাসপাতালের বিস্তারিত তথ্য
          </p>

        </section>

        {/* Profile Card */}
        <section className="mt-6 md:mt-8">

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            {/* Profile Title */}
            <div className="bg-blue-50 border-b border-blue-100 px-5 py-4 md:px-6">
              <h2 className="text-lg md:text-xl font-bold text-[#116cb4]">
                হাসপাতালের তথ্য
              </h2>
            </div>

            {/* Information */}
            <div className="p-5 md:p-7 space-y-5">

              {/* Name */}
              <div>
                <p className="text-xs md:text-sm font-bold text-gray-400 mb-1">
                  🏥 হাসপাতালের নাম
                </p>

                <p className="text-base md:text-lg font-bold text-gray-800">
                  {hospital.name}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-xs md:text-sm font-bold text-gray-400 mb-1">
                  📞 ফোন নম্বর
                </p>

                <a
                  href={`tel:${hospital.phone}`}
                  className="text-base md:text-lg font-bold text-[#116cb4] hover:underline"
                >
                  {hospital.phone}
                </a>
              </div>

              {/* Address */}
              <div>
                <p className="text-xs md:text-sm font-bold text-gray-400 mb-1">
                  📍 ঠিকানা
                </p>

                <p className="text-base md:text-lg font-semibold text-gray-700">
                  {hospital.address}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Appointment / Contact */}
        <section className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

          <a
            href={`tel:${hospital.phone}`}
            className="h-12 rounded-xl bg-[#116cb4] text-white flex items-center justify-center gap-2 font-bold hover:bg-[#0d5b99] transition-colors"
          >
            📞 হাসপাতালে যোগাযোগ
          </a>

          <Link
            href="/sheba/health/doctors"
            className="h-12 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center gap-2 font-bold hover:bg-gray-100 transition-colors"
          >
            👨‍⚕️ ডাক্তার দেখুন
          </Link>

        </section>

        {/* Back */}
        <div className="mt-6 text-center">

          <Link
            href="/sheba/health/hospitals"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            ← হাসপাতালের তালিকায় ফিরে যান
          </Link>

        </div>

      </div>
    </main>
  );
}