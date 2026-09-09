import Link from "next/link";

export const metadata = {
  title: "নাগরিক সেবা | চাঁদপুর নাগরিক",
  description: "চাঁদপুর জেলার প্রয়োজনীয় নাগরিক সেবা",
};

export default function ServicesPage() {
  const services = [
    {
      title: "জরুরি সেবা (৯৯৯)",
      icon: "🚨",
      link: "/sheba/emergency",
    },
    {
      title: "ব্লাড ব্যাংক",
      icon: "🩸",
      link: "/sheba/blood-bank",
    },
    {
      title: "জেলা তথ্য",
      icon: "🗺️",
      link: "/sheba/zilla-info",
    },
    {
      title: "হাসপাতাল ও ক্লিনিক",
      icon: "🏥",
      link: "/sheba/hospital",
    },
    {
      title: "অ্যাম্বুলেন্স",
      icon: "🚑",
      link: "/sheba/ambulance",
    },
    {
      title: "ফায়ার সার্ভিস",
      icon: "🚒",
      link: "/sheba/fire-service",
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
    {
      title: "অনুদান",
      icon: "🤝",
      link: "/donation",
    },
  ];

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-12 font-[Kalpurush] min-h-[60vh]">

      <div className="text-center mb-12 border-b border-gray-200 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          নাগরিক সেবা
        </h1>

        <p className="text-gray-600 text-[17px]">
          চাঁদপুরের মানুষের প্রয়োজনীয় নাগরিক সেবাগুলো এক জায়গায়।
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {services.map((service) => (
          <Link href={service.link} key={service.link}>
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