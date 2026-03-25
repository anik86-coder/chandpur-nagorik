import Link from "next/link";

export const metadata = {
  title: "নাগরিক সেবা | চাঁদপুর নাগরিক",
  description: "চাঁদপুর জেলার সকল গুরুত্বপূর্ণ নাগরিক সেবার তথ্য ও যোগাযোগ নম্বর",
};

export default function ServicesPage() {
  // সবগুলো লিংক আপডেট করে /sheba/ এর আন্ডারে দেওয়া হলো
  const services = [
    { title: "জরুরি সেবা", icon: "🚨", link: "/sheba/emergency" },
    { title: "রক্তদাতা সংগঠন", icon: "🩸", link: "/sheba/blood-bank" },
    { title: "হাসপাতাল ও ক্লিনিক", icon: "🏥", link: "/sheba/hospital" },
    { title: "ফায়ার সার্ভিস", icon: "🚒", link: "/sheba/fire-service" },
    { title: "পুলিশ স্টেশন", icon: "🚓", link: "/sheba/police" },
    { title: "বিদ্যুৎ অফিস", icon: "⚡", link: "/sheba/electricity" },
    { title: "অ্যাম্বুলেন্স", icon: "🚑", link: "/sheba/ambulance" },
    { title: "পৌরসভা সেবা", icon: "🏢", link: "/sheba/municipality" },
  ];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12 font-[Kalpurush] min-h-[60vh]">
      
      {/* Page Heading */}
      <div className="text-center mb-12 border-b border-gray-200 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          নাগরিক সেবা
        </h1>
        <p className="text-gray-600 text-[17px]">
          আপনার প্রয়োজনীয় সেবাটি বেছে নিন। চাঁদপুরের সকল জরুরি যোগাযোগ নম্বর এক জায়গায়।
        </p>
      </div>

      {/* Button Grid (Jekhane click korle notun page open hobe) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {services.map((service, index) => (
          <Link href={service.link} key={index}>
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-[#116cb4] transition-all cursor-pointer group h-[160px]">
              
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform block">
                {service.icon}
              </span>
              
              <h2 className="text-[17px] font-bold text-gray-800 group-hover:text-[#116cb4] transition-colors leading-tight">
                {service.title}
              </h2>
              
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}