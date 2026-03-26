import Link from "next/link";

export const metadata = {
  title: "নাগরিক সেবা | চাঁদপুর নাগরিক",
  description: "চাঁদপুর জেলার সকল গুরুত্বপূর্ণ নাগরিক সেবার তথ্য ও যোগাযোগ নম্বর",
};

export default function ServicesPage() {
  // চাঁদপুরের মানুষের জন্য প্রয়োজনীয় সকল সেবার তালিকা
  const services = [
    { title: "জরুরি সেবা (৯৯৯)", icon: "🚨", link: "/sheba/emergency" },
    { title: "ব্লাড ব্যাংক", icon: "🩸", link: "/sheba/blood-bank" },
    { title: "জেলা তথ্য", icon: "🗺️", link: "/sheba/zilla-info" },
    { title: "হাসপাতাল ও ক্লিনিক", icon: "🏥", link: "/sheba/hospital" },
    { title: "বিশেষজ্ঞ চিকিৎসক", icon: "👨‍⚕️", link: "/sheba/doctors" },
    { title: "ফার্মেসি (২৪ ঘণ্টা)", icon: "💊", link: "/sheba/pharmacy" },
    { title: "অ্যাম্বুলেন্স", icon: "🚑", link: "/sheba/ambulance" },
    { title: "ফায়ার সার্ভিস", icon: "🚒", link: "/sheba/fire-service" },
    { title: "পুলিশ ও থানা", icon: "🚓", link: "/sheba/police" },
    { title: "লঞ্চ ও ট্রেনের সময়সূচি", icon: "🚢", link: "/sheba/transport" },
    { title: "বিদ্যুৎ অফিস", icon: "⚡", link: "/sheba/electricity" },
    { title: "পৌরসভা ও ডিসি অফিস", icon: "🏢", link: "/sheba/municipality" },
    { title: "পাসপোর্ট অফিস", icon: "🛂", link: "/sheba/passport" },
    { title: "আইনজীবী ও লিগ্যাল এইড", icon: "⚖️", link: "/sheba/legal-aid" },
    { title: "সাংবাদিক ও প্রেস ক্লাব", icon: "📰", link: "/sheba/press-club" },
    { title: "ভোক্তা অধিকার", icon: "🛡️", link: "/sheba/consumer-rights" },
    { title: "কুরিয়ার সার্ভিস", icon: "📦", link: "/sheba/courier" },
    { title: "শিক্ষা প্রতিষ্ঠান", icon: "🎓", link: "/sheba/education" },
    { title: "হোটেল ও রেস্টুরেন্ট", icon: "🏨", link: "/sheba/hotel" },
    { title: "রেন্ট-এ-কার", icon: "🚗", link: "/sheba/rent-a-car" },
    { title: "অনুদান (Donation)", icon: "🤝", link: "/donation" }, // ডোনেশন পেজ যুক্ত করা হলো
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

      {/* Button Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {services.map((service, index) => (
          <Link href={service.link} key={index}>
            <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-[#116cb4] transition-all cursor-pointer group h-[150px] md:h-[160px]">
              
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform block">
                {service.icon}
              </span>
              
              <h2 className="text-[16px] md:text-[17px] font-bold text-gray-800 group-hover:text-[#116cb4] transition-colors leading-tight">
                {service.title}
              </h2>
              
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}