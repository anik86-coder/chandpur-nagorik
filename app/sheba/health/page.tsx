import Link from "next/link";

export const metadata = {
  title: "হাসপাতাল ও স্বাস্থ্যসেবা | চাঁদপুর নাগরিক",
  description:
    "চাঁদপুরের হাসপাতাল, ডায়াগনস্টিক সেন্টার, ডাক্তার, অ্যাম্বুলেন্স ও অনলাইন টেস্ট সেবা।",
};

const services = [
  {
    title: "হাসপাতাল",
    icon: "🏥",
    href: "/sheba/health/hospitals",
  },
  {
    title: "ডায়াগনস্টিক সেন্টার",
    icon: "🔬",
    href: "/sheba/health/diagnostic",
  },
  {
    title: "ডাক্তার পয়েন্ট",
    icon: "👨‍⚕️",
    href: "/sheba/health/doctors",
  },
  {
    title: "অ্যাম্বুলেন্স",
    icon: "🚑",
    href: "/sheba/health/ambulance",
  },
  {
    title: "অনলাইন টেস্ট",
    icon: "🧪",
    href: "/sheba/health/online-test",
  },
];

export default function HospitalHealthPage() {
  return (
    <main className="min-h-[calc(100vh-75px)] sm:min-h-[calc(100vh-85px)] bg-gray-50 font-[Kalpurush]">
      <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-10">
        {/* Hero */}
        <section className="bg-[#116cb4] rounded-2xl p-6 md:p-10 text-white text-center shadow-md">
          <div className="text-5xl md:text-6xl mb-3">🏥</div>

          <h1 className="text-2xl md:text-4xl font-bold">
            হাসপাতাল ও স্বাস্থ্যসেবা
          </h1>

          <p className="mt-3 text-white/90 text-base md:text-lg">
            চাঁদপুরের প্রয়োজনীয় স্বাস্থ্যসেবা এক জায়গায়।
          </p>
        </section>

        {/* Service Boxes */}
        <section className="mt-6 md:mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group bg-white border border-gray-200 rounded-2xl min-h-[210px] md:min-h-[230px] p-6 md:p-7 shadow-sm hover:shadow-lg hover:border-[#116cb4]/40 hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-blue-50 flex items-center justify-center text-5xl md:text-6xl group-hover:scale-105 transition-transform">
                  {service.icon}
                </div>

                <h2 className="mt-6 text-xl md:text-2xl font-bold text-gray-800 group-hover:text-[#116cb4] transition-colors">
                  {service.title}
                </h2>

                <div className="mt-4 inline-flex items-center gap-2 text-sm md:text-base font-bold text-[#116cb4]">
                  বিস্তারিত দেখুন
                  <span className="text-xl group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Notice */}
        <section className="mt-6 bg-white border border-blue-100 rounded-2xl p-5 text-center shadow-sm">
          <p className="text-sm md:text-base text-gray-600 leading-7">
            <span className="font-bold text-gray-800">নোট:</span> এখানে প্রদর্শিত
            তথ্য ধীরে ধীরে যুক্ত ও আপডেট করা হবে। জরুরি পরিস্থিতিতে সরাসরি
            সংশ্লিষ্ট হাসপাতাল বা জরুরি সেবা নম্বরে যোগাযোগ করুন।
          </p>
        </section>

        {/* Back */}
        <div className="mt-6 text-center">
          <Link
            href="/sheba"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            ← নাগরিক সেবায় ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
