import Link from "next/link";

export const metadata = {
  title: "চাঁদপুর জেলা তথ্য | চাঁদপুর নাগরিক",
  description: "চাঁদপুর জেলার ইতিহাস, আয়তন, উপজেলা, দর্শনীয় স্থান এবং বিস্তারিত তথ্য এক নজরে।",
};

export default function ZillaInfoPage() {
  // চাঁদপুরের এক নজরে ডেটা
  const quickFacts = [
    { label: "প্রতিষ্ঠা সাল", value: "১৫ ফেব্রুয়ারি ১৯৮৪", icon: "📅" },
    { label: "আয়তন", value: "১,৭০৪.০৬ বর্গ কি.মি.", icon: "🗺️" },
    { label: "উপজেলা", value: "৮ টি", icon: "🏢" },
    { label: "পৌরসভা", value: "৮ টি", icon: "🏙️" },
    { label: "ইউনিয়ন", value: "৮৯ টি", icon: "🏘️" },
    { label: "গ্রাম", value: "১,২৩৬ টি", icon: "🏡" },
    { label: "জনসংখ্যা", value: "প্রায় ২৬ লাখ", icon: "👥" },
    { label: "প্রধান নদী", value: "মেঘনা, ডাকাতিয়া, ধনাগোদা", icon: "🌊" },
  ];

  // উপজেলাসমূহের লিস্ট
  const upazilas = [
    "চাঁদপুর সদর", "হাজীগঞ্জ", "কচুয়া", "ফরিদগঞ্জ", 
    "মতলব উত্তর", "মতলব দক্ষিণ", "হাইমচর", "শাহরাস্তি"
  ];

  // দর্শনীয় স্থানের লিস্ট
  const touristSpots = [
    { name: "বড় স্টেশন মোলহেড", desc: "মেঘনা, ডাকাতিয়া ও ধনাগোদা নদীর মোহনা, যা চাঁদপুরের সবচেয়ে জনপ্রিয় পর্যটন কেন্দ্র।" },
    { name: "হাজীগঞ্জ ঐতিহাসিক বড় মসজিদ", desc: "উপমহাদেশের অন্যতম বৃহৎ এবং সুন্দর স্থাপত্যশৈলীর প্রাচীন মসজিদ।" },
    { name: "রূপসা জমিদার বাড়ি", desc: "ফরিদগঞ্জ উপজেলায় অবস্থিত প্রাচীন ও ঐতিহাসিক জমিদার বাড়ি।" },
    { name: "সাহেবগঞ্জ নীলকুঠি", desc: "ফরিদগঞ্জে অবস্থিত ব্রিটিশ আমলের ঐতিহাসিক নীলকুঠি।" },
    { name: "রক্তধারা স্মৃতিসৌধ", desc: "মুক্তিযুদ্ধের স্মৃতি বিজড়িত মোলহেডে অবস্থিত শহীদ স্মৃতিসৌধ।" },
    { name: "বলাখাল জমিদার বাড়ি", desc: "হাজীগঞ্জ উপজেলায় অবস্থিত ইতিহাস বিজড়িত প্রাচীন জমিদার বাড়ি।" },
  ];

  return (
    <main className="bg-gray-50 min-h-screen pb-16 font-[Kalpurush]">
      
      {/* ======================================================= */}
      {/* হিরো সেকশন */}
      {/* ======================================================= */}
      <section className="bg-[#116cb4] text-white py-12 md:py-16 px-4 relative overflow-hidden">
        {/* ব্যাকগ্রাউন্ড জলছাপ (ঐচ্ছিক ডিজাইনের জন্য) */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <svg className="w-64 h-64 md:w-96 md:h-96" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l7.5 13.5h-15L12 6.5z"/></svg>
        </div>

        <div className="max-w-screen-xl mx-auto relative z-10">
          <Link href="/sheba" className="inline-flex items-center text-blue-100 hover:text-white transition-colors mb-6 font-bold text-sm bg-black/20 px-3 py-1.5 rounded-full w-max">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            নাগরিক সেবায় ফিরে যান
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            চাঁদপুর জেলা <span className="text-yellow-300">তথ্য বাতায়ন</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl leading-relaxed">
            "ইলিশের বাড়ি" খ্যাত রূপালী নদী মেঘনা ও ডাকাতিয়ার তীরবর্তী এক মনোরম ও ঐতিহ্যবাহী জেলা চাঁদপুর। শিক্ষা, সাহিত্য, ও বাণিজ্যে চাঁদপুরের রয়েছে এক গৌরবোজ্জ্বল ইতিহাস।
          </p>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 -mt-8 relative z-20">
        
        {/* ======================================================= */}
        {/* এক নজরে চাঁদপুর (Grid Stats) */}
        {/* ======================================================= */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 mb-10">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <span className="text-2xl">📊</span>
            <h2 className="text-2xl font-bold text-gray-800">এক নজরে চাঁদপুর</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {quickFacts.map((fact, index) => (
              <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center hover:border-blue-300 hover:shadow-sm transition-all">
                <span className="text-3xl mb-2">{fact.icon}</span>
                <span className="text-sm text-gray-500 font-bold mb-1">{fact.label}</span>
                <span className="text-[16px] font-bold text-gray-900">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* ======================================================= */}
          {/* ইতিহাস ও পরিচিতি (বাম দিক - ২ কলাম) */}
          {/* ======================================================= */}
          <div className="md:col-span-2 space-y-8">
            
            {/* পরিচিতি বক্স */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📖</span>
                <h2 className="text-2xl font-bold text-gray-800">সংক্ষিপ্ত ইতিহাস ও পরিচিতি</h2>
              </div>
              <p className="text-gray-700 text-[17px] leading-relaxed text-justify">
                ১৭৭৯ সালে ব্রিটিশ শাসনামলে ত্রিপুরা জেলার অধীনে চাঁদপুর মহকুমা প্রতিষ্ঠিত হয়। পরবর্তীতে ১৯৮৪ সালের ১৫ ফেব্রুয়ারি এটি পূর্ণাঙ্গ জেলা হিসেবে আত্মপ্রকাশ করে। মেঘনা, ডাকাতিয়া, ধনাগোদা ও মতলব নদীর মোহনায় অবস্থিত এই জেলা প্রাচীনকাল থেকেই নৌ-বাণিজ্যের অন্যতম প্রধান কেন্দ্র। চাঁদপুরের ইলিশ মাছের সুখ্যাতি বিশ্বজোড়া, যার কারণে চাঁদপুরকে বাংলাদেশের <strong className="text-[#116cb4]">"ইলিশের বাড়ি"</strong> (City of Hilsha) হিসেবে ব্র্যান্ডিং করা হয়েছে।
              </p>
            </div>

            {/* দর্শনীয় স্থান */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📸</span>
                <h2 className="text-2xl font-bold text-gray-800">উল্লেখযোগ্য দর্শনীয় স্থান</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {touristSpots.map((spot, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="text-[17px] font-bold text-[#116cb4] mb-2">{spot.name}</h3>
                    <p className="text-gray-600 text-[15px] leading-relaxed">{spot.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ======================================================= */}
          {/* উপজেলাসমূহ (ডান দিক - ১ কলাম) */}
          {/* ======================================================= */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 sticky top-28">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <span className="text-2xl">📍</span>
                <h2 className="text-2xl font-bold text-gray-800">উপজেলাসমূহ ({upazilas.length})</h2>
              </div>
              <ul className="space-y-3">
                {upazilas.map((upazila, index) => (
                  <li key={index} className="flex items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-[#116cb4] hover:bg-blue-50 transition-colors group cursor-pointer">
                    <span className="w-7 h-7 bg-white text-[#116cb4] border border-blue-200 rounded-full flex items-center justify-center text-sm font-bold mr-3 group-hover:bg-[#116cb4] group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                    <span className="text-[17px] font-bold text-gray-800 group-hover:text-[#116cb4] transition-colors">
                      {upazila}
                    </span>
                  </li>
                ))}
              </ul>

              {/* ব্র্যান্ডিং ব্যানার */}
              <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-5 text-center text-white shadow-md">
                <div className="text-3xl mb-2">🐟</div>
                <h3 className="text-lg font-bold mb-1">ইলিশের বাড়ি চাঁদপুর</h3>
                <p className="text-sm text-gray-300 font-medium">রুপালি ইলিশের স্বাদ ও ঐতিহ্যের অপরূপ মেলবন্ধন।</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}